import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SEGMENTS } from '@/lib/constants';
import { meta } from '@/lib/seo';
import { PageHeader } from '@/components/ui';

export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(SEGMENTS).map((segment) => ({ segment })); }
export async function generateMetadata({ params }: { params: Promise<{ segment: string }> }) {
  const s = SEGMENTS[(await params).segment];
  return s ? meta(`MSUKASHA for ${s.title}`, s.intro, `/suppliers/for/${(await params).segment}`) : {};
}

export default async function Segment({ params }: { params: Promise<{ segment: string }> }) {
  const key = (await params).segment;
  const s = SEGMENTS[key];
  if (!s) notFound();
  return (
    <>
      <PageHeader title={s.heading} subtitle={s.intro}>
        <Link className="btn-primary" href={`/join-as-supplier?src=${key}`}>Join as a Supplier — Free</Link>
      </PageHeader>
      <div className="container-x grid gap-8 py-10 lg:grid-cols-3">
        <section className="lg:col-span-2"><h2 className="text-xl font-semibold">What you can do on MSUKASHA</h2>
          <ul className="mt-4 space-y-3">{s.points.map((p) => <li key={p} className="card p-4 text-sm">{p}</li>)}</ul>
          <h2 className="mt-8 text-xl font-semibold">What to expect</h2>
          <p className="mt-2 text-muted">A basic business account and digital store are free, subject to our published terms. Your listings are reviewed before they appear in search. MSUKASHA is at an early launch stage, so we cannot promise any number of buyers, inquiries or orders.</p>
        </section>
        <aside className="card h-fit space-y-3 p-5"><h2 className="font-semibold">Start in minutes</h2>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted"><li>Create your account</li><li>Verify your email</li><li>Complete your business profile</li><li>Publish your first product</li></ol>
          <Link className="btn-primary w-full" href={`/join-as-supplier?src=${key}`}>Get started</Link></aside>
      </div>
    </>
  );
}
