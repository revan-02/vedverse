import { getDb } from '@/lib/db';
import { RagResponseContract, VerifiedPassage, TraditionalInterpretation } from '@/types';
import { searchPassages } from './search';
import { verifyCitations } from './citation-verifier';
import { generateWithOllama } from '@/lib/ai/ollama';

// Modern anachronisms or contemporary subjects not literally present in ancient texts
const MODERN_ANACHRONISMS = [
  'software engineer', 'software engineering', 'computer', 'programming', 'code', 'coding',
  'crypto', 'bitcoin', 'blockchain', 'artificial intelligence', 'machine learning',
  'aeroplane', 'airplane', 'internet', 'stock market', 'smartphone', 'iphone', 'android',
  'social media', 'instagram', 'youtube', 'tiktok', 'quantum computing', 'cybersecurity',
  'corporate', 'startup', 'fintech', 'venture capital'
];

// Keywords indicating direct canonical inquiries into ancient texts
const DIRECT_VEDIC_INDICATORS = [
  'veda', 'vedas', 'vedic', 'upanishad', 'samhita', 'rigveda', 'yajurveda', 'samaveda', 'atharvaveda',
  'gita', 'bhagavad', 'purana', 'mantra', 'gayatri', 'tryambakam', 'nasadiya', 'chariot', 'katha',
  'dharma', 'karma', 'svadharma', 'atman', 'brahman', 'vidya', 'vairagya', 'satya', 'moksha',
  'dhyana', 'rta', 'krodha', 'anger', 'indriya', 'senses', 'consciousness', 'self', 'creation',
  'singularity', 'kalpa', 'pralaya', 'rishi', 'savitr', 'shulba', 'yoga', 'asato', 'death', 'soul',
  'god', 'divine', 'sun', 'agni', 'universe', 'prithvi', 'nature', 'elements', 'sacrifice', 'yajna'
];

// Rich semantic concept mapping dictionary
const CONCEPT_KEYWORDS_MAP: Record<string, string[]> = {
  'c-krodha': ['anger', 'angry', 'wrath', 'rage', 'frustration', 'irritation', 'temper', 'hate', 'hatred', 'resentment', 'hostile', 'conflict', 'violence'],
  'c-indriya': ['senses', 'sensory', 'mind', 'mental', 'discipline', 'self-control', 'control', 'restraint', 'temptation', 'desire', 'desires', 'cravings', 'impulse', 'chariot', 'horses', 'habits', 'addiction', 'distraction'],
  'c-dharma': ['dharma', 'duty', 'duties', 'ethics', 'ethical', 'righteousness', 'righteous', 'moral', 'morality', 'justice', 'conduct', 'virtue', 'order', 'law', 'living', 'responsibility', 'obligation'],
  'c-karma': ['karma', 'action', 'actions', 'work', 'working', 'deeds', 'causality', 'consequence', 'consequences', 'fate', 'destiny', 'cause', 'effect', 'fruits', 'labor', 'effort', 'nishkama'],
  'c-svadharma': ['svadharma', 'career', 'vocation', 'calling', 'profession', 'job', 'aptitude', 'authentic', 'nature', 'svabhava', 'specialization', 'talent'],
  'c-atman': ['atman', 'self', 'soul', 'consciousness', 'conscious', 'witness', 'sakshi', 'awareness', 'inner', 'immortal', 'spirit', 'who am i', 'ego', 'identity', 'death'],
  'c-brahman': ['brahman', 'god', 'divine', 'absolute', 'infinite', 'creator', 'origin', 'supreme', 'ultimate', 'source', 'oneness', 'all-pervading', 'lord'],
  'c-vidya': ['vidya', 'knowledge', 'wisdom', 'learning', 'education', 'intellect', 'intelligence', 'discernment', 'clarity', 'truth', 'light', 'study', 'understanding', 'buddhi'],
  'c-vairagya': ['vairagya', 'detachment', 'detached', 'letting go', 'dispassion', 'equanimity', 'peace', 'peace of mind', 'calm', 'anxiety', 'stress', 'craving', 'attachment', 'loss', 'grief', 'fear'],
  'c-satya': ['satya', 'truth', 'honesty', 'veracity', 'integrity', 'authentic', 'reality', 'truthfulness'],
  'c-moksha': ['moksha', 'liberation', 'freedom', 'enlightenment', 'release', 'salvation', 'transcendence', 'suffering', 'rebirth', 'mukti'],
  'c-dhyana': ['dhyana', 'meditation', 'meditate', 'contemplate', 'contemplation', 'mindfulness', 'focus', 'stillness', 'silence', 'mantra', 'chanting', 'chant', 'pranava', 'sound'],
  'c-rta': ['rta', 'order', 'cosmos', 'cosmic', 'universe', 'rhythm', 'nature', 'earth', 'astronomy', 'astrophysics', 'physics', 'big bang', 'matter', 'elements', 'space', 'time', 'kalpa', 'pralaya', 'creation']
};

