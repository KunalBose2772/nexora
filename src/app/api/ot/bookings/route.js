import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const surgeries = await prisma.surgery.findMany({
            where: {
                tenantId: session.tenantId,
                status: { not: 'Cancelled' }
            },
            include: {
                patient: {
                    select: { firstName: true, lastName: true, patientCode: true }
                }
            },
            orderBy: { startTime: 'asc' }
        });

        return NextResponse.json({ surgeries }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/ot/bookings]', err);
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
        const {
            patientId, appointmentId, procedureName, otRoom,
            surgeonName, assistantNames, anesthetistName, scrubNurseName,
            startTime, anesthesiaType, preOpDiagnosis
        } = body;

        const surgeryCode = `SUR-${Date.now().toString().slice(-6)}`;

        const surgery = await prisma.surgery.create({
            data: {
                surgeryCode,
                patientId,
                appointmentId,
                procedureName,
                otRoom,
                surgeonName,
                assistantNames,
                anesthetistName,
                scrubNurseName,
                startTime: startTime ? new Date(startTime) : null,
                anesthesiaType,
                preOpDiagnosis,
                tenantId: session.tenantId,
                checklist: {
                    create: {} // Create empty checklist
                }
            }
        });

        return NextResponse.json({ surgery }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/ot/bookings]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
