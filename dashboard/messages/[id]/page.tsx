'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Err, Loading, PageTitle, errMsg, useLoad } from '@/components/dash/kit';
export default function Thread() {
  const { id } = useParams<{ id: string }>(); const { user } = useAuth();
  const { data, error, loading, reload } = useLoad(() => api<any>(`/conversations/${id}`), [id]);
  const [text, setText] = useState(''); const [err, setErr] = useState(''); const end = useRef<HTMLDivElement>(null);
  useEffect(() => { const t = setInterval(() => reload(), 15000); return () => clearInterval(t); }, [reload]);
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [data?.messages?.length]);
  async function send(e: FormEvent) { e.preventDefault(); if (!text.trim()) return; setErr(''); try { await api(`/conversations/${id}/messages`, { body: { text } }); setText(''); reload(); } catch (x) { setErr(errMsg(x)); } }
  async function block(b: boolean) { try { await api(`/conversations/${id}/${b ? 'block' : 'unblock'}`, { body: {} }); reload(); } catch (x) { setErr(errMsg(x)); } }
  if (loading && !data) return <Loading />;
  if (error && !data) return <Err error={error} />;
  const other = data.participants.find((p: any) => p.id !== user?.id); const blocked = data.conversation.blockedBy.length > 0; const iBlocked = data.conversation.blockedBy.includes(user?.id);
  return (
    <div className="space-y-4">
      <PageTitle title={other?.companyName || other?.name || 'Conversation'} sub={data.conversation.subject} actions={<div className="flex gap-2"><Link className="btn-outline" href={`/report?type=conversation&id=${id}`}>Report</Link>{iBlocked ? <button className="btn-outline" onClick={() => block(false)}>Unblock</button> : <button className="btn-outline" onClick={() => confirm('Block this conversation?') && block(true)}>Block</button>}</div>} />
      <Err error={err} />
      <div className="card h-[55vh] space-y-3 overflow-y-auto p-4" aria-live="polite">
        {data.messages.map((m: any) => { const mine = m.sender === user?.id; return (<div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${mine ? 'bg-brand text-white' : 'bg-surface'}`}><p className="whitespace-pre-wrap break-words">{m.text}</p><p className={`mt-1 text-[11px] ${mine ? 'text-white/80' : 'text-muted'}`}>{new Date(m.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}{mine && m.readBy.length > 1 ? ' · read' : ''}</p></div></div>); })}<div ref={end} /></div>
      {blocked ? <p className="text-sm text-muted">This conversation is blocked.</p> : (
        <form onSubmit={send} className="flex gap-2"><label htmlFor="msg" className="sr-only">Message</label><input id="msg" className="input" maxLength={2000} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message. Never share passwords or card details." /><button className="btn-primary">Send</button></form>)}
    </div>
  );
}
