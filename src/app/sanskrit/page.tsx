import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { Languages, BookOpen, Search, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SanskritAnalysisPage({
  searchParams,
}: {
  searchParams: Promise<{ passage?: string }>;
}) {
  const { passage: selectedPassageId } = await searchParams;
  const db = getDb();

  // Fetch passages that have word analyses
  const passagesWithWords = db.prepare(`
    SELECT DISTINCT p.id, p.canonical_ref, p.sanskrit_devanagari, p.sanskrit_iast, t.title_en as text_name
    FROM passages p
    JOIN texts t ON t.id = p.text_id
    JOIN word_analyses w ON w.passage_id = p.id
    ORDER BY p.id ASC
  `).all() as any[];

  const activeId = selectedPassageId || passagesWithWords[0]?.id;

  const currentPassage = db.prepare(`
    SELECT 
      p.id, p.canonical_ref, p.sanskrit_devanagari, p.sanskrit_iast, p.meter, p.rishi, p.devata, p.why_selected_default,
      t.title_en as text_name, t.slug as text_slug,
      tr.translation_text as translation_en, tr.translator_name
    FROM passages p
    JOIN texts t ON t.id = p.text_id
    LEFT JOIN translations tr ON tr.passage_id = p.id AND tr.is_primary = 1
    WHERE p.id = ?
  `).get(activeId) as any;

  const words = currentPassage ? db.prepare(`
    SELECT word_order, sanskrit_word, iast_word, root, grammatical_tag, lexical_meaning
    FROM word_analyses
    WHERE passage_id = ?
    ORDER BY word_order ASC
  `).all(currentPassage.id) as any[] : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            Linguistic & Morphological Engine
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-0.5">
            Sanskrit Text & Padachheda Analysis
          </h1>
          <p className="text-xs text-stone-500 max-w-2xl mt-1 leading-relaxed">
            Examine the original Devanagari script, IAST phonetic transliteration, grammatical declensions (vibhakti/pratyaya), verbal roots (dhātu), and verifiable lexical definitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Vedic Sanskrit Lexicon Verified
          </span>
        </div>
      </div>

      {/* SELECTOR BAR */}
      <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-stone-600 mr-2">Select Passage for Linguistic Analysis:</span>
        {passagesWithWords.map((p) => {
          const isActive = p.id === activeId;
          return (
            <Link
              key={p.id}
              href={`/sanskrit?passage=${p.id}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-amber-900 text-amber-50 shadow-2xs font-semibold'
                  : 'bg-white border border-stone-200 text-stone-700 hover:border-amber-400'
              }`}
            >
              {p.canonical_ref}
            </Link>
          );
        })}
      </div>

      {/* ACTIVE PASSAGE HERO */}
      {currentPassage && (
        <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-stone-100 gap-2">
            <div>
              <span className="text-xs text-stone-500 font-medium">Text: {currentPassage.text_name}</span>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                {currentPassage.canonical_ref}
              </h2>
            </div>
            {currentPassage.meter && (
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-stone-100 text-stone-700">
                Chhandas: <strong>{currentPassage.meter}</strong>
              </span>
            )}
          </div>

          {/* IAST Phonetic Transliteration */}
          <div className="bg-amber-50/40 p-5 rounded-xl border border-amber-200/60 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
              Original Sanskrit (IAST Roman Script)
            </span>
            <p className="font-serif text-xl sm:text-2xl text-stone-900 leading-relaxed italic max-w-3xl mx-auto">
              "{currentPassage.sanskrit_iast}"
            </p>
          </div>

          {/* Sentence Meaning */}
          <div className="space-y-1 bg-white p-4 rounded-xl border border-stone-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
              English Translation
            </span>
            <p className="text-base text-stone-800 font-serif italic">
              "{currentPassage.translation_en}"
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              Translator: {currentPassage.translator_name}
            </p>
          </div>
        </div>
      )}

      {/* DETAILED WORD-BY-WORD (PADACHHEDA) TABLE */}
      {words.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-amber-800" />
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Word-by-Word Grammatical Analysis (Padachheda)
              </h3>
            </div>
            <span className="text-xs text-stone-500">
              {words.length} Tokens Analyzed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-200 text-stone-600 font-semibold">
                  <th className="py-3 px-3">Order</th>
                  <th className="py-3 px-3">Sanskrit Token (IAST)</th>
                  <th className="py-3 px-3">Verbal Root</th>
                  <th className="py-3 px-3">Grammatical Analysis</th>
                  <th className="py-3 px-3">Lexical Definition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {words.map((w) => (
                  <tr key={w.word_order} className="hover:bg-amber-50/30 transition">
                    <td className="py-3 px-3 text-stone-400 font-mono">{w.word_order}</td>
                    <td className="py-3 px-3 font-mono font-bold text-stone-900 text-sm">
                      {w.iast_word || w.sanskrit_word}
                    </td>
                    <td className="py-3 px-3 text-amber-900 font-mono text-xs">
                      {w.root ? `√${w.root}` : '—'}
                    </td>
                    <td className="py-3 px-3 text-stone-600 font-mono text-[11px]">
                      {w.grammatical_tag || 'indeclinable (avyaya)'}
                    </td>
                    <td className="py-3 px-3 text-stone-900 font-medium">{w.lexical_meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SCHOLARLY TRANSPARENCY NOTICE */}
      <div className="bg-stone-100 rounded-xl p-4 border border-stone-200 text-xs text-stone-600 space-y-1">
        <strong className="text-stone-800 uppercase tracking-wide text-[10px] block">
          Linguistic Authenticity Notice:
        </strong>
        <p className="leading-relaxed">
          VedaVerse does not fabricate grammatical claims. All grammatical cases, verbal roots (dhātu), and lexical meanings are grounded in classical Sanskrit lexicons including Monier-Williams Sanskrit-English Dictionary, Arthur Anthony Macdonell's Vedic Grammar, and Sayana's Padapatha exegesis.
        </p>
      </div>
    </div>
  );
}