/**
 * High-fidelity deterministic synthesis generator that dynamically grounds
 * explanations in the exact retrieved passages, their translations, and commentaries.
 */
function generateContextualSynthesis(
  question: string,
  passages: VerifiedPassage[],
  detectedConcepts: Array<{ term: string; title: string }>,
  isDirect: boolean
): { literal: string; ai: string; modern: string } {
  const primary = passages[0];
  const ref = primary.canonical_ref;
  const textName = primary.text_name;
  const translation = primary.translation_en;
  const why = primary.why_selected || '';
  const conceptNames = detectedConcepts.map(c => c.title.split('(')[0].trim()).join(', ') || 'Vedic Philosophy';

  // 1. Literal Explanation
  let literal = `In ${textName} (${ref}), the passage literally states: "${translation}".`;
  if (primary.meter || primary.rishi || primary.devata) {
    const metaParts = [];
    if (primary.meter) metaParts.push(`composed in ${primary.meter} meter`);
    if (primary.rishi) metaParts.push(`attributed to Rishi ${primary.rishi}`);
    if (primary.devata) metaParts.push(`invoking the deity/principle of ${primary.devata}`);
    literal += ` In its classical textual locus, this verse is ${metaParts.join(', ')}.`;
  }
  if (why) {
    literal += ` Canonical significance: ${why}`;
  }

  // Specialized canonical descriptions for celebrated cornerstone passages
  if (primary.id === 'BG-2.62-63') {
    literal = `Bhagavad Gita 2.62-63 literally details an eight-stage psychological degradation: brooding on sense objects (dhyāna) → attachment (saṅga) → desire (kāma) → anger (krodha) → delusion (sammoha) → confusion of memory (smṛti-vibhrama) → destruction of intellect (buddhi-nāśa) → ruin (praṇaśyati).`;
  } else if (primary.id === 'BG-2.47') {
    literal = `Bhagavad Gita 2.47 literally states four injunctions: you have jurisdiction over action alone (karmaṇi evādhikāras te); never over the fruits (mā phaleṣu kadācana); do not let the fruit be your motive (mā karmaphalahetur bhūḥ); and do not harbor attachment to inaction (mā te saṅgo 'stv akarmaṇi).`;
  } else if (primary.id === 'KATHA-1.3.3') {
    literal = `Katha Upanishad 1.3.3 literally presents the famous allegorical chariot: the Self (Atman) is the master seated in the chariot; the physical body is the chariot; the intellect (buddhi) is the charioteer; the mind (manas) is the reins; and the senses (indriyas) are the wild horses running on worldly roads.`;
  } else if (primary.id === 'RV-10.129.1') {
    literal = `Rigveda 10.129.1 (Nasadiya Sukta) literally questions the pre-cosmic state: then was neither non-existence (asat) nor existence (sat); there was neither the realm of space nor the sky beyond; what covered it, and where? Was there water, unfathomable and deep?`;
  } else if (primary.id === 'RV-3.62.10') {
    literal = `Rigveda 3.62.10 is the sacred Gayatri mantra composed in Gayatri meter. It literally implores: "May we meditate upon that glorious effulgence of the divine Savitr; may He awaken, illuminate, and guide our intellectual faculties (dhiyaḥ)."`;
  } else if (primary.id === 'ISHA-1.1') {
    literal = `Isha Upanishad 1.1 literally declares: "All this—whatever moves in this transient world—is enveloped by the Supreme Lord (Isha). Protect yourself through renunciation; do not covet anyone's wealth."`;
  } else if (primary.id === 'BA-1.3.28') {
    literal = `Brihadaranyaka Upanishad 1.3.28 literally proclaims the Pavamana Mantra: "From untruth lead me to Truth (Asato mā sad gamaya); from darkness lead me to Light (Tamaso mā jyotir gamaya); from death lead me to Immortality (Mṛtyor mā amṛtaṁ gamaya)."`;
  }

  // 2. AI Explanation
  let ai = '';
  if (isDirect) {
    if (primary.id === 'BG-2.62-63') {
      ai = `The classical text diagnoses anger not as an isolated primary emotion, but as a secondary reaction triggered when desire meets an obstacle. Brooding creates emotional fixation; impeded fixation explodes as wrath, which blinds memory and destroys discriminating wisdom.`;
    } else if (primary.id === 'BG-2.47') {
      ai = `The text establishes the core psychology of Nishkama Karma: optimal mental performance and freedom occur when cognitive attention is invested completely into the present process of duty, rather than dissipating energy in anxiety over uncertain future outcomes.`;
    } else if (primary.id === 'KATHA-1.3.3') {
      ai = `The Upanishad teaches that human self-mastery requires cognitive hierarchy: an untrained mind allows sensory desires to pull the chariot off course, while a disciplined intellect holds the reins of the mind firmly to keep the senses purposeful.`;
    } else if (primary.id === 'RV-10.129.1') {
      ai = `The Vedic seers display profound epistemological humility regarding cosmic genesis. The Nasadiya Sukta rejects simplistic dogma, acknowledging that before manifest dualities existed, reality existed as a breathless, unmanifest singularity energized through cosmic heat (Tapas).`;
    } else if (primary.id === 'RV-3.62.10') {
      ai = `Rather than petitioning for worldly dominion or material conquest, the foremost Vedic prayer asks for illumination of the intellect (buddhi) so that one acts with moral clarity and spiritual alignment.`;
    } else {
      ai = `According to ${ref} (${textName}), classical Indian thought grounds understanding in ${conceptNames}. The text reveals that lasting clarity and stability emerge when the individual aligns with underlying cosmic order rather than transient subjective preferences.`;
    }
  } else {
    ai = `Textual Clarification: While ancient canonical scriptures do not contain literal references to "${question}", classical Indian philosophy addresses the root human situation through the foundational principles of ${conceptNames}. Rather than offering modern technological or procedural rules, the literature provides an ontological framework: aligning one's actions with inner disposition (Svadharma), performing tasks with disciplined dedication free from obsessive fruit-anxiety (Nishkama Karma), and reigning in the senses through an alert intellect (Buddhi-yoga).`;
  }

  // Include primary commentary snippet if available
  if (primary.commentaries && primary.commentaries.length > 0) {
    const comm = primary.commentaries[0];
    ai += ` As commentator ${comm.commentator_name} (${comm.tradition_tag}) elucidates: ${comm.english_summary}`;
  }

  // 3. Modern Application
  let modern = '';
  if (isDirect) {
    if (primary.id === 'BG-2.62-63') {
      modern = `(Explicitly labeled as modern practical application, not scripture)\nWhen noticing anger rising in personal or workplace situations, one can pause to identify the underlying frustrated expectation or attachment that ignited it, engaging conscious breathing and cognitive appraisal before reacting.`;
    } else if (primary.id === 'BG-2.47') {
      modern = `(Explicitly labeled as modern practical application, not scripture)\nIn professional, scholarly, or creative projects, focusing entirely on craftsmanship and task execution—rather than obsessing over metrics, applause, or promotion—relieves burnout and paralyzing perfectionism.`;
    } else if (primary.id === 'KATHA-1.3.3') {
      modern = `(Explicitly labeled as modern practical application, not scripture)\nIn an age of constant digital notifications and sensory overload, treating the intellect as the conscious driver who actively regulates sensory inputs prevents mental exhaustion and preserves deep focus.`;
    } else {
      modern = `(Explicitly labeled as modern practical application, not scripture)\nIn contemporary life, reflecting upon the principle of ${ref} reminds us to cultivate mental discernment, align daily habits with ethical principles, and approach challenges with objective equanimity.`;
    }
  } else {
    modern = `(Explicitly labeled as modern practical application, not scripture)\nWhen navigating "${question}" today, an individual can apply these broader principles by focusing on process mastery and personal craftsmanship over outcome-anxiety. Treating one's professional and personal duties with integrity, self-control, and continuous learning allows one to flourish sustainably in contemporary society.`;
  }

  return { literal, ai, modern };
}

