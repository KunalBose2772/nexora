import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const tenantId = session.tenantId;

        // 1. Real-time Metrics
        const activeEmergency = await prisma.appointment.count({
            where: { tenantId, type: 'Emergency', status: { notIn: ['Resolved', 'Discharged', 'Cancelled'] } }
        });

        const criticalIcu = await prisma.appointment.count({
            where: { tenantId, type: 'ICU', status: 'Admitted' }
        });

        const totalPatients = await prisma.patient.count({ where: { tenantId } });
        const ipdAdmissions = await prisma.appointment.count({
            where: { tenantId, type: 'IPD', status: 'Admitted' }
        });

        const totalBeds = await prisma.bed.count({ where: { tenantId } });
        const occupancy = totalBeds > 0 ? `${Math.round((ipdAdmissions / totalBeds) * 100)}%` : '0%';

        // 2. Unit Connectivity (Simulated statuses but real counts if possible)
        const units = [
            { id: 'opd', unit: 'OPD Desk', status: 'Online', perf: 'Optimal', icon: 'Stethoscope', color: '#10B981', sub: 'Consultation Flow', href: '/opd' },
            { id: 'ipd', unit: 'IPD Wards', status: 'Online', perf: ipdAdmissions > (totalBeds * 0.8) ? 'High Load' : 'Optimal', icon: 'BedDouble', color: '#F59E0B', sub: 'Admissions Desk', href: '/ipd' },
            { id: 'laboratory', unit: 'Laboratory', status: 'Online', perf: 'Processing', icon: 'Microscope', color: '#0EA5E9', sub: 'Diagnostic Hub', href: '/laboratory' },
            { id: 'pharmacy', unit: 'Pharmacy', status: 'Online', perf: 'Optimal', icon: 'Pill', color: '#10B981', sub: 'Inventory Sync', href: '/pharmacy' },
            { id: 'emergency', unit: 'Emergency', status: activeEmergency > 0 ? 'Active' : 'Standby', perf: activeEmergency > 5 ? 'Alert' : 'Optimal', icon: 'Siren', color: '#EF4444', sub: 'Triage Center', href: '/emergency' },
            { id: 'ot', unit: 'Surgical OT', status: 'In-Use', perf: 'Optimal', icon: 'Scissors', color: '#6366F1', sub: 'OR Schedules', href: '/ot' },
        ];

        // 3. Recent Real Alerts (from notification table)
        const notifications = await prisma.notification.findMany({
            where: { tenantId, isRead: false },
            orderBy: { createdAt: 'desc' },
            take: 3
        });

        const recentAlerts = notifications.map(n => ({
            id: n.id,
            type: n.category.toUpperCase(),
            msg: n.text,
            time: 'Just now', // Simplified for now
            severity: n.type === 'error' ? 'critical' : n.type === 'warning' ? 'warning' : 'info'
        }));

        // 4. Latest Audit Logs for Terminal
        const auditLogs = await prisma.auditLog.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            take: 3
        });

        const logs = auditLogs.map(l => ({
            time: new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            event: l.description || `${l.action} ${l.resource}`
        }));

        return NextResponse.json({
            metrics: {
                activeEmergency,
                criticalIcu,
                totalPatients,
                staffOnDuty: 85, // Mocked as we don't have real-time shift count easily
                occupancy,
                efficiency: '96.8%'
            },
            units,
            recentAlerts,
            logs
        });
    } catch (error) {
        console.error('Command Center Stats Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
