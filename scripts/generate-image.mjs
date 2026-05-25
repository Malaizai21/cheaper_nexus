/**
 * Generate a featured image using Pollinations.ai (free, no API key needed).
 * Fallback: Gemini if GEMINI_IMAGE_ENABLED=true and billing is active.
 * Usage: node scripts/generate-image.mjs <slug> "<image prompt>"
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function download(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'CheaperNexus-Blog/1.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(download(res.headers.location));
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function main() {
  const slug = process.argv[2];
  const prompt = process.argv[3];

  if (!slug || !prompt) {
    console.error('Usage: node generate-image.mjs <slug> "<prompt>"');
    process.exit(1);
  }

  console.log(`🎨 Generating image for: ${slug}`);

  const enhancedPrompt = `${prompt}, professional photography, digital marketing blog header, modern clean design, no text`;
  const seed = Math.floor(Math.random() * 999999);
  const encodedPrompt = encodeURIComponent(enhancedPrompt);

  console.log(`   Using Pollinations.ai (free)`);
  const models = ['flux', 'turbo', 'flux-realism'];
  let imageBuffer;
  for (const model of models) {
    try {
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&seed=${seed}&nologo=true&model=${model}`;
      console.log(`   Trying model: ${model}`);
      imageBuffer = await download(url);
      console.log(`   Model ${model} succeeded`);
      break;
    } catch (err) {
      console.log(`   Model ${model} failed: ${err.message}, trying next...`);
    }
  }
  if (!imageBuffer) throw new Error('All models failed');

  const imgDir = path.join(ROOT, 'public', 'blog', 'images');
  fs.mkdirSync(imgDir, { recursive: true });

  const filename = `${slug}.jpg`;
  fs.writeFileSync(path.join(imgDir, filename), imageBuffer);
  console.log(`✅ Saved: public/blog/images/${filename} (${Math.round(imageBuffer.length / 1024)}KB)`);

  // Patch article JSON with image_url
  const imageUrl = `/blog/images/${filename}`;
  const articlePath = path.join(ROOT, 'public', 'blog', `${slug}.json`);
  if (fs.existsSync(articlePath)) {
    const article = JSON.parse(fs.readFileSync(articlePath, 'utf-8'));
    article.image_url = imageUrl;
    fs.writeFileSync(articlePath, JSON.stringify(article, null, 2));

    const indexPath = path.join(ROOT, 'public', 'blog', 'articles.json');
    if (fs.existsSync(indexPath)) {
      const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
      const entry = index.find(a => a.slug === slug);
      if (entry) entry.image_url = imageUrl;
      fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
    }
    console.log(`✅ article JSON updated with image_url`);
  }
}

main().catch(err => { console.error('Failed:', err.message); process.exit(1); });
