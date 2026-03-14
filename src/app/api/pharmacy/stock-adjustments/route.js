import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

/**
 * GET — list recent stock adjustments
 */
export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const adjustments = await prisma.stockAdjustment.findMany({
            where: { tenantId: session.tenantId },
            include: { medicine: { select: { name: true, drugCode: true } } },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        return NextResponse.json({ adjustments });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

/**
 * POST — Create a new adjustment (Damaged / Return to Vendor)
 */
export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { medicineId, type, quantity, notes, adjustmentPrice } = await req.json();

        if (!medicineId || !type || !quantity) {
            return NextResponse.json({ error: 'Incomplete data' }, { status: 400 });
        }

        // Use transaction to ensure consistency
        const adjustment = await prisma.$transaction(async (tx) => {
            // 1. Record the adjustment
            const log = await tx.stockAdjustment.create({
                data: {
                    medicineId,
                    type,
                    quantity: parseInt(quantity),
                    notes: notes || null,
                    adjustmentPrice: parseFloat(adjustmentPrice || 0),
                    tenantId: session.tenantId
                }
            });

            // 2. Decrement the medicine stock (all adjustments here are removals)
            // If it's a 'Rectification' and positive, we might need a different logic, 
            // but for Damaged/Return/Expired it's always a decrement.
            await tx.medicine.update({
                where: { id: medicineId },
                data: { stock: { decrement: parseInt(quantity) } }
            });

            return log;
        });

        return NextResponse.json({ adjustment }, { status: 201 });
    } catch (e) {
        console.error("Adjustment Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
