import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentAccount, getUsage } from "@/lib/account";
import { prisma } from "@/lib/prisma";
import { hasClerkConfig, hasDatabaseConfig, previewEmailCookie } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasClerkConfig() || !hasDatabaseConfig()) {
    const cookieStore = await cookies();
    const email = cookieStore.get(previewEmailCookie)?.value;

    if (!email) {
      return NextResponse.json({ error: "Preview login required." }, { status: 401 });
    }

    return NextResponse.json({
      account: { email },
      usage: { usedThisMonth: 0, monthlySearchLimit: 3, paidSearchCredits: 0 },
      apiKeys: [],
      history: []
    });
  }

  const account = await getCurrentAccount();

  if (!account) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const [usage, apiKeys, history] = await Promise.all([
    getUsage(account.id),
    prisma.apiKey.findMany({
      where: { accountId: account.id, revokedAt: null },
      orderBy: { createdAt: "desc" },
      select: { id: true, prefix: true, label: true, createdAt: true, lastUsedAt: true }
    }),
    prisma.searchEvent.findMany({
      where: { accountId: account.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        query: true,
        state: true,
        hospitalSystem: true,
        resultCount: true,
        chargedCredit: true,
        createdAt: true
      }
    })
  ]);

  return NextResponse.json({
    account: {
      email: account.email
    },
    usage,
    apiKeys: apiKeys.map((key) => ({
      ...key,
      createdAt: key.createdAt.toISOString(),
      lastUsedAt: key.lastUsedAt?.toISOString() ?? null
    })),
    history: history.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString()
    }))
  });
}
