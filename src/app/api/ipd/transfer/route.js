import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { appointmentId, newWardId, newBedNumber } = await req.json();

        if (!appointmentId || !newWardId || !newBedNumber) {
            return NextResponse.json({ error: 'Missing transfer parameters' }, { status: 400 });
        }

        // 1. Fetch current admission
        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId, tenantId: session.tenantId }
        });

        if (!appointment) return NextResponse.json({ error: 'Admission record not found' }, { status: 404 });

        // 2. Locate New Ward & Bed
        const newWard = await prisma.ward.findUnique({ where: { id: newWardId, tenantId: session.tenantId } });
        if (!newWard) return NextResponse.json({ error: 'Target ward not found' }, { status: 404 });

        const targetBed = await prisma.bed.findFirst({
            where: { wardId: newWardId, bedNumber: newBedNumber }
        });

        if (!targetBed) return NextResponse.json({ error: 'Target bed not found' }, { status: 404 });
        if (targetBed.status === 'Occupied') return NextResponse.json({ error: 'Target bed is already occupied' }, { status: 409 });

        // 3. Execution - Atomic updates for bed status
        // A. Vacate old bed
        if (appointment.ward && appointment.bed) {
            const oldWard = await prisma.ward.findFirst({ where: { tenantId: session.tenantId, name: appointment.ward } });
            if (oldWard) {
                const oldBed = await prisma.bed.findFirst({ where: { wardId: oldWard.id, bedNumber: appointment.bed } });
                if (oldBed) {
                    await prisma.bed.update({ where: { id: oldBed.id }, data: { status: 'Vacant' } });
                }
            }
        }

        // B. Occupy new bed
        await prisma.bed.update({ where: { id: targetBed.id }, data: { status: 'Occupied' } });

        // C. Update Appointment Record
        const transferLog = `\n[TRANSFER: ${new Date().toLocaleString()}] Moved from ${appointment.ward}/${appointment.bed} to ${newWard.name}/${newBedNumber} by ${session.email}`;
        
        const updated = await prisma.appointment.update({
            where: { id: appointment.id },
            data: {
                ward: newWard.name,
                bed: newBedNumber,
                admitNotes: (appointment.admitNotes || '') + transferLog
            }
        });

        return NextResponse.json({ ok: true, appointment: updated });

    } catch (e) {
        console.error('Transfer API Error:', e);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
