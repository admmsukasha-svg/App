'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Badge, EmptyState, Notice } from '@/components/ui';
import { Err, Loading, PageTitle, label, fmtDate, errMsg, useLoad } from '@/components/dash/kit';
export default function Verifications() {
  const [status, setStatus] = useState('submitted'); const [err, setErr] = useState(''); const [info, setInfo] = useState('');
  const { data, error, loading, reload } = useLoad(() => api<{ verifications: any[] }>(`/admin/verifications?status=${status}`), [status]);
  async function view(vid: string, did: string) { setErr(''); try { const r = await api<{ url: string }>(`/admin/verifications/${vid}/documents/${did}/url`); window.open(r.url, '_blank', 'noopener,noreferrer'); setInfo('Link valid for 5 minutes. This access was logged.'); } catch (e) { setErr(errMsg(e)); } }
  async function decide(id: string, level: string, decision: string) {
    let reason = ''; if (decision !== 'approved' || level === 'additional') { reason = prompt(level === 'additional' ? 'Describe the extra review that was carried out (min 10 chars):' : `Reason for ${decision}:`) || ''; if (!reason.trim()) return; }
    if (decision === 'approved' && level === 'business_documents' && !confirm('Confirm you reviewed the documents against the business profile?')) return;
    setErr(''); try { await api(`/admin/verifications/${id}/decision`, { body: { level, decision, reason } }); reload(); } catch (e) { setErr(errMsg(e)); }
  }
  return (<div className="space-y-5"><PageTitle title="Supplier verification" sub="Approve only when documents are consistent with the profile. Never grant a label for a check that did not happen." />
    <div className="flex flex-wrap gap-2">{['submitted', 'approved', 'rejected', 'resubmit'].map((t) => <button key={t} onClick={() => setStatus(t)} className={status === t ? 'btn-dark' : 'btn-outline'}>{label(t)}</button>)}</div><Err error={error || err} />{info && <Notice>{info}</Notice>}
    {loading ? <Loading /> : !data?.verifications.length ? <EmptyState title="Nothing in this queue" /> : data.verifications.map((v) => (
      <article key={v.id} className="card space-y-3 p-5"><div className="flex flex-wrap justify-between gap-2"><div><h2 className="font-semibold">{v.profile?.companyName}</h2><p className="text-sm text-muted">{v.profile?.businessType} · {v.profile?.city}, {v.profile?.country} · reg. no. {v.profile?.registrationNumber || '—'}</p><p className="text-sm text-muted">{v.owner?.name} ({v.owner?.email}) {v.owner?.emailVerified && <Badge tone="blue">email verified</Badge>}</p></div><p className="text-xs text-muted">Submitted {fmtDate(v.submittedAt)}</p></div>
        <ul className="flex flex-wrap gap-2">{v.documents.map((d: any) => <li key={d.id}><button className="btn-outline" onClick={() => view(v.id, d.id)}>View {label(d.kind)}</button></li>)}</ul>
        {v.decisions?.length > 0 && <ul className="text-xs text-muted">{v.decisions.map((d: any, i: number) => <li key={i}>{fmtDate(d.at)} — {d.level}: {d.decision}{d.reason ? ` (${d.reason})` : ''}</li>)}</ul>}
        <div className="flex flex-wrap gap-2">{status === 'submitted' && <><button className="btn-primary" onClick={() => decide(v.id, 'business_documents', 'approved')}>Approve documents</button><button className="btn-outline" onClick={() => decide(v.id, 'business_documents', 'resubmit')}>Ask to resubmit</button><button className="btn-outline text-bad" onClick={() => decide(v.id, 'business_documents', 'rejected')}>Reject</button></>}
          {v.additionalStatus !== 'approved' && <button className="btn-outline" onClick={() => decide(v.id, 'additional', 'approved')}>Grant additional verification…</button>}</div></article>))}</div>);
}
