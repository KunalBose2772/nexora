import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const logs = await prisma.staffAttendance.findMany({
            where: { tenantId: session.tenantId },
            include: { user: { select: { name: true, role: true, department: true } } },
            orderBy: { timestamp: 'desc' },
            take: 100
        });

        return NextResponse.json({ logs }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/hr/attendance]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { method, location } = body;

        // Fetch user to check current status
        const user = await prisma.user.findUnique({
            where: { id: session.userId }
        });

        const newStatus = !user.shiftStarted;
        const type = newStatus ? 'ClockIn' : 'ClockOut';

        // Use transaction to ensure both user status and log are updated
        const [updatedUser, log] = await prisma.$transaction([
            prisma.user.update({
                where: { id: session.userId },
                data: { shiftStarted: newStatus }
            }),
            prisma.staffAttendance.create({
                data: {
                    userId: session.userId,
                    type,
                    method: method || 'Manual',
                    location: location || 'Web Portal',
                    tenantId: session.tenantId
                }
            })
        ]);

        return NextResponse.json({ shiftStarted: updatedUser.shiftStarted, log }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/hr/attendance/clock]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
