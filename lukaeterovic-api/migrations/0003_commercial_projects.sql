-- commercial_projects: CMS-backed commercial/promo case studies
CREATE TABLE IF NOT EXISTS commercial_projects (
  slug TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  client TEXT,
  year TEXT,
  thumbnail TEXT,
  hero_image TEXT,
  description TEXT,
  text_middle TEXT,
  text_footer TEXT,
  credits TEXT NOT NULL DEFAULT '[]',
  gallery TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
