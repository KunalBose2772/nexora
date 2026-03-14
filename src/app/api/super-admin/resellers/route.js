import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || session.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const resellers = await prisma.reseller.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ ok: true, resellers });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to load resellers.', detail: err.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || session.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const data = await request.json();

        const reseller = await prisma.reseller.create({
            data: {
                name: data.name,
                contact: data.contact,
                email: data.email,
                revShare: data.revShare,
                status: data.status || 'Active',
                hospitals: data.hospitals || 0
            }
        });

        await prisma.systemLog.create({
            data: {
                title: 'New Reseller Onboarded',
                description: `Reseller ${data.name} was added.`,
                type: 'success'
            }
        });

        return NextResponse.json({ ok: true, reseller });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to create reseller.', detail: err.message }, { status: 500 });
    }
}
