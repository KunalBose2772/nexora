// PATCH /api/tenants/[id]  — update tenant (name, plan, status)
// DELETE /api/tenants/[id] — delete tenant
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

function requireSuperAdmin(session) {
    if (!session || session.role !== 'superadmin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return null;
}

export async function GET(request, context) {
    const params = await context.params;
    const { id } = params;
    const session = await getSessionFromRequest(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const tenant = await prisma.tenant.findUnique({
        where: { id },
        include: { _count: { select: { users: true, patients: true, appointments: true } } },
    });

    if (!tenant) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (session.role !== 'superadmin' && tenant.id !== session.tenantId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ tenant });
}

export async function PATCH(request, context) {
    const params = await context.params;
    const id = params.id;
    const session = await getSessionFromRequest(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    // superadmin can edit any tenant; hospital_admin can only edit their own
    const isSuperAdmin = session.role === 'superadmin';
    const isOwnTenant = session.tenantId === id && session.role === 'hospital_admin';
    if (!isSuperAdmin && !isOwnTenant) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { name, slug, plan, status, phone, address, tagline, description, primaryColor, logoInitials, logoUrl, heroImage } = body;

        const data = {};
        if (name) data.name = name.trim();
        if (slug && isSuperAdmin) data.slug = slug.toLowerCase().trim();
        if (plan && isSuperAdmin) data.plan = plan;
        if (status && isSuperAdmin) data.status = status;
        if (phone !== undefined) data.phone = phone;
        if (address !== undefined) data.address = address;
        if (tagline !== undefined) data.tagline = tagline;
        if (description !== undefined) data.description = description;
        if (primaryColor) data.primaryColor = primaryColor;
        if (logoInitials) data.logoInitials = logoInitials;
        if (logoUrl !== undefined) data.logoUrl = logoUrl;
        if (heroImage !== undefined) data.heroImage = heroImage;

        const tenant = await prisma.tenant.update({ where: { id }, data });

        // Cascade status to tenant's users (superadmin only)
        if (isSuperAdmin) {
            if (status === 'Suspended') {
                await prisma.user.updateMany({
                    where: { tenantId: id, role: { not: 'superadmin' } },
                    data: { status: 'Suspended' },
                });
            } else if (status === 'Active') {
                await prisma.user.updateMany({
                    where: { tenantId: id, role: { not: 'superadmin' } },
                    data: { status: 'Active' },
                });
            }
        }

        return NextResponse.json({ ok: true, tenant });
    } catch (err) {
        console.error('[PATCH /api/tenants/id]', err);
        return NextResponse.json({ error: 'Update failed.' }, { status: 500 });
    }
}

export async function DELETE(request, context) {
    const params = await context.params;
    const { id } = params;
    const session = await getSessionFromRequest(request);
    const deny = requireSuperAdmin(session);
    if (deny) return deny;

    try {
        await prisma.appointment.deleteMany({ where: { tenantId: id } });
        await prisma.patient.deleteMany({ where: { tenantId: id } });
        await prisma.user.deleteMany({ where: { tenantId: id } });
        await prisma.tenant.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[DELETE /api/tenants/id]', err);
        return NextResponse.json({ error: 'Delete failed.' }, { status: 500 });
    }
}
