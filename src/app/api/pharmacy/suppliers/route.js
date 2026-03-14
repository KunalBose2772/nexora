import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

// GET — list all suppliers
export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const suppliers = await prisma.supplier.findMany({
            where: { tenantId: session.tenantId },
            orderBy: { name: 'asc' },
        });

        return NextResponse.json({ suppliers });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// POST — add new supplier
export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const { name, contactPerson, email, phone, address, gstNumber } = data;

        if (!name) return NextResponse.json({ error: 'Supplier name is required' }, { status: 400 });

        const supplier = await prisma.supplier.create({
            data: {
                name,
                contactPerson: contactPerson || null,
                email: email || null,
                phone: phone || null,
                address: address || null,
                gstNumber: gstNumber || null,
                tenantId: session.tenantId,
            }
        });

        return NextResponse.json({ supplier }, { status: 201 });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
