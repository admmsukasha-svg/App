import { Suspense } from 'react';
import { ForgotForm } from '@/components/auth/forms';
import { meta } from '@/lib/seo';
export const metadata = meta('Forgot password', 'Forgot password on MSUKASHA.', '/forgot-password', { noindex: true });
export default function Page() { return <Suspense fallback={<div className="container-x py-16 text-center text-muted">Loading…</div>}><ForgotForm /></Suspense>; }
