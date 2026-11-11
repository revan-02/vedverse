import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { ArrowLeft, BookOpen, Network, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ConceptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = getDb();

  const concept = db.prepare('SELECT * FROM concepts WHERE slug = ?').get(slug) as any;
  if (!concept) {
    notFound();
  }

  // Fetch linked passages
  const linkedPassages = db.prepare(`
    SELECT 
      p.id, p.canonical_ref, p.sanskrit_devanagari, p.sanskrit_iast,
      t.title_en as text_name, t.slug as text_slug,
      tr.translation_text as translation_en, tr.translator_name,
      pc.relevance_score, pc.contextual_note
    FROM passage_concepts pc
    JOIN passages p ON p.id = pc.passage_id
    JOIN texts t ON t.id = p.text_id
    LEFT JOIN translations tr ON tr.passage_id = p.id AND tr.is_primary = 1
    WHERE pc.concept_id = ?
    ORDER BY pc.relevance_score DESC
  `).all(concept.id) as any[];

  // Fetch other related concepts in the same category or adjacent
  const otherConcepts = db.prepare(`
    SELECT id, slug, sanskrit_term, english_title
    FROM concepts
    WHERE id != ?
    LIMIT 4
  `).all(concept.id) as any[];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* BREADCRUMB */}
      <div className="flex items-center space-x-2 text-xs text-stone-500 border-b border-stone-200 pb-4">
        <Link href="/concepts" className="hover:text-stone-900 transition flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Concepts</span>
        </Link>
        <span>/</span>
        <span className="text-amber-900 font-bold">{concept.english_title}</span>
      </div>

      {/* CONCEPT HEADER HERO */}
      <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 sm:p-10 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
              {concept.category}
            </span>
            <div className="flex items-baseline gap-3 mt-2">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
                {concept.english_title}
              </h1>
              <span className="text-base sm:text-lg font-mono text-amber-900 font-semibold italic">
                ({concept.iast_term})
              </span>
            </div>
            <h2 className="text-xs uppercase tracking-wider font-bold text-stone-500 mt-1">
              Category: {concept.category}
            </h2>
          </div>

          <div className="text-right">
            <span className="text-xs text-stone-500 block">Grounding Passages</span>
            <span className="text-2xl font-serif font-bold text-stone-900">
              {linkedPassages.length}
            </span>
          </div>
        </div>

        {/* Short definition & Etymology */}
        <div className="space-y-4 pt-2 border-t border-stone-100">
          <p className="text-base text-stone-800 leading-relaxed font-serif">
            {concept.short_definition}
          </p>

          {concept.etymology && (
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs text-stone-700 font-mono">
              <strong className="text-stone-900 block mb-0.5 uppercase tracking-wide text-[10px]">
                Sanskrit Etymology & Root Analysis
              </strong>
              {concept.etymology}
            </div>
          )}

          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Philosophical Exegesis
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed">
              {concept.detailed_explanation}
            </p>
          </div>
        </div>
      </div>

      {/* PRIMARY SOURCE PASSAGES LINKED TO THIS CONCEPT */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Verified Textual Passages Grounding {concept.english_title} ({concept.iast_term})
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            {linkedPassages.length} Citations Found
          </span>
        </div>

        <div className="space-y-4">
          {linkedPassages.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 hover:border-amber-400 hover:shadow-xs transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-stone-900 text-base">
                    {p.canonical_ref}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    {p.text_name}
                  </span>
                </div>

                <Link
                  href={`/library/${p.text_slug}/${p.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-950 transition"
                >
                  <span>Examine Passage</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-1">
                  Original Sanskrit (IAST Roman Script)
                </span>
                <p className="font-mono text-sm text-stone-800 leading-relaxed font-medium">
                  {p.sanskrit_iast}
                </p>
              </div>
              <p className="text-sm text-stone-800 font-serif italic">
                "{p.translation_en}"
              </p>

              {p.contextual_note && (
                <div className="text-xs text-emerald-900 bg-emerald-50/70 p-2.5 rounded border border-emerald-200/60">
                  <strong>Relevance Note:</strong> {p.contextual_note}
                </div>
              )}
            </div>
          ))}

          {linkedPassages.length === 0 && (
            <div className="p-8 text-center bg-white border border-stone-200 rounded-xl text-stone-500 text-sm">
              No direct passages currently linked.
            </div>
          )}
        </div>
      </div>

      {/* RELATED CONCEPTS */}
      <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-2">
          <Network className="w-4 h-4 text-amber-800" />
          Related Conceptual Nodes
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {otherConcepts.map((oc) => (
            <Link
              key={oc.id}
              href={`/concepts/${oc.slug}`}
              className="bg-white p-3 rounded-xl border border-stone-200 hover:border-amber-500 transition block text-center"
            >
              <span className="sanskrit-text text-base font-bold text-amber-900 block">
                {oc.sanskrit_term}
              </span>
              <span className="text-xs font-medium text-stone-700 mt-1 block">
                {oc.english_title.split('(')[0]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
