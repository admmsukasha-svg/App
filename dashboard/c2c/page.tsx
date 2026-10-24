'use client';
import Link from 'next/link';
import { useState } from 'react';
import { api, money } from '@/lib/api';
import { Badge, EmptyState } from '@/components/ui';
import { Err, Loading, PageTitle, STATUS_TONE, label, fmtDate, errMsg, useLoad } from '@/components/dash/kit';
export default function MyC2C() {
  const { data, error, loading, reload } = useLoad(() => api<{ listings: any[] }>('/c2c/mine'), []); const [err, setErr] = useState('');
  const act = async (id: string, a: string) => { if (a === 'delete' && !confirm('Delete this listing?')) return; try { await api(`/c2c/${id}${a === 'delete' ? '' : `/${a}`}`, { method: a === 'delete' ? 'DELETE' : 'POST', body: a === 'delete' ? undefined : {} }); reload(); } catch (e) { setErr(errMsg(e)); } };
  return (<div className="space-y-5"><PageTitle title="My C2C listings" sub="Listings expire after 30 days; renew them to keep them live." actions={<Link className="btn-primary" href="/c2c/new">Post a listing</Link>} /><Err error={error || err} />
    {loading ? <Loading /> : !data?.listings.length ? <EmptyState title="You have no listings" /> : <div className="card divide-y divide-line">{data.listings.map((l) => (
      <div key={l.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="font-medium">{l.title}</p><p className="text-sm text-muted">{money(l.price, 'PKR')} · {l.city} {l.expiresAt ? `· expires ${fmtDate(l.expiresAt)}` : ''}</p>{l.rejectionReason && <p className="text-sm text-bad">{l.rejectionReason}</p>}</div>
        <div className="flex flex-wrap items-center gap-2"><Badge tone={STATUS_TONE[l.status] || 'gray'}>{label(l.status)}</Badge><Link className="btn-outline" href={`/c2c/new?edit=${l.id}`}>Edit</Link>{['approved', 'expired'].includes(l.status) && <button className="btn-outline" onClick={() => act(l.id, 'renew')}>Renew</button>}{l.status === 'approved' && <button className="btn-outline" onClick={() => act(l.id, 'sold')}>Mark sold</button>}<button className="btn-outline text-bad" onClick={() => act(l.id, 'delete')}>Delete</button></div></div>))}</div>}</div>);
}
