import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

// GET — list all purchase orders
export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const supplierId = searchParams.get('supplierId');

        const purchaseOrders = await prisma.purchaseOrder.findMany({
            where: {
                tenantId: session.tenantId,
                ...(supplierId && { supplierId }),
            },
            include: {
                supplier: { select: { name: true } },
                _count: { select: { items: true } }
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ purchaseOrders });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// POST — create new purchase order
export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const { supplierId, notes, items = [] } = data;

        if (!supplierId || items.length === 0) {
            return NextResponse.json({ error: 'Supplier and at least one item are required' }, { status: 400 });
        }

        const count = await prisma.purchaseOrder.count({ where: { tenantId: session.tenantId } });
        const poNumber = `PO-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

        const totalAmount = items.reduce((acc, item) => acc + (parseFloat(item.unitPrice) * parseInt(item.quantity)), 0);

        const purchaseOrder = await prisma.purchaseOrder.create({
            data: {
                poNumber,
                notes: notes || null,
                totalAmount,
                status: 'Issued',
                supplierId,
                tenantId: session.tenantId,
                items: {
                    create: items.map(item => ({
                        medicineId: item.medicineId,
                        quantity: parseInt(item.quantity),
                        unitPrice: parseFloat(item.unitPrice),
                        totalPrice: parseFloat(item.unitPrice) * parseInt(item.quantity),
                    }))
                }
            },
            include: { items: true, supplier: true }
        });

        return NextResponse.json({ purchaseOrder }, { status: 201 });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
