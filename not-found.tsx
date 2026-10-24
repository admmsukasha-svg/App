import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="text-sm font-semibold text-brand-dark">404</p>
      <h1 className="mt-2 text-3xl font-bold">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-muted">The page may have been moved, unpublished or never existed.</p>
      <div className="mt-6 flex justify-center gap-3"><Link className="btn-primary" href="/">Go to homepage</Link><Link className="btn-outline" href="/products">Browse products</Link></div>
    </div>
  );
}
