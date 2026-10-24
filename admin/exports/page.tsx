import { PageTitle, Section } from '@/components/dash/kit';
export default function Exports() {
  return (<div className="space-y-5"><PageTitle title="Exports" /><Section title="Vendor list (CSV)"><p className="text-sm text-muted">Company, type, location, email-verified flag, registration date and acquisition source. No contact details, documents or secrets. Each export is written to the audit log.</p><a className="btn-primary mt-3" href="/api/admin/export/vendors.csv" download>Download vendors.csv</a></Section></div>);
}
