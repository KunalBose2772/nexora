const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const apps = await prisma.appointment.findMany({
        where: { type: 'EMERGENCY' },
        include: { patient: true },
        take: 5
    });
    console.log(JSON.stringify(apps, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
