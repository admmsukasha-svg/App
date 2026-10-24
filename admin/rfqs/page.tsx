'use client';
import { api, money } from '@/lib/api';
import { Badge } from '@/components/ui';
import { Err, Loading, PageTitle, STATUS_TONE, label, fmtDate, useLoad } from '@/components/dash/kit';
export default function AdminRfqs() {
  const { data, error, loading } = useLoad(() => api<{ rfqs: any[] }>('/admin/rfqs'), []);
  return (<div className="space-y-5"><PageTitle title="RFQ oversight" sub="Read-only list for dispute handling and abuse checks." /><Err error={error} />{loading ? <Loading /> : <div className="card overflow-x-auto"><table className="w-full min-w-[640px] text-sm"><thead><tr className="border-b border-line text-left text-muted"><th className="p-3">Title</th><th>Qty</th><th>Target</th><th>Visibility</th><th>Quotes</th><th>Status</th><th>Created</th></tr></thead><tbody>{data?.rfqs.map((r) => <tr key={r.id} className="border-b border-line"><td className="p-3">{r.title}</td><td>{r.quantity} {r.unit}</td><td>{r.targetPrice != null ? money(r.targetPrice, r.currency) : '—'}</td><td>{r.visibility}</td><td>{r.quotationCount}</td><td><Badge tone={STATUS_TONE[r.status] || 'gray'}>{label(r.status)}</Badge></td><td>{fmtDate(r.createdAt)}</td></tr>)}</tbody></table></div>}</div>);
}
