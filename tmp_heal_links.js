const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function heal() {
  console.log('Starting Clinical Linkage Healing...');
  
  try {
    const unlinked = await prisma.appointment.findMany({
      where: {
        patientId: null,
        type: { in: ['IPD', 'EMERGENCY'] }
      }
    });

    console.log(`Found ${unlinked.length} unlinked critical records.`);

    for (const appt of unlinked) {
      if (!appt.patientName) continue;
      
      const nameParts = appt.patientName.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      // Use contains or findFirst with careful matching
      const matches = await prisma.patient.findMany({
        where: {
          firstName: { contains: firstName, mode: 'insensitive' }
        }
      });

      const bestMatch = matches.find(m => 
        (m.firstName.toLowerCase() === firstName.toLowerCase()) && 
        (m.lastName.toLowerCase() === (lastName || '').toLowerCase())
      );

      if (bestMatch) {
        await prisma.appointment.update({
          where: { id: appt.id },
          data: { patientId: bestMatch.id }
        });
        console.log(`HEALED: Linked [${appt.apptCode}] ${appt.patientName} -> [${bestMatch.patientCode}]`);
      } else {
        console.log(`STILL UNLINKED: [${appt.apptCode}] ${appt.patientName} - No exact name match found in registry.`);
      }
    }
  } catch (err) {
    console.error('Healing failed:', err);
  } finally {
    process.exit();
  }
}

heal();
