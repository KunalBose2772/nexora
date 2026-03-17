const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    console.error('No tenant found');
    return;
  }
  console.log('TENANT_ID=' + tenant.id);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
