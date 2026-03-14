import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const cases = await prisma.laborRecord.findMany({
            where: {
                tenantId: session.tenantId,
                status: 'In-Labor'
            },
            include: {
                patient: { select: { firstName: true, lastName: true, patientCode: true, age: true, gender: true } },
                _count: { select: { partograph: true, births: true } }
            },
            orderBy: { admissionDate: 'desc' }
        });

        return NextResponse.json({ cases }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/maternity/labor]', err);
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
        const { patientId, edd, gravida, para, living, abortion } = body;

        const laborRecord = await prisma.laborRecord.create({
            data: {
                patientId,
                edd: edd ? new Date(edd) : null,
                gravida: parseInt(gravida) || 0,
                para: parseInt(para) || 0,
                living: parseInt(living) || 0,
                abortion: parseInt(abortion) || 0,
                tenantId: session.tenantId
            }
        });

        return NextResponse.json({ laborRecord }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/maternity/labor]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
