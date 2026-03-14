import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const emergencyCases = await prisma.appointment.findMany({
            where: {
                tenantId: session.tenantId,
                type: 'EMERGENCY',
                status: { notIn: ['Discharged', 'Cancelled'] }
            },
            include: { patient: true },
            orderBy: [
                { triageLevel: 'asc' }, // Higher priority (1) first
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json({ appointments: emergencyCases });
    } catch (err) {
        console.error('[GET /api/emergency/triage]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, triageLevel, triageColor, triageNotes, triageVitals, status } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Missing appointment ID' }, { status: 400 });
        }

        const updateData = {};
        if (triageLevel !== undefined) updateData.triageLevel = triageLevel;
        if (triageColor !== undefined) updateData.triageColor = triageColor;
        if (triageNotes !== undefined) updateData.triageNotes = triageNotes;
        if (triageVitals !== undefined) updateData.triageVitals = JSON.stringify(triageVitals);
        if (status !== undefined) updateData.status = status;

        // Auto-set triageAt if first time triaging
        updateData.triageAt = new Date();

        const updatedAppointment = await prisma.appointment.update({
            where: { id, tenantId: session.tenantId },
            data: updateData
        });

        await logAudit({
            tenantId: session.tenantId,
            userId: session.userId,
            userName: session.name,
            userRole: session.role,
            action: 'UPDATE_TRIAGE',
            resourceType: 'Appointment',
            resourceId: updatedAppointment.id,
            details: `Updated triage for emergency case ${updatedAppointment.apptCode}. New Level: ${updatedAppointment.triageLevel}`,
            newValue: updatedAppointment
        });

        return NextResponse.json({ ok: true, appointment: updatedAppointment });
    } catch (err) {
        console.error('[PATCH /api/emergency/triage]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
