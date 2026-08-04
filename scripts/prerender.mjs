/**
 * Build-time prerender for SEO + AEO/GEO.
 *
 * AI crawlers (GPTBot, ClaudeBot, PerplexityBot) do NOT execute JavaScript,
 * so every page must contain real HTML content and JSON-LD in the static file.
 *
 * Generates:
 *  1. dist/blog/<slug>/index.html — full article body + FAQ + BlogPosting/FAQPage schema
 *  2. dist/index.html             — LocalBusiness/FAQPage/WebSite schema + static content
 *  3. dist/{services,pricing,contact}/index.html — unique meta + static content
 *  4. dist/sitemap.xml            — auto-generated from articles.json (never stale)
 *  5. dist/llms.txt + dist/llms-full.txt — AI-readable site summary + full articles
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const PUBLIC_BLOG = join(ROOT, 'public', 'blog');
const SITE_URL = 'https://cheapernexus.com';

marked.setOptions({ gfm: true, breaks: true });

const articles = JSON.parse(readFileSync(join(PUBLIC_BLOG, 'articles.json'), 'utf-8'));
const baseHtml = readFileSync(join(DIST, 'index.html'), 'utf-8');

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/** Strip base-shell meta and fix asset paths for nested routes. */
function cleanShell(html, { nested = false } = {}) {
  let out = html
    .replace(/<title>[^<]*<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/g, '')
    .replace(/<meta property="og:[^>]*>/g, '')
    .replace(/<meta name="twitter:[^>]*>/g, '')
    .replace(/<link rel="canonical"[^>]*>/g, '')
    .replace(/<link rel="alternate"[^>]*>/g, '');
  if (nested) {
    out = out
      .replace(/src="\.\/assets\//g, 'src="/assets/')
      .replace(/href="\.\/assets\//g, 'href="/assets/');
  }
  return out;
}

/** Inject head meta + static body content into the shell. */
function buildPage(shell, { headMeta, bodyContent, langAttr }) {
  let html = shell
    .replace('</head>', `${headMeta}\n  </head>`)
    .replace(/<html lang="[^"]*">/, `<html lang="${langAttr}">`);
  if (bodyContent) {
    html = html.replace('<div id="root"></div>', `<div id="root">${bodyContent}</div>`);
  }
  return html;
}

// Shared static wrapper so no-JS content is readable (React replaces it on hydration)
const wrapStart = '<div style="max-width:760px;margin:0 auto;padding:32px 20px;font-family:system-ui,sans-serif;line-height:1.7;color:#0A192F">';
const wrapEnd = '</div>';

/** Same-language related articles ranked by keyword + topic overlap (mirrors Article.tsx). */
function pickRelated(current, all, n = 3) {
  const curKw = new Set((current.keywords || []).map(k => String(k).toLowerCase()));
  const curWords = new Set(
    `${current.topic || ''} ${current.title}`.toLowerCase().split(/\W+/).filter(w => w.length > 3),
  );
  return all
    .filter(a => a.slug !== current.slug && a.language === current.language)
    .map(a => {
      let s = 0;
      for (const k of (a.keywords || [])) if (curKw.has(String(k).toLowerCase())) s += 2;
      for (const w of `${a.topic || ''} ${a.title}`.toLowerCase().split(/\W+/)) {
        if (w.length > 3 && curWords.has(w)) s += 1;
      }
      return { s, a };
    })
    .sort((x, y) => y.s - x.s || new Date(y.a.created_at) - new Date(x.a.created_at))
    .slice(0, n)
    .map(x => x.a);
}

// ────────────────────────────── 1. Blog articles ──────────────────────────────

let count = 0;

for (const meta of articles) {
  const { slug, title, meta_description, language, image_url, created_at, word_count } = meta;

  const articlePath = join(PUBLIC_BLOG, `${slug}.json`);
  if (!existsSync(articlePath)) {
    console.warn(`[prerender] missing ${slug}.json — skipping`);
    continue;
  }

  let article;
  try {
    article = JSON.parse(readFileSync(articlePath, 'utf-8'));
  } catch {
    console.warn(`[prerender] invalid JSON in ${slug}.json — skipping`);
    continue;
  }

  const keywords = Array.isArray(article.keywords) ? article.keywords : JSON.parse(article.keywords || '[]');
  const canonicalUrl = `${SITE_URL}/blog/${slug}`;
  const langAttr = language === 'zh' ? 'zh-MY' : language === 'ms' ? 'ms-MY' : 'en-MY';
  const imgUrl = image_url
    ? (image_url.startsWith('http') ? image_url : `${SITE_URL}${image_url}`)
    : `${SITE_URL}/logo.png`;
  const faq = Array.isArray(article.faq) ? article.faq : [];

  const schemas = [
    {
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
    },
  ];

  if (faq.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    });
  }

  const headMeta = `
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
    <meta property="article:published_time" content="${escAttr(created_at)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escAttr(title)}" />
    <meta name="twitter:description" content="${escAttr(meta_description)}" />
    <meta name="twitter:image" content="${escAttr(imgUrl)}" />
${schemas.map(s => `    <script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}`.trimStart();

  // Full article body as static HTML — this is what AI crawlers read
  const contentHtml = marked.parse(article.content || '');
  const faqHtml = faq.length > 0
    ? `<section><h2>${language === 'zh' ? '常见问题' : language === 'ms' ? 'Soalan Lazim' : 'Frequently Asked Questions'}</h2>${
        faq.map(({ q, a }) => `<h3>${escHtml(q)}</h3><p>${escHtml(a)}</p>`).join('')
      }</section>`
    : '';

  // Static internal links — the crawler-visible related-articles block
  const related = pickRelated({ slug, title, topic: meta.topic, keywords, language }, articles);
  const relatedHtml = related.length > 0
    ? `<section><h2>${language === 'zh' ? '相关文章' : language === 'ms' ? 'Artikel Berkaitan' : 'Related Articles'}</h2><ul>${
        related.map(r => `<li><a href="/blog/${r.slug}">${escHtml(r.title)}</a></li>`).join('')
      }</ul></section>`
    : '';

  const bodyContent = `${wrapStart}<article><h1>${escHtml(title)}</h1><p><em>${escHtml(meta_description)}</em></p>${contentHtml}${faqHtml}${relatedHtml}</article>${wrapEnd}`;

  const html = buildPage(cleanShell(baseHtml, { nested: true }), { headMeta, bodyContent, langAttr });

  const outDir = join(DIST, 'blog', slug);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html, 'utf-8');
  count++;
}

console.log(`[prerender] ✅ ${count} article pages`);

// ────────────────────── 2. Homepage schemas + static content ──────────────────────

const bizSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  name: 'Cheaper Nexus',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/logo.png`,
  telephone: '+60172915754',
  description:
    'All-in-one digital marketing agency in Malaysia offering UGC video production, Meta ads & content management, Xiaohongshu KOC seeding, Google SEO, and e-commerce solutions for SMEs. Pricing from RM500 with no hidden fees.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kuala Lumpur',
    addressRegion: 'Kuala Lumpur',
    addressCountry: 'MY',
  },
  priceRange: 'RM500 - RM15000+',
  areaServed: { '@type': 'Country', name: 'Malaysia' },
  availableLanguage: ['Chinese', 'English', 'Malay'],
  sameAs: [
    'https://www.facebook.com/share/18oQi47T7w/',
    'https://www.instagram.com/cheapernexus',
  ],
  contactPoint: [
    { '@type': 'ContactPoint', telephone: '+60172915754', contactType: 'sales', name: 'Henry', contactOption: 'WhatsApp', areaServed: 'MY', availableLanguage: ['Chinese', 'English', 'Malay'] },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Digital Marketing Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'UGC Short-Video Production' }, price: '500', priceCurrency: 'MYR', description: 'Native-style short-video production for TikTok & Xiaohongshu — filming, editing, and scriptwriting included, priced per video.' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Meta Ads & Content Management' }, price: '2000', priceCurrency: 'MYR', description: 'Combined Facebook and Instagram post copywriting and ads management with audience targeting and creative optimisation.' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Xiaohongshu KOC Seeding' }, price: '4500', priceCurrency: 'MYR', description: 'Organic KOC seeding campaign on Xiaohongshu — 10 seeded posts to reach Chinese-speaking consumers in Malaysia.' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Google Ads & SEO Marketing' }, price: '1888', priceCurrency: 'MYR', description: 'Google keyword advertising and long-term organic SEO growth.' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'E-Commerce & Web Solutions' }, price: '1888', priceCurrency: 'MYR', description: 'Shopee, Lazada, TikTok shop onboarding and corporate website design.' },
    ],
  },
};

