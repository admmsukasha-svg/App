'use client';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Notice, VerificationBadges, Badge } from '@/components/ui';
import { Err, Loading, PageTitle, Section, useLoad } from '@/components/dash/kit';

function Stat({ label, value, href }: { label: string; value: number | string; href?: string }) {
  const inner = <div className="card p-4"><p className="text-2xl font-bold">{value}</p><p className="text-sm text-muted">{label}</p></div>;
  return href ? <Link href={href} className="block hover:opacity-90">{inner}</Link> : inner;
}

export default function Overview() {
  const { user } = useAuth();
  const isSupplier = user?.role === 'seller' || user?.role === 'admin';
  const sup = useLoad(() => (isSupplier ? api<any>('/dashboard/supplier') : Promise.resolve(null)), [isSupplier]);
  const buy = useLoad(() => api<any>('/dashboard/buyer'), []);
  const s = sup.data, b = buy.data;
  return (
    <div className="space-y-6">
      <PageTitle title={`Welcome${user ? `, ${user.name.split(' ')[0]}` : ''}`} sub="Everything shown here comes from your real account activity." />
      <Err error={sup.error || buy.error} />
      {(sup.loading || buy.loading) && <Loading />}
      {!isSupplier && (
        <Notice>Want to sell on MSUKASHA? <Link className="font-semibold underline" href="/dashboard/onboarding">Create your free business profile</Link>.</Notice>
      )}
      {s && (
        <>
          {s.nextActions.length > 0 && (
            <Section title="Next steps"><ul className="space-y-2">{s.nextActions.map((a: any) => <li key={a.key} className="flex flex-wrap items-center justify-between gap-2 text-sm"><span>{a.text}</span><Link className="btn-outline" href={a.href}>Open</Link></li>)}</ul></Section>
          )}
          <Section title="Business profile">
            <div className="mb-2 flex items-center justify-between text-sm"><span>Profile completion</span><b>{s.profileCompletion.percent}%</b></div>
            <div className="h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={s.profileCompletion.percent} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completion"><div className="h-full bg-brand" style={{ width: `${s.profileCompletion.percent}%` }} /></div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm"><span>Store:</span><Badge tone={s.storeStatus === 'published' ? 'green' : 'gray'}>{s.storeStatus}</Badge><span>Verification:</span><VerificationBadges levels={s.verificationLevels} /></div>
          </Section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Products (all)" value={s.products.total} href="/dashboard/products" />
            <Stat label="Published products" value={s.products.byStatus.active || 0} href="/dashboard/products" />
            <Stat label="Awaiting review" value={s.products.byStatus.pending_review || 0} href="/dashboard/products" />
            <Stat label="Product page views" value={s.productViews} />
            <Stat label="Requests available to you" value={s.rfqsAvailable} href="/dashboard/rfqs" />
            <Stat label="Quotations sent" value={s.quotationsSent} href="/dashboard/rfqs" />
            <Stat label="Quotations accepted" value={s.quotationsAccepted} />
            <Stat label="Unread messages" value={s.unreadMessages} href="/dashboard/messages" />
          </div>
        </>
      )}
      {b && (
        <Section title="As a buyer">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Requests created" value={b.rfqs} href="/dashboard/rfqs" /><Stat label="Open requests" value={b.openRfqs} href="/dashboard/rfqs" />
            <Stat label="Quotations received" value={b.quotationsReceived} href="/dashboard/rfqs" /><Stat label="Saved items" value={b.saved} href="/dashboard/favorites" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2"><Link className="btn-primary" href="/rfq/new">Create a request for quotation</Link><Link className="btn-outline" href="/suppliers">Find suppliers</Link></div>
        </Section>
      )}
    </div>
  );
}
