'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Err, Loading, PageTitle, Section, useLoad } from '@/components/dash/kit';
const V = (n: number | null | undefined, suffix = '') => (n == null ? 'n/a' : `${n.toLocaleString()}${suffix}`);
function Row({ k, v, note }: { k: string; v: string; note?: string }) { return <div className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-sm"><span>{k}{note && <span className="block text-xs text-muted">{note}</span>}</span><b>{v}</b></div>; }
export default function Analytics() {
  const [days, setDays] = useState(30);
  const { data, error, loading } = useLoad(() => api<any>(`/admin/analytics?days=${days}`), [days]);
  const max = Math.max(1, ...(data?.acquisitionBySource || []).map((s: any) => s.registrations));
  return (<div className="space-y-6"><PageTitle title="Growth analytics" sub="Only recorded events. Registered users, verified businesses and activated suppliers are different numbers." actions={<select aria-label="Time window" className="input" value={days} onChange={(e) => setDays(Number(e.target.value))}>{[7, 30, 90, 365].map((d) => <option key={d} value={d}>Last {d} days</option>)}</select>} /><Err error={error} />
    {loading || !data ? <Loading /> : (<div className="grid gap-6 lg:grid-cols-2">
      <Section title={`Vendors (last ${data.windowDays} days unless “total”)`}><Row k="New registrations" v={V(data.vendors.newRegistrations)} /><Row k="New seller accounts" v={V(data.vendors.newSellerAccounts)} /><Row k="Verified businesses (total)" v={V(data.vendors.verifiedBusinessesTotal)} note="Business documents reviewed" /><Row k="Published stores (total)" v={V(data.vendors.publishedStoresTotal)} /><Row k="Activated suppliers (total)" v={V(data.vendors.activatedSuppliersTotal)} note="At least one approved, live product" /><Row k="Published products (total)" v={V(data.vendors.publishedProductsTotal)} /></Section>
      <Section title="Engagement"><Row k="Requests for quotation" v={V(data.engagement.rfqs)} /><Row k="Quotations sent" v={V(data.engagement.quotations)} /><Row k="Conversations started" v={V(data.engagement.conversationsStarted)} /><Row k="RFQ response rate" v={V(data.engagement.rfqResponseRate, '%')} note="Share of requests with at least one quotation" /></Section>
      <Section title="Referrals"><Row k="Referred sign-ups" v={V(data.referrals.total)} /><Row k="Eligible" v={V(data.referrals.eligible)} /><Row k="Activated" v={V(data.referrals.activated)} /></Section>
      <Section title="Registrations by acquisition source">{!data.acquisitionBySource.length ? <p className="text-sm text-muted">No tracked sources in this window.</p> : <ul className="space-y-2">{data.acquisitionBySource.map((s: any) => <li key={s.source} className="text-sm"><div className="flex justify-between"><span>{s.source}</span><b>{s.registrations}</b></div><div className="mt-1 h-2 rounded bg-line" aria-hidden><div className="h-2 rounded bg-brand" style={{ width: `${(s.registrations / max) * 100}%` }} /></div></li>)}</ul>}</Section></div>)}</div>);
}
