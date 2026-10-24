'use client';
import { useState, type FormEvent } from 'react';
import { api } from '@/lib/api';
import { Badge, Field } from '@/components/ui';
import { Err, Loading, PageTitle, Section, errMsg, useLoad } from '@/components/dash/kit';
export default function Categories() {
  const { data, error, loading, reload } = useLoad(() => api<{ categories: any[] }>('/admin/categories'), []);
  const [f, setF] = useState({ name: '', parent: '', restricted: false }); const [err, setErr] = useState('');
  const run = async (fn: () => Promise<unknown>) => { setErr(''); try { await fn(); reload(); } catch (e) { setErr(errMsg(e)); } };
  const add = (e: FormEvent) => { e.preventDefault(); run(async () => { await api('/admin/categories', { body: { name: f.name, parent: f.parent || undefined, restricted: f.restricted } }); setF({ name: '', parent: '', restricted: false }); }); };
  const cats = data?.categories || []; const roots = cats.filter((c) => !c.parent);
  return (<div className="space-y-6"><PageTitle title="Categories" /><Err error={error || err} />
    <Section title="Add category"><form onSubmit={add} className="grid gap-4 sm:grid-cols-4"><Field label="Name" htmlFor="n"><input id="n" required className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
      <Field label="Parent (optional)" htmlFor="p"><select id="p" className="input" value={f.parent} onChange={(e) => setF({ ...f, parent: e.target.value })}><option value="">Top level</option>{roots.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
      <label className="flex items-end gap-2 pb-2 text-sm"><input type="checkbox" checked={f.restricted} onChange={(e) => setF({ ...f, restricted: e.target.checked })} />Restricted (extra review)</label><div className="flex items-end"><button className="btn-primary">Add</button></div></form></Section>
    {loading ? <Loading /> : <div className="space-y-3">{roots.map((r) => (<Section key={r.id} title={r.name} actions={<Row c={r} run={run} />}><ul className="space-y-2">{cats.filter((k) => k.parent === r.id).map((k) => <li key={k.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2 text-sm"><span>{k.name} {!k.active && <Badge tone="gray">inactive</Badge>}</span><Row c={k} run={run} /></li>)}</ul></Section>))}</div>}</div>);
}
function Row({ c, run }: { c: any; run: (fn: () => Promise<unknown>) => void }) {
  return (<div className="flex flex-wrap gap-2">{c.restricted && <Badge tone="orange">restricted</Badge>}{!c.active && <Badge>inactive</Badge>}
    <button className="btn-outline" onClick={() => { const name = prompt('New name', c.name); if (name) run(() => api(`/admin/categories/${c.id}`, { method: 'PUT', body: { name } })); }}>Rename</button>
    <button className="btn-outline" onClick={() => run(() => api(`/admin/categories/${c.id}`, { method: 'PUT', body: { active: !c.active } }))}>{c.active ? 'Deactivate' : 'Activate'}</button>
    <button className="btn-outline" onClick={() => { const o = prompt('Sort order (number)', String(c.order)); if (o !== null) run(() => api(`/admin/categories/${c.id}`, { method: 'PUT', body: { order: Number(o) } })); }}>Order</button>
    <button className="btn-outline text-bad" onClick={() => confirm(`Delete "${c.name}"?`) && run(() => api(`/admin/categories/${c.id}`, { method: 'DELETE' }))}>Delete</button></div>);
}
