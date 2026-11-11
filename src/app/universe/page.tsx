'use client';

import React, { useState, useEffect } from 'react';
import { 
  Orbit, 
  Sparkles, 
  Compass, 
  BookOpen, 
  Layers, 
  Share2, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Atom,
  Eye,
  GitBranch,
  Volume2
} from 'lucide-react';
import Link from 'next/link';

interface CosmicPassage {
  id: string;
  text_id: string;
  canonical_ref: string;
  sanskrit_devanagari: string;
  sanskrit_iast: string;
  translation_en: string;
  why_selected_default?: string;
  meter?: string;
  rishi?: string;
}

interface SubjectCorrelation {
  id: string;
  subject: string;
  vedic_tradition: string;
  ancient_treatises: string;
  description: string;
  modern_parallels: string;
  diagram_type?: string;
  key_passages: string[];
}

export default function UniverseCosmologyPage() {
  const [passages, setPassages] = useState<CosmicPassage[]>([]);
  const [correlations, setCorrelations] = useState<SubjectCorrelation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'diagram' | 'tree' | 'passages'>('diagram');
  const [selectedElement, setSelectedElement] = useState<string>('singularity');
  const [selectedSubject, setSelectedSubject] = useState<SubjectCorrelation | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/universe');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setPassages(json.data.passages || []);
            setCorrelations(json.data.subjectCorrelations || []);
            if (json.data.subjectCorrelations?.length > 0) {
              setSelectedSubject(json.data.subjectCorrelations[0]);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load universe data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* HEADER SECTION */}
      <div className="border-b border-stone-200 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200/60 flex items-center gap-1.5">
                <Orbit className="w-3.5 h-3.5 text-amber-700" />
                Vedic Cosmogony & Modern Sciences
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200/60 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Source Grounded
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">
              Cosmology, the Universe & Modern Disciplines
            </h1>
            <p className="text-sm sm:text-base text-stone-600 max-w-3xl mt-3 leading-relaxed">
              Explore how the Rigveda, Yajurveda, Samaveda, Atharvaveda, Vishnu Purana, and Garuda Purana describe the origin, multidimensional structure, and dissolution of the cosmos — and how these Vedic foundations connect directly to modern sciences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/roadmap"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-800 hover:bg-amber-900 text-white shadow-sm flex items-center gap-2 transition"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              View Learning Roadmap
            </Link>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-2 mt-8 border-b border-stone-200">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'diagram'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Orbit className="w-4 h-4" />
            Pictorial: Cosmic Genesis & 14 Lokas
          </button>
          <button
            onClick={() => setActiveTab('tree')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'tree'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            Pictorial: Vedic Knowledge Tree (All Subjects)
          </button>
          <button
            onClick={() => setActiveTab('passages')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'passages'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Canonical Scriptures ({passages.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-10 h-10 border-3 border-amber-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-stone-500 font-medium">Retrieving verified cosmological texts from database...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: PICTORIAL COSMOLOGY DIAGRAM */}
          {activeTab === 'diagram' && (
            <div className="space-y-8">
              <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 shadow-xl border border-stone-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Orbit className="w-96 h-96 text-amber-400" />
                </div>

                <div className="max-w-2xl mb-6">
                  <span className="text-xs uppercase tracking-widest font-bold text-amber-400">
                    Interactive Pictorial Diagram
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1 text-white">
                    The Vedic Cosmic Evolution & Brahmanda Schema
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-400 mt-2 leading-relaxed">
                    Click each cosmic evolution phase to inspect its Sanskrit scripture, Puranic realm, and astrophysical parallel.
                  </p>
                </div>

                {/* SVG INTERACTIVE COSMOLOGY DIAGRAM */}
                <div className="bg-stone-950/80 rounded-xl p-4 sm:p-6 border border-stone-800/80">
                  <svg viewBox="0 0 900 480" className="w-full h-auto max-h-[500px]">
                    <defs>
                      <radialGradient id="singularityGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                        <stop offset="60%" stopColor="#d97706" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#1c1917" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id="prakritiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                      <linearGradient id="elementsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>

                    {/* Cosmic Background Rays */}
                    <circle cx="450" cy="240" r="210" fill="none" stroke="#292524" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="450" cy="240" r="160" fill="none" stroke="#44403c" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="450" cy="240" r="100" fill="none" stroke="#78716c" strokeWidth="1" />

                    {/* Phase 1: Singularity / Nasadiya Sukta (Center) */}
                    <g 
                      onClick={() => setSelectedElement('singularity')} 
                      className="cursor-pointer transition hover:opacity-90"
                    >
                      <circle cx="450" cy="240" r="45" fill="url(#singularityGlow)" />
                      <circle cx="450" cy="240" r="22" fill="#f59e0b" stroke="#fef3c7" strokeWidth="2" />
                      <text x="450" y="236" textAnchor="middle" fill="#1c1917" fontSize="9" fontWeight="bold">NASADIYA</text>
                      <text x="450" y="249" textAnchor="middle" fill="#1c1917" fontSize="8" fontWeight="bold">SINGULARITY</text>
                    </g>

                    {/* Phase 2: Hiranyagarbha (RV 10.121) */}
                    <g 
                      onClick={() => setSelectedElement('hiranyagarbha')} 
                      className="cursor-pointer transition hover:opacity-90"
                    >
                      <line x1="450" y1="195" x2="450" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2 2" />
                      <circle cx="450" cy="80" r="32" fill="#78350f" stroke="#fbbf24" strokeWidth="2" />
                      <text x="450" y="76" textAnchor="middle" fill="#fef3c7" fontSize="9" fontWeight="bold">HIRANYAGARBHA</text>
                      <text x="450" y="89" textAnchor="middle" fill="#fde68a" fontSize="8">Golden Embryo</text>
                    </g>

                    {/* Phase 3: Mahat & Ahankara (Cosmic Intelligence & Space) */}
                    <g 
                      onClick={() => setSelectedElement('mahat')} 
                      className="cursor-pointer transition hover:opacity-90"
                    >
                      <line x1="510" y1="210" x2="650" y2="150" stroke="#a855f7" strokeWidth="2" />
                      <circle cx="680" cy="140" r="36" fill="#3b0764" stroke="#c084fc" strokeWidth="2" />
                      <text x="680" y="136" textAnchor="middle" fill="#faf5ff" fontSize="9" fontWeight="bold">MAHAT & AHANKARA</text>
                      <text x="680" y="149" textAnchor="middle" fill="#e9d5ff" fontSize="8">Cosmic Mind & Field</text>
                    </g>

                    {/* Phase 4: Pancha Mahabhutas (5 Cosmic Elements) */}
                    <g 
                      onClick={() => setSelectedElement('elements')} 
                      className="cursor-pointer transition hover:opacity-90"
                    >
                      <line x1="510" y1="270" x2="650" y2="330" stroke="#06b6d4" strokeWidth="2" />
                      <circle cx="680" cy="340" r="36" fill="#083344" stroke="#22d3ee" strokeWidth="2" />
                      <text x="680" y="336" textAnchor="middle" fill="#ecfeff" fontSize="9" fontWeight="bold">5 MAHABHUTAS</text>
                      <text x="680" y="349" textAnchor="middle" fill="#cffafe" fontSize="8">Forces of Matter</text>
                    </g>

                    {/* Phase 5: Deep Time & Kalpas (Vishnu Purana 1.3.15) */}
                    <g 
                      onClick={() => setSelectedElement('kalpas')} 
                      className="cursor-pointer transition hover:opacity-90"
                    >
                      <line x1="390" y1="270" x2="250" y2="330" stroke="#f97316" strokeWidth="2" />
                      <circle cx="220" cy="340" r="36" fill="#431407" stroke="#fb923c" strokeWidth="2" />
                      <text x="220" y="336" textAnchor="middle" fill="#fff7ed" fontSize="9" fontWeight="bold">KALPAS & PRALAYA</text>
                      <text x="220" y="349" textAnchor="middle" fill="#ffedd5" fontSize="8">Deep Time (4.32B Yrs)</text>
                    </g>

                    {/* Phase 6: 14 Lokas & Brahmanda (Garuda Purana 2.1.32) */}
                    <g 
                      onClick={() => setSelectedElement('lokas')} 
                      className="cursor-pointer transition hover:opacity-90"
                    >
                      <line x1="390" y1="210" x2="250" y2="150" stroke="#10b981" strokeWidth="2" />
                      <circle cx="220" cy="140" r="36" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
                      <text x="220" y="136" textAnchor="middle" fill="#ecfdf5" fontSize="9" fontWeight="bold">14 LOKAS</text>
                      <text x="220" y="149" textAnchor="middle" fill="#a7f3d0" fontSize="8">Cosmic Realms</text>
                    </g>

                    {/* Orbit labels */}
                    <text x="450" y="440" textAnchor="middle" fill="#78716c" fontSize="11" letterSpacing="2">
                      RTA — THE INVIOLABLE COSMIC ORDER & LAWS OF PHYSICS
                    </text>
                  </svg>
                </div>

                {/* ELEMENT DETAILS BOX */}
                <div className="mt-6 bg-stone-800/90 border border-stone-700/80 rounded-xl p-5">
                  {selectedElement === 'singularity' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400 uppercase">Nasadiya Sukta (Rigveda 10.129.1)</span>
                        <span className="text-[11px] text-stone-400">Pre-Cosmic Singularity</span>
                      </div>
                      <p className="font-mono text-sm text-amber-200 italic">
                        "nāsadāsīn no sadāsīt tadānīṁ nāsīd rajo no vyomā paro yat..."
                      </p>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        <strong>Textual Grounding:</strong> Rigveda describes the origin state where neither manifest existence (sat) nor non-existence (asat) existed, neither space nor celestial matter, only the unmanifest oscillating by its own inherent heat (tapas).
                      </p>
                      <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                        <Atom className="w-3.5 h-3.5" />
                        Astrophysical Parallel: Pre-Big Bang Quantum Singularity & zero-entropy state.
                      </div>
                    </div>
                  )}

                  {selectedElement === 'hiranyagarbha' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400 uppercase">Hiranyagarbha Sukta (Rigveda 10.121.1)</span>
                        <span className="text-[11px] text-stone-400">Primordial Golden Egg</span>
                      </div>
                      <p className="font-mono text-sm text-amber-200 italic">
                        "hiraṇyagarbhaḥ samavartatāgre bhūtasya jātaḥ patir eka āsīt..."
                      </p>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        <strong>Textual Grounding:</strong> In the beginning arose the Golden Embryo (singularity of energy); once born, it became the sole upholder of all space and celestial matter.
                      </p>
                      <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                        <Atom className="w-3.5 h-3.5" />
                        Astrophysical Parallel: The primordial hyper-dense fireball expanding uniformly into spacetime.
                      </div>
                    </div>
                  )}

                  {selectedElement === 'mahat' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-400 uppercase">Sankhya & Vishnu Purana Book 1</span>
                        <span className="text-[11px] text-stone-400">Cosmic Intelligence & Differentiation</span>
                      </div>
                      <p className="font-mono text-sm text-purple-200 italic">
                        "prakṛtau līyate vyaktāvyaktaṁ prakṛtāv api..."
                      </p>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        <strong>Textual Grounding:</strong> Unmanifest primordial matter (Prakriti) perturbs into Mahat (cosmic principle of structured laws), evolving into Ahankara (field individuation) and the subtle potentials (tanmatras).
                      </p>
                      <div className="pt-2 flex items-center gap-2 text-xs text-purple-300 font-medium">
                        <Atom className="w-3.5 h-3.5" />
                        Physics Parallel: Symmetry breaking, quantum fluctuation fields, and law-governed cosmic evolution.
                      </div>
                    </div>
                  )}

                  {selectedElement === 'elements' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-400 uppercase">Shukla Yajurveda 32.1 & Taittiriya Upanishad</span>
                        <span className="text-[11px] text-stone-400">Pancha Mahabhutas (Universal Matter-Energy)</span>
                      </div>
                      <p className="font-mono text-sm text-cyan-200 italic">
                        "tad evāgnis tad ādityas tad vāyus tad u candramāḥ..."
                      </p>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        <strong>Textual Grounding:</strong> From Space (Akasha) emerged gaseous force (Vayu), from Vayu radiative plasma (Agni), from Agni liquid fluidity (Apas), and from Apas cohesive solid structure (Prithvi).
                      </p>
                      <div className="pt-2 flex items-center gap-2 text-xs text-cyan-300 font-medium">
                        <Atom className="w-3.5 h-3.5" />
                        Physics Parallel: Phase transitions of matter: vacuum/space, relativistic gas, plasma/radiation, liquids, and condensed matter.
                      </div>
                    </div>
                  )}

                  {selectedElement === 'kalpas' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-orange-400 uppercase">Vishnu Purana 1.3.15 & Garuda Purana</span>
                        <span className="text-[11px] text-stone-400">Deep Time Cosmological Cycles</span>
                      </div>
                      <p className="font-mono text-sm text-orange-200 italic">
                        "caturyugasahasraṁ tu brahmaṇo dinam ucyate..."
                      </p>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        <strong>Textual Grounding:</strong> One Day of Brahma is defined as 1,000 Mahayugas = 4.32 Billion solar years (Kalpa), followed by an equal period of dissolution (Mahapralaya).
                      </p>
                      <div className="pt-2 flex items-center gap-2 text-xs text-orange-300 font-medium">
                        <Atom className="w-3.5 h-3.5" />
                        Astrophysical Parallel: Close correspondence to the age of the Earth (~4.54 billion years) and cyclical cosmological models (Big Bounce / oscillatory universe).
                      </div>
                    </div>
                  )}

                  {selectedElement === 'lokas' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 uppercase">Garuda Purana 2.1.32 & Brahmanda Schema</span>
                        <span className="text-[11px] text-stone-400">14 Multidimensional Spheres</span>
                      </div>
                      <p className="font-mono text-sm text-emerald-200 italic">
                        "bhūr-ādyāḥ sapta lokās tu bhuvanāni caturdaśa | brahmāṇḍodara-madhye tu saṁsthitāni krameṇa vai ||"
                      </p>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        <strong>Textual Grounding:</strong> Garuda Purana maps the 14 cosmic spheres positioned inside the Brahmanda (cosmic egg) across 7 higher realms (Bhu, Bhuvar, Svar, Mahar, Jana, Tapas, Satya) and 7 lower subterranean regions.
                      </p>
                      <div className="pt-2 flex items-center gap-2 text-xs text-emerald-300 font-medium">
                        <Atom className="w-3.5 h-3.5" />
                        Cosmological Parallel: Multidimensional cosmological topology and planetary coordinate spheres.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VEDIC KNOWLEDGE TREE (ALL SUBJECTS) */}
          {activeTab === 'tree' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
                <div className="max-w-3xl mb-8">
                  <span className="text-xs uppercase tracking-widest font-bold text-amber-800">
                    Interdisciplinary Synthesis
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                    How the Vedas Connect to All Modern Subjects
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                    Vedic literature is not merely theological; it structured the original foundational sciences of ancient India. Explore how each modern academic discipline relates to its original Vedic branch.
                  </p>
                </div>

                {/* SUBJECT SELECTOR GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {correlations.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedSubject(c)}
                      className={`p-3.5 rounded-xl border text-left transition ${
                        selectedSubject?.id === c.id
                          ? 'border-amber-800 bg-amber-50/70 text-amber-950 font-semibold shadow-xs'
                          : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-700'
                      }`}
                    >
                      <div className="text-xs font-bold leading-snug">{c.subject}</div>
                      <div className="text-[10px] text-stone-500 mt-1 truncate">{c.vedic_tradition}</div>
                    </button>
                  ))}
                </div>

                {/* SELECTED SUBJECT DETAIL CARD */}
                {selectedSubject && (
                  <div className="bg-stone-50 rounded-2xl p-6 sm:p-8 border border-stone-200 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                          Disciplinary Bridge
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
                          {selectedSubject.subject}
                        </h3>
                      </div>
                      <div className="text-xs text-stone-500">
                        Ancient Source: <span className="font-semibold text-stone-800">{selectedSubject.ancient_treatises}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-2">
                        <span className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-amber-800" />
                          Classical Vedic Framework
                        </span>
                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                          {selectedSubject.description}
                        </p>
                        <div className="pt-2 text-[11px] text-stone-500">
                          <strong>Associated Traditions:</strong> {selectedSubject.vedic_tradition}
                        </div>
                      </div>

                      <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-200/60 shadow-xs space-y-2">
                        <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                          <Atom className="w-3.5 h-3.5 text-emerald-700" />
                          Modern Empirical & Scientific Parallel
                        </span>
                        <p className="text-xs sm:text-sm text-emerald-800/90 leading-relaxed">
                          {selectedSubject.modern_parallels}
                        </p>
                        <div className="pt-2 text-[11px] text-emerald-700">
                          <strong>Key Textual Citations:</strong> {selectedSubject.key_passages.join(', ')}
                        </div>
                      </div>
                    </div>

                    {/* Ask AI about this connection */}
                    <div className="pt-4 flex items-center justify-between">
                      <p className="text-xs text-stone-500">
                        Want an in-depth source analysis of {selectedSubject.subject}?
                      </p>
                      <Link
                        href={`/ask?q=${encodeURIComponent(`Explain the relationship between the Vedas and ${selectedSubject.subject} with verified citations.`)}`}
                        className="px-4 py-2 rounded-lg text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1.5 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        Explore in Ask VedaVerse
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CANONICAL PASSAGES LIST */}
          {activeTab === 'passages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2">
                <p className="text-xs sm:text-sm text-stone-500">
                  Showing {passages.length} verified passages on the Universe from Rigveda, Yajurveda, Samaveda, Atharvaveda, Vishnu Purana, and Garuda Purana.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {passages.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4 hover:border-amber-700/40 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                          {p.canonical_ref}
                        </span>
                        {p.meter && (
                          <span className="text-[11px] text-stone-500 font-medium">
                            Meter: {p.meter}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Verified Passage
                      </span>
                    </div>

                    {/* ORIGINAL SANSKRIT IN IAST ROMAN SCRIPT */}
                    <div className="bg-amber-50/40 rounded-xl p-4 border border-amber-200/60 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                        Original Sanskrit (IAST Roman Transliteration)
                      </span>
                      <p className="font-serif text-base sm:text-lg text-stone-900 leading-relaxed italic max-w-3xl mx-auto">
                        "{p.sanskrit_iast}"
                      </p>
                    </div>

                    {/* TRANSLATION */}
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
                      <div className="text-[11px] uppercase tracking-wider font-bold text-stone-500 mb-1">
                        English Translation
                      </div>
                      <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                        {p.translation_en}
                      </p>
                    </div>

                    {/* SELECTION RATIONALE */}
                    {p.why_selected_default && (
                      <p className="text-xs text-stone-500 leading-relaxed">
                        <strong>Cosmological Context:</strong> {p.why_selected_default}
                      </p>
                    )}

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <Link
                        href={`/ask?q=${encodeURIComponent(`Explain ${p.canonical_ref} in detail.`)}`}
                        className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
                      >
                        Ask VedaVerse about this verse <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
