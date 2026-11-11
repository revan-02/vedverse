'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX,
  Repeat, 
  ShieldCheck, 
  BookOpen, 
  Play, 
  Pause, 
  RotateCcw,
  Sparkles,
  Waves,
  Music,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

interface MantraItem {
  id: string;
  title: string;
  canonical_ref: string;
  sanskrit: string;
  iast: string;
  meter: string;
  fundamental_hz: number;
  meaning: string;
  phonetic_syllables: string[];
}

export default function MantrasPage() {
  const [mantras, setMantras] = useState<MantraItem[]>([]);
  const [selectedMantra, setSelectedMantra] = useState<MantraItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Audio & Chanting State
  const [isPlayingDrone, setIsPlayingDrone] = useState(false);
  const [isPlayingPronunciation, setIsPlayingPronunciation] = useState(false);
  const [activeSyllableIndex, setActiveSyllableIndex] = useState<number>(-1);
  const [repeatCount, setRepeatCount] = useState<number>(0);
  const [targetRepeats, setTargetRepeats] = useState<number>(11);

  // Web Audio Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const pronunciationTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadMantras() {
      try {
        const res = await fetch('/api/mantras');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.mantras) {
            setMantras(json.data.mantras);
            if (json.data.mantras.length > 0) {
              setSelectedMantra(json.data.mantras[0]);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load mantras:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMantras();

    return () => {
      stopDrone();
      stopPronunciation();
    };
  }, []);

  // Web Audio Drone Synthesizer (136.1 Hz Pranava Drone)
  const toggleDrone = () => {
    if (isPlayingDrone) {
      stopDrone();
    } else {
      startDrone();
    }
  };

  const startDrone = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const fundamental = selectedMantra?.fundamental_hz || 136.1;

      // Gain master
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 1.2);
      gain.connect(ctx.destination);
      gainNodeRef.current = gain;

      // Primary Oscillator (fundamental drone)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(fundamental, ctx.currentTime);
      osc1.connect(gain);
      osc1.start();
      osc1Ref.current = osc1;

      // Secondary Harmonic Oscillator (octave + fifth harmonic tanpura shimmer)
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(fundamental * 1.5, ctx.currentTime);
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.05, ctx.currentTime);
      osc2.connect(subGain);
      subGain.connect(gain);
      osc2.start();
      osc2Ref.current = osc2;

      setIsPlayingDrone(true);
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  };

  const stopDrone = () => {
    try {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.5);
      }
      setTimeout(() => {
        osc1Ref.current?.stop();
        osc2Ref.current?.stop();
        osc1Ref.current?.disconnect();
        osc2Ref.current?.disconnect();
        osc1Ref.current = null;
        osc2Ref.current = null;
        setIsPlayingDrone(false);
      }, 500);
    } catch {
      setIsPlayingDrone(false);
    }
  };

  // Step-by-Step Phonetic Syllable Pronunciation Player
  const togglePronunciation = () => {
    if (isPlayingPronunciation) {
      stopPronunciation();
    } else {
      startPronunciation();
    }
  };

  const speakSyllable = (text: string, pitch = 1.0) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.82;
      utterance.pitch = pitch;
      // Use English voice for speech synthesis
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  // Play acoustic bell tone for Vedic Svara
  const playSvaraPing = (freq: number) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      g.gain.setValueAtTime(0.08, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch {}
  };

  const startPronunciation = () => {
    if (!selectedMantra || !selectedMantra.phonetic_syllables?.length) return;
    setIsPlayingPronunciation(true);

    const syllables = selectedMantra.phonetic_syllables;
    let idx = 0;

    const playNext = () => {
      if (idx < syllables.length) {
        setActiveSyllableIndex(idx);
        const syl = syllables[idx];

        // Alternating pitch for Udatta / Anudatta Vedic accents
        const pitch = idx % 3 === 0 ? 1.15 : (idx % 3 === 1 ? 1.0 : 0.9);
        speakSyllable(syl, pitch);
        playSvaraPing(idx % 2 === 0 ? 272.2 : 204.1);

        idx++;
        pronunciationTimerRef.current = setTimeout(playNext, 650);
      } else {
        // Completed one cycle
        setActiveSyllableIndex(-1);
        setRepeatCount(prev => {
          const next = prev + 1;
          if (next >= targetRepeats) {
            playSvaraPing(432); // Celebration chime
            stopPronunciation();
          } else {
            // Loop for next repeat after pause
            pronunciationTimerRef.current = setTimeout(() => {
              idx = 0;
              playNext();
            }, 1000);
          }
          return next;
        });
      }
    };

    playNext();
  };

  const stopPronunciation = () => {
    if (pronunciationTimerRef.current) {
      clearTimeout(pronunciationTimerRef.current);
      pronunciationTimerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingPronunciation(false);
    setActiveSyllableIndex(-1);
  };

  const resetCount = () => {
    stopPronunciation();
    setRepeatCount(0);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            Sacred Chanting & Phonetic Resonance
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-0.5">
            Vedic Mantras, Sound & Pronunciation
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mt-1 leading-relaxed">
            Source-grounded mantras with Web Audio 136.1 Hz Pranava drone synthesis, exact syllable-by-syllable pronunciation guidance, and traditional repetition tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Padapatha Phonetics Grounded
          </span>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-10 h-10 border-3 border-amber-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-stone-500 font-medium">Loading mantras from database...</p>
        </div>
      ) : (
        <>
          {/* MANTRA SELECTOR */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {mantras.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  stopDrone();
                  stopPronunciation();
                  setSelectedMantra(m);
                  setRepeatCount(0);
                }}
                className={`p-4 rounded-xl text-left border transition ${
                  selectedMantra?.id === m.id
                    ? 'border-amber-800 bg-amber-50/70 text-amber-950 font-semibold shadow-xs ring-1 ring-amber-800/30'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="text-xs text-stone-500 font-mono">{m.canonical_ref}</div>
                <div className="font-serif text-base font-bold text-stone-900 mt-1">
                  {m.title.replace(/\s*\([\u0900-\u097F\s]+\)/g, '')}
                </div>
                <div className="text-[11px] text-amber-800 mt-1">Meter: {m.meter}</div>
              </button>
            ))}
          </div>

          {selectedMantra && (
            <div className="space-y-8">
              {/* MAIN CHANTING CARD */}
              <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-800 relative overflow-hidden space-y-8">
                {/* Glow Backdrop */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

                {/* Top Info Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                      Canonical Source Locus
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                      {selectedMantra.title.replace(/\s*\([\u0900-\u097F\s]+\)/g, '')}
                    </h2>
                    <span className="text-xs text-stone-400 font-mono">
                      {selectedMantra.canonical_ref} • {selectedMantra.meter}
                    </span>
                  </div>

                  {/* Frequency badge */}
                  <div className="flex items-center gap-2 bg-stone-800/80 px-3 py-1.5 rounded-full border border-stone-700 text-xs text-amber-300">
                    <Waves className="w-4 h-4 text-amber-400" />
                    <span>Fundamental: {selectedMantra.fundamental_hz} Hz (Om Resonance)</span>
                  </div>
                </div>

                {/* SANSKRIT SCRIPTURE (PROMINENT IAST ROMAN SCRIPT) */}
                <div className="text-center py-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                    Authentic Phonetic Text (IAST Roman Script)
                  </span>
                  <p className="font-serif text-xl sm:text-3xl font-medium text-amber-100 leading-relaxed italic tracking-wide max-w-3xl mx-auto">
                    "{selectedMantra.iast}"
                  </p>
                </div>

                {/* INTERACTIVE PHONETIC SYLLABLES BREAKDOWN WITH REAL-TIME HIGHLIGHT */}
                <div className="bg-stone-950/70 rounded-2xl p-5 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-bold text-stone-400 flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5 text-amber-400" />
                      Phonetic Syllable Breakdown (Padapatha)
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Click any syllable to hear pronunciation
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedMantra.phonetic_syllables?.map((syl, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          speakSyllable(syl);
                          playSvaraPing(220 + (i * 10));
                          setActiveSyllableIndex(i);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition duration-150 ${
                          activeSyllableIndex === i
                            ? 'bg-amber-400 text-stone-950 font-bold scale-110 shadow-lg ring-2 ring-amber-200'
                            : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/60'
                        }`}
                      >
                        {syl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TRANSLATION & MEANING */}
                <div className="bg-stone-800/60 rounded-xl p-4 sm:p-5 border border-stone-700/60 text-xs sm:text-sm text-stone-300 leading-relaxed">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-amber-400 mb-1">
                    Exact English Translation
                  </div>
                  {selectedMantra.meaning}
                </div>

                {/* AUDIO CONTROLS & REPETITION TRACKER */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-stone-800">
                  {/* SOUND GENERATORS */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                      Acoustic Playback
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {/* Syllable Chanting Button */}
                      <button
                        onClick={togglePronunciation}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                          isPlayingPronunciation
                            ? 'bg-amber-400 text-stone-950 shadow-md ring-2 ring-amber-300'
                            : 'bg-amber-800 hover:bg-amber-700 text-white'
                        }`}
                      >
                        {isPlayingPronunciation ? (
                          <>
                            <Pause className="w-4 h-4" /> Pause Pronunciation
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 text-amber-300" /> Play Phonetic Chanting
                          </>
                        )}
                      </button>

                      {/* Om Drone Synth Button */}
                      <button
                        onClick={toggleDrone}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 transition ${
                          isPlayingDrone
                            ? 'bg-stone-700 border-amber-400 text-amber-300 ring-1 ring-amber-400'
                            : 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-200'
                        }`}
                      >
                        {isPlayingDrone ? (
                          <>
                            <VolumeX className="w-4 h-4 text-amber-400" /> Stop 136.1Hz Drone
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4 text-amber-400" /> Play 136.1Hz Drone
                          </>
                        )}
                      </button>
                    </div>

                    {/* Status note */}
                    <p className="text-[11px] text-stone-400">
                      {isPlayingPronunciation
                        ? `Syllable ${activeSyllableIndex + 1} of ${selectedMantra.phonetic_syllables.length} playing...`
                        : isPlayingDrone
                        ? 'Continuous Tanpura / Pranava acoustic resonance active.'
                        : 'Web Audio API synthesizes acoustic resonance without external audio streaming.'}
                    </p>
                  </div>

                  {/* JAPA / REPETITIONS TRACKER */}
                  <div className="space-y-3 bg-stone-950/60 p-4 rounded-xl border border-stone-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Repeat className="w-3.5 h-3.5 text-amber-400" />
                        Chant Cycles Completed
                      </span>
                      <button
                        onClick={resetCount}
                        className="text-[11px] text-stone-400 hover:text-stone-200 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Reset
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="font-mono text-3xl font-bold text-amber-300">
                        {repeatCount} <span className="text-xs text-stone-500 font-normal">/ {targetRepeats}</span>
                      </div>

                      <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-lg border border-stone-800 text-xs">
                        {[11, 21, 108].map(target => (
                          <button
                            key={target}
                            onClick={() => setTargetRepeats(target)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                              targetRepeats === target
                                ? 'bg-amber-800 text-white'
                                : 'text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            {target}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-400 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.round((repeatCount / targetRepeats) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STUDY & LINGUISTIC CONTEXT */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Linguistic & Metrical Authenticity
                  </h3>
                  <Link
                    href={`/ask?q=${encodeURIComponent(`Provide a word-by-word grammatical and philosophical analysis of ${selectedMantra.canonical_ref}`)}`}
                    className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Analyze Grammar in Ask VedaVerse
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-600">
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/70 space-y-1">
                    <span className="font-bold text-stone-800 uppercase block text-[10px]">
                      Vedic Meter (Chandas)
                    </span>
                    <p className="leading-relaxed">
                      This mantra is composed in strict <strong>{selectedMantra.meter}</strong>. Vedic meters follow precise mathematical syllable groupings designed for optimal breath control (Pranayama) and acoustic balance.
                    </p>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/70 space-y-1">
                    <span className="font-bold text-stone-800 uppercase block text-[10px]">
                      Svara (Tonal Accents)
                    </span>
                    <p className="leading-relaxed">
                      Classical Vedic recitation adheres strictly to three melodic pitch levels: <em>Udātta</em> (high acute), <em>Anudātta</em> (grave/base tone), and <em>Svarita</em> (circumflex transition).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
