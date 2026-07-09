import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentAccount() {
  const user = await currentUser();

  if (!user?.id) {
    return null;
  }

  const email = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? "unknown@example.com";

  return prisma.userAccount.upsert({
    where: { clerkUserId: user.id },
    update: { email },
    create: {
      clerkUserId: user.id,
      email
    }
  });
}

export function getMonthStart() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export async function getUsage(accountId: string) {
  const account = await prisma.userAccount.findUniqueOrThrow({
    where: { id: accountId },
    select: { monthlySearchLimit: true, paidSearchCredits: true }
  });

  const usedThisMonth = await prisma.searchEvent.count({
    where: {
      accountId,
      createdAt: {
        gte: getMonthStart()
      }
    }
  });

  return {
    usedThisMonth,
    monthlySearchLimit: account.monthlySearchLimit,
    paidSearchCredits: account.paidSearchCredits
  };
}
