const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugAuth() {
    try {
        console.log('Querying first user...');
        const user = await prisma.user.findFirst({
            include: { tenant: true }
        });
        console.log('User found:', user ? user.email : 'None');

        console.log('Querying first patient...');
        const patient = await prisma.patient.findFirst({
            include: { tenant: true }
        });
        console.log('Patient found:', patient ? patient.id : 'None');

        console.log('Auth check complete.');
    } catch (err) {
        console.error('DEBUG AUTH ERROR:', err);
    } finally {
        await prisma.$disconnect();
    }
}

debugAuth();
