import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized or no tenant' }, { status: 401 });
        }

        const appointments = await prisma.appointment.findMany({
            where: { tenantId: session.tenantId },
            include: { patient: true },
            orderBy: [{ date: 'asc' }, { time: 'asc' }]
        });

        return NextResponse.json({ appointments }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/appointments]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized or no tenant' }, { status: 401 });
        }

        const data = await request.json();

        if (!data.patientName || !data.doctorName || !data.date) {
            return NextResponse.json({ error: 'Missing required fields: patientName, doctorName, date' }, { status: 400 });
        }

        const randNum = Math.floor(1000 + Math.random() * 9000);
        const apptCode = `APT-${randNum}`;

        const newAppointment = await prisma.appointment.create({
            data: {
                tenantId: session.tenantId,
                apptCode,
                patientName: data.patientName.trim(),
                patientId: data.patientId || null,
                doctorName: data.doctorName.trim(),
                department: data.department ? data.department.trim() : null,
                date: data.date,
                time: data.time || null,
                type: 'OPD',
                status: 'Scheduled',
            }
        });

        return NextResponse.json({ ok: true, appointment: newAppointment }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/appointments]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
