'use client';

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Clock, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import Link from 'next/link';

interface Milestone {
  step: number;
  stage: string;
  title: string;
  vedic_focus: string;
  key_concept: string;
  scientific_parallel: string;
  duration_weeks: number;
}

export default function RoadmapPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load milestones from DB
    async function loadRoadmap() {
      try {
        const res = await fetch('/api/roadmap');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.milestones) {
            setMilestones(json.data.milestones);
          }
        }
      } catch (err) {
        console.error('Error fetching roadmap:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRoadmap();

    // Load completed steps from localStorage
    try {
      const saved = localStorage.getItem('vedaverse_completed_steps');
      if (saved) {
        setCompletedSteps(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const toggleStep = (stepNumber: number) => {
    let next: number[];
    if (completedSteps.includes(stepNumber)) {
      next = completedSteps.filter((s) => s !== stepNumber);
    } else {
      next = [...completedSteps, stepNumber];
    }
    setCompletedSteps(next);
    try {
      localStorage.setItem('vedaverse_completed_steps', JSON.stringify(next));
    } catch {}
  };

  const totalWeeks = milestones.reduce((acc, m) => acc + (m.duration_weeks || 0), 0);
  const progressPercent = milestones.length > 0 
    ? Math.round((completedSteps.length / milestones.length) * 100) 
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER */}
      <div className="border-b border-stone-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200/60 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-700" />
              Comprehensive Academic Curriculum
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200/60 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Source Grounded
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Vedic Knowledge & Cosmology Roadmap
          </h1>
          <p className="text-sm text-stone-600 max-w-2xl mt-2 leading-relaxed">
            A structured, 16-week interdisciplinary journey from primordial Vedic cosmogony to Puranic deep time, Upanishadic cognitive psychology, and modern scientific synthesis.
          </p>
        </div>

        {/* PROGRESS CARD */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 w-full md:w-64 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-600">Overall Progress</span>
            <span className="font-bold text-amber-900">{progressPercent}%</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-800 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span>{completedSteps.length} of {milestones.length} Completed</span>
            <span>~{totalWeeks} Weeks Total</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-10 h-10 border-3 border-amber-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-stone-500 font-medium">Loading curriculum milestones from database...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {milestones.map((m, idx) => {
            const isCompleted = completedSteps.includes(m.step);
            return (
              <div
                key={m.step}
                className={`bg-white rounded-2xl p-6 sm:p-8 border transition duration-200 ${
                  isCompleted 
                    ? 'border-emerald-200 bg-emerald-50/10 shadow-xs' 
                    : 'border-stone-200 shadow-sm hover:border-amber-700/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* STEP BADGE / CHECKBOX */}
                    <button
                      onClick={() => toggleStep(m.step)}
                      className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'border-stone-300 hover:border-amber-700 text-stone-400 bg-stone-50'
                      }`}
                      title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="text-xs font-bold font-mono text-stone-700">{m.step}</span>
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                          {m.stage}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="text-[11px] text-stone-500 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {m.duration_weeks} Weeks Recommended
                        </span>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                        {m.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Link
                      href={`/ask?q=${encodeURIComponent(`Explain Milestone ${m.step}: ${m.title} based on ${m.vedic_focus}`)}`}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      Ask VedaVerse
                    </Link>
                  </div>
                </div>

                {/* DETAILS GRID */}
                <div className="mt-6 pt-5 border-t border-stone-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/70 space-y-1">
                    <span className="font-bold text-stone-700 uppercase tracking-wide block text-[10px]">
                      Vedic Textual Corpus
                    </span>
                    <p className="text-stone-800 leading-relaxed font-medium">
                      {m.vedic_focus}
                    </p>
                  </div>

                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/70 space-y-1">
                    <span className="font-bold text-stone-700 uppercase tracking-wide block text-[10px]">
                      Key Philosophical Concepts
                    </span>
                    <p className="text-stone-800 leading-relaxed font-medium">
                      {m.key_concept}
                    </p>
                  </div>

                  <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/70 space-y-1">
                    <span className="font-bold text-emerald-900 uppercase tracking-wide block text-[10px]">
                      Modern Scientific Parallels
                    </span>
                    <p className="text-emerald-950 leading-relaxed font-medium">
                      {m.scientific_parallel}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CURRICULUM FOOTER */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="font-serif text-lg font-bold text-amber-200">
            Ready to explore the original texts?
          </h4>
          <p className="text-xs text-stone-400 max-w-xl">
            Inspect the full textual database with Sanskrit verses, IAST transliterations, and traditional commentaries in the Vedic Library.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/universe"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-800 hover:bg-amber-700 text-white transition flex items-center gap-1.5"
          >
            Cosmology & Pictorial Diagram
          </Link>
          <Link
            href="/library"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-white border border-stone-700 transition"
          >
            Vedic Library
          </Link>
        </div>
      </div>
    </div>
  );
}
