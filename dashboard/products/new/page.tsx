'use client';
import { api } from '@/lib/api';
import ProductForm from '@/components/dash/ProductForm';
import { Loading, PageTitle, Section, useLoad, Err } from '@/components/dash/kit';
import type { Category } from '@/lib/types';
export default function NewProduct() {
  const cats = useLoad(() => api<{ categories: Category[] }>('/categories'), []);
  return (<div className="space-y-6"><PageTitle title="Add product" sub="Save as a draft any time. Submit for review when you are ready." /><Err error={cats.error} />{cats.loading ? <Loading /> : <Section title="Product details"><ProductForm cats={cats.data?.categories || []} /></Section>}</div>);
}
