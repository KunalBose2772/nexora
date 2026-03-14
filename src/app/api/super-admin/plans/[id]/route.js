import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function PATCH(request, { params }) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || session.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const data = await request.json();
        const planId = params.id;

        const updatedPlan = await prisma.subscriptionPlan.update({
            where: { id: planId },
            data: {
                name: data.name,
                price: data.price,
                maxUsers: data.maxUsers.toString(),
                maxBranches: data.maxBranches.toString(),
                features: JSON.stringify(data.features),
                status: data.status
            }
        });

        return NextResponse.json({ ok: true, plan: { ...updatedPlan, features: JSON.parse(updatedPlan.features) } });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update plan.', detail: err.message }, { status: 500 });
    }
}
