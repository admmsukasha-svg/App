'use client';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Badge, EmptyState } from '@/components/ui';
import { Err, Loading, PageTitle, fmtDate, useLoad } from '@/components/dash/kit';
export default function Messages() {
  const { user } = useAuth();
  const { data, error, loading } = useLoad(() => api<{ conversations: any[] }>('/conversations'), []);
  return (<div className="space-y-5"><PageTitle title="Messages" sub="Conversations are linked to a real product, supplier, request or listing." /><Err error={error} />
    {loading ? <Loading /> : !data?.conversations.length ? <EmptyState title="No conversations yet">Send an inquiry from a product or supplier page to start one.</EmptyState> : (
      <div className="card divide-y divide-line">{data.conversations.map((c) => { const other = c.participants.find((p: any) => p.id !== user?.id); return (
        <Link key={c.id} href={`/dashboard/messages/${c.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-surface">
          <div className="min-w-0"><p className="font-medium">{other?.companyName || other?.name || 'User'} <span className="text-sm font-normal text-muted">· {c.subject}</span></p><p className="truncate text-sm text-muted">{c.lastMessageText}</p></div>
          <div className="flex shrink-0 items-center gap-2 text-xs text-muted">{c.blocked && <Badge tone="red">Blocked</Badge>}{c.unread > 0 && <Badge tone="orange">{c.unread} new</Badge>}{fmtDate(c.lastMessageAt)}</div></Link>); })}</div>)}</div>);
}
