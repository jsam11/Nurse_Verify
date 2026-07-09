import { NextResponse } from "next/server";
import { getCurrentAccount } from "@/lib/account";

export const dynamic = "force-dynamic";

export async function POST() {
  const account = await getCurrentAccount();

  if (!account) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID_PAY_PER_SEARCH;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!secretKey || !priceId) {
    return NextResponse.json(
      {
        error: "Stripe is not configured yet.",
        setup: "Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID_PAY_PER_SEARCH in Vercel."
      },
      { status: 501 }
    );
  }

  const params = new URLSearchParams({
    mode: "payment",
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    customer_email: account.email,
    client_reference_id: account.id,
    "metadata[accountId]": account.id
  });

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  const payload = (await response.json()) as { url?: string; error?: { message?: string } };

  if (!response.ok || !payload.url) {
    return NextResponse.json({ error: payload.error?.message ?? "Unable to create checkout session." }, { status: 502 });
  }

  return NextResponse.json({ url: payload.url });
}
