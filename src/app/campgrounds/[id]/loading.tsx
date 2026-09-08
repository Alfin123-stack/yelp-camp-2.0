export default function CampgroundShowLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="w-full">
          <div className="h-8 w-72 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-48 rounded bg-slate-200" />
        </div>
        <div className="h-7 w-24 shrink-0 rounded-full bg-slate-200" />
      </div>

      <div className="mt-6 h-80 rounded-xl bg-slate-200" />

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div className="h-40 rounded-xl bg-slate-200" />
        <div className="h-64 rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}
