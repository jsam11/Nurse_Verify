import { NextResponse } from "next/server";
import { getCurrentAccount } from "@/lib/account";
import { createPlainApiKey, getApiKeyPrefix, hashApiKey } from "@/lib/api-keys";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST() {
  const account = await getCurrentAccount();

  if (!account) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const plainKey = createPlainApiKey();
  const apiKey = await prisma.apiKey.create({
    data: {
      accountId: account.id,
      keyHash: hashApiKey(plainKey),
      prefix: getApiKeyPrefix(plainKey)
    },
    select: {
      id: true,
      prefix: true,
      label: true,
      createdAt: true,
      lastUsedAt: true
    }
  });

  return NextResponse.json({
    apiKey: {
      ...apiKey,
      createdAt: apiKey.createdAt.toISOString(),
      lastUsedAt: null
    },
    plainKey
  });
}
