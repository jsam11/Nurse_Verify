import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentAccount } from "@/lib/account";
import { createPlainApiKey, getApiKeyPrefix, hashApiKey } from "@/lib/api-keys";
import { prisma } from "@/lib/prisma";
import { hasClerkConfig, hasDatabaseConfig, previewEmailCookie } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!hasClerkConfig() || !hasDatabaseConfig()) {
    const cookieStore = await cookies();
    const email = cookieStore.get(previewEmailCookie)?.value;

    if (!email) {
      return NextResponse.json({ error: "Preview login required." }, { status: 401 });
    }

    const plainKey = `nv_test_${crypto.randomUUID().replaceAll("-", "")}`;

    return NextResponse.json({
      apiKey: {
        id: crypto.randomUUID(),
        prefix: `${plainKey.slice(0, 10)}...${plainKey.slice(-4)}`,
        label: "Preview key",
        createdAt: new Date().toISOString(),
        lastUsedAt: null
      },
      plainKey
    });
  }

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
