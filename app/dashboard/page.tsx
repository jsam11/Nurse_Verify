import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import { DashboardClient } from "@/components/DashboardClient";
import { hasClerkConfig, previewEmailCookie } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!hasClerkConfig()) {
    const cookieStore = await cookies();
    const previewEmail = cookieStore.get(previewEmailCookie)?.value;

    if (!previewEmail) {
      redirect("/sign-in");
    }

    return <DashboardClient initialEmail={previewEmail} />;
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const email = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? "your account";

  return <DashboardClient initialEmail={email} />;
}
