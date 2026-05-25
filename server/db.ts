import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = process.env.VERCEL ? '/tmp' : path.resolve('./data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'blog.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    slug        TEXT UNIQUE NOT NULL,
    language    TEXT NOT NULL DEFAULT 'zh',
    title       TEXT NOT NULL,
    meta_description TEXT DEFAULT '',
    keywords    TEXT DEFAULT '[]',
    content     TEXT NOT NULL,
    writing_style TEXT DEFAULT 'professional',
    featured_image_prompt TEXT DEFAULT '',
    internal_links TEXT DEFAULT '[]',
    word_count  INTEGER DEFAULT 0,
    topic       TEXT DEFAULT '',
    status      TEXT DEFAULT 'published',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export type Article = {
  id: number;
  slug: string;
  language: string;
  title: string;
  meta_description: string;
  keywords: string;
  content: string;
  writing_style: string;
  featured_image_prompt: string;
  internal_links: string;
  word_count: number;
  topic: string;
  status: string;
  created_at: string;
};

export const q = {
  listAll: db.prepare<[string]>(
    'SELECT id, slug, language, title, meta_description, keywords, word_count, writing_style, topic, created_at FROM articles WHERE status = ? ORDER BY created_at DESC'
  ),
  bySlug: db.prepare<[string]>('SELECT * FROM articles WHERE slug = ?'),
  byId:   db.prepare<[number]>('SELECT * FROM articles WHERE id = ?'),
  allSlugs: db.prepare<[string]>('SELECT slug, title, language FROM articles WHERE status = ?'),
  insert: db.prepare(`
    INSERT INTO articles (slug, language, title, meta_description, keywords, content, writing_style, featured_image_prompt, internal_links, word_count, topic)
    VALUES (@slug, @language, @title, @meta_description, @keywords, @content, @writing_style, @featured_image_prompt, @internal_links, @word_count, @topic)
  `),
  remove: db.prepare<[number]>('DELETE FROM articles WHERE id = ?'),
};

export default db;
