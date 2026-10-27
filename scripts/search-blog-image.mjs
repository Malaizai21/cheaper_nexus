/**
 * Search Magnific's real (non-AI-generated) stock photo library and download
 * a freemium-licensed match for use as a blog cover image.
 *
 * Usage: node scripts/search-blog-image.mjs "<search term>" "<slug>"
 *
 * On success: prints the local path (e.g. /blog/images/<slug>.jpg) to stdout
 * and exits 0 — the image has already been downloaded into public/blog/images/.
 * On failure (no results, download error, no API key): prints nothing to
 * stdout (diagnostics go to stderr) and exits 1 — the caller should fall
 * back to the Unsplash stock photo pool.
 *
 * Only freemium-licensed resources are used (never premium) so this never
 * consumes paid download quota.
 */
import 'dotenv/config';
import { writeFileSync, mkdirSync, readFileSync, readdirSync, existsSync, statSync, unlinkSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import { spawnSync } from 'child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const API_KEY = process.env.MAGNIFIC_API_KEY;
const BASE = 'https://api.magnific.com/v1/resources';
const IMG_DIR = join(ROOT, 'public', 'blog', 'images');

/**
 * Dedup. Always taking the most-downloaded result meant related search terms
 * kept landing on the same photo, saved under different slugs — so comparing
 * image_url never caught it. Two guards now: a registry of Magnific resource
 * ids already used, and a content hash of every existing cover, which also
 * covers images downloaded before the registry existed.
 */
const REGISTRY = join(IMG_DIR, 'used-resources.json');
const md5 = buf => createHash('md5').update(buf).digest('hex');

/**
 * Downscale a cover to web size.
 *
 * Magnific hands back the print master. Writing that straight to disk gave us
 * 6000-7600px covers of 15-25MB each — 772MB across 81 posts, with a 17MB
 * image loading on the homepage. Nothing displays them above 1600px.
 *
 * Best effort: if ffmpeg is missing the full-size file is kept rather than
 * failing the download, but the warning says what it will cost.
 */
const MAX_WIDTH = 1600;

function shrink(path) {
  const before = statSync(path).size;
  const tmp = `${path}.tmp.jpg`;
  const r = spawnSync('ffmpeg', [
    '-v', 'error', '-i', path,
    '-vf', `scale='min(${MAX_WIDTH},iw)':-2:flags=lanczos`,
    '-pix_fmt', 'yuvj420p', '-q:v', '4', '-y', tmp,
  ], { encoding: 'utf-8' });

  if (r.error || r.status !== 0) {
    if (existsSync(tmp)) unlinkSync(tmp);
    console.error(
      `[magnific] could not downscale (${r.error ? 'ffmpeg not found' : r.stderr.trim()}); `
      + `keeping the ${(before / 1048576).toFixed(1)}MB original`,
    );
    return;
  }

  // A photo that is already web-sized can come back bigger after re-encoding.
  const after = statSync(tmp).size;
  if (after < before) {
    writeFileSync(path, readFileSync(tmp));
    console.error(`[magnific] cover ${(before / 1048576).toFixed(1)}MB -> ${Math.round(after / 1024)}KB`);
  }
  unlinkSync(tmp);
}
const loadRegistry = () => (existsSync(REGISTRY) ? JSON.parse(readFileSync(REGISTRY, 'utf-8')) : {});
const existingHashes = () => new Set(
  existsSync(IMG_DIR)
    // A crashed run can leave a `.<slug>.staging.jpg` behind; it is not a cover.
    ? readdirSync(IMG_DIR).filter(f => f.endsWith('.jpg') && !f.startsWith('.'))
        .map(f => md5(readFileSync(join(IMG_DIR, f))))
    : [],
);

const [, , term, slug] = process.argv;

if (!term || !slug) {
  console.error('Usage: node search-blog-image.mjs "<search term>" "<slug>"');
  process.exit(1);
}
if (!API_KEY) {
  console.error('[magnific] MAGNIFIC_API_KEY not set in .env');
  process.exit(1);
}

async function main() {
  const headers = { 'x-magnific-api-key': API_KEY };
  const registry = loadRegistry();
  const usedIds = new Set(Object.keys(registry).filter(id => registry[id] !== slug));
  const hashes = existingHashes();

  // Re-running for the same slug should not count its own old file as a clash.
  const ownPath = join(IMG_DIR, `${slug}.jpg`);
  if (existsSync(ownPath)) hashes.delete(md5(readFileSync(ownPath)));

  const candidates = [];
  for (let page = 1; page <= 3 && candidates.length < 30; page++) {
    const searchUrl = `${BASE}?term=${encodeURIComponent(term)}&limit=30&page=${page}`
      + `&filters%5Blicense%5D%5Bfreemium%5D=1`
      + `&filters%5Bcontent_type%5D%5Bphoto%5D=1`
      + `&filters%5Borientation%5D%5Bhorizontal%5D=1`;
    const res = await fetch(searchUrl, { headers });
    if (!res.ok) {
      if (page === 1) {
        console.error(`[magnific] search failed: HTTP ${res.status} ${await res.text()}`);
        process.exit(1);
      }
      break;
    }
    const data = ((await res.json()).data || []).filter(r => r.licenses?.[0]?.type === 'freemium');
    if (!data.length) break;
    candidates.push(...data);
  }

  // Quality order is still downloads, but anything already used is skipped.
  const fresh = candidates
    .filter(r => !usedIds.has(String(r.id)))
    .sort((a, b) => (b.stats?.downloads || 0) - (a.stats?.downloads || 0));

  if (!fresh.length) {
    console.error(`[magnific] no unused freemium results for term: ${term} (${candidates.length} seen, all used)`);
    process.exit(1);
  }

  for (const r of fresh.slice(0, 8)) {
    const dlRes = await fetch(`${BASE}/${r.id}/download`, { headers });
    if (!dlRes.ok) { console.error(`[magnific] download ${r.id}: HTTP ${dlRes.status}`); continue; }
    const fileUrl = (await dlRes.json())?.data?.url;
    if (!fileUrl) continue;

    const imgRes = await fetch(fileUrl);
    if (!imgRes.ok) continue;
    const buf = Buffer.from(await imgRes.arrayBuffer());

    // Downscale before hashing, not after. The hashes this compares against
    // are of files on disk, which are all downscaled — hashing the raw
    // download would never match one of them, and the guard would pass
    // everything while looking like it still worked.
    //
    // Staged through a temp file so a run where every candidate turns out to
    // be a repeat leaves the slug's existing cover untouched.
    mkdirSync(IMG_DIR, { recursive: true });
    const staged = join(IMG_DIR, `.${slug}.staging.jpg`);
    writeFileSync(staged, buf);
    shrink(staged);
    const stagedBuf = readFileSync(staged);
    unlinkSync(staged);

    // Same photo under a different resource id still counts as a repeat.
    if (hashes.has(md5(stagedBuf))) {
      console.error(`[magnific] ${r.id} is identical to an existing cover, trying next`);
      registry[String(r.id)] = registry[String(r.id)] || '(duplicate content)';
      continue;
    }

    writeFileSync(ownPath, stagedBuf);
    registry[String(r.id)] = slug;
    writeFileSync(REGISTRY, JSON.stringify(registry, null, 2), 'utf-8');
    console.log(`/blog/images/${slug}.jpg`);
    return;
  }

  writeFileSync(REGISTRY, JSON.stringify(registry, null, 2), 'utf-8');
  console.error(`[magnific] every candidate for "${term}" was a repeat or failed to download`);
  process.exit(1);
}

main().catch(e => {
  console.error('[magnific] error: ' + e.message);
  process.exit(1);
});
