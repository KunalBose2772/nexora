import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const requests = await prisma.bloodRequest.findMany({
            where: {
                tenantId: session.tenantId,
                status: { not: 'Cancelled' }
            },
            include: {
                patient: { select: { firstName: true, lastName: true, patientCode: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ requests }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/blood-bank/requests]', err);
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
        const { patientId, bloodGroup, component, unitsRequired, priority, indication } = body;

        const requestCode = `BR-${Date.now().toString().slice(-6)}`;

        const bloodRequest = await prisma.bloodRequest.create({
            data: {
                requestCode,
                patientId,
                bloodGroup,
                component,
                unitsRequired: parseInt(unitsRequired),
                priority,
                indication,
                tenantId: session.tenantId
            }
        });

        return NextResponse.json({ bloodRequest }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/blood-bank/requests]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
