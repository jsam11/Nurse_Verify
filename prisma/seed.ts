import { PrismaClient } from "@prisma/client";
import { seedRecords } from "../data/seed-records";

const prisma = new PrismaClient();

async function main() {
  for (const record of seedRecords) {
    await prisma.nurseRecord.upsert({
      where: { recordId: record.recordId },
      update: record,
      create: record
    });
  }

  console.log(`Seeded ${seedRecords.length} sandbox nurse records.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
