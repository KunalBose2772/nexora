import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

// GET — list advances
export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const searchParams = new URL(req.url).searchParams;
        const patientId = searchParams.get('patientId');

        const advances = await prisma.advanceDeposit.findMany({
            where: { 
                tenantId: session.tenantId,
                ...(patientId ? { patientId } : {})
            },
            include: { patient: { select: { firstName: true, lastName: true, patientCode: true } } },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ advances });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST — record new advance
export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const { patientId, amount, paymentMethod, notes } = data;

        if (!patientId || !amount) {
            return NextResponse.json({ error: 'Patient and Amount are required' }, { status: 400 });
        }

        // Generate Code: ADV-2024-001
        const year = new Date().getFullYear();
        const count = await prisma.advanceDeposit.count({
            where: { tenantId: session.tenantId, createdAt: { gte: new Date(`${year}-01-01`) } }
        });
        const receiptCode = `ADV-${year}-${(count + 1).toString().padStart(4, '0')}`;

        const advance = await prisma.advanceDeposit.create({
            data: {
                receiptCode,
                amount: parseFloat(amount),
                paymentMethod,
                notes,
                patientId,
                tenantId: session.tenantId,
                status: 'Available'
            },
            include: { patient: { select: { firstName: true, lastName: true, patientCode: true } } }
        });

        return NextResponse.json({ advance });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
