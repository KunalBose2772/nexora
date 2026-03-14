const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Adding Attendance and Grievances for Apollo...');

    const apollo = await prisma.tenant.findUnique({ where: { slug: 'apollo' } });
    if (!apollo) return;

    const users = await prisma.user.findMany({ where: { tenantId: apollo.id } });
    const patients = await prisma.patient.findMany({ where: { tenantId: apollo.id } });

    // 1. Attendance Records
    for (const u of users) {
        await prisma.staffAttendance.create({
            data: {
                type: 'ClockIn',
                method: 'Biometric',
                timestamp: new Date(Date.now() - 3600000 * 8), // 8 hours ago
                location: 'Main Gate',
                userId: u.id,
                tenantId: apollo.id,
            }
        });
    }

    // 2. Grievances
    if (patients.length > 0) {
        const grievances = [
            { subject: 'Wait time for OPD', desc: 'I had to wait for 45 mins even with an appointment.', category: 'Clinical', priority: 'Normal' },
            { subject: 'Cleanliness in Ward B', desc: 'The washroom in Ward B needs urgent cleaning.', category: 'Cleanliness', priority: 'High' },
        ];

        for (let i = 0; i < grievances.length; i++) {
            await prisma.grievance.create({
                data: {
                    ticketId: `TKT-${Math.floor(Math.random() * 9000) + 1000}`,
                    subject: grievances[i].subject,
                    description: grievances[i].desc,
                    category: grievances[i].category,
                    priority: grievances[i].priority,
                    status: 'Open',
                    patientName: `${patients[i % patients.length].firstName} ${patients[i % patients.length].lastName}`,
                    patientId: patients[i % patients.length].id,
                    tenantId: apollo.id,
                }
            });
        }
    }

    console.log('✅ Extra data added!');
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
