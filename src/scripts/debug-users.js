const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const users = await prisma.user.findMany({
        select: { id: true, userId: true, role: true, email: true }
    });
    console.log(JSON.stringify(users, null, 2));
    await prisma.$disconnect();
}
main();
