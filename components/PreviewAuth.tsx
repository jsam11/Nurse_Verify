import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { previewEmailCookie } from "@/lib/runtime";

async function startPreview(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "preview@nurseverify.io");
  const cookieStore = await cookies();

  cookieStore.set(previewEmailCookie, email, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  redirect("/dashboard");
}

export function PreviewAuth({ mode }: { mode: "sign-in" | "sign-up" }) {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <form action={startPreview} className="w-full max-w-md border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Preview mode</p>
        <h1 className="mt-3 text-2xl font-bold tracking-normal text-slate-950">
          {mode === "sign-up" ? "Start a test account" : "Log in to the test dashboard"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Clerk is not configured on this deployment yet. Use this temporary preview login to test the dashboard,
          searches, map, and API-key flow before production auth is connected.
        </p>
        <label className="mt-5 block text-sm font-semibold text-slate-800">
          Email
          <input
            name="email"
            type="email"
            defaultValue="preview@nurseverify.io"
            className="focus-ring mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-base font-normal"
          />
        </label>
        <button
          type="submit"
          className="focus-ring mt-5 w-full rounded-md bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Continue to dashboard
        </button>
      </form>
    </section>
  );
}
