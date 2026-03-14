import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

// GET — individual PO details
export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const po = await prisma.purchaseOrder.findFirst({
            where: { id, tenantId: session.tenantId },
            include: {
                supplier: true,
                items: { include: { medicine: true } }
            }
        });

        if (!po) return NextResponse.json({ error: 'Purchase Order not found' }, { status: 404 });

        return NextResponse.json({ purchaseOrder: po });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// PATCH — receive items / update status
export async function PATCH(req, { params }) {
    try {
        const { id } = await params;
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const { type, items = [] } = data; // type: 'Receive'

        const existingPo = await prisma.purchaseOrder.findFirst({
            where: { id, tenantId: session.tenantId },
            include: { items: true }
        });

        if (!existingPo) return NextResponse.json({ error: 'Purchase Order not found' }, { status: 404 });

        if (type === 'Receive') {
            // Transactional update: update PO items received counts AND increment medicine stock
            await prisma.$transaction(async (tx) => {
                for (const receiveData of items) {
                    const item = existingPo.items.find(i => i.id === receiveData.itemId);
                    if (!item) continue;

                    const additionalQuantity = parseInt(receiveData.quantity) || 0;
                    if (additionalQuantity <= 0) continue;

                    // Update PO Item
                    await tx.purchaseOrderItem.update({
                        where: { id: item.id },
                        data: { receivedQuantity: { increment: additionalQuantity } }
                    });

                    // Update Medicine Stock
                    await tx.medicine.update({
                        where: { id: item.medicineId },
                        data: { stock: { increment: additionalQuantity } }
                    });
                }

                // Check if PO is now fully received
                const updatedPo = await tx.purchaseOrder.findUnique({
                    where: { id },
                    include: { items: true }
                });

                const allReceived = updatedPo.items.every(i => i.receivedQuantity >= i.quantity);
                const partiallyReceived = updatedPo.items.some(i => i.receivedQuantity > 0);

                await tx.purchaseOrder.update({
                    where: { id },
                    data: {
                        status: allReceived ? 'Received' : partiallyReceived ? 'Partially Received' : 'Issued'
                    }
                });
            });

            const finalPo = await prisma.purchaseOrder.findUnique({
                where: { id },
                include: { items: { include: { medicine: true } }, supplier: true }
            });

            return NextResponse.json({ purchaseOrder: finalPo });
        }

        return NextResponse.json({ error: 'Invalid operation type' }, { status: 400 });
    } catch (e) {
        console.error("PO Patch Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
