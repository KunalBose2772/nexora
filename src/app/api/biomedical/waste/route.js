import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const logs = await prisma.appointment.findMany({
            where: { tenantId: session.tenantId, type: 'WasteLog' },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        const formatted = logs.map(l => {
            const [collectionTime, weight] = l.time ? l.time.split('|') : ['', '0'];
            return {
                id: l.id,
                date: l.date,
                category: l.department, // Color Code
                wasteType: l.patientName, 
                collectedBy: l.doctorName,
                weight: weight || '0',
                collectionTime: collectionTime || '',
                status: l.status
            };
        });

        return NextResponse.json({ logs: formatted });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const { date, category, wasteType, collectedBy, weight, collectionTime } = data;

        const newLog = await prisma.appointment.create({
            data: {
                tenantId: session.tenantId,
                apptCode: `BMW-${Math.floor(1000 + Math.random() * 9000)}`,
                date,
                time: `${collectionTime}|${weight}`,
                department: category,
                patientName: wasteType,
                doctorName: collectedBy,
                type: 'WasteLog',
                status: 'Handed Over'
            }
        });

        await logAudit({
            req, session,
            action: 'CREATE',
            resource: 'BiomedicalWaste',
            resourceId: newLog.id,
            description: `Waste collection log created for ${category} category (${weight} kg)`,
            newValue: newLog
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
