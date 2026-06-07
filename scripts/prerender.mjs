/**
 * Build-time prerender: generates dist/blog/<slug>/index.html for each article.
 * Each file is the Vite-built index.html with article-specific <head> meta injected,
 * so Googlebot sees title, description, og:tags, and JSON-LD without executing JS.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(new URL('.', import.meta.url).pathname, '..');
const DIST = join(ROOT, 'dist');
const PUBLIC_BLOG = join(ROOT, 'public', 'blog');
const SITE_URL = 'https://cheapernexus.com';

const articlesRaw = readFileSync(join(PUBLIC_BLOG, 'articles.json'), 'utf-8');
const articles = JSON.parse(articlesRaw);

const baseHtml = readFileSync(join(DIST, 'index.html'), 'utf-8');

let count = 0;

for (const meta of articles) {
  const { slug, title, meta_description, keywords: kwRaw, language, image_url, created_at, word_count } = meta;

  // Read full article to get content for text preview
  const articlePath = join(PUBLIC_BLOG, `${slug}.json`);
  if (!existsSync(articlePath)) {
    console.warn(`[prerender] missing ${slug}.json — skipping`);
    continue;
  }

  const article = JSON.parse(readFileSync(articlePath, 'utf-8'));
  const keywords = Array.isArray(article.keywords) ? article.keywords : JSON.parse(article.keywords || '[]');
  const canonicalUrl = `${SITE_URL}/blog/${slug}`;
  const langAttr = language === 'zh' ? 'zh-MY' : language === 'ms' ? 'ms-MY' : 'en-MY';
  const imgUrl = image_url || `${SITE_URL}/logo.png`;

  const articleSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: meta_description,
    image: imgUrl,
    datePublished: created_at,
    dateModified: created_at,
    author: { '@type': 'Organization', name: 'Cheaper Nexus', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Cheaper Nexus',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    url: canonicalUrl,
    inLanguage: langAttr,
    keywords: keywords.join(', '),
    wordCount: word_count,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  });

  const injectedMeta = `
    <title>${escHtml(title)} | Cheaper Nexus</title>
    <meta name="description" content="${escAttr(meta_description)}" />
    <meta name="keywords" content="${escAttr(keywords.join(', '))}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escAttr(title)}" />
    <meta property="og:description" content="${escAttr(meta_description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="Cheaper Nexus" />
    <meta property="og:image" content="${escAttr(imgUrl)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escAttr(title)}" />
    <meta name="twitter:description" content="${escAttr(meta_description)}" />
    <meta name="twitter:image" content="${escAttr(imgUrl)}" />
    <script type="application/ld+json">${articleSchema}</script>`.trimStart();

  // Build the final HTML:
  // 1. Remove fallback title and duplicate meta from the SPA shell
  // 2. Fix asset paths: ./assets/ -> /assets/ (file is at /blog/<slug>/index.html)
  // 3. Inject article-specific meta before </head>
  // 4. Set correct lang attribute
  let html = baseHtml
    .replace(/<title>[^<]*<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/g, '')
    .replace(/<meta property="og:[^>]*>/g, '')
    .replace(/<meta name="twitter:[^>]*>/g, '')
    .replace(/<link rel="canonical"[^>]*>/g, '')
    .replace(/<link rel="alternate"[^>]*>/g, '')
    .replace(/src="\.\/assets\//g, 'src="/assets/')
    .replace(/href="\.\/assets\//g, 'href="/assets/')
    .replace('</head>', `${injectedMeta}\n  </head>`)
    .replace('<html lang="zh-MY">', `<html lang="${langAttr}">`);

  const outDir = join(DIST, 'blog', slug);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html, 'utf-8');
  count++;
}

console.log(`[prerender] ✅ Generated ${count} article pages in dist/blog/`);

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
