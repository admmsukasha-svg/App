'use client';
import { api } from '@/lib/api';
import { ProductCard, SupplierCard, C2CCard } from '@/components/cards';
import { EmptyState } from '@/components/ui';
import { Err, Loading, PageTitle, Section, errMsg, useLoad } from '@/components/dash/kit';
import { useState } from 'react';
export default function Favorites() {
  const { data, error, loading, reload } = useLoad(() => api<any>('/favorites'), []); const [err, setErr] = useState('');
  const remove = async (kind: string, ref: string) => { try { await api(`/favorites/${kind}/${ref}`, { method: 'DELETE' }); reload(); } catch (e) { setErr(errMsg(e)); } };
  const empty = data && !data.products.length && !data.suppliers.length && !data.c2c.length;
  return (<div className="space-y-6"><PageTitle title="Saved items" /><Err error={error || err} />{loading ? <Loading /> : empty ? <EmptyState title="Nothing saved yet">Use Save on a product, supplier or listing.</EmptyState> : (<>
    {!!data.products.length && <Section title="Products"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{data.products.map((p: any) => <div key={p.id}><ProductCard p={p} /><button className="btn-outline mt-2 w-full" onClick={() => remove('product', p.id)}>Remove</button></div>)}</div></Section>}
    {!!data.suppliers.length && <Section title="Suppliers"><div className="grid gap-4 md:grid-cols-2">{data.suppliers.map((s: any) => <div key={s.id}><SupplierCard s={{ ...s, verificationLevels: [] }} /><button className="btn-outline mt-2 w-full" onClick={() => remove('supplier', s.id)}>Remove</button></div>)}</div></Section>}
    {!!data.c2c.length && <Section title="C2C listings"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{data.c2c.map((l: any) => <div key={l.id}><C2CCard l={l} /><button className="btn-outline mt-2 w-full" onClick={() => remove('c2c', l.id)}>Remove</button></div>)}</div></Section>}</>)}</div>);
}
