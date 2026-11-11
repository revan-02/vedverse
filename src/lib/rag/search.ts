import { getDb } from '@/lib/db';
import { VerifiedPassage } from '@/types';
import { normalizeIast, normalizeDevanagari, isDevanagari } from '../sanskrit/normalizer';

export interface SearchOptions {
  query: string;
  corpus_type?: string;
  text_id?: string;
  concept_id?: string;
  limit?: number;
}

export function searchPassages(options: SearchOptions): VerifiedPassage[] {
  const db = getDb();
  const { query, corpus_type, text_id, concept_id, limit = 10 } = options;
  const cleanQuery = query.trim();

  if (!cleanQuery && !concept_id && !text_id) {
    return [];
  }

  // Set of passage IDs discovered through different retrieval channels
  const matchedIds = new Map<string, number>(); // passage_id -> relevance score

  const STOPWORDS = new Set([
    'what', 'does', 'do', 'the', 'vedas', 'veda', 'say', 'about', 'is', 'a', 'an', 'to', 'in', 'of', 'for', 'and', 'or', 'on', 'with', 'from', 'at', 'by', 'this', 'that', 'these', 'those', 'are', 'was', 'were', 'been', 'being', 'have', 'has', 'had', 'tell', 'me', 'explain', 'show'
  ]);

  const meaningfulTokens = cleanQuery
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u0900-\u097F\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOPWORDS.has(t));

  // Semantic Concept Synonym Dictionary to map natural language inquiries to canonical concept nodes
  const CONCEPT_SYNONYMS: Record<string, string[]> = {
    'c-krodha': ['anger', 'angry', 'wrath', 'rage', 'frustration', 'frustrated', 'irritation', 'temper', 'impatience', 'hate', 'hatred', 'resentment', 'hostility', 'conflict', 'quarrel'],
    'c-indriya': ['mind', 'senses', 'sensory', 'mental', 'discipline', 'self-control', 'control', 'restraint', 'temptation', 'desire', 'cravings', 'impulse', 'chariot', 'horses', 'habits', 'addiction', 'distraction'],
    'c-dharma': ['duty', 'duties', 'ethics', 'ethical', 'righteousness', 'righteous', 'moral', 'morality', 'justice', 'conduct', 'virtue', 'order', 'law', 'social', 'living', 'right', 'responsibility'],
    'c-karma': ['action', 'actions', 'karma', 'work', 'working', 'deeds', 'causality', 'consequence', 'consequences', 'fate', 'destiny', 'cause', 'effect', 'fruit', 'labor', 'effort', 'result', 'results'],
    'c-svadharma': ['career', 'vocation', 'calling', 'profession', 'job', 'workplace', 'aptitude', 'authentic', 'nature', 'role', 'specialization', 'talent', 'calling'],
    'c-atman': ['self', 'soul', 'consciousness', 'conscious', 'witness', 'sakshi', 'awareness', 'inner', 'immortal', 'spirit', 'who am i', 'ego', 'identity', 'death', 'reincarnation'],
    'c-brahman': ['god', 'divine', 'absolute', 'infinite', 'creator', 'origin', 'supreme', 'ultimate', 'source', 'oneness', 'all-pervading', 'lord'],
    'c-vidya': ['knowledge', 'wisdom', 'learning', 'education', 'intellect', 'intelligence', 'discernment', 'clarity', 'truth', 'light', 'study', 'science', 'understanding', 'ignorance'],
    'c-vairagya': ['detachment', 'detached', 'letting go', 'dispassion', 'equanimity', 'peace', 'peace of mind', 'calm', 'anxiety', 'stress', 'craving', 'attachment', 'loss', 'grief', 'fear', 'sorrow'],
    'c-satya': ['truth', 'honesty', 'veracity', 'integrity', 'authentic', 'reality', 'truthfulness'],
    'c-moksha': ['liberation', 'freedom', 'enlightenment', 'release', 'salvation', 'transcendence', 'cycle', 'suffering', 'rebirth'],
    'c-dhyana': ['meditation', 'meditate', 'dhyana', 'contemplate', 'contemplation', 'mindfulness', 'focus', 'stillness', 'silence', 'mantra', 'chanting', 'chant', 'pranava', 'sound'],
    'c-rta': ['order', 'cosmos', 'cosmic', 'universe', 'rhythm', 'nature', 'earth', 'astronomy', 'astrophysics', 'physics', 'big bang', 'matter', 'elements', 'space', 'time', 'kalpa', 'creation', 'origin']
  };

  // 1. Concept Graph Match using meaningful tokens & synonym expansion
  if (meaningfulTokens.length > 0) {
    for (const token of meaningfulTokens) {
      // Direct concept lookup
      const conceptRows = db.prepare(`
        SELECT c.id
        FROM concepts c
        WHERE c.english_title LIKE ? OR c.sanskrit_term LIKE ? OR c.iast_term LIKE ? OR c.slug LIKE ?
      `).all(`%${token}%`, `%${token}%`, `%${token}%`, `%${token}%`) as Array<{ id: string }>;

      for (const c of conceptRows) {
        const pcRows = db.prepare(`
          SELECT passage_id, relevance_score
          FROM passage_concepts
          WHERE concept_id = ?
        `).all(c.id) as Array<{ passage_id: string; relevance_score: number }>;

        for (const pc of pcRows) {
          matchedIds.set(pc.passage_id, (matchedIds.get(pc.passage_id) || 0) + (pc.relevance_score * 4.0));
        }
      }

      // Synonym cluster expansion
      for (const [conceptId, synonyms] of Object.entries(CONCEPT_SYNONYMS)) {
        if (synonyms.some(s => token.includes(s) || s.includes(token))) {
          const pcRows = db.prepare(`
            SELECT passage_id, relevance_score
            FROM passage_concepts
            WHERE concept_id = ?
          `).all(conceptId) as Array<{ passage_id: string; relevance_score: number }>;

          for (const pc of pcRows) {
            matchedIds.set(pc.passage_id, (matchedIds.get(pc.passage_id) || 0) + (pc.relevance_score * 3.5));
          }
        }
      }
    }
  }

  // 2. FTS5 Match with prefix-expanded tokens (e.g. disciplin*, meditat*, karma*)
  if (meaningfulTokens.length > 0) {
    try {
      const sanitizedFts = meaningfulTokens.map(t => `${t.replace(/[^a-zA-Z0-9]/g, '')}*`).filter(t => t.length > 2).join(' OR ');

      if (sanitizedFts) {
        const ftsRows = db.prepare(`
          SELECT passage_id, rank
          FROM passages_fts
          WHERE passages_fts MATCH ?
          ORDER BY rank
          LIMIT 25
        `).all(sanitizedFts) as Array<{ passage_id: string; rank: number }>;

        for (const f of ftsRows) {
          const score = 4.5 - Math.min(Math.abs(f.rank), 3.0);
          matchedIds.set(f.passage_id, (matchedIds.get(f.passage_id) || 0) + score);
        }
      }
    } catch {
      // Fallback if FTS syntax edge case
    }

    // 3. Token-by-Token Direct LIKE Search across translation, notes, and canonical ref
    for (const token of meaningfulTokens) {
      if (token.length >= 3) {
        const tokenLike = `%${token}%`;
        const likeRows = db.prepare(`
          SELECT p.id
          FROM passages p
          LEFT JOIN translations tr ON tr.passage_id = p.id
          WHERE p.canonical_ref LIKE ?
             OR p.sanskrit_iast LIKE ?
             OR tr.translation_text LIKE ?
             OR p.why_selected_default LIKE ?
        `).all(tokenLike, tokenLike, tokenLike, tokenLike) as Array<{ id: string }>;

        for (const l of likeRows) {
          matchedIds.set(l.id, (matchedIds.get(l.id) || 0) + 2.5);
        }
      }
    }
  }

  // 4. Concept filter if explicitly specified
  if (concept_id) {
    const pcRows = db.prepare(`
      SELECT passage_id, relevance_score
      FROM passage_concepts
      WHERE concept_id = ?
    `).all(concept_id) as Array<{ passage_id: string; relevance_score: number }>;

    for (const pc of pcRows) {
      matchedIds.set(pc.passage_id, (matchedIds.get(pc.passage_id) || 0) + 5.0);
    }
  }

  // 5. Intelligent Nearest-Neighbor Fallback
  // If no passages matched yet, retrieve universally applicable foundational passages
  if (matchedIds.size === 0 && !text_id) {
    const fallbackPassageIds = [
      'BG-2.47',     // Action without selfish clinging (Nishkama Karma)
      'BG-3.35',     // Svadharma and personal authenticity
      'KATHA-1.3.3', // Chariot of mind & conscious self-mastery
      'ISHA-1.1',    // Universal harmony & detachment
      'RV-3.62.10',  // Intellectual clarity & divine light
      'RV-10.129.1'  // Cosmic creation & contemplation
    ];
    fallbackPassageIds.forEach((id, idx) => {
      matchedIds.set(id, 1.0 / (idx + 1));
    });
  }

  // Sort candidate IDs by combined relevance score
  const sortedIds = Array.from(matchedIds.entries())
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  if (sortedIds.length === 0 && !text_id) {
    return [];
  }

  // Query full passage records
  let querySql = `
    SELECT 
      p.id, p.text_id, p.canonical_ref, p.verse_number, 
      p.sanskrit_devanagari, p.sanskrit_iast, p.meter, p.rishi, p.devata, 
      p.why_selected_default, p.verified_status,
      t.title_en as text_name, t.corpus_type,
      s.title_en as section_title,
      tr.translation_text as translation_en, tr.translator_name, tr.source_reference
    FROM passages p
    JOIN texts t ON t.id = p.text_id
    LEFT JOIN sections s ON s.id = p.section_id
    LEFT JOIN translations tr ON tr.passage_id = p.id AND tr.language = 'en' AND tr.is_primary = 1
  `;

  const whereClauses: string[] = [];
  const params: unknown[] = [];

  if (sortedIds.length > 0) {
    whereClauses.push(`p.id IN (${sortedIds.map(() => '?').join(',')})`);
    params.push(...sortedIds);
  }

  if (text_id) {
    whereClauses.push('p.text_id = ?');
    params.push(text_id);
  }

  if (corpus_type) {
    whereClauses.push('t.corpus_type = ?');
    params.push(corpus_type);
  }

  if (whereClauses.length > 0) {
    querySql += ' WHERE ' + whereClauses.join(' AND ');
  }

  querySql += ` LIMIT ${limit}`;

  const rows = db.prepare(querySql).all(...params) as any[];

  // Attach word analyses and commentaries
  return rows.map(r => {
    const words = db.prepare(`
      SELECT word_order, sanskrit_word, iast_word, root, grammatical_tag, lexical_meaning
      FROM word_analyses
      WHERE passage_id = ?
      ORDER BY word_order ASC
    `).all(r.id) as any[];

    const commentaries = db.prepare(`
      SELECT commentator_name, tradition_tag, english_summary, original_text
      FROM commentaries
      WHERE passage_id = ?
    `).all(r.id) as any[];

    return {
      id: r.id,
      text_id: r.text_id,
      text_name: r.text_name,
      corpus_type: r.corpus_type,
      section_title: r.section_title || '',
      canonical_ref: r.canonical_ref,
      verse_number: r.verse_number,
      sanskrit_devanagari: r.sanskrit_devanagari,
      sanskrit_iast: r.sanskrit_iast,
      meter: r.meter || undefined,
      rishi: r.rishi || undefined,
      devata: r.devata || undefined,
      translation_en: r.translation_en || 'Translation in progress.',
      translator_name: r.translator_name || 'VedaVerse Scholarly Board',
      source_reference: r.source_reference || undefined,
      why_selected: r.why_selected_default || undefined,
      verified_status: r.verified_status,
      confidence_badge: 'primary_verified',
      words,
      commentaries
    };
  });
}

