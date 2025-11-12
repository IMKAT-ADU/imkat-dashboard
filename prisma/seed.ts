import { prisma } from '../lib/prisma';

async function main() {
  // Create test access codes
  const codes = await prisma.accessCode.createMany({
    data: [
      {
        code: '4192',
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Seeded ${codes.count} access code(s)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
