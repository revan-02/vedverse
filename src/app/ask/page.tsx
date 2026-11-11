'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, Search, ArrowRight, Loader2, 
  HelpCircle, ShieldCheck, RefreshCw, MessageSquarePlus, 
  Send, BookOpen, Layers, ExternalLink 
} from 'lucide-react';
import LayeredResponseCard from '@/components/source/LayeredResponseCard';
import { RagResponseContract } from '@/types';

function AskContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [question, setQuestion] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ sender: string; text: string; data?: RagResponseContract }>>([]);
  const [conversationId, setConversationId] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setConversationId(`conv-${Date.now()}`);
    if (initialQuery) {
      executeAsk(initialQuery);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, loading]);

  const executeAsk = async (queryToRun: string) => {
    if (!queryToRun.trim() || loading) return;

    const trimmed = queryToRun.trim();
    setQuestion('');
    setLoading(true);

    // Append user question to local history
    const userMsg = { sender: 'user', text: trimmed };
    setHistory(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          conversationId,
          history: history.map(h => ({ sender: h.sender, text: h.text }))
        })
      });

      const resJson = await res.json();
      if (resJson.success && resJson.data) {
        setHistory(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: resJson.data.ai_explanation,
            data: resJson.data
          }
        ]);
      } else {
        setHistory(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: resJson.error || 'The explanation service could not process this request.'
          }
        ]);
      }
    } catch {
      setHistory(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'The explanation service is temporarily unavailable. All verified texts remain accessible in the library.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (preset: string) => {
    setQuestion(preset);
    executeAsk(preset);
  };

  const resetConversation = () => {
    setHistory([]);
    setConversationId(`conv-${Date.now()}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Ask VedaVerse
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
              Four-Layer RAG
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Source-grounded research interface with verified citations, Sanskrit context, and anti-hallucination guardrails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={resetConversation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Inquiry</span>
            </button>
          )}
        </div>
      </div>

      {/* CONVERSATION STREAM / RESPONSES */}
      <div className="space-y-8">
        {history.length === 0 && (
          <div className="bg-white border-2 border-dashed border-stone-300 rounded-2xl p-8 sm:p-12 text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-amber-800" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Begin an Inquiry with Textual Evidence
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Ask about specific Vedic concepts, mantras, or psychological principles. VedaVerse retrieves verified Sanskrit passages before presenting any commentary or modern analysis.
              </p>
            </div>

            {/* Curated Prompt Badges */}
            <div className="pt-2 max-w-2xl mx-auto space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                Recommended Inquiries
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => handlePreset('What do the Vedas say about controlling anger?')}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 transition text-left"
                >
                  ⚡ "What do the Vedas say about controlling anger?"
                </button>
                <button
                  onClick={() => handlePreset('What does the Vedas say about choosing a software engineering career?')}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/80 text-amber-950 transition text-left"
                >
                  💻 "What does the Vedas say about a software engineering career?"
                </button>
                <button
                  onClick={() => handlePreset('What is Dharma according to the texts?')}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 transition text-left"
                >
                  📜 "What is Dharma according to the texts?"
                </button>
                <button
                  onClick={() => handlePreset('Explain Gayatri Mantra with original Sanskrit')}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 transition text-left"
                >
                  🕉️ "Explain Gayatri Mantra with original Sanskrit"
                </button>
                <button
                  onClick={() => handlePreset('What is the chariot metaphor in Katha Upanishad?')}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 transition text-left"
                >
                  🏹 "What is the chariot metaphor in Katha Upanishad?"
                </button>
                <button
                  onClick={() => handlePreset('What is Nishkama Karma according to Bhagavad Gita?')}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 transition text-left"
                >
                  ⚖️ "What is Nishkama Karma?"
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History items */}
        {history.map((msg, idx) => (
          <div key={idx} className="space-y-4">
            {msg.sender === 'user' ? (
              <div className="flex items-start justify-end gap-3">
                <div className="bg-amber-900 text-amber-50 px-5 py-3 rounded-2xl rounded-tr-xs text-sm font-medium shadow-xs max-w-2xl">
                  {msg.text}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {msg.data ? (
                  <LayeredResponseCard data={msg.data} />
                ) : (
                  <div className="bg-white border border-stone-200 rounded-xl p-6 text-sm text-stone-800 leading-relaxed shadow-xs">
                    {msg.text}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white border border-stone-200 rounded-xl p-8 text-center space-y-3 shadow-xs animate-pulse">
            <Loader2 className="w-6 h-6 text-amber-800 animate-spin mx-auto" />
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Grounding in Canonical Textual Database...
              </p>
              <p className="text-[11px] text-stone-500">
                Extracting concepts • Searching FTS5 & Vector Index • Verifying Primary Citations
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* FIXED / STICKY QUERY BAR */}
      <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur border border-stone-300 rounded-2xl shadow-xl p-2.5 transition">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeAsk(question);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about a passage, Sanskrit verse, concept, or moral question..."
              disabled={loading}
              className="w-full pl-4 pr-10 py-3 text-sm bg-transparent rounded-xl focus:outline-none placeholder:text-stone-400 font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={!question.trim() || loading}
            className="px-5 py-3 rounded-xl bg-amber-900 hover:bg-amber-800 disabled:bg-stone-300 text-amber-50 text-xs font-bold tracking-wide flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-sm"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AskPage() {
  return (
    <Suspense fallback={
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 text-amber-800 animate-spin" />
        <span>Loading VedaVerse Query Engine...</span>
      </div>
    }>
      <AskContent />
    </Suspense>
  );
}

