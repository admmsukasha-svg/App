'use client';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Badge, EmptyState } from '@/components/ui';
import { Err, Loading, PageTitle, label, fmtDate, errMsg, useLoad } from '@/components/dash/kit';
const href = (t: string, id: string) => t === 'product' ? `/products/${id}` : t === 'c2c' ? `/c2c/${id}` : null;
export default function Reports() {
  const [status, setStatus] = useState('open'); const [err, setErr] = useState('');
  const { data, error, loading, reload } = useLoad(() => api<{ reports: any[] }>(`/admin/reports?status=${status}`), [status]);
  async function set(id: string, s: string) { const resolution = s === 'reviewing' ? '' : prompt('Resolution note:') || ''; if (s !== 'reviewing' && !resolution.trim()) return; setErr(''); try { await api(`/admin/reports/${id}`, { method: 'PATCH', body: { status: s, resolution } }); reload(); } catch (e) { setErr(errMsg(e)); } }
  return (<div className="space-y-5"><PageTitle title="Reports and complaints" sub="To act on a listing, use Product review / C2C listings / Stores, then record the outcome here." /><div className="flex gap-2">{['open', 'reviewing', 'actioned', 'dismissed'].map((t) => <button key={t} onClick={() => setStatus(t)} className={status === t ? 'btn-dark' : 'btn-outline'}>{label(t)}</button>)}</div><Err error={error || err} />
    {loading ? <Loading /> : !data?.reports.length ? <EmptyState title="No reports in this queue" /> : data.reports.map((r) => (<article key={r.id} className="card space-y-2 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-medium"><Badge tone="orange">{label(r.reason)}</Badge> {label(r.targetType)} <span className="font-mono text-xs">{r.targetId}</span></p><span className="text-xs text-muted">{fmtDate(r.createdAt)} · by {r.reporter?.name}</span></div>
      {r.details && <p className="text-sm">{r.details}</p>}{href(r.targetType, r.targetId) && <Link className="text-sm text-brand-dark underline" href={href(r.targetType, r.targetId)!} target="_blank">Open target</Link>}{r.resolution && <p className="text-sm text-muted">Resolution: {r.resolution}</p>}
      {['open', 'reviewing'].includes(r.status) && <div className="flex gap-2">{r.status === 'open' && <button className="btn-outline" onClick={() => set(r.id, 'reviewing')}>Start review</button>}<button className="btn-primary" onClick={() => set(r.id, 'actioned')}>Mark actioned</button><button className="btn-outline" onClick={() => set(r.id, 'dismissed')}>Dismiss</button></div>}</article>))}</div>);
}
