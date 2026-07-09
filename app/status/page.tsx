export default function StatusPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-normal text-slate-950">Status</h1>
      <div className="mt-6 rounded border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
        Demo systems operational
      </div>
      <p className="mt-5 text-lg leading-8 text-slate-600">
        This is a placeholder status page for Phase 1. Future versions can show API uptime, ingestion health, source
        refresh status, and incident history.
      </p>
    </section>
  );
}
