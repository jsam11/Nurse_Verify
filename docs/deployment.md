# NurseVerify Deployment Notes

## Vercel environment variables

Set these in the Vercel project for Production, Preview, and Development:

- `DATABASE_URL`: Postgres connection string for Neon, Supabase, Vercel Postgres, or another Postgres-compatible database.
- `NEXT_PUBLIC_APP_URL`: Production app URL, for example `https://nurseverify.io`.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key.
- `CLERK_SECRET_KEY`: Clerk secret key.
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: `/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: `/sign-up`
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`: `/dashboard`
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`: `/dashboard`
- `STRIPE_SECRET_KEY`: Stripe secret key.
- `STRIPE_PRICE_ID_PAY_PER_SEARCH`: Stripe Price ID for one paid search credit.
- `STRIPE_WEBHOOK_SECRET`: Signing secret for the Stripe webhook endpoint.

Do not commit database credentials, Clerk secrets, or Stripe secrets.

## Database setup

After `DATABASE_URL` is set, run:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

The seed command loads sandbox records from `data/seed-records.ts`. Production records should be imported only from public official source pages or documents and should preserve source URLs.

## Clerk setup

Create a Clerk application and use email sign-in for the launch flow.

Recommended Clerk settings:

- Sign-in URL: `/sign-in`
- Sign-up URL: `/sign-up`
- After sign-in URL: `/dashboard`
- After sign-up URL: `/dashboard`
- Allowed redirect URLs:
  - `http://localhost:3000/*`
  - `https://nurseverify.io/*`
  - the Vercel preview domain pattern shown in the Vercel project

## Stripe setup

Create a one-time payment product and price for one additional search credit.

Add a webhook endpoint:

```text
https://nurseverify.io/api/stripe/webhook
```

Subscribe it to:

```text
checkout.session.completed
```

When Stripe sends a completed checkout session, the app increments `paidSearchCredits` by 1 for the account.

## Domain setup

Attach `nurseverify.io` to the Vercel project, then add the DNS records Vercel gives you at the domain registrar.