const homeFaq = [
  { q: 'What is Cheaper Nexus?', a: 'Cheaper Nexus is a Malaysia-based all-in-one digital marketing agency offering UGC video production, Meta ads & content management, Xiaohongshu KOC seeding, Google SEO, and e-commerce solutions for SMEs. Services start from RM500 with transparent pricing and no hidden fees.' },
  { q: 'What digital marketing services does Cheaper Nexus offer in Malaysia?', a: 'Cheaper Nexus offers five core services: (1) UGC short-video production (filming, editing, scriptwriting) for TikTok and Xiaohongshu, (2) combined Meta post copywriting and ads management for Facebook and Instagram, (3) Xiaohongshu KOC seeding, (4) Google Ads and SEO optimisation, and (5) e-commerce management on Shopee, Lazada, and TikTok Shop.' },
  { q: 'How much does digital marketing cost in Malaysia?', a: 'Cheaper Nexus digital marketing packages start from RM500 per UGC video. Combined Meta content and ads management is RM2,000/month. Xiaohongshu KOC seeding starts from RM4,500 for 10 posts. Google Ads and SEO management start from RM1,200/month. All pricing is transparent with no hidden fees.' },
  { q: '马来西亚数码营销费用是多少？', a: 'Cheaper Nexus 的数码营销服务价格从 RM500/支（UGC短视频）起。Meta 内容与广告管理为 RM2,000/月，小红书 KOC 种草从 RM4,500/10篇起，Google 广告管理从 RM1,200/月起，全透明定价，无隐藏费用。' },
  { q: 'Does Cheaper Nexus work with small businesses and SMEs?', a: 'Yes. Cheaper Nexus specialises in helping Malaysian SMEs and small businesses grow online. The agency offers flexible, affordable packages starting from RM500, with direct WhatsApp access to the team and a free 30-minute strategy consultation.' },
  { q: 'How do I contact Cheaper Nexus?', a: 'You can contact Cheaper Nexus directly via WhatsApp at +60172915754 (Henry). A free 30-minute strategy consultation is available with no commitment required.' },
];

const homeFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: homeFaq.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Cheaper Nexus',
  url: SITE_URL,
};

const servicesList = [
  ['UGC Short-Video Production (RM500 / video)', 'Native-style short videos for TikTok & Xiaohongshu — filming, editing, and scriptwriting included.'],
  ['Meta Ads & Content Management (RM2,000/month)', 'Combined Facebook & Instagram post copywriting and ads management with audience targeting and creative optimisation.'],
  ['Xiaohongshu KOC Seeding (from RM4,500 / 10 posts)', 'Organic KOC seeding campaigns to reach Chinese-speaking consumers in Malaysia.'],
  ['Google Ads & SEO (from RM1,200/month)', 'Google keyword advertising plus long-term organic search growth for Malaysian keywords.'],
  ['E-Commerce & Live Streaming (from RM1,888)', 'Shopee, Lazada and TikTok Shop onboarding, 360° store management and professional live commerce.'],
];

const homeBody = `${wrapStart}
<h1>Cheaper Nexus — 马来西亚数码营销公司 | Digital Marketing Agency Malaysia</h1>
<p>Cheaper Nexus 是一家马来西亚数码营销公司，同时也是专注搜索排名优化的马来西亚SEO公司，总部位于吉隆坡。Cheaper Nexus is an all-in-one digital marketing agency and SEO company in Kuala Lumpur, Malaysia, helping Malaysian SMEs grow across TikTok, Xiaohongshu (小红书), Facebook, Instagram, Google and e-commerce platforms. Transparent pricing from RM500, no hidden fees. 我们帮马来西亚中小企业一站式攻占全平台：从 TikTok 到小红书，从 Meta 广告到 Google SEO。</p>
<h2>Our Services 服务项目</h2>
<ul>${servicesList.map(([name, desc]) => `<li><strong>${name}</strong> — ${desc}</li>`).join('')}</ul>
<h2>Why Choose Cheaper Nexus 为什么选择我们</h2>
<ul>
<li>Transparent pricing, no hidden fees 价格透明，无隐藏费用</li>
<li>Result-driven: real sales growth, not vanity metrics 效果导向，关注真实转化</li>
<li>Cross-platform integrated strategy 全平台整合策略</li>
<li>1-hour response via WhatsApp 1小时内响应，专属对接</li>
</ul>
<h2>Frequently Asked Questions 常见问题</h2>
${homeFaq.map(({ q, a }) => `<h3>${escHtml(q)}</h3><p>${escHtml(a)}</p>`).join('')}
<h2>Contact 联系我们</h2>
<p>WhatsApp Henry: +60 17-291 5754 · Kuala Lumpur, Malaysia</p>
<p><a href="/services">Services 服务项目</a> · <a href="/pricing">Pricing 价格方案</a> · <a href="/blog">Marketing Blog 营销博客</a> · <a href="/contact">Contact 联系我们</a></p>
${wrapEnd}`;

