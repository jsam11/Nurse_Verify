import { allSeedRecords } from "@/data/seed-records";
import type { SearchRecordsInput } from "@/lib/search";

export function searchPreviewRecords(input: SearchRecordsInput) {
  const query = input.fullName.trim().toLowerCase();
  const selectedState = input.state?.trim().toUpperCase();
  const hospitalSystem = input.hospitalSystem?.trim().toLowerCase();

  return allSeedRecords.filter((record) => {
    const nameMatch = query ? record.fullName.toLowerCase().includes(query) : true;
    const stateMatch = selectedState ? record.state === selectedState : true;
    const systemMatch = hospitalSystem ? record.hospitalSystem?.toLowerCase().includes(hospitalSystem) : true;

    return nameMatch && stateMatch && systemMatch;
  });
}
