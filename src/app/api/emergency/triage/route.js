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

        const { searchParams } = new URL(request.url);
        const view = searchParams.get('view');

        const where = {
            tenantId: session.tenantId,
            type: 'EMERGENCY'
        };

        if (view === 'history') {
            where.status = { in: ['Discharged', 'Cancelled'] };
        } else {
            where.status = { notIn: ['Discharged', 'Cancelled'] };
        }

        const emergencyCases = await prisma.appointment.findMany({
            where: where,
            include: { patient: true },
            orderBy: [
                { triageLevel: 'asc' }, // Higher priority (1) first
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json({ appointments: emergencyCases });
    } catch (err) {
        console.error('[GET /api/emergency/triage] Error:', err);
        return NextResponse.json({ error: 'Internal server error', details: err.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        console.log('[PATCH /api/emergency/triage] body:', body);
        const { id, triageLevel, triageColor, triageNotes, triageVitals, status } = body;

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
            where: { id: id },
            data: updateData
        });

        try {
            await logAudit({
                session: session,
                action: 'UPDATE_TRIAGE',
                resource: 'Appointment',
                resourceId: updatedAppointment.id,
                description: `Updated triage/status for emergency case ${updatedAppointment.apptCode}. New Status: ${updatedAppointment.status}`,
                newValue: updatedAppointment
            });
        } catch (auditErr) {
            console.error('[PATCH /api/emergency/triage] Audit Log Failed:', auditErr);
        }

        return NextResponse.json({ ok: true, appointment: updatedAppointment });
    } catch (err) {
        console.error('[PATCH /api/emergency/triage] Error:', err);
        return NextResponse.json({ error: 'Internal server error', details: err.message }, { status: 500 });
    }
}
