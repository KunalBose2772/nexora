import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized or no tenant' }, { status: 401 });
        }

        const wards = await prisma.ward.findMany({
            where: { tenantId: session.tenantId },
            include: { beds: true },
            orderBy: { createdAt: 'asc' }
        });

        return NextResponse.json({ wards }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/facility/wards]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized or no tenant' }, { status: 401 });
        }

        const data = await request.json();

        if (!data.name) {
            return NextResponse.json({ error: 'Ward name is required' }, { status: 400 });
        }

        const newWard = await prisma.ward.create({
            data: {
                tenantId: session.tenantId,
                name: data.name.trim(),
                description: data.description ? data.description.trim() : null,
                floorWing: data.floorWing ? data.floorWing.trim() : null,
            },
            include: { beds: true }
        });

        return NextResponse.json({ ok: true, ward: newWard }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/facility/wards]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
