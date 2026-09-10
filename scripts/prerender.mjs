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

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
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

// SSM requires the company registration number to appear with the company name.
// Appending it to the shared wrapper puts it in the static HTML of every
// prerendered page, so no-JS crawlers see it too.
const LEGAL_NAME = 'Cheaper Nexus Sdn Bhd';
const SSM_NUMBER = '202601007953 (1670051-W)';
const wrapEnd = `<hr style="margin:32px 0 16px;border:0;border-top:1px solid rgba(10,25,47,.12)" />`
  + `<p style="font-size:13px;color:rgba(10,25,47,.55)">${LEGAL_NAME} ${SSM_NUMBER}</p>`
  + '</div>';

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
    : `${SITE_URL}/logo-og.png`;
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
  image: `${SITE_URL}/logo-og.png`,
  telephone: '+60172915754',
  legalName: 'Cheaper Nexus Sdn Bhd',
  identifier: {
    '@type': 'PropertyValue',
    name: 'SSM Company Registration No.',
    value: '202601007953 (1670051-W)',
  },
  description:
    'All-in-one digital marketing agency in Malaysia offering social media management packages, ads management, video and design production, and KOC/KOL influencer marketing for SMEs. Pricing from RM150 with no hidden fees.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kuala Lumpur',
    addressRegion: 'Kuala Lumpur',
    addressCountry: 'MY',
  },
  priceRange: 'RM150 - RM15000+',
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
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'First Trial Package' }, price: '888', priceCurrency: 'MYR', description: 'One-time trial package (limited to once per company) including 1 short video, 2 professional designs, and Meta Ads foundation setup — original value RM3,100.' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Social Media Management Package' }, price: '2888', priceCurrency: 'MYR', description: 'Combined content production, multi-platform social media management (Facebook, Instagram, TikTok, Xiaohongshu), and Meta ads management in one monthly plan.' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Full Business Growth Package' }, price: '8888', priceCurrency: 'MYR', description: 'Scaled content production and full-channel management (Facebook, Instagram, TikTok, Xiaohongshu, Google Business Profile, Waze, Telegram, Lemon8) with ads management, over 3 months.' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Ads Management' }, price: '2000', priceCurrency: 'MYR', description: 'Standalone paid ads management across TikTok, Instagram, Facebook, Xiaohongshu, and Google, with bio & copywriting optimisation and ongoing monitoring.' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'KOC / KOL Influencer Marketing' }, price: '3888', priceCurrency: 'MYR', description: 'Cross-platform influencer and creator marketing campaigns, starting from a package of 10 creators.' },
    ],
  },
};

const homeFaq = [
  { q: 'What is Cheaper Nexus?', a: 'Cheaper Nexus is a Malaysia-based all-in-one digital marketing agency offering a First Trial Package, Social Media Management Package, Full Business Growth Package, standalone Ads Management, and KOC/KOL influencer marketing for SMEs. Services start from RM150 with transparent pricing and no hidden fees.' },
  { q: 'What digital marketing services does Cheaper Nexus offer in Malaysia?', a: 'Cheaper Nexus offers a First Trial Package (RM888, one-time), a Social Media Management Package (RM2,888/month combining content, social media management, and ads), a Full Business Growth Package (RM8,888/3 months), standalone Ads Management (from RM2,000/month), KOC/KOL influencer marketing, and ala carte design and video production.' },
  { q: 'How much does digital marketing cost in Malaysia?', a: 'Cheaper Nexus digital marketing packages start from a RM888 First Trial Package (one-time). Ongoing Social Media Management is RM2,888/month, Ads Management starts from RM2,000/month, KOC/KOL influencer marketing starts from RM3,888, and ala carte design/video start from RM150. All pricing is transparent with no hidden fees.' },
  { q: '马来西亚数码营销费用是多少？', a: 'Cheaper Nexus 的数码营销服务：首次体验套餐 RM888 起（限一次），社媒管理套餐 RM2,888/月，广告投放管理从 RM2,000/月起，KOC/KOL 网红营销从 RM3,888 起，单点设计/视频从 RM150 起。全透明定价，无隐藏费用。' },
  { q: 'Does Cheaper Nexus work with small businesses and SMEs?', a: 'Yes. Cheaper Nexus specialises in helping Malaysian SMEs and small businesses grow online. The agency offers flexible, affordable packages starting from RM150, with direct WhatsApp access to the team and a free 30-minute strategy consultation.' },
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
  ['First Trial Package (RM888, one-time)', '1 short video, 2 professional designs, and Meta Ads foundation setup — original value RM3,100, limited to once per company.'],
  ['Social Media Management Package (RM2,888/month)', 'Content production, multi-platform social media management (FB/IG/TikTok/Xiaohongshu), and Meta ads management combined.'],
  ['Full Business Growth Package (RM8,888 / 3 months)', 'Scaled content and full-channel management including Google Business Profile, Waze, Telegram, and Lemon8, plus ads management.'],
  ['Ads Management (from RM2,000/month)', 'Standalone paid ads management across TikTok, Instagram, Facebook, Xiaohongshu, and Google.'],
  ['KOC / KOL Influencer Marketing (from RM3,888)', 'Cross-platform influencer and creator marketing campaigns, starting from 10 creators.'],
];

