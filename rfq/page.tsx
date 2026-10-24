import Link from 'next/link';
import { meta } from '@/lib/seo';
import { PageHeader } from '@/components/ui';
export const metadata = meta('Request for Quotation (RFQ)', 'Describe what you need, choose which suppliers receive your request, and compare their quotations on MSUKASHA.', '/rfq');
export default function Rfq() {
  return (
    <>
      <PageHeader title="Request for Quotation" subtitle="Tell suppliers exactly what you need and compare the quotations they send back.">
        <Link className="btn-primary" href="/rfq/new">Create a request</Link>
      </PageHeader>
      <div className="container-x grid gap-6 py-10 lg:grid-cols-2">
        <section className="card p-6"><h2 className="font-semibold">For buyers</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted"><li>Describe the product, specifications, quantity and delivery destination.</li><li>Choose the suppliers who receive it, or make it visible to eligible suppliers.</li><li>Compare unit price, MOQ, lead time, shipping and validity.</li><li>Accept one quotation and agree final terms with the supplier.</li></ol></section>
        <section className="card p-6"><h2 className="font-semibold">For suppliers</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted"><li>Publish your store to receive requests.</li><li>Open a request you were invited to, or an eligible public request.</li><li>Send one quotation with price, MOQ, lead time, shipping and validity.</li><li>Buyer contact details are never shown in the request.</li></ol></section>
      </div>
      <p className="container-x pb-10 text-sm text-muted">MSUKASHA does not process payment for quotations and does not guarantee any deal. Accepting a quotation records the buyer’s choice; delivery and payment are agreed between the parties. A verified email is required to create a request.</p>
    </>
  );
}
