'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Err, Loading, PageTitle, useLoad } from '@/components/dash/kit';
export default function Audit() {
  const [action, setAction] = useState(''); const [applied, setApplied] = useState(''); const [page, setPage] = useState(1);
  const { data, error, loading } = useLoad(() => api<any>(`/admin/audit?page=${page}&limit=50&action=${encodeURIComponent(applied)}`), [applied, page]);
  return (<div className="space-y-5"><PageTitle title="Audit log" /><form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setApplied(action); setPage(1); }}><input aria-label="Action prefix" className="input max-w-xs" placeholder="Action prefix, e.g. verification" value={action} onChange={(e) => setAction(e.target.value)} /><button className="btn-outline">Filter</button></form><Err error={error} />
    {loading ? <Loading /> : <div className="card overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead><tr className="border-b border-line text-left text-muted"><th className="p-3">When</th><th>Actor</th><th>Action</th><th>Target</th><th>Details</th></tr></thead><tbody>{data?.logs.map((l: any) => (<tr key={l.id} className="border-b border-line align-top"><td className="p-3 whitespace-nowrap">{new Date(l.createdAt).toLocaleString('en-GB')}</td><td>{l.actor?.name || l.actorRole}</td><td className="font-mono text-xs">{l.action}</td><td className="text-xs">{l.targetType} {l.targetId}</td><td className="max-w-xs break-words text-xs text-muted">{l.onBehalfOf ? `on behalf of ${l.onBehalfOf} · ` : ''}{Object.keys(l.meta || {}).length ? JSON.stringify(l.meta) : ''}</td></tr>))}</tbody></table></div>}
    {data && data.pages > 1 && <div className="flex justify-center gap-2"><button className="btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span className="self-center text-sm">Page {page} / {data.pages}</span><button className="btn-outline" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button></div>}</div>);
}
