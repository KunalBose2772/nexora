const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
    try {
        const list = await prisma.organism.findMany();
        console.log('Success, organism table exists. Count:', list.length);
    } catch (e) {
        console.error('Table might not exist:', e.message);
    }
}
test().finally(() => prisma.$disconnect());
