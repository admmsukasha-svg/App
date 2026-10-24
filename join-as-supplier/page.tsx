import Link from 'next/link';
import { meta } from '@/lib/seo';
import { BUSINESS_TYPES } from '@/lib/constants';
import { first, type SP } from '@/components/public/helpers';

export const metadata = meta('Join as a Supplier — Free Business Profile', 'Create your free business profile on MSUKASHA, showcase your products and connect with potential buyers.', '/join-as-supplier');

const STEPS = [
  ['Create your account', 'Name, business email, password, country and language. Verify your email.'],
  ['Choose your business type', 'Manufacturer, wholesaler, distributor, exporter, trading company, retailer, service provider or individual seller.'],
  ['Build your business profile', 'Company details, description, categories, logo and photos. Registration documents are never mandatory to start.'],
  ['Create your digital store', 'Banner, introduction, contact preferences and wholesale information.'],
  ['Publish your first product', 'Add details, MOQ and pricing. Products are reviewed before they appear in search.'],
  ['Track your progress', 'A completion indicator shows your next best actions.']
];

export default async function Join({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const extra = [first(sp, 'ref') && `ref=${encodeURIComponent(first(sp, 'ref')!)}`, first(sp, 'src') && `src=${encodeURIComponent(first(sp, 'src')!)}`].filter(Boolean).join('&');
  const cta = `/register?role=seller${extra ? `&${extra}` : ''}`;
  return (
    <>
      <section className="bg-navy text-white"><div className="container-x py-14">
        <h1 className="max-w-3xl text-3xl font-bold sm:text-4xl">Build Your Business Presence with MSUKASHA.</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/80">Create your free business profile, showcase your products, and connect with potential buyers.</p>
        <p className="mt-3 max-w-2xl text-sm text-white/65">A basic account and store are free, subject to the published terms. No payment is required to start. MSUKASHA is at an early launch stage and cannot guarantee inquiries or orders.</p>
        <Link href={cta} className="btn-primary mt-6 px-6 py-3">Create my free supplier account</Link>
      </div></section>
      <section className="container-x py-12"><h2 className="text-2xl font-bold">How onboarding works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{STEPS.map(([t, d], i) => <li key={t} className="card p-5"><span className="text-sm font-semibold text-brand-dark">Step {i + 1}</span><h3 className="mt-1 font-semibold">{t}</h3><p className="mt-2 text-sm text-muted">{d}</p></li>)}</ol></section>
      <section className="bg-surface py-12"><div className="container-x"><h2 className="text-2xl font-bold">Who can join</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{BUSINESS_TYPES.map((t) => <div key={t.value} className="card p-4"><h3 className="font-semibold">{t.label}</h3><p className="mt-1 text-sm text-muted">{t.blurb}</p></div>)}</div></div></section>
      <section className="container-x py-12"><h2 className="text-2xl font-bold">Verification is optional and honest</h2>
        <p className="mt-2 max-w-3xl text-muted">You can start with email verification. Later you may submit business documents for review. Badges appear only after the matching check is completed. Read the <Link className="text-brand-dark underline" href="/verification-policy">Verification Policy</Link>.</p>
        <Link href={cta} className="btn-primary mt-6">Get started — it’s free</Link></section>
    </>
  );
}
