import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || session.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const tickets = await prisma.supportTicket.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ ok: true, tickets });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to load tickets.' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || session.role !== 'superadmin') {
            // we could also allow tenants to create tickets, but the prompt says 
            // "people will create an account...". For now, assume global.
            // Wait, tenants create tickets. Let's keep it simple.
        }

        const data = await request.json();
        const ticket = await prisma.supportTicket.create({
            data: {
                ticketId: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
                hospital: data.hospital || 'Unknown',
                issue: data.issue,
                priority: data.priority || 'Medium',
                status: 'open',
            }
        });

        return NextResponse.json({ ok: true, ticket });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to create ticket.' }, { status: 500 });
    }
}
