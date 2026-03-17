const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error('No tenant found');

  const patients = await prisma.patient.findMany({ take: 3 });
  if (patients.length < 2) throw new Error('Need more patients in database for seeding OT.');

  const procedures = [
    { name: 'TKR (Total Knee Replacement)', room: 'OT-1', surgeon: 'Dr. Amitabh', code: 'SUR-8120' },
    { name: 'Laparoscopic Appendectomy', room: 'OT-2', surgeon: 'Dr. Riya Sharma', code: 'SUR-5512' },
    { name: 'Cardiac Bypass (CABG)', room: 'OT-1', surgeon: 'Dr. Vikram Shah', code: 'SUR-1104' }
  ];

  for (let i = 0; i < procedures.length; i++) {
    const p = procedures[i];
    const pt = patients[i % patients.length];

    await prisma.surgery.create({
      data: {
        surgeryCode: p.code,
        patientId: pt.id,
        procedureName: p.name,
        surgeonName: p.surgeon,
        otRoom: p.room,
        status: i === 0 ? 'Ongoing' : 'Scheduled',
        startTime: new Date(),
        tenantId: tenant.id
      }
    });
    console.log(`Seeded Surgery ${p.code} for ${pt.firstName}`);
  }

  process.exit();
}

seed();
