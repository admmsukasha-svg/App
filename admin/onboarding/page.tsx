'use client';
import { useState, type FormEvent } from 'react';
import { api } from '@/lib/api';
import { BUSINESS_TYPES } from '@/lib/constants';
import { Field, Notice } from '@/components/ui';
import { CountrySelect, PageTitle, Section, errMsg } from '@/components/dash/kit';
export default function Assist() {
  const [uid, setUid] = useState(''); const [f, setF] = useState({ businessType: 'manufacturer', companyName: '', description: '', country: 'PK', city: '', phone: '', email: '' }); const [msg, setMsg] = useState<{ k: 'ok' | 'error'; t: string } | null>(null);
  async function submit(e: FormEvent) { e.preventDefault(); if (!confirm('Apply these profile changes on behalf of the supplier? This is logged.')) return; try { await api(`/admin/onboarding/${uid}/profile`, { method: 'PUT', body: f }); setMsg({ k: 'ok', t: 'Profile saved on behalf of the supplier and recorded in the audit log.' }); } catch (x) { setMsg({ k: 'error', t: errMsg(x) }); } }
  const s = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  return (<div className="space-y-5"><PageTitle title="Assisted onboarding" sub="Works only when the supplier has granted permission in their dashboard (valid 7 days). Every change is audited with their user ID." />{msg && <Notice kind={msg.k}>{msg.t}</Notice>}
    <Section title="Business profile"><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2"><Field label="Supplier user ID" htmlFor="u"><input id="u" required pattern="[a-fA-F0-9]{24}" className="input font-mono" value={uid} onChange={(e) => setUid(e.target.value)} /></Field>
      <Field label="Business type" htmlFor="bt"><select id="bt" className="input" value={f.businessType} onChange={s('businessType')}>{BUSINESS_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></Field>
      <Field label="Company name" htmlFor="cn"><input id="cn" required className="input" value={f.companyName} onChange={s('companyName')} /></Field><Field label="Country" htmlFor="co"><CountrySelect id="co" value={f.country} onChange={(v) => setF({ ...f, country: v })} /></Field>
      <Field label="City" htmlFor="ci"><input id="ci" className="input" value={f.city} onChange={s('city')} /></Field><Field label="Business phone" htmlFor="ph"><input id="ph" className="input" value={f.phone} onChange={s('phone')} /></Field>
      <div className="sm:col-span-2"><Field label="Description" htmlFor="d"><textarea id="d" className="input min-h-24" value={f.description} onChange={s('description')} /></Field></div><div><button className="btn-primary">Save on behalf of supplier</button></div></form></Section></div>);
}
