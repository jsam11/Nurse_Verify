import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    detail: "3 searches every month",
    cta: "Start free",
    href: "/sign-up",
    features: ["Name-first disciplinary search", "Source-linked results", "Dashboard history", "API key creation"]
  },
  {
    name: "On Demand",
    price: "Pay per search",
    detail: "For extra checks after the included allowance",
    cta: "Open dashboard",
    href: "/dashboard",
    features: ["Buy search credits as needed", "Use credits in the dashboard or API", "Full details returned", "Map and state filtering"]
  },
  {
    name: "Enterprise",
    price: "Custom",
    detail: "For credentialing, staffing, and screening teams",
    cta: "Contact us",
    href: "/contact",
    features: ["Higher volume search", "Source refresh planning", "Procurement support", "Custom data workflows"]
  }
];

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Pricing</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-slate-950">Start small. Pay when searches matter.</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          NurseVerify includes three monthly searches, then supports pay-per-search credits for teams that need more
          screening capacity.
        </p>
      </div>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {tiers.map((tier) => (
          <article key={tier.name} className="border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">{tier.name}</h2>
            <p className="mt-4 text-3xl font-bold text-slate-950">{tier.price}</p>
            <p className="mt-2 text-sm text-slate-600">{tier.detail}</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {tier.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Link
              href={tier.href}
              className="focus-ring mt-8 inline-flex w-full justify-center rounded-md bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800"
            >
              {tier.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
