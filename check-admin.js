const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdmin() {
    try {
        const user = await prisma.user.findFirst({
            where: { email: 'admin@nexorahealth.com' },
            include: { tenant: true }
        });
        console.log('User:', JSON.stringify(user, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}
checkAdmin();
