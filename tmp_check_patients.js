const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const patients = await prisma.patient.findMany({
        take: 10
    });
    console.log(JSON.stringify(patients.map(p => ({ firstName: p.firstName, lastName: p.lastName, patientCode: p.patientCode })), null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
