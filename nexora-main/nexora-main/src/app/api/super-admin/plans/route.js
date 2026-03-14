import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || session.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const plans = await prisma.subscriptionPlan.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Get tenant counts per plan
        const tenantCounts = await prisma.tenant.groupBy({
            by: ['plan'],
            _count: {
                id: true
            }
        });

        const plansWithCounts = plans.map(p => {
            const match = tenantCounts.find(t => t.plan === p.name);
            return {
                ...p,
                features: p.features ? JSON.parse(p.features) : [],
                tenantsCount: match ? match._count.id : 0
            };
        });

        return NextResponse.json({ plans: plansWithCounts });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to find plans.', detail: err.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || session.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const data = await request.json();

        const newPlan = await prisma.subscriptionPlan.create({
            data: {
                planCode: `PLN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                name: data.name,
                price: data.price,
                maxUsers: data.maxUsers.toString(),
                maxBranches: data.maxBranches.toString(),
                features: JSON.stringify(data.features),
                status: data.status
            }
        });

        return NextResponse.json({ ok: true, plan: { ...newPlan, features: JSON.parse(newPlan.features), tenantsCount: 0 } });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to create plan.', detail: err.message }, { status: 500 });
    }
}
