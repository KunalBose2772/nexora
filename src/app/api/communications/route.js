import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const logs = await prisma.communicationLog.findMany({
            where: { tenantId: session.tenantId },
            orderBy: { createdAt: 'desc' },
            take: 100
        });

        return NextResponse.json({ logs }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/communications]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
