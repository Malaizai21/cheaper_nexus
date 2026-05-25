import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export type WritingStyleId = 'professional' | 'friendly' | 'educational' | 'sales' | 'storytelling' | 'trend';

export const WRITING_STYLES: Record<WritingStyleId, { label: string; labelZh: string; labelMs: string; icon: string; prompt: string }> = {
  professional: {
    label: 'Professional', labelZh: '专业权威', labelMs: 'Profesional',
    icon: '📊',
    prompt: 'Write in a professional, authoritative tone. Use industry terminology, cite data/statistics, maintain formal sentence structure. Establish credibility through expertise.',
  },
  friendly: {
    label: 'Friendly', labelZh: '轻松友好', labelMs: 'Mesra',
    icon: '😊',
    prompt: 'Write in a warm, conversational, and approachable tone. Use "you" and "we" to create connection. Short sentences, relatable examples, no jargon.',
  },
  educational: {
    label: 'Educational', labelZh: '深度解析', labelMs: 'Pendidikan',
    icon: '📚',
    prompt: 'Write in a clear, step-by-step tutorial style. Break complex topics into digestible chunks. Use numbered lists, examples, and analogies. Focus on teaching the reader.',
  },
  sales: {
    label: 'Sales-Oriented', labelZh: '销售导向', labelMs: 'Jualan',
    icon: '🎯',
    prompt: 'Write persuasively, focusing on benefits over features. Use urgency, social proof, and strong CTAs. Address objections proactively. Every paragraph should move the reader closer to taking action.',
  },
  storytelling: {
    label: 'Storytelling', labelZh: '故事叙述', labelMs: 'Penceritaan',
    icon: '📖',
    prompt: 'Open with a relatable story or scenario. Weave narrative through the article. Use case studies with real Malaysian business examples. Create emotional connection before presenting solutions.',
  },
  trend: {
    label: 'Trend Analysis', labelZh: '趋势分析', labelMs: 'Analisis Trend',
    icon: '📈',
    prompt: 'Write from a market intelligence perspective. Analyze current trends, future projections, and what they mean for Malaysian businesses. Use data, comparisons, and forward-looking insights.',
  },
};

export type KeywordResearch = {
  primary_keyword: string;
  secondary_keywords: string[];
  long_tail_keywords: string[];
  search_intent: string;
  difficulty: string;
  content_angle: string;
  suggested_title: string;
};

export type GeneratedArticle = {
  title: string;
  slug: string;
  meta_description: string;
  keywords: string[];
  content: string;
  word_count: number;
  featured_image_prompt: string;
  internal_links: { anchor: string; topic: string }[];
};

const LANG_LABELS: Record<string, string> = {
  zh: 'Simplified Chinese (Mandarin)',
  en: 'English',
  ms: 'Bahasa Melayu (Malay)',
};

export async function researchKeywords(topic: string, language: string): Promise<KeywordResearch> {
  const prompt = `You are an SEO expert specializing in the Malaysian digital marketing industry.

Perform keyword research for this topic in ${LANG_LABELS[language] || 'English'} for the Malaysian market.

Topic: "${topic}"

Return ONLY valid JSON (no code blocks, no extra text):
{
  "primary_keyword": "main target keyword phrase",
  "secondary_keywords": ["kw2", "kw3", "kw4", "kw5"],
  "long_tail_keywords": ["long tail 1", "long tail 2", "long tail 3"],
  "search_intent": "informational",
  "difficulty": "low",
  "content_angle": "The best hook/angle to approach this topic",
  "suggested_title": "SEO-optimized title with primary keyword"
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  const text = response.text ?? '';
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(clean) as KeywordResearch;
}

export async function generateArticle(params: {
  topic: string;
  language: string;
  writingStyle: WritingStyleId;
  keywords: KeywordResearch;
  existingSlugs?: string[];
}): Promise<GeneratedArticle> {
  const { topic, language, writingStyle, keywords, existingSlugs = [] } = params;
  const style = WRITING_STYLES[writingStyle];
  const langLabel = LANG_LABELS[language] || 'English';

  const existingContext = existingSlugs.length > 0
    ? `\nExisting blog articles you can link to (use as internal links where relevant): ${existingSlugs.join(', ')}`
    : '';

  const prompt = `You are an expert SEO content writer for Cheaper Nexus, a digital marketing agency in Malaysia offering:
- Brand Video Production (from RM288/video) — TikTok, Xiaohongshu, Lemon8
- Social Media Management (from RM388) — FB, IG, TikTok, Red, Lemon8, WA Business
- Meta Ads Management (RM1,888/month) — Facebook & Instagram advertising
- Google Ads & SEO Marketing (RM1,888/month)
- E-Commerce & Web Solutions (from RM1,888) — Shopee, Lazada, TikTok Shop

ARTICLE SPECIFICATIONS:
- Topic: ${topic}
- Primary Keyword: ${keywords.primary_keyword}
- Secondary Keywords: ${keywords.secondary_keywords.join(', ')}
- Long-tail Keywords: ${keywords.long_tail_keywords.join(', ')}
- Content Angle: ${keywords.content_angle}
- Language: ${langLabel} — write the ENTIRE article in this language
- Writing Style: ${style.prompt}
- Target Market: Malaysia (Kuala Lumpur, Selangor, Johor, Penang, etc.)
- Word Count: 1,500–2,000 words${existingContext}

CONTENT STRUCTURE (strictly follow):
1. H1 title — include primary keyword
2. Introduction — hook + keyword in first 100 words + preview of what reader will learn
3. 4–5 H2 sections, each with 1–2 H3 subsections
4. Include Malaysian local context: local SMEs, MYR pricing, local platforms
5. Include real-world examples or case scenarios
6. FAQ section with 4 questions (target voice search / long-tail queries)
7. Conclusion with CTA — invite readers to contact Cheaper Nexus via WhatsApp

Return ONLY valid JSON (absolutely no code blocks, no markdown wrapping, no extra text before or after):
{
  "title": "H1 title with primary keyword",
  "slug": "lowercase-hyphenated-url-slug",
  "meta_description": "Exactly 150-160 characters. Include primary keyword. Compelling and click-worthy.",
  "keywords": ["primary", "kw2", "kw3", "kw4", "kw5", "kw6", "kw7", "kw8"],
  "content": "Complete article in Markdown. ## for H2, ### for H3, **bold**, - bullet lists. Minimum 1,500 words.",
  "word_count": 1600,
  "featured_image_prompt": "Photorealistic, professional: [specific scene description for the featured image relevant to the article topic, Malaysian setting where appropriate]",
  "internal_links": [
    {"anchor": "anchor text in article", "topic": "topic this should link to"}
  ]
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: { temperature: 0.7, maxOutputTokens: 8192 },
  });

  const text = response.text ?? '';
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  let parsed: GeneratedArticle;
  try {
    parsed = JSON.parse(clean);
  } catch {
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Gemini returned invalid JSON');
    parsed = JSON.parse(jsonMatch[0]);
  }

  return parsed;
}
