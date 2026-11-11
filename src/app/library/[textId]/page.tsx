import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { 
  ArrowLeft, BookOpen, ShieldCheck, Search, 
  ExternalLink, Layers, Sparkles, Orbit, Compass 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TextDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ textId: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { textId } = await params;
  const { q } = await searchParams;
  const db = getDb();

  // Find text by slug or ID
  const text = db.prepare(`
    SELECT t.*, tr.name as tradition_name, tr.description as tradition_desc
    FROM texts t
    LEFT JOIN traditions tr ON tr.id = t.tradition_id
    WHERE t.slug = ? OR t.id = ?
  `).get(textId, textId) as any;

  if (!text) {
    notFound();
  }

  // Fetch sections of this text
  const sections = db.prepare(`
    SELECT * FROM sections
    WHERE text_id = ?
    ORDER BY section_number ASC
  `).all(text.id) as any[];

  // Fetch passages of this text
  let passagesSql = `
    SELECT 
      p.id, p.canonical_ref, p.verse_number, p.sanskrit_devanagari, p.sanskrit_iast,
      p.meter, p.rishi, p.devata, p.why_selected_default,
      tr.translation_text as translation_en, tr.translator_name, tr.source_reference
    FROM passages p
    LEFT JOIN translations tr ON tr.passage_id = p.id AND tr.is_primary = 1
    WHERE p.text_id = ?
  `;

  const queryParams: any[] = [text.id];
  if (q && q.trim()) {
    passagesSql += ` AND (p.canonical_ref LIKE ? OR p.sanskrit_iast LIKE ? OR tr.translation_text LIKE ?)`;
    const term = `%${q.trim()}%`;
    queryParams.push(term, term, term);
  }

  passagesSql += ` ORDER BY p.id ASC`;
  const passages = db.prepare(passagesSql).all(...queryParams) as any[];

  // Check for any subject correlations that reference this text
  const allCorrelations = db.prepare(`
    SELECT id, subject, vedic_tradition, description, modern_parallels, key_passages_json
    FROM subject_correlations
  `).all() as any[];

  const relevantCorrelations = allCorrelations.filter((c: any) => {
    const traditionMatch = (c.vedic_tradition || '').toLowerCase().includes(text.title_en.toLowerCase()) ||
      (c.vedic_tradition || '').toLowerCase().includes(text.slug.toLowerCase());
    let passageMatch = false;
    try {
      const keys = JSON.parse(c.key_passages_json || '[]');
      passageMatch = passages.some((p: any) => keys.includes(p.id));
    } catch {}
    return traditionMatch || passageMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* BREADCRUMB NAVIGATION */}
      <div className="flex items-center space-x-2 text-xs text-stone-500 pb-2 border-b border-stone-200">
        <Link href="/library" className="hover:text-stone-900 transition flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Vedic Library</span>
        </Link>
        <span>/</span>
        <span className="text-stone-700 font-medium">{text.corpus_type}</span>
        <span>/</span>
        <span className="text-amber-900 font-bold">{text.title_en}</span>
      </div>

      {/* TEXT HERO HEADER CARD */}
      <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                {text.corpus_type}
              </span>
              {text.tradition_name && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                  Tradition: {text.tradition_name}
                </span>
              )}
              {text.historical_period && (
                <span className="text-[10px] text-stone-500 font-mono">
                  {text.historical_period}
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3 pt-1">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                {text.title_en}
              </h1>
              <span className="text-lg font-mono text-amber-900 italic font-semibold">
                ({text.title_iast})
              </span>
            </div>

            <p className="text-stone-600 text-sm leading-relaxed max-w-3xl pt-2">
              {text.description}
            </p>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-stone-100 gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Public Domain
            </span>
            <div className="text-right">
              <span className="text-xs text-stone-500 block">Available Passages</span>
              <span className="text-2xl font-serif font-bold text-stone-900">
                {passages.length}
              </span>
            </div>
          </div>
        </div>

        {/* Canonical Hierarchy Context */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs text-stone-700 space-y-1">
          <strong className="text-stone-900 block uppercase tracking-wide text-[10px]">
            Canonical Hierarchy & Source Attribution
          </strong>
          <p className="leading-relaxed">
            Preserved under the classical Indian lineage ({text.tradition_name || 'Vedic Tradition'}). Verified against critical editions and authentic public-domain Sanskrit recensions.
          </p>
        </div>
      </div>

      {/* SECTIONS BREAKDOWN IF AVAILABLE */}
      {sections.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-700" />
            <span>Canonical Sections & Cantos ({sections.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sections.map((sec: any) => (
              <div 
                key={sec.id}
                className="bg-white border border-stone-200 rounded-xl p-3.5 space-y-1 hover:border-amber-300 transition"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900">{sec.title_en}</span>
                  <span className="text-[10px] font-mono text-stone-400">Section {sec.section_number}</span>
                </div>
                {sec.title_iast && (
                  <p className="text-[11px] text-stone-500 font-mono italic">{sec.title_iast}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IN-TEXT SEARCH & PASSAGES LIST */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-800" />
              <span>Passages & Mantras in {text.title_en}</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Source-grounded verses with Roman IAST Sanskrit, word analysis, and traditional commentaries.
            </p>
          </div>

          {/* Quick search filter */}
          <form method="GET" action={`/library/${text.slug}`} className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              name="q"
              defaultValue={q || ''}
              placeholder={`Search within ${text.title_en}...`}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-amber-600 shadow-2xs transition"
            />
          </form>
        </div>

        {/* Passages Grid / List */}
        <div className="space-y-4">
          {passages.map((p: any) => (
            <div
              key={p.id}
              className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 hover:border-amber-400 hover:shadow-xs transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-stone-900 text-base">
                    {p.canonical_ref}
                  </span>
                  {p.meter && (
                    <span className="text-[11px] text-stone-500 font-mono px-2 py-0.5 rounded bg-stone-100">
                      Meter: {p.meter}
                    </span>
                  )}
                  {p.rishi && (
                    <span className="text-[11px] text-stone-600 px-2 py-0.5 rounded bg-stone-100">
                      Rishi: {p.rishi}
                    </span>
                  )}
                </div>

                <Link
                  href={`/library/${text.slug}/${p.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition"
                >
                  <span>Examine Passage & Word Analysis</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Sanskrit in IAST Roman script */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-1">
                  Original Sanskrit (IAST Roman Script)
                </span>
                <p className="font-mono text-sm sm:text-base text-stone-900 leading-relaxed font-semibold">
                  {p.sanskrit_iast}
                </p>
              </div>

              {/* Verified English Translation */}
              <div className="space-y-1">
                <p className="text-sm sm:text-base text-stone-800 font-serif italic leading-relaxed">
                  "{p.translation_en}"
                </p>
                {p.translator_name && (
                  <p className="text-xs text-stone-500 pt-0.5">
                    Translator: <strong className="text-stone-700">{p.translator_name}</strong>
                  </p>
                )}
              </div>

              {/* Canonical Significance */}
              {p.why_selected_default && (
                <div className="text-xs text-amber-950 bg-amber-50/60 p-3 rounded-lg border border-amber-200/60">
                  <strong className="text-amber-900 block mb-0.5 text-[10px] uppercase tracking-wide">
                    Canonical Significance:
                  </strong>
                  {p.why_selected_default}
                </div>
              )}
            </div>
          ))}

          {passages.length === 0 && (
            <div className="p-12 text-center bg-white border border-stone-200 rounded-xl text-stone-500 text-sm space-y-2">
              <p>No passages found matching your search within {text.title_en}.</p>
              <Link href={`/library/${text.slug}`} className="text-xs font-semibold text-amber-800 underline">
                Clear filter
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* CROSS-DISCIPLINARY SCIENTIFIC & CONCEPTUAL CONNECTIONS */}
      {relevantCorrelations.length > 0 && (
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 space-y-4 border border-stone-800">
          <div className="flex items-center gap-2">
            <Orbit className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-white">
              Scientific & Cross-Disciplinary Parallels Grounded in {text.title_en}
            </h3>
          </div>
          <p className="text-xs text-stone-400">
            How passages from this scripture align with cosmological, physical, and psychological sciences:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {relevantCorrelations.map((corr: any) => (
              <div
                key={corr.id}
                className="bg-stone-800/80 border border-stone-700 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-300">{corr.subject}</h4>
                  <Link
                    href="/universe"
                    className="text-[10px] text-stone-400 hover:text-white flex items-center gap-1 transition"
                  >
                    <span>View Diagram</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {corr.description}
                </p>
                <div className="text-[11px] text-amber-200/80 bg-amber-950/40 p-2 rounded border border-amber-900/50">
                  <strong>Modern Parallel:</strong> {corr.modern_parallels}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
