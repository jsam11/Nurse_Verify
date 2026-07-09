import Link from "next/link";
import { ShieldCheck, Database, Map, KeyRound } from "lucide-react";

const trustPoints = [
  "Board of Nursing disciplinary actions",
  "License type, state, source, and refresh metadata",
  "API-first workflow for credentialing and hiring systems"
];

const features = [
  {
    title: "Search before staffing decisions",
    body: "Find publicly available disciplinary records before a nurse is placed in a hospital, clinic, or care facility.",
    icon: ShieldCheck
  },
  {
    title: "Source-linked evidence",
    body: "Every production record is designed to carry the official source URL, document type, and refresh date.",
    icon: Database
  },
  {
    title: "Map the risk surface",
    body: "See where matching records appear by state, then filter into details without leaving the workflow.",
    icon: Map
  },
  {
    title: "API keys on demand",
    body: "Create an API key when your team is ready to integrate NurseVerify into screening or compliance systems.",
    icon: KeyRound
  }
];

export default function HomePage() {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto grid min-h-[calc(100vh-180px)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-700">nurseverify.io</p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
              Nurse disciplinary records search for safer care.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              NurseVerify helps healthcare employers and compliance teams search public disciplinary records before
              hiring, credentialing, or placing nurses in patient care settings.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="focus-ring rounded-md bg-blue-700 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-800"
              >
                Start with 3 searches
              </Link>
              <Link
                href="/docs"
                className="focus-ring rounded-md border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-950 hover:border-slate-400"
              >
                View API docs
              </Link>
            </div>
          </div>
          <div className="border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <div className="border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Search result preview</p>
                  <p className="mt-1 text-xs text-slate-500">Source-linked disciplinary record</p>
                </div>
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  PA match
                </span>
              </div>
              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-slate-950">Jordan Sample Rivers</p>
                  <p className="mt-1 text-slate-600">Pennsylvania · RN · Suspension · 2024-02-12</p>
                </div>
                <p className="leading-6 text-slate-600">
                  Official source, license metadata, facility context, and last-refresh details stay attached to the
                  record for compliance review.
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {trustPoints.map((point) => (
                    <div key={point} className="border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-700">
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-100 py-10">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <p className="text-3xl font-bold">3</p>
            <p className="mt-1 text-sm text-slate-600">included monthly searches</p>
          </div>
          <div>
            <p className="text-3xl font-bold">50</p>
            <p className="mt-1 text-sm text-slate-600">state-by-state source architecture</p>
          </div>
          <div>
            <p className="text-3xl font-bold">API</p>
            <p className="mt-1 text-sm text-slate-600">built for paid search workflows</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="border border-slate-200 bg-white p-6 shadow-sm">
                <Icon className="h-6 w-6 text-blue-700" aria-hidden="true" />
                <h2 className="mt-5 text-lg font-semibold text-slate-950">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{feature.body}</p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
