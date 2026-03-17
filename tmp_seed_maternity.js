const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error('No tenant found');

  const patients = await prisma.patient.findMany({ take: 5 });
  if (patients.length < 2) throw new Error('Need more patients in database.');

  // Blood Bank Seeds
  const bloodGroups = ['A+', 'O+', 'B+', 'AB+', 'A-'];
  for (const group of bloodGroups) {
    await prisma.bloodStock.create({
      data: {
        bloodGroup: group,
        component: 'Whole Blood',
        units: Math.floor(Math.random() * 20) + 5,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'Available',
        tenantId: tenant.id
      }
    });
  }

  // Blood Request Seed
  await prisma.bloodRequest.create({
    data: {
      requestCode: 'BR-8821',
      patientId: patients[0].id,
      bloodGroup: 'O+',
      component: 'Whole Blood',
      unitsRequired: 2,
      priority: 'Stat',
      status: 'Pending',
      tenantId: tenant.id
    }
  });

  // Maternity Seeds
  const laborCase = await prisma.laborRecord.create({
    data: {
      patientId: patients[1].id,
      edd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      gravida: 2,
      para: 1,
      living: 1,
      abortion: 0,
      status: 'In-Labor',
      tenantId: tenant.id
    }
  });

  // Partograph Entry
  await prisma.partographEntry.create({
    data: {
      laborRecordId: laborCase.id,
      dilation: 4,
      descent: 0,
      contractions: 2,
      fetalHeartRate: 140,
      maternalPulse: 82,
      bpSys: 120,
      bpDia: 80,
      notes: 'Active phase initiated.',
      tenantId: tenant.id
    }
  });

  console.log('Blood Bank and Maternity seeded successfully.');
  process.exit();
}

seed();
