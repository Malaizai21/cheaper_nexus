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
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const API_KEY = process.env.MAGNIFIC_API_KEY;
const BASE = 'https://api.magnific.com/v1/resources';

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
  const searchUrl = `${BASE}?term=${encodeURIComponent(term)}&limit=10`
    + `&filters%5Blicense%5D%5Bfreemium%5D=1`
    + `&filters%5Bcontent_type%5D%5Bphoto%5D=1`
    + `&filters%5Borientation%5D%5Bhorizontal%5D=1`;

  const searchRes = await fetch(searchUrl, { headers: { 'x-magnific-api-key': API_KEY } });
  if (!searchRes.ok) {
    console.error(`[magnific] search failed: HTTP ${searchRes.status} ${await searchRes.text()}`);
    process.exit(1);
  }
  const search = await searchRes.json();
  const results = (search.data || []).filter(r => r.licenses?.[0]?.type === 'freemium');
  if (results.length === 0) {
    console.error(`[magnific] no freemium results for term: ${term}`);
    process.exit(1);
  }

  // Pick the most-downloaded result as a simple quality signal.
  const best = results.sort((a, b) => (b.stats?.downloads || 0) - (a.stats?.downloads || 0))[0];

  const dlRes = await fetch(`${BASE}/${best.id}/download`, { headers: { 'x-magnific-api-key': API_KEY } });
  if (!dlRes.ok) {
    console.error(`[magnific] download request failed: HTTP ${dlRes.status} ${await dlRes.text()}`);
    process.exit(1);
  }
  const dl = await dlRes.json();
  const fileUrl = dl?.data?.url;
  if (!fileUrl) {
    console.error('[magnific] no download URL in response: ' + JSON.stringify(dl));
    process.exit(1);
  }

  const imgRes = await fetch(fileUrl);
  if (!imgRes.ok) {
    console.error(`[magnific] failed to fetch downloaded file: HTTP ${imgRes.status}`);
    process.exit(1);
  }
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const outDir = join(ROOT, 'public', 'blog', 'images');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `${slug}.jpg`);
  writeFileSync(outPath, buf);
  console.log(`/blog/images/${slug}.jpg`);
}

main().catch(e => {
  console.error('[magnific] error: ' + e.message);
  process.exit(1);
});
