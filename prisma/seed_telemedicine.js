const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Seeding Virtual Consultations for Apollo...');

    const apollo = await prisma.tenant.findUnique({ where: { slug: 'apollo' } });
    if (!apollo) {
        console.log('❌ Tenant "apollo" not found. Please ensure it exists.');
        return;
    }

    const patients = await prisma.patient.findMany({ where: { tenantId: apollo.id }, take: 3 });
    if (patients.length === 0) {
        console.log('❌ No patients found for Apollo. Seed patients first.');
        return;
    }

    const doctors = [
        { name: 'Dr. Priya Sharma', dept: 'Cardiology' },
        { name: 'Dr. Rajesh Sharma', dept: 'Pediatrics' },
        { name: 'Dr. Sneha Patil', dept: 'Neurology' }
    ];

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const times = ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'];

    const appointmentDates = [today, today, tomorrow];

    for (let i = 0; i < appointmentDates.length; i++) {
        const patient = patients[i % patients.length];
        const doctor = doctors[i % doctors.length];
        const date = appointmentDates[i];
        
        try {
            await prisma.appointment.create({
                data: {
                    tenantId: apollo.id,
                    apptCode: `VID-${2000 + i}`,
                    patientName: `${patient.firstName} ${patient.lastName}`,
                    patientId: patient.id,
                    doctorName: doctor.name,
                    department: doctor.dept,
                    date: date,
                    time: times[i],
                    type: 'Teleconsult',
                    status: 'Scheduled',
                    notes: `[VIRTUAL CLINIC] ${date === today ? 'Urgent' : 'Routine'} consultation. Encrypted tunnel ready.`
                }
            });
            console.log(`✅ Created ${date === today ? 'TODAY' : 'TOMORROW'} call for ${patient.firstName} with ${doctor.name}`);
        } catch (err) {
            console.error(`❌ Failed to create appointment for ${patient.firstName}:`, err.message);
        }
    }

    console.log('🌟 Telemedicine Roster seeded successfully!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
