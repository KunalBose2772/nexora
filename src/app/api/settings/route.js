import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

// GET — load current tenant settings
export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const tenant = await prisma.tenant.findUnique({
            where: { id: session.tenantId },
            select: {
                id: true, tenantCode: true, slug: true, name: true,
                plan: true, status: true, adminEmail: true,
                phone: true, address: true, tagline: true, description: true,
                gstNumber: true, hfrNumber: true, printTerms: true, footerSignature: true,
                requireRxApproval: true, enablePanicAlarms: true,
                primaryColor: true, logoInitials: true, logoUrl: true, heroImage: true, mapUrl: true,
                metaTitle: true, metaDescription: true, faviconUrl: true, servicesContent: true,
                createdAt: true,
            }
        });

        if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

        return NextResponse.json({ tenant });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH — update tenant settings
export async function PATCH(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const allowed = [
            'name', 'phone', 'address', 'tagline', 'description', 
            'gstNumber', 'hfrNumber', 'printTerms', 'footerSignature',
            'requireRxApproval', 'enablePanicAlarms',
            'primaryColor', 'logoInitials', 'logoUrl', 'heroImage', 
            'mapUrl', 'metaTitle', 'metaDescription', 'faviconUrl', 'servicesContent'
        ];
        const updateData = {};
        for (const key of allowed) {
            if (data[key] !== undefined) updateData[key] = data[key];
        }

        const tenant = await prisma.tenant.update({
            where: { id: session.tenantId },
            data: updateData,
        });

        return NextResponse.json({ ok: true, tenant });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
