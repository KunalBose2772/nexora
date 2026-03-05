/**
 * prisma/seed.ts — Seeds the database with super admin + demo hospitals
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("\n🌱 Seeding Nexora Health database...\n");

    // ── Super Admin ──────────────────────────────────────────────────────────
    await prisma.user.upsert({
        where: { email: "admin@nexorahealth.com" },
        update: {},
        create: {
            userId: "USR-0001",
            name: "Super Admin",
            email: "admin@nexorahealth.com",
            passwordHash: await bcrypt.hash("admin@123", 10),
            role: "superadmin",
            status: "Active",
        },
    });
    console.log("✅ Super Admin:        admin@nexorahealth.com  /  admin@123");

    // ── Demo Hospitals ────────────────────────────────────────────────────────
    const hospitals = [
        { code: "TEN-9201", slug: "apollo", name: "Apollo Health Systems", plan: "Enterprise Annual", status: "Active", email: "admin@apollo.com", color: "#0EA5E9", initials: "AHS", tagline: "Advanced Healthcare, Delivered with Compassion", description: "Apollo Health Systems is a leading multi-speciality hospital.", phone: "+91 98765 43210", address: "14, Medical Hub Road, Bandra West, Mumbai — 400050" },
        { code: "TEN-8492", slug: "citygeneral", name: "City General Medical Center", plan: "Professional Monthly", status: "Active", email: "admin@citygeneral.com", color: "#10B981", initials: "CGM", tagline: "Your Health, Our Priority", description: "City General has served the community for decades.", phone: "+91 91234 56789", address: "22, Central Avenue, Civil Lines, Lucknow — 226001" },
        { code: "TEN-8104", slug: "medicare", name: "MediCare Clinics", plan: "Basic Quarterly", status: "Payment Due", email: "admin@medicare.com", color: "#F59E0B", initials: "MC", tagline: "Affordable Care Without Compromise", description: "MediCare Clinics delivers high-quality outpatient services.", phone: "+91 87654 32109", address: "7, Nehru Nagar, Sector 15, Chandigarh — 160015" },
        { code: "TEN-7221", slug: "primeheart", name: "Prime Heart Institute", plan: "Enterprise Custom", status: "Active", email: "admin@primeheart.com", color: "#EF4444", initials: "PHI", tagline: "India's Premier Cardiac Care Centre", description: "Prime Heart is a dedicated centre of excellence in cardiology.", phone: "+91 99887 76655", address: "3, Cardiac Boulevard, Koramangala, Bengaluru — 560034" },
        { code: "TEN-6019", slug: "sunrise", name: "Sunrise Diagnostics Hub", plan: "Professional Monthly", status: "Suspended", email: "admin@sunrise.com", color: "#8B5CF6", initials: "SDH", tagline: "Precise Diagnostics. Faster Answers.", description: "Sunrise Diagnostics Hub is a full-service diagnostic centre.", phone: "+91 76543 21098", address: "9, Lab Circle, T. Nagar, Chennai — 600017" },
    ];

    for (let i = 0; i < hospitals.length; i++) {
        const h = hospitals[i];
        const tenant = await prisma.tenant.upsert({
            where: { slug: h.slug },
            update: {},
            create: {
                tenantCode: h.code,
                slug: h.slug,
                name: h.name,
                plan: h.plan,
                status: h.status,
                adminEmail: h.email,
                primaryColor: h.color,
                logoInitials: h.initials,
                tagline: h.tagline,
                description: h.description,
                phone: h.phone,
                address: h.address,
            },
        });

        const pw = `${h.slug}@Nexora1`;
        await prisma.user.upsert({
            where: { email: h.email },
            update: {},
            create: {
                userId: `USR-${String(i + 2).padStart(4, "0")}`,
                name: `${h.name} Admin`,
                email: h.email,
                passwordHash: await bcrypt.hash(pw, 10),
                role: "hospital_admin",
                status: h.status === "Suspended" ? "Suspended" : "Active",
                tenantId: tenant.id,
            },
        });
        console.log(`✅ ${h.name.padEnd(32)} ${h.email}  /  ${pw}`);
    }

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n┌─────────────────────────────────────────────────────────┐");
    console.log("│  LOGIN at http://localhost:3000/login                   │");
    console.log("├─────────────────────────────────────────────────────────┤");
    console.log("│  Super Admin:  admin@nexorahealth.com  /  admin@123     │");
    console.log("│  Apollo:       admin@apollo.com        /  apollo@Nexora1│");
    console.log("│  + 4 more hospitals                                     │");
    console.log("└─────────────────────────────────────────────────────────┘\n");
}

main()
    .catch((e) => { console.error("❌ Seed error:", e); process.exit(1); })
    .finally(() => prisma.$disconnect());
