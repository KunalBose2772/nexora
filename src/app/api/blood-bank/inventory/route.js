import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const stock = await prisma.bloodStock.findMany({
            where: {
                tenantId: session.tenantId,
                status: { in: ['Available', 'Reserved'] }
            },
            orderBy: [{ bloodGroup: 'asc' }, { expiryDate: 'asc' }]
        });

        return NextResponse.json({ stock }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/blood-bank/inventory]', err);
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
        const { bloodGroup, component, units, expiryDate, source } = body;

        const entry = await prisma.bloodStock.create({
            data: {
                bloodGroup,
                component,
                units: parseInt(units),
                expiryDate: new Date(expiryDate),
                source,
                tenantId: session.tenantId
            }
        });

        return NextResponse.json({ entry }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/blood-bank/inventory]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
