import type { Metadata } from "next";
import Link from "next/link";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "NurseVerify",
  description: "Nurse disciplinary records search and API for safer healthcare hiring."
};

const navItems = [
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "API Docs" },
  { href: "/contact", label: "Contact" },
  { href: "/dashboard", label: "Dashboard" }
];

function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-950 antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <Link href="/" className="focus-ring flex items-center gap-3 rounded-md">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-700 text-sm font-bold text-white">
                  NV
                </span>
                <span className="text-base font-semibold tracking-normal">NurseVerify</span>
              </Link>
              <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="focus-ring rounded-md hover:text-slate-950">
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-3">
                <Link className="focus-ring rounded-md px-3 py-2 text-sm font-semibold text-slate-700" href="/sign-in">
                  Log in
                </Link>
                <Link
                  href="/sign-up"
                  className="focus-ring rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800"
                >
                  Start free
                </Link>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <p>&copy; 2026 NurseVerify. Public-source disciplinary records search.</p>
              <div className="flex flex-wrap gap-5">
                <Link className="focus-ring rounded-md hover:text-slate-950" href="/privacy">
                  Privacy
                </Link>
                <Link className="focus-ring rounded-md hover:text-slate-950" href="/terms">
                  Terms
                </Link>
                <Link className="focus-ring rounded-md hover:text-slate-950" href="/contact">
                  Contact
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <AppShell>{children}</AppShell>;
  }

  return (
    <ClerkProvider>
      <AppShell>{children}</AppShell>
    </ClerkProvider>
  );
}
