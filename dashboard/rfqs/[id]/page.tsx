'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { api, money } from '@/lib/api';
import { countryName } from '@/lib/constants';
import { Badge, Field, Notice } from '@/components/ui';
import { Err, Loading, PageTitle, Section, STATUS_TONE, label, fmtDate, errMsg, useLoad } from '@/components/dash/kit';

export default function RfqDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, error, loading, reload } = useLoad(() => api<any>(`/rfqs/${id}`), [id]);
  const [err, setErr] = useState(''); const [ok, setOk] = useState('');
  const [q, setQ] = useState({ unitPrice: '', currency: 'USD', moq: '', availableQuantity: '', leadTimeDays: '', shippingDetails: '', validUntil: '', terms: '' });
  const act = async (path: string, body: any = {}) => { setErr(''); setOk(''); try { const r = await api<any>(path, { body }); if (r.note) setOk(r.note); reload(); } catch (e) { setErr(errMsg(e)); } };
  async function submitQ(e: FormEvent) {
    e.preventDefault();
    await act(`/rfqs/${id}/quotations`, { ...q, unitPrice: Number(q.unitPrice), moq: q.moq ? Number(q.moq) : undefined, availableQuantity: q.availableQuantity || undefined, leadTimeDays: q.leadTimeDays || undefined, validUntil: q.validUntil ? new Date(q.validUntil + 'T23:59:59').toISOString() : '' });
  }
  if (loading) return <Loading />;
  if (error) return <Err error={error} />;
  const { rfq, role } = data;
  const set = (k: string) => (e: any) => setQ({ ...q, [k]: e.target.value });
  return (
    <div className="space-y-6">
      <PageTitle title={rfq.title} sub={`${rfq.quantity.toLocaleString()} ${rfq.unit} → ${[rfq.destinationCity, countryName(rfq.destinationCountry)].filter(Boolean).join(', ')}`} actions={<Badge tone={STATUS_TONE[rfq.status] || 'gray'}>{label(rfq.status)}</Badge>} />
      <Err error={err} />{ok && <Notice kind="info">{ok}</Notice>}
      <Section title="Request details">
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <dt className="text-muted">Specifications</dt><dd className="whitespace-pre-line sm:col-span-1">{rfq.specifications || '—'}</dd>
          <dt className="text-muted">Target price</dt><dd>{rfq.targetPrice != null ? money(rfq.targetPrice, rfq.currency) : 'Not specified'}</dd>
          <dt className="text-muted">Required by</dt><dd>{rfq.requiredBy ? fmtDate(rfq.requiredBy) : 'Not specified'}</dd>
          <dt className="text-muted">Visibility</dt><dd>{rfq.visibility === 'public' ? 'Eligible suppliers' : 'Invited suppliers only'}</dd>
          {role === 'supplier' && <><dt className="text-muted">Buyer</dt><dd>{rfq.buyer?.name} {rfq.buyer?.country ? `(${countryName(rfq.buyer.country)})` : ''} — contact details are private</dd></>}
        </dl>
        {role === 'buyer' && rfq.status === 'open' && <div className="mt-4 flex gap-2"><button className="btn-outline" onClick={() => confirm('Close this request?') && act(`/rfqs/${id}/close`)}>Close request</button><button className="btn-outline text-bad" onClick={() => confirm('Cancel this request?') && act(`/rfqs/${id}/close`, { cancel: true })}>Cancel request</button></div>}
      </Section>

      {role === 'buyer' && (
        <Section title={`Quotations (${data.quotations.length})`}>
          {!data.quotations.length ? <p className="text-sm text-muted">No quotations yet. Suppliers will be notified in their dashboard.</p> : (
            <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm"><thead><tr className="border-b border-line text-left text-muted"><th className="py-2">Supplier</th><th>Unit price</th><th>MOQ</th><th>Available</th><th>Lead time</th><th>Valid until</th><th>Status</th><th /></tr></thead>
              <tbody>{data.quotations.map((x: any) => (
                <tr key={x.id} className="border-b border-line align-top"><td className="py-2">{x.supplierProfile ? <Link className="text-brand-dark hover:underline" href={`/suppliers/${x.supplierProfile.slug}`}>{x.supplierProfile.companyName}</Link> : 'Supplier'}<p className="text-xs text-muted">{x.shippingDetails}</p>{x.terms && <p className="text-xs text-muted">{x.terms}</p>}</td>
                  <td className="font-semibold">{money(x.unitPrice, x.currency)}</td><td>{x.moq ?? '—'}</td><td>{x.availableQuantity ?? '—'}</td><td>{x.leadTimeDays != null ? `${x.leadTimeDays} d` : '—'}</td><td>{fmtDate(x.validUntil)}</td><td><Badge tone={STATUS_TONE[x.status] || 'gray'}>{label(x.status)}</Badge></td>
                  <td>{rfq.status === 'open' && x.status === 'submitted' && <button className="btn-primary" onClick={() => confirm('Accept this quotation? Other quotations will be declined.') && act(`/rfqs/${id}/quotations/${x.id}/accept`)}>Accept</button>}</td></tr>))}</tbody></table></div>)}
          <p className="mt-3 text-xs text-muted">Accepting a quotation records your choice. MSUKASHA does not process payment or guarantee the deal; agree final terms with the supplier.</p>
        </Section>)}

      {role === 'supplier' && (
        <Section title="Your quotation">
          {data.quotation ? (
            <div className="space-y-2 text-sm"><p><b>{money(data.quotation.unitPrice, data.quotation.currency)}</b> per {rfq.unit} · MOQ {data.quotation.moq ?? '—'} · lead time {data.quotation.leadTimeDays ?? '—'} days · valid until {fmtDate(data.quotation.validUntil)}</p>
              <Badge tone={STATUS_TONE[data.quotation.status] || 'gray'}>{label(data.quotation.status)}</Badge>
              {data.quotation.status === 'submitted' && <div><button className="btn-outline mt-2" onClick={() => confirm('Withdraw your quotation?') && act(`/rfqs/${id}/quotations/${data.quotation.id}/withdraw`)}>Withdraw</button></div>}</div>
          ) : rfq.status !== 'open' ? <p className="text-sm text-muted">This request is closed.</p> : (
            <form onSubmit={submitQ} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Unit price" htmlFor="up"><input id="up" required type="number" min="0" step="any" className="input" value={q.unitPrice} onChange={set('unitPrice')} /></Field>
                <Field label="Currency" htmlFor="qc"><select id="qc" className="input" value={q.currency} onChange={set('currency')}><option>USD</option><option>PKR</option></select></Field>
                <Field label="MOQ" htmlFor="qm"><input id="qm" type="number" min="1" className="input" value={q.moq} onChange={set('moq')} /></Field>
                <Field label="Available quantity" htmlFor="qa"><input id="qa" type="number" min="0" className="input" value={q.availableQuantity} onChange={set('availableQuantity')} /></Field>
                <Field label="Lead time (days)" htmlFor="ql"><input id="ql" type="number" min="0" className="input" value={q.leadTimeDays} onChange={set('leadTimeDays')} /></Field>
                <Field label="Quotation valid until" htmlFor="qv"><input id="qv" required type="date" className="input" value={q.validUntil} onChange={set('validUntil')} /></Field>
              </div>
              <Field label="Shipping details" htmlFor="qs"><input id="qs" maxLength={1000} className="input" value={q.shippingDetails} onChange={set('shippingDetails')} /></Field>
              <Field label="Additional terms" htmlFor="qt"><textarea id="qt" maxLength={2000} className="input min-h-24" value={q.terms} onChange={set('terms')} /></Field>
              <button className="btn-primary">Send quotation</button>
            </form>)}
        </Section>)}
    </div>
  );
}
