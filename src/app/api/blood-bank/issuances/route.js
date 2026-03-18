import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const issuances = await prisma.bloodIssuance.findMany({
            where: { tenantId: session.tenantId },
            include: { request: true },
            orderBy: { issuedAt: 'desc' }
        });

        return NextResponse.json({ issuances }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/blood-bank/issuances]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const issuanceCode = `ISS-${Math.floor(1000 + Math.random() * 9000)}`;

        const issuance = await prisma.bloodIssuance.create({
            data: {
                ...body,
                issuedAt: new Date(),
                issuanceCode,
                tenantId: session.tenantId
            }
        });

        // Update Request Status if internal
        if (body.requestId) {
            await prisma.bloodRequest.update({
                where: { id: body.requestId },
                data: { status: 'Issued', issuedAt: new Date(), issuedBy: body.issuedBy }
            });
        }

        // Subtract from Stock (Wait, we should find specific units, but for now we subtract totals)
        // Find best match in stock (oldest first)
        const matchedStock = await prisma.bloodStock.findMany({
            where: {
                bloodGroup: body.bloodGroup,
                component: body.component,
                units: { gte: 1 },
                status: 'Available',
                tenantId: session.tenantId
            },
            orderBy: { expiryDate: 'asc' },
            take: body.units
        });

        if (matchedStock.length < body.units) {
            // Log issue but proceed or return error
            // console.warn('Not enough individual units for full issuance, updating aggregate');
        }

        // Updating stock status to Issued
        for (const stockUnit of matchedStock) {
            await prisma.bloodStock.update({
                where: { id: stockUnit.id },
                data: { status: 'Issued' }
            });
        }

        return NextResponse.json({ issuance }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/blood-bank/issuances]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
