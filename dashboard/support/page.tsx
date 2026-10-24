'use client';
import { useState, type FormEvent } from 'react';
import { api } from '@/lib/api';
import { Badge, EmptyState, Field } from '@/components/ui';
import { Err, Loading, PageTitle, Section, STATUS_TONE, label, fmtDate, errMsg, useLoad } from '@/components/dash/kit';
export default function Support() {
  const { data, error, loading, reload } = useLoad(() => api<{ tickets: any[] }>('/support/tickets'), []);
  const [f, setF] = useState({ subject: '', category: 'other', text: '' }); const [err, setErr] = useState(''); const [reply, setReply] = useState<Record<string, string>>({});
  async function create(e: FormEvent) { e.preventDefault(); setErr(''); try { await api('/support/tickets', { body: f }); setF({ subject: '', category: 'other', text: '' }); reload(); } catch (x) { setErr(errMsg(x)); } }
  async function send(id: string) { setErr(''); try { await api(`/support/tickets/${id}/reply`, { body: { text: reply[id] } }); setReply({ ...reply, [id]: '' }); reload(); } catch (x) { setErr(errMsg(x)); } }
  return (<div className="space-y-6"><PageTitle title="Support" /><Err error={error || err} />
    <Section title="New request"><form onSubmit={create} className="space-y-3"><div className="grid gap-4 sm:grid-cols-2"><Field label="Subject" htmlFor="s"><input id="s" required maxLength={200} className="input" value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} /></Field>
      <Field label="Topic" htmlFor="c"><select id="c" className="input" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>{['account', 'listing', 'verification', 'rfq', 'report', 'other'].map((c) => <option key={c} value={c}>{label(c)}</option>)}</select></Field></div>
      <Field label="How can we help?" htmlFor="t"><textarea id="t" required maxLength={3000} className="input min-h-28" value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} /></Field><button className="btn-primary">Send request</button></form></Section>
    {loading ? <Loading /> : !data?.tickets.length ? <EmptyState title="No support requests" /> : data.tickets.map((t) => (
      <Section key={t.id} title={t.subject} actions={<Badge tone={STATUS_TONE[t.status] || 'gray'}>{label(t.status)}</Badge>}>
        <ul className="space-y-2">{t.messages.map((m: any, i: number) => <li key={i} className={`rounded-lg p-3 text-sm ${m.staff ? 'bg-brand-soft' : 'bg-surface'}`}><p className="text-xs text-muted">{m.staff ? 'MSUKASHA support' : 'You'} · {fmtDate(m.at)}</p><p className="whitespace-pre-wrap">{m.text}</p></li>)}</ul>
        {t.status !== 'closed' && <div className="mt-3 flex gap-2"><input aria-label="Reply" className="input" value={reply[t.id] || ''} onChange={(e) => setReply({ ...reply, [t.id]: e.target.value })} /><button className="btn-outline" disabled={!reply[t.id]} onClick={() => send(t.id)}>Reply</button></div>}</Section>))}</div>);
}
