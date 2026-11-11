import Database from 'better-sqlite3';

const db = new Database('data/vedaverse.db');

const STOPWORDS = new Set([
  'what', 'does', 'do', 'the', 'vedas', 'veda', 'say', 'about', 'is', 'a', 'an', 'to', 'in', 'of', 'for', 'and', 'or', 'on', 'with', 'from', 'at', 'by', 'this', 'that', 'these', 'those', 'are', 'was', 'were', 'been', 'being', 'have', 'has', 'had', 'tell', 'me', 'explain', 'show'
]);

const cleanQuery = 'What do the Vedas say about controlling anger?';
const meaningfulTokens = cleanQuery
  .toLowerCase()
  .replace(/[^a-zA-Z0-9\u0900-\u097F\s]/g, ' ')
  .split(/\s+/)
  .filter(t => t.length > 1 && !STOPWORDS.has(t));

console.log('Meaningful tokens:', meaningfulTokens);

const sanitizedFts = meaningfulTokens.join(' OR ');
console.log('Sanitized FTS:', sanitizedFts);

try {
  const ftsRows = db.prepare(`
    SELECT passage_id, rank
    FROM passages_fts
    WHERE passages_fts MATCH ?
    ORDER BY rank
    LIMIT 20
  `).all(sanitizedFts);
  console.log('FTS Rows:', ftsRows);
} catch (e) {
  console.error('FTS error:', e.message);
}
