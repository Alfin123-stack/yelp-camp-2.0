export default function Loading() {
  return (
    <div className="bg-cream-50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-forest-100" />
          <div className="h-9 w-64 animate-pulse rounded bg-forest-100" />
          <div className="h-4 w-40 animate-pulse rounded bg-forest-100" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-forest-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