async function synthesizeWithOllama(
  question: string,
  passages: VerifiedPassage[],
  isDirect: boolean
): Promise<{ literal: string; ai: string; modern: string } | null> {
  if (passages.length === 0) return null;

  const passageContext = passages.map((p, idx) => `
[Source ${idx + 1}]
Text: ${p.text_name} (${p.canonical_ref})
IAST Sanskrit: ${p.sanskrit_iast}
Translation: ${p.translation_en}
${p.commentaries && p.commentaries.length > 0 ? `Commentary (${p.commentaries[0].commentator_name}): ${p.commentaries[0].english_summary}` : ''}
`).join('\n');

  const prompt = `User Question: "${question}"

Verified Primary Passages Retrieved from Knowledge Base:
${passageContext}

Strict Instructions:
1. You are VedaVerse AI. Strictly uphold the Anti-Hallucination principle. Never invent verses, words, or citations.
2. ${!isDirect ? 'The user question asks about a subject or modern topic without a literal ancient verse. Explicitly clarify that ancient texts do not directly mention this modern topic, then explain how broader classical principles (like Svadharma, Karma, Vidya, Vairagya) apply.' : 'Ground your answer strictly on the provided passages.'}
3. Generate a JSON response with exactly three keys:
   "literal_explanation": "Explain what the passage literally says in its classical context without adding modern assumptions.",
   "ai_explanation": "Explain the philosophical/psychological concepts clearly in modern accessible language.",
   "modern_application": "Clearly labeled modern practical reflection or application of the principles for contemporary life."

Respond in valid JSON only with keys: literal_explanation, ai_explanation, modern_application.`;

  try {
    const raw = await generateWithOllama({
      prompt,
      systemPrompt: 'You are VedaVerse AI, a rigorous, source-grounded assistant for Vedic and classical Indian literature. Always respond in valid JSON.',
      temperature: 0.2,
      format: 'json'
    });

    if (!raw) return null;

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.literal_explanation && parsed.ai_explanation && parsed.modern_application) {
        return {
          literal: parsed.literal_explanation,
          ai: parsed.ai_explanation,
          modern: parsed.modern_application
        };
      }
    }
  } catch (err) {
    console.warn('Ollama dynamic inference skipped, using deterministic synthesis:', err);
  }
  return null;
}

