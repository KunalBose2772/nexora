// GET /api/dashboard/stats — full tenant-level stats for dashboard
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const tenantId = session.tenantId;

        if (!tenantId) {
            return NextResponse.json({ stats: {}, tenant: null, appointments: [], revenueByMonth: [], revenueByService: [] });
        }

        const todayStr = new Date().toISOString().slice(0, 10);
        // Start of today (for revenue today)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const [
            patients, appointments, users, todayApts, pendingApts, tenant, recentApts,
            ipdAdmissions,
            labPending, labTotal,
            medicineCount, pendingDispenses,
            invoiceStats, todayRevenue, pendingDues,
            revenueByService,
            pharmacySales,
            activeEmergency, criticalEmergency,
            criticalIcu,
            otBookings,
            bloodRequests, lowBloodStock,
        ] = await Promise.all([
            prisma.patient.count({ where: { tenantId } }),
            prisma.appointment.count({ where: { tenantId } }),
            prisma.user.count({ where: { tenantId, role: { not: 'superadmin' } } }),
            prisma.appointment.count({ where: { tenantId, date: { startsWith: todayStr } } }),
            prisma.appointment.count({ where: { tenantId, status: { in: ['Scheduled', 'Waiting'] } } }),
            prisma.tenant.findUnique({ where: { id: tenantId }, select: { name: true, slug: true, plan: true, primaryColor: true, logoInitials: true } }),
            prisma.appointment.findMany({
                where: { tenantId },
                take: 8,
                orderBy: { createdAt: 'desc' },
                include: { patient: { select: { firstName: true, lastName: true, patientCode: true } } },
            }),
            // IPD — count active inpatients
            prisma.appointment.count({ where: { tenantId, type: 'IPD', status: { in: ['Admitted', 'Scheduled', 'In Progress'] } } }),
            // Lab
            prisma.labRequest.count({ where: { tenantId, status: { in: ['Pending', 'Received', 'Processing'] } } }),
            prisma.labRequest.count({ where: { tenantId } }),
            // Pharmacy inventory
            prisma.medicine.count({ where: { tenantId } }),
            prisma.dispensation.count({ where: { tenantId, status: 'Pending' } }).catch(() => 0),
            // Billing totals
            prisma.invoice.aggregate({ where: { tenantId, status: 'Paid' }, _sum: { netAmount: true }, _count: true }).catch(() => ({ _sum: { netAmount: 0 }, _count: 0 })),
            // Revenue today
            prisma.invoice.aggregate({ where: { tenantId, status: 'Paid', createdAt: { gte: todayStart } }, _sum: { netAmount: true } }).catch(() => ({ _sum: { netAmount: 0 } })),
            // Outstanding dues
            prisma.invoice.aggregate({ where: { tenantId, status: 'Pending' }, _sum: { netAmount: true }, _count: true }).catch(() => ({ _sum: { netAmount: 0 }, _count: 0 })),
            // Revenue by service type
            prisma.invoice.groupBy({ by: ['serviceType'], where: { tenantId, status: 'Paid' }, _sum: { netAmount: true }, orderBy: { _sum: { netAmount: 'desc' } } }).catch(() => []),
            // Pharmacy dispensations totals
            prisma.dispensation.aggregate({ where: { tenantId, status: 'Completed' }, _sum: { netAmount: true, totalCost: true } }).catch(() => ({ _sum: { netAmount: 0, totalCost: 0 } })),
            // Emergency stats
            prisma.appointment.count({ where: { tenantId, type: 'EMERGENCY', status: { notIn: ['Discharged', 'Cancelled'] } } }),
            prisma.appointment.count({ where: { tenantId, type: 'EMERGENCY', triageLevel: { in: [1, 2] }, status: { notIn: ['Discharged', 'Cancelled'] } } }),
            // ICU stats
            prisma.icuMonitoring.count({
                where: {
                    tenant: { id: tenantId },
                    recordedAt: { gte: new Date(Date.now() - 3600000) }, // entries in last hour
                    OR: [
                        { spo2: { lt: 90 } },
                        { heartRate: { gt: 130 } }
                    ]
                }
            }).catch(() => 0),
            // OT stats
            prisma.surgery.count({ where: { tenantId, status: 'Scheduled' } }),
            // Blood Bank
            prisma.bloodRequest.count({ where: { tenantId, status: 'Pending' } }),
            prisma.bloodStock.count({ where: { tenantId, units: { lt: 5 }, status: 'Available' } }),
        ]);

        // Low stock count using a raw approach since Prisma doesn't support field comparisons directly
        const lowStockMeds = await prisma.medicine.findMany({
            where: { tenantId },
            select: { stock: true, minThreshold: true }
        });
        const lowStock = lowStockMeds.filter(m => m.stock < m.minThreshold).length;

        // Build last 6 months revenue from invoices
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const paidInvoices = await prisma.invoice.findMany({
            where: { tenantId, status: 'Paid', createdAt: { gte: sixMonthsAgo } },
            select: { netAmount: true, createdAt: true }
        });

        // Group by month
        const monthMap = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        paidInvoices.forEach(inv => {
            const d = new Date(inv.createdAt);
            const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            monthMap[key] = (monthMap[key] || 0) + inv.netAmount;
        });

        const now = new Date();
        const revenueByMonth = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            revenueByMonth.push({ month: monthNames[d.getMonth()], revenue: Math.round(monthMap[key] || 0) });
        }

        return NextResponse.json({
            stats: {
                patients,
                appointments,
                users,
                todayAppointments: todayApts,
                pendingAppointments: pendingApts,
                ipdAdmissions,
                labPending,
                labTotal,
                medicineCount,
                lowStock,
                totalRevenue: Math.round((invoiceStats._sum?.netAmount || 0) + (pharmacySales._sum?.netAmount || 0)),
                todayRevenue: Math.round(todayRevenue._sum?.netAmount || 0),
                pharmacyRevenue: Math.round(pharmacySales._sum?.netAmount || 0),
                pharmacyCost: Math.round(pharmacySales._sum?.totalCost || 0),
                pharmacyProfit: Math.round((pharmacySales._sum?.netAmount || 0) - (pharmacySales._sum?.totalCost || 0)),
                pendingDuesAmount: Math.round(pendingDues._sum?.netAmount || 0),
                pendingDuesCount: pendingDues._count || 0,
                paidInvoiceCount: invoiceStats._count || 0,
                activeEmergency,
                criticalEmergency,
                criticalIcu,
                otBookings,
                bloodRequests,
                lowBloodStock,
            },
            tenant,
            appointments: recentApts.map(apt => ({
                ...apt,
                patientDisplayName: apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : apt.patientName,
            })),
            revenueByMonth,
            revenueByService: revenueByService.map(r => ({
                service: r.serviceType,
                amount: Math.round(r._sum?.netAmount || 0),
            })),
        });
    } catch (err) {
        console.error('[GET /api/dashboard/stats]', err);
        return NextResponse.json({ error: 'Failed.', detail: err.message }, { status: 500 });
    }
}