const homeHeadMeta = `
    <title>Cheaper Nexus | 马来西亚数码营销公司 · SEO优化专家 · Digital Marketing Agency Malaysia</title>
    <meta name="description" content="Cheaper Nexus 是马来西亚数码营销公司，专精 SEO优化、UGC短视频制作、Meta广告与内容管理、小红书KOC种草、电商解决方案。价格从 RM500 起，全透明无隐藏收费，值得信赖的马来西亚SEO公司。" />
    <link rel="canonical" href="${SITE_URL}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Cheaper Nexus | 马来西亚数码营销公司" />
    <meta property="og:description" content="马来西亚数码营销公司，价格从 RM500 起，全透明无隐藏收费。" />
    <meta property="og:url" content="${SITE_URL}" />
    <meta property="og:site_name" content="Cheaper Nexus" />
    <meta property="og:image" content="${SITE_URL}/logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Cheaper Nexus | 马来西亚数码营销公司" />
    <meta name="twitter:description" content="马来西亚数码营销公司，价格从 RM500 起。" />
    <link rel="alternate" hrefLang="zh-MY" href="${SITE_URL}" />
    <link rel="alternate" hrefLang="en-MY" href="${SITE_URL}" />
    <link rel="alternate" hrefLang="ms-MY" href="${SITE_URL}" />
    <link rel="alternate" hrefLang="x-default" href="${SITE_URL}" />
    <script type="application/ld+json">${JSON.stringify(bizSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(homeFaqSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>`.trimStart();

writeFileSync(
  join(DIST, 'index.html'),
  buildPage(cleanShell(baseHtml), { headMeta: homeHeadMeta, bodyContent: homeBody, langAttr: 'zh-MY' }),
  'utf-8',
);
console.log('[prerender] ✅ homepage (schemas + static content)');

// ──────────────────── 3. Services / Pricing / Contact pages ────────────────────

const staticPages = [
  {
    path: 'services',
    title: 'Services 服务项目 | Cheaper Nexus — Digital Marketing Malaysia',
    description: 'Digital marketing services Malaysia: UGC video from RM500, Meta ads & content management RM2,000/month, Xiaohongshu KOC seeding, Google SEO & e-commerce solutions for Malaysian SMEs.',
    body: `<h1>Digital Marketing Services Malaysia 服务项目</h1>
<p>Cheaper Nexus offers five core digital marketing services for Malaysian SMEs. 我们为马来西亚中小企业提供五大核心服务。</p>
<ul>${servicesList.map(([name, desc]) => `<li><strong>${name}</strong> — ${desc}</li>`).join('')}</ul>
<p>WhatsApp us for a free 30-minute consultation: Henry +60 17-291 5754.</p>`,
  },
  {
    path: 'pricing',
    title: 'Pricing 价格方案 | Cheaper Nexus — From RM500, No Hidden Fees',
    description: 'Transparent digital marketing pricing Malaysia: UGC video from RM500, Meta ads & content management RM2,000/month, Xiaohongshu KOC seeding from RM4,500, Google SEO from RM1,200/month. No hidden fees.',
    body: `<h1>Digital Marketing Pricing Malaysia 价格方案</h1>
<p>Transparent pricing, no hidden fees. 全透明定价，无隐藏费用。</p>
<ul>
<li><strong>UGC Short-Video Production UGC短视频制作</strong> — RM500 / video</li>
<li><strong>Meta Ads & Content Management Meta广告与内容管理</strong> — RM2,000/month</li>
<li><strong>Xiaohongshu KOC Seeding 小红书KOC种草</strong> — from RM4,500 / 10 posts</li>
<li><strong>Google Ads & SEO</strong> — from RM1,200/month</li>
<li><strong>E-Commerce & Web Solutions 电商方案</strong> — from RM1,888</li>
</ul>
<p>Free 30-minute strategy consultation via WhatsApp: Henry +60 17-291 5754.</p>`,
  },
  {
    path: 'contact',
    title: 'Contact 联系我们 | Cheaper Nexus — WhatsApp Us, 1-Hour Response',
    description: 'Contact Cheaper Nexus digital marketing agency Malaysia. WhatsApp Henry +60 17-291 5754. Free 30-minute strategy consultation, 1-hour response during business hours.',
    body: `<h1>Contact Cheaper Nexus 联系我们</h1>
<p>Get a free 30-minute digital marketing strategy consultation. 免费 30 分钟策略咨询，1 小时内响应。</p>
<ul>
<li>WhatsApp Henry: <a href="https://wa.me/60172915754">+60 17-291 5754</a></li>
<li>Location: Kuala Lumpur, Malaysia (serving all of Malaysia)</li>
<li>Languages: 中文 / English / Bahasa Malaysia</li>
</ul>`,
  },
];

