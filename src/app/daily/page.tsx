import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { Calendar, Bookmark, Share2, BookOpen, ShieldCheck, ArrowRight, Network } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DailyWisdomPage() {
  const db = getDb();

  // Deterministically select today's passage based on day of year
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  const allPassages = db.prepare(`
    SELECT 
      p.id, p.canonical_ref, p.sanskrit_devanagari, p.sanskrit_iast, p.meter, p.rishi, p.devata, p.why_selected_default,
      t.title_en as text_name, t.slug as text_slug,
      tr.translation_text as translation_en, tr.translator_name
    FROM passages p
    JOIN texts t ON t.id = p.text_id
    LEFT JOIN translations tr ON tr.passage_id = p.id AND tr.is_primary = 1
    ORDER BY p.id ASC
  `).all() as any[];

  const todayIndex = dayOfYear % allPassages.length;
  const todayPassage = allPassages[todayIndex] || allPassages[0];

  // Associated concepts
  const concepts = db.prepare(`
    SELECT c.id, c.slug, c.sanskrit_term, c.english_title
    FROM passage_concepts pc
    JOIN concepts c ON c.id = pc.concept_id
    WHERE pc.passage_id = ?
  `).all(todayPassage.id) as any[];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER */}
      <div className="text-center space-y-2 border-b border-stone-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200 mb-2">
          <Calendar className="w-3.5 h-3.5 text-amber-700" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Daily Verified Vedic Wisdom
        </h1>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Every daily passage originates directly from the verified canonical database. Zero fabricated quotes.
        </p>
      </div>

      {/* DAILY CARD HERO */}
      <div className="bg-white border-2 border-amber-900/20 rounded-3xl p-6 sm:p-12 shadow-sm space-y-8 text-center relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 text-xs">
          <span className="font-semibold text-stone-500">{todayPassage.text_name}</span>
          <span className="font-serif font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {todayPassage.canonical_ref}
          </span>
        </div>

        {/* Devanagari */}
        <div className="py-2">
          <p className="sanskrit-text text-2xl sm:text-4xl text-stone-900 leading-relaxed font-normal">
            {todayPassage.sanskrit_devanagari}
          </p>
        </div>

        {/* IAST */}
        <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-100 max-w-2xl mx-auto">
          <p className="iast-text text-sm sm:text-base text-stone-700 leading-relaxed">
            {todayPassage.sanskrit_iast}
          </p>
        </div>

        {/* Translation */}
        <div className="max-w-2xl mx-auto space-y-2">
          <p className="text-lg sm:text-xl text-stone-900 font-serif italic leading-relaxed">
            "{todayPassage.translation_en}"
          </p>
          <p className="text-xs text-stone-400">
            Translation by {todayPassage.translator_name}
          </p>
        </div>

        {/* Why Selected Context */}
        {todayPassage.why_selected_default && (
          <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 text-xs text-amber-950 text-left max-w-2xl mx-auto">
            <strong className="text-amber-900 block mb-0.5 uppercase tracking-wide text-[10px]">
              Daily Reflection & Philosophical Context:
            </strong>
            <p className="leading-relaxed">{todayPassage.why_selected_default}</p>
          </div>
        )}

        {/* Associated Concepts */}
        {concepts.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-stone-500 font-medium">Related Concepts:</span>
            {concepts.map((c) => (
              <Link
                key={c.id}
                href={`/concepts/${c.slug}`}
                className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 transition"
              >
                <span className="font-serif font-bold text-amber-900">{c.sanskrit_term}</span> ({c.english_title})
              </Link>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-3 pt-4 border-t border-stone-100 text-xs">
          <Link
            href={`/library/${todayPassage.text_slug}/${todayPassage.id}`}
            className="px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 font-semibold transition flex items-center gap-1.5"
          >
            <span>Explore Full Word-by-Word Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
