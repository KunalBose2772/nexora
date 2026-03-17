const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error('No tenant found');

  const patients = await prisma.patient.findMany({ take: 5 });
  if (patients.length < 2) throw new Error('Need more patients for seeding');

  const icuPatients = [
    {
      patientName: 'Vikram Malhotra',
      doctorName: 'Dr. Clinical Lead',
      patientId: patients[0].id,
      type: 'IPD',
      status: 'Admitted',
      ward: 'Medical ICU',
      bed: 'MICU-04',
      triageLevel: 1,
      triageVitals: JSON.stringify({ hr: 118, bp: '155/98', spo2: 89, temp: '39.1' }),
      apptCode: 'ICU-' + Math.random().toString(36).substr(2, 6).toUpperCase()
    },
    {
      patientName: 'Ananya Iyer',
      doctorName: 'Dr. Clinical Lead',
      patientId: patients[1].id,
      type: 'IPD',
      status: 'Admitted',
      ward: 'Neuro ICU',
      bed: 'NICU-02',
      triageLevel: 2,
      triageVitals: JSON.stringify({ hr: 88, bp: '132/84', spo2: 96, temp: '37.4' }),
      apptCode: 'ICU-' + Math.random().toString(36).substr(2, 6).toUpperCase()
    },
    {
      patientName: 'Rahul Deshmukh',
      doctorName: 'Dr. Sarah Connor',
      patientId: patients[0].id, // Re-use for testing
      type: 'EMERGENCY',
      status: 'Referred: ICU Central',
      ward: 'Emergency',
      bed: 'ER-TR-01',
      triageLevel: 1,
      triageVitals: JSON.stringify({ hr: 124, bp: '92/58', spo2: 91, temp: '36.5' }),
      apptCode: 'ER-' + Math.random().toString(36).substr(2, 6).toUpperCase()
    }
  ];

  for (const p of icuPatients) {
    await prisma.appointment.create({
      data: {
        ...p,
        tenantId: tenant.id,
        date: new Date().toISOString().split('T')[0],
        time: 'Now'
      }
    });
    console.log(`Created ICU record for ${p.patientName}`);
  }
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
