import 'dotenv/config';
import express from 'express';
import { q } from '../server/db.js';
import { researchKeywords, generateArticle, WRITING_STYLES } from '../server/gemini.js';

const app = express();
app.use(express.json());

app.get('/api/styles', (_req, res) => {
  const styles = Object.entries(WRITING_STYLES).map(([id, s]) => ({
    id,
    label: s.label,
    labelZh: s.labelZh,
    labelMs: s.labelMs,
    icon: s.icon,
  }));
  res.json(styles);
});

app.post('/api/keywords', async (req, res) => {
  try {
    const { topic, language = 'zh' } = req.body as { topic: string; language: string };
    if (!topic?.trim()) return res.status(400).json({ error: 'topic is required' });
    const result = await researchKeywords(topic.trim(), language);
    res.json(result);
  } catch (err) {
    console.error('[keywords]', err);
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/generate', async (req, res) => {
  try {
    const { topic, language = 'zh', writingStyle = 'professional' } = req.body as {
      topic: string;
      language: string;
      writingStyle: string;
    };
    if (!topic?.trim()) return res.status(400).json({ error: 'topic is required' });

    const existingSlugs = (q.allSlugs.all('published') as { slug: string }[]).map(r => r.slug);
    const keywords = await researchKeywords(topic.trim(), language);
    const article = await generateArticle({
      topic: topic.trim(),
      language,
      writingStyle: writingStyle as any,
      keywords,
      existingSlugs,
    });

    let slug = article.slug;
    const existing = q.bySlug.get(slug);
    if (existing) slug = `${slug}-${Date.now()}`;

    const result = q.insert.run({
      slug,
      language,
      title: article.title,
      meta_description: article.meta_description,
      keywords: JSON.stringify(article.keywords),
      content: article.content,
      writing_style: writingStyle,
      featured_image_prompt: article.featured_image_prompt,
      internal_links: JSON.stringify(article.internal_links),
      word_count: article.word_count,
      topic: topic.trim(),
    });

    res.json({ id: result.lastInsertRowid, slug, ...article });
  } catch (err) {
    console.error('[generate]', err);
    res.status(500).json({ error: String(err) });
  }
});

app.get('/api/articles', (_req, res) => {
  const rows = q.listAll.all('published');
  res.json(rows);
});

app.get('/api/articles/:slug', (req, res) => {
  const row = q.bySlug.get(req.params.slug);
  if (!row) return res.status(404).json({ error: 'not found' });
  res.json(row);
});

app.delete('/api/articles/:id', (req, res) => {
  q.remove.run(Number(req.params.id));
  res.json({ ok: true });
});

export default app;
