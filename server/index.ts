import 'dotenv/config';
import express from 'express';
import { q } from './db.js';
import { researchKeywords, generateArticle, WRITING_STYLES } from './gemini.js';

const app = express();
app.use(express.json());

// ─── Writing Styles ───────────────────────────────────────────────────────────

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

// ─── Keyword Research ─────────────────────────────────────────────────────────

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

// ─── Article Generation ───────────────────────────────────────────────────────

app.post('/api/generate', async (req, res) => {
  try {
    const { topic, language = 'zh', writingStyle = 'professional' } = req.body as {
      topic: string;
      language: string;
      writingStyle: string;
    };
    if (!topic?.trim()) return res.status(400).json({ error: 'topic is required' });

    // Get existing slugs for internal linking context
    const existingSlugs = (q.allSlugs.all('published') as { slug: string }[]).map(r => r.slug);

    // Step 1: keyword research
    const keywords = await researchKeywords(topic.trim(), language);

    // Step 2: full article generation
    const article = await generateArticle({
      topic: topic.trim(),
      language,
      writingStyle: writingStyle as any,
      keywords,
      existingSlugs,
    });

    // Ensure unique slug
    let slug = article.slug;
    const existing = q.bySlug.get(slug);
    if (existing) slug = `${slug}-${Date.now()}`;

    // Persist to SQLite
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

// ─── Articles CRUD ────────────────────────────────────────────────────────────

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

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = Number(process.env.PORT ?? 3001);
app.listen(PORT, () => console.log(`✅  API server running on http://localhost:${PORT}`));
