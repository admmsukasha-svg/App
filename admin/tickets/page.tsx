'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { EmptyState } from '@/components/ui';
import { Err, Loading, PageTitle, Section, label, fmtDate, errMsg, useLoad } from '@/components/dash/kit';
export default function Tickets() {
  const [status, setStatus] = useState('open'); const [text, setText] = useState<Record<string, string>>({}); const [err, setErr] = useState('');
  const { data, error, loading, reload } = useLoad(() => api<{ tickets: any[] }>(`/admin/tickets?status=${status}`), [status]);
  async function reply(id: string, st: string) { setErr(''); try { await api(`/admin/tickets/${id}/reply`, { body: { text: text[id], status: st } }); setText({ ...text, [id]: '' }); reload(); } catch (e) { setErr(errMsg(e)); } }
  return (<div className="space-y-5"><PageTitle title="Support tickets" /><div className="flex gap-2">{['open', 'pending', 'resolved', 'closed'].map((t) => <button key={t} onClick={() => setStatus(t)} className={status === t ? 'btn-dark' : 'btn-outline'}>{label(t)}</button>)}</div><Err error={error || err} />
    {loading ? <Loading /> : !data?.tickets.length ? <EmptyState title="No tickets" /> : data.tickets.map((t) => (<Section key={t.id} title={`${t.subject} — ${t.user?.name}`}><ul className="space-y-2">{t.messages.map((m: any, i: number) => <li key={i} className={`rounded-lg p-3 text-sm ${m.staff ? 'bg-brand-soft' : 'bg-surface'}`}><p className="text-xs text-muted">{m.staff ? 'Staff' : t.user?.name} · {fmtDate(m.at)}</p><p className="whitespace-pre-wrap">{m.text}</p></li>)}</ul>
      <div className="mt-3 flex flex-wrap gap-2"><input aria-label="Reply" className="input flex-1" value={text[t.id] || ''} onChange={(e) => setText({ ...text, [t.id]: e.target.value })} /><button className="btn-primary" disabled={!text[t.id]} onClick={() => reply(t.id, 'pending')}>Reply</button><button className="btn-outline" disabled={!text[t.id]} onClick={() => reply(t.id, 'resolved')}>Reply & resolve</button></div></Section>))}</div>);
}
