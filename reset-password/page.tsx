import { Suspense } from 'react';
import { ResetForm } from '@/components/auth/forms';
import { meta } from '@/lib/seo';
export const metadata = meta('Reset password', 'Reset password on MSUKASHA.', '/reset-password', { noindex: true });
export default function Page() { return <Suspense fallback={<div className="container-x py-16 text-center text-muted">Loading…</div>}><ResetForm /></Suspense>; }
