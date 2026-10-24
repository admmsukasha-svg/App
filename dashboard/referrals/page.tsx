'use client';
import { api } from '@/lib/api';
import { Badge, Notice } from '@/components/ui';
import { Err, Loading, PageTitle, Section, fmtDate, useLoad } from '@/components/dash/kit';
export default function Referrals() {
  const { data, error, loading } = useLoad(() => api<any>('/referrals/me'), []);
  if (loading) return <Loading />;
  return (<div className="space-y-6"><PageTitle title="Referrals" sub="Invite genuine businesses. Fake accounts, self-referrals and duplicates are not eligible." /><Err error={error} />
    {data && (<>
      <Section title="Your referral link"><p className="text-sm">Code: <b className="font-mono">{data.code}</b></p><input readOnly aria-label="Referral link" className="input mt-2" value={data.shareLink} onFocus={(e) => e.currentTarget.select()} /></Section>
      <Notice kind={data.program.enabled ? 'info' : 'warn'}>{data.program.enabled ? data.program.description || 'A referral programme is active.' : 'No referral reward is currently offered. Referrals are still tracked.'}</Notice>
      <Section title={`Referred accounts (${data.referrals.length})`}>{!data.referrals.length ? <p className="text-sm text-muted">No referrals yet.</p> : (
        <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-sm"><thead><tr className="border-b border-line text-left text-muted"><th className="py-2">Registered</th><th>Email verified</th><th>Business verified</th><th>Activated</th><th>Eligible</th></tr></thead><tbody>{data.referrals.map((r: any, i: number) => (
          <tr key={i} className="border-b border-line"><td className="py-2">{fmtDate(r.registeredAt)}</td><td>{r.emailVerified ? 'Yes' : 'No'}</td><td>{r.businessVerified ? 'Yes' : 'No'}</td><td>{r.activated ? 'Yes' : 'No'}</td><td><Badge tone={r.eligible ? 'green' : 'gray'}>{r.eligible ? 'Eligible' : 'Not eligible'}</Badge></td></tr>))}</tbody></table></div>)}</Section></>)}</div>);
}
