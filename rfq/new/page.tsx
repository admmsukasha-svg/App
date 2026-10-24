'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, type FormEvent } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { COUNTRIES } from '@/lib/constants';
import { Field, Notice, PageHeader } from '@/components/ui';
import { errMsg } from '@/components/dash/kit';
import ImageUploader from '@/components/dash/ImageUploader';

function Form() {
  const sp = useSearchParams(); const router = useRouter(); const { user, loading } = useAuth();
  const [f, setF] = useState({ title: sp.get('title') || '', specifications: '', quantity: '', unit: 'pc', targetPrice: '', currency: 'USD', destinationCountry: 'PK', destinationCity: '', requiredBy: '', visibility: 'invited', attachments: [] as string[] });
  const [rec, setRec] = useState<{ id: string; name: string }[]>([]);
  const [q, setQ] = useState(''); const [results, setResults] = useState<any[]>([]);
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { if (!loading && !user) router.replace(`/login?next=${encodeURIComponent('/rfq/new' + (sp.toString() ? `?${sp}` : ''))}`); }, [loading, user, router, sp]);
  useEffect(() => { const s = sp.get('supplier'); if (s && /^[a-f\d]{24}$/i.test(s)) setRec((r) => (r.some((x) => x.id === s) ? r : [...r, { id: s, name: 'Selected supplier' }])); }, [sp]);
  const set = (k: string, v: unknown) => setF((s) => ({ ...s, [k]: v }));
  async function search() { try { setResults((await api<{ suppliers: any[] }>(`/suppliers?q=${encodeURIComponent(q)}&limit=8`)).suppliers); } catch (e) { setErr(errMsg(e)); } }
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setErr('');
    try {
      const r = await api<{ rfq: { id: string } }>('/rfqs', { body: { ...f, quantity: Number(f.quantity), targetPrice: f.targetPrice || undefined, requiredBy: f.requiredBy || undefined, recipients: rec.map((x) => x.id), product: sp.get('product') || undefined } });
      router.replace(`/dashboard/rfqs/${r.rfq.id}`);
    } catch (x) { setErr(errMsg(x)); setBusy(false); }
  }
  return (
    <form onSubmit={submit} className="container-x max-w-3xl space-y-5 py-8">
      {user && !user.emailVerified && <Notice kind="warn">Verify your email address before sending a request.</Notice>}
      {err && <Notice kind="error">{err}</Notice>}
      <Field label="Product required" htmlFor="t"><input id="t" required minLength={3} maxLength={200} className="input" value={f.title} onChange={(e) => set('title', e.target.value)} /></Field>
      <Field label="Specifications" htmlFor="s"><textarea id="s" maxLength={4000} className="input min-h-28" value={f.specifications} onChange={(e) => set('specifications', e.target.value)} /></Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Quantity" htmlFor="q"><input id="q" required type="number" min="1" className="input" value={f.quantity} onChange={(e) => set('quantity', e.target.value)} /></Field>
        <Field label="Unit" htmlFor="u"><input id="u" required maxLength={20} className="input" value={f.unit} onChange={(e) => set('unit', e.target.value)} /></Field>
        <Field label="Required by (optional)" htmlFor="rb"><input id="rb" type="date" className="input" value={f.requiredBy} onChange={(e) => set('requiredBy', e.target.value)} /></Field>
        <Field label="Target price per unit (optional)" htmlFor="tp"><input id="tp" type="number" min="0" step="any" className="input" value={f.targetPrice} onChange={(e) => set('targetPrice', e.target.value)} /></Field>
        <Field label="Preferred currency" htmlFor="c"><select id="c" className="input" value={f.currency} onChange={(e) => set('currency', e.target.value)}><option>USD</option><option>PKR</option></select></Field>
        <span />
        <Field label="Delivery country" htmlFor="dc"><select id="dc" className="input" value={f.destinationCountry} onChange={(e) => set('destinationCountry', e.target.value)}>{COUNTRIES.map(([c, n]) => <option key={c} value={c}>{n}</option>)}</select></Field>
        <Field label="Delivery city" htmlFor="dci"><input id="dci" maxLength={80} className="input" value={f.destinationCity} onChange={(e) => set('destinationCity', e.target.value)} /></Field>
      </div>
      <ImageUploader label="Supporting images (optional)" value={f.attachments} onChange={(v) => set('attachments', v)} max={5} />
      <fieldset className="space-y-2"><legend className="label">Who can see this request?</legend>
        <label className="flex items-center gap-2 text-sm"><input type="radio" name="vis" checked={f.visibility === 'invited'} onChange={() => set('visibility', 'invited')} />Only the suppliers I choose</label>
        <label className="flex items-center gap-2 text-sm"><input type="radio" name="vis" checked={f.visibility === 'public'} onChange={() => set('visibility', 'public')} />Eligible suppliers can browse it (my contact details stay private)</label></fieldset>
      <div className="space-y-2"><p className="label">Choose suppliers (up to 20)</p>
        <div className="flex flex-wrap gap-2">{rec.map((r) => <span key={r.id} className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1 text-sm">{r.name}<button type="button" aria-label={`Remove ${r.name}`} onClick={() => setRec(rec.filter((x) => x.id !== r.id))}>×</button></span>)}</div>
        <div className="flex gap-2"><input aria-label="Search suppliers" className="input" placeholder="Search suppliers by company name" value={q} onChange={(e) => setQ(e.target.value)} /><button type="button" className="btn-outline" onClick={search}>Search</button></div>
        {results.map((s) => <div key={s.id} className="flex items-center justify-between rounded-lg border border-line p-2 text-sm"><span>{s.companyName}</span><button type="button" className="btn-outline" disabled={rec.length >= 20 || rec.some((x) => x.id === s.ownerId)} onClick={() => setRec([...rec, { id: s.ownerId, name: s.companyName }])}>Add</button></div>)}</div>
      <button className="btn-primary" disabled={busy}>{busy ? 'Sending…' : 'Send request'}</button>
    </form>
  );
}
export default function NewRfq() { return (<><PageHeader title="Create a request for quotation" subtitle="Your contact details are never shown to suppliers inside the request." /><Suspense fallback={null}><Form /></Suspense></>); }
