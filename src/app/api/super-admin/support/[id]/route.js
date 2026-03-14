import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function PATCH(request, { params }) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || session.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const data = await request.json();
        const ticketId = params.id;

        const updatedTicket = await prisma.supportTicket.update({
            where: { id: ticketId },
            data: {
                status: data.status,
                reply: data.reply
            }
        });

        return NextResponse.json({ ok: true, ticket: updatedTicket });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update ticket.' }, { status: 500 });
    }
}