const homeBody = `${wrapStart}
<h1>Cheaper Nexus — 马来西亚数码营销公司 | Digital Marketing Agency Malaysia</h1>
<p>Cheaper Nexus 是一家马来西亚数码营销公司，总部位于吉隆坡。Cheaper Nexus is an all-in-one digital marketing agency in Kuala Lumpur, Malaysia, helping Malaysian SMEs grow across TikTok, Xiaohongshu (小红书), Facebook, and Instagram. Transparent pricing from RM150, no hidden fees. 我们帮马来西亚中小企业一站式攻占全平台：从内容制作、社媒代运营到广告投放与网红营销。</p>
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
    <title>Cheaper Nexus | 马来西亚数码营销公司 · Digital Marketing Agency Malaysia</title>
    <meta name="description" content="Cheaper Nexus 是马来西亚数码营销公司，提供首次体验套餐（RM888）、社媒管理套餐（RM2,888/月）、全面业务增长套餐、广告投放管理、KOC/KOL 网红营销及单点设计视频服务。价格全透明，无隐藏收费。" />
    <link rel="canonical" href="${SITE_URL}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Cheaper Nexus | 马来西亚数码营销公司" />
    <meta property="og:description" content="马来西亚数码营销公司，价格从 RM150 起，全透明无隐藏收费。" />
    <meta property="og:url" content="${SITE_URL}" />
    <meta property="og:site_name" content="Cheaper Nexus" />
    <meta property="og:image" content="${SITE_URL}/logo-og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Cheaper Nexus | 马来西亚数码营销公司" />
    <meta name="twitter:description" content="马来西亚数码营销公司，价格从 RM150 起。" />
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
    description: 'Digital marketing services Malaysia: First Trial Package RM888, Social Media Management RM2,888/month, Full Business Growth Package, Ads Management, KOC/KOL influencer marketing for Malaysian SMEs.',
    body: `<h1>Digital Marketing Services Malaysia 服务项目</h1>
<p>Cheaper Nexus offers a growth-path package system plus standalone services for Malaysian SMEs. 我们为马来西亚中小企业提供成长型套餐及独立服务。</p>
<ul>${servicesList.map(([name, desc]) => `<li><strong>${name}</strong> — ${desc}</li>`).join('')}</ul>
<p>WhatsApp us for a free 30-minute consultation: Henry +60 17-291 5754.</p>`,
  },
  {
    path: 'pricing',
    title: 'Pricing 价格方案 | Cheaper Nexus — Trial from RM888',
    description: 'Transparent digital marketing pricing Malaysia: First Trial Package RM888 (one-time), Social Media Management RM2,888/month, Full Business Growth Package RM8,888/3 months, Ads Management from RM2,000/month, KOC/KOL from RM3,888. No hidden fees.',
    body: `<h1>Digital Marketing Pricing Malaysia 价格方案</h1>
<p>Transparent pricing, no hidden fees. 全透明定价，无隐藏费用。</p>
<ul>
<li><strong>First Trial Package 首次体验套餐</strong> — RM888 / month (one-time)</li>
<li><strong>Social Media Management Package 社媒管理套餐</strong> — RM2,888/month</li>
<li><strong>Full Business Growth Package 全面业务增长套餐</strong> — RM8,888 / 3 months</li>
<li><strong>Ads Management 广告投放管理</strong> — from RM2,000/month</li>
<li><strong>KOC / KOL Influencer Marketing KOC/KOL网红营销</strong> — from RM3,888</li>
<li><strong>Ala Carte Design & Video 单点设计与视频</strong> — from RM150</li>
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
    <meta property="og:image" content="${SITE_URL}/logo-og.png" />
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

// ────────────────── 3b. /works listing + /works/<slug> case studies ──────────────────
// These MUST be prerendered: vite builds with a relative base, so a client-side-only
// /works/<slug> would resolve its bundle to /works/assets/… and never boot.

