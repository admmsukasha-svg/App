import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import DashShell from '@/components/dash/DashShell';

export const metadata: Metadata = { title: 'Dashboard', robots: { index: false, follow: false } };
export default function DashLayout({ children }: { children: ReactNode }) { return <DashShell>{children}</DashShell>; }
