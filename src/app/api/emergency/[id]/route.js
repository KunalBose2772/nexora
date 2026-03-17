import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const appointment = await prisma.appointment.findFirst({
            where: {
                tenantId: session.tenantId,
                type: 'EMERGENCY',
                OR: [
                    { id: id },
                    { apptCode: id }
                ]
            },
            include: {
                patient: true
            }
        });

        if (!appointment) {
            return NextResponse.json({ error: 'Emergency case not found' }, { status: 404 });
        }

        return NextResponse.json({ appointment }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/emergency/[id]] Error:', err);
        return NextResponse.json({ error: 'Internal server error', details: err.message }, { status: 500 });
    }
}
