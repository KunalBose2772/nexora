import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const searchParams = new URL(req.url).searchParams;
        const status = searchParams.get('status') || 'All';
        
        const where = { tenantId: session.tenantId };
        if (status === 'Active') where.isRead = false;
        if (status === 'Resolved') where.isRead = true;

        const notifications = await prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        const alerts = notifications.map(n => ({
            id: `ALT-${n.id.slice(-4).toUpperCase()}`,
            dbId: n.id,
            type: n.category || 'System',
            msg: n.text,
            time: new Date(n.createdAt).toLocaleString(),
            severity: n.type === 'error' ? 'critical' : n.type === 'warning' ? 'warning' : 'info',
            status: n.isRead ? 'Resolved' : 'Active',
            details: `Automated alert triggered on ${new Date(n.createdAt).toLocaleDateString()}. Category: ${n.category}.`
        }));

        return NextResponse.json({ alerts });
    } catch (error) {
        console.error('Alerts API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, resolve } = await req.json();
        // The incoming ID is ALT-XXXX, we need to map back or just use the database ID if we had it.
        // For simplicity, let's assume we send the real DB ID from the client if we update it.
        
        await prisma.notification.update({
            where: { id, tenantId: session.tenantId },
            data: { isRead: !!resolve }
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 });
    }
}