for (const page of staticPages) {
  const canonicalUrl = `${SITE_URL}/${page.path}`;
  const headMeta = `
    <title>${escHtml(page.title)}</title>
    <meta name="description" content="${escAttr(page.description)}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escAttr(page.title)}" />
    <meta property="og:description" content="${escAttr(page.description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="Cheaper Nexus" />
    <meta property="og:image" content="${SITE_URL}/logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">${JSON.stringify(bizSchema)}</script>`.trimStart();

  const html = buildPage(cleanShell(baseHtml, { nested: true }), {
    headMeta,
    bodyContent: `${wrapStart}${page.body}${wrapEnd}`,
    langAttr: 'zh-MY',
  });

  const outDir = join(DIST, page.path);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html, 'utf-8');
}
console.log('[prerender] ✅ services / pricing / contact pages');

// ────────────────────────── 4. sitemap.xml (auto-generated) ──────────────────────────

const today = new Date().toISOString().slice(0, 10);
const staticUrls = [
  { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'weekly', lastmod: today },
  { loc: `${SITE_URL}/services`, priority: '0.9', changefreq: 'monthly', lastmod: today },
  { loc: `${SITE_URL}/pricing`, priority: '0.9', changefreq: 'monthly', lastmod: today },
  { loc: `${SITE_URL}/contact`, priority: '0.8', changefreq: 'monthly', lastmod: today },
  { loc: `${SITE_URL}/blog`, priority: '0.8', changefreq: 'daily', lastmod: today },
];
const articleUrls = articles.map(a => ({
  loc: `${SITE_URL}/blog/${a.slug}`,
  priority: '0.7',
  changefreq: 'monthly',
  lastmod: (a.created_at || '').slice(0, 10) || today,
}));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...articleUrls]
  .map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`)
  .join('\n')}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf-8');
console.log(`[prerender] ✅ sitemap.xml (${staticUrls.length + articleUrls.length} URLs)`);

// ──────────────────── 5. llms.txt + llms-full.txt (for AI crawlers) ────────────────────

const langLabel = { zh: 'Chinese', en: 'English', ms: 'Malay' };

const llmsTxt = `# Cheaper Nexus

> Cheaper Nexus is an all-in-one digital marketing agency based in Kuala Lumpur, Malaysia, serving Malaysian SMEs nationwide in Chinese, English and Malay. Transparent pricing from RM288 with no hidden fees. WhatsApp: +60 17-291 5754 (Henry). Website: ${SITE_URL}

## Services & Pricing

${servicesList.map(([name, desc]) => `- ${name}: ${desc}`).join('\n')}

## Key Pages

- [Services](${SITE_URL}/services): Full service descriptions
- [Pricing](${SITE_URL}/pricing): Transparent package pricing
- [Contact](${SITE_URL}/contact): WhatsApp contact, free 30-min consultation
- [Blog](${SITE_URL}/blog): Digital marketing guides for the Malaysian market

## Blog Articles

${articles.map(a => `- [${a.title}](${SITE_URL}/blog/${a.slug}) (${langLabel[a.language] || a.language}): ${a.meta_description}`).join('\n')}

## Full Content

- [llms-full.txt](${SITE_URL}/llms-full.txt): Complete article texts
`;
writeFileSync(join(DIST, 'llms.txt'), llmsTxt, 'utf-8');

let llmsFull = llmsTxt + '\n---\n\n# Full Articles\n\n';
for (const meta of articles) {
  const articlePath = join(PUBLIC_BLOG, `${meta.slug}.json`);
  if (!existsSync(articlePath)) continue;
  try {
    const article = JSON.parse(readFileSync(articlePath, 'utf-8'));
    llmsFull += `\n## ${article.title}\n\nURL: ${SITE_URL}/blog/${meta.slug}\nPublished: ${meta.created_at}\n\n${article.content}\n`;
    if (Array.isArray(article.faq) && article.faq.length > 0) {
      llmsFull += `\n### FAQ\n\n${article.faq.map(({ q, a }) => `**Q: ${q}**\n\nA: ${a}`).join('\n\n')}\n`;
    }
    llmsFull += '\n---\n';
  } catch { /* skip invalid */ }
}
writeFileSync(join(DIST, 'llms-full.txt'), llmsFull, 'utf-8');
console.log('[prerender] ✅ llms.txt + llms-full.txt');
