import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Since we can't alter the schema for a new 'Surgery' table without stopping the server,
        // we'll store OT Schedules in the generic Appointment table with type = 'Surgery'

        const surgeries = await prisma.appointment.findMany({
            where: {
                tenantId: session.tenantId,
                type: 'Surgery'
            },
            orderBy: [
                { date: 'asc' },
                { time: 'asc' }
            ]
        });

        return NextResponse.json({ surgeries });
    } catch (error) {
        console.error('Fetch Surgeries Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();

        // Simulate creating an OT Block
        const newSurgery = await prisma.appointment.create({
            data: {
                apptCode: `OT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                patientName: data.patientName,
                patientId: data.patientId || null,
                doctorName: data.surgeonName,
                department: data.otRoom || 'Main OT',
                date: data.date,
                time: data.time,
                type: 'Surgery',
                status: 'Scheduled',
                admitNotes: `[PRE-OP CHECKLIST: ${data.checklistCleared ? 'CLEARED' : 'PENDING'}] Surgery: ${data.surgeryType} | Implant Serial: ${data.implantSerial || 'N/A'} | Anesthesia: ${data.anesthesiaRequired ? 'Yes' : 'No'}`,
                tenantId: session.tenantId,
            }
        });

        return NextResponse.json({ message: 'Surgery Scheduled', surgery: newSurgery }, { status: 201 });
    } catch (error) {
        console.error('Create Surgery Error:', error);
        return NextResponse.json({ error: 'Failed to schedule surgery' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();

        const updatedSurgery = await prisma.appointment.update({
            where: { id: data.id, tenantId: session.tenantId },
            data: { status: data.status, admitNotes: data.notes }
        });

        return NextResponse.json({ ok: true, surgery: updatedSurgery });
    } catch (error) {
        console.error('Update Surgery Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
