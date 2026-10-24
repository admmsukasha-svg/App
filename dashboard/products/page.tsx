'use client';
import Link from 'next/link';
import { useState } from 'react';
import { api, money } from '@/lib/api';
import { Badge, EmptyState } from '@/components/ui';
import { Err, Loading, PageTitle, STATUS_TONE, label, errMsg, useLoad } from '@/components/dash/kit';
import type { Product } from '@/lib/types';

const TABS = ['', 'draft', 'pending_review', 'active', 'rejected', 'paused', 'archived'];
export default function Products() {
  const [status, setStatus] = useState(''); const [page, setPage] = useState(1); const [err, setErr] = useState('');
  const { data, error, loading, reload } = useLoad(() => api<{ products: Product[]; total: number; pages: number }>(`/products/my?page=${page}${status ? `&status=${status}` : ''}`), [status, page]);
  async function act(p: Product, action: string) {
    if (action === 'delete' && !confirm(`Delete "${p.name}" permanently?`)) return;
    setErr('');
    try { await api(`/products/${p.id}${action === 'delete' ? '' : `/${action}`}`, { method: action === 'delete' ? 'DELETE' : 'POST', body: action === 'delete' ? undefined : {} }); reload(); } catch (e) { setErr(errMsg(e)); }
  }
  return (
    <div className="space-y-5">
      <PageTitle title="Products" sub="Submit drafts for review. Approved products appear in public search." actions={<Link className="btn-primary" href="/dashboard/products/new">Add product</Link>} />
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">{TABS.map((t) => <button key={t || 'all'} role="tab" aria-selected={status === t} onClick={() => { setStatus(t); setPage(1); }} className={`rounded-full px-3 py-1.5 text-sm ${status === t ? 'bg-navy text-white' : 'bg-surface text-muted'}`}>{t ? label(t) : 'All'}</button>)}</div>
      <Err error={error || err} />
      {loading ? <Loading /> : !data?.products.length ? <EmptyState title="No products here yet" action={<Link className="btn-primary" href="/dashboard/products/new">Add your first product</Link>}>Add your first five products to build a useful product catalogue.</EmptyState> : (
        <div className="card divide-y divide-line">
          {data.products.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0"><Link href={`/dashboard/products/${p.id}`} className="font-medium hover:text-brand-dark">{p.name}</Link><p className="text-sm text-muted">{money(p.price, p.currency, p.priceOnRequest)} · MOQ {p.moq} · {p.views || 0} views</p>{p.status === 'rejected' && p.rejectionReason && <p className="text-sm text-bad">Rejected: {p.rejectionReason}</p>}</div>
              <div className="flex flex-wrap items-center gap-2"><Badge tone={STATUS_TONE[p.status] || 'gray'}>{label(p.status)}</Badge>
                <Link className="btn-outline" href={`/dashboard/products/${p.id}`}>Edit</Link>
                {p.status === 'active' && <button className="btn-outline" onClick={() => act(p, 'pause')}>Pause</button>}
                {(p.status === 'paused' || p.status === 'inactive') && <button className="btn-outline" onClick={() => act(p, 'resume')}>Resume</button>}
                {p.status !== 'archived' && <button className="btn-outline" onClick={() => act(p, 'archive')}>Archive</button>}
                <button className="btn-outline text-bad" onClick={() => act(p, 'delete')}>Delete</button></div>
            </div>))}
        </div>)}
      {data && data.pages > 1 && <div className="flex justify-center gap-2"><button className="btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span className="self-center text-sm">Page {page} of {data.pages}</span><button className="btn-outline" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button></div>}
    </div>
  );
}
