import Database from 'better-sqlite3';
import { MongoClient } from 'mongodb';

const links = [
  { passage_id: 'BG-2.62-63', concept_id: 'c-krodha', relevance: 1.0, note: 'Primary textual locus detailing genesis and psychological cascade of anger.' },
  { passage_id: 'BG-2.62-63', concept_id: 'c-indriya', relevance: 0.95, note: 'Sensory brooding leading to mental destabilization.' },
  { passage_id: 'BG-2.47', concept_id: 'c-karma', relevance: 1.0, note: 'Foundational doctrine of Nishkama Karma: action without entitlement to fruits.' },
  { passage_id: 'BG-3.35', concept_id: 'c-svadharma', relevance: 1.0, note: 'Authentic individual duty aligns with nature rather than imitating another.' },
  { passage_id: 'BG-3.35', concept_id: 'c-dharma', relevance: 0.9, note: 'Ethical duty aligned with natural disposition.' },
  { passage_id: 'RV-3.62.10', concept_id: 'c-vidya', relevance: 1.0, note: 'Gayatri invocation for intellectual discernment and higher illumination.' },
  { passage_id: 'RV-3.62.10', concept_id: 'c-dhyana', relevance: 0.9, note: 'Meditative focus on divine Savitr.' },
  { passage_id: 'RV-10.129.1', concept_id: 'c-brahman', relevance: 1.0, note: 'Nasadiya Sukta cosmic genesis beyond manifest/unmanifest.' },
  { passage_id: 'RV-10.129.1', concept_id: 'c-rta', relevance: 0.95, note: 'Cosmic law and primal order before creation.' },
  { passage_id: 'ISHA-1.1', concept_id: 'c-vairagya', relevance: 1.0, note: 'Renunciation and enjoyment without coveting.' },
  { passage_id: 'ISHA-1.1', concept_id: 'c-dharma', relevance: 0.9, note: 'Seeing all existence enveloped by the divine.' },
  { passage_id: 'BA-1.3.28', concept_id: 'c-satya', relevance: 1.0, note: 'Lead me from falsehood to eternal truth.' },
  { passage_id: 'BA-1.3.28', concept_id: 'c-moksha', relevance: 1.0, note: 'Lead me from mortality to immortality.' },
  { passage_id: 'KATHA-1.3.3', concept_id: 'c-atman', relevance: 1.0, note: 'The Self as lord of the chariot.' },
  { passage_id: 'KATHA-1.3.3', concept_id: 'c-indriya', relevance: 0.95, note: 'The senses as wild or restrained horses.' }
];

const db = new Database('data/vedaverse.db');
const insSqlite = db.prepare(`
  INSERT OR REPLACE INTO passage_concepts (passage_id, concept_id, relevance_score, contextual_note)
  VALUES (?, ?, ?, ?)
`);

for (const l of links) {
  insSqlite.run(l.passage_id, l.concept_id, l.relevance, l.note);
}
console.log('✅ SQLite passage_concepts populated with', links.length, 'mappings');

async function syncMongo() {
  try {
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    const mongo = client.db('vedaverse');
    for (const l of links) {
      await mongo.collection('passage_concepts').updateOne(
        { passage_id: l.passage_id, concept_id: l.concept_id },
        { $set: { relevance_score: l.relevance, contextual_note: l.note } },
        { upsert: true }
      );
    }
    console.log('✅ MongoDB passage_concepts populated');
    await client.close();
  } catch (e) {
    console.log('Mongo sync skipped or completed:', e.message);
  }
}

syncMongo();
