# Project: Nurse Sanctions Search

## What this is
A web app + REST API that lets healthcare employers and screeners search official
state Board of Nursing disciplinary records (revocations, suspensions, surrenders,
reprimands, consent orders, probation) by a nurse's name and optional state.
Modeled on the structure of teachersanctions.io, adapted for nurses.

## Stack (do not change without asking)
- Next.js (App Router) + React + TypeScript
- Tailwind CSS for styling
- Deployed on Vercel
- Database: Postgres (added in a later phase). Until then, use seed data in /data.

## Conventions
- TypeScript everywhere, no `any` unless unavoidable.
- Keep components small and in /components. Pages in /app.
- Clean, modern, trustworthy visual style: lots of white space, a single accent
  color, clear typography. This is a compliance/trust product, not a flashy one.
- Every search result MUST display its official source link and a "last refreshed"
  date. Never show a record without source attribution.
- All demo/sample data must use OBVIOUSLY FICTIONAL names. Never invent records
  about real people.
- Mobile-responsive.

## Data model: a "SanctionRecord"
- recordId: string
- fullName: string
- state: string (2-letter)
- licenseType: "RN" | "LPN" | "APRN" | "CNA" | "OTHER"
- licenseNumber: string | null
- sanctionType: "REVOCATION" | "SUSPENSION" | "VOLUNTARY_SURRENDER" | "REPRIMAND" | "PROBATION" | "CONSENT_ORDER" | "FINE" | "DENIAL"
- effectiveDate: string | null   (ISO date; null shows "Date unavailable")
- employerOrFacility: string | null
- reason: string
- sourceUrl: string
- sourceType: "WEBPAGE" | "PDF"
- lastRefreshed: string (ISO date)

## Review guidelines
- Flag any code that displays a record without a source link.
- Flag any place where real (non-fictional) personal names are hardcoded.
