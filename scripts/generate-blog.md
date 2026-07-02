# Weekly Blog Generation Instructions

You are generating SEO blog articles for **Cheaper Nexus** (cheaper-nexus.vercel.app), a Malaysian digital marketing agency serving Chinese, English, and Malay-speaking businesses in Malaysia.

## Task
Generate **2 high-quality, SEO-optimized blog articles** and publish them to the website.

## About Cheaper Nexus
- Services: UGC/KOC Video Content, Social Media Management, XHS/Xiaohongshu Marketing, Digital Ads & SEO, E-Commerce & Live Streaming
- Target market: Malaysian businesses (SMEs, F&B, retail, e-commerce)
- Languages: Primarily Chinese (zh), also English (en) and Malay (ms)
- Contact: Henry (017-291 5754)

## Topic Pool (rotate each week, avoid repeating recent topics)
- 马来西亚 SEO 优化策略
- 小红书企业营销指南
- TikTok 广告投放技巧
- Facebook & Instagram 广告优化
- Google Ads 马来西亚本地商家攻略
- 内容营销如何带动转化
- KOC/UGC 达人营销
- 电商直播带货策略
- 品牌社媒矩阵搭建
- 马来西亚数码营销趋势
- 如何选择数码营销套餐
- 短视频内容策略
- 本地化内容营销
- 落地页转化率优化

## Article Format
Each article must be saved as two files:

### 1. Article JSON: `public/blog/[slug].json`
```json
{
  "id": <unix_timestamp>,
  "slug": "kebab-case-slug",
  "language": "zh",
  "title": "文章标题",
  "meta_description": "150字以内的SEO摘要",
  "keywords": ["关键词1", "关键词2", "关键词3", "关键词4", "关键词5"],
  "content": "## Markdown 格式的完整文章内容...",
  "writing_style": "professional",
  "featured_image_prompt": "Image description for the article",
  "internal_links": [],
  "word_count": 1200,
  "topic": "主题",
  "status": "published",
  "created_at": "<ISO date string>"
}
```

### 2. Update index: `public/blog/articles.json`
Add the new article's summary (no `content` field) to the BEGINNING of the array.

## Article Quality Standards
- **Length**: 800–1500 words
- **Structure**: H2/H3 headers, bullet points, practical tips
- **SEO**: Include target keyword in title, first paragraph, 2-3 headers
- **Value**: Real actionable advice, not generic fluff
- **Local context**: Reference Malaysia, Ringgit (RM), local platforms (Shopee, Lazada, etc.) where relevant
- **CTA**: End with a soft call to action mentioning Cheaper Nexus services

## After generating both articles
Run these commands in `C:\Users\CHEAP\Desktop\CheaperNexus`:
```
git add public/blog/
git commit -m "content: add weekly blog articles $(date +%Y-%m-%d)"
git push
```

Vercel will automatically deploy after the push.
