import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { Network, ArrowRight, BookOpen, Layers, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ConceptsPage() {
  const db = getDb();
  const concepts = db.prepare('SELECT * FROM concepts ORDER BY id ASC').all() as any[];

  // For each concept, get count of linked passages
  const conceptCards = concepts.map(c => {
    const pCount = (db.prepare('SELECT count(*) as count FROM passage_concepts WHERE concept_id = ?').get(c.id) as any)?.count || 0;
    return { ...c, passageCount: pCount };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            Ontological Knowledge Graph
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-0.5">
            Vedic Concept Explorer
          </h1>
          <p className="text-xs text-stone-500 max-w-2xl mt-1 leading-relaxed">
            Interconnected philosophical taxonomy mapping the foundational concepts of Vedic thought with Sanskrit etymologies, primary source citations, and cross-conceptual links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
            {concepts.length} Canonical Concepts Indexed
          </span>
        </div>
      </div>

      {/* INTERACTIVE KNOWLEDGE GRAPH VISUALIZER MAP */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 space-y-6 shadow-md border border-stone-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-serif font-bold text-white">
              Semantic Node Topology
            </h2>
          </div>
          <span className="text-[11px] text-stone-400 font-mono">
            Direct & Applied Associations
          </span>
        </div>

        {/* Visual Graph Representation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
          {conceptCards.map((c) => (
            <Link
              key={c.id}
              href={`/concepts/${c.slug}`}
              className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700 hover:border-amber-500 hover:bg-stone-800 transition block group text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-300">
                  {c.english_title.split('(')[0].trim()}
                </span>
                <span className="text-[10px] font-mono text-stone-400 px-1.5 py-0.5 rounded bg-stone-700/60">
                  {c.passageCount} {c.passageCount === 1 ? 'ref' : 'refs'}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-mono italic mt-1">
                {c.iast_term}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* FULL CONCEPT CATALOG */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Complete Conceptual Index
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {conceptCards.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 hover:border-amber-400 hover:shadow-xs transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-xl font-bold text-stone-900">
                      {c.english_title}
                    </span>
                    <span className="text-xs font-mono text-amber-900 font-semibold italic">
                      ({c.iast_term})
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                  {c.category}
                </span>
              </div>

              {/* Etymology & Definition */}
              <div className="space-y-2 text-xs">
                <p className="text-stone-700 leading-relaxed font-medium">
                  {c.short_definition}
                </p>
                {c.etymology && (
                  <p className="text-[11px] text-amber-950 bg-amber-50/70 p-2.5 rounded border border-amber-200/60 font-mono">
                    <strong>Etymology:</strong> {c.etymology}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500">
                  Linked to {c.passageCount} primary textual {c.passageCount === 1 ? 'passage' : 'passages'}
                </span>
                <Link
                  href={`/concepts/${c.slug}`}
                  className="font-semibold text-amber-900 hover:text-amber-800 flex items-center gap-1"
                >
                  <span>Explore Concept Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
