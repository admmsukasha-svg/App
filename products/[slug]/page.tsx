import Link from 'next/link';
import { notFound } from 'next/navigation';
import { serverGet, money } from '@/lib/api';
import { meta, jsonLd } from '@/lib/seo';
import { SITE, countryName } from '@/lib/constants';
import { Badge, SafeImg } from '@/components/ui';
import EntityActions from '@/components/public/EntityActions';
import type { Product } from '@/lib/types';

type Res = { product: Product; supplier: { companyName: string; slug: string; country?: string; city?: string } | null };
const load = (slug: string) => serverGet<Res>(`/api/products/${encodeURIComponent(slug)}`, 60);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const r = await load((await params).slug);
  if (!r) return meta('Product not found', 'This product is not available.', '/products', { noindex: true });
  const p = r.product;
  return meta(p.name, (p.short || p.description || `${p.name} from ${r.supplier?.companyName || 'a supplier'} on MSUKASHA`).slice(0, 155), `/products/${p.slug || p.id}`, { image: p.img || p.images?.[0] });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const r = await load((await params).slug);
  if (!r) notFound();
  const { product: p, supplier } = r;
  const seller = typeof p.seller === 'object' ? p.seller : undefined;
  const imgs = (p.images?.length ? p.images : p.img ? [p.img] : []).slice(0, 6);
  const ld: Record<string, unknown> = { '@context': 'https://schema.org', '@type': 'Product', name: p.name, description: p.description || p.short, image: imgs };
  if (p.price != null && !p.priceOnRequest) ld.offers = { '@type': 'Offer', price: p.price, priceCurrency: p.currency, url: `${SITE.url}/products/${p.slug || p.id}` };
  return (
    <div className="container-x py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted"><Link href="/" className="hover:underline">Home</Link> / <Link href="/products" className="hover:underline">Products</Link> / <span>{p.name}</span></nav>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <SafeImg src={imgs[0]} alt={p.name} className="aspect-[4/3] w-full rounded-xl" />
          {imgs.length > 1 && <div className="grid grid-cols-5 gap-2">{imgs.slice(1).map((i) => <SafeImg key={i} src={i} alt={`${p.name} view`} className="aspect-square w-full rounded-lg" />)}</div>}
        </div>
        <div className="space-y-5">
          <h1 className="text-2xl font-bold sm:text-3xl">{p.name}</h1>
          <p className="text-2xl font-bold">{money(p.price, p.currency, p.priceOnRequest)}{p.price != null && !p.priceOnRequest && <span className="text-sm font-normal text-muted"> / {p.unit}</span>}</p>
          {!!p.priceTiers?.length && (
            <table className="w-full text-sm"><caption className="mb-1 text-left font-semibold">Price by quantity</caption><thead><tr className="border-b border-line text-left text-muted"><th className="py-1.5">Quantity</th><th>Unit price</th></tr></thead>
              <tbody>{p.priceTiers.map((t) => <tr key={t.minQty} className="border-b border-line"><td className="py-1.5">≥ {t.minQty.toLocaleString()} {p.unit}</td><td>{money(t.price, p.currency)}</td></tr>)}</tbody></table>
          )}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted">Minimum order</dt><dd>{p.moq.toLocaleString()} {p.unit}</dd>
            {p.availableQuantity != null && <><dt className="text-muted">Available quantity</dt><dd>{p.availableQuantity.toLocaleString()} {p.unit}</dd></>}
            {p.leadTimeDays != null && <><dt className="text-muted">Lead time</dt><dd>{p.leadTimeDays} days</dd></>}
            <dt className="text-muted">Samples</dt><dd>{p.sampleAvailable ? 'Available' : 'Not stated'}</dd>
            {p.originCountry && <><dt className="text-muted">Country of origin</dt><dd>{countryName(p.originCountry)}</dd></>}
            {(p.city || p.country) && <><dt className="text-muted">Ships from</dt><dd>{[p.city, countryName(p.country)].filter(Boolean).join(', ')}</dd></>}
            {p.customization && <><dt className="text-muted">Customisation</dt><dd>{p.customization}</dd></>}
            {p.shippingTerms && <><dt className="text-muted">Shipping terms</dt><dd>{p.shippingTerms}</dd></>}
          </dl>
          {seller && (
            <EntityActions recipientId={seller.id} refType="product" refId={p.id} subject={p.name} favorite={{ kind: 'product', ref: p.id }} report={{ type: 'product', id: p.id }}
              rfqHref={`/rfq/new?product=${p.id}&supplier=${seller.id}&title=${encodeURIComponent(p.name)}`} />
          )}
        </div>
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {p.description && <section><h2 className="text-lg font-semibold">Description</h2><p className="mt-2 whitespace-pre-line text-ink/90">{p.description}</p></section>}
          {!!p.specifications?.length && <section><h2 className="text-lg font-semibold">Specifications</h2><dl className="mt-2 divide-y divide-line rounded-xl border border-line">{p.specifications.map((s) => <div key={s.key} className="grid grid-cols-3 gap-2 px-4 py-2 text-sm"><dt className="text-muted">{s.key}</dt><dd className="col-span-2">{s.value}</dd></div>)}</dl></section>}
          {!!p.variations?.length && <section><h2 className="text-lg font-semibold">Options</h2><ul className="mt-2 space-y-1 text-sm">{p.variations.map((v) => <li key={v.name}><b>{v.name}:</b> {v.options.join(', ')}</li>)}</ul></section>}
        </div>
        {supplier && <aside className="card h-fit space-y-2 p-5"><h2 className="font-semibold">Supplier</h2><p><Link href={`/suppliers/${supplier.slug}`} className="font-medium text-brand-dark hover:underline">{supplier.companyName}</Link></p><p className="text-sm text-muted">{[supplier.city, countryName(supplier.country)].filter(Boolean).join(', ')}</p><Badge tone="gray">Check the supplier profile for verification status</Badge></aside>}
      </div>
    </div>
  );
}
