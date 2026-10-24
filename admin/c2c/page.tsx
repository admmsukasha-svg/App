'use client';
import { useState } from 'react';
import { api, money } from '@/lib/api';
import { EmptyState, SafeImg } from '@/components/ui';
import { Err, Loading, PageTitle, label, errMsg, useLoad } from '@/components/dash/kit';
export default function AdminC2C() {
  const [status, setStatus] = useState('pending'); const [err, setErr] = useState('');
  const { data, error, loading, reload } = useLoad(() => api<{ listings: any[] }>(`/admin/c2c?status=${status}`), [status]);
  async function act(id: string, a: string) { let reason = ''; if (a !== 'approve') { reason = prompt(`Reason to ${a}:`) || ''; if (reason.trim().length < 3) return; } setErr(''); try { await api(`/admin/c2c/${id}/${a}`, { body: { reason } }); reload(); } catch (e) { setErr(errMsg(e)); } }
  return (<div className="space-y-5"><PageTitle title="C2C listings" /><div className="flex gap-2">{['pending', 'approved', 'rejected', 'removed'].map((t) => <button key={t} onClick={() => setStatus(t)} className={status === t ? 'btn-dark' : 'btn-outline'}>{label(t)}</button>)}</div><Err error={error || err} />
    {loading ? <Loading /> : !data?.listings.length ? <EmptyState title="Nothing in this queue" /> : data.listings.map((l) => (<article key={l.id} className="card flex flex-col gap-4 p-4 sm:flex-row"><SafeImg src={l.img || l.images?.[0]} alt={l.title} className="h-24 w-32 shrink-0 rounded-lg" /><div className="min-w-0 flex-1"><h2 className="font-semibold">{l.title}</h2><p className="text-sm text-muted">{money(l.price, 'PKR')} · {l.city} · {l.user?.name} ({l.user?.email})</p><p className="line-clamp-3 text-sm">{l.description}</p></div>
      <div className="flex gap-2 sm:flex-col">{status !== 'approved' && <button className="btn-primary" onClick={() => act(l.id, 'approve')}>Approve</button>}{status === 'pending' && <button className="btn-outline" onClick={() => act(l.id, 'reject')}>Reject</button>}{status === 'approved' && <button className="btn-outline text-bad" onClick={() => act(l.id, 'remove')}>Remove</button>}</div></article>))}</div>);
}
