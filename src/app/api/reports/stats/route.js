import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const tenantId = session.tenantId;

        const [
            totalPatients,
            totalAppointments,
            opdCount,
            ipdCount,
            labRequests,
            labPending,
            labReady,
            medicines,
            dispensations,
            invoices,
            staff,
        ] = await Promise.all([
            prisma.patient.count({ where: { tenantId } }),
            prisma.appointment.count({ where: { tenantId } }),
            prisma.appointment.count({ where: { tenantId, type: 'OPD' } }),
            prisma.appointment.count({ where: { tenantId, type: 'IPD' } }),
            prisma.labRequest.count({ where: { tenantId } }),
            prisma.labRequest.count({ where: { tenantId, status: 'Pending' } }),
            prisma.labRequest.count({ where: { tenantId, status: 'Result Ready' } }),
            prisma.medicine.count({ where: { tenantId } }),
            prisma.dispensation.findMany({ where: { tenantId }, select: { netAmount: true, createdAt: true } }),
            prisma.invoice.findMany({ where: { tenantId }, select: { netAmount: true, status: true, serviceType: true, createdAt: true } }),
            prisma.user.count({ where: { tenantId, status: 'Active' } }),
        ]);

        const pharmacyRevenue = dispensations.reduce((s, d) => s + d.netAmount, 0);
        const billingRevenue = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.netAmount, 0);
        const pendingRevenue = invoices.filter(i => i.status === 'Pending').reduce((s, i) => s + i.netAmount, 0);
        const totalRevenue = pharmacyRevenue + billingRevenue;

        // Revenue by service type
        const byService = {};
        invoices.forEach(i => {
            byService[i.serviceType] = (byService[i.serviceType] || 0) + i.netAmount;
        });

        // Low stock count
        const lowStockMeds = await prisma.medicine.count({
            where: { tenantId, stock: { lt: prisma.medicine.fields.minThreshold } }
        }).catch(() => 0);

        const isAdmin = session.role === 'admin' || session.role === 'hospital_admin' || session.role === 'accountant';

        return NextResponse.json({
            userRole: session.role,
            totalPatients,
            totalAppointments,
            opdCount,
            ipdCount,
            labRequests,
            labPending,
            labReady,
            medicines,
            // Only expose detailed revenue to admins
            pharmacyRevenue: isAdmin ? pharmacyRevenue : 0,
            billingRevenue: isAdmin ? billingRevenue : 0,
            pendingRevenue: isAdmin ? pendingRevenue : 0,
            totalRevenue: isAdmin ? totalRevenue : 0,
            staff,
            byService: isAdmin ? byService : {},
            dispensationCount: dispensations.length,
            invoiceCount: invoices.length,
        });
    } catch (error) {
        console.error('Reports API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
