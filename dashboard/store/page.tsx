'use client';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Loading, PageTitle, Section, useLoad, Err } from '@/components/dash/kit';
import { StoreForm, type BizCtx } from '@/components/dash/forms';
export default function Store() {
  const biz = useLoad(() => api<BizCtx>('/business/me'), []);
  const [ctx, setCtx] = useState<BizCtx | null>(null);
  const c = ctx || biz.data;
  return (<div className="space-y-6"><PageTitle title="Digital store" actions={c?.profile && c.store?.status === 'published' ? <Link className="btn-outline" href={`/suppliers/${c.profile.slug}`} target="_blank">View public store</Link> : undefined} /><Err error={biz.error} />
    {!c ? <Loading /> : <Section title="Store settings"><StoreForm key={c.store?.id || 'new'} ctx={c} onSaved={setCtx} /></Section>}</div>);
}
