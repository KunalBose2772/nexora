import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Calculate Shift/Today's Revenue metrics strictly for "Cash" transactions
        // In a real shift-based system, we would filter by `createdAt >= shiftStartTime`
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const cashInvoices = await prisma.invoice.findMany({
            where: {
                tenantId: session.tenantId,
                status: 'Paid',
                paymentMethod: 'Cash',
                createdAt: {
                    gte: today
                }
            }
        });

        // Other payment methods (UPI, Card) don't involve physical drawer cash
        const digitalInvoices = await prisma.invoice.findMany({
            where: {
                tenantId: session.tenantId,
                status: 'Paid',
                paymentMethod: { not: 'Cash' },
                createdAt: {
                    gte: today
                }
            }
        });

        const expectedCash = cashInvoices.reduce((sum, inv) => sum + inv.netAmount, 0);
        const digitalCash = digitalInvoices.reduce((sum, inv) => sum + inv.netAmount, 0);

        return NextResponse.json({
            expectedCash,
            digitalCash,
            totalTransactions: cashInvoices.length + digitalInvoices.length
        });

    } catch (error) {
        console.error('Handover GET Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();

        // As database schemas are locked, we mimic a successful shift closure
        // In reality, this would save to a `ShiftHandover` table comparing expected vs declared cash.

        console.log(`[SHIFT CLOSED] User ${session.email} declared ₹${data.declaredCash} vs Expected ₹${data.expectedCash}. Variance: ₹${data.variance}`);

        return NextResponse.json({ ok: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
