import { processVedaVerseQuery } from '../src/lib/rag/engine.ts';

const queries = [
  "What do the Vedas say about controlling anger?",
  "What does the Vedas say about choosing a software engineering career?",
  "How can I find peace of mind and deal with anxiety?",
  "What is the nature of consciousness and the self?",
  "What do ancient texts say about the creation of the universe?",
  "What is Nishkama Karma?",
  "What do the texts say about dealing with grief and death?",
  "How should a leader practice ethical decision making?"
];

async function runTests() {
  console.log("=== RUNNING RAG QUERY ENGINE TESTS ===");
  for (const q of queries) {
    try {
      const res = await processVedaVerseQuery(q);
      console.log(`\n--------------------------------------------------`);
      console.log(`Query: "${q}"`);
      console.log(`Direct Answer Exists: ${res.direct_answer_exists}`);
      console.log(`Concepts: ${res.detected_concepts.map(c => c.term).join(', ')}`);
      console.log(`Primary Sources: ${res.primary_sources.map(p => p.canonical_ref).join(', ')}`);
      if (res.no_direct_answer_disclaimer) {
        console.log(`Disclaimer: ${res.no_direct_answer_disclaimer}`);
      }
      console.log(`Literal (start): ${res.literal_explanation.slice(0, 100)}...`);
      console.log(`AI Explanation (start): ${res.ai_explanation.slice(0, 120)}...`);
      console.log(`Modern App (start): ${res.modern_application.slice(0, 100)}...`);
      console.log(`Citations Verified: ${res.citations_verified}`);
    } catch (err) {
      console.error(`FAILED for query: "${q}":`, err);
    }
  }
}

runTests();
