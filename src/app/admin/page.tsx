'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle, FileText, BarChart3, Database, RefreshCw } from 'lucide-react';

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAdminData = () => {
    setLoading(true);
    fetch('/api/admin')
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized or forbidden');
        return res.json();
      })
      .then(json => {
        setData(json);
        setError('');
      })
      .catch(err => {
        setError(err.message || 'Admin authorization failed. Log in with admin credentials.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateGap = async (gapId: string, status: string) => {
    setUpdatingId(gapId);
    try {
      await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_gap',
          gapId,
          status,
          notes: `Updated by Acharya on ${new Date().toLocaleDateString()}`
        })
      });
      fetchAdminData();
    } catch {} finally {
      setUpdatingId(null);
    }
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-stone-900">
          Acharya / Scholar Access Required
        </h1>
        <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
          The Admin Console oversees textual content approvals, citation audit registries, and knowledge gap resolution. Please authenticate with scholar or admin privileges.
        </p>
        <div className="pt-2">
          <a
            href="/login"
            className="px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-semibold inline-block transition"
          >
            Sign in as Acharya / Admin
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            Scholarly Governance & CMS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-0.5">
            Admin Console & Knowledge Gaps
          </h1>
          <p className="text-xs text-stone-500 max-w-2xl mt-1 leading-relaxed">
            Content verification workflows (Draft → Review → Verified → Published), review of anachronistic/unanswered user queries, and citation audit trail logs.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* METRICS OVERVIEW */}
      {data?.stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-stone-400">Canonical Texts</span>
            <p className="text-2xl font-serif font-bold text-stone-900 mt-1">{data.stats.texts}</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-stone-400">Verified Passages</span>
            <p className="text-2xl font-serif font-bold text-emerald-800 mt-1">{data.stats.passages}</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-stone-400">Ontology Concepts</span>
            <p className="text-2xl font-serif font-bold text-stone-900 mt-1">{data.stats.concepts}</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-stone-400">Registered Users</span>
            <p className="text-2xl font-serif font-bold text-stone-900 mt-1">{data.stats.users}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-amber-900">Pending Gaps</span>
            <p className="text-2xl font-serif font-bold text-amber-950 mt-1">{data.stats.pendingGaps}</p>
          </div>
        </div>
      )}

      {/* KNOWLEDGE GAPS TABLE */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif text-lg font-bold text-stone-900">
              Knowledge Gaps (Unanswered & Modern Inquiries)
            </h2>
          </div>
          <span className="text-xs text-stone-400">
            Anonymized queries lacking direct ancient passages
          </span>
        </div>

        <p className="text-xs text-stone-600">
          When users submit queries with no direct textual matches (e.g., modern vocational queries like <em>"software engineering"</em>), they are automatically logged here so scholars can verify whether a canonical passage or broader conceptual annotation should be integrated into the corpus.
        </p>

        {data?.knowledgeGaps && data.knowledgeGaps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-200 text-stone-600 font-semibold">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">User Query Under Inquiry</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data.knowledgeGaps.map((gap: any) => (
                  <tr key={gap.id} className="hover:bg-stone-50">
                    <td className="py-3 px-3 text-stone-400 font-mono text-[11px]">
                      {new Date(gap.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 font-medium text-stone-900">
                      "{gap.query_text}"
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        gap.status === 'pending_review' 
                          ? 'bg-amber-100 text-amber-900' 
                          : gap.status === 'source_added'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-stone-100 text-stone-700'
                      }`}>
                        {gap.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 space-x-1.5">
                      <button
                        onClick={() => handleUpdateGap(gap.id, 'source_added')}
                        disabled={updatingId === gap.id}
                        className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold transition"
                      >
                        Mark Grounded
                      </button>
                      <button
                        onClick={() => handleUpdateGap(gap.id, 'dismissed')}
                        disabled={updatingId === gap.id}
                        className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] transition"
                      >
                        Dismiss
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center bg-stone-50 rounded-xl text-stone-400 text-xs">
            No knowledge gaps currently pending review.
          </div>
        )}
      </div>

      {/* RECENT AUDIT LOGS */}
      {data?.auditLogs && data.auditLogs.length > 0 && (
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-3 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-stone-600 text-[11px]">
            Recent Content Governance Audit Logs
          </h3>
          <div className="space-y-1.5 font-mono text-[11px]">
            {data.auditLogs.map((log: any) => (
              <div key={log.id} className="flex items-center justify-between p-2 rounded bg-white border border-stone-200">
                <span className="text-stone-800 font-bold">{log.action}</span>
                <span className="text-stone-500">{log.target_type} ({log.target_id})</span>
                <span className="text-stone-400">{new Date(log.created_at).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
