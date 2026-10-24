import Link from 'next/link';
import { serverTry } from '@/lib/api';
import { meta } from '@/lib/seo';
import SearchBar from '@/components/SearchBar';
import { ProductCard, SupplierCard, C2CCard } from '@/components/cards';
import { EmptyState } from '@/components/ui';
import type { Category, Product, Supplier } from '@/lib/types';

export const revalidate = 60;
export const metadata = meta('MSUKASHA — B2B Marketplace and Pakistan C2C Classifieds', 'Discover suppliers, showcase your products and build business connections across Pakistan and international markets.', '/');

const AUDIENCES = [
  { t: 'Manufacturers', d: 'Present your production capability, MOQ and lead times to business buyers.', href: '/suppliers/for/pakistani-manufacturers' },
  { t: 'Wholesalers', d: 'Publish a wholesale catalogue with tiered prices and availability.', href: '/suppliers/for/pakistani-wholesalers' },
  { t: 'Distributors', d: 'Show the brands and categories you carry and where you deliver.', href: '/suppliers/for/distributors' },
  { t: 'Exporters', d: 'Reach international buyers and respond to quotation requests.', href: '/suppliers/for/pakistani-exporters' },
  { t: 'Retailers & business buyers', d: 'Find suppliers, compare quotations and track your inquiries.', href: '/register' },
  { t: 'Individual C2C sellers', d: 'Sell items locally in Pakistan with PKR prices and in-platform chat.', href: '/c2c' }
];

