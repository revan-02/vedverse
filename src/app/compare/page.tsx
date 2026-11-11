import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { Columns3, BookOpen, Scale, ArrowRight, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ passage?: string }>;
}) {
  const { passage: selectedPassageId } = await searchParams;
  const db = getDb();

  // Find passages with multiple commentaries
  const passagesWithCommentaries = db.prepare(`
    SELECT p.id, p.canonical_ref, p.sanskrit_devanagari, p.sanskrit_iast, count(c.id) as comm_count, t.title_en as text_name
    FROM passages p
    JOIN texts t ON t.id = p.text_id
    JOIN commentaries c ON c.passage_id = p.id
    GROUP BY p.id
    HAVING comm_count >= 1
    ORDER BY comm_count DESC, p.id ASC
  `).all() as any[];

  const activeId = selectedPassageId || passagesWithCommentaries[0]?.id;

  const activePassage = db.prepare(`
    SELECT 
      p.id, p.canonical_ref, p.sanskrit_devanagari, p.sanskrit_iast,
      t.title_en as text_name,
      tr.translation_text as translation_en, tr.translator_name
    FROM passages p
    JOIN texts t ON t.id = p.text_id
    LEFT JOIN translations tr ON tr.passage_id = p.id AND tr.is_primary = 1
    WHERE p.id = ?
  `).get(activeId) as any;

  const commentaries = activePassage ? db.prepare(`
    SELECT c.id, c.commentator_name, c.original_text, c.english_summary, c.tradition_tag, s.description as school_desc
    FROM commentaries c
    LEFT JOIN schools s ON s.id = c.school_id
    WHERE c.passage_id = ?
  `).all(activePassage.id) as any[] : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900">
            Multi-Tradition Exegesis Matrix
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-0.5">
            Compare Philosophical Interpretations
          </h1>
          <p className="text-xs text-stone-500 max-w-2xl mt-1 leading-relaxed">
            Side-by-side comparison of classical commentary traditions (Advaita Vedanta, Vishishtadvaita, Dvaita, and Sayana Veda Bhashya). VedaVerse does not declare one tradition universally authoritative.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-indigo-600" />
            Neutral Scholarly Representation
          </span>
        </div>
      </div>

      {/* PASSAGE SELECTION TABS */}
      <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-stone-600 mr-2">Select Passage to Compare:</span>
        {passagesWithCommentaries.map((p) => {
          const isActive = p.id === activeId;
          return (
            <Link
              key={p.id}
              href={`/compare?passage=${p.id}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-indigo-900 text-indigo-50 shadow-2xs font-semibold'
                  : 'bg-white border border-stone-200 text-stone-700 hover:border-indigo-400'
              }`}
            >
              {p.canonical_ref} ({p.comm_count} schools)
            </Link>
          );
        })}
      </div>

      {/* PASSAGE CARD */}
      {activePassage && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 font-semibold">{activePassage.text_name}</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-bold">
              {activePassage.canonical_ref}
            </span>
          </div>

          <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-200/60 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
              Original Sanskrit (IAST Roman Script)
            </span>
            <p className="font-serif text-lg sm:text-xl text-stone-900 leading-relaxed italic max-w-3xl mx-auto">
              "{activePassage.sanskrit_iast}"
            </p>
          </div>
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
              English Translation
            </span>
            <p className="text-sm sm:text-base text-stone-800 font-serif italic">
              "{activePassage.translation_en}"
            </p>
          </div>
        </div>
      )}

      {/* SIDE-BY-SIDE TRADITION COMPARISON MATRIX */}
      {commentaries.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-indigo-200 pb-2">
            <Columns3 className="w-5 h-5 text-indigo-800" />
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Hermeneutical Comparison Grid
            </h2>
          </div>

          <div className={`grid gap-6 ${
            commentaries.length === 1
              ? 'grid-cols-1 max-w-xl mx-auto'
              : commentaries.length === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {commentaries.map((comm, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-indigo-100 rounded-2xl p-6 space-y-4 hover:border-indigo-400 transition shadow-2xs flex flex-col justify-between text-left"
              >
                <div className="space-y-3">
                  <div className="border-b border-indigo-50 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 block">
                      {comm.tradition_tag}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-900 mt-0.5">
                      {comm.commentator_name}
                    </h3>
                    {comm.school_desc && (
                      <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                        {comm.school_desc}
                      </p>
                    )}
                  </div>

                  {comm.original_text && (
                    <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 text-xs">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-900 block mb-1">
                        Original Sanskrit Gloss
                      </span>
                      <p className="sanskrit-text text-stone-800 leading-relaxed font-serif">
                        {comm.original_text}
                      </p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Core Philosophical Argument
                    </span>
                    <p className="text-xs text-stone-800 leading-relaxed font-medium">
                      {comm.english_summary}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-400">
                  Tradition: {comm.tradition_tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PLURALISTIC TRADITION PRINCIPLE */}
      <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 text-xs text-stone-600 space-y-1">
        <strong className="text-stone-800 uppercase tracking-wide text-[10px] block">
          Epistemological Pluralism (Vāda Tradition & Classical Schools):
        </strong>
        <p className="leading-relaxed">
          The classical Indian tradition welcomes Rigorous philosophical debate (Vāda). Advaita, Vishishtadvaita, and Dvaita maintain distinct views regarding whether the individual soul (Jiva) is identical with, qualified by, or distinct from the supreme reality (Brahman). VedaVerse presents each tradition faithfully without imposing a synthetic homogeneity.
        </p>
      </div>
    </div>
  );
}
