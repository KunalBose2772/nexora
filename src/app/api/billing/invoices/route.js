import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const invoices = await prisma.invoice.findMany({
            where: { tenantId: session.tenantId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ invoices });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const { patientName, patientUhId, patientId, serviceType, amount, discount, paymentMethod, notes } = data;

        if (!patientName || !amount) return NextResponse.json({ error: 'Patient name and amount are required' }, { status: 400 });

        const count = await prisma.invoice.count({ where: { tenantId: session.tenantId } });
        const year = new Date().getFullYear();
        const invoiceCode = `INV-${year}-${String(count + 1).padStart(4, '0')}`;

        const discountAmt = parseFloat(amount) * ((parseFloat(discount) || 0) / 100);
        const taxAmt = (parseFloat(amount) - discountAmt) * 0.05; // 5% tax
        const netAmount = parseFloat(amount) - discountAmt + taxAmt;

        const invoice = await prisma.invoice.create({
            data: {
                invoiceCode,
                patientName,
                patientUhId: patientUhId || null,
                patientId: patientId || null,
                serviceType: serviceType || 'OPD Consult',
                amount: parseFloat(amount),
                discount: parseFloat(discount) || 0,
                tax: taxAmt,
                netAmount,
                paymentMethod: paymentMethod || 'Cash',
                status: 'Paid',
                notes: notes || null,
                tenantId: session.tenantId,
            }
        });

        return NextResponse.json({ invoice }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, status } = await req.json();
        if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });

        const updated = await prisma.invoice.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json({ invoice: updated });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
