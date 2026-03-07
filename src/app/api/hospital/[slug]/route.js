// GET /api/hospital/[slug] — public endpoint, returns tenant info for the public hospital homepage
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, context) {
    try {
        const params = await context.params;
        const slug = params.slug;

        const tenant = await prisma.tenant.findUnique({
            where: { slug },
            select: {
                id: true,
                slug: true,
                name: true,
                plan: true,
                status: true,
                tagline: true,
                description: true,
                logoInitials: true,
                primaryColor: true,
                logoUrl: true,
                heroImage: true,
                phone: true,
                address: true,
                adminEmail: true,
                mapUrl: true,
                servicesContent: true,
                createdAt: true,
                _count: { select: { patients: true, appointments: true, users: true } },
            },
        });

        if (!tenant) {
            return NextResponse.json({ error: 'Hospital not found.' }, { status: 404 });
        }

        return NextResponse.json({ tenant });
    } catch (err) {
        console.error('[GET /api/hospital/slug]', err);
        return NextResponse.json({ error: 'Internal server error.', detail: err.message }, { status: 500 });
    }
}
