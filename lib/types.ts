export type LicenseType = "RN" | "LPN" | "APRN" | "CNA" | "CRNA" | "LVN" | "OTHER";

export type SanctionType =
  | "REVOCATION"
  | "SUSPENSION"
  | "VOLUNTARY_SURRENDER"
  | "REPRIMAND"
  | "PROBATION"
  | "CONSENT_ORDER"
  | "FINE"
  | "DENIAL"
  | "OTHER";

export type SourceType = "WEBPAGE" | "PDF" | "DATABASE";

export type NurseRecord = {
  recordId: string;
  fullName: string;
  state: string;
  licenseType: LicenseType;
  licenseNumber: string | null;
  sanctionType: SanctionType;
  effectiveDate: string | null;
  employerOrFacility: string | null;
  hospitalSystem: string | null;
  reason: string;
  sourceUrl: string;
  sourceType: SourceType;
  sourceTitle: string;
  lastRefreshed: string;
  isDemo: boolean;
};

export type SearchHistoryItem = {
  id: string;
  query: string;
  state: string | null;
  hospitalSystem: string | null;
  resultCount: number;
  chargedCredit: boolean;
  createdAt: string;
};

export type DashboardUsage = {
  usedThisMonth: number;
  monthlySearchLimit: number;
  paidSearchCredits: number;
};
