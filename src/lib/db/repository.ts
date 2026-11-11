import { getMongoDb } from './mongodb';
import { getDb } from './index';

export interface SubjectCorrelation {
  id: string;
  subject: string;
  vedic_tradition: string;
  ancient_treatises: string;
  description: string;
  modern_parallels: string;
  diagram_type?: string;
  key_passages: string[];
}

export interface RoadmapMilestone {
  step: number;
  stage: string;
  title: string;
  vedic_focus: string;
  key_concept: string;
  scientific_parallel: string;
  duration_weeks: number;
}

export interface MantraData {
  id: string;
  title: string;
  canonical_ref: string;
  sanskrit: string;
  iast: string;
  meter: string;
  fundamental_hz: number;
  meaning: string;
  phonetic_syllables: string[];
}

export async function getDbTexts() {
  try {
    const mongo = await getMongoDb();
    const texts = await mongo.collection('texts').find({}).toArray();
    if (texts && texts.length > 0) return texts;
  } catch (err) {
    // Fallback to SQLite
  }

  const db = getDb();
  return db.prepare('SELECT * FROM texts ORDER BY id').all();
}

export async function getDbPassages(filter: { query?: string; text_id?: string; limit?: number } = {}) {
  const { query, text_id, limit = 20 } = filter;

  try {
    const mongo = await getMongoDb();
    const mongoFilter: any = {};
    if (text_id) mongoFilter.text_id = text_id;
    if (query) {
      mongoFilter.$or = [
        { canonical_ref: { $regex: query, $options: 'i' } },
        { sanskrit_devanagari: { $regex: query, $options: 'i' } },
        { sanskrit_iast: { $regex: query, $options: 'i' } },
        { translation_en: { $regex: query, $options: 'i' } },
        { why_selected_default: { $regex: query, $options: 'i' } }
      ];
    }
    const passages = await mongo.collection('passages').find(mongoFilter).limit(limit).toArray();
    if (passages && passages.length > 0) return passages;
  } catch (err) {
    // Fallback to SQLite
  }

  const db = getDb();
  let sql = 'SELECT * FROM passages';
  const params: any[] = [];
  if (text_id) {
    sql += ' WHERE text_id = ?';
    params.push(text_id);
  }
  sql += ` LIMIT ${limit}`;
  return db.prepare(sql).all(...params);
}

export async function getDbSubjectCorrelations(): Promise<SubjectCorrelation[]> {
  try {
    const mongo = await getMongoDb();
    const correlations = await mongo.collection('subject_correlations').find({}).toArray();
    if (correlations && correlations.length > 0) return correlations as any[];
  } catch (err) {
    // Fallback to SQLite
  }

  const db = getDb();
  const rows = db.prepare('SELECT * FROM subject_correlations').all() as any[];
  return rows.map(r => ({
    ...r,
    key_passages: r.key_passages_json ? JSON.parse(r.key_passages_json) : []
  }));
}

export async function getDbRoadmapMilestones(): Promise<RoadmapMilestone[]> {
  try {
    const mongo = await getMongoDb();
    const milestones = await mongo.collection('roadmap_milestones').find({}).sort({ step: 1 }).toArray();
    if (milestones && milestones.length > 0) return milestones as any[];
  } catch (err) {
    // Fallback to SQLite
  }

  const db = getDb();
  return db.prepare('SELECT * FROM roadmap_milestones ORDER BY step ASC').all() as any[];
}

export async function getDbCosmologicalPassages() {
  const cosmicIds = [
    'RV-10.129.1', 'RV-10.90.1', 'RV-10.121.1',
    'AV-10.7.1', 'AV-12.1.12', 'SV-1.1.1',
    'YV-32.1', 'VP-1.2.22', 'VP-1.3.15', 'GP-2.1.32'
  ];

  try {
    const mongo = await getMongoDb();
    const passages = await mongo.collection('passages').find({
      id: { $in: cosmicIds }
    }).toArray();
    if (passages && passages.length > 0) return passages;
  } catch (err) {
    // Fallback to SQLite
  }

  const db = getDb();
  const placeholders = cosmicIds.map(() => '?').join(',');
  return db.prepare(`SELECT * FROM passages WHERE id IN (${placeholders})`).all(...cosmicIds);
}

export async function getDbConcepts() {
  try {
    const mongo = await getMongoDb();
    const concepts = await mongo.collection('concepts').find({}).toArray();
    if (concepts && concepts.length > 0) return concepts;
  } catch (err) {
    // Fallback to SQLite
  }

  const db = getDb();
  return db.prepare('SELECT * FROM concepts ORDER BY english_title ASC').all();
}

export async function getDbMantras(): Promise<MantraData[]> {
  try {
    const mongo = await getMongoDb();
    const mantras = await mongo.collection('mantras').find({}).toArray();
    if (mantras && mantras.length > 0) return mantras as any[];
  } catch (err) {
    // Fallback
  }

  return [];
}

