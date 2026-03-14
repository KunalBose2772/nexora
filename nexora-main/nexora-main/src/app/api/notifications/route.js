import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
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
        const notifications = [];
        let idCounter = 1;

        // 1. Low stock alerts
        const lowStockMeds = await prisma.medicine.findMany({
            where: { tenantId, stock: { lt: prisma.medicine.fields.minThreshold } },
            take: 3
        });

        for (const med of lowStockMeds) {
            notifications.push({
                id: idCounter++,
                text: `Low stock alert: ${med.name} (Only ${med.stock} left)`,
                time: timeAgo(med.updatedAt),
                timestamp: med.updatedAt.getTime(),
                dot: '#DC2626' // Red
            });
        }

        // 2. Recent Lab Results
        const recentLabs = await prisma.labRequest.findMany({
            where: { tenantId, status: 'Result Ready' },
            orderBy: { updatedAt: 'desc' },
            take: 3
        });

        for (const lab of recentLabs) {
            notifications.push({
                id: idCounter++,
                text: `Lab report ready: ${lab.testName} for ${lab.patientName}`,
                time: timeAgo(lab.updatedAt),
                timestamp: lab.updatedAt.getTime(),
                dot: '#00C2FF' // Cyan
            });
        }

        // 3. New Appointments
        const newAppts = await prisma.appointment.findMany({
            where: { tenantId, status: 'Scheduled' },
            orderBy: { createdAt: 'desc' },
            take: 3
        });

        for (const appt of newAppts) {
            notifications.push({
                id: idCounter++,
                text: `New appointment: ${appt.patientName} with ${appt.doctorName}`,
                time: timeAgo(appt.createdAt),
                timestamp: appt.createdAt.getTime(),
                dot: '#10B981' // Green
            });
        }

        // Sort by timestamp descending
        notifications.sort((a, b) => b.timestamp - a.timestamp);

        // Keep top 5
        const top5 = notifications.slice(0, 5);

        return NextResponse.json({ ok: true, notifications: top5 });
    } catch (error) {
        console.error('Notifications API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
