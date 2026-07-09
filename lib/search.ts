import { prisma } from "@/lib/prisma";
import type { NurseRecord } from "@/lib/types";

export type SearchRecordsInput = {
  fullName: string;
  state?: string;
  hospitalSystem?: string;
};

export async function searchRecords(input: SearchRecordsInput): Promise<NurseRecord[]> {
  const query = input.fullName.trim();
  const selectedState = input.state?.trim().toUpperCase();
  const hospitalSystem = input.hospitalSystem?.trim();

  const records = await prisma.nurseRecord.findMany({
    where: {
      ...(query
        ? {
            fullName: {
              contains: query,
              mode: "insensitive"
            }
          }
        : {}),
      ...(selectedState ? { state: selectedState } : {}),
      ...(hospitalSystem
        ? {
            hospitalSystem: {
              contains: hospitalSystem,
              mode: "insensitive"
            }
          }
        : {})
    },
    orderBy: [{ state: "asc" }, { fullName: "asc" }, { effectiveDate: "desc" }],
    take: 100
  });

  return records.map((record) => ({
    recordId: record.recordId,
    fullName: record.fullName,
    state: record.state,
    licenseType: record.licenseType,
    licenseNumber: record.licenseNumber,
    sanctionType: record.sanctionType,
    effectiveDate: record.effectiveDate,
    employerOrFacility: record.employerOrFacility,
    hospitalSystem: record.hospitalSystem,
    reason: record.reason,
    sourceUrl: record.sourceUrl,
    sourceType: record.sourceType,
    sourceTitle: record.sourceTitle,
    lastRefreshed: record.lastRefreshed,
    isDemo: record.isDemo
  }));
}
