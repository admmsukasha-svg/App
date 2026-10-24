'use client';
import { useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { VERIFICATION_LABELS } from '@/lib/constants';
import { Badge, Field, Notice, VerificationBadges } from '@/components/ui';
import { Err, Loading, PageTitle, Section, STATUS_TONE, label, fmtDate, errMsg, useLoad } from '@/components/dash/kit';
import type { BizCtx } from '@/components/dash/forms';

const KINDS: [string, string][] = [['business_registration', 'Business registration'], ['tax_certificate', 'Tax certificate'], ['trade_license', 'Trade license'], ['identity_document', 'Owner identity document'], ['other', 'Other']];

export default function Verification() {
  const { data, error, loading, reload } = useLoad(() => api<BizCtx>('/business/me'), []);
  const [kind, setKind] = useState('business_registration'); const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<{ k: 'ok' | 'error' | 'warn'; t: string } | null>(null); const [busy, setBusy] = useState(false);
  const consent = useLoad(async () => null as null | { allowed: boolean }, []);
  async function upload() {
    if (!file) return; setBusy(true); setMsg(null);
    try {
      const sig = await api<any>('/uploads/sign?kind=document');
      if (!sig.allowedTypes.includes(file.type)) throw new Error('Allowed types: PDF, JPEG, PNG.');
      if (file.size > sig.maxBytes) throw new Error(`File too large (max ${Math.round(sig.maxBytes / 1048576)} MB).`);
      const fd = new FormData(); fd.append('file', file); fd.append('api_key', sig.apiKey); fd.append('timestamp', String(sig.timestamp)); fd.append('signature', sig.signature); fd.append('folder', sig.folder); fd.append('type', sig.type);
      const res = await fetch(sig.uploadUrl, { method: 'POST', body: fd }); const d = await res.json();
      if (!res.ok || !d.public_id) throw new Error(d?.error?.message || 'Upload failed.');
      await api('/business/verification/documents', { body: { kind, publicId: d.public_id, format: d.format || '' } });
      setMsg({ k: 'ok', t: 'Document submitted. Only authorised reviewers can open it.' }); setFile(null); reload();
    } catch (e) { setMsg(e instanceof ApiError && e.code === 'STORAGE_NOT_CONFIGURED' ? { k: 'warn', t: 'Document upload is not available yet because file storage has not been configured. Please check back soon.' } : { k: 'error', t: errMsg(e) }); } finally { setBusy(false); }
  }
  async function assist(allow: boolean) { try { await api('/business/assist-consent', { body: { allow } }); setMsg({ k: 'ok', t: allow ? 'MSUKASHA staff may help set up your profile for the next 7 days. Every change is logged.' : 'Assisted onboarding permission withdrawn.' }); } catch (e) { setMsg({ k: 'error', t: errMsg(e) }); } }
  if (loading || !data) return <Loading />;
  const v = data.verification;
  return (
    <div className="space-y-6"><PageTitle title="Verification" sub="Badges are shown only for checks that were really completed." /><Err error={error} />
      {msg && <Notice kind={msg.k}>{msg.t}</Notice>}
      <Section title="Your current status"><VerificationBadges levels={data.levels} />
        <ul className="mt-4 space-y-1.5 text-sm text-muted">{Object.entries(VERIFICATION_LABELS).map(([k, l]) => <li key={k}>{data.levels.includes(k) ? '✔' : '○'} {l}</li>)}</ul>
        <p className="mt-3 text-sm">Business documents: <Badge tone={STATUS_TONE[v?.documentsStatus || 'none'] || 'gray'}>{label(v?.documentsStatus || 'none')}</Badge> {v?.documents?.length ? `· ${v.documents.length} document(s) submitted` : ''}</p>
        {v?.decisions?.slice(-3).reverse().map((d: any, i: number) => <p key={i} className="mt-1 text-sm text-muted">{fmtDate(d.at)}: {d.decision}{d.reason ? ` — ${d.reason}` : ''}</p>)}</Section>
      {!data.profile ? <Notice kind="warn">Create your business profile before submitting documents.</Notice> : (
        <Section title="Submit documents for review">
          <p className="mb-3 text-sm text-muted">Documents are stored privately. Tax IDs, identity documents and private addresses are never shown publicly. Not every legitimate seller needs every document; submit what applies to your business.</p>
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Document type" htmlFor="k"><select id="k" className="input" value={kind} onChange={(e) => setKind(e.target.value)}>{KINDS.map(([a, b]) => <option key={a} value={a}>{b}</option>)}</select></Field>
            <Field label="File (PDF, JPEG or PNG)" htmlFor="f"><input id="f" type="file" accept="application/pdf,image/jpeg,image/png" className="input" onChange={(e) => setFile(e.target.files?.[0] || null)} /></Field></div>
          <button className="btn-primary mt-4" disabled={!file || busy} onClick={upload}>{busy ? 'Uploading…' : 'Submit document'}</button></Section>)}
      <Section title="Help with setup"><p className="text-sm text-muted">You can allow MSUKASHA support staff to help fill in your business profile. Permission lasts 7 days and every change is logged.</p>
        <div className="mt-3 flex gap-2"><button className="btn-outline" onClick={() => assist(true)}>Allow assistance</button><button className="btn-outline" onClick={() => assist(false)}>Withdraw permission</button></div></Section>
    </div>);
}
