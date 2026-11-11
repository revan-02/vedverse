import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, Search, BookOpen, Network, 
  ShieldCheck, ArrowRight, Layers, Compass, 
  Calendar, Volume2, CheckCircle2, Orbit, Map
} from 'lucide-react';

import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const db = getDb();
  const texts = db.prepare('SELECT id, slug, title_devanagari, title_iast, title_en, corpus_type, description FROM texts LIMIT 6').all() as any[];
  const concepts = db.prepare('SELECT id, slug, sanskrit_term, iast_term, english_title, short_definition FROM concepts LIMIT 8').all() as any[];

  // Daily passage
  const dailyPassage = db.prepare(`
    SELECT p.id, p.canonical_ref, p.sanskrit_devanagari, p.sanskrit_iast, tr.translation_text as translation_en, t.title_en as text_name
    FROM passages p
    JOIN texts t ON t.id = p.text_id
    LEFT JOIN translations tr ON tr.passage_id = p.id AND tr.is_primary = 1
    WHERE p.id = 'RV-3.62.10'
  `).get() as any;

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 border-b border-stone-200/80 bg-gradient-to-b from-[#fcfbf9] via-[#f7f5f0] to-[#fcfbf9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100/80 text-amber-900 border border-amber-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Strictly Source-Grounded • Zero Hallucination Guarantee</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-stone-900">
            Ask. Discover. Verify.
          </h1>

          <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed font-sans">
            Explore ancient Indian texts through verified sources, Sanskrit context, traditional commentaries, and transparent AI explanations.
          </p>

          {/* Quick Search Trigger */}
          <div className="max-w-2xl mx-auto pt-4">
            <Link
              href="/ask"
              className="flex items-center justify-between p-2 pl-5 bg-white border-2 border-stone-300 rounded-full shadow-md hover:border-amber-700 hover:shadow-lg transition group cursor-pointer"
            >
              <div className="flex items-center gap-3 text-stone-400">
                <Search className="w-5 h-5 text-amber-800" />
                <span className="text-sm font-sans text-stone-500 group-hover:text-stone-700">
                  Ask VedaVerse (e.g. "What do the Vedas say about controlling anger?")
                </span>
              </div>
              <span className="px-5 py-2.5 rounded-full bg-amber-900 text-amber-50 text-xs font-semibold tracking-wide flex items-center gap-1.5 group-hover:bg-amber-800 transition">
                <span>Investigate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          {/* Suggested Prompts */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-stone-500">
            <span className="font-semibold text-stone-700">Try investigating:</span>
            <Link href="/ask?q=What%20do%20the%20Vedas%20say%20about%20controlling%20anger%3F" className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition">
              "Controlling anger"
            </Link>
            <Link href="/ask?q=What%20is%20Dharma%3F" className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition">
              "What is Dharma?"
            </Link>
            <Link href="/ask?q=What%20does%20the%20Vedas%20say%20about%20choosing%20a%20software%20engineering%20career%3F" className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition">
              "Software engineering career"
            </Link>
            <Link href="/ask?q=Gayatri%20Mantra%20meaning" className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition">
              "Gayatri Mantra"
            </Link>
          </div>
        </div>
      </section>

      {/* CORE PRODUCT PRINCIPLE: FOUR SEPARATED LAYERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            Methodological Rigor
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            The Four Transparent Layers of VedaVerse
          </h2>
          <p className="text-sm text-stone-600">
            Unlike generic AI chatbots that blend scripture, commentary, and speculation, VedaVerse strictly isolates four epistemological layers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">Layer A</span>
            </div>
            <h3 className="font-bold text-emerald-900 text-sm">Primary Scripture</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Original Sanskrit in validated IAST Roman script, word-by-word padachheda analysis, and exact citation hierarchy without modern bias.
            </p>
          </div>

          <div className="bg-indigo-50/50 border border-indigo-200 rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-950">Layer B</span>
            </div>
            <h3 className="font-bold text-indigo-900 text-sm">Traditional Exegesis</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              How classical commentators (Adi Shankara, Ramanujacharya, Madhvacharya, Sayana) interpret the verse in their schools.
            </p>
          </div>

          <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-600"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-950">Layer C</span>
            </div>
            <h3 className="font-bold text-amber-900 text-sm">AI Explanation</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Clear modern linguistic analysis clarifying syntax, historical context, and philosophical nuance for contemporary readers.
            </p>
          </div>

          <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-600"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-950">Layer D</span>
            </div>
            <h3 className="font-bold text-purple-900 text-sm">Modern Application</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Explicitly labeled as modern life application rather than ancient doctrine, maintaining absolute transparency.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED: COSMOLOGY & UNIVERSE & ROADMAP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/universe"
            className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-7 border border-stone-800 shadow-md hover:border-amber-500/50 transition group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-900/60">
                  <Orbit className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/50 px-2.5 py-0.5 rounded-full border border-amber-900/60">
                  Pictorial SVG Diagram
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-200 transition">
                Cosmology & The Universe
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Garuda Purana (14 Lokas), Vishnu Purana (Deep Time & Kalpas), and 4 Vedas mapped to modern Astronomy, Astrophysics, and Quantum Physics.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Explore Pictorial Diagram</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/roadmap"
            className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-xs hover:border-amber-400 hover:shadow-sm transition group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Map className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  16-Week Curriculum
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-amber-950 transition">
                Curriculum Roadmap
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Step-by-step academic journey from Pre-Cosmic Singularity (Nasadiya) to Upanishadic Psychology and interdisciplinary sciences.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-900 group-hover:translate-x-1 transition-transform">
              <span>View Curriculum Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/mantras"
            className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-xs hover:border-amber-400 hover:shadow-sm transition group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                  <Volume2 className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Web Audio Synthesizer
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-amber-950 transition">
                Sacred Mantras & Sound
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Authentic 136.1 Hz Pranava drone with syllable-by-syllable pronunciation player, meter breakdown, and japa counter.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-900 group-hover:translate-x-1 transition-transform">
              <span>Play Mantras & Drone</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>


      {/* DAILY WISDOM PREVIEW */}
      {dailyPassage && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Daily Verified Wisdom
                </span>
              </div>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {dailyPassage.canonical_ref}
              </span>
            </div>

            <div className="py-6 space-y-4 text-center">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 inline-block max-w-2xl w-full">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-1">
                  Original Sanskrit (IAST Roman Script)
                </span>
                <p className="font-mono text-base sm:text-lg text-stone-900 leading-relaxed font-semibold">
                  {dailyPassage.sanskrit_iast}
                </p>
              </div>
              <p className="text-base text-stone-800 font-serif italic max-w-2xl mx-auto pt-2">
                "{dailyPassage.translation_en}"
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-stone-100 text-xs">
              <span className="text-stone-500 font-medium">Source: {dailyPassage.text_name}</span>
              <Link href="/daily" className="font-semibold text-amber-900 hover:text-amber-800 flex items-center gap-1">
                Explore Daily Passages <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* EXPLORE TEXTS (VEDIC LIBRARY PREVIEW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Canonical Vedic & Classical Library
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Strictly preserved hierarchy: Tradition → Text → Section → Verse
            </p>
          </div>
          <Link href="/library" className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1">
            Browse All Texts <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {texts.map((t) => (
            <Link
              key={t.id}
              href={`/library/${t.slug}`}
              className="bg-white border border-stone-200 rounded-xl p-5 hover:border-amber-400 hover:shadow-sm transition block group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                  {t.corpus_type}
                </span>
                <span className="text-xs font-mono font-semibold text-stone-500 group-hover:text-amber-900 transition">
                  {t.title_iast}
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-950 transition">
                {t.title_en}
              </h3>
              <p className="text-xs text-stone-600 line-clamp-2 mt-3 leading-relaxed">
                {t.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* EXPLORE CONCEPTS (KNOWLEDGE GRAPH PREVIEW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Vedic Concept Explorer & Knowledge Graph
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Etymological foundations and cross-textual semantic connections
            </p>
          </div>
          <Link href="/concepts" className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1">
            View Knowledge Graph <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {concepts.map((c) => (
            <Link
              key={c.id}
              href={`/concepts/${c.slug}`}
              className="bg-white border border-stone-200 rounded-xl p-4 hover:border-amber-400 hover:bg-stone-50/50 transition block group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-950 group-hover:text-amber-800">
                  {c.english_title.split('(')[0].trim()}
                </span>
                <span className="text-[11px] text-stone-500 font-mono italic">
                  {c.iast_term}
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                {c.short_definition}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* SPECIAL RESEARCH & LEARNING BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Academic & Scholar Tools
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Sanskrit Padachheda, Cross-Tradition Debate & Structured Research
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              Access word-by-word grammatical breakdowns, compare Advaita vs Vishishtadvaita interpretations in side-by-side matrices, and export formatted academic research reports.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/research"
              className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold text-xs text-center transition flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Launch Research Mode</span>
            </Link>
            <Link
              href="/compare"
              className="px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs text-center transition border border-stone-700"
            >
              Compare Traditions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
