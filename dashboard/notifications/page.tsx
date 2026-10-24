'use client';
import Link from 'next/link';
import { api } from '@/lib/api';
import { EmptyState } from '@/components/ui';
import { Err, Loading, PageTitle, fmtDate, useLoad } from '@/components/dash/kit';
export default function Notifications() {
  const { data, error, loading, reload } = useLoad(() => api<{ notifications: any[]; unread: number }>('/notifications'), []);
  const markAll = async () => { await api('/notifications/read', { body: {} }); reload(); };
  return (<div className="space-y-5"><PageTitle title="Notifications" actions={data?.unread ? <button className="btn-outline" onClick={markAll}>Mark all read ({data.unread})</button> : undefined} /><Err error={error} />
    {loading ? <Loading /> : !data?.notifications.length ? <EmptyState title="No notifications" /> : <ul className="card divide-y divide-line">{data.notifications.map((n) => (
      <li key={n.id} className={`p-4 ${n.readAt ? '' : 'bg-brand-soft/50'}`}><div className="flex justify-between gap-3"><p className="font-medium">{n.link ? <Link className="hover:underline" href={n.link} onClick={() => api('/notifications/read', { body: { ids: [n.id] } })}>{n.title}</Link> : n.title}</p><span className="text-xs text-muted">{fmtDate(n.createdAt)}</span></div>{n.body && <p className="text-sm text-muted">{n.body}</p>}</li>))}</ul>}</div>);
}
