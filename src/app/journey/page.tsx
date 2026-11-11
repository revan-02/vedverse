'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Bookmark, FileText, Sparkles, BookOpen, Clock, Trash2, ArrowRight } from 'lucide-react';

export default function JourneyPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bookmarks')
      .then(res => res.json())
      .then(data => {
        if (data.bookmarks) setBookmarks(data.bookmarks);
        if (data.notes) setNotes(data.notes);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const removeBookmark = async (itemId: string) => {
    try {
      await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'bookmark', item_id: itemId })
      });
      setBookmarks(prev => prev.filter(b => b.item_id !== itemId));
    } catch {}
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            Personal Knowledge Journal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-0.5">
            My Journey & Personal Library
          </h1>
          <p className="text-xs text-stone-500 max-w-2xl mt-1 leading-relaxed">
            Your saved canonical passages, research bookmarks, personal exegetical notes, and course progress. Private and securely isolated.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
            {bookmarks.length} Saved Passages
          </span>
        </div>
      </div>

      {/* RECENT SAVED PASSAGES */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-amber-800" />
          <span>Saved Textual Passages ({bookmarks.length})</span>
        </h2>

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="bg-white border border-stone-200 rounded-xl p-5 hover:border-amber-400 transition space-y-3 shadow-2xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-stone-900">
                      {bm.title}
                    </h3>
                    <span className="text-[10px] text-stone-400 font-mono">
                      Saved on {new Date(bm.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={() => removeBookmark(bm.item_id)}
                    className="p-1 text-stone-400 hover:text-red-600 transition"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-xs">
                  <Link
                    href={`/library?highlight=${bm.item_id}`}
                    className="font-semibold text-amber-900 hover:text-amber-800 flex items-center gap-1"
                  >
                    <span>Read in Context</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white border border-stone-200 rounded-2xl text-stone-500 text-xs space-y-2">
            <p>You haven't bookmarked any passages yet.</p>
            <p className="text-stone-400">
              Explore the <Link href="/library" className="text-amber-800 font-semibold underline">Vedic Library</Link> or <Link href="/ask" className="text-amber-800 font-semibold underline">Ask VedaVerse</Link> to save verses with a single click.
            </p>
          </div>
        )}
      </div>

      {/* RECENT INQUIRIES QUICK ACCESS */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-2">
          <Clock className="w-4 h-4 text-stone-500" />
          <span>Curated Questions to Explore Next</span>
        </h3>

        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            href="/ask?q=What%20do%20the%20Vedas%20say%20about%20controlling%20anger%3F"
            className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:border-amber-500 transition"
          >
            "Controlling Anger in Bhagavad Gita 2.62-63"
          </Link>
          <Link
            href="/ask?q=What%20is%20Dharma%20according%20to%20the%20texts%3F"
            className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:border-amber-500 transition"
          >
            "What is Dharma in Rigveda?"
          </Link>
          <Link
            href="/ask?q=What%20does%20the%20Vedas%20say%20about%20choosing%20a%20software%20engineering%20career%3F"
            className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-amber-900 font-medium hover:border-amber-500 transition"
          >
            "Software engineering and Svadharma"
          </Link>
          <Link
            href="/sanskrit?passage=RV-3.62.10"
            className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:border-amber-500 transition"
          >
            "Gayatri Mantra Padachheda Analysis"
          </Link>
        </div>
      </div>
    </div>
  );
}
