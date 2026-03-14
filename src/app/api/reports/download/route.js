import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

function toCSV(rows, headers) {
    const escape = (v) => {
        if (v === null || v === undefined) return '';
        const s = String(v);
        return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [headers.join(',')];
    for (const row of rows) lines.push(headers.map(h => escape(row[h])).join(','));
    return lines.join('\n');
}

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') || 'revenue';
        const tenantId = session.tenantId;

        // Strict RBAC Check
        const isAdmin = session.role === 'admin' || session.role === 'hospital_admin' || session.role === 'accountant';
        const financialReports = ['revenue', 'dues'];
        if (financialReports.includes(type) && !isAdmin) {
            return NextResponse.json({ error: 'Access Denied: You do not have permission to download financial records.' }, { status: 403 });
        }

        let csv = '';
        let filename = 'report.csv';

        if (type === 'revenue') {
            filename = 'monthly-revenue-summary.csv';
            const invoices = await prisma.invoice.findMany({
                where: { tenantId },
                orderBy: { createdAt: 'desc' },
                select: { invoiceCode: true, patientName: true, patientUhId: true, serviceType: true, amount: true, discount: true, tax: true, netAmount: true, paymentMethod: true, status: true, createdAt: true }
            });
            const rows = invoices.map(i => ({
                invoiceCode: i.invoiceCode,
                patientName: i.patientName,
                patientUhId: i.patientUhId || '',
                serviceType: i.serviceType,
                amount: i.amount.toFixed(2),
                discount: i.discount.toFixed(2),
                tax: i.tax.toFixed(2),
                netAmount: i.netAmount.toFixed(2),
                paymentMethod: i.paymentMethod,
                status: i.status,
                createdAt: new Date(i.createdAt).toLocaleString('en-IN'),
            }));
            csv = toCSV(rows, ['invoiceCode', 'patientName', 'patientUhId', 'serviceType', 'amount', 'discount', 'tax', 'netAmount', 'paymentMethod', 'status', 'createdAt']);
        }

        else if (type === 'opd') {
            filename = 'opd-footfall-report.csv';
            const appts = await prisma.appointment.findMany({
                where: { tenantId },
                orderBy: { createdAt: 'desc' },
                select: { apptCode: true, patientName: true, doctorName: true, department: true, date: true, time: true, type: true, status: true, createdAt: true }
            });
            csv = toCSV(appts.map(a => ({
                ...a,
                createdAt: new Date(a.createdAt).toLocaleString('en-IN')
            })), ['apptCode', 'patientName', 'doctorName', 'department', 'date', 'time', 'type', 'status', 'createdAt']);
        }

        else if (type === 'pharmacy') {
            filename = 'pharmacy-stock-valuation.csv';
            const meds = await prisma.medicine.findMany({
                where: { tenantId },
                orderBy: { name: 'asc' },
                select: { drugCode: true, name: true, genericName: true, manufacturer: true, category: true, batchNumber: true, expiryDate: true, mrp: true, stock: true, minThreshold: true }
            });
            const rows = meds.map(m => ({
                ...m,
                genericName: m.genericName || '',
                manufacturer: m.manufacturer || '',
                batchNumber: m.batchNumber || '',
                expiryDate: m.expiryDate || '',
                stockValue: (m.mrp * m.stock).toFixed(2),
                stockStatus: m.stock === 0 ? 'Stock-Out' : m.stock < m.minThreshold ? 'Re-Order' : 'Healthy'
            }));
            csv = toCSV(rows, ['drugCode', 'name', 'genericName', 'manufacturer', 'category', 'batchNumber', 'expiryDate', 'mrp', 'stock', 'minThreshold', 'stockValue', 'stockStatus']);
        }

        else if (type === 'lab') {
            filename = 'lab-test-utilization.csv';
            const labs = await prisma.labRequest.findMany({
                where: { tenantId },
                orderBy: { createdAt: 'desc' },
                select: { trackingId: true, patientName: true, patientUhId: true, testName: true, category: true, status: true, amount: true, referringDoctor: true, collectionTime: true, createdAt: true }
            });
            csv = toCSV(labs.map(l => ({
                ...l,
                patientUhId: l.patientUhId || '',
                referringDoctor: l.referringDoctor || '',
                collectionTime: l.collectionTime || '',
                amount: l.amount.toFixed(2),
                createdAt: new Date(l.createdAt).toLocaleString('en-IN')
            })), ['trackingId', 'patientName', 'patientUhId', 'testName', 'category', 'status', 'amount', 'referringDoctor', 'collectionTime', 'createdAt']);
        }

        else if (type === 'staff') {
            filename = 'staff-directory.csv';
            const staff = await prisma.user.findMany({
                where: { tenantId },
                select: { userId: true, name: true, email: true, role: true, department: true, phone: true, joinDate: true, specialization: true, status: true }
            });
            csv = toCSV(staff.map(s => ({
                ...s,
                department: s.department || '',
                phone: s.phone || '',
                joinDate: s.joinDate || '',
                specialization: s.specialization || ''
            })), ['userId', 'name', 'email', 'role', 'department', 'phone', 'joinDate', 'specialization', 'status']);
        }

        else if (type === 'dues') {
            filename = 'outstanding-dues.csv';
            const pending = await prisma.invoice.findMany({
                where: { tenantId, status: 'Pending' },
                orderBy: { createdAt: 'asc' },
                select: { invoiceCode: true, patientName: true, patientUhId: true, serviceType: true, netAmount: true, paymentMethod: true, createdAt: true }
            });
            csv = toCSV(pending.map(i => ({
                ...i,
                patientUhId: i.patientUhId || '',
                netAmount: i.netAmount.toFixed(2),
                createdAt: new Date(i.createdAt).toLocaleString('en-IN'),
                ageDays: Math.floor((Date.now() - new Date(i.createdAt)) / 86400000)
            })), ['invoiceCode', 'patientName', 'patientUhId', 'serviceType', 'netAmount', 'paymentMethod', 'createdAt', 'ageDays']);
        }

        else if (type === 'ipd') {
            filename = 'ipd-admissions.csv';
            const ipd = await prisma.appointment.findMany({
                where: { tenantId, type: 'IPD' },
                orderBy: { createdAt: 'desc' },
                select: { apptCode: true, patientName: true, doctorName: true, department: true, ward: true, bed: true, date: true, status: true, admitNotes: true }
            });
            csv = toCSV(ipd.map(i => ({
                ...i,
                ward: i.ward || '',
                bed: i.bed || '',
                admitNotes: i.admitNotes || ''
            })), ['apptCode', 'patientName', 'doctorName', 'department', 'ward', 'bed', 'date', 'status', 'admitNotes']);
        }

        else {
            return NextResponse.json({ error: 'Unknown report type' }, { status: 400 });
        }

        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="${filename}"`,
            }
        });

    } catch (error) {
        console.error('Report Download Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
