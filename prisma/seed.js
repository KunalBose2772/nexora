/**
 * prisma/seed.js — Seeds the database with default super admin + demo hospitals
 * Run with: node prisma/seed.js
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Nexora Health database...\n');

    // ── Super Admin ──────────────────────────────────────────
    const adminHash = await bcrypt.hash('admin@123', 10);

    await prisma.user.upsert({
        where: { email: 'admin@nexorahealth.com' },
        update: {},
        create: {
            userId: 'USR-0001',
            name: 'Super Admin',
            email: 'admin@nexorahealth.com',
            passwordHash: adminHash,
            role: 'superadmin',
            status: 'Active',
        },
    });
    console.log('✅ Super Admin created: admin@nexorahealth.com / admin@123');

    // ── Demo Hospital Tenants ────────────────────────────────
    const hospitals = [
        {
            tenantCode: 'TEN-9201',
            slug: 'apollo',
            name: 'Apollo Health Systems',
            plan: 'Enterprise Annual',
            status: 'Active',
            adminEmail: 'admin@apollo.com',
            tagline: 'Advanced Healthcare, Delivered with Compassion',
            description: 'Apollo Health Systems is a leading multi-speciality hospital.',
            logoInitials: 'AHS',
            primaryColor: '#0EA5E9',
            phone: '+91 98765 43210',
            address: '14, Medical Hub Road, Bandra West, Mumbai — 400050',
        },
        {
            tenantCode: 'TEN-8492',
            slug: 'citygeneral',
            name: 'City General Medical Center',
            plan: 'Professional Monthly',
            status: 'Active',
            adminEmail: 'admin@citygeneral.com',
            tagline: 'Your Health, Our Priority',
            description: 'City General Medical Center has been serving the community for over two decades.',
            logoInitials: 'CGM',
            primaryColor: '#10B981',
            phone: '+91 91234 56789',
            address: '22, Central Avenue, Civil Lines, Lucknow — 226001',
        },
        {
            tenantCode: 'TEN-8104',
            slug: 'medicare',
            name: 'MediCare Clinics',
            plan: 'Basic Quarterly',
            status: 'Payment Due',
            adminEmail: 'admin@medicare.com',
            tagline: 'Affordable Care Without Compromise',
            description: 'MediCare Clinics delivers high-quality outpatient and diagnostic services.',
            logoInitials: 'MC',
            primaryColor: '#F59E0B',
            phone: '+91 87654 32109',
            address: '7, Nehru Nagar, Sector 15, Chandigarh — 160015',
        },
        {
            tenantCode: 'TEN-7221',
            slug: 'primeheart',
            name: 'Prime Heart Institute',
            plan: 'Enterprise Custom',
            status: 'Active',
            adminEmail: 'admin@primeheart.com',
            tagline: "India's Premier Cardiac Care Centre",
            description: 'Prime Heart Institute is a dedicated centre of excellence in cardiology.',
            logoInitials: 'PHI',
            primaryColor: '#EF4444',
            phone: '+91 99887 76655',
            address: '3, Cardiac Boulevard, Koramangala, Bengaluru — 560034',
        },
        {
            tenantCode: 'TEN-6019',
            slug: 'sunrise',
            name: 'Sunrise Diagnostics Hub',
            plan: 'Professional Monthly',
            status: 'Suspended',
            adminEmail: 'admin@sunrise.com',
            tagline: 'Precise Diagnostics. Faster Answers.',
            description: 'Sunrise Diagnostics Hub is a full-service diagnostic centre.',
            logoInitials: 'SDH',
            primaryColor: '#8B5CF6',
            phone: '+91 76543 21098',
            address: '9, Lab Circle, T. Nagar, Chennai — 600017',
        },
    ];

    for (const h of hospitals) {
        const tenant = await prisma.tenant.upsert({
            where: { slug: h.slug },
            update: {},
            create: h,
        });

        const pw = `${h.slug}@Nexora1`;
        const hash = await bcrypt.hash(pw, 10);

        const userCount = await prisma.user.count();
        await prisma.user.upsert({
            where: { email: h.adminEmail },
            update: {},
            create: {
                userId: `USR-${String(userCount + 2).padStart(4, '0')}`,
                name: `${h.name} Admin`,
                email: h.adminEmail,
                passwordHash: hash,
                role: 'hospital_admin',
                status: h.status === 'Suspended' ? 'Suspended' : 'Active',
                tenantId: tenant.id,
            },
        });

        console.log(`✅ ${h.name}: ${h.adminEmail} / ${pw}`);
    }

    console.log('\n🎉 Seed complete!');
    console.log('\nLogin at http://localhost:3000/login');
    console.log('Super Admin:  admin@nexorahealth.com / admin@123');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
