'use client';
import { useState } from 'react';
import { api, money } from '@/lib/api';
import { Badge, EmptyState, SafeImg } from '@/components/ui';
import { Err, Loading, PageTitle, label, errMsg, useLoad } from '@/components/dash/kit';
const TABS = ['pending_review', 'active', 'rejected', 'paused'];
export default function ProductReview() {
  const [status, setStatus] = useState('pending_review'); const [err, setErr] = useState('');
  const { data, error, loading, reload } = useLoad(() => api<{ products: any[] }>(`/admin/products?status=${status}`), [status]);
  async function act(id: string, action: 'approve' | 'reject' | 'suspend') {
    let reason = ''; if (action !== 'approve') { reason = prompt(`Reason to ${action} (shown to the seller):`) || ''; if (reason.trim().length < 3) return; }
    setErr(''); try { await api(`/admin/products/${id}/${action}`, { body: { reason } }); reload(); } catch (e) { setErr(errMsg(e)); }
  }
  return (<div className="space-y-5"><PageTitle title="Product review" /><div className="flex gap-2">{TABS.map((t) => <button key={t} onClick={() => setStatus(t)} className={status === t ? 'btn-dark' : 'btn-outline'}>{label(t)}</button>)}</div><Err error={error || err} />
    {loading ? <Loading /> : !data?.products.length ? <EmptyState title="Nothing in this queue" /> : data.products.map((p) => (
      <article key={p.id} className="card flex flex-col gap-4 p-4 sm:flex-row"><SafeImg src={p.img || p.images?.[0]} alt={p.name} className="h-28 w-36 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-1"><h2 className="font-semibold">{p.name}</h2><p className="text-sm text-muted">{money(p.price, p.currency, p.priceOnRequest)} · MOQ {p.moq} {p.unit} · {p.category?.name}</p>
          <p className="text-sm text-muted">Seller: {p.seller?.companyName || p.seller?.name} ({p.seller?.email}) {p.seller?.emailVerified ? <Badge tone="blue">email verified</Badge> : <Badge tone="red">email not verified</Badge>}</p>
          <p className="line-clamp-3 whitespace-pre-line text-sm">{p.description}</p>{p.rejectionReason && <p className="text-sm text-bad">Reason: {p.rejectionReason}</p>}</div>
        <div className="flex shrink-0 flex-row gap-2 sm:flex-col">{status === 'pending_review' && <button className="btn-primary" onClick={() => act(p.id, 'approve')}>Approve</button>}{status !== 'rejected' && <button className="btn-outline" onClick={() => act(p.id, 'reject')}>Reject</button>}{status === 'active' && <button className="btn-outline text-bad" onClick={() => act(p.id, 'suspend')}>Suspend</button>}</div></article>))}</div>);
}
