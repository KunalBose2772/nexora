// GET  /api/tenants          — list all tenants (super admin only)
// POST /api/tenants          — create new tenant + admin user (super admin only)
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

function requireSuperAdmin(session) {
    if (!session || session.role !== 'superadmin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return null;
}

export async function GET(request) {
    const session = await getSessionFromRequest(request);
    const deny = requireSuperAdmin(session);
    if (deny) return deny;

    const tenants = await prisma.tenant.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { users: true, patients: true, appointments: true } } },
    });

    return NextResponse.json({ tenants });
}

export async function POST(request) {
    const session = await getSessionFromRequest(request);
    const deny = requireSuperAdmin(session);
    if (deny) return deny;

    try {
        const { name, slug, plan, adminEmail, phone, address, tagline, description, primaryColor, logoInitials } = await request.json();

        if (!name || !slug || !adminEmail) {
            return NextResponse.json({ error: 'Name, slug and admin email are required.' }, { status: 400 });
        }

        // Check slug unique
        const existing = await prisma.tenant.findUnique({ where: { slug: slug.toLowerCase() } });
        if (existing) {
            return NextResponse.json({ error: `Slug "${slug}" is already taken.` }, { status: 409 });
        }

        // Check email unique
        const existingUser = await prisma.user.findUnique({ where: { email: adminEmail.toLowerCase() } });
        if (existingUser) {
            return NextResponse.json({ error: `Email "${adminEmail}" is already registered.` }, { status: 409 });
        }

        const count = await prisma.tenant.count();
        const tenantCode = `TEN-${String(9000 - count).padStart(4, '0')}`;

        const tenant = await prisma.tenant.create({
            data: {
                tenantCode,
                slug: slug.toLowerCase().trim(),
                name: name.trim(),
                plan: plan || 'Starter Tier',
                status: 'Active',
                adminEmail: adminEmail.toLowerCase().trim(),
                phone: phone || null,
                address: address || null,
                tagline: tagline || null,
                description: description || null,
                primaryColor: primaryColor || '#10B981',
                logoInitials: logoInitials || slug.substring(0, 3).toUpperCase(),
            },
        });

        // Generate temp password and create admin user
        const tempPassword = `${slug}@Nexora1`;
        const userCount = await prisma.user.count();
        const adminUser = await prisma.user.create({
            data: {
                userId: `USR-${String(userCount + 1).padStart(4, '0')}`,
                name: `${name} Admin`,
                email: adminEmail.toLowerCase().trim(),
                passwordHash: await bcrypt.hash(tempPassword, 10),
                role: 'hospital_admin',
                status: 'Active',
                tenantId: tenant.id,
            },
        });

        return NextResponse.json({
            ok: true,
            tenant,
            credentials: { email: adminUser.email, tempPassword },
        }, { status: 201 });

    } catch (err) {
        console.error('[POST /api/tenants]', err);
        return NextResponse.json({ error: 'Failed to create tenant.' }, { status: 500 });
    }
}
