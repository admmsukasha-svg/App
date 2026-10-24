'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Loading, PageTitle, Section, useLoad, Err } from '@/components/dash/kit';
import { ProfileForm, type BizCtx } from '@/components/dash/forms';
import type { Category } from '@/lib/types';
export default function Profile() {
  const biz = useLoad(() => api<BizCtx>('/business/me'), []);
  const cats = useLoad(() => api<{ categories: Category[] }>('/categories'), []);
  const [ctx, setCtx] = useState<BizCtx | null>(null);
  const c = ctx || biz.data;
  return (<div className="space-y-6"><PageTitle title="Company profile" sub="Private fields (address, registration number) are never shown publicly." /><Err error={biz.error} />
    {!c ? <Loading /> : <><p className="text-sm">Completion: <b>{c.completion.percent}%</b>{c.completion.missing.length ? ` — missing: ${c.completion.missing.join(', ')}` : ''}</p><Section title="Business details"><ProfileForm key={c.profile?.id || 'new'} ctx={c} cats={cats.data?.categories || []} onSaved={setCtx} /></Section></>}</div>);
}
