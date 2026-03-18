import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const inventory = await prisma.medicine.findMany({
            where: { tenantId: session.tenantId },
            orderBy: { stock: 'asc' }
        });

        const suppliers = await prisma.supplier.findMany({
            where: { tenantId: session.tenantId }
        });

        const activePOs = await prisma.purchaseOrder.findMany({
            where: {
                tenantId: session.tenantId,
                status: { notIn: ['Received', 'Cancelled'] }
            },
            include: { supplier: true }
        });

        const stats = {
            totalItems: inventory.length,
            lowStock: inventory.filter(i => i.stock <= i.minThreshold).length,
            outOfStock: inventory.filter(i => i.stock === 0).length,
            activePOs: activePOs.length
        };

        return NextResponse.json({ inventory, suppliers, activePOs, stats }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/inventory]', err);
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
        const { medicineId, type, quantity, notes } = body;

        // Atomic transaction to update stock and log adjustment
        const result = await prisma.$transaction(async (tx) => {
            const adjustment = await tx.stockAdjustment.create({
                data: {
                    medicineId,
                    type,
                    quantity: parseInt(quantity),
                    notes,
                    tenantId: session.tenantId,
                }
            });

            const medicine = await tx.medicine.update({
                where: { id: medicineId },
                data: {
                    stock: {
                        decrement: parseInt(quantity)
                    }
                }
            });

            return { adjustment, medicine };
        });

        await logAudit({
            req: request,
            session,
            action: 'UPDATE',
            resource: 'Inventory',
            resourceId: medicineId,
            description: `Stock adjustment: ${type} for ${result.medicine.name} (-${quantity} units)`,
            newValue: result.adjustment
        });

        return NextResponse.json({ ok: true, result }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/inventory]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
