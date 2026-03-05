/**
 * prisma/seed.cjs — Seeds the database (CommonJS so it runs with plain node)
 * Run with: node prisma/seed.cjs
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

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
    console.log('✅ Super Admin: admin@nexorahealth.com / admin@123');

    // ── Demo Hospitals ───────────────────────────────────────
    const hospitals = [
        { tenantCode: 'TEN-9201', slug: 'apollo', name: 'Apollo Health Systems', plan: 'Enterprise Annual', status: 'Active', adminEmail: 'admin@apollo.com', primaryColor: '#0EA5E9', logoInitials: 'AHS', tagline: 'Advanced Healthcare, Delivered with Compassion', description: 'Apollo Health Systems is a leading multi-speciality hospital.', phone: '+91 98765 43210', address: '14, Medical Hub Road, Bandra West, Mumbai — 400050' },
        { tenantCode: 'TEN-8492', slug: 'citygeneral', name: 'City General Medical Center', plan: 'Professional Monthly', status: 'Active', adminEmail: 'admin@citygeneral.com', primaryColor: '#10B981', logoInitials: 'CGM', tagline: 'Your Health, Our Priority', description: 'City General has been serving the community for two decades.', phone: '+91 91234 56789', address: '22, Central Avenue, Civil Lines, Lucknow — 226001' },
        { tenantCode: 'TEN-8104', slug: 'medicare', name: 'MediCare Clinics', plan: 'Basic Quarterly', status: 'Payment Due', adminEmail: 'admin@medicare.com', primaryColor: '#F59E0B', logoInitials: 'MC', tagline: 'Affordable Care Without Compromise', description: 'MediCare Clinics delivers high-quality outpatient services.', phone: '+91 87654 32109', address: '7, Nehru Nagar, Sector 15, Chandigarh — 160015' },
        { tenantCode: 'TEN-7221', slug: 'primeheart', name: 'Prime Heart Institute', plan: 'Enterprise Custom', status: 'Active', adminEmail: 'admin@primeheart.com', primaryColor: '#EF4444', logoInitials: 'PHI', tagline: "India's Premier Cardiac Care Centre", description: 'Prime Heart Institute is a dedicated centre of excellence.', phone: '+91 99887 76655', address: '3, Cardiac Boulevard, Koramangala, Bengaluru — 560034' },
        { tenantCode: 'TEN-6019', slug: 'sunrise', name: 'Sunrise Diagnostics Hub', plan: 'Professional Monthly', status: 'Suspended', adminEmail: 'admin@sunrise.com', primaryColor: '#8B5CF6', logoInitials: 'SDH', tagline: 'Precise Diagnostics. Faster Answers.', description: 'Sunrise Diagnostics Hub is a full-service diagnostic centre.', phone: '+91 76543 21098', address: '9, Lab Circle, T. Nagar, Chennai — 600017' },
    ];

    for (let i = 0; i < hospitals.length; i++) {
        const h = hospitals[i];
        const tenant = await prisma.tenant.upsert({
            where: { slug: h.slug },
            update: {},
            create: h,
        });

        const pw = `${h.slug}@Nexora1`;
        const hash = await bcrypt.hash(pw, 10);

        await prisma.user.upsert({
            where: { email: h.adminEmail },
            update: {},
            create: {
                userId: `USR-${String(i + 2).padStart(4, '0')}`,
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

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Credentials:');
    console.log('   Super Admin:      admin@nexorahealth.com / admin@123');
    console.log('   Apollo Admin:     admin@apollo.com / apollo@Nexora1');
    console.log('   CityGeneral:      admin@citygeneral.com / citygeneral@Nexora1');
    console.log('   MediCare Admin:   admin@medicare.com / medicare@Nexora1');
    console.log('   PrimeHeart Admin: admin@primeheart.com / primeheart@Nexora1');
    console.log('   Sunrise (Susp):   admin@sunrise.com / sunrise@Nexora1\n');
}

main()
    .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
    .finally(() => prisma.$disconnect());
