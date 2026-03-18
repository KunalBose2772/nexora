import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const donors = await prisma.bloodDonor.findMany({
            where: { tenantId: session.tenantId },
            orderBy: { createdAt: 'desc' },
            include: { donations: true }
        });

        return NextResponse.json({ donors }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/blood-bank/donors]', err);
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
        const donorCode = `DNR-${Math.floor(1000 + Math.random() * 9000)}`;

        const donor = await prisma.bloodDonor.create({
            data: {
                ...body,
                donorCode,
                tenantId: session.tenantId
            }
        });

        return NextResponse.json({ donor }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/blood-bank/donors]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
