export default function Loading() {
  return (
    <div className="container-x py-10" aria-busy="true" aria-label="Loading">
      <div className="skeleton h-8 w-64" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-56" />)}</div>
    </div>
  );
}
