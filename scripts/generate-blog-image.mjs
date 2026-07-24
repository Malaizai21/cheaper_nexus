/**
 * Generate a blog cover image via Magnific's Mystic text-to-image API.
 *
 * Usage: node scripts/generate-blog-image.mjs "<prompt>" "<slug>"
 *
 * On success: prints the local path (e.g. /blog/images/<slug>.jpg) to stdout
 * and exits 0 — the image has already been downloaded into public/blog/images/.
 * On failure or timeout: prints nothing to stdout (diagnostics go to stderr)
 * and exits 1 — the caller should fall back to a stock photo.
 */
import 'dotenv/config';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const API_KEY = process.env.MAGNIFIC_API_KEY;
const BASE = 'https://api.magnific.com/v1/ai/mystic';
const POLL_INTERVAL_MS = 3000;
const MAX_WAIT_MS = 90000;

const [, , prompt, slug] = process.argv;

if (!prompt || !slug) {
  console.error('Usage: node generate-blog-image.mjs "<prompt>" "<slug>"');
  process.exit(1);
}
if (!API_KEY) {
  console.error('[magnific] MAGNIFIC_API_KEY not set in .env');
  process.exit(1);
}

async function main() {
  const createRes = await fetch(BASE, {
    method: 'POST',
    headers: { 'x-magnific-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      resolution: '2k',
      aspect_ratio: 'widescreen_16_9',
      model: 'realism',
      filter_nsfw: true,
    }),
  });
  if (!createRes.ok) {
    console.error(`[magnific] create task failed: HTTP ${createRes.status} ${await createRes.text()}`);
    process.exit(1);
  }
  const created = await createRes.json();
  const taskId = created?.data?.task_id;
  if (!taskId) {
    console.error('[magnific] no task_id in response: ' + JSON.stringify(created));
    process.exit(1);
  }

  const deadline = Date.now() + MAX_WAIT_MS;
  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));

    const pollRes = await fetch(`${BASE}/${taskId}`, {
      headers: { 'x-magnific-api-key': API_KEY },
    });
    if (!pollRes.ok) continue; // transient error — keep polling until deadline

    const poll = await pollRes.json();
    const status = poll?.data?.status;

    if (status === 'COMPLETED') {
      const imgUrl = poll.data.generated?.[0];
      if (!imgUrl) {
        console.error('[magnific] COMPLETED but no generated image URL');
        process.exit(1);
      }
      const imgRes = await fetch(imgUrl);
      if (!imgRes.ok) {
        console.error(`[magnific] failed to download generated image: HTTP ${imgRes.status}`);
        process.exit(1);
      }
      const buf = Buffer.from(await imgRes.arrayBuffer());
      const outDir = join(ROOT, 'public', 'blog', 'images');
      mkdirSync(outDir, { recursive: true });
      const outPath = join(outDir, `${slug}.jpg`);
      writeFileSync(outPath, buf);
      console.log(`/blog/images/${slug}.jpg`);
      process.exit(0);
    }

    if (status === 'FAILED') {
      console.error('[magnific] generation task FAILED');
      process.exit(1);
    }
    // CREATED / IN_PROGRESS — keep polling
  }

  console.error('[magnific] timed out waiting for image generation');
  process.exit(1);
}

main().catch(e => {
  console.error('[magnific] error: ' + e.message);
  process.exit(1);
});
