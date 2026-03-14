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
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }

        return NextResponse.json({ appointment }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/appointments/[id]]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        // Security check: ensure it belongs to the active tenant
        const existing = await prisma.appointment.findFirst({
            where: {
                tenantId: session.tenantId,
                OR: [
                    { id: id },
                    { apptCode: id }
                ]
            }
        });

        if (!existing) {
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }

        // Prevent updates if record is locked
        if (existing.isLocked) {
            return NextResponse.json({ error: 'This record is legally locked and cannot be modified.' }, { status: 403 });
        }

        const updatedAppointment = await prisma.appointment.update({
            where: { id: existing.id },
            data: {
                status: data.status !== undefined ? data.status : existing.status,
                date: data.date || existing.date,
                time: data.time || existing.time,
                doctorName: data.doctorName || existing.doctorName,
                department: data.department || existing.department,
                paymentStatus: data.paymentStatus !== undefined ? data.paymentStatus : existing.paymentStatus,
                isLocked: data.isLocked !== undefined ? data.isLocked : existing.isLocked
            }
        });

        return NextResponse.json({ ok: true, appointment: updatedAppointment }, { status: 200 });
    } catch (err) {
        console.error('[PUT /api/appointments/[id]]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
