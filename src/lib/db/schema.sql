-- VedaVerse Relational Database Schema (SQLite 3 + WAL)

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user', -- 'guest', 'user', 'scholar', 'admin'
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS traditions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  period TEXT,
  canonical_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS schools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tradition_id TEXT REFERENCES traditions(id),
  description TEXT,
  prominent_scholars TEXT
);

CREATE TABLE IF NOT EXISTS texts (
  id TEXT PRIMARY KEY,
  tradition_id TEXT REFERENCES traditions(id),
  slug TEXT UNIQUE NOT NULL,
  title_devanagari TEXT NOT NULL,
  title_iast TEXT NOT NULL,
  title_en TEXT NOT NULL,
  corpus_type TEXT NOT NULL, -- 'Veda', 'Upanishad', 'Brahmana', 'Aranyaka', 'Vedanga', 'Bhagavad Gita', 'Darshana'
  description TEXT,
  historical_period TEXT,
  verified_status TEXT NOT NULL DEFAULT 'VERIFIED' -- 'DRAFT', 'REVIEW', 'VERIFIED', 'PUBLISHED'
);

CREATE TABLE IF NOT EXISTS sections (
  id TEXT PRIMARY KEY,
  text_id TEXT NOT NULL REFERENCES texts(id),
  parent_section_id TEXT REFERENCES sections(id),
  section_type TEXT NOT NULL, -- 'Mandala', 'Sukta', 'Adhyaya', 'Kanda', 'Valli', 'Chapter'
  section_number INTEGER NOT NULL,
  title_devanagari TEXT,
  title_iast TEXT,
  title_en TEXT
);

CREATE TABLE IF NOT EXISTS passages (
  id TEXT PRIMARY KEY,
  text_id TEXT NOT NULL REFERENCES texts(id),
  section_id TEXT REFERENCES sections(id),
  canonical_ref TEXT NOT NULL, -- e.g. "Rigveda 3.62.10", "Bhagavad Gita 2.47", "Katha Upanishad 1.2.2"
  verse_number TEXT NOT NULL,
  sanskrit_devanagari TEXT NOT NULL,
  sanskrit_iast TEXT NOT NULL,
  meter TEXT,
  rishi TEXT,
  devata TEXT,
  why_selected_default TEXT,
  verified_status TEXT NOT NULL DEFAULT 'PUBLISHED',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS word_analyses (
  id TEXT PRIMARY KEY,
  passage_id TEXT NOT NULL REFERENCES passages(id) ON DELETE CASCADE,
  word_order INTEGER NOT NULL,
  sanskrit_word TEXT NOT NULL,
  iast_word TEXT NOT NULL,
  root TEXT,
  grammatical_tag TEXT,
  lexical_meaning TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS translations (
  id TEXT PRIMARY KEY,
  passage_id TEXT NOT NULL REFERENCES passages(id) ON DELETE CASCADE,
  language TEXT NOT NULL DEFAULT 'en', -- 'en', 'hi', 'kn', 'sa'
  translation_text TEXT NOT NULL,
  translator_name TEXT NOT NULL,
  source_reference TEXT,
  license_type TEXT NOT NULL DEFAULT 'Public Domain',
  is_primary INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS commentaries (
  id TEXT PRIMARY KEY,
  passage_id TEXT NOT NULL REFERENCES passages(id) ON DELETE CASCADE,
  school_id TEXT REFERENCES schools(id),
  commentator_name TEXT NOT NULL, -- e.g. "Adi Shankara", "Ramanujacharya", "Madhvacharya", "Sayana"
  original_text TEXT,
  english_summary TEXT NOT NULL,
  tradition_tag TEXT NOT NULL -- e.g. "Advaita Vedanta", "Vishishtadvaita", "Dvaita", "Veda Bhashya"
);

CREATE TABLE IF NOT EXISTS concepts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  sanskrit_term TEXT NOT NULL,
  iast_term TEXT NOT NULL,
  english_title TEXT NOT NULL,
  short_definition TEXT NOT NULL,
  etymology TEXT,
  category TEXT NOT NULL,
  detailed_explanation TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS passage_concepts (
  passage_id TEXT NOT NULL REFERENCES passages(id) ON DELETE CASCADE,
  concept_id TEXT NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  relevance_score REAL NOT NULL DEFAULT 1.0,
  contextual_note TEXT,
  PRIMARY KEY (passage_id, concept_id)
);

CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  translator TEXT,
  publisher TEXT,
  publication_year TEXT,
  url TEXT,
  license TEXT NOT NULL,
  copyright_status TEXT NOT NULL, -- 'Public Domain', 'Creative Commons', 'Scholarly Fair Reference'
  public_domain_flag INTEGER NOT NULL DEFAULT 1,
  verification_hash TEXT
);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  title TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL, -- 'user', 'assistant'
  query_text TEXT NOT NULL,
  response_contract_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'passage', 'concept', 'question'
  item_id TEXT NOT NULL,
  title TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  passage_id TEXT NOT NULL REFERENCES passages(id) ON DELETE CASCADE,
  note_content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  level TEXT NOT NULL, -- 'beginner', 'intermediate', 'advanced'
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  content_markdown TEXT NOT NULL,
  estimated_minutes INTEGER NOT NULL DEFAULT 10
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options_json TEXT NOT NULL, -- JSON array of string options
  correct_option_index INTEGER NOT NULL,
  explanation TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed INTEGER NOT NULL DEFAULT 0,
  quiz_score INTEGER,
  completed_at TEXT,
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS knowledge_gaps (
  id TEXT PRIMARY KEY,
  query_text TEXT NOT NULL,
  detected_concepts_json TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review', -- 'pending_review', 'source_added', 'dismissed'
  admin_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS subject_correlations (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  vedic_tradition TEXT NOT NULL,
  ancient_treatises TEXT NOT NULL,
  description TEXT NOT NULL,
  modern_parallels TEXT NOT NULL,
  diagram_type TEXT,
  key_passages_json TEXT
);

CREATE TABLE IF NOT EXISTS roadmap_milestones (
  step INTEGER PRIMARY KEY,
  stage TEXT NOT NULL,
  title TEXT NOT NULL,
  vedic_focus TEXT NOT NULL,
  key_concept TEXT NOT NULL,
  scientific_parallel TEXT NOT NULL,
  duration_weeks INTEGER NOT NULL
);

-- Full text search index
CREATE VIRTUAL TABLE IF NOT EXISTS passages_fts USING fts5(
  passage_id UNINDEXED,
  canonical_ref,
  sanskrit_devanagari,
  sanskrit_iast,
  translation_en,
  concepts
);
