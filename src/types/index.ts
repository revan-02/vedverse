export interface VerifiedPassage {
  id: string;
  text_id: string;
  text_name: string;
  corpus_type: string;
  section_title: string;
  canonical_ref: string;
  verse_number: string;
  sanskrit_devanagari: string;
  sanskrit_iast: string;
  meter?: string;
  rishi?: string;
  devata?: string;
  translation_en: string;
  translator_name: string;
  source_reference?: string;
  why_selected?: string;
  verified_status: string;
  confidence_badge: 'primary_verified' | 'traditional_commentary' | 'scholarly_secondary' | 'ai_analysis';
  words?: Array<{
    word_order: number;
    sanskrit_word: string;
    iast_word: string;
    root?: string;
    grammatical_tag?: string;
    lexical_meaning: string;
  }>;
  commentaries?: Array<{
    commentator_name: string;
    tradition_tag: string;
    english_summary: string;
    original_text?: string;
  }>;
}

export interface TraditionalInterpretation {
  source_id: string;
  canonical_ref: string;
  commentator: string;
  school: string;
  interpretation_summary: string;
  original_commentary_snippet?: string;
}

export interface RagResponseContract {
  question: string;
  direct_answer_exists: boolean;
  detected_concepts: Array<{
    id: string;
    term: string;
    iast: string;
    title: string;
    relevance: number;
  }>;
  no_direct_answer_disclaimer?: string;
  primary_sources: VerifiedPassage[];
  traditional_interpretations: TraditionalInterpretation[];
  literal_explanation: string;
  ai_explanation: string;
  modern_application: string;
  related_passages: Array<{
    id: string;
    canonical_ref: string;
    title: string;
    translation_snippet: string;
  }>;
  confidence: 'HIGH' | 'MEDIUM' | 'CONCEPTUAL_ONLY' | 'NO_SOURCE';
  citations_verified: boolean;
  verification_audit: {
    verified_passage_ids: string[];
    unverified_claims: string[];
    groundedness_score: number; // 0.0 - 1.0
  };
}

export interface SearchFilter {
  query: string;
  corpus_type?: string;
  concept?: string;
  text_id?: string;
}
