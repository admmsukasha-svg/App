'use client';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import ProductForm from '@/components/dash/ProductForm';
import { Loading, PageTitle, Section, useLoad, Err } from '@/components/dash/kit';
import type { Category, Product } from '@/lib/types';
export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const cats = useLoad(() => api<{ categories: Category[] }>('/categories'), []);
  const prod = useLoad(async () => (await api<{ product: Product }>(`/products/my/${id}`)).product, [id]);
  return (<div className="space-y-6"><PageTitle title="Edit product" /><Err error={cats.error || prod.error} />{cats.loading || prod.loading ? <Loading /> : !prod.data ? <Err error="Product not found." /> : <Section title="Product details"><ProductForm product={prod.data} cats={cats.data?.categories || []} onDone={() => prod.reload()} /></Section>}</div>);
}
