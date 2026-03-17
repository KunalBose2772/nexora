const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error('No tenant found');

  // Find all ICU/Emergency appointments we might be viewing
  const appointments = await prisma.appointment.findMany({
    where: { 
      status: { in: ['Admitted', 'Referred: ICU Central', 'In Progress'] },
      tenantId: tenant.id
    }
  });

  if (appointments.length === 0) {
    console.log('No eligible ICU appointments found to seed telemetry history.');
    return;
  }

  for (const appt of appointments) {
    console.log(`Generating telemetry history for ${appt.patientName} (${appt.apptCode})...`);
    
    // Create 12 historical data points (last 12 hours)
    for (let i = 12; i >= 0; i--) {
        const time = new Date();
        time.setHours(time.getHours() - i);
        
        // Randomize vitals around a baseline
        const baseHR = 70 + Math.floor(Math.random() * 40);
        const baseSpO2 = 92 + Math.floor(Math.random() * 7);
        const baseSBP = 110 + Math.floor(Math.random() * 30);
        const baseDBP = 70 + Math.floor(Math.random() * 15);

        await prisma.icuMonitoring.create({
            data: {
                appointmentId: appt.id,
                tenantId: tenant.id,
                recordedAt: time,
                recordedBy: 'Auto-Sim',
                heartRate: baseHR,
                systolicBP: baseSBP,
                diastolicBP: baseDBP,
                spo2: baseSpO2,
                temp: 36.5 + (Math.random() * 2),
                respRate: 16 + Math.floor(Math.random() * 8),
                isVentilated: false
            }
        });
    }
  }
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
