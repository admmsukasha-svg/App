import { Suspense } from 'react';
import { RegisterForm } from '@/components/auth/forms';
import { meta } from '@/lib/seo';
export const metadata = meta('Join MSUKASHA', 'Join MSUKASHA on MSUKASHA.', '/register', { noindex: true });
export default function Page() { return <Suspense fallback={<div className="container-x py-16 text-center text-muted">Loading…</div>}><RegisterForm /></Suspense>; }
