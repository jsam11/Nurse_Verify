import { PrismaClient } from "@prisma/client";
import { allSeedRecords } from "../data/seed-records";

const prisma = new PrismaClient();

async function main() {
  for (const record of allSeedRecords) {
    await prisma.nurseRecord.upsert({
      where: { recordId: record.recordId },
      update: record,
      create: record
    });
  }

  console.log(`Seeded ${allSeedRecords.length} nurse records.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
