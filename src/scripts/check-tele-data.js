const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
    const tenants = await prisma.tenant.findMany();
    console.log(`Found ${tenants.length} tenants.`);
    
    for (const t of tenants) {
        const count = await prisma.appointment.count({
            where: { tenantId: t.id, type: 'Teleconsult' }
        });
        const total = await prisma.appointment.count({
            where: { tenantId: t.id }
        });
        console.log(`Tenant ${t.slug} (${t.id}): ${count} Teleconsults / ${total} Total Appointments`);
        
        if (count > 0) {
            const latest = await prisma.appointment.findFirst({
                where: { tenantId: t.id, type: 'Teleconsult' },
                orderBy: { date: 'desc' }
            });
            console.log(`  - Latest date: ${latest.date}`);
        }
    }
}

checkData().finally(() => prisma.$disconnect());
