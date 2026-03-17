const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  const records = await prisma.patientRecord.findMany({
    where: {
      OR: [
        { fileUrl: '#' },
        { fileUrl: '' }
      ]
    }
  });

  console.log(`Found ${records.length} broken records.`);

  for (const record of records) {
    if (record.title.startsWith('Pharmacy Bill - ')) {
      const billCode = record.title.replace('Pharmacy Bill - ', '').trim();
      if (billCode) {
        await prisma.patientRecord.update({
          where: { id: record.id },
          data: { fileUrl: `/billing?search=${billCode}` }
        });
        console.log(`Fixed ${record.id}: ${record.title} -> /billing?search=${billCode}`);
      }
    }
  }
}

fix().then(() => {
  console.log('Cleanup complete.');
  process.exit();
}).catch(e => {
  console.error(e);
  process.exit(1);
});
