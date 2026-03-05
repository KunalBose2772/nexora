import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    const session = await getSessionFromRequest(request);
    if (!session || session.role !== 'superadmin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const requests = await prisma.demoRequest.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ ok: true, requests });
    } catch (err) {
        console.error('[GET /api/demo-request/list]', err);
        return NextResponse.json({ error: 'Failed to fetch demo requests.' }, { status: 500 });
    }
}
