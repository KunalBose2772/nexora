const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const count = await prisma.subscriptionPlan.count();
    if (count === 0) {
        await prisma.subscriptionPlan.createMany({
            data: [
                { planCode: 'STARTER', name: 'Starter Tier', price: '₹4,999/mo', maxUsers: '5', maxBranches: '1', features: JSON.stringify(['OPD Module', 'Patient EMR', 'Basic Billing']), status: 'active' },
                { planCode: 'PRO', name: 'Pro Tier', price: '₹12,999/mo', maxUsers: '30', maxBranches: '3', features: JSON.stringify(['All Starter Features', 'IPD & Wards', 'Pharmacy & Labs', 'HR Module']), status: 'active' },
                { planCode: 'ENTERPRISE', name: 'Enterprise Tier', price: 'Custom', maxUsers: 'Unlimited', maxBranches: 'Unlimited', features: JSON.stringify(['All Pro Features', 'Dedicated AWS RDS', 'White-labeling', 'API Access']), status: 'active' },
                { planCode: 'BASIC_LEGACY', name: 'Legacy Basic v1', price: '₹2,999/mo', maxUsers: '2', maxBranches: '1', features: JSON.stringify(['OPD Module', 'Basic Billing']), status: 'archived' }
            ]
        });
        console.log('Seeded plans');
    } else {
        console.log('Plans already exist');
    }
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
