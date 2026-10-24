import Link from 'next/link';
import { serverTry } from '@/lib/api';
import { meta } from '@/lib/seo';
import { EmptyState, PageHeader, Badge } from '@/components/ui';
import type { Category } from '@/lib/types';

export const metadata = meta('Product Categories', 'Browse product categories on MSUKASHA: electronics, textiles, machinery, agriculture, sports goods and more.', '/categories');
export const revalidate = 300;

export default async function Categories() {
  const { categories } = await serverTry<{ categories: Category[] }>('/api/categories', { categories: [] }, 300);
  return (
    <>
      <PageHeader title="Product categories" subtitle="Find suppliers and products by category." />
      <div className="container-x py-8">
        {categories.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <section key={c.id} className="card p-5" aria-labelledby={`c-${c.id}`}>
                <h2 id={`c-${c.id}`} className="font-semibold"><Link className="hover:text-brand-dark" href={`/products?category=${c.id}`}>{c.name}</Link> {c.restricted && <Badge tone="orange">Restricted: extra review</Badge>}</h2>
                <ul className="mt-3 space-y-1.5 text-sm">{c.children.map((k) => <li key={k.id}><Link className="text-muted hover:text-ink" href={`/products?category=${k.id}`}>{k.name}</Link></li>)}</ul>
              </section>
            ))}
          </div>
        ) : <EmptyState title="Categories are being set up">Categories will appear here once they are published.</EmptyState>}
      </div>
    </>
  );
}
