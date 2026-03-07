const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Resellers...');

    await prisma.reseller.deleteMany({});

    const resellers = [
        {
            name: "CareLogic IT Solutions",
            contact: "Anita Desai",
            email: "anita@carelogic.com",
            hospitals: 14,
            revShare: "20%",
            status: "Active"
        },
        {
            name: "MediTech Partners",
            contact: "Rajiv Sharma",
            email: "rajiv@meditech.in",
            hospitals: 5,
            revShare: "15%",
            status: "Active"
        },
        {
            name: "NextGen Health Services",
            contact: "Priya Patel",
            email: "priya@nextgenhealth.co",
            hospitals: 2,
            revShare: "15%",
            status: "Inactive"
        },
        {
            name: "Global Reach Agency",
            contact: "Vikram Singh",
            email: "vikram.s@globalreach.com",
            hospitals: 8,
            revShare: "25%",
            status: "Active"
        }
    ];

    for (const r of resellers) {
        await prisma.reseller.create({ data: r });
    }

    console.log(`Seeded ${resellers.length} resellers.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
