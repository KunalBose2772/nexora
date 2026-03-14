import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const pendingReleases = await prisma.appointment.findMany({
            where: {
                tenantId: session.tenantId,
                type: 'IPD',
                status: 'Discharge Initiated'
            },
            orderBy: [{ updatedAt: 'desc' }]
        });

        // Parse clearances out of notes
        const mapped = pendingReleases.map(p => {
            const block = p.admitNotes?.match(/\[CLEARANCE\] WARD:(.*?) \| PHARMACY:(.*?) \| FINANCE:(.*?)\n/);
            return {
                ...p,
                clearances: {
                    ward: block ? block[1].trim() : 'Pending',
                    pharmacy: block ? block[2].trim() : 'Pending',
                    finance: block ? block[3].trim() : 'Pending'
                }
            };
        });

        return NextResponse.json({ patients: mapped });
    } catch (e) {
        console.error('Clearance GET Error', e);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, dept, newState } = await req.json(); // dept can be 'WARD', 'PHARMACY', 'FINANCE'

        const appointment = await prisma.appointment.findUnique({ where: { id, tenantId: session.tenantId } });
        if (!appointment) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        let currentNotes = appointment.admitNotes || '';
        const regex = /\[CLEARANCE\] WARD:(.*?) \| PHARMACY:(.*?) \| FINANCE:(.*?)\n/;
        const match = currentNotes.match(regex);

        if (!match) return NextResponse.json({ error: 'No clearance block found' }, { status: 400 });

        let cWard = match[1].trim();
        let cPharm = match[2].trim();
        let cFin = match[3].trim();

        if (dept === 'WARD') cWard = newState;
        if (dept === 'PHARMACY') cPharm = newState;
        if (dept === 'FINANCE') cFin = newState;

        const updatedBlock = `[CLEARANCE] WARD:${cWard} | PHARMACY:${cPharm} | FINANCE:${cFin}\n`;
        const nextNotes = currentNotes.replace(regex, updatedBlock);

        // Check if fully cleared
        const isFullyCleared = cWard === 'Cleared' && cPharm === 'Cleared' && cFin === 'Cleared';

        const updatedApt = await prisma.appointment.update({
            where: { id },
            data: {
                admitNotes: nextNotes,
                status: isFullyCleared ? 'Discharged' : 'Discharge Initiated'
            }
        });

        // If fully cleared, vacate the bed
        if (isFullyCleared && appointment.ward && appointment.bed) {
            const ward = await prisma.ward.findFirst({
                where: { tenantId: session.tenantId, name: appointment.ward }
            });

            if (ward) {
                const bedRecord = await prisma.bed.findFirst({
                    where: { wardId: ward.id, bedNumber: appointment.bed }
                });

                if (bedRecord && bedRecord.status === 'Occupied') {
                    await prisma.bed.update({
                        where: { id: bedRecord.id },
                        data: { status: 'Vacant' }
                    });
                }
            }
        }

        return NextResponse.json({ ok: true, isFullyCleared });
    } catch (e) {
        console.error('Clearance PUT Error', e);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
