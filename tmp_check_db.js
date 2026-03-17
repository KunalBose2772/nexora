const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const p = await prisma.appointment.findFirst({
    where: { apptCode: 'IPD-8481' },
    include: { patient: true }
  });
  console.log('Record:', p.patientId ? `LINKED to ${p.patient.patientCode}` : 'UNLINKED');
  process.exit();
}

check();
