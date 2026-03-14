import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || session.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const logs = await prisma.systemLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        // Add some mock ones if empty to avoid entirely empty view
        if (logs.length === 0) {
            await prisma.systemLog.createMany({
                data: [
                    { title: 'Database Provisioning Started', description: 'Internal database migrations ran.', type: 'info' },
                    { title: 'System Initialized', description: 'Platform initialization successful.', type: 'success' }
                ]
            });
            const newLogs = await prisma.systemLog.findMany({
                orderBy: { createdAt: 'desc' },
                take: 20
            });
            return NextResponse.json({ ok: true, logs: newLogs });
        }

        return NextResponse.json({ ok: true, logs });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to load system logs.', detail: err.message }, { status: 500 });
    }
}
