import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Fetch CSSD Batches safely using the generic Appointment model to bypass schema limits
        const batches = await prisma.appointment.findMany({
            where: {
                tenantId: session.tenantId,
                type: 'CSSD'
            },
            orderBy: { createdAt: 'desc' }
        });

        // Also fetch upcoming Surgeries so CSSD tech can see what instrument trays are needed soon
        const today = new Date().toISOString().split('T')[0];
        const upcomingSurgeries = await prisma.appointment.findMany({
            where: {
                tenantId: session.tenantId,
                type: 'Surgery',
                date: { gte: today }
            },
            orderBy: [{ date: 'asc' }, { time: 'asc' }],
            take: 10
        });

        return NextResponse.json({ batches, upcomingSurgeries });
    } catch (err) {
        console.error('CSSD Fetch Error:', err);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();

        const batchId = `CSSD-B${Math.floor(1000 + Math.random() * 9000)}`;

        const newBatch = await prisma.appointment.create({
            data: {
                tenantId: session.tenantId,
                apptCode: batchId,
                // Patient Name stores Trays/Items securely
                patientName: data.trayTypes,
                // Doctor Name stores Tech name
                doctorName: data.techName,
                // Department stores the machine info
                department: data.autoclaveId,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-US', { hour12: false }).substring(0, 5),
                type: 'CSSD',
                // Using Status for process mapping
                status: 'Autoclaving',
                admitNotes: `[STERILIZATION TYPE: ${data.sterilizationMethod}] Cycle Temp: ${data.cycleTemp}°C | Target OT: ${data.targetOT || 'General Store'}`
            }
        });

        return NextResponse.json({ message: 'Batch Started', batch: newBatch }, { status: 201 });
    } catch (error) {
        console.error('CSSD Create Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, newStatus } = await req.json();

        const updatedBatch = await prisma.appointment.update({
            where: { id, tenantId: session.tenantId },
            data: { status: newStatus }
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('CSSD Update Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