const worksPath = join(ROOT, 'public', 'works', 'works.json');
const works = existsSync(worksPath) ? JSON.parse(readFileSync(worksPath, 'utf-8')) : [];

const SERVICE_EN = { video: 'Video Production', design: 'Graphic Design', ads: 'Paid Ads' };

/**
 * Route chunks are only discovered after the entry bundle parses, which puts a
 * whole extra round trip in front of the first render. Vite emits no preload
 * hint for a lazily imported route, so resolve the hashed filenames here and
 * emit <link rel="modulepreload"> for the chunks this page will need.
 */
const assetsDir = join(DIST, 'assets');
const assetFiles = existsSync(assetsDir) ? readdirSync(assetsDir) : [];
const chunkFor = name => {
  const hit = assetFiles.find(f => new RegExp(`^${name}-[\\w-]+\\.js$`).test(f));
  return hit ? `/assets/${hit}` : null;
};
const worksChunks = ['Works', 'worksData'].map(chunkFor).filter(Boolean);
const workDetailChunks = ['WorkDetail', 'worksData'].map(chunkFor).filter(Boolean);

function worksHead({ title, description, canonicalUrl, image, schema, ogType = 'website', preload = [], modules = [] }) {
  return `
${modules.map(m => `    <link rel="modulepreload" crossorigin href="${escAttr(m)}" />`).join('\n')}
${preload.map(p => `    <link rel="preload" as="${p.as}" href="${escAttr(p.href)}"${p.type ? ` type="${p.type}"` : ''}${p.crossorigin ? ' crossorigin' : ''}${p.priority ? ' fetchpriority="high"' : ''} />`).join('\n')}
    <title>${escHtml(title)}</title>
    <meta name="description" content="${escAttr(description)}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:title" content="${escAttr(title)}" />
    <meta property="og:description" content="${escAttr(description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="Cheaper Nexus" />
    <meta property="og:image" content="${image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escAttr(title)}" />
    <meta name="twitter:description" content="${escAttr(description)}" />
    <meta name="twitter:image" content="${image}" />
    <link rel="alternate" hrefLang="zh-MY" href="${canonicalUrl}" />
    <link rel="alternate" hrefLang="en-MY" href="${canonicalUrl}" />
    <link rel="alternate" hrefLang="ms-MY" href="${canonicalUrl}" />
    <link rel="alternate" hrefLang="x-default" href="${canonicalUrl}" />
    <script type="application/ld+json">${JSON.stringify(schema)}</script>`.trimStart();
}

function writePage(relPath, html) {
  const outDir = join(DIST, relPath);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html, 'utf-8');
}

