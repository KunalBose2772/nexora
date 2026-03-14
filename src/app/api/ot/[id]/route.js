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

        const surgery = await prisma.surgery.findFirst({
            where: {
                id: id,
                tenantId: session.tenantId
            },
            include: {
                patient: true,
                appointment: true,
                checklist: true,
                anesthesia: true
            }
        });

        if (!surgery) {
            return NextResponse.json({ error: 'Surgery record not found' }, { status: 404 });
        }

        return NextResponse.json({ surgery }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/ot/[id]]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { status, postOpDiagnosis, findings, bloodLoss, checklist, anesthesia } = body;

        // Update main surgery record
        const updatedSurgery = await prisma.surgery.update({
            where: { id: id },
            data: {
                status,
                postOpDiagnosis,
                findings,
                bloodLoss: bloodLoss ? parseFloat(bloodLoss) : undefined,
                endTime: status === 'Completed' ? new Date() : undefined
            }
        });

        // Update Checklist if provided
        if (checklist) {
            await prisma.surgeryChecklist.upsert({
                where: { surgeryId: id },
                update: checklist,
                create: { ...checklist, surgeryId: id }
            });
        }

        // Update Anesthesia if provided
        if (anesthesia) {
            await prisma.anesthesiaRecord.upsert({
                where: { surgeryId: id },
                update: anesthesia,
                create: { ...anesthesia, surgeryId: id }
            });
        }

        return NextResponse.json({ message: 'Surgery record updated' }, { status: 200 });
    } catch (err) {
        console.error('[PATCH /api/ot/[id]]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
