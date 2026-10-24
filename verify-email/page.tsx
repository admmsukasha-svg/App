import { Suspense } from 'react';
import { VerifyEmail } from '@/components/auth/forms';
import { meta } from '@/lib/seo';
export const metadata = meta('Verify email', 'Verify email on MSUKASHA.', '/verify-email', { noindex: true });
export default function Page() { return <Suspense fallback={<div className="container-x py-16 text-center text-muted">Loading…</div>}><VerifyEmail /></Suspense>; }
