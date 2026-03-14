const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const tenants = await prisma.tenant.findMany();
    for (const tenant of tenants) {
        const organisms = [
            { name: 'Escherichia coli', category: 'Bacteria', commonInfection: 'UTI, Sepsis', tenantId: tenant.id },
            { name: 'Staphylococcus aureus', category: 'Bacteria', commonInfection: 'Skin, Pneumonia', tenantId: tenant.id },
            { name: 'Klebsiella pneumoniae', category: 'Bacteria', commonInfection: 'Pneumonia, UTI', tenantId: tenant.id },
            { name: 'Pseudomonas aeruginosa', category: 'Bacteria', commonInfection: 'HAI, Ventilator Pneumonia', tenantId: tenant.id },
            { name: 'Candida albicans', category: 'Fungi', commonInfection: 'Candidiasis', tenantId: tenant.id },
        ];

        for (const org of organisms) {
            await prisma.organism.upsert({
                where: { id: `seed-${org.name}-${tenant.id}` }, // Fake ID for seed
                update: {},
                create: {
                    ...org,
                    id: undefined // Let cuid handle it
                }
            });
        }
    }
    console.log('Seed completed.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
