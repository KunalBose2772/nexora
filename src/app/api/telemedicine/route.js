import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const today = new Date().toISOString().split('T')[0];

        // Fetching appointments tagged as Teleconsults
        const teleconsults = await prisma.appointment.findMany({
            where: {
                tenantId: session.tenantId,
                type: 'Teleconsult',
                date: { gte: today }
            },
            orderBy: [{ date: 'asc' }, { time: 'asc' }]
        });

        return NextResponse.json({ teleconsults });
    } catch (err) {
        console.error('Telemedicine GET error:', err);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();

        // Safe insertion back into Appointment schema
        const newCall = await prisma.appointment.create({
            data: {
                tenantId: session.tenantId,
                apptCode: `VID-${Math.floor(1000 + Math.random() * 9000)}`,
                patientName: data.patientName,
                patientId: data.patientId || null,
                doctorName: data.doctorName,
                department: data.department || 'Virtual Clinic',
                date: data.date,
                time: data.time,
                type: 'Teleconsult',
                status: 'Scheduled',
                admitNotes: `[PORTAL LINK SENT] Virtual Room Status: Waiting.`
            }
        });

        return NextResponse.json({ message: 'Meeting Generated', call: newCall }, { status: 201 });
    } catch (err) {
        console.error('Telemedicine POST Error:', err);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
