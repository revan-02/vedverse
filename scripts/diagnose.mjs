import Database from 'better-sqlite3';
const db = new Database('data/vedaverse.db');

console.log('Concepts:', db.prepare('SELECT id, slug, english_title FROM concepts WHERE english_title LIKE ?').all('%Anger%'));
console.log('Passage concepts for c-krodha:', db.prepare('SELECT * FROM passage_concepts WHERE concept_id = ?').all('c-krodha'));

// Test FTS MATCH
try {
  const fts = db.prepare('SELECT passage_id FROM passages_fts WHERE passages_fts MATCH ?').all('What OR the OR Vedas OR say OR about OR controlling OR anger');
  console.log('FTS with sentence:', fts);
} catch (e) {
  console.error('FTS error:', e.message);
}

// Test with stopword-filtered tokens
const tokens = 'What do the Vedas say about controlling anger?'
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, '')
  .split(/\s+/)
  .filter(w => !['what', 'do', 'the', 'say', 'about', 'is', 'a', 'an', 'to', 'in', 'of', 'for'].includes(w));
console.log('Filtered tokens:', tokens);
try {
  const ftsTokens = db.prepare('SELECT passage_id FROM passages_fts WHERE passages_fts MATCH ?').all(tokens.join(' OR '));
  console.log('FTS with filtered tokens:', ftsTokens);
} catch (e) {
  console.error('FTS token error:', e.message);
}
