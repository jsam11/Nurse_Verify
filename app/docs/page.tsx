const responseExample = `{
  "results": [
    {
      "recordId": "NV-SOURCE-123",
      "fullName": "Jane Example",
      "state": "PA",
      "licenseType": "RN",
      "sanctionType": "SUSPENSION",
      "effectiveDate": "2024-02-12",
      "sourceUrl": "https://official-board-source.gov/...",
      "lastRefreshed": "2026-07-09"
    }
  ]
}`;

export default function DocsPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">API Docs</p>
      <h1 className="mt-3 text-4xl font-bold tracking-normal text-slate-950">Search nurse disciplinary records by API.</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        Create an API key from the dashboard, then call the search endpoint with a nurse name and optional filters. Each
        successful request counts as one search.
      </p>

      <div className="mt-10 space-y-8">
        <article className="border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Authentication</h2>
          <pre className="mt-4 overflow-x-auto bg-slate-950 p-4 text-sm text-slate-50">
            <code>{`Authorization: Bearer nv_live_your_api_key`}</code>
          </pre>
        </article>

        <article className="border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Search</h2>
          <pre className="mt-4 overflow-x-auto bg-slate-950 p-4 text-sm text-slate-50">
            <code>{`POST /api/search
Content-Type: application/json

{
  "fullName": "Jordan Smith",
  "state": "PA",
  "hospitalSystem": "Keystone Health Network"
}`}</code>
          </pre>
        </article>

        <article className="border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Response</h2>
          <pre className="mt-4 overflow-x-auto bg-slate-950 p-4 text-sm text-slate-50">
            <code>{responseExample}</code>
          </pre>
        </article>
      </div>
    </section>
  );
}
