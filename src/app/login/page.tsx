'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus, ShieldCheck, ArrowRight, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isRegister ? 'register' : 'login',
          email,
          password,
          name: isRegister ? name : undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        router.push('/');
        router.refresh();
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('vedaverse123');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: userEmail,
          password: 'vedaverse123'
        })
      });
      const data = await res.json();
      if (data.success) {
        router.push(userEmail === 'admin@vedaverse.org' ? '/admin' : '/');
        router.refresh();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-amber-900 text-amber-50 flex items-center justify-center font-serif font-bold text-2xl mx-auto shadow-xs">
          V
        </div>
        <h1 className="font-serif text-2xl font-bold text-stone-900">
          {isRegister ? 'Create Scholar Profile' : 'Sign in to VedaVerse'}
        </h1>
        <p className="text-xs text-stone-500">
          Save passages, personal research notes, and track your Vedic learning journey.
        </p>
      </div>

      {/* QUICK PRE-CONFIGURED DEMO ACCOUNTS */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-2.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
          One-Click Demo Profiles
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => quickLogin('admin@vedaverse.org')}
            className="p-2.5 rounded-xl bg-white border border-amber-300 hover:border-amber-600 text-left text-xs transition"
          >
            <strong className="block text-stone-900">Acharya / Admin</strong>
            <span className="text-[10px] text-amber-800">Admin CMS & Gaps</span>
          </button>
          <button
            type="button"
            onClick={() => quickLogin('scholar@vedaverse.org')}
            className="p-2.5 rounded-xl bg-white border border-amber-300 hover:border-amber-600 text-left text-xs transition"
          >
            <strong className="block text-stone-900">Scholar User</strong>
            <span className="text-[10px] text-amber-800">Research & Notes</span>
          </button>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-800 border border-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div className="space-y-1">
              <label className="font-semibold text-stone-700">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acharya Vidyasagar"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 focus:bg-white text-xs"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-stone-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seeker@vedaverse.org"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 focus:bg-white text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-stone-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 focus:bg-white text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 font-bold transition shadow-xs cursor-pointer text-xs flex items-center justify-center gap-1.5"
          >
            {isRegister ? <UserPlus className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
            <span>{isRegister ? 'Register Profile' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100 text-xs">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-stone-600 hover:text-stone-900 underline font-medium"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
