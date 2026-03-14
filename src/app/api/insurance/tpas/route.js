import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const tpas = await prisma.tpaCompany.findMany({
            where: {
                tenantId: session.tenantId,
                status: 'Active'
            },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json({ tpas }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/insurance/tpas]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, contactEmail, contactPhone, discountRate } = body;

        const tpa = await prisma.tpaCompany.create({
            data: {
                name,
                contactEmail,
                contactPhone,
                discountRate: parseFloat(discountRate || 0),
                tenantId: session.tenantId
            }
        });

        return NextResponse.json({ tpa }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/insurance/tpas]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
