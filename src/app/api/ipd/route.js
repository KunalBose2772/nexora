import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized or no tenant' }, { status: 401 });
        }

        const ipdPatients = await prisma.appointment.findMany({
            where: { tenantId: session.tenantId, type: 'IPD' },
            include: { patient: true },
            orderBy: [{ date: 'desc' }, { time: 'desc' }]
        });

        return NextResponse.json({ ipdPatients }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/ipd]', err);
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

        if (!data.patientName || !data.doctorName || !data.date || !data.ward || !data.bed) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const randNum = Math.floor(1000 + Math.random() * 9000);
        const apptCode = `IPD-${randNum}`;

        const newAdmission = await prisma.appointment.create({
            data: {
                tenantId: session.tenantId,
                apptCode,
                patientName: data.patientName.trim(),
                patientId: data.patientId || null,
                doctorName: data.doctorName.trim(),
                department: data.department ? data.department.trim() : null,
                date: data.date,
                time: data.time || null,
                type: 'IPD',
                status: 'Admitted',
                ward: data.ward.trim(),
                bed: data.bed.trim(),
                admitNotes: data.admitNotes ? data.admitNotes.trim() : null,
            }
        });

        return NextResponse.json({ ok: true, admission: newAdmission }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/ipd]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
