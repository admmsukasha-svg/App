import { serverGet, serverTry, qs } from '@/lib/api';
import { meta } from '@/lib/seo';
import { SupplierCard } from '@/components/cards';
import { EmptyState, PageHeader, Pagination } from '@/components/ui';
import { CategorySelect, CountrySelect, TypeSelect, F, first, hasFilters, type SP } from '@/components/public/helpers';
import type { Category, Paged, Supplier } from '@/lib/types';

const KEYS = ['q', 'country', 'city', 'type', 'category', 'verified'];
export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  return meta('Supplier Directory', 'Find manufacturers, wholesalers, distributors and exporters on MSUKASHA.', '/suppliers', { noindex: hasFilters(sp, KEYS) || !!first(sp, 'page') });
}

export default async function Suppliers({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const params = Object.fromEntries(KEYS.map((k) => [k, first(sp, k)]));
  const page = Number(first(sp, 'page')) || 1;
  const [cats, data] = await Promise.all([
    serverTry<{ categories: Category[] }>('/api/categories', { categories: [] }),
    serverGet<Paged<{ suppliers: Supplier[] }>>(`/api/suppliers${qs({ ...params, page, limit: 18 })}`, 30)
  ]);
  return (
    <>
      <PageHeader title="Supplier directory" subtitle="Businesses with a published store on MSUKASHA." />
      <div className="container-x grid gap-8 py-8 lg:grid-cols-[260px_1fr]">
        <form method="get" className="card h-fit space-y-3 p-4" aria-label="Filter suppliers">
          <F label="Search company" id="q"><input id="q" name="q" defaultValue={params.q} className="input" maxLength={80} /></F>
          <F label="Business type" id="type"><TypeSelect value={params.type} /></F>
          <F label="Category" id="category"><CategorySelect cats={cats.categories} value={params.category} /></F>
          <F label="Country" id="country"><CountrySelect value={params.country} /></F>
          <F label="City" id="city"><input id="city" name="city" defaultValue={params.city} className="input" maxLength={80} /></F>
          <F label="Verification" id="verified"><select id="verified" name="verified" defaultValue={params.verified || ''} className="input"><option value="">Any</option><option value="documents">Business documents reviewed</option></select></F>
          <div className="flex gap-2"><button className="btn-primary flex-1" type="submit">Apply</button><a className="btn-outline" href="/suppliers">Reset</a></div>
        </form>
        <div>
          <p className="mb-4 text-sm text-muted" aria-live="polite">{data ? `${data.total.toLocaleString()} supplier${data.total === 1 ? '' : 's'} found` : 'Suppliers are temporarily unavailable.'}</p>
          {data?.suppliers.length ? <div className="grid gap-4 md:grid-cols-2">{data.suppliers.map((s) => <SupplierCard key={s.id} s={s} />)}</div>
            : <EmptyState title="No suppliers match your search">MSUKASHA is at launch stage, so the directory is still growing. Try fewer filters.</EmptyState>}
          <Pagination page={page} pages={data?.pages || 1} basePath="/suppliers" params={params} />
        </div>
      </div>
    </>
  );
}
