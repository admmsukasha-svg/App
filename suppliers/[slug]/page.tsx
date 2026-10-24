import { notFound } from 'next/navigation';
import { serverGet, serverTry } from '@/lib/api';
import { meta, jsonLd } from '@/lib/seo';
import { SITE, countryName, typeLabel } from '@/lib/constants';
import { ProductCard } from '@/components/cards';
import { SafeImg, VerificationBadges, EmptyState } from '@/components/ui';
import EntityActions from '@/components/public/EntityActions';
import type { Product, Supplier } from '@/lib/types';

const load = (slug: string) => serverGet<{ supplier: Supplier; productCount: number }>(`/api/suppliers/${encodeURIComponent(slug)}`, 60);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const r = await load((await params).slug);
  if (!r) return meta('Supplier not found', 'This supplier profile is not available.', '/suppliers', { noindex: true });
  const s = r.supplier;
  return meta(`${s.companyName} — ${typeLabel(s.businessType)}`, (s.description || `${s.companyName} on MSUKASHA`).slice(0, 155), `/suppliers/${s.slug}`, { image: s.logo });
}

export default async function SupplierPage({ params }: { params: Promise<{ slug: string }> }) {
  const r = await load((await params).slug);
  if (!r) notFound();
  const s = r.supplier;
  const { products } = await serverTry<{ products: Product[] }>(`/api/products?seller=${s.ownerId}&limit=12`, { products: [] }, 60);
  const ld = { '@context': 'https://schema.org', '@type': 'Organization', name: s.companyName, url: `${SITE.url}/suppliers/${s.slug}`, description: s.description, logo: s.logo, address: { '@type': 'PostalAddress', addressLocality: s.city, addressCountry: s.country } };
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      {s.store.banner ? <SafeImg src={s.store.banner} alt={`${s.companyName} store banner`} className="h-40 w-full sm:h-56" /> : <div className="h-24 bg-navy" />}
      <div className="container-x py-8">
        <div className="flex flex-col gap-6 sm:flex-row">
          <SafeImg src={s.logo} alt={`${s.companyName} logo`} className="-mt-14 h-24 w-24 shrink-0 rounded-xl border-4 border-white bg-white" />
          <div className="min-w-0 flex-1 space-y-2">
            <h1 className="text-2xl font-bold">{s.companyName}</h1>
            <p className="text-sm text-muted">{typeLabel(s.businessType)} · {[s.city, countryName(s.country)].filter(Boolean).join(', ')}{s.yearEstablished ? ` · Est. ${s.yearEstablished}` : ''}</p>
            <VerificationBadges levels={s.verificationLevels} />
            <p className="text-xs text-muted">A badge shows only the checks that were completed. It is not a guarantee of any transaction.</p>
          </div>
          <div className="sm:w-72"><EntityActions recipientId={s.ownerId} refType="supplier" refId={s.id} subject={`Inquiry for ${s.companyName}`} allowInquiry={s.store.contactPreferences.allowInquiries}
            favorite={{ kind: 'supplier', ref: s.id }} report={{ type: 'supplier', id: s.id }} rfqHref={s.store.contactPreferences.allowRfq ? `/rfq/new?supplier=${s.ownerId}` : undefined} /></div>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2 space-y-4"><h2 className="text-lg font-semibold">About</h2>
            <p className="whitespace-pre-line text-ink/90">{s.store.intro || s.description || 'This supplier has not added a description yet.'}</p></section>
          <aside className="card h-fit space-y-2 p-5 text-sm"><h2 className="font-semibold">Details</h2>
            {s.website && <p><span className="text-muted">Website: </span><a rel="nofollow noopener noreferrer" target="_blank" className="text-brand-dark hover:underline" href={s.website}>{s.website.replace(/^https?:\/\//, '')}</a></p>}
            {s.phone && <p><span className="text-muted">Phone: </span>{s.phone}</p>}
            {s.store.wholesale?.shippingTerms && <p><span className="text-muted">Shipping terms: </span>{s.store.wholesale.shippingTerms}</p>}
            {s.store.wholesale?.paymentTerms && <p><span className="text-muted">Payment terms: </span>{s.store.wholesale.paymentTerms}</p>}
            {!!s.store.wholesale?.currencies?.length && <p><span className="text-muted">Currencies: </span>{s.store.wholesale.currencies.join(', ')}</p>}
          </aside>
        </div>
        <section className="mt-10"><h2 className="text-lg font-semibold">Products ({r.productCount})</h2>
          {products.length ? <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div> : <div className="mt-4"><EmptyState title="No products published yet" /></div>}
        </section>
      </div>
    </div>
  );
}
