# NurseVerify

NurseVerify is an API-first micro SaaS for searching publicly available nurse disciplinary records. The product is built for healthcare employers, staffing teams, credentialing groups, and compliance teams that need source-linked records before hiring or placing nurses in patient care settings.

## What is included

- Public marketing site for `nurseverify.io`
- Clerk-based login and signup
- Authenticated dashboard
- 3 included monthly searches
- Pay-per-search credit flow through Stripe Checkout
- API key creation on demand
- Search endpoint that supports dashboard sessions and API keys
- Result list, detail view, official source link, and map filtering
- Prisma schema for nurse records, accounts, API keys, usage, and search history
- Sandbox seed records marked as demo data

## Local commands

```bash
pnpm install
pnpm db:generate
pnpm typecheck
pnpm lint
pnpm build
```

See `docs/deployment.md` for Vercel, Clerk, Stripe, database, and domain setup.
