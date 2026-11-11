'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, XCircle, Award, HelpCircle, ArrowRight } from 'lucide-react';

export default function LessonDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [lesson, setLesson] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Fetch lesson from local API or preloaded client data
    fetch(`/api/search?q=${slug}`) // Or direct fetch
      .catch(() => {});
  }, [slug]);

  // Let's create an embedded loader or API endpoint for lessons
  // Alternatively, we can load from a simple client fetch or direct state
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex items-center space-x-2 text-xs text-stone-500 border-b border-stone-200 pb-4">
        <Link href="/learn" className="hover:text-stone-900 transition flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Courses</span>
        </Link>
        <span>/</span>
        <span className="text-amber-900 font-bold capitalize">{slug.replace(/-/g, ' ')}</span>
      </div>

      {/* LESSON CONTENT */}
      <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 sm:p-10 space-y-6 shadow-xs">
        <h1 className="font-serif text-3xl font-bold text-stone-900 capitalize">
          {slug.replace(/-/g, ' ')}
        </h1>

        <div className="prose prose-stone max-w-none text-stone-800 text-sm sm:text-base leading-relaxed space-y-4">
          <p>
            Vedic literature represents an unbroken lineage of inquiry into cosmic law (<em>Rta</em>), individual duty (<em>Dharma</em>), and the nature of consciousness (<em>Atman/Brahman</em>).
          </p>
          <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-2">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
              Key Pedagogical Takeaways
            </h3>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-stone-700">
              <li>The four Vedas are Rigveda, Yajurveda, Samaveda, and Atharvaveda.</li>
              <li>Each Veda contains Samhita (mantras), Brahmana (ritual explanation), Aranyaka (meditation), and Upanishad (Vedanta philosophy).</li>
              <li>Sanskrit terminology possesses exact root morphology (dhātu) that cannot be reduced to simplistic English dogmas.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* INTERACTIVE QUIZ SECTION */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-800" />
            <h2 className="font-serif text-lg font-bold text-stone-900">
              Interactive Comprehension Quiz
            </h2>
          </div>
          <span className="text-xs text-stone-500">2 Questions</span>
        </div>

        {/* Question 1 */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3">
          <p className="text-sm font-semibold text-stone-900">
            1. What is the verbal root of the Sanskrit term 'Veda'?
          </p>
          <div className="space-y-2">
            {['Vṛ (to choose)', 'Vid (to know)', 'Vas (to reside)', 'Vand (to praise)'].map((opt, i) => (
              <label
                key={i}
                className={`flex items-center gap-3 p-3 rounded-lg border text-xs cursor-pointer transition ${
                  selectedAnswers['q1'] === i
                    ? 'border-amber-600 bg-amber-50/50 text-amber-950 font-medium'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-800'
                }`}
              >
                <input
                  type="radio"
                  name="q1"
                  checked={selectedAnswers['q1'] === i}
                  onChange={() => setSelectedAnswers(prev => ({ ...prev, q1: i }))}
                  className="text-amber-800 focus:ring-amber-500"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>

          {submitted && (
            <div className={`p-3 rounded-lg text-xs mt-2 ${selectedAnswers['q1'] === 1 ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'}`}>
              {selectedAnswers['q1'] === 1 ? (
                <div className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Correct! Veda derives from 'vid' (विद्), meaning 'to know'.</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 font-semibold">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>Incorrect. Correct answer is: Vid (to know).</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Question 2 */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3">
          <p className="text-sm font-semibold text-stone-900">
            2. Which stratum of Vedic texts focuses primarily on ultimate philosophical inquiries on Brahman and Atman?
          </p>
          <div className="space-y-2">
            {['Samhita (Mantra collections)', 'Brahmana (Ritual prose)', 'Upanishad (Vedanta dialogues)', 'Kalpa Sutra'].map((opt, i) => (
              <label
                key={i}
                className={`flex items-center gap-3 p-3 rounded-lg border text-xs cursor-pointer transition ${
                  selectedAnswers['q2'] === i
                    ? 'border-amber-600 bg-amber-50/50 text-amber-950 font-medium'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-800'
                }`}
              >
                <input
                  type="radio"
                  name="q2"
                  checked={selectedAnswers['q2'] === i}
                  onChange={() => setSelectedAnswers(prev => ({ ...prev, q2: i }))}
                  className="text-amber-800 focus:ring-amber-500"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>

          {submitted && (
            <div className={`p-3 rounded-lg text-xs mt-2 ${selectedAnswers['q2'] === 2 ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'}`}>
              {selectedAnswers['q2'] === 2 ? (
                <div className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Correct! The Upanishads represent the culmination of Vedic wisdom.</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 font-semibold">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>Incorrect. Correct answer is: Upanishad (Vedanta dialogues).</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => setSubmitted(true)}
            disabled={submitted || selectedAnswers['q1'] === undefined}
            className="px-6 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 disabled:bg-stone-300 text-amber-50 text-xs font-bold transition cursor-pointer shadow-xs"
          >
            Submit Quiz
          </button>

          <Link
            href="/learn"
            className="text-xs font-semibold text-stone-700 hover:text-stone-900 flex items-center gap-1"
          >
            <span>Back to Syllabus</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
