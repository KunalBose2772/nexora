import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const expenses = await prisma.expense.findMany({
            where: { tenantId: session.tenantId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ ok: true, expenses });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await request.json();

        let voucherId = `EXP-${Math.floor(1000 + Math.random() * 9000)}`;

        const expense = await prisma.expense.create({
            data: {
                tenantId: session.tenantId,
                voucherId: voucherId,
                date: data.date,
                category: data.category,
                vendor: data.vendor,
                status: data.status,
                amount: parseFloat(data.amount) || 0
            }
        });

        // Add a system log for super admin
        await prisma.systemLog.create({
            data: {
                title: 'New Expense Recorded',
                description: `Tenant ${session.tenantId} recorded expense ${voucherId}`,
                type: 'info'
            }
        });

        return NextResponse.json({ ok: true, expense });
    } catch (error) {
        console.error("Expense POST Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
