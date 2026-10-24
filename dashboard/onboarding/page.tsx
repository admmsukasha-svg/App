'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Notice, VerificationBadges } from '@/components/ui';
import { Err, Loading, PageTitle, Section, useLoad } from '@/components/dash/kit';
import { ProfileForm, StoreForm, type BizCtx } from '@/components/dash/forms';
import ProductForm from '@/components/dash/ProductForm';
import type { Category } from '@/lib/types';

const STEPS = ['Account', 'Business type', 'Business profile', 'Digital store', 'First product', 'Done'];

export default function Onboarding() {
  const { user, refresh } = useAuth();
  const biz = useLoad(() => api<BizCtx>('/business/me'), []);
  const cats = useLoad(() => api<{ categories: Category[] }>('/categories'), []);
  const [ctx, setCtx] = useState<BizCtx | null>(null);
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState('');
  useEffect(() => { if (biz.data) { setCtx(biz.data); setStep(Math.min(6, Math.max(1, biz.data.profile?.onboardingStep || (biz.data.profile ? 3 : 1)))); } }, [biz.data]);
  if (biz.loading || !ctx || !user) return <Loading />;
  const individual = ctx.profile?.businessType === 'individual';
  const resend = async () => { try { setMsg((await api<{ message: string }>('/auth/resend-verification', { body: {} })).message); } catch (e: any) { setMsg(e.message); } };
  const cs = cats.data?.categories || [];
  return (
    <div className="space-y-6">
      <PageTitle title="Set up your supplier presence" sub="Six short steps. A basic account and store are free, and you can stop and continue later." />
      <ol className="flex flex-wrap gap-2" aria-label="Progress">{STEPS.map((s, i) => <li key={s}><button onClick={() => setStep(i + 1)} aria-current={step === i + 1 ? 'step' : undefined} className={`rounded-full px-3 py-1.5 text-sm ${step === i + 1 ? 'bg-brand text-white' : 'bg-surface text-muted hover:text-ink'}`}>{i + 1}. {s}</button></li>)}</ol>
      <Err error={biz.error || cats.error} />
      {step === 1 && <Section title="Your account">
        <p className="text-sm">Signed in as <b>{user.email}</b>.</p>
        {user.emailVerified ? <Notice kind="ok">Email verified.</Notice> : <div className="mt-3 space-y-2"><Notice kind="warn">Check your inbox for the verification link. You need a verified email to publish your store and products.</Notice><button className="btn-outline" onClick={resend}>Resend verification email</button>{msg && <p className="text-sm text-muted">{msg}</p>}<button className="btn-outline ml-2" onClick={refresh}>I have verified — refresh</button></div>}
        <button className="btn-primary mt-4" onClick={() => setStep(2)}>Continue</button></Section>}
      {step === 2 && <Section title="What kind of business are you?">
        <p className="text-sm text-muted">Choose your business type in the next step’s form. Individual sellers should use the C2C marketplace instead of a B2B store.</p>
        <div className="mt-3 flex gap-2"><button className="btn-primary" onClick={() => setStep(3)}>Continue</button><Link className="btn-outline" href="/c2c/new">I’m an individual seller</Link></div></Section>}
      {step === 3 && <Section title="Business profile"><ProfileForm ctx={ctx} cats={cs} step={4} onSaved={(c) => { setCtx(c); setStep(individual ? 6 : 4); }} /></Section>}
      {step === 4 && <Section title="Digital store"><StoreForm ctx={ctx} step={5} onSaved={(c) => { setCtx(c); }} /><button className="btn-outline mt-4" onClick={() => setStep(5)}>Continue to first product</button></Section>}
      {step === 5 && <Section title="Publish your first product"><p className="mb-4 text-sm text-muted">Fill in the essentials. Your product is reviewed before it appears in search.</p><ProductForm cats={cs} compact onDone={() => setStep(6)} /></Section>}
      {step === 6 && <Section title="You’re set up">
        <p className="text-sm">Profile completion: <b>{ctx.completion.percent}%</b></p>
        {ctx.completion.missing.length > 0 && <p className="mt-1 text-sm text-muted">Still missing: {ctx.completion.missing.join(', ')}.</p>}
        <div className="mt-3 flex items-center gap-2 text-sm">Verification: <VerificationBadges levels={ctx.levels} /></div>
        <p className="mt-3 text-sm text-muted">Complete your company profile to help buyers understand your business. Add your first five products to build a useful product catalogue.</p>
        <div className="mt-4 flex flex-wrap gap-2"><Link className="btn-primary" href="/dashboard">Go to dashboard</Link><Link className="btn-outline" href="/dashboard/products/new">Add another product</Link><Link className="btn-outline" href="/dashboard/verification">Apply for document review</Link></div></Section>}
    </div>
  );
}
