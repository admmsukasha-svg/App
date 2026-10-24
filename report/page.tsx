import { meta } from '@/lib/seo';
import { PageHeader } from '@/components/ui';
import ReportForm from '@/components/public/ReportForm';
import { first, type SP } from '@/components/public/helpers';
export const metadata = meta('Report a listing or supplier', 'Report suspicious, counterfeit, misleading or prohibited listings and businesses on MSUKASHA.', '/report', { noindex: true });
export default async function Report({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  return (<><PageHeader title="Reporting and complaints" subtitle="Tell us about suspicious sellers, counterfeit claims, prohibited products or misleading descriptions." />
    <div className="container-x max-w-2xl py-10"><ReportForm type={first(sp, 'type')} id={first(sp, 'id')} /></div></>);
}