if (works.length) {
  // Listing page
  const listTitle = 'Client Work & Case Studies 客户作品案例 | Cheaper Nexus Malaysia';
  const listDesc =
    'Short-form videos, social media designs and ad creatives Cheaper Nexus has produced for Malaysian businesses — loans, F&B, weddings, mobile retail, beauty, packaging and more.';

  const listBody = `<h1>Client Work &amp; Case Studies 客户作品案例</h1>
<p>Real work delivered by Cheaper Nexus, a digital marketing agency in Malaysia. 以下是我们实际交付给马来西亚客户的短视频、社媒设计与广告素材。</p>
<ul>${works
    .slice()
    .sort((a, b) => a.order - b.order)
    .map(w => {
      const v = w.media.filter(m => m.type === 'video').length;
      const d = w.media.filter(m => m.type === 'image').length;
      const counts = [v ? `${v} videos` : null, d ? `${d} designs` : null].filter(Boolean).join(', ');
      return `<li><a href="/works/${w.slug}"><strong>${escHtml(w.client_name)}</strong></a> — ${escHtml(w.industry.en)} (${counts}). ${escHtml(w.summary.en)}</li>`;
    })
    .join('')}</ul>
<p>WhatsApp Henry at +60 17-291 5754 for a free 30-minute strategy consultation.</p>`;

  const ordered = works.slice().sort((a, b) => a.order - b.order);

  /**
   * Above-the-fold hero, prerendered with the real classes.
   *
   * The LCP element is the handset image. Preloading already took its load
   * delay to zero, but it still sat unpainted for ~3.5s of render delay
   * waiting on the bundle to boot — nothing can paint a React tree before
   * React exists. Emitting the hero as styled HTML lets the browser paint it
   * from the document, so LCP no longer depends on JS at all.
   *
   * Every class here is one the React components already use, so Tailwind has
   * emitted it. The markup mirrors Works.tsx + PhoneFrame; React replaces it on
   * mount, and because it matches, the swap is invisible.
   */
  const first = ordered.find(w => w.media.some(m => m.type === 'video')) || ordered[0];
  const firstThumb = (first.media.find(m => m.type === 'video') || first.media[0]).thumb;

  const staticHero = `<nav class="fixed top-0 left-0 right-0 z-50 bg-brand-white/95 backdrop-blur-sm border-b border-brand-blue/5">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-20">
      <a href="/" class="flex items-center"><picture><source srcset="/logo.webp" type="image/webp" /><img src="/logo.png" alt="Cheaper Nexus" width="430" height="120" fetchpriority="high" class="h-12 w-auto object-contain" /></picture></a>
    </div>
  </div>
</nav>
<div class="min-h-screen bg-brand-blue">
  <header class="bg-brand-blue text-white pt-28 pb-16 overflow-hidden">
    <div class="px-4 sm:px-8 lg:px-12 flex flex-col items-center text-center">
      <p class="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-cyan mb-6">客户作品</p>
      <h1 class="font-black uppercase tracking-[-0.04em] text-[clamp(2.6rem,9vw,7rem)] max-w-5xl leading-[1.05]">我们做过<br /><span class="text-brand-cyan">的作品</span></h1>
      <p class="mt-6 max-w-lg text-white/50 text-sm sm:text-base leading-relaxed">短视频、社媒设计、广告素材——这些都是我们实际交付给马来西亚客户的作品。</p>
      <div class="mt-12">
        <div class="relative w-[230px] sm:w-[270px] shrink-0">
          <div class="relative">
            <div class="relative rounded-[2.2rem] bg-[#111827] p-2.5 shadow-2xl shadow-black/40 ring-1 ring-white/10">
              <div class="relative overflow-hidden rounded-[1.7rem] bg-black">
                <div class="absolute top-2 left-1/2 -translate-x-1/2 z-20 h-4 w-16 rounded-full bg-black/90"></div>
                <div class="flex items-center gap-2 px-3 pt-7 pb-2 bg-black">
                  <span class="h-6 w-6 shrink-0 rounded-full bg-linear-to-tr from-brand-cyan via-white to-brand-cyan p-[1.5px]"><span class="block h-full w-full rounded-full bg-brand-blue"></span></span>
                  <span class="text-[11px] font-semibold text-white truncate">${escHtml(first.client_name)}</span>
                </div>
                <div class="relative aspect-9/16 bg-black">
                  <img src="${escAttr(firstThumb)}" alt="${escAttr(first.client_name)}" width="600" height="1067" fetchpriority="high" class="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div class="flex items-center gap-3.5 px-3 py-2.5 bg-black"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</div>`;

  writePage('works', buildPage(cleanShell(baseHtml, { nested: true }), {
    headMeta: worksHead({
      title: listTitle,
      description: listDesc,
      canonicalUrl: `${SITE_URL}/works`,
      image: `${SITE_URL}/logo-og.png`,
      // The card covers are only discoverable after the bundle boots and
      // works.json parses, which left the LCP image waiting ~3s. Preloading
      // the data and the first cover lets the browser start both immediately.
      modules: worksChunks,
      preload: [
        { as: 'fetch', href: '/works/works.json', type: 'application/json', crossorigin: true },
        { as: 'image', href: ordered[0].cover_thumb, type: 'image/webp', priority: true },
      ],
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: listTitle,
        description: listDesc,
        url: `${SITE_URL}/works`,
        hasPart: works.map(w => ({
          '@type': 'CreativeWork',
          name: `${w.client_name} — ${w.industry.en}`,
          url: `${SITE_URL}/works/${w.slug}`,
          creator: { '@type': 'Organization', name: 'Cheaper Nexus' },
        })),
      },
    }),
    // Styled hero first so it paints immediately; the plain list below it stays
    // for crawlers that read text rather than render.
    bodyContent: `${staticHero}${wrapStart}${listBody}${wrapEnd}`,
    langAttr: 'zh-MY',
  }));

  // One page per case study
  for (const w of works) {
    const v = w.media.filter(m => m.type === 'video').length;
    const d = w.media.filter(m => m.type === 'image').length;
    const counts = [v ? `${v} short videos` : null, d ? `${d} designs` : null].filter(Boolean).join(' · ');
    const title = `${w.client_name} — ${w.industry.en} | Cheaper Nexus`;
    const canonicalUrl = `${SITE_URL}/works/${w.slug}`;

    const body = `<h1>${escHtml(w.client_name)}</h1>
<p><strong>${escHtml(w.industry.en)} · ${escHtml(w.industry.zh)}</strong> — ${escHtml(counts)}</p>
<p><em>${escHtml(w.highlight.en)}</em></p>
<h2>Overview 案例概览</h2>
<p>${escHtml(w.summary.en)}</p>
<p>${escHtml(w.summary.zh)}</p>
${w.challenge?.en?.trim() ? `<h2>The Challenge</h2>\n<p>${escHtml(w.challenge.en)}</p>` : ''}
<h2>What We Did 我们怎么做</h2>
<p>${escHtml(w.approach.en)}</p>
<p>${escHtml(w.approach.zh)}</p>
<h2>Deliverables 交付内容</h2>
<ul>${(w.deliverables.en || []).map(x => `<li>${escHtml(x)}</li>`).join('')}</ul>
<p>Services: ${w.services.map(s => escHtml(SERVICE_EN[s] || s)).join(', ')}</p>
<p><a href="/works">← Back to all client work 返回作品列表</a></p>
<p>Want work like this? WhatsApp Henry at +60 17-291 5754 for a free 30-minute consultation.</p>`;

    writePage(join('works', w.slug), buildPage(cleanShell(baseHtml, { nested: true }), {
      headMeta: worksHead({
        title,
        description: w.summary.en,
        canonicalUrl,
        image: `${SITE_URL}${w.cover_image}`,
        ogType: 'article',
        modules: workDetailChunks,
        preload: [
          { as: 'fetch', href: '/works/works.json', type: 'application/json', crossorigin: true },
          { as: 'image', href: w.media[0].thumb, type: 'image/webp', priority: true },
        ],
        schema: {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: `${w.client_name} — ${w.industry.en}`,
          headline: w.client_name,
          description: w.summary.en,
          url: canonicalUrl,
          image: `${SITE_URL}${w.cover_image}`,
          inLanguage: ['zh-MY', 'en-MY'],
          creator: {
            '@type': 'Organization',
            name: 'Cheaper Nexus',
            url: SITE_URL,
            telephone: '+60172915754',
          },
          about: { '@type': 'Thing', name: w.industry.en },
          keywords: w.services.map(s => SERVICE_EN[s] || s).join(', '),
        },
      }),
      bodyContent: `${wrapStart}${body}${wrapEnd}`,
      langAttr: 'zh-MY',
    }));
  }
  console.log(`[prerender] ✅ works listing + ${works.length} case study pages`);
}

