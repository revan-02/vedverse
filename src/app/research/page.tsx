'use client';

import React, { useState } from 'react';
import { Compass, Search, Download, BookOpen, Layers, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { processVedaVerseQuery } from '@/lib/rag/engine';
import { RagResponseContract } from '@/types';

export default function ResearchModePage() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<RagResponseContract | null>(null);
  const [citationFormat, setCitationFormat] = useState<'chicago' | 'mla' | 'apa'>('chicago');

  const generateReport = async (searchTopic: string) => {
    if (!searchTopic.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: searchTopic.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setReport(data.data);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;
    const content = `
VEDAVERSE SCHOLARLY RESEARCH REPORT
===================================
RESEARCH INQUIRY: ${report.question}
DATE: ${new Date().toLocaleDateString()}
CONFIDENCE: ${report.confidence}
GROUNDEDNESS: ${(report.verification_audit.groundedness_score * 100).toFixed(0)}%

1. CANONICAL PRIMARY SOURCES
----------------------------
${report.primary_sources.map(p => `
[${p.canonical_ref}] (${p.text_name})
Sanskrit: ${p.sanskrit_devanagari}
IAST: ${p.sanskrit_iast}
Translation: ${p.translation_en}
Translator: ${p.translator_name}
`).join('\n')}

2. LITERAL TEXTUAL INTERPRETATION
---------------------------------
${report.literal_explanation}

3. TRADITIONAL COMMENTARIES
---------------------------
${report.traditional_interpretations.map(t => `
• ${t.commentator} (${t.school}) on ${t.canonical_ref}:
  ${t.interpretation_summary}
`).join('\n')}

4. SYNTHESIS & MODERN SCHOLARSHIP
---------------------------------
${report.ai_explanation}

5. PRACTICAL APPLICATION (NON-SCRIPTURAL)
-----------------------------------------
${report.modern_application}

6. METHODOLOGICAL LIMITATIONS
-----------------------------
VedaVerse reports are strictly constrained by verified public-domain editions. Texts without open-access licensing are cited by reference only.
`.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VedaVerse-Research-${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Academic Toolset
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
              Scholar Grade
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            🔬 Scholarly Research Mode
          </h1>
          <p className="text-xs text-stone-500 max-w-2xl mt-1 leading-relaxed">
            Generate formal academic monographs complete with primary source citations, Sanskrit padachheda, traditional exegesis differences, and exportable reference bibliographies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified Corpus Grounding
          </span>
        </div>
      </div>

      {/* TOPIC SEARCH FORM */}
      <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
          Enter Research Question or Subject for Structured Report
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 'What do classical texts articulate regarding the psychology of anger and self-mastery?'"
            className="flex-1 px-4 py-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-700 focus:bg-white transition"
          />
          <button
            onClick={() => generateReport(topic)}
            disabled={!topic.trim() || loading}
            className="px-6 py-3 rounded-xl bg-amber-900 hover:bg-amber-800 disabled:bg-stone-300 text-amber-50 text-xs font-bold tracking-wide transition shrink-0 cursor-pointer shadow-xs"
          >
            {loading ? 'Synthesizing...' : 'Generate Monograph'}
          </button>
        </div>

        {/* Preset Topics */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-stone-500">
          <span className="font-semibold text-stone-600">Sample Topics:</span>
          <button
            onClick={() => {
              setTopic('What do classical texts say about controlling anger?');
              generateReport('What do classical texts say about controlling anger?');
            }}
            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
          >
            "Psychology of Anger (Krodha)"
          </button>
          <button
            onClick={() => {
              setTopic('What is Dharma according to the texts?');
              generateReport('What is Dharma according to the texts?');
            }}
            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
          >
            "Ontology of Dharma"
          </button>
          <button
            onClick={() => {
              setTopic('What does the Vedas say about choosing a software engineering career?');
              generateReport('What does the Vedas say about choosing a software engineering career?');
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 transition"
          >
            "Anachronism & Modern Vocation"
          </button>
        </div>
      </div>

      {/* GENERATED STRUCTURED REPORT */}
      {report && (
        <div className="bg-white border-2 border-stone-300 rounded-2xl p-6 sm:p-10 space-y-8 shadow-sm">
          {/* Report Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900 block">
                Research Monograph
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
                {report.question}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={downloadReport}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Report (.txt)</span>
              </button>
            </div>
          </div>

          {/* Section 1: Research Question & Scope */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              1. Research Question & Scope
            </h3>
            <p className="text-sm text-stone-800 leading-relaxed">
              This monograph investigates textual attestations within the canonical Vedic and classical Indian corpus answering: <em>"{report.question}"</em>.
              {!report.direct_answer_exists && (
                <span className="block mt-2 text-amber-900 font-semibold bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs">
                  Scope Limitation: {report.no_direct_answer_disclaimer}
                </span>
              )}
            </p>
          </div>

          {/* Section 2: Primary Sources Examined */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              2. Primary Sources & Canonical Textual Evidence
            </h3>
            <div className="space-y-4">
              {report.primary_sources.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-stone-900 text-sm">{p.canonical_ref}</span>
                    <span className="text-xs text-stone-500">{p.text_name}</span>
                  </div>
                  <p className="sanskrit-text text-lg text-stone-900">{p.sanskrit_devanagari}</p>
                  <p className="iast-text text-xs text-stone-600">{p.sanskrit_iast}</p>
                  <p className="text-xs text-stone-800 font-serif italic">"{p.translation_en}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Literal Analysis */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              3. Literal Textual Meaning
            </h3>
            <p className="text-sm text-stone-800 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200">
              {report.literal_explanation}
            </p>
          </div>

          {/* Section 4: Traditional Commentarial Exegesis */}
          {report.traditional_interpretations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                4. Traditional Commentarial Interpretations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.traditional_interpretations.map((t, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-indigo-950">
                      <span>{t.commentator}</span>
                      <span className="text-[10px] font-mono">{t.school}</span>
                    </div>
                    <p className="text-indigo-900/90 leading-relaxed pt-1">{t.interpretation_summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Modern Synthesis & Application */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              5. Modern Application (Explicitly Non-Scriptural)
            </h3>
            <p className="text-sm text-stone-800 leading-relaxed bg-purple-50/50 p-4 rounded-xl border border-purple-200 whitespace-pre-line">
              {report.modern_application}
            </p>
          </div>

          {/* Section 6: Academic Citation Bibliography */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                6. Bibliographic References
              </h3>
              <div className="flex gap-1">
                {(['chicago', 'mla', 'apa'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setCitationFormat(fmt)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
                      citationFormat === fmt ? 'bg-amber-900 text-amber-50' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs font-mono space-y-2">
              {report.primary_sources.map((p) => {
                if (citationFormat === 'chicago') {
                  return (
                    <p key={p.id}>
                      {p.text_name}. "{p.canonical_ref}." In <em>VedaVerse Canonical Corpus</em>. Trans. {p.translator_name}. 1896–1934.
                    </p>
                  );
                } else if (citationFormat === 'mla') {
                  return (
                    <p key={p.id}>
                      "{p.canonical_ref}." <em>{p.text_name}</em>, translated by {p.translator_name}, VedaVerse Archive, {new Date().getFullYear()}.
                    </p>
                  );
                } else {
                  return (
                    <p key={p.id}>
                      {p.translator_name} (Trans.). ({new Date().getFullYear()}). <em>{p.canonical_ref} ({p.text_name})</em>. VedaVerse Scholarly Platform.
                    </p>
                  );
                }
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
