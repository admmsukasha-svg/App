import Link from 'next/link';
import { serverGet, qs } from '@/lib/api';
import { meta } from '@/lib/seo';
import { PK_CITIES } from '@/lib/constants';
import { C2CCard } from '@/components/cards';
import { EmptyState, PageHeader, Pagination } from '@/components/ui';
import { F, first, hasFilters, type SP } from '@/components/public/helpers';
import type { Paged } from '@/lib/types';

const KEYS = ['q', 'city', 'condition', 'minPrice', 'maxPrice', 'sort'];
export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  return meta('Pakistan C2C Marketplace', 'Buy and sell locally in Pakistan. Listings are priced in PKR and reviewed before they go live.', '/c2c', { noindex: hasFilters(sp, KEYS) || !!first(sp, 'page') });
}
export default async function C2C({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const params = Object.fromEntries(KEYS.map((k) => [k, first(sp, k)]));
  const page = Number(first(sp, 'page')) || 1;
  const data = await serverGet<Paged<{ listings: any[] }>>(`/api/c2c${qs({ ...params, page, limit: 24 })}`, 30);
  return (
    <>
      <PageHeader title="Pakistan C2C marketplace" subtitle="Local listings between individuals, priced in PKR. This is separate from international wholesale sourcing."><Link className="btn-primary" href="/c2c/new">Post a listing</Link></PageHeader>
      <div className="container-x grid gap-8 py-8 lg:grid-cols-[240px_1fr]">
        <form method="get" className="card h-fit space-y-3 p-4" aria-label="Filter listings">
          <F label="Search" id="q"><input id="q" name="q" defaultValue={params.q} className="input" maxLength={80} /></F>
          <F label="City" id="city"><select id="city" name="city" defaultValue={params.city || ''} className="input"><option value="">All cities</option>{PK_CITIES.map((c) => <option key={c}>{c}</option>)}</select></F>
          <F label="Condition" id="condition"><select id="condition" name="condition" defaultValue={params.condition || ''} className="input"><option value="">Any</option><option value="new">New</option><option value="used">Used</option><option value="refurbished">Refurbished</option></select></F>
          <div className="grid grid-cols-2 gap-2"><F label="Min PKR" id="minPrice"><input id="minPrice" name="minPrice" type="number" min="0" defaultValue={params.minPrice} className="input" /></F><F label="Max PKR" id="maxPrice"><input id="maxPrice" name="maxPrice" type="number" min="0" defaultValue={params.maxPrice} className="input" /></F></div>
          <F label="Sort" id="sort"><select id="sort" name="sort" defaultValue={params.sort || ''} className="input"><option value="">Newest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select></F>
          <div className="flex gap-2"><button className="btn-primary flex-1">Apply</button><a className="btn-outline" href="/c2c">Reset</a></div>
        </form>
        <div>
          <p className="mb-4 text-sm text-muted" aria-live="polite">{data ? `${data.total.toLocaleString()} listing${data.total === 1 ? '' : 's'}` : 'Listings are temporarily unavailable.'}</p>
          {data?.listings.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{data.listings.map((l) => <C2CCard key={l.id} l={l} />)}</div> : <EmptyState title="No listings found" />}
          <Pagination page={page} pages={data?.pages || 1} basePath="/c2c" params={params} />
          <p className="mt-8 text-xs text-muted">MSUKASHA does not offer escrow or protected transactions for C2C. Meet in safe public places and inspect items before paying. <Link className="underline" href="/prohibited-items">Prohibited items policy</Link>.</p>
        </div>
      </div>
    </>
  );
}
