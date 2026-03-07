import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function POST(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized or no tenant' }, { status: 401 });
        }

        const data = await request.json();

        if (!data.wardId || !data.bedNumber) {
            return NextResponse.json({ error: 'wardId and bedNumber are required' }, { status: 400 });
        }

        // Check if bed number already exists in this ward
        const existingBed = await prisma.bed.findFirst({
            where: {
                wardId: data.wardId,
                bedNumber: data.bedNumber
            }
        });

        if (existingBed) {
            return NextResponse.json({ error: 'Bed number already exists in this ward' }, { status: 400 });
        }

        const newBed = await prisma.bed.create({
            data: {
                tenantId: session.tenantId,
                wardId: data.wardId,
                bedNumber: data.bedNumber.trim(),
                status: data.status || 'Vacant'
            }
        });

        return NextResponse.json({ ok: true, bed: newBed }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/facility/beds]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized or no tenant' }, { status: 401 });
        }

        const url = new URL(request.url);
        const bedId = url.searchParams.get('bedId');

        if (!bedId) {
            return NextResponse.json({ error: 'bedId is required' }, { status: 400 });
        }

        await prisma.bed.delete({
            where: { id: bedId, tenantId: session.tenantId }
        });

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err) {
        console.error('[DELETE /api/facility/beds]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Bulk create beds for a ward.
export async function PUT(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized or no tenant' }, { status: 401 });
        }

        const data = await request.json();
        const { wardId, prefix, startNumber, count } = data;

        if (!wardId || startNumber === undefined || !count) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const newBedsData = [];
        for (let i = 0; i < Number(count); i++) {
            const bedNumber = `${prefix ? prefix + '-' : ''}${Number(startNumber) + i}`;
            newBedsData.push({
                tenantId: session.tenantId,
                wardId,
                bedNumber,
                status: 'Vacant'
            });
        }

        // use createMany (skip duplicates in production, simple here)
        await prisma.bed.createMany({
            data: newBedsData
        });

        const updatedBeds = await prisma.bed.findMany({
            where: { wardId }
        });

        return NextResponse.json({ ok: true, beds: updatedBeds }, { status: 201 });
    } catch (err) {
        console.error('[PUT /api/facility/beds]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
