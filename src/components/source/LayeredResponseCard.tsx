'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle, AlertCircle, BookOpen, Layers, 
  Sparkles, ExternalLink, Bookmark, Share2, 
  FileText, ShieldCheck, Info, ChevronDown, ChevronUp 
} from 'lucide-react';
import { RagResponseContract, VerifiedPassage } from '@/types';

interface LayeredResponseCardProps {
  data: RagResponseContract;
  onBookmark?: (passageId: string) => void;
}

export default function LayeredResponseCard({ data, onBookmark }: LayeredResponseCardProps) {
  const [selectedWordPassage, setSelectedWordPassage] = useState<VerifiedPassage | null>(null);
  const [sharePassage, setSharePassage] = useState<VerifiedPassage | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [copiedText, setCopiedText] = useState(false);

  const toggleBookmark = async (p: VerifiedPassage) => {
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bookmark',
          item_id: p.id,
          title: `${p.canonical_ref} (${p.text_name})`
        })
      });
      const resData = await res.json();
      const next = new Set(bookmarkedIds);
      if (resData.saved) {
        next.add(p.id);
      } else {
        next.delete(p.id);
      }
      setBookmarkedIds(next);
      if (onBookmark) onBookmark(p.id);
    } catch {}
  };

  const copyShareText = (p: VerifiedPassage) => {
    const text = `"${p.translation_en}"\n\n— ${p.canonical_ref} (${p.text_name})\nSanskrit: ${p.sanskrit_devanagari}\nIAST: ${p.sanskrit_iast}\nVerified via VedaVerse Platform`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. QUERY & DETECTED CONCEPTS HEADER */}
      <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-stone-500">
              Query Under Investigation
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-0.5">
              "{data.question}"
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {data.citations_verified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Citations 100% Grounded
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Conceptual Synthesis
              </span>
            )}
          </div>
        </div>

        {/* Concepts Detected */}
        {data.detected_concepts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-stone-200/60">
            <span className="text-xs font-medium text-stone-600 mr-2">🧭 Concepts Detected:</span>
            <div className="inline-flex flex-wrap gap-1.5 mt-1 sm:mt-0">
              {data.detected_concepts.map((c) => (
                <Link
                  key={c.id}
                  href={`/concepts/${c.id.replace('c-', '')}`}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200/70 hover:bg-amber-100 transition"
                >
                  <span className="font-serif">{c.term}</span>
                  <span className="text-[10px] text-amber-700">({c.title})</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. ANTI-HALLUCINATION / NO DIRECT ANSWER DISCLAIMER BANNER */}
      {!data.direct_answer_exists && data.no_direct_answer_disclaimer && (
        <div className="bg-amber-50/90 border-l-4 border-amber-600 p-5 rounded-r-xl shadow-xs">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide">
                Direct Source Verification Notice
              </h3>
              <p className="text-sm text-amber-900/90 mt-1 leading-relaxed font-medium">
                {data.no_direct_answer_disclaimer}
              </p>
              <p className="text-xs text-amber-800 mt-2 italic">
                VedaVerse does not fabricate ancient scripture for modern subjects. The retrieved passages below discuss broader root concepts that classical thinkers applied to analogous problems.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. LAYER A — SCRIPTURE / PRIMARY TEXT */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900">
              Layer A — Scripture / Primary Sources
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            {data.primary_sources.length} Verified {data.primary_sources.length === 1 ? 'Passage' : 'Passages'}
          </span>
        </div>

        {data.primary_sources.map((passage, idx) => (
          <div 
            key={passage.id}
            className="bg-white border-2 border-emerald-600/30 rounded-xl overflow-hidden shadow-xs hover:border-emerald-600/60 transition"
          >
            {/* Source Header Ribbon */}
            <div className="bg-emerald-50/70 border-b border-emerald-100 px-5 py-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-emerald-950 text-base">
                  {passage.canonical_ref}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-200/70 text-emerald-900 font-medium">
                  {passage.text_name} • {passage.corpus_type}
                </span>
                {passage.meter && (
                  <span className="text-[11px] text-emerald-800 font-mono hidden sm:inline">
                    [{passage.meter}]
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleBookmark(passage)}
                  className={`p-1.5 rounded text-xs transition ${
                    bookmarkedIds.has(passage.id) 
                      ? 'text-amber-600 bg-amber-50' 
                      : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                  }`}
                  title="Bookmark passage"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  onClick={() => copyShareText(passage)}
                  className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded text-xs transition"
                  title="Share or copy citation"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <Link
                  href={`/library/${passage.text_id}/${passage.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 hover:underline ml-1"
                >
                  View Context <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="p-6 sm:p-7 space-y-6 text-left">
              {/* Primary Scripture in IAST Roman Transliteration */}
              <div className="bg-amber-50/40 rounded-xl p-5 border border-amber-200/60 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                  Original Sanskrit (IAST Roman Script)
                </span>
                <p className="font-serif text-lg sm:text-xl text-stone-900 leading-relaxed font-medium italic max-w-3xl mx-auto">
                  "{passage.sanskrit_iast}"
                </p>
              </div>

              {/* Verified English Translation */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                  Verified English Translation
                </span>
                <p className="text-stone-800 text-sm sm:text-base leading-relaxed font-serif italic">
                  "{passage.translation_en}"
                </p>
                <p className="text-[11px] text-stone-500 mt-2 font-sans">
                  Translated by: <span className="font-semibold text-stone-700">{passage.translator_name}</span>
                  {passage.source_reference && ` • Source: ${passage.source_reference}`}
                </p>
              </div>

              {/* Why This Passage was Selected */}
              {passage.why_selected && (
                <div className="text-xs bg-emerald-50/50 border border-emerald-200/50 rounded-lg p-3 text-emerald-950 flex items-start gap-2">
                  <span className="font-bold text-emerald-800 uppercase tracking-wide text-[10px] shrink-0 mt-0.5">
                    Relevance Rationale:
                  </span>
                  <span>{passage.why_selected}</span>
                </div>
              )}

              {/* Word-by-word Analysis Trigger */}
              {passage.words && passage.words.length > 0 && (
                <div className="pt-2">
                  <button
                    onClick={() => setSelectedWordPassage(selectedWordPassage?.id === passage.id ? null : passage)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                    <span>Word-by-Word Padachheda ({passage.words.length} terms)</span>
                    {selectedWordPassage?.id === passage.id ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Word-by-word Drawer/Table */}
                  {selectedWordPassage?.id === passage.id && (
                    <div className="mt-4 border border-stone-200 rounded-lg overflow-x-auto shadow-xs">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-stone-100 border-b border-stone-200 text-stone-600 font-semibold">
                            <th className="py-2.5 px-3">#</th>
                            <th className="py-2.5 px-3">Sanskrit Word (IAST)</th>
                            <th className="py-2.5 px-3">Root / Dhatu</th>
                            <th className="py-2.5 px-3">Grammatical Tag</th>
                            <th className="py-2.5 px-3">Lexical Meaning</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {passage.words.map((w) => (
                            <tr key={w.word_order} className="hover:bg-stone-50/60 transition">
                              <td className="py-2 px-3 text-stone-400 font-mono">{w.word_order}</td>
                              <td className="py-2 px-3 font-mono font-bold text-stone-900 text-sm">
                                {w.iast_word || w.sanskrit_word}
                              </td>
                              <td className="py-2 px-3 text-stone-600 font-mono text-[11px]">
                                {w.root ? `√${w.root}` : '—'}
                              </td>
                              <td className="py-2 px-3 text-stone-500 font-mono text-[10px]">
                                {w.grammatical_tag || '—'}
                              </td>
                              <td className="py-2 px-3 text-stone-900 font-medium">{w.lexical_meaning}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 4. LITERAL EXPLANATION */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-stone-500" />
          What the Text Literally Says
        </h4>
        <p className="text-sm text-stone-800 leading-relaxed">
          {data.literal_explanation}
        </p>
      </div>

      {/* 5. LAYER B — TRADITIONAL INTERPRETATION */}
      {data.traditional_interpretations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-indigo-200 pb-2">
            <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-950">
              Layer B — Traditional Commentary & Interpretation
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.traditional_interpretations.map((inter, i) => (
              <div 
                key={i}
                className="bg-indigo-50/40 border border-indigo-200/80 rounded-xl p-5 space-y-2 hover:border-indigo-300 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900">
                    {inter.commentator}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-medium">
                    {inter.school}
                  </span>
                </div>

                {inter.original_commentary_snippet && (
                  <p className="sanskrit-text text-xs text-indigo-900/80 bg-white/70 p-2 rounded border border-indigo-100 font-serif">
                    {inter.original_commentary_snippet}
                  </p>
                )}

                <p className="text-xs text-indigo-950 leading-relaxed font-medium">
                  {inter.interpretation_summary}
                </p>
                <div className="text-[10px] text-indigo-700/70 pt-1">
                  Source: {inter.canonical_ref} Commentary
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. LAYER C — AI EXPLANATION */}
      <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-600"></span>
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-700" />
            Layer C — AI Explanation
          </h3>
        </div>
        <p className="text-xs text-amber-800/80 font-medium mb-1">
          Modern linguistic clarity and philosophical overview synthesized from the verified textual passages.
        </p>
        <p className="text-sm text-stone-800 leading-relaxed">
          {data.ai_explanation}
        </p>
      </div>

      {/* 7. LAYER D — MODERN APPLICATION */}
      <div className="bg-purple-50/50 border border-purple-200/80 rounded-xl p-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-600"></span>
          <h3 className="text-sm font-bold uppercase tracking-wider text-purple-950">
            Layer D — Modern Application
          </h3>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-200/60 text-purple-900 ml-auto">
            Non-Scriptural Modern Perspective
          </span>
        </div>
        <p className="text-xs text-purple-800/80 font-medium mb-1">
          How the broader timeless principles relate to contemporary human dilemmas.
        </p>
        <p className="text-sm text-stone-800 leading-relaxed whitespace-pre-line">
          {data.modern_application}
        </p>
      </div>

      {/* 8. RELATED PASSAGES */}
      {data.related_passages.length > 0 && (
        <div className="pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
            🔗 Additional Related Passages
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.related_passages.map((rp) => (
              <Link
                key={rp.id}
                href={`/library?highlight=${rp.id}`}
                className="p-3 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 hover:border-amber-400 transition block text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 font-serif">{rp.canonical_ref}</span>
                  <span className="text-[10px] text-stone-500">{rp.title}</span>
                </div>
                <p className="text-xs text-stone-600 mt-1 italic line-clamp-2">
                  "{rp.translation_snippet}"
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 9. CITATION VERIFICATION AUDIT STAMP */}
      <div className="border-t border-stone-200 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-stone-500 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            Audit: {data.verification_audit.verified_passage_ids.length} citations verified against canonical SQLite repository.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-stone-400">
            Confidence: <strong className="text-stone-700">{data.confidence}</strong>
          </span>
          <span className="text-[11px] text-stone-400">
            Groundedness: <strong className="text-emerald-700">{(data.verification_audit.groundedness_score * 100).toFixed(0)}%</strong>
          </span>
        </div>
      </div>

      {copiedText && (
        <div className="fixed bottom-6 right-6 bg-stone-900 text-stone-100 px-4 py-2 rounded-lg text-xs font-semibold shadow-lg animate-bounce">
          Citation copied with verified metadata!
        </div>
      )}
    </div>
  );
}