// ────────────────────────── 4. sitemap.xml (auto-generated) ──────────────────────────

const today = new Date().toISOString().slice(0, 10);
const staticUrls = [
  { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'weekly', lastmod: today },
  { loc: `${SITE_URL}/services`, priority: '0.9', changefreq: 'monthly', lastmod: today },
  { loc: `${SITE_URL}/pricing`, priority: '0.9', changefreq: 'monthly', lastmod: today },
  { loc: `${SITE_URL}/contact`, priority: '0.8', changefreq: 'monthly', lastmod: today },
  { loc: `${SITE_URL}/blog`, priority: '0.8', changefreq: 'daily', lastmod: today },
  ...(works.length ? [{ loc: `${SITE_URL}/works`, priority: '0.9', changefreq: 'monthly', lastmod: today }] : []),
];
const workUrls = works.map(w => ({
  loc: `${SITE_URL}/works/${w.slug}`,
  priority: '0.7',
  changefreq: 'monthly',
  lastmod: today,
}));
const articleUrls = articles.map(a => ({
  loc: `${SITE_URL}/blog/${a.slug}`,
  priority: '0.7',
  changefreq: 'monthly',
  lastmod: (a.created_at || '').slice(0, 10) || today,
}));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...workUrls, ...articleUrls]
  .map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`)
  .join('\n')}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf-8');
console.log(`[prerender] ✅ sitemap.xml (${staticUrls.length + workUrls.length + articleUrls.length} URLs)`);

// ──────────────────── 5. llms.txt + llms-full.txt (for AI crawlers) ────────────────────

const langLabel = { zh: 'Chinese', en: 'English', ms: 'Malay' };

const llmsTxt = `# Cheaper Nexus

> Cheaper Nexus (${LEGAL_NAME}, SSM ${SSM_NUMBER}) is an all-in-one digital marketing agency based in Kuala Lumpur, Malaysia, serving Malaysian SMEs nationwide in Chinese, English and Malay. Transparent pricing from RM150 with no hidden fees. WhatsApp: +60 17-291 5754 (Henry). Website: ${SITE_URL}

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
