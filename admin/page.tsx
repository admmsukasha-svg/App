'use client';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Err, Loading, PageTitle, useLoad } from '@/components/dash/kit';
export default function AdminHome() {
  const { data, error, loading } = useLoad(() => api<Record<string, number>>('/admin/overview'), []);
  const tiles: [string, string, string][] = [['pendingProducts', 'Products awaiting review', '/admin/products'], ['pendingVerifications', 'Verification submissions', '/admin/verifications'], ['openReports', 'Open reports', '/admin/reports'], ['pendingC2c', 'C2C listings to review', '/admin/c2c'], ['openTickets', 'Open support tickets', '/admin/tickets']];
  return (<div className="space-y-6"><PageTitle title="Admin overview" /><Err error={error} />{loading ? <Loading /> : data && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tiles.map(([k, l, h]) => <Link key={k} href={h} className="card p-5 hover:border-brand"><p className="text-3xl font-bold">{data[k]}</p><p className="text-sm text-muted">{l}</p></Link>)}</div>}
    <p className="text-sm text-muted">Tiles for areas your role cannot access may show a permission error when opened.</p></div>);
}
