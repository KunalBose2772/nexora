import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function POST(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { laborRecordId, dilation, descent, contractions, fetalHeartRate, maternalPulse, bpSys, bpDia, notes } = body;

        const entry = await prisma.partographEntry.create({
            data: {
                laborRecordId,
                dilation: parseFloat(dilation),
                descent: parseInt(descent),
                contractions: parseInt(contractions),
                fetalHeartRate: parseInt(fetalHeartRate),
                maternalPulse: parseInt(maternalPulse),
                bpSys: parseInt(bpSys),
                bpDia: parseInt(bpDia),
                notes,
                tenantId: session.tenantId
            }
        });

        return NextResponse.json({ entry }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/maternity/partograph]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const laborRecordId = searchParams.get('laborRecordId');

        if (!laborRecordId) {
            return NextResponse.json({ error: 'Labor Record ID required' }, { status: 400 });
        }

        const entries = await prisma.partographEntry.findMany({
            where: { laborRecordId, tenantId: session.tenantId },
            orderBy: { timestamp: 'asc' }
        });

        return NextResponse.json({ entries }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/maternity/partograph]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