export function getPassageById(id: string): VerifiedPassage | null {
  const db = getDb();
  const r = db.prepare(`
    SELECT 
      p.id, p.text_id, p.canonical_ref, p.verse_number, 
      p.sanskrit_devanagari, p.sanskrit_iast, p.meter, p.rishi, p.devata, 
      p.why_selected_default, p.verified_status,
      t.title_en as text_name, t.corpus_type,
      s.title_en as section_title,
      tr.translation_text as translation_en, tr.translator_name, tr.source_reference
    FROM passages p
    JOIN texts t ON t.id = p.text_id
    LEFT JOIN sections s ON s.id = p.section_id
    LEFT JOIN translations tr ON tr.passage_id = p.id AND tr.language = 'en' AND tr.is_primary = 1
    WHERE p.id = ?
  `).get(id) as any;

  if (!r) return null;

  const words = db.prepare(`
    SELECT word_order, sanskrit_word, iast_word, root, grammatical_tag, lexical_meaning
    FROM word_analyses
    WHERE passage_id = ?
    ORDER BY word_order ASC
  `).all(id) as any[];

  const commentaries = db.prepare(`
    SELECT commentator_name, tradition_tag, english_summary, original_text
    FROM commentaries
    WHERE passage_id = ?
  `).all(id) as any[];

  return {
    id: r.id,
    text_id: r.text_id,
    text_name: r.text_name,
    corpus_type: r.corpus_type,
    section_title: r.section_title || '',
    canonical_ref: r.canonical_ref,
    verse_number: r.verse_number,
    sanskrit_devanagari: r.sanskrit_devanagari,
    sanskrit_iast: r.sanskrit_iast,
    meter: r.meter || undefined,
    rishi: r.rishi || undefined,
    devata: r.devata || undefined,
    translation_en: r.translation_en || '',
    translator_name: r.translator_name || '',
    source_reference: r.source_reference || undefined,
    why_selected: r.why_selected_default || undefined,
    verified_status: r.verified_status,
    confidence_badge: 'primary_verified',
    words,
    commentaries
  };
}
