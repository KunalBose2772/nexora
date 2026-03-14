import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

// GET - List attendance logs for checking
export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const searchParams = new URL(req.url).searchParams;
        const userId = searchParams.get('userId');

        const logs = await prisma.staffAttendance.findMany({
            where: {
                tenantId: session.tenantId,
                ...(userId ? { userId } : {})
            },
            include: { user: { select: { name: true, userId: true, role: true, department: true } } },
            orderBy: { timestamp: 'desc' },
            take: 50
        });

        // Also get staff who are currently checked in
        const activeStaff = await prisma.user.findMany({
            where: { tenantId: session.tenantId, shiftStarted: true },
            select: { id: true, name: true, userId: true, role: true, department: true, rfidTag: true, biometricId: true }
        });

        return NextResponse.json({ logs, activeStaff });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// POST - Record a clock-in/out event (Mocking Biometric/RFID scan)
export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { identifier, method, location } = await req.json(); // identifier is rfidTag or biometricId

        if (!identifier) return NextResponse.json({ error: 'Identifier required' }, { status: 400 });

        // Find user by either RFID or Biometric
        const user = await prisma.user.findFirst({
            where: {
                tenantId: session.tenantId,
                OR: [
                    { rfidTag: identifier },
                    { biometricId: identifier }
                ]
            }
        });

        if (!user) return NextResponse.json({ error: 'Device identifier not recognized. Please map card/fingerprint in HR settings.' }, { status: 404 });

        const newStatus = !user.shiftStarted;
        const type = newStatus ? 'ClockIn' : 'ClockOut';

        const [log, updatedUser] = await prisma.$transaction([
            prisma.staffAttendance.create({
                data: {
                    userId: user.id,
                    tenantId: session.tenantId,
                    type,
                    method: method || 'Device',
                    location: location || 'Main Entrance'
                },
                include: { user: { select: { name: true } } }
            }),
            prisma.user.update({
                where: { id: user.id },
                data: { shiftStarted: newStatus }
            })
        ]);

        return NextResponse.json({ 
            success: true, 
            message: `${updatedUser.name} ${type === 'ClockIn' ? 'Checked-In' : 'Checked-Out'} successfully`,
            log 
        });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Server adjustment error' }, { status: 500 });
    }
}
