import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { BookOpen, Search, Filter, ShieldCheck, ChevronRight, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; q?: string; highlight?: string }>;
}) {
  const { type, q, highlight } = await searchParams;
  const db = getDb();

  // Fetch texts
  let textsSql = 'SELECT * FROM texts ORDER BY id';
  const texts = db.prepare(textsSql).all() as any[];

  // Fetch passages with filters
  let passagesSql = `
    SELECT 
      p.id, p.canonical_ref, p.verse_number, p.sanskrit_devanagari, p.sanskrit_iast, 
      p.meter, p.rishi, p.devata, p.why_selected_default,
      t.slug as text_slug, t.title_en as text_name, t.corpus_type,
      tr.translation_text as translation_en, tr.translator_name
    FROM passages p
    JOIN texts t ON t.id = p.text_id
    LEFT JOIN translations tr ON tr.passage_id = p.id AND tr.is_primary = 1
  `;

  const whereClauses: string[] = [];
  const params: unknown[] = [];

  if (type) {
    whereClauses.push('t.corpus_type = ?');
    params.push(type);
  }

  if (q) {
    whereClauses.push('(p.canonical_ref LIKE ? OR p.sanskrit_devanagari LIKE ? OR p.sanskrit_iast LIKE ? OR tr.translation_text LIKE ?)');
    const term = `%${q}%`;
    params.push(term, term, term, term);
  }

  if (whereClauses.length > 0) {
    passagesSql += ' WHERE ' + whereClauses.join(' AND ');
  }

  passagesSql += ' ORDER BY t.id, p.id';

  const passages = db.prepare(passagesSql).all(...params) as any[];

  const corpusTypes = ['All', 'Veda', 'Upanishad', 'Bhagavad Gita'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            Canonical Corpus
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-0.5">
            Vedic & Classical Library
          </h1>
          <p className="text-xs text-stone-500 max-w-2xl mt-1 leading-relaxed">
            Authentic, public-domain textual database preserving the four Vedas (Rigveda, Yajurveda, Samaveda, Atharvaveda), major Upanishads, and the Bhagavad Gita with exact Sanskrit, IAST, and commentarial heritage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified Public-Domain Editions
          </span>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {corpusTypes.map((cat) => {
            const isActive = (!type && cat === 'All') || type === cat;
            return (
              <Link
                key={cat}
                href={cat === 'All' ? '/library' : `/library?type=${encodeURIComponent(cat)}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? 'bg-amber-900 text-amber-50 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Search input form */}
        <form method="GET" action="/library" className="w-full sm:w-72 relative">
          {type && <input type="hidden" name="type" value={type} />}
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            name="q"
            defaultValue={q || ''}
            placeholder="Search verse, Sanskrit, or English..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 focus:bg-white transition"
          />
        </form>
      </div>

      {/* TEXT OVERVIEW CARDS */}
      {!q && !type && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Featured Textual Corpora
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {texts.slice(0, 4).map((t) => (
              <Link
                key={t.id}
                href={`/library?type=${encodeURIComponent(t.corpus_type)}`}
                className="bg-white border border-stone-200 rounded-xl p-4 hover:border-amber-600 hover:shadow-xs transition block group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    {t.corpus_type}
                  </span>
                  <span className="text-xs font-mono font-semibold text-stone-600 group-hover:text-amber-900">
                    {t.title_iast}
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold text-stone-900 mt-2">
                  {t.title_en}
                </h3>
                <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* PASSAGES LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Canonical Passages ({passages.length})
          </h2>
          <span className="text-xs text-stone-400">
            Showing verified primary passages
          </span>
        </div>

        <div className="space-y-4">
          {passages.map((p) => {
            const isHighlighted = highlight === p.id;
            return (
              <div
                key={p.id}
                id={p.id}
                className={`bg-white border rounded-xl overflow-hidden shadow-2xs transition ${
                  isHighlighted 
                    ? 'border-amber-500 ring-2 ring-amber-300' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="bg-stone-50 px-5 py-3 border-b border-stone-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-stone-900 text-base">
                      {p.canonical_ref}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-stone-200/70 text-stone-800 font-medium">
                      {p.text_name}
                    </span>
                    {p.meter && (
                      <span className="text-[11px] text-stone-500 font-mono">
                        [{p.meter}]
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/library/${p.text_slug || 'rigveda'}/${p.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-950 transition"
                  >
                    <span>Full Source Context & Word Analysis</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="p-5 space-y-3">
                  <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-1">
                      Original Sanskrit (IAST Roman Script)
                    </span>
                    <p className="font-mono text-sm text-stone-800 leading-relaxed font-medium">
                      {p.sanskrit_iast}
                    </p>
                  </div>
                  <p className="text-sm text-stone-800 font-serif italic pt-1">
                    "{p.translation_en}"
                  </p>
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-100">
                    <span>Translator: {p.translator_name}</span>
                    {p.rishi && <span>Rishi: {p.rishi} • Devata: {p.devata}</span>}
                  </div>
                </div>
              </div>
            );
          })}

          {passages.length === 0 && (
            <div className="p-12 text-center bg-white border border-stone-200 rounded-xl text-stone-500 text-sm">
              No passages found matching your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
