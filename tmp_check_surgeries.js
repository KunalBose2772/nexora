const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const count = await prisma.appointment.count({ where: { type: 'Surgery' } });
  console.log('Surgery-type Appointment Count:', count);
  const surgeries = await prisma.appointment.findMany({
    where: { type: 'Surgery' },
    take: 5
  });
  console.log('Surgeries:', JSON.stringify(surgeries, null, 2));
  process.exit();
}

check();
