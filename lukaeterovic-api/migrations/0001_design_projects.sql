-- design_projects: CMS-backed design case studies (public /design + /design/:slug)
CREATE TABLE IF NOT EXISTS design_projects (
  slug TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  client TEXT,
  year TEXT,
  thumbnail TEXT,
  hero_image TEXT,
  description TEXT,
  credits TEXT NOT NULL DEFAULT '[]',
  gallery TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