export default async function Home() {
  const [cats, suppliers, products, c2c] = await Promise.all([
    serverTry<{ categories: Category[] }>('/api/categories', { categories: [] }),
    serverTry<{ suppliers: Supplier[] }>('/api/suppliers?limit=6', { suppliers: [] }),
    serverTry<{ products: Product[] }>('/api/products?type=b2b&limit=8', { products: [] }),
    serverTry<{ listings: any[] }>('/api/c2c?limit=4', { listings: [] })
  ]);

  return (
    <>
      <section className="bg-navy text-white">
        <div className="container-x py-14 sm:py-20">
          <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">Connect Your Business to a World of Opportunities.</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">Discover suppliers, showcase your products, and build business connections across Pakistan and international markets.</p>
          <div className="mt-8 rounded-xl bg-white p-3 text-ink shadow-lg"><SearchBar large /></div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/join-as-supplier" className="btn-primary px-6 py-3">Join as a Supplier — Free</Link>
            <Link href="/suppliers" className="btn-outline border-white/30 bg-transparent px-6 py-3 text-white hover:bg-white/10 hover:text-white">Find Suppliers</Link>
            <Link href="/products" className="btn-outline border-white/30 bg-transparent px-6 py-3 text-white hover:bg-white/10 hover:text-white">Explore Products</Link>
          </div>
          <p className="mt-4 text-sm text-white/60">A basic business account and store are free, subject to our published terms. MSUKASHA is at an early launch stage.</p>
        </div>
      </section>

      <section className="container-x py-12" aria-labelledby="aud">
        <h2 id="aud" className="text-2xl font-bold">Who is MSUKASHA for?</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map((a) => (
            <Link key={a.t} href={a.href} className="card p-5 transition hover:border-brand hover:shadow-md">
              <h3 className="font-semibold">{a.t}</h3><p className="mt-2 text-sm text-muted">{a.d}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-surface py-12" aria-labelledby="cats">
        <div className="container-x">
          <div className="flex items-end justify-between"><h2 id="cats" className="text-2xl font-bold">Product categories</h2><Link href="/categories" className="text-sm font-medium text-brand-dark hover:underline">All categories</Link></div>
          {cats.categories.length ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {cats.categories.slice(0, 12).map((c) => (
                <details key={c.id} className="card group p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">{c.name}<span aria-hidden className="text-muted group-open:rotate-180">⌄</span></summary>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    <li><Link className="text-brand-dark hover:underline" href={`/products?category=${c.id}`}>All {c.name}</Link></li>
                    {c.children.map((k) => <li key={k.id}><Link className="text-muted hover:text-ink" href={`/products?category=${k.id}`}>{k.name}</Link></li>)}
                  </ul>
                </details>
              ))}
            </div>
          ) : <div className="mt-6"><EmptyState title="Categories are being set up">Product categories will appear here as soon as they are published.</EmptyState></div>}
        </div>
      </section>

      <section className="container-x py-12" aria-labelledby="sup">
        <div className="flex items-end justify-between"><h2 id="sup" className="text-2xl font-bold">Featured suppliers</h2><Link href="/suppliers" className="text-sm font-medium text-brand-dark hover:underline">All suppliers</Link></div>
        {suppliers.suppliers.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{suppliers.suppliers.map((s) => <SupplierCard key={s.id} s={s} />)}</div>
          : <div className="mt-6"><EmptyState title="Be among the first suppliers on MSUKASHA" action={<Link href="/join-as-supplier" className="btn-primary">Create your free business profile</Link>}>We are in the launch stage. Published supplier stores will be listed here.</EmptyState></div>}
      </section>

      <section className="container-x pb-12" aria-labelledby="prod">
        <div className="flex items-end justify-between"><h2 id="prod" className="text-2xl font-bold">Wholesale products</h2><Link href="/products" className="text-sm font-medium text-brand-dark hover:underline">All products</Link></div>
        {products.products.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{products.products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          : <div className="mt-6"><EmptyState title="No approved products yet">Products appear here after they pass moderation.</EmptyState></div>}
      </section>

      <section className="bg-navy py-12 text-white" aria-labelledby="net">
        <div className="container-x grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-3"><h2 id="net" className="text-2xl font-bold">Build business connections</h2></div>
          {[['Supplier discovery', 'Search by product, company, category, country and verification status.'], ['Request for Quotation', 'Describe what you need, choose which suppliers receive it, and compare their quotations.'], ['Product inquiries & business profiles', 'Message suppliers about a specific product and review their business profile before you commit.']].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-white/15 p-5"><h3 className="font-semibold">{t}</h3><p className="mt-2 text-sm text-white/75">{d}</p></div>
          ))}
          <div className="lg:col-span-3"><Link href="/rfq" className="btn-primary">Learn about Request for Quotation</Link></div>
        </div>
      </section>

      <section className="container-x py-12" aria-labelledby="c2c">
        <div className="flex items-end justify-between"><h2 id="c2c" className="text-2xl font-bold">Pakistan C2C marketplace</h2><Link href="/c2c" className="text-sm font-medium text-brand-dark hover:underline">Browse listings</Link></div>
        <p className="mt-1 text-sm text-muted">Local listings between individuals, priced in PKR. Separate from international wholesale sourcing.</p>
        {c2c.listings.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{c2c.listings.map((l) => <C2CCard key={l.id} l={l} />)}</div>
          : <div className="mt-6"><EmptyState title="No local listings yet" action={<Link href="/c2c/new" className="btn-outline">Post a listing</Link>}>Approved listings will appear here.</EmptyState></div>}
      </section>

      <section className="bg-surface py-12" aria-labelledby="how">
        <div className="container-x">
          <h2 id="how" className="text-2xl font-bold">How MSUKASHA works</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {[
              ['For suppliers', ['Create a free account and verify your email', 'Build your business profile and digital store', 'Add products — approved listings appear in search', 'Respond to inquiries and requests for quotation']],
              ['For wholesale buyers', ['Search products and suppliers', 'Check each supplier’s verification status', 'Message a supplier or send a Request for Quotation', 'Compare quotations and agree terms directly']],
              ['For individual sellers', ['Create a free account', 'Post a local listing with photos and a PKR price', 'Listings are reviewed before they go live', 'Chat with buyers inside MSUKASHA']]
            ].map(([t, steps]) => (
              <div key={t as string} className="card p-5"><h3 className="font-semibold">{t as string}</h3>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">{(steps as string[]).map((s) => <li key={s}>{s}</li>)}</ol></div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-12" aria-labelledby="trust">
        <h2 id="trust" className="text-2xl font-bold">Trust and support</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[['Verification', 'Badges are shown only for checks that were actually completed.', '/verification-policy'], ['Report a problem', 'Report suspicious listings or suppliers from any page.', '/report'], ['Privacy', 'Tax IDs, identity documents and private addresses are never shown publicly.', '/privacy'], ['Prohibited items', 'Listings are moderated against our prohibited items policy.', '/prohibited-items']].map(([t, d, h]) => (
            <Link key={t} href={h} className="card p-5 hover:border-brand"><h3 className="font-semibold">{t}</h3><p className="mt-2 text-sm text-muted">{d}</p></Link>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">MSUKASHA does not currently offer escrow, payment protection or guaranteed refunds. Agree payment and delivery terms carefully with the other party.</p>
      </section>
    </>
  );
}
