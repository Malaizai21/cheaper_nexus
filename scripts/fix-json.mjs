import fs from 'fs';

const file = 'public/blog/xiaohongshu-qiye-yingxiao-wanzheng-zhinan-malaixiya.json';
const raw = fs.readFileSync(file, 'utf-8');

// Find the content field value start (after the opening quote)
const marker = '"content": "';
const start = raw.indexOf(marker) + marker.length;

// Walk through the string, collecting chars, escaping bare quotes
let content = '';
let i = start;
while (i < raw.length) {
  const ch = raw[i];
  const prev = i > 0 ? raw[i - 1] : '';
  if (ch === '"' && prev !== '\\') {
    // End of the JSON string value
    break;
  }
  // If we see a backslash followed by a non-special char, handle it
  content += ch;
  i++;
}

// content is the raw escaped string value from JSON
// Convert JSON escape sequences back to real chars, re-encode properly
let decoded;
try {
  // Wrap in quotes to parse as JSON string
  decoded = JSON.parse('"' + content + '"');
} catch (e) {
  // If that fails, manually fix: the problem is bare " chars in the string
  // Replace bare " (not preceded by \) with \"
  let fixed = '';
  for (let j = 0; j < content.length; j++) {
    if (content[j] === '"' && (j === 0 || content[j-1] !== '\\')) {
      fixed += '\\"';
    } else {
      fixed += content[j];
    }
  }
  console.log('Applied manual fix');
  decoded = JSON.parse('"' + fixed + '"');
}

console.log('Decoded content length:', decoded.length);

// Now rebuild the whole article object
// Extract other fields by parsing around the broken content
const before = raw.substring(0, start - 1); // up to the opening "
const after = raw.substring(i + 1); // after the closing "

// Reconstruct: before + JSON.stringify(decoded) + after
const reencoded = JSON.stringify(decoded);
const newRaw = before + reencoded + after;

// Validate
try {
  const parsed = JSON.parse(newRaw);
  console.log('Valid JSON, title:', parsed.title);
  fs.writeFileSync(file, JSON.stringify(parsed, null, 2));
  console.log('Fixed and saved.');
} catch (e) {
  console.error('Still invalid:', e.message);
  // Save raw attempt for inspection
  fs.writeFileSync(file + '.attempt', newRaw);
}
