'use client';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui';
import { Err, Loading, PageTitle, fmtDate, errMsg, useLoad } from '@/components/dash/kit';
export default function Stores() {
  const [q, setQ] = useState(''); const [applied, setApplied] = useState(''); const [status, setStatus] = useState(''); const [err, setErr] = useState('');
  const { data, error, loading, reload } = useLoad(() => api<{ stores: any[] }>(`/admin/stores?status=${status}&q=${encodeURIComponent(applied)}`), [applied, status]);
  async function set(id: string, s: string) { let reason = ''; if (s === 'suspended') { reason = prompt('Reason for suspension (required):') || ''; if (reason.trim().length < 3) return; } else if (!confirm(`Set store to ${s}?`)) return; setErr(''); try { await api(`/admin/stores/${id}/status`, { method: 'PATCH', body: { status: s, reason } }); reload(); } catch (e) { setErr(errMsg(e)); } }
  return (<div className="space-y-5"><PageTitle title="Store moderation" sub="Suspended stores and their products disappear from public pages immediately." />
    <form className="flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); setApplied(q); }}><input aria-label="Search company" className="input max-w-xs" placeholder="Company name" value={q} onChange={(e) => setQ(e.target.value)} /><select aria-label="Status" className="input max-w-[11rem]" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All</option><option value="published">Published</option><option value="draft">Draft</option><option value="suspended">Suspended</option></select><button className="btn-outline">Search</button></form><Err error={error || err} />
    {loading ? <Loading /> : <div className="card divide-y divide-line">{data?.stores.map((s) => (<div key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="font-medium">{s.profile?.companyName}</p><p className="text-sm text-muted">{s.profile?.city}, {s.profile?.country} · updated {fmtDate(s.updatedAt)}</p></div>
      <div className="flex items-center gap-2"><Badge tone={s.status === 'published' ? 'green' : s.status === 'suspended' ? 'red' : 'gray'}>{s.status}</Badge>{s.status === 'published' && <Link className="btn-outline" target="_blank" href={`/suppliers/${s.slug}`}>View</Link>}{s.status !== 'suspended' ? <button className="btn-outline text-bad" onClick={() => set(s.id, 'suspended')}>Suspend</button> : <button className="btn-outline" onClick={() => set(s.id, 'published')}>Restore</button>}</div></div>))}</div>}</div>);
}
