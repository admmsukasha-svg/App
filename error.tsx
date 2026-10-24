'use client';
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-x py-24 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-3 text-muted">We could not load this page. This is usually temporary.</p>
      <button className="btn-primary mt-6" onClick={reset}>Try again</button>
    </div>
  );
}
