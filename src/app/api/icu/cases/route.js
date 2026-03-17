import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const cases = await prisma.appointment.findMany({
            where: {
                tenantId: session.tenantId,
                OR: [
                    { status: { in: ['Admitted', 'In Progress'] }, ward: { contains: 'ICU' } },
                    { status: { in: ['Admitted', 'In Progress'] }, department: { contains: 'ICU' } },
                    { status: { contains: 'Referred: ICU' } }
                ]
            },
            include: {
                patient: true,
                icuMonitoring: {
                    orderBy: { recordedAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ cases }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/icu/cases]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
