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
        const { appointmentId, scoreType, scoreValue, parameters } = body;

        const score = await prisma.icuScore.create({
            data: {
                appointmentId,
                tenantId: session.tenantId,
                scoreType,
                scoreValue: parseInt(scoreValue),
                parameters: typeof parameters === 'string' ? parameters : JSON.stringify(parameters)
            }
        });

        return NextResponse.json({ score }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/icu/scores]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const appointmentId = searchParams.get('appointmentId');

        const scores = await prisma.icuScore.findMany({
            where: { appointmentId, tenantId: session.tenantId },
            orderBy: { recordedAt: 'desc' }
        });

        return NextResponse.json({ scores }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
