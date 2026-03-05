// GET /api/dashboard/stats — tenant-level stats for the hospital admin dashboard
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const tenantId = session.tenantId;

        // Superadmin has no tenant, return empty/zeroes
        if (!tenantId) {
            return NextResponse.json({
                stats: { patients: 0, appointments: 0, users: 0, todayAppointments: 0, pendingAppointments: 0 },
                tenant: null,
                appointments: [],
            });
        }

        // Date string for today (appointments use String date field in schema)
        const todayStr = new Date().toISOString().slice(0, 10); // "2026-02-28"

        const [patients, appointments, users, todayApts, pendingApts, tenant, recentApts] = await Promise.all([
            prisma.patient.count({ where: { tenantId } }),
            prisma.appointment.count({ where: { tenantId } }),
            prisma.user.count({ where: { tenantId, role: { not: 'superadmin' } } }),
            // today's appointments — date field is String (ISO date), filter by startsWith
            prisma.appointment.count({ where: { tenantId, date: { startsWith: todayStr } } }),
            prisma.appointment.count({ where: { tenantId, status: { in: ['Scheduled', 'Waiting'] } } }),
            prisma.tenant.findUnique({
                where: { id: tenantId },
                select: { name: true, slug: true, plan: true, primaryColor: true },
            }),
            prisma.appointment.findMany({
                where: { tenantId },
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    // Patient has firstName + lastName, not name
                    patient: { select: { firstName: true, lastName: true, patientCode: true } },
                },
            }),
        ]);

        return NextResponse.json({
            stats: {
                patients,
                appointments,
                users,
                todayAppointments: todayApts,
                pendingAppointments: pendingApts,
            },
            tenant,
            // Normalize patient name for frontend
            appointments: recentApts.map(apt => ({
                ...apt,
                patientDisplayName: apt.patient
                    ? `${apt.patient.firstName} ${apt.patient.lastName}`
                    : apt.patientName, // fallback to denormalized field
            })),
        });
    } catch (err) {
        console.error('[GET /api/dashboard/stats]', err);
        return NextResponse.json({ error: 'Failed.', detail: err.message }, { status: 500 });
    }
}
