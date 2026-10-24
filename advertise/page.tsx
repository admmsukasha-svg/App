import Link from 'next/link';
import { meta } from '@/lib/seo';
import { PageHeader } from '@/components/ui';
import { Notice } from '@/components/ui';
export const metadata = meta('Advertising on MSUKASHA', 'Promotional placement options on MSUKASHA. Sponsored content is always labelled.', '/advertise');
export default function Advertise() {
  return (
    <>
      <PageHeader title="Advertising" subtitle="Promotional options for businesses on MSUKASHA." />
      <div className="container-x space-y-6 py-10">
        <Notice kind="warn">Paid advertising is not open for online purchase yet. Online payment is not configured, so no paid service can be bought or simulated on this site. Basic business registration and the basic store remain free.</Notice>
        <section className="grid gap-4 md:grid-cols-2">
          {[['Featured product placement', 'Highlight a product above regular results.'], ['Sponsored supplier listings', 'Appear in a labelled sponsored slot in the supplier directory.'], ['Advertising packages', 'Time-limited campaigns with start and end dates.'], ['Advanced store analytics', 'More detailed insight into your store views.']].map(([t, d]) => (
            <div key={t} className="card p-5"><h2 className="font-semibold">{t}</h2><p className="mt-1 text-sm text-muted">{d}</p><p className="mt-2 text-xs text-muted">Planned. Availability and pricing will be published here when confirmed.</p></div>
          ))}
        </section>
        <section><h2 className="text-lg font-semibold">How advertising works</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted"><li>Every advertisement is reviewed and approved before it runs.</li><li>Sponsored content is always labelled as such.</li><li>Campaigns expire automatically at their end date.</li><li>Advertising never changes a supplier’s verification status.</li></ul></section>
        <Link className="btn-primary" href="/contact">Ask about advertising</Link>
      </div>
    </>
  );
}
