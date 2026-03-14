import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { checkInventoryThresholds } from '@/lib/notifications';

function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " yr ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hr ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " min ago";
    return Math.floor(seconds) + " sec ago";
}

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const tenantId = session.tenantId;

        // 1. Run low-stock check automatically on notification pop-up load
        await checkInventoryThresholds(tenantId);

        // 2. Fetch the top 5 alerts from the notification table
        const dbNotifications = await prisma.notification.findMany({
            where: { tenantId, isRead: false },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        const formatted = dbNotifications.map(n => ({
            id: n.id,
            text: n.text,
            time: timeAgo(n.createdAt),
            timestamp: new Date(n.createdAt).getTime(),
            dot: n.type === 'error' ? '#DC2626' : n.type === 'warning' ? '#F59E0B' : '#00C2FF'
        }));

        return NextResponse.json({ ok: true, notifications: formatted });
    } catch (error) {
        console.error('Notifications API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Mark All as Read
export async function PATCH(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await prisma.notification.updateMany({
            where: { tenantId: session.tenantId, isRead: false },
            data: { isRead: true }
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
