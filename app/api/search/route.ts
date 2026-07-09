import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCurrentAccount, getUsage } from "@/lib/account";
import { hashApiKey } from "@/lib/api-keys";
import { prisma } from "@/lib/prisma";
import { searchRecords } from "@/lib/search";

export const dynamic = "force-dynamic";

type SearchRequest = {
  fullName?: unknown;
  state?: unknown;
  hospitalSystem?: unknown;
};

async function getAccountFromApiKey(request: Request) {
  const authorization = request.headers.get("authorization");
  const rawKey = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length).trim() : null;

  if (!rawKey) {
    return null;
  }

  const apiKey = await prisma.apiKey.findFirst({
    where: {
      keyHash: hashApiKey(rawKey),
      revokedAt: null
    },
    include: { account: true }
  });

  if (!apiKey) {
    return null;
  }

  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() }
  });

  return apiKey.account;
}

async function resolveAccount(request: Request) {
  const apiAccount = await getAccountFromApiKey(request);

  if (apiAccount) {
    return apiAccount;
  }

  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return getCurrentAccount();
}

export async function POST(request: Request) {
  const account = await resolveAccount(request);

  if (!account) {
    return NextResponse.json({ error: "Authentication or API key required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as SearchRequest;
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const state = typeof body.state === "string" && body.state.length > 0 ? body.state : undefined;
  const hospitalSystem =
    typeof body.hospitalSystem === "string" && body.hospitalSystem.length > 0 ? body.hospitalSystem : undefined;

  if (fullName.length < 2) {
    return NextResponse.json({ error: "Enter at least two characters of a nurse name." }, { status: 400 });
  }

  const usage = await getUsage(account.id);
  const includedSearchAvailable = usage.usedThisMonth < usage.monthlySearchLimit;
  const paidCreditAvailable = usage.paidSearchCredits > 0;

  if (!includedSearchAvailable && !paidCreditAvailable) {
    return NextResponse.json(
      {
        error: "Monthly search allowance used.",
        usage,
        checkoutRequired: true
      },
      { status: 402 }
    );
  }

  const results = await searchRecords({ fullName, state, hospitalSystem });

  await prisma.$transaction([
    prisma.searchEvent.create({
      data: {
        accountId: account.id,
        query: fullName,
        state: state?.toUpperCase(),
        hospitalSystem,
        resultCount: results.length,
        chargedCredit: !includedSearchAvailable
      }
    }),
    ...(includedSearchAvailable
      ? []
      : [
          prisma.userAccount.update({
            where: { id: account.id },
            data: { paidSearchCredits: { decrement: 1 } }
          })
        ])
  ]);

  const updatedUsage = await getUsage(account.id);

  return NextResponse.json({ results, usage: updatedUsage });
}
