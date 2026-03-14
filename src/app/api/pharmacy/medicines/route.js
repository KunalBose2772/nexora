import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

// GET — list all medicines in inventory
export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const medicines = await prisma.medicine.findMany({
            where: { tenantId: session.tenantId },
            orderBy: { name: 'asc' },
        });

        return NextResponse.json({ medicines });
    } catch (error) {
        console.error('Fetch Medicines Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST — add a new medicine to inventory
export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const { name, genericName, manufacturer, category, batchNumber, expiryDate, mrp, costPrice, stock, minThreshold } = data;

        if (!name) return NextResponse.json({ error: 'Medicine name is required' }, { status: 400 });

        const count = await prisma.medicine.count({ where: { tenantId: session.tenantId } });
        const drugCode = `MED-${String(count + 1001).padStart(4, '0')}`;

        const medicine = await prisma.medicine.create({
            data: {
                drugCode,
                name: name.trim(),
                genericName: genericName || null,
                manufacturer: manufacturer || null,
                category: category || 'Tablet',
                batchNumber: batchNumber || null,
                expiryDate: expiryDate || null,
                mrp: parseFloat(mrp) || 0,
                costPrice: parseFloat(costPrice) || 0,
                stock: parseInt(stock) || 0,
                minThreshold: parseInt(minThreshold) || 50,
                tenantId: session.tenantId,
            }
        });

        return NextResponse.json({ medicine }, { status: 201 });
    } catch (error) {
        console.error('Add Medicine Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT — update stock (set total OR receive a new batch with optional batch/expiry/mrp update)
export async function PUT(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { id, mode } = body;
        if (!id) return NextResponse.json({ error: 'Medicine ID required' }, { status: 400 });

        let updateData = {};

        if (mode === 'receive') {
            // Receive new incoming stock batch — INCREMENT quantity, optionally update batch/expiry/mrp
            const { qtyToAdd, batchNumber, expiryDate, mrp, costPrice } = body;
            const qty = parseInt(qtyToAdd) || 0;
            if (qty <= 0) return NextResponse.json({ error: 'Quantity to add must be greater than 0' }, { status: 400 });

            updateData = {
                stock: { increment: qty },
                ...(batchNumber && { batchNumber }),
                ...(expiryDate && { expiryDate }),
                ...(mrp !== undefined && mrp !== '' && { mrp: parseFloat(mrp) }),
                ...(costPrice !== undefined && costPrice !== '' && { costPrice: parseFloat(costPrice) }),
            };
        } else {
            // Default: set stock to exact total
            updateData = { stock: parseInt(body.stock) };
        }

        const updated = await prisma.medicine.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ medicine: updated });
    } catch (error) {
        console.error('Update Medicine Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
