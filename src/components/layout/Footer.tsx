import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Scale, Sparkles, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-20 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded bg-amber-600 text-amber-50 flex items-center justify-center font-serif font-bold text-base">
                V
              </div>
              <span className="font-serif text-lg font-bold text-stone-100">VedaVerse</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              A source-grounded research platform dedicated to transparent textual verification of Vedic and classical Indian wisdom.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Strict Anti-Hallucination Guarantee</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-3">Core Corpus</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link href="/library/rigveda" className="hover:text-amber-400 transition">Rigveda Samhita</Link></li>
              <li><Link href="/library/yajurveda" className="hover:text-amber-400 transition">Shukla Yajurveda</Link></li>
              <li><Link href="/library/samaveda" className="hover:text-amber-400 transition">Samaveda Samhita</Link></li>
              <li><Link href="/library/atharvaveda" className="hover:text-amber-400 transition">Atharvaveda Samhita</Link></li>
              <li><Link href="/library/isha-upanishad" className="hover:text-amber-400 transition">Mukhya Upanishads</Link></li>
              <li><Link href="/library/bhagavad-gita" className="hover:text-amber-400 transition">Bhagavad Gita</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-3">Methodology</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link href="/ask" className="hover:text-amber-400 transition">Four-Layer RAG Contract</Link></li>
              <li><Link href="/compare" className="hover:text-amber-400 transition">Multi-Tradition Exegesis</Link></li>
              <li><Link href="/sanskrit" className="hover:text-amber-400 transition">Sanskrit Padachheda</Link></li>
              <li><Link href="/concepts" className="hover:text-amber-400 transition">Ontology & Knowledge Graph</Link></li>
              <li><Link href="/research" className="hover:text-amber-400 transition">Academic Research Reports</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-3">Scholarly Policy</h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              VedaVerse never presents religious interpretation as medical or empirical science. All textual references are grounded in recognized public-domain translations and classical commentarial traditions.
            </p>
            <div className="p-2.5 rounded bg-stone-800/80 border border-stone-700/60 text-[11px] text-stone-300 flex items-start space-x-2">
              <Scale className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                "If the text does not say it, neither do we."
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500">
          <p>© {new Date().getFullYear()} VedaVerse Research Platform. Open Scholarly Knowledge.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <span>Rigveda</span>
            <span>•</span>
            <span>Upanishads</span>
            <span>•</span>
            <span>Vedanta</span>
            <span>•</span>
            <span>IAST Sanskrit</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
