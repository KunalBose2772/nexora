import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request, { params }) {
    try {
        // Next.js 15+ correctly resolves dynamic params as a Promise
        const { id } = await params;

        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const patient = await prisma.patient.findFirst({
            where: {
                OR: [
                    { id: id },
                    { patientCode: id }
                ],
                tenantId: session.tenantId
            },
            include: {
                appointments: {
                    orderBy: { date: 'desc' }
                },
                records: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!patient) {
            return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
        }

        return NextResponse.json({ patient }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/patients/[id]]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
