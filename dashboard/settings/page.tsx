'use client';
import { useState, type FormEvent } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { LANGUAGES } from '@/lib/constants';
import { Field, Notice } from '@/components/ui';
import { CountrySelect, PageTitle, Section, errMsg } from '@/components/dash/kit';
import type { User } from '@/lib/types';

export default function Settings() {
  const { user, setUser, logout } = useAuth();
  const [f, setF] = useState({ name: user?.name || '', phone: user?.phone || '', city: user?.city || '', country: user?.country || '', language: user?.language || 'en', emailN: user?.notificationPrefs?.email ?? true, marketing: user?.notificationPrefs?.marketing ?? false });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' }); const [del, setDel] = useState('');
  const [msg, setMsg] = useState<{ k: 'ok' | 'error'; t: string } | null>(null);
  if (!user) return null;
  const run = async (fn: () => Promise<string>) => { setMsg(null); try { setMsg({ k: 'ok', t: await fn() }); } catch (e) { setMsg({ k: 'error', t: errMsg(e) }); } };
  const saveProfile = (e: FormEvent) => { e.preventDefault(); run(async () => { const r = await api<{ user: User }>('/profile', { method: 'PUT', body: { name: f.name, phone: f.phone, city: f.city, country: f.country, language: f.language, notificationPrefs: { email: f.emailN, marketing: f.marketing } } }); setUser(r.user); return 'Settings saved.'; }); };
  const changePw = (e: FormEvent) => { e.preventDefault(); run(async () => { await api('/password', { method: 'PUT', body: pw }); setPw({ currentPassword: '', newPassword: '' }); return 'Password updated. Other devices were signed out.'; }); };
  const remove = () => { if (!confirm('Deactivate your account? Your published products and store will be unpublished.')) return; run(async () => { await api('/auth/account', { method: 'DELETE', body: { password: del } }); await logout(); return ''; }); };
  return (
    <div className="space-y-6"><PageTitle title="Account settings" />{msg && <Notice kind={msg.k}>{msg.t}</Notice>}
      <Section title="Profile"><form onSubmit={saveProfile} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="n"><input id="n" className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="Email" htmlFor="e" hint={user.emailVerified ? 'Verified' : 'Not verified'}><input id="e" className="input" value={user.email} readOnly /></Field>
          <Field label="Phone" htmlFor="p" hint="Changing it resets phone verification."><input id="p" className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
          <Field label="City" htmlFor="c"><input id="c" className="input" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></Field>
          <Field label="Country" htmlFor="co"><CountrySelect id="co" value={f.country} onChange={(v) => setF({ ...f, country: v })} /></Field>
          <Field label="Language" htmlFor="l"><select id="l" className="input" value={f.language} onChange={(e) => setF({ ...f, language: e.target.value })}>{LANGUAGES.map(([a, b]) => <option key={a} value={a}>{b}</option>)}</select></Field></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.emailN} onChange={(e) => setF({ ...f, emailN: e.target.checked })} />Email me about messages, requests and quotations (message text is never included)</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.marketing} onChange={(e) => setF({ ...f, marketing: e.target.checked })} />I agree to receive occasional product news and offers</label>
        <button className="btn-primary">Save settings</button></form></Section>
      <Section title="Change password"><form onSubmit={changePw} className="grid gap-4 sm:grid-cols-2">
        <Field label="Current password" htmlFor="cp"><input id="cp" type="password" required autoComplete="current-password" className="input" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} /></Field>
        <Field label="New password" htmlFor="np"><input id="np" type="password" required minLength={8} autoComplete="new-password" className="input" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} /></Field>
        <div><button className="btn-primary">Update password</button></div></form></Section>
      <Section title="Your data"><p className="text-sm text-muted">Download a copy of the data we hold about your account.</p><a className="btn-outline mt-3" href="/api/auth/export" download>Download my data (JSON)</a></Section>
      <Section title="Deactivate account"><p className="text-sm text-muted">This signs you out everywhere, unpublishes your store and archives your products. Staff accounts cannot be deleted here.</p>
        <div className="mt-3 flex max-w-md gap-2"><input aria-label="Confirm password" type="password" placeholder="Confirm your password" className="input" value={del} onChange={(e) => setDel(e.target.value)} /><button className="btn-danger" disabled={!del} onClick={remove}>Deactivate</button></div></Section>
    </div>);
}
