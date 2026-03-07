import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

// GET — list dispensation history
export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const dispensations = await prisma.dispensation.findMany({
            where: { tenantId: session.tenantId },
            include: { items: { include: { medicine: { select: { name: true, drugCode: true } } } } },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ dispensations });
    } catch (error) {
        console.error('Fetch Dispensations Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST — complete a dispensation / sale
export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const { patientName, patientUhId, patientId, prescribedBy, discount, cartItems } = data;

        if (!patientName || !cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: 'Patient name and cart items are required' }, { status: 400 });
        }

        // Compute totals
        const subtotal = cartItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

        // Compute real cost price from DB
        let totalCost = 0;
        const validCartItems = [];
        for (const item of cartItems) {
            const dbMed = await prisma.medicine.findUnique({
                where: { id: item.medicineId },
                select: { costPrice: true }
            });
            if (dbMed) {
                totalCost += (dbMed.costPrice || 0) * item.quantity;
                validCartItems.push(item);
            }
        }

        const discountAmount = subtotal * ((parseFloat(discount) || 0) / 100);
        const taxAmount = (subtotal - discountAmount) * 0.12; // 12% GST approx
        const netAmount = subtotal - discountAmount + taxAmount;

        const count = await prisma.dispensation.count({ where: { tenantId: session.tenantId } });
        const billCode = `RX-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

        // Create dispensation + items + decrement stock in a transaction
        const dispensation = await prisma.$transaction(async (tx) => {
            const disp = await tx.dispensation.create({
                data: {
                    billCode,
                    patientName,
                    patientUhId: patientUhId || null,
                    patientId: patientId || null,
                    prescribedBy: prescribedBy || null,
                    discount: parseFloat(discount) || 0,
                    subtotal,
                    totalCost,
                    tax: taxAmount,
                    netAmount,
                    tenantId: session.tenantId,
                    items: {
                        create: validCartItems.map(item => ({
                            medicineId: item.medicineId,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            totalPrice: item.unitPrice * item.quantity,
                        }))
                    }
                }
            });

            // Decrement stock
            for (const item of cartItems) {
                await tx.medicine.update({
                    where: { id: item.medicineId },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            return disp;
        });

        return NextResponse.json({ dispensation, billCode }, { status: 201 });
    } catch (error) {
        console.error('Create Dispensation Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
