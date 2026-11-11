import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DB_DIR, 'vedaverse.db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// 1. Initialize Schema
const schemaPath = path.join(__dirname, '..', 'src', 'lib', 'db', 'schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');
db.exec(schemaSql);
console.log('✅ Relational schema initialized.');

// Import seed data from TypeScript file via transpilation or direct dynamic json
// Let's create an evaluation loader for seed-data
async function runSeed() {
  // Let's load the seed-data compiled or import dynamically
  const { SEED_DATA } = await import('../src/lib/corpus/seed-data.js').catch(async () => {
    // If not compiled yet, read directly or transpile using ts-node/esbuild or require
    // We can use a lightweight json exporter or direct object
    const tsFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'corpus', 'seed-data.ts'), 'utf8');
    // Extract JSON between SEED_DATA: SeedData = and ;
    const jsonMatch = tsFile.match(/export const SEED_DATA: SeedData = ([\s\S]+?);\n/);
    if (jsonMatch) {
      // Evaluate cleanly
      const fn = new Function(`return ${jsonMatch[1]}`);
      return { SEED_DATA: fn() };
    }
    throw new Error('Could not parse seed data TS');
  });

  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password_hash, name, role)
    VALUES (?, ?, ?, ?, ?)
  `);

  const passwordHash = await bcrypt.hash('vedaverse123', 10);
  insertUser.run('usr-admin', 'admin@vedaverse.org', passwordHash, 'VedaVerse Acharya', 'admin');
  insertUser.run('usr-scholar', 'scholar@vedaverse.org', passwordHash, 'Dr. Vedavati Sharma', 'scholar');
  insertUser.run('usr-seeker', 'seeker@vedaverse.org', passwordHash, 'Arjuna Seeker', 'user');
  console.log('✅ Default users seeded (admin, scholar, seeker).');

  // Insert Traditions
  const insertTradition = db.prepare(`
    INSERT OR REPLACE INTO traditions (id, name, description, period, canonical_order)
    VALUES (?, ?, ?, ?, ?)
  `);
  for (const t of SEED_DATA.traditions) {
    insertTradition.run(t.id, t.name, t.description, t.period, t.canonical_order);
  }

  // Insert Schools
  const insertSchool = db.prepare(`
    INSERT OR REPLACE INTO schools (id, name, tradition_id, description, prominent_scholars)
    VALUES (?, ?, ?, ?, ?)
  `);
  for (const s of SEED_DATA.schools) {
    insertSchool.run(s.id, s.name, s.tradition_id, s.description, s.prominent_scholars);
  }

  // Insert Texts
  const insertText = db.prepare(`
    INSERT OR REPLACE INTO texts (id, tradition_id, slug, title_devanagari, title_iast, title_en, corpus_type, description, historical_period, verified_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const t of SEED_DATA.texts) {
    insertText.run(t.id, t.tradition_id, t.slug, t.title_devanagari, t.title_iast, t.title_en, t.corpus_type, t.description, t.historical_period, t.verified_status);
  }

  // Insert Sections
  const insertSection = db.prepare(`
    INSERT OR REPLACE INTO sections (id, text_id, parent_section_id, section_type, section_number, title_devanagari, title_iast, title_en)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const s of SEED_DATA.sections) {
    insertSection.run(s.id, s.text_id, s.parent_section_id || null, s.section_type, s.section_number, s.title_devanagari, s.title_iast, s.title_en);
  }

  // Insert Concepts first for foreign key integrity
  const insertConcept = db.prepare(`
    INSERT OR REPLACE INTO concepts (id, slug, sanskrit_term, iast_term, english_title, short_definition, etymology, category, detailed_explanation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const c of SEED_DATA.concepts) {
    insertConcept.run(c.id, c.slug, c.sanskrit_term, c.iast_term, c.english_title, c.short_definition, c.etymology, c.category, c.detailed_explanation);
  }

  // Insert Passages, Words, Translations, Commentaries, Concepts, FTS
  const insertPassage = db.prepare(`
    INSERT OR REPLACE INTO passages (id, text_id, section_id, canonical_ref, verse_number, sanskrit_devanagari, sanskrit_iast, meter, rishi, devata, why_selected_default, verified_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertWord = db.prepare(`
    INSERT OR REPLACE INTO word_analyses (id, passage_id, word_order, sanskrit_word, iast_word, root, grammatical_tag, lexical_meaning)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertTranslation = db.prepare(`
    INSERT OR REPLACE INTO translations (id, passage_id, language, translation_text, translator_name, source_reference, license_type, is_primary)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertCommentary = db.prepare(`
    INSERT OR REPLACE INTO commentaries (id, passage_id, school_id, commentator_name, original_text, english_summary, tradition_tag)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertPassageConcept = db.prepare(`
    INSERT OR REPLACE INTO passage_concepts (passage_id, concept_id, relevance_score, contextual_note)
    VALUES (?, ?, ?, ?)
  `);

  const insertFts = db.prepare(`
    INSERT OR REPLACE INTO passages_fts (rowid, passage_id, canonical_ref, sanskrit_devanagari, sanskrit_iast, translation_en, concepts)
    VALUES ((SELECT rowid FROM passages_fts WHERE passage_id = ?), ?, ?, ?, ?, ?, ?)
  `);

  for (const p of SEED_DATA.passages) {
    insertPassage.run(
      p.id,
      p.text_id,
      p.section_id,
      p.canonical_ref,
      p.verse_number,
      p.sanskrit_devanagari,
      p.sanskrit_iast,
      p.meter || null,
      p.rishi || null,
      p.devata || null,
      p.why_selected_default || null,
      p.verified_status
    );

    // Words
    if (p.words) {
      db.prepare('DELETE FROM word_analyses WHERE passage_id = ?').run(p.id);
      for (const w of p.words) {
        insertWord.run(
          `${p.id}-w${w.word_order}`,
          p.id,
          w.word_order,
          w.sanskrit_word,
          w.iast_word,
          w.root || null,
          w.grammatical_tag || null,
          w.lexical_meaning
        );
      }
    }

    // Translations
    if (p.translations) {
      db.prepare('DELETE FROM translations WHERE passage_id = ?').run(p.id);
      let tIdx = 1;
      for (const tr of p.translations) {
        insertTranslation.run(
          `${p.id}-tr${tIdx++}`,
          p.id,
          tr.language,
          tr.translation_text,
          tr.translator_name,
          tr.source_reference,
          tr.license_type,
          tr.is_primary
        );
      }
    }

    // Commentaries
    if (p.commentaries) {
      db.prepare('DELETE FROM commentaries WHERE passage_id = ?').run(p.id);
      let cIdx = 1;
      for (const comm of p.commentaries) {
        insertCommentary.run(
          `${p.id}-comm${cIdx++}`,
          p.id,
          comm.school_id || null,
          comm.commentator_name,
          comm.original_text || null,
          comm.english_summary,
          comm.tradition_tag
        );
      }
    }

    // Concept associations
    if (p.concept_ids) {
      db.prepare('DELETE FROM passage_concepts WHERE passage_id = ?').run(p.id);
      for (const c of p.concept_ids) {
        insertPassageConcept.run(p.id, c.concept_id, c.relevance_score, c.contextual_note || null);
      }
    }

    // FTS sync
    const primaryTrans = p.translations?.find(t => t.language === 'en')?.translation_text || '';
    const conceptTags = p.concept_ids?.map(c => c.concept_id).join(' ') || '';
    
    // Clean old fts record if any
    db.prepare('DELETE FROM passages_fts WHERE passage_id = ?').run(p.id);
    db.prepare(`
      INSERT INTO passages_fts (passage_id, canonical_ref, sanskrit_devanagari, sanskrit_iast, translation_en, concepts)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(p.id, p.canonical_ref, p.sanskrit_devanagari, p.sanskrit_iast, primaryTrans, conceptTags);
  }


  // Insert Sources
  const insertSource = db.prepare(`
    INSERT OR REPLACE INTO sources (id, title, author, translator, publisher, publication_year, url, license, copyright_status, public_domain_flag)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const s of SEED_DATA.sources) {
    insertSource.run(s.id, s.title, s.author, s.translator, s.publisher, s.publication_year, s.url, s.license, s.copyright_status, s.public_domain_flag);
  }

  // Insert Courses & Lessons
  const insertCourse = db.prepare(`
    INSERT OR REPLACE INTO courses (id, slug, title, level, description, order_index)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const insertLesson = db.prepare(`
    INSERT OR REPLACE INTO lessons (id, course_id, slug, title, order_index, content_markdown, estimated_minutes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertQuiz = db.prepare(`
    INSERT OR REPLACE INTO quiz_questions (id, lesson_id, question_text, options_json, correct_option_index, explanation)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const crs of SEED_DATA.courses) {
    insertCourse.run(crs.id, crs.slug, crs.title, crs.level, crs.description, crs.order_index);
    if (crs.lessons) {
      for (const les of crs.lessons) {
        insertLesson.run(les.id, crs.id, les.slug, les.title, les.order_index, les.content_markdown, les.estimated_minutes);
        if (les.quizzes) {
          db.prepare('DELETE FROM quiz_questions WHERE lesson_id = ?').run(les.id);
          let qIdx = 1;
          for (const q of les.quizzes) {
            insertQuiz.run(
              `${les.id}-q${qIdx++}`,
              les.id,
              q.question_text,
              JSON.stringify(q.options),
              q.correct_option_index,
              q.explanation
            );
          }
        }
      }
    }
  }

  console.log(`✅ Seed complete: ${SEED_DATA.texts.length} texts, ${SEED_DATA.passages.length} passages, ${SEED_DATA.concepts.length} concepts, ${SEED_DATA.courses.length} courses loaded.`);
}

runSeed().catch(err => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});
