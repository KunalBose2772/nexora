import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const branches = await prisma.branch.findMany({
            where: { tenantId: session.tenantId },
            orderBy: { createdAt: 'asc' },
        });

        return NextResponse.json({ branches });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const { name, facilityType, city, state, address, phone, email, beds, notes } = data;

        if (!name) return NextResponse.json({ error: 'Branch name is required' }, { status: 400 });

        const count = await prisma.branch.count({ where: { tenantId: session.tenantId } });
        const branchCode = `BR-${String(count + 1).padStart(3, '0')}`;

        const branch = await prisma.branch.create({
            data: {
                branchCode,
                name,
                facilityType: facilityType || 'Outpatient',
                city: city || null,
                state: state || null,
                address: address || null,
                phone: phone || null,
                email: email || null,
                beds: beds || null,
                notes: notes || null,
                status: 'Operational',
                tenantId: session.tenantId,
            }
        });

        return NextResponse.json({ branch }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, status, ...rest } = await req.json();
        if (!id) return NextResponse.json({ error: 'Branch ID required' }, { status: 400 });

        const updated = await prisma.branch.update({
            where: { id },
            data: { ...(status && { status }), ...rest }
        });

        return NextResponse.json({ branch: updated });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Branch ID required' }, { status: 400 });

        await prisma.branch.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
