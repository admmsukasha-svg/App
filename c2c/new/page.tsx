'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, type FormEvent } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { PK_CITIES } from '@/lib/constants';
import { Field, Notice, PageHeader } from '@/components/ui';
import { errMsg } from '@/components/dash/kit';
import ImageUploader from '@/components/dash/ImageUploader';

function Form() {
  const sp = useSearchParams(); const edit = sp.get('edit'); const router = useRouter(); const { user, loading } = useAuth();
  const [f, setF] = useState({ title: '', description: '', price: '', city: 'Islamabad', condition: 'used', images: [] as string[] });
  const [err, setErr] = useState(''); const [ok, setOk] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { if (!loading && !user) router.replace(`/login?next=${encodeURIComponent('/c2c/new')}`); }, [loading, user, router]);
  useEffect(() => { if (edit && user) api<{ listings: any[] }>('/c2c/mine').then((r) => { const l = r.listings.find((x) => x.id === edit); if (l) setF({ title: l.title, description: l.description || '', price: String(l.price), city: l.city || 'Islamabad', condition: l.condition || 'used', images: l.images || [] }); }).catch((e) => setErr(errMsg(e))); }, [edit, user]);
  const set = (k: string, v: unknown) => setF((s) => ({ ...s, [k]: v }));
  async function submit(e: FormEvent) { e.preventDefault(); setBusy(true); setErr(''); setOk(''); try { const body = { ...f, price: Number(f.price) }; if (edit) await api(`/c2c/${edit}`, { method: 'PUT', body }); else await api('/c2c', { body }); setOk('Saved. Your listing will appear after review.'); setTimeout(() => router.replace('/dashboard/c2c'), 1200); } catch (x) { setErr(errMsg(x)); setBusy(false); } }
  return (
    <form onSubmit={submit} className="container-x max-w-2xl space-y-5 py-8">
      {err && <Notice kind="error">{err}</Notice>}{ok && <Notice kind="ok">{ok}</Notice>}
      <Field label="Title" htmlFor="t"><input id="t" required minLength={3} maxLength={200} className="input" value={f.title} onChange={(e) => set('title', e.target.value)} /></Field>
      <Field label="Description" htmlFor="d"><textarea id="d" maxLength={5000} className="input min-h-32" value={f.description} onChange={(e) => set('description', e.target.value)} /></Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Price (PKR)" htmlFor="p"><input id="p" required type="number" min="0" className="input" value={f.price} onChange={(e) => set('price', e.target.value)} /></Field>
        <Field label="City" htmlFor="c"><select id="c" className="input" value={f.city} onChange={(e) => set('city', e.target.value)}>{PK_CITIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Condition" htmlFor="cd"><select id="cd" className="input" value={f.condition} onChange={(e) => set('condition', e.target.value)}><option value="new">New</option><option value="used">Used</option><option value="refurbished">Refurbished</option></select></Field></div>
      <ImageUploader label="Photos" value={f.images} onChange={(v) => set('images', v)} max={8} />
      <p className="text-xs text-muted">Prohibited items are not allowed. Listings are reviewed before they go live. Your email and phone are never shown on the listing; buyers contact you through MSUKASHA chat.</p>
      <button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : edit ? 'Save changes' : 'Post listing'}</button>
    </form>);
}
export default function NewListing() { return (<><PageHeader title="Post a C2C listing" subtitle="Free local listing, priced in PKR." /><Suspense fallback={null}><Form /></Suspense></>); }
