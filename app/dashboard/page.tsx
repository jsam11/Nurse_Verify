import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { DashboardClient } from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const email = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? "your account";

  return <DashboardClient initialEmail={email} />;
}
