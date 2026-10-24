import { serverGet, serverTry, qs } from '@/lib/api';
import { meta } from '@/lib/seo';
import { ProductCard } from '@/components/cards';
import { EmptyState, PageHeader, Pagination } from '@/components/ui';
import { CategorySelect, CountrySelect, F, first, hasFilters, type SP } from '@/components/public/helpers';
import type { Category, Paged, Product } from '@/lib/types';

const KEYS = ['q', 'category', 'country', 'city', 'currency', 'minPrice', 'maxPrice', 'maxMoq', 'verified', 'sort'];
export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  return meta('Wholesale Products', 'Browse wholesale products from manufacturers, wholesalers, distributors and exporters on MSUKASHA.', '/products', { noindex: hasFilters(sp, KEYS) || !!first(sp, 'page') });
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const params = Object.fromEntries(KEYS.map((k) => [k, first(sp, k)]));
  const page = Number(first(sp, 'page')) || 1;
  const [cats, data] = await Promise.all([
    serverTry<{ categories: Category[] }>('/api/categories', { categories: [] }),
    serverGet<Paged<{ products: Product[] }>>(`/api/products${qs({ ...params, type: 'b2b', page, limit: 24 })}`, 30)
  ]);
  const products = data?.products || [];
  return (
    <>
      <PageHeader title="Wholesale products" subtitle="Approved listings from suppliers on MSUKASHA. Always check a supplier’s verification status before you order." />
      <div className="container-x grid gap-8 py-8 lg:grid-cols-[260px_1fr]">
        <form method="get" className="card h-fit space-y-3 p-4" aria-label="Filter products">
          <F label="Search" id="q"><input id="q" name="q" defaultValue={params.q} className="input" maxLength={80} placeholder="Product or keyword" /></F>
          <F label="Category" id="category"><CategorySelect cats={cats.categories} value={params.category} /></F>
          <F label="Country" id="country"><CountrySelect value={params.country} /></F>
          <F label="City" id="city"><input id="city" name="city" defaultValue={params.city} className="input" maxLength={80} /></F>
          <F label="Currency" id="currency"><select id="currency" name="currency" defaultValue={params.currency || ''} className="input"><option value="">Any</option><option>USD</option><option>PKR</option></select></F>
          <div className="grid grid-cols-2 gap-2">
            <F label="Min price" id="minPrice"><input id="minPrice" name="minPrice" type="number" min="0" defaultValue={params.minPrice} className="input" /></F>
            <F label="Max price" id="maxPrice"><input id="maxPrice" name="maxPrice" type="number" min="0" defaultValue={params.maxPrice} className="input" /></F>
          </div>
          <F label="Max MOQ" id="maxMoq"><input id="maxMoq" name="maxMoq" type="number" min="1" defaultValue={params.maxMoq} className="input" /></F>
          <F label="Supplier verification" id="verified"><select id="verified" name="verified" defaultValue={params.verified || ''} className="input"><option value="">Any</option><option value="documents">Business documents reviewed</option></select></F>
          <F label="Sort by" id="sort"><select id="sort" name="sort" defaultValue={params.sort || ''} className="input"><option value="">Relevance / newest</option><option value="recent">Most recent</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select></F>
          <div className="flex gap-2"><button className="btn-primary flex-1" type="submit">Apply</button><a className="btn-outline" href="/products">Reset</a></div>
        </form>
        <div>
          <p className="mb-4 text-sm text-muted" aria-live="polite">{data ? `${data.total.toLocaleString()} product${data.total === 1 ? '' : 's'} found` : 'Products are temporarily unavailable.'}</p>
          {products.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
            : <EmptyState title="No products match your search">Try removing a filter or searching for a broader term.</EmptyState>}
          <Pagination page={page} pages={data?.pages || 1} basePath="/products" params={params} />
        </div>
      </div>
    </>
  );
}
