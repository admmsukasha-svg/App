'use client';
import Link from 'next/link';
import { useState } from 'react';
import { api, money } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Badge, EmptyState } from '@/components/ui';
import { Err, Loading, PageTitle, STATUS_TONE, label, fmtDate, useLoad } from '@/components/dash/kit';
import { countryName } from '@/lib/constants';

export default function Rfqs() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'mine' | 'received'>('mine');
  const { data, error, loading } = useLoad(() => api<{ rfqs: any[] }>(`/rfqs/${tab}`).catch((e) => { if (tab === 'received' && e.status === 403) return { rfqs: [] }; throw e; }), [tab]);
  return (
    <div className="space-y-5">
      <PageTitle title="Requests & quotations" actions={<Link className="btn-primary" href="/rfq/new">New request</Link>} />
      <div className="flex gap-2" role="tablist">
        <button role="tab" aria-selected={tab === 'mine'} className={tab === 'mine' ? 'btn-dark' : 'btn-outline'} onClick={() => setTab('mine')}>My requests (as buyer)</button>
        {user?.role !== 'buyer' && <button role="tab" aria-selected={tab === 'received'} className={tab === 'received' ? 'btn-dark' : 'btn-outline'} onClick={() => setTab('received')}>Received (as supplier)</button>}
      </div>
      <Err error={error} />
      {loading ? <Loading /> : !data?.rfqs.length ? <EmptyState title={tab === 'mine' ? 'You have not created a request yet' : 'No requests have been sent to you'} action={tab === 'mine' ? <Link className="btn-primary" href="/rfq/new">Create a request</Link> : undefined}>{tab === 'received' ? 'Publish your store and products so buyers can find you. Public requests from buyers appear here too.' : undefined}</EmptyState> : (
        <div className="card divide-y divide-line">{data.rfqs.map((r) => (
          <Link key={r.id} href={`/dashboard/rfqs/${r.id}`} className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-surface">
            <div><p className="font-medium">{r.title}</p><p className="text-sm text-muted">{r.quantity.toLocaleString()} {r.unit} → {countryName(r.destinationCountry)} · {fmtDate(r.createdAt)}{r.targetPrice != null ? ` · target ${money(r.targetPrice, r.currency)}` : ''}</p></div>
            <div className="flex items-center gap-2">{tab === 'received' && r.quoted && <Badge tone="blue">Quoted</Badge>}{tab === 'mine' && <span className="text-sm text-muted">{r.quotationCount} quotation{r.quotationCount === 1 ? '' : 's'}</span>}<Badge tone={STATUS_TONE[r.status] || 'gray'}>{label(r.status)}</Badge></div>
          </Link>))}</div>)}
    </div>
  );
}
