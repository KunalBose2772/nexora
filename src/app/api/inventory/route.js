import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

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
