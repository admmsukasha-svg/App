import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/forms';
import { meta } from '@/lib/seo';
export const metadata = meta('Log in', 'Log in on MSUKASHA.', '/login', { noindex: true });
export default function Page() { return <Suspense fallback={<div className="container-x py-16 text-center text-muted">Loading…</div>}><LoginForm /></Suspense>; }
