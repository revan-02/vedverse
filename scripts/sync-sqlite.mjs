import { MongoClient } from 'mongodb';
import Database from 'better-sqlite3';
import fs from 'fs';

const MONGODB_URI = 'mongodb://127.0.0.1:27017';
const db = new Database('data/vedaverse.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const schemaSql = fs.readFileSync('src/lib/db/schema.sql', 'utf8');
db.exec(schemaSql);

async function sync() {
  console.log('Synchronizing SQLite with MongoDB data...');
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const mongo = client.db('vedaverse');

  // Sync traditions first
  const traditions = await mongo.collection('traditions').find({}).toArray();
  const insTrad = db.prepare(`
    INSERT OR REPLACE INTO traditions (id, name, description, period, canonical_order)
    VALUES (?, ?, ?, ?, ?)
  `);
  for (const tr of traditions) {
    insTrad.run(tr.id, tr.name, tr.description, tr.period, tr.canonical_order);
  }

  // Sync texts
  const texts = await mongo.collection('texts').find({}).toArray();
  const insText = db.prepare(`
    INSERT OR REPLACE INTO texts (id, tradition_id, slug, title_devanagari, title_iast, title_en, corpus_type, description, historical_period, verified_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const t of texts) {
    insText.run(t.id, t.tradition_id, t.slug, t.title_devanagari, t.title_iast, t.title_en, t.corpus_type, t.description, t.historical_period, t.verified_status);
  }

  // Sync passages
  const passages = await mongo.collection('passages').find({}).toArray();
  const insPassage = db.prepare(`
    INSERT OR REPLACE INTO passages (id, text_id, canonical_ref, verse_number, sanskrit_devanagari, sanskrit_iast, meter, rishi, devata, why_selected_default, verified_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insFts = db.prepare(`
    INSERT OR REPLACE INTO passages_fts (passage_id, canonical_ref, sanskrit_devanagari, sanskrit_iast, translation_en, concepts)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const insTrans = db.prepare(`
    INSERT OR REPLACE INTO translations (id, passage_id, language, translation_text, translator_name, source_reference, license_type, is_primary)
    VALUES (?, ?, 'en', ?, ?, ?, 'Public Domain', 1)
  `);

  for (const p of passages) {
    insPassage.run(
      p.id,
      p.text_id,
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
    insTrans.run(`${p.id}-tr1`, p.id, p.translation_en, p.translator_name, p.source_reference || null);
    try {
      insFts.run(p.id, p.canonical_ref, p.sanskrit_devanagari, p.sanskrit_iast, p.translation_en, p.why_selected_default || '');
    } catch {}
  }

  // Sync subject correlations
  const correlations = await mongo.collection('subject_correlations').find({}).toArray();
  const insCorr = db.prepare(`
    INSERT OR REPLACE INTO subject_correlations (id, subject, vedic_tradition, ancient_treatises, description, modern_parallels, diagram_type, key_passages_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const c of correlations) {
    insCorr.run(c.id, c.subject, c.vedic_tradition, c.ancient_treatises, c.description, c.modern_parallels, c.diagram_type || null, JSON.stringify(c.key_passages || []));
  }

  // Sync roadmap milestones
  const milestones = await mongo.collection('roadmap_milestones').find({}).toArray();
  const insMilestone = db.prepare(`
    INSERT OR REPLACE INTO roadmap_milestones (step, stage, title, vedic_focus, key_concept, scientific_parallel, duration_weeks)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const m of milestones) {
    insMilestone.run(m.step, m.stage, m.title, m.vedic_focus, m.key_concept, m.scientific_parallel, m.duration_weeks);
  }

  console.log(`✅ SQLite synchronized with ${texts.length} texts, ${passages.length} passages, and ${correlations.length} subject correlations!`);
  await client.close();
}

sync().catch(console.error);
