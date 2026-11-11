import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { getPassageById } from '@/lib/rag/search';
import { 
  ArrowLeft, ArrowRight, BookOpen, Bookmark, 
  Share2, ShieldCheck, ExternalLink, Network 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SourceViewerPage({
  params,
}: {
  params: Promise<{ textId: string; verseId: string }>;
}) {
  const { textId, verseId } = await params;
  const passage = getPassageById(verseId);

  if (!passage) {
    notFound();
  }

  const db = getDb();

  // Find previous and next passages in the same text
  const siblings = db.prepare(`
    SELECT id, canonical_ref
    FROM passages
    WHERE text_id = ?
    ORDER BY id ASC
  `).all(passage.text_id) as Array<{ id: string; canonical_ref: string }>;

  const currentIndex = siblings.findIndex(s => s.id === passage.id);
  const prevPassage = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const nextPassage = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

  // Associated concepts
  const conceptRows = db.prepare(`
    SELECT c.id, c.slug, c.sanskrit_term, c.english_title, pc.contextual_note
    FROM passage_concepts pc
    JOIN concepts c ON c.id = pc.concept_id
    WHERE pc.passage_id = ?
  `).all(passage.id) as Array<{ id: string; slug: string; sanskrit_term: string; english_title: string; contextual_note?: string }>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* TOP NAVIGATION BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-4 text-xs">
        <div className="flex items-center space-x-2 text-stone-500">
          <Link href="/library" className="hover:text-stone-900 transition">
            Library
          </Link>
          <span>/</span>
          <span className="text-stone-700 font-medium">{passage.text_name}</span>
          <span>/</span>
          <span className="text-amber-900 font-bold">{passage.canonical_ref}</span>
        </div>

        <div className="flex items-center gap-2">
          {prevPassage && (
            <Link
              href={`/library/${textId}/${prevPassage.id}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Prev ({prevPassage.canonical_ref})</span>
            </Link>
          )}
          {nextPassage && (
            <Link
              href={`/library/${textId}/${nextPassage.id}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition"
            >
              <span>Next ({nextPassage.canonical_ref})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* PRIMARY SOURCE CARD */}
      <div className="bg-white border-2 border-stone-300 rounded-2xl overflow-hidden shadow-xs">
        {/* Source Hierarchy Ribbon */}
        <div className="bg-stone-100 px-6 py-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
              {passage.corpus_type} • {passage.section_title || 'Sacred Section'}
            </span>
            <h1 className="font-serif text-2xl font-bold text-stone-900">
              {passage.canonical_ref}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Canonical Source
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Metadata Badges */}
          <div className="flex flex-wrap gap-2 text-xs text-stone-600">
            {passage.meter && (
              <span className="px-2.5 py-1 rounded bg-stone-50 border border-stone-200 font-mono">
                Meter: <strong>{passage.meter}</strong>
              </span>
            )}
            {passage.rishi && (
              <span className="px-2.5 py-1 rounded bg-stone-50 border border-stone-200">
                Rishi: <strong>{passage.rishi}</strong>
              </span>
            )}
            {passage.devata && (
              <span className="px-2.5 py-1 rounded bg-stone-50 border border-stone-200">
                Devata: <strong>{passage.devata}</strong>
              </span>
            )}
            <span className="px-2.5 py-1 rounded bg-stone-50 border border-stone-200">
              Verse: <strong>{passage.verse_number}</strong>
            </span>
          </div>

          {/* Original Sanskrit in IAST Roman Transliteration */}
          <div className="bg-amber-50/40 p-5 rounded-xl border border-amber-200/60 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
              Original Sanskrit (IAST Roman Script)
            </span>
            <p className="font-serif text-xl sm:text-2xl text-stone-900 leading-relaxed italic max-w-3xl mx-auto">
              "{passage.sanskrit_iast}"
            </p>
          </div>

          {/* Verified English Translation */}
          <div className="space-y-1 bg-white p-4 rounded-xl border border-stone-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
              Verified English Translation
            </span>
            <p className="text-lg text-stone-800 font-serif italic leading-relaxed">
              "{passage.translation_en}"
            </p>
            <p className="text-xs text-stone-500 pt-1">
              Translator: <strong className="text-stone-700">{passage.translator_name}</strong>
              {passage.source_reference && ` — ${passage.source_reference}`}
            </p>
          </div>

          {/* Why Selected */}
          {passage.why_selected && (
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 text-xs text-amber-950">
              <strong className="text-amber-900 block mb-1 uppercase tracking-wide text-[10px]">
                Why this passage was selected & its canonical significance:
              </strong>
              <p className="leading-relaxed">{passage.why_selected}</p>
            </div>
          )}
        </div>
      </div>

      {/* WORD-BY-WORD PADACHHEDA (SANSKRIT LINGUISTIC BREAKDOWN) */}
      {passage.words && passage.words.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
            <BookOpen className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif text-lg font-bold text-stone-900">
              Word-by-Word Sanskrit Padachheda Analysis
            </h2>
          </div>
          <p className="text-xs text-stone-500">
            Linguistic and morphological breakdown linking each Sanskrit token to grammatical root, declension/conjugation, and lexical definition.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-200 text-stone-600 font-semibold">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Sanskrit Word (IAST)</th>
                  <th className="py-2.5 px-3">Grammatical Analysis</th>
                  <th className="py-2.5 px-3">Lexical Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {passage.words.map((w) => (
                  <tr key={w.word_order} className="hover:bg-stone-50/60 transition">
                    <td className="py-2.5 px-3 text-stone-400 font-mono">{w.word_order}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-stone-900 text-sm">
                      {w.iast_word || w.sanskrit_word}
                    </td>
                    <td className="py-2.5 px-3 text-stone-500 font-mono text-[10px]">
                      {w.root ? `Root: √${w.root}` : ''} {w.grammatical_tag ? `(${w.grammatical_tag})` : ''}
                    </td>
                    <td className="py-2.5 px-3 text-stone-900 font-medium">{w.lexical_meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TRADITIONAL COMMENTARIES */}
      {passage.commentaries && passage.commentaries.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
            <span>Traditional Commentaries & Exegesis</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {passage.commentaries.map((c, idx) => (
              <div
                key={idx}
                className="bg-white border border-stone-200 rounded-xl p-5 space-y-3 hover:border-indigo-300 transition shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-indigo-950 text-sm">{c.commentator_name}</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                    {c.tradition_tag}
                  </span>
                </div>

                {c.original_text && (
                  <p className="font-mono text-xs text-stone-700 bg-stone-50 p-2.5 rounded border border-stone-100 leading-relaxed">
                    {c.original_text}
                  </p>
                )}

                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {c.english_summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ASSOCIATED CONCEPTS */}
      {conceptRows.length > 0 && (
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-amber-800" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Associated Philosophical Concepts
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {conceptRows.map((c) => (
              <Link
                key={c.id}
                href={`/concepts/${c.slug}`}
                className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs text-stone-800 hover:border-amber-600 transition flex items-center gap-1.5"
              >
                <span className="font-bold text-amber-900">{c.english_title}</span>
                {c.sanskrit_term && <span className="font-mono text-stone-500">({c.sanskrit_term})</span>}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CITATION EXPORT BOX */}
      <div className="bg-stone-100 rounded-xl p-4 border border-stone-200 text-xs text-stone-600 space-y-1">
        <span className="font-bold uppercase tracking-wider text-[10px] text-stone-500 block">
          Academic Citation Formats
        </span>
        <p className="font-mono text-[11px] text-stone-800">
          <strong>Chicago:</strong> {passage.text_name}, {passage.canonical_ref}. Trans. {passage.translator_name}. VedaVerse Canonical Archive.
        </p>
        <p className="font-mono text-[11px] text-stone-800">
          <strong>MLA:</strong> "{passage.canonical_ref}." <em>{passage.text_name}</em>. Trans. {passage.translator_name}. VedaVerse, {new Date().getFullYear()}.
        </p>
      </div>
    </div>
  );
}
