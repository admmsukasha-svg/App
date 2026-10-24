'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui';
import { Err, Loading, PageTitle, fmtDate, errMsg, useLoad } from '@/components/dash/kit';
const STAFF = ['super_admin', 'moderator', 'verification_reviewer', 'support_agent'];
export default function Users() {
  const [q, setQ] = useState(''); const [applied, setApplied] = useState(''); const [page, setPage] = useState(1); const [err, setErr] = useState('');
  const { data, error, loading, reload } = useLoad(() => api<any>(`/admin/users?page=${page}&q=${encodeURIComponent(applied)}`), [applied, page]);
  async function toggle(u: any) { const reason = u.isActive ? prompt('Reason for suspending this account:') || '' : ''; if (u.isActive && !reason.trim()) return; setErr(''); try { await api(`/admin/users/${u.id}/status`, { method: 'PATCH', body: { isActive: !u.isActive, reason } }); reload(); } catch (e) { setErr(errMsg(e)); } }
  async function roles(u: any) { const v = prompt(`Staff roles for ${u.email} (comma separated from: ${STAFF.join(', ')}; empty removes staff access)`, (u.staffRoles || []).join(', ')); if (v === null) return; const staffRoles = v.split(',').map((s) => s.trim()).filter(Boolean); setErr(''); try { await api(`/admin/users/${u.id}/staff-roles`, { method: 'PUT', body: { staffRoles } }); reload(); } catch (e) { setErr(errMsg(e)); } }
  return (<div className="space-y-5"><PageTitle title="Users and staff" />
    <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setApplied(q); setPage(1); }}><input aria-label="Search users" className="input max-w-sm" placeholder="Name, email or company" value={q} onChange={(e) => setQ(e.target.value)} /><button className="btn-outline">Search</button></form><Err error={error || err} />
    {loading ? <Loading /> : <div className="card overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead><tr className="border-b border-line text-left text-muted"><th className="p-3">User</th><th>Role</th><th>Email</th><th>Joined</th><th>Status</th><th /></tr></thead><tbody>{data?.users.map((u: any) => (
      <tr key={u.id} className="border-b border-line"><td className="p-3"><p className="font-medium">{u.name}</p><p className="text-xs text-muted">{u.email}</p></td><td>{u.role}{u.staffRoles?.length ? ` (${u.staffRoles.join(', ')})` : ''}</td><td>{u.emailVerified ? <Badge tone="green">verified</Badge> : <Badge>unverified</Badge>}</td><td>{fmtDate(u.createdAt)}</td><td>{u.isActive ? 'Active' : <Badge tone="red">Suspended</Badge>}</td>
        <td className="space-x-2 whitespace-nowrap"><button className="btn-outline" onClick={() => toggle(u)}>{u.isActive ? 'Suspend' : 'Reactivate'}</button><button className="btn-outline" onClick={() => roles(u)}>Staff roles</button></td></tr>))}</tbody></table></div>}
    {data && data.pages > 1 && <div className="flex justify-center gap-2"><button className="btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span className="self-center text-sm">Page {page} / {data.pages}</span><button className="btn-outline" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button></div>}
    <p className="text-xs text-muted">Changing staff roles requires super admin. All changes are written to the audit log.</p></div>);
}
