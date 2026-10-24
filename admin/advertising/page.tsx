'use client';
import { useState } from 'react';
import { api, money } from '@/lib/api';
import { Badge, EmptyState, Notice } from '@/components/ui';
import { Err, Loading, PageTitle, label, fmtDate, errMsg, useLoad } from '@/components/dash/kit';
export default function Advertising() {
  const [status, setStatus] = useState('pending'); const [err, setErr] = useState('');
  const { data, error, loading, reload } = useLoad(() => api<{ ads: any[] }>(`/admin/business-ads?status=${status}`), [status]);
  async function act(id: string, path: string, body: any = {}) { setErr(''); try { await api(`/admin/business-ads/${id}/${path}`, { method: 'PATCH', body }); reload(); } catch (e) { setErr(errMsg(e)); } }
  return (<div className="space-y-5"><PageTitle title="Advertising campaigns" sub="Legacy advertising module. Approve only after verifying the bank transfer. Prices are set server-side in api/src/config/packages.js." />
    <Notice kind="warn">Package prices in the API are placeholders until you set your real rates. Online card payments are not integrated.</Notice>
    <div className="flex gap-2">{['pending', 'approved', 'rejected', 'expired'].map((t) => <button key={t} onClick={() => setStatus(t)} className={status === t ? 'btn-dark' : 'btn-outline'}>{label(t)}</button>)}</div><Err error={error || err} />
    {loading ? <Loading /> : !data?.ads.length ? <EmptyState title="No campaigns here" /> : data.ads.map((a) => (<article key={a.id} className="card space-y-2 p-4"><div className="flex flex-wrap justify-between gap-2"><h2 className="font-semibold">{a.title} <span className="text-sm font-normal text-muted">— {a.businessName}</span></h2><div className="flex gap-2"><Badge>{a.package}</Badge><Badge tone={a.paymentStatus === 'paid' ? 'green' : 'orange'}>{label(a.paymentStatus)}</Badge></div></div>
      <p className="text-sm text-muted">{money(a.amount, 'PKR')} · {a.duration} days · {a.email} · {a.startDate ? `${fmtDate(a.startDate)} – ${fmtDate(a.endDate)}` : 'not scheduled'}</p><p className="text-sm">{a.description}</p>
      <div className="flex flex-wrap gap-2">{a.status !== 'approved' && <button className="btn-primary" onClick={() => confirm('Approve and schedule this campaign?') && act(a.id, 'approve')}>Approve</button>}{a.status === 'pending' && <button className="btn-outline" onClick={() => { const reason = prompt('Rejection reason:'); if (reason) act(a.id, 'reject', { reason }); }}>Reject</button>}{a.paymentStatus === 'pending_verification' && <><button className="btn-outline" onClick={() => act(a.id, 'payment', { status: 'paid' })}>Payment verified</button><button className="btn-outline" onClick={() => act(a.id, 'payment', { status: 'rejected' })}>Payment rejected</button></>}</div></article>))}</div>);
}
