export default function CampgroundsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 animate-pulse">
      <div className="h-8 w-56 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-40 rounded bg-slate-200" />

      <div className="mt-6 h-64 rounded-xl bg-slate-200" />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 rounded-xl bg-slate-200" />
        ))}
      </div>
    </div>
  );
}
