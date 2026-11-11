'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, Sparkles, Network, Languages, 
  Columns3, Calendar, Volume2, GraduationCap, 
  Compass, User, ShieldCheck, LogIn, LogOut, Menu, X, Orbit, Map
} from 'lucide-react';

interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' })
    });
    setUser(null);
    window.location.reload();
  };

  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryNavItems = [
    { href: '/ask', label: 'Ask VedaVerse', icon: Sparkles, highlight: true },
    { href: '/universe', label: 'Cosmology & Universe', icon: Orbit },
    { href: '/roadmap', label: 'Roadmap', icon: Map },
    { href: '/library', label: 'Vedic Library', icon: BookOpen },
    { href: '/concepts', label: 'Concept Graph', icon: Network },
    { href: '/sanskrit', label: 'Sanskrit Analysis', icon: Languages },
    { href: '/compare', label: 'Compare Traditions', icon: Columns3 },
  ];

  const secondaryNavItems = [
    { href: '/daily', label: 'Daily Wisdom', icon: Calendar },
    { href: '/mantras', label: 'Mantras & Sound', icon: Volume2 },
    { href: '/learn', label: 'Learn Courses', icon: GraduationCap },
    { href: '/research', label: 'Research Mode', icon: Compass },
    { href: '/journey', label: 'My Journey', icon: User },
  ];

  if (user && (user.role === 'admin' || user.role === 'scholar')) {
    secondaryNavItems.push({ href: '/admin', label: 'Admin CMS', icon: ShieldCheck });
  }

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];
  const isSecondaryActive = secondaryNavItems.some(item => pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)));

  return (
    <header className="sticky top-0 z-50 bg-[#fcfbf9]/95 backdrop-blur border-b border-[#e7e5e4] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand - Strictly Protected from Shrinking & Text Wrapping */}
          <Link href="/" className="flex items-center space-x-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-lg bg-amber-900 text-amber-50 flex items-center justify-center font-serif font-bold text-xl shadow-xs group-hover:bg-amber-800 transition shrink-0">
              V
            </div>
            <div className="shrink-0 flex flex-col justify-center">
              <div className="flex items-center gap-2 whitespace-nowrap leading-none">
                <span className="font-serif text-xl font-bold tracking-tight text-stone-900">
                  VedaVerse
                </span>
                <span className="text-[10px] uppercase font-sans font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200/90 whitespace-nowrap shrink-0 inline-flex items-center leading-none">
                  Scholarly RAG
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-sans hidden sm:block whitespace-nowrap mt-1 leading-none">
                Source-Grounded Vedic Research
              </p>
            </div>
          </Link>

          {/* Desktop Nav - Streamlined with Core Actions + More Dropdown */}
          <nav className="hidden lg:flex items-center space-x-1 shrink min-w-0">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition shrink-0 ${
                    item.highlight
                      ? 'bg-amber-900 text-amber-50 hover:bg-amber-800 shadow-xs'
                      : isActive
                      ? 'bg-stone-200/90 text-stone-900 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* More Dropdown */}
            <div className="relative shrink-0" ref={moreRef}>
              <button
                type="button"
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition ${
                  isSecondaryActive
                    ? 'bg-stone-200/90 text-stone-900 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <span>More</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {moreOpen && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white border border-stone-200 rounded-xl shadow-lg py-1.5 z-50">
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreOpen(false)}
                        className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium transition ${
                          isActive
                            ? 'bg-amber-50 text-amber-900 font-semibold'
                            : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-amber-800 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* User Profile / Auth */}
          <div className="hidden sm:flex items-center space-x-3 shrink-0">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs text-stone-600 font-medium whitespace-nowrap">
                  {user.name} <span className="text-[10px] text-amber-700 capitalize">({user.role})</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-stone-700 hover:bg-stone-100 border border-stone-300 transition whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Scholar Login</span>
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-stone-700 hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fcfbf9] border-b border-stone-200 px-4 pt-2 pb-4 space-y-1">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-4 h-4 text-amber-800" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-stone-600">Logged in as {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-600 font-medium px-2 py-1 bg-red-50 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-amber-800 font-medium px-3 py-1.5 bg-amber-50 rounded border border-amber-200 w-full text-center"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
