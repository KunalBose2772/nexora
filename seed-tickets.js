const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const count = await prisma.supportTicket.count();
    if (count === 0) {
        await prisma.supportTicket.createMany({
            data: [
                { ticketId: '#TKT-8901', hospital: 'City General', issue: 'Cannot upload PDF lab reports larger than 5MB.', priority: 'High', status: 'open' },
                { ticketId: '#TKT-8902', hospital: 'Apollo Health', issue: 'Database connection timeout on historical billing search.', priority: 'Critical', status: 'open' },
                { ticketId: '#TKT-8903', hospital: 'Metro Multi', issue: 'New user creation failing with RBAC error.', priority: 'Medium', status: 'open' },
                { ticketId: '#TKT-8898', hospital: 'Sunrise Care', issue: 'Missing GST export button on pro plan.', priority: 'Medium', status: 'progress' },
                { ticketId: '#TKT-8850', hospital: 'Care Hospital', issue: 'Password reset email not delivering.', priority: 'High', status: 'resolved' }
            ]
        });
        console.log('Seeded tickets');
    } else {
        console.log('Tickets exist');
    }
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
