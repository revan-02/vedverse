import { getDb } from '@/lib/db';
import { VerifiedPassage } from '@/types';

export interface CitationVerificationResult {
  isValid: boolean;
  verifiedPassages: VerifiedPassage[];
  unverifiedIds: string[];
  groundednessScore: number; // 0.0 to 1.0
  validationNotes: string[];
}

export function verifyCitations(
  citedIds: string[],
  retrievedPassages: VerifiedPassage[]
): CitationVerificationResult {
  const db = getDb();
  const verified: VerifiedPassage[] = [];
  const unverified: string[] = [];
  const notes: string[] = [];

  const retrievedMap = new Map<string, VerifiedPassage>();
  for (const p of retrievedPassages) {
    retrievedMap.set(p.id, p);
  }

  for (const id of citedIds) {
    // Check if ID is in database
    const dbPassage = db.prepare('SELECT id, canonical_ref, verified_status FROM passages WHERE id = ?').get(id) as any;
    
    if (dbPassage) {
      if (retrievedMap.has(id)) {
        verified.push(retrievedMap.get(id)!);
      } else {
        // Exists in DB but wasn't part of active retrieval context
        notes.push(`Passage ${id} exists in canonical database but was not in initial retrieval set.`);
      }
    } else {
      unverified.push(id);
      notes.push(`CRITICAL: Citation ${id} does NOT exist in canonical Vedic database. Flagged as hallucination.`);
    }
  }

  const groundednessScore = citedIds.length > 0
    ? (verified.length / citedIds.length)
    : (retrievedPassages.length > 0 ? 1.0 : 0.0);

  return {
    isValid: unverified.length === 0,
    verifiedPassages: verified,
    unverifiedIds: unverified,
    groundednessScore,
    validationNotes: notes
  };
}
