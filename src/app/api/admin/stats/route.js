// GET /api/admin/stats — real platform-level counts for the super admin overview
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || session.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const [
            totalTenants,
            activeTenants,
            suspendedTenants,
            paymentDueTenants,
            totalUsers,
            totalPatients,
            totalAppointments,
            recentTenants,
        ] = await Promise.all([
            prisma.tenant.count(),
            prisma.tenant.count({ where: { status: 'Active' } }),
            prisma.tenant.count({ where: { status: 'Suspended' } }),
            prisma.tenant.count({ where: { status: 'Payment Due' } }),
            // don't count superadmin themselves
            prisma.user.count({ where: { role: { not: 'superadmin' } } }),
            prisma.patient.count(),
            prisma.appointment.count(),
            prisma.tenant.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    plan: true,
                    status: true,
                    createdAt: true,
                    // _count works with correct relation names from schema
                    _count: { select: { users: true, patients: true, appointments: true } },
                },
            }),
        ]);

        return NextResponse.json({
            stats: {
                totalTenants,
                activeTenants,
                suspendedTenants,
                paymentDueTenants,
                totalUsers,
                totalPatients,
                totalAppointments,
            },
            recentTenants,
        });
    } catch (err) {
        console.error('[GET /api/admin/stats]', err);
        return NextResponse.json({ error: 'Failed to load stats.', detail: err.message }, { status: 500 });
    }
}
