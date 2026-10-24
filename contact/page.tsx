import { meta } from '@/lib/seo';
import { PageHeader } from '@/components/ui';
import ContactForm from '@/components/public/ContactForm';
export const metadata = meta('Contact MSUKASHA', 'Contact the MSUKASHA team in Islamabad, Pakistan.', '/contact');
export default function Contact() {
  return (
    <>
      <PageHeader title="Contact us" subtitle="We usually reply by email or WhatsApp message." />
      <div className="container-x grid gap-8 py-10 lg:grid-cols-3">
        <div className="lg:col-span-2"><ContactForm /></div>
        <aside className="card h-fit space-y-3 p-5 text-sm"><h2 className="font-semibold">Business contact</h2>
          <p><span className="text-muted">Email: </span><a className="text-brand-dark hover:underline" href="mailto:info@msukasha.com">info@msukasha.com</a></p>
          <p><span className="text-muted">WhatsApp (messages only, no calls): </span>+92 331 3730953</p>
          <p><span className="text-muted">Location: </span>Islamabad, Pakistan</p>
          <p className="text-xs text-muted">MSUKASHA SMC-PRIVATE LIMITED</p></aside>
      </div>
    </>
  );
}
