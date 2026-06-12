/**
 * Validates all blog JSON files before build.
 * Auto-fixes unescaped double quotes in content fields.
 * Exits with code 1 if any file cannot be fixed.
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(new URL('.', import.meta.url).pathname, '..');
const PUBLIC_BLOG = join(ROOT, 'public', 'blog');

const files = readdirSync(PUBLIC_BLOG).filter(f => f.endsWith('.json') && f !== 'articles.json');

let fixed = 0;
let failed = 0;

for (const file of files) {
  const filePath = join(PUBLIC_BLOG, file);
  const raw = readFileSync(filePath, 'utf-8');

  try {
    JSON.parse(raw);
    continue; // already valid
  } catch (_) {
    // Try to auto-fix unescaped double quotes in the content field
    const match = raw.match(/"content"\s*:\s*"/);
    if (!match) {
      console.error(`[validate] ❌ Cannot fix ${file} — no content field found`);
      failed++;
      continue;
    }

    const start = match.index + match[0].length;

    // Find where content ends by locating the next field after content
    const endMatch = raw.slice(start).match(/",\s*\n\s*"(?:writing_style|featured_image_prompt|internal_links|word_count|topic|status)"/);
    if (!endMatch) {
      console.error(`[validate] ❌ Cannot fix ${file} — cannot locate end of content field`);
      failed++;
      continue;
    }

    const end = start + endMatch.index;
    const rawContent = raw.slice(start, end);
    const escapedContent = rawContent.replace(/(?<!\\)"/g, '\\"');
    const newRaw = raw.slice(0, start) + escapedContent + raw.slice(end);

    try {
      const obj = JSON.parse(newRaw);
      writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf-8');
      console.log(`[validate] 🔧 Auto-fixed ${file}`);
      fixed++;
    } catch (e2) {
      console.error(`[validate] ❌ Cannot fix ${file} — ${e2.message}`);
      failed++;
    }
  }
}

if (fixed > 0) console.log(`[validate] Fixed ${fixed} file(s)`);
if (failed > 0) {
  console.error(`[validate] ${failed} file(s) could not be fixed — build aborted`);
  process.exit(1);
}
console.log(`[validate] ✅ All blog JSON files are valid`);
