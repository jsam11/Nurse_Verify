"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Copy, CreditCard, KeyRound, RefreshCw, Search } from "lucide-react";
import { StateMap } from "@/components/StateMap";
import { formatDate, titleCaseEnum } from "@/lib/format";
import { states } from "@/lib/states";
import type { DashboardUsage, NurseRecord, SearchHistoryItem } from "@/lib/types";

type ApiKeySummary = {
  id: string;
  prefix: string;
  label: string;
  createdAt: string;
  lastUsedAt: string | null;
};

type DashboardClientProps = {
  initialEmail: string;
};

type DashboardState = {
  usage: DashboardUsage;
  apiKeys: ApiKeySummary[];
  history: SearchHistoryItem[];
};

const emptyUsage: DashboardUsage = {
  usedThisMonth: 0,
  monthlySearchLimit: 3,
  paidSearchCredits: 0
};

export function DashboardClient({ initialEmail }: DashboardClientProps) {
  const [dashboard, setDashboard] = useState<DashboardState>({
    usage: emptyUsage,
    apiKeys: [],
    history: []
  });
  const [fullName, setFullName] = useState("Jordan");
  const [state, setState] = useState("");
  const [hospitalSystem, setHospitalSystem] = useState("");
  const [results, setResults] = useState<NurseRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [selectedMapState, setSelectedMapState] = useState<string | null>(null);
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function refreshDashboard() {
    const response = await fetch("/api/dashboard");

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as DashboardState;
    setDashboard(data);
  }

  useEffect(() => {
    let ignore = false;

    fetch("/api/dashboard")
      .then((response) => {
        if (!response.ok) {
          return null;
        }

        return response.json() as Promise<DashboardState>;
      })
      .then((data) => {
        if (!ignore && data) {
          setDashboard(data);
        }
      })
      .catch(() => undefined);

    return () => {
      ignore = true;
    };
  }, []);

  const filteredResults = useMemo(() => {
    return selectedMapState ? results.filter((record) => record.state === selectedMapState) : results;
  }, [results, selectedMapState]);

  const selectedRecord = useMemo(() => {
    return results.find((record) => record.recordId === selectedRecordId) ?? filteredResults[0] ?? null;
  }, [filteredResults, results, selectedRecordId]);

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, state, hospitalSystem })
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error ?? "Search failed.");
      setLoading(false);
      return;
    }

    setResults(data.results);
    setDashboard((current) => ({ ...current, usage: data.usage }));
    setSelectedMapState(null);
    setSelectedRecordId(data.results[0]?.recordId ?? null);
    await refreshDashboard();
    setLoading(false);
  }

  async function createApiKey() {
    setStatus(null);
    const response = await fetch("/api/api-keys", { method: "POST" });
    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error ?? "Unable to create API key.");
      return;
    }

    setCreatedApiKey(data.plainKey);
    setDashboard((current) => ({ ...current, apiKeys: [data.apiKey, ...current.apiKeys] }));
  }

  async function startCheckout() {
    const response = await fetch("/api/billing/checkout", { method: "POST" });
    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    setStatus(data.error ?? "Checkout is not configured yet.");
  }

  const usagePercent = Math.min(100, (dashboard.usage.usedThisMonth / dashboard.usage.monthlySearchLimit) * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-slate-950">Dashboard</h1>
          <p className="mt-2 text-slate-600">Welcome back, {initialEmail}</p>
        </div>
        <button
          type="button"
          onClick={createApiKey}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm hover:border-blue-300"
        >
          <KeyRound className="h-4 w-4" aria-hidden="true" />
          Create API key
        </button>
      </div>

      {status ? <div className="mb-6 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{status}</div> : null}

      {createdApiKey ? (
        <div className="mb-6 border border-blue-200 bg-blue-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-950">New API key created</p>
              <p className="mt-1 break-all font-mono text-xs text-blue-900">{createdApiKey}</p>
            </div>
            <button
              type="button"
              onClick={() => void navigator.clipboard.writeText(createdApiKey)}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              Copy
            </button>
          </div>
        </div>
      ) : null}

      <section className="mb-8 border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-slate-950">Usage this month</h2>
              <button
                type="button"
                onClick={() => void refreshDashboard()}
                className="focus-ring inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-blue-700"
              >
                <RefreshCw className="h-3 w-3" aria-hidden="true" />
                Refresh
              </button>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Free tier includes {dashboard.usage.monthlySearchLimit} searches. Paid credits available:{" "}
              {dashboard.usage.paidSearchCredits}.
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-4xl font-bold text-slate-950">
              {dashboard.usage.usedThisMonth}{" "}
              <span className="text-lg font-medium text-slate-500">/ {dashboard.usage.monthlySearchLimit}</span>
            </p>
            <p className="text-sm text-slate-500">included searches used</p>
          </div>
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full bg-blue-700" style={{ width: `${usagePercent}%` }} />
        </div>
        <button
          type="button"
          onClick={startCheckout}
          className="focus-ring mt-5 inline-flex items-center gap-2 rounded-md border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
        >
          <CreditCard className="h-4 w-4" aria-hidden="true" />
          Buy one search credit
        </button>
      </section>

      <section className="mb-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Quick Search</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Search by nurse name first. State and hospital system filters narrow the match list.
          </p>
          <form onSubmit={handleSearch} className="mt-5 space-y-4">
            <label className="block text-sm font-semibold text-slate-800">
              Full name
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-base font-normal"
                placeholder="e.g. Jordan Lee Smith"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-800">
              State
              <select
                value={state}
                onChange={(event) => setState(event.target.value)}
                className="focus-ring mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-base font-normal"
              >
                <option value="">All paid-access states</option>
                {states.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-800">
              Hospital system
              <input
                value={hospitalSystem}
                onChange={(event) => setHospitalSystem(event.target.value)}
                className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-base font-normal"
                placeholder="Optional"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              {loading ? "Searching" : "Search, uses 1 credit"}
            </button>
          </form>
        </div>

        <div className="border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-950">API Keys</h2>
            <button type="button" onClick={createApiKey} className="focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold">
              Create
            </button>
          </div>
          <div className="mt-5 space-y-3">
            {dashboard.apiKeys.length === 0 ? (
              <p className="text-sm text-slate-600">Create a key when you are ready to call the search API.</p>
            ) : (
              dashboard.apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="border border-slate-200 bg-slate-50 p-3">
                  <p className="font-mono text-sm font-semibold text-slate-950">{apiKey.prefix}</p>
                  <p className="mt-1 text-xs text-slate-500">Created {new Date(apiKey.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>

          <h2 className="mt-8 text-xl font-semibold text-slate-950">Search History</h2>
          <div className="mt-5 space-y-3">
            {dashboard.history.length === 0 ? (
              <p className="text-sm text-slate-600">Your 5 most recent searches will appear here.</p>
            ) : (
              dashboard.history.map((item) => (
                <div key={item.id} className="border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-950">{item.query}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.state ?? "All states"} · {item.resultCount} results · {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {results.length > 0 ? (
        <section className="grid gap-6 border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[0.9fr_1fr]">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Results</h2>
            <p className="mt-1 text-sm text-slate-600">
              {filteredResults.length} results for {fullName}
            </p>
            <div className="mt-5 space-y-3">
              {filteredResults.map((record) => (
                <button
                  key={record.recordId}
                  type="button"
                  onClick={() => setSelectedRecordId(record.recordId)}
                  className={`focus-ring block w-full border p-4 text-left shadow-sm ${
                    selectedRecord?.recordId === record.recordId ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"
                  }`}
                >
                  <p className="font-semibold text-slate-950">{record.fullName}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {record.state} · {titleCaseEnum(record.sanctionType)} · {formatDate(record.effectiveDate)}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">{record.employerOrFacility ?? "Facility unavailable"}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <StateMap states={results.map((record) => record.state)} selectedState={selectedMapState} onSelectState={setSelectedMapState} />
            {selectedRecord ? (
              <div className="border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-semibold text-slate-950">{selectedRecord.fullName}</h3>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-slate-500">License</dt>
                    <dd className="font-medium text-slate-950">
                      {selectedRecord.licenseType} · {selectedRecord.licenseNumber ?? "Unavailable"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Discipline</dt>
                    <dd className="font-medium text-slate-950">{titleCaseEnum(selectedRecord.sanctionType)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Hospital system</dt>
                    <dd className="font-medium text-slate-950">{selectedRecord.hospitalSystem ?? "Unavailable"}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Last refreshed</dt>
                    <dd className="font-medium text-slate-950">{selectedRecord.lastRefreshed}</dd>
                  </div>
                </dl>
                <p className="mt-4 text-sm leading-6 text-slate-700">{selectedRecord.reason}</p>
                <a
                  href={selectedRecord.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring mt-5 inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                >
                  View official source
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
