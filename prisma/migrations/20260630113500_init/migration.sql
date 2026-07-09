-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('RN', 'LPN', 'APRN', 'CNA', 'CRNA', 'LVN', 'OTHER');

-- CreateEnum
CREATE TYPE "SanctionType" AS ENUM ('REVOCATION', 'SUSPENSION', 'VOLUNTARY_SURRENDER', 'REPRIMAND', 'PROBATION', 'CONSENT_ORDER', 'FINE', 'DENIAL', 'OTHER');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('WEBPAGE', 'PDF', 'DATABASE');

-- CreateTable
CREATE TABLE "NurseRecord" (
  "recordId" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "licenseType" "LicenseType" NOT NULL,
  "licenseNumber" TEXT,
  "sanctionType" "SanctionType" NOT NULL,
  "effectiveDate" TEXT,
  "employerOrFacility" TEXT,
  "hospitalSystem" TEXT,
  "reason" TEXT NOT NULL,
  "sourceUrl" TEXT NOT NULL,
  "sourceType" "SourceType" NOT NULL,
  "sourceTitle" TEXT NOT NULL,
  "lastRefreshed" TEXT NOT NULL,
  "isDemo" BOOLEAN NOT NULL DEFAULT false,

  CONSTRAINT "NurseRecord_pkey" PRIMARY KEY ("recordId")
);

-- CreateTable
CREATE TABLE "UserAccount" (
  "id" TEXT NOT NULL,
  "clerkUserId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "stripeCustomerId" TEXT,
  "monthlySearchLimit" INTEGER NOT NULL DEFAULT 3,
  "paidSearchCredits" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
  "id" TEXT NOT NULL,
  "keyHash" TEXT NOT NULL,
  "prefix" TEXT NOT NULL,
  "label" TEXT NOT NULL DEFAULT 'Default key',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastUsedAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),
  "accountId" TEXT NOT NULL,

  CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchEvent" (
  "id" TEXT NOT NULL,
  "query" TEXT NOT NULL,
  "state" TEXT,
  "hospitalSystem" TEXT,
  "resultCount" INTEGER NOT NULL,
  "chargedCredit" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "accountId" TEXT NOT NULL,

  CONSTRAINT "SearchEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NurseRecord_fullName_idx" ON "NurseRecord"("fullName");

-- CreateIndex
CREATE INDEX "NurseRecord_state_idx" ON "NurseRecord"("state");

-- CreateIndex
CREATE INDEX "NurseRecord_licenseNumber_idx" ON "NurseRecord"("licenseNumber");

-- CreateIndex
CREATE INDEX "NurseRecord_hospitalSystem_idx" ON "NurseRecord"("hospitalSystem");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_clerkUserId_key" ON "UserAccount"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_keyHash_key" ON "ApiKey"("keyHash");

-- CreateIndex
CREATE INDEX "ApiKey_accountId_idx" ON "ApiKey"("accountId");

-- CreateIndex
CREATE INDEX "SearchEvent_accountId_createdAt_idx" ON "SearchEvent"("accountId", "createdAt");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchEvent" ADD CONSTRAINT "SearchEvent_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
