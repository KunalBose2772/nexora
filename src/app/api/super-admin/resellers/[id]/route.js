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

        const reseller = await prisma.reseller.update({
            where: { id: params.id },
            data: data
        });

        await prisma.systemLog.create({
            data: {
                title: 'Reseller Updated',
                description: `Reseller ${reseller.name} was updated.`,
                type: 'info'
            }
        });

        return NextResponse.json({ ok: true, reseller });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update reseller.', detail: err.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || session.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await prisma.reseller.delete({
            where: { id: params.id }
        });

        await prisma.systemLog.create({
            data: {
                title: 'Reseller Deleted',
                description: `A reseller was permanently removed.`,
                type: 'warning'
            }
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete reseller.', detail: err.message }, { status: 500 });
    }
}
