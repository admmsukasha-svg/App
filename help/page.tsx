import Link from 'next/link';
import { meta } from '@/lib/seo';
import { PageHeader } from '@/components/ui';
export const metadata = meta('Help Center', 'Answers about accounts, supplier stores, products, requests for quotation, verification and safety on MSUKASHA.', '/help');
const FAQ: [string, string][] = [
  ['Is it free to sell on MSUKASHA?', 'A basic business account and basic store are free, subject to our published Terms of Service. Paid services are shown only when they are actually available.'],
  ['Why is my product not visible?', 'Products must be submitted for review and approved first. Editing the title, description, images or category of a live product sends it back to review. Your email must also be verified.'],
  ['How do I get a verification badge?', 'Badges are shown only for completed checks: email, phone, business documents reviewed, and additional verification. See the Verification Policy.'],
  ['How does a Request for Quotation work?', 'Describe what you need, choose suppliers, and compare the quotations they send. See the RFQ page.'],
  ['Does MSUKASHA protect my payment?', 'No. MSUKASHA does not currently provide escrow, payment protection or guaranteed refunds. Agree terms carefully and report suspicious activity.'],
  ['How do I delete my account or export my data?', 'Open Dashboard → Settings. You can download your data and deactivate your account there.'],
  ['How do I report a listing or supplier?', 'Use the Report button on the listing or supplier page, or the reporting form.']
];
export default function Help() {
  return (
    <>
      <PageHeader title="Help Center" subtitle="Common questions about using MSUKASHA." />
      <div className="container-x max-w-3xl space-y-3 py-10">
        {FAQ.map(([q, a]) => <details key={q} className="card p-4"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-2 text-sm text-muted">{a}</p></details>)}
        <p className="pt-4 text-sm text-muted">Still need help? <Link className="text-brand-dark underline" href="/contact">Contact us</Link> or open a request from your dashboard support page.</p>
      </div>
    </>
  );
}
