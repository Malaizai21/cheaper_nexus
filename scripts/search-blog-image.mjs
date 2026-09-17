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
import { writeFileSync, mkdirSync, readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

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
const loadRegistry = () => (existsSync(REGISTRY) ? JSON.parse(readFileSync(REGISTRY, 'utf-8')) : {});
const existingHashes = () => new Set(
  existsSync(IMG_DIR)
    ? readdirSync(IMG_DIR).filter(f => f.endsWith('.jpg')).map(f => md5(readFileSync(join(IMG_DIR, f))))
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

    // Same photo under a different resource id still counts as a repeat.
    if (hashes.has(md5(buf))) {
      console.error(`[magnific] ${r.id} is identical to an existing cover, trying next`);
      registry[String(r.id)] = registry[String(r.id)] || '(duplicate content)';
      continue;
    }

    mkdirSync(IMG_DIR, { recursive: true });
    writeFileSync(ownPath, buf);
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
