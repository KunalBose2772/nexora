import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

// GET — Fetch grievances for the logged-in patient
export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session || session.role !== 'patient') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const grievances = await prisma.grievance.findMany({
            where: { patientId: session.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ grievances });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST — Submit a new grievance
export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session || session.role !== 'patient') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const { subject, description, category, priority } = data;

        if (!subject || !description || !category) {
            return NextResponse.json({ error: 'Subject, description and category are required' }, { status: 400 });
        }

        // Generate Ticket ID: GRV-12345
        const count = await prisma.grievance.count({ where: { tenantId: session.tenantId } });
        const ticketId = `GRV-${String(count + 1001).padStart(5, '0')}`;

        const grievance = await prisma.grievance.create({
            data: {
                ticketId,
                subject,
                description,
                category,
                priority: priority || 'Normal',
                patientId: session.id,
                patientName: session.name,
                tenantId: session.tenantId,
            }
        });

        return NextResponse.json({ grievance }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
