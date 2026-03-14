import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function POST(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized or no tenant' }, { status: 401 });
        }

        const data = await request.json();

        if (!data.appointmentId || !data.finalDiagnosis) {
            return NextResponse.json({ error: 'Missing required fields (appointmentId, finalDiagnosis)' }, { status: 400 });
        }

        const appointment = await prisma.appointment.findFirst({
            where: { id: data.appointmentId, tenantId: session.tenantId }
        });

        if (!appointment) {
            return NextResponse.json({ error: 'Admission record not found' }, { status: 404 });
        }

        // Setup the discharge note block to append to the existing admitNotes
        const finalNotes = `
[Discharged on ${new Date().toLocaleDateString()}]
Final Diagnosis: ${data.finalDiagnosis}
Condition: ${data.dischargeNotes || 'Not provided'}
Follow-Up: ${data.followUpDate || 'SOS'}

[CLEARANCE] WARD:Pending | PHARMACY:Pending | FINANCE:Pending

${appointment.admitNotes || ''}
        `.trim();

        // 1. Update Appointment to Discharge Initiated (Moves to Clearance Queue)
        const discharged = await prisma.appointment.update({
            where: { id: appointment.id },
            data: {
                status: 'Discharge Initiated',
                admitNotes: finalNotes
            }
        });

        // Bed is intentionally NOT vacated here. It is vacated upon final Finance Clearance.

        return NextResponse.json({ ok: true, appointment: discharged }, { status: 200 });

    } catch (err) {
        console.error('[POST /api/ipd/discharge]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
