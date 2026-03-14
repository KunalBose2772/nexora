// GET /api/subscriptions — returns all tenants with their subscription plan data
// PATCH /api/subscriptions/[id] — updates a tenant's plan or payment status
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

const PLAN_PRICES = {
    'Starter Tier': '₹4,999',
    'Basic Quarterly': '₹7,499',
    'Professional Monthly': '₹9,999',
    'Professional Annual': '₹8,499',
    'Enterprise Annual': '₹45,000',
    'Enterprise Custom': 'Custom',
};

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || session.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const tenants = await prisma.tenant.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                slug: true,
                plan: true,
                status: true,
                adminEmail: true,
                createdAt: true,
                _count: { select: { users: true, patients: true } },
            },
        });

        // Map tenants to subscription shape
        const subscriptions = tenants.map(t => ({
            id: t.id,
            name: t.name,
            slug: t.slug,
            plan: t.plan,
            amount: PLAN_PRICES[t.plan] || '₹9,999',
            status: t.status === 'Active' ? 'Active'
                : t.status === 'Suspended' ? 'Suspended'
                    : t.status === 'Payment Due' ? 'Past Due'
                        : t.status,
            email: t.adminEmail,
            users: t._count.users,
            patients: t._count.patients,
            since: t.createdAt,
        }));

        // Compute summary MRR (rough)
        const mrr = tenants.reduce((sum, t) => {
            const price = parseInt((PLAN_PRICES[t.plan] || '₹9999').replace(/[^0-9]/g, '')) || 0;
            return t.status === 'Active' ? sum + price : sum;
        }, 0);

        return NextResponse.json({
            subscriptions,
            summary: {
                total: tenants.length,
                active: tenants.filter(t => t.status === 'Active').length,
                pastDue: tenants.filter(t => t.status === 'Payment Due').length,
                suspended: tenants.filter(t => t.status === 'Suspended').length,
                mrr,
            },
        });
    } catch (err) {
        console.error('[GET /api/subscriptions]', err);
        return NextResponse.json({ error: 'Failed to load subscriptions.', detail: err.message }, { status: 500 });
    }
}
