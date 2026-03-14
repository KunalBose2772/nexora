import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const orders = await prisma.radiologyOrder.findMany({
            where: {
                tenantId: session.tenantId,
                status: { not: 'Cancelled' }
            },
            include: {
                patient: { select: { firstName: true, lastName: true, patientCode: true } },
                report: { select: { status: true, criticalAlert: true } }
            },
            orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }]
        });

        return NextResponse.json({ orders }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/radiology/orders]', err);
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
        const { patientId, modality, procedureName, clinicalHistory, priority, appointmentId } = body;

        const orderCode = `RIS-${Date.now().toString().slice(-6)}`;

        const order = await prisma.radiologyOrder.create({
            data: {
                orderCode,
                patientId,
                modality,
                procedureName,
                clinicalHistory,
                priority,
                appointmentId,
                tenantId: session.tenantId
            }
        });

        return NextResponse.json({ order }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/radiology/orders]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
