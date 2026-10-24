'use client';
import { useState, type FormEvent } from 'react';
import { api } from '@/lib/api';
import { Badge, Field, Notice } from '@/components/ui';
import { Err, Loading, PageTitle, Section, fmtDate, errMsg, useLoad } from '@/components/dash/kit';
export default function AdminReferrals() {
  const list = useLoad(() => api<{ referrals: any[] }>('/admin/referrals'), []);
  const prog = useLoad(() => api<{ program: any }>('/admin/settings/referral'), []);
  const [p, setP] = useState<any>(null); const [msg, setMsg] = useState<{ k: 'ok' | 'error'; t: string } | null>(null);
  const cur = p || prog.data?.program || { enabled: false, description: '', rewardType: 'none' };
  async function save(e: FormEvent) { e.preventDefault(); try { await api('/admin/settings/referral', { method: 'PUT', body: cur }); setMsg({ k: 'ok', t: 'Saved.' }); } catch (x) { setMsg({ k: 'error', t: errMsg(x) }); } }
  async function reward(id: string, s: string) { try { await api(`/admin/referrals/${id}`, { method: 'PATCH', body: { rewardStatus: s } }); list.reload(); } catch (x) { setMsg({ k: 'error', t: errMsg(x) }); } }
  return (<div className="space-y-6"><PageTitle title="Referral programme" />{msg && <Notice kind={msg.k}>{msg.t}</Notice>}<Err error={list.error || prog.error} />
    <Section title="Programme settings"><form onSubmit={save} className="space-y-4"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!cur.enabled} onChange={(e) => setP({ ...cur, enabled: e.target.checked })} />Programme enabled (shown to users)</label>
      <Field label="Reward type" htmlFor="rt"><select id="rt" className="input max-w-xs" value={cur.rewardType || 'none'} onChange={(e) => setP({ ...cur, rewardType: e.target.value })}>{['none', 'feature', 'credit', 'cash'].map((x) => <option key={x}>{x}</option>)}</select></Field>
      {cur.rewardType === 'cash' && <Notice kind="warn">Do not promise cash rewards unless funding and terms have been approved and published.</Notice>}
      <Field label="Public description" htmlFor="rd"><textarea id="rd" maxLength={500} className="input min-h-20" value={cur.description || ''} onChange={(e) => setP({ ...cur, description: e.target.value })} /></Field><button className="btn-primary">Save</button></form></Section>
    <Section title="Referrals">{list.loading ? <Loading /> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead><tr className="border-b border-line text-left text-muted"><th className="py-2">Referrer</th><th>Referred</th><th>Registered</th><th>Verified</th><th>Activated</th><th>Eligible</th><th>Reward</th><th /></tr></thead><tbody>{list.data?.referrals.map((r) => (
      <tr key={r.id} className="border-b border-line"><td className="py-2">{r.referrer?.name}</td><td>{r.referred?.name}</td><td>{fmtDate(r.registeredAt)}</td><td>{r.emailVerifiedAt ? 'Email' : '—'}{r.businessVerifiedAt ? ' + business' : ''}</td><td>{r.activatedAt ? fmtDate(r.activatedAt) : '—'}</td><td>{r.eligible ? <Badge tone="green">yes</Badge> : <Badge tone="red">{r.ineligibleReason || 'no'}</Badge>}</td><td>{r.rewardStatus}</td>
        <td className="space-x-1 whitespace-nowrap">{r.eligible && r.activatedAt && r.rewardStatus !== 'granted' && <button className="btn-outline" onClick={() => confirm('Mark reward granted?') && reward(r.id, 'granted')}>Grant</button>}{r.rewardStatus !== 'denied' && <button className="btn-outline" onClick={() => reward(r.id, 'denied')}>Deny</button>}</td></tr>))}</tbody></table></div>}</Section></div>);
}
