import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const { appointmentId, type, noteData } = data;

        if (!appointmentId || !noteData) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const appointment = await prisma.appointment.findFirst({
            where: { id: appointmentId, tenantId: session.tenantId }
        });

        if (!appointment) return NextResponse.json({ error: 'IPD Record not found' }, { status: 404 });

        const timeStamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });
        let logLine = '';

        if (type === 'vitals') {
            const { bp, pulse, temp, spo2 } = noteData;
            logLine = `[VITALS @ ${timeStamp} (Nurse ID-${session.id})] BP: ${bp}, Pulse: ${pulse}, Temp: ${temp}, SpO2: ${spo2}%`;
        } else if (type === 'medication') {
            logLine = `[MEDICATION GIVEN @ ${timeStamp} (Nurse ID-${session.id})] Administered: ${noteData.drugName}`;
        } else {
            logLine = `[NURSING NOTE @ ${timeStamp} (Nurse ID-${session.id})] ${noteData.note}`;
        }

        // Prepend the new log to the existing notes so the latest is on top
        const updatedNotes = appointment.admitNotes
            ? `${logLine}\n${appointment.admitNotes}`
            : logLine;

        await prisma.appointment.update({
            where: { id: appointmentId },
            data: { admitNotes: updatedNotes }
        });

        return NextResponse.json({ ok: true, newLog: logLine });

    } catch (err) {
        console.error('Nursing Log Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
