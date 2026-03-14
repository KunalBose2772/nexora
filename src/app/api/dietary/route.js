import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Fetch all active IPD Admissions
        const ipdPatients = await prisma.appointment.findMany({
            where: {
                tenantId: session.tenantId,
                type: 'IPD',
                status: 'Admitted'
            },
            orderBy: [{ ward: 'asc' }, { bed: 'asc' }]
        });

        // Parse Diet out of admitNotes (default to 'Regular' if nothing found)
        const parsedPatients = ipdPatients.map(p => {
            const dietMatch = p.admitNotes?.match(/\[DIET:\s*(.+?)\]/);
            const diet = dietMatch ? dietMatch[1] : 'Regular';
            return {
                id: p.id,
                patientName: p.patientName,
                ward: p.ward,
                bed: p.bed,
                diet: diet,
                doctorName: p.doctorName,
                notes: p.admitNotes
            };
        });

        // Compute aggregations for kitchen prep load
        const totalMeals = parsedPatients.length;
        const dietSummary = parsedPatients.reduce((acc, p) => {
            acc[p.diet] = (acc[p.diet] || 0) + 1;
            return acc;
        }, {});

        return NextResponse.json({ patients: parsedPatients, summary: dietSummary, totalMeals });
    } catch (error) {
        console.error('Dietary GET Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, newDiet } = await req.json();

        // Fetch current record to append/replace the DIET tag safely
        const currentApt = await prisma.appointment.findUnique({
            where: { id, tenantId: session.tenantId }
        });

        if (!currentApt) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        let updatedNotes = currentApt.admitNotes || '';

        if (/\[DIET:\s*.+?\]/.test(updatedNotes)) {
            updatedNotes = updatedNotes.replace(/\[DIET:\s*.+?\]/, `[DIET: ${newDiet}]`);
        } else {
            updatedNotes = updatedNotes + `\n[DIET: ${newDiet}]`;
        }

        const updatedApt = await prisma.appointment.update({
            where: { id },
            data: { admitNotes: updatedNotes }
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Dietary PUT Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
