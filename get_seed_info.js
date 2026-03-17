const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.findFirst();
  const patients = await prisma.patient.findMany({ take: 5 });
  console.log('DATA_START');
  console.log(JSON.stringify({ tenant, patients }));
  console.log('DATA_END');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
