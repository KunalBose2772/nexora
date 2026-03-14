import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const grievances = await prisma.grievance.findMany({
            where: { tenantId: session.tenantId },
            include: {
                patient: { select: { firstName: true, lastName: true, patientCode: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ grievances }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/grievances]', err);
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
        const { patientId, category, urgency, subject, description } = body;

        const grievance = await prisma.grievance.create({
            data: {
                patientId,
                category,
                urgency,
                subject,
                description,
                tenantId: session.tenantId
            }
        });

        return NextResponse.json({ grievance }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/grievances]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, status, resolutionNotes } = await request.json();

        const grievance = await prisma.grievance.update({
            where: { id },
            data: {
                status,
                resolutionNotes,
                resolvedAt: status === 'Resolved' ? new Date() : null
            }
        });

        return NextResponse.json({ grievance }, { status: 200 });
    } catch (err) {
        console.error('[PATCH /api/grievances]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
