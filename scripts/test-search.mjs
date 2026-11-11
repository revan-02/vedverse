import Database from 'better-sqlite3';

const db = new Database('data/vedaverse.db');
const bg = db.prepare("SELECT id, canonical_ref FROM passages WHERE id LIKE '%BG%'").all();
console.log('BG Passages in DB:', bg);

const concepts = db.prepare("SELECT id, english_title, sanskrit_term FROM concepts").all();
console.log('Concepts in DB:', concepts);

const passageConcepts = db.prepare("SELECT * FROM passage_concepts").all();
console.log('Passage Concepts in DB:', passageConcepts);

try {
  const ftsMatch = db.prepare("SELECT passage_id FROM passages_fts WHERE passages_fts MATCH 'anger'").all();
  console.log('FTS match for anger:', ftsMatch);
} catch (e) {
  console.log('FTS error:', e.message);
}