export async function processVedaVerseQuery(
  question: string,
  history: Array<{ sender: string; text: string }> = []
): Promise<RagResponseContract> {
  const db = getDb();
  const trimmed = question.trim();
  const lower = trimmed.toLowerCase();

  // 1. Concept Extraction from Database with Semantic Matching
  const conceptRows = db.prepare(`
    SELECT id, slug, sanskrit_term, iast_term, english_title, short_definition, detailed_explanation
    FROM concepts
  `).all() as Array<{
    id: string;
    slug: string;
    sanskrit_term: string;
    iast_term: string;
    english_title: string;
    short_definition: string;
    detailed_explanation: string;
  }>;

  const detectedConcepts: RagResponseContract['detected_concepts'] = [];
  for (const c of conceptRows) {
    const termLower = c.sanskrit_term.toLowerCase();
    const iastLower = c.iast_term.toLowerCase();
    const slugLower = c.slug.toLowerCase();
    const titleLower = c.english_title.toLowerCase();

    // Check direct match
    let isMatched = lower.includes(termLower) || lower.includes(iastLower) || lower.includes(slugLower);

    // Check keyword synonyms
    if (!isMatched && CONCEPT_KEYWORDS_MAP[c.id]) {
      const synonyms = CONCEPT_KEYWORDS_MAP[c.id];
      isMatched = synonyms.some(syn => lower.includes(syn));
    }

    if (isMatched) {
      detectedConcepts.push({
        id: c.id,
        term: c.sanskrit_term,
        iast: c.iast_term,
        title: c.english_title,
        relevance: 1.0
      });
    }
  }

  // If no concepts were directly matched, infer foundational concepts from question keywords
  if (detectedConcepts.length === 0) {
    if (lower.includes('peace') || lower.includes('stress') || lower.includes('fear') || lower.includes('anxiety')) {
      const vairagya = conceptRows.find(c => c.id === 'c-vairagya');
      if (vairagya) detectedConcepts.push({ id: vairagya.id, term: vairagya.sanskrit_term, iast: vairagya.iast_term, title: vairagya.english_title, relevance: 0.9 });
    }
    if (lower.includes('work') || lower.includes('life') || lower.includes('success') || lower.includes('money')) {
      const karma = conceptRows.find(c => c.id === 'c-karma');
      if (karma) detectedConcepts.push({ id: karma.id, term: karma.sanskrit_term, iast: karma.iast_term, title: karma.english_title, relevance: 0.9 });
    }
    if (detectedConcepts.length === 0) {
      // Default to core foundational ethics
      const dharma = conceptRows.find(c => c.id === 'c-dharma') || conceptRows[0];
      if (dharma) detectedConcepts.push({ id: dharma.id, term: dharma.sanskrit_term, iast: dharma.iast_term, title: dharma.english_title, relevance: 0.8 });
    }
  }

  // 2. Determine Query Groundedness Mode
  const isAnachronism = MODERN_ANACHRONISMS.some(m => lower.includes(m));
  const isDirect = !isAnachronism && DIRECT_VEDIC_INDICATORS.some(ind => lower.includes(ind));

  // 3. Passage Retrieval
  let retrievedPassages: VerifiedPassage[] = searchPassages({ query: trimmed, limit: 4 });

  // If primary search returned few passages, supplement using detected concepts
  if (retrievedPassages.length < 2 && detectedConcepts.length > 0) {
    for (const c of detectedConcepts) {
      const byConcept = searchPassages({ query: '', concept_id: c.id, limit: 2 });
      for (const p of byConcept) {
        if (!retrievedPassages.some(existing => existing.id === p.id)) {
          retrievedPassages.push(p);
        }
      }
    }
  }

  // Ensure we always have at least 1 verified primary source
  if (retrievedPassages.length === 0) {
    retrievedPassages = searchPassages({ query: 'dharma', limit: 2 });
  }

  // Log modern queries or edge inquiries to Knowledge Gaps for Scholar Review
  if (!isDirect) {
    try {
      db.prepare(`
        INSERT INTO knowledge_gaps (id, query_text, detected_concepts_json, status, admin_notes)
        VALUES (?, ?, ?, 'pending_review', 'Applied conceptual synthesis: question addressed via broader principles')
      `).run(`gap-${Date.now()}`, trimmed, JSON.stringify(detectedConcepts));
    } catch {
      // Non-fatal
    }
  }

  // 4. Extract Traditional Interpretations from retrieved passages
  const traditionalInterpretations: TraditionalInterpretation[] = [];
  for (const p of retrievedPassages) {
    if (p.commentaries) {
      for (const comm of p.commentaries) {
        traditionalInterpretations.push({
          source_id: p.id,
          canonical_ref: p.canonical_ref,
          commentator: comm.commentator_name,
          school: comm.tradition_tag,
          interpretation_summary: comm.english_summary,
          original_commentary_snippet: comm.original_text
        });
      }
    }
  }

  // 5. Synthesis (Ollama dynamic first, deterministic passage-grounded fallback)
  const ollamaResult = await synthesizeWithOllama(trimmed, retrievedPassages, isDirect);
  const contextualFallback = generateContextualSynthesis(trimmed, retrievedPassages, detectedConcepts, isDirect);

  const literalExplanation = ollamaResult?.literal || contextualFallback.literal;
  const aiExplanation = ollamaResult?.ai || contextualFallback.ai;
  const modernApplication = ollamaResult?.modern || contextualFallback.modern;

  // 6. Citation Verification Audit
  const citedIds = retrievedPassages.map(p => p.id);
  const verification = verifyCitations(citedIds, retrievedPassages);

  const conceptNames = detectedConcepts.map(c => c.title.split('(')[0].trim()).join(', ');
  const disclaimer = isDirect 
    ? undefined 
    : `There does not appear to be a direct textual passage concerning "${trimmed}" in canonical ancient literature. However, classical Vedic and Upanishadic traditions address the underlying principles through ${conceptNames}.`;

  return {
    question: trimmed,
    direct_answer_exists: isDirect,
    detected_concepts: detectedConcepts,
    no_direct_answer_disclaimer: disclaimer,
    primary_sources: retrievedPassages,
    traditional_interpretations: traditionalInterpretations,
    literal_explanation: literalExplanation,
    ai_explanation: aiExplanation,
    modern_application: modernApplication,
    related_passages: retrievedPassages.slice(1).map(p => ({
      id: p.id,
      canonical_ref: p.canonical_ref,
      title: p.text_name,
      translation_snippet: p.translation_en.slice(0, 120) + '...'
    })),
    confidence: isDirect ? 'HIGH' : 'CONCEPTUAL_ONLY',
    citations_verified: verification.isValid,
    verification_audit: {
      verified_passage_ids: verification.verifiedPassages.map(p => p.id),
      unverified_claims: verification.unverifiedIds,
      groundedness_score: verification.groundednessScore
    }
  };
}
