import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const surgeries = await prisma.surgery.findMany({
            where: {
                tenantId: session.tenantId
            },
            include: {
                patient: true
            },
            orderBy: [
                { startTime: 'asc' },
                { createdAt: 'desc' }
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

        const randCode = `SUR-${Math.floor(1000 + Math.random() * 9000)}`;

        const newSurgery = await prisma.surgery.create({
            data: {
                surgeryCode: randCode,
                patientId: data.patientId,
                procedureName: data.procedureName,
                surgeonName: data.surgeonName,
                otRoom: data.otRoom || 'Main OT',
                status: 'Scheduled',
                anesthesiaType: data.anesthesiaType || 'General',
                preOpDiagnosis: data.preOpDiagnosis || '',
                tenantId: session.tenantId,
            },
            include: {
                patient: true
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
