const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPatient() {
  const patient = await prisma.patient.findFirst({
    where: { patientCode: 'NXR-2026-81789' },
    include: { records: true }
  });
  console.log('Patient:', patient ? patient.firstName : 'NOT FOUND');
  if (patient) {
    console.log('Records:', JSON.stringify(patient.records.map(r => ({ id: r.id, title: r.title, url: r.fileUrl })), null, 2));
  }
  process.exit();
}

checkPatient();
