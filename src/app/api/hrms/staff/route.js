import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

// GET - List all staff for mapping
export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const staff = await prisma.user.findMany({
            where: { tenantId: session.tenantId },
            select: {
                id: true,
                userId: true,
                name: true,
                email: true,
                role: true,
                department: true,
                rfidTag: true,
                biometricId: true,
                shiftStarted: true
            },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json({ staff });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// PUT - Update staff hardware identifiers
export async function PUT(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, rfidTag, biometricId } = await req.json();

        if (!id) return NextResponse.json({ error: 'Staff ID required' }, { status: 400 });

        const updated = await prisma.user.update({
            where: { id, tenantId: session.tenantId },
            data: {
                rfidTag: rfidTag === "" ? null : rfidTag,
                biometricId: biometricId === "" ? null : biometricId
            }
        });

        return NextResponse.json({ success: true, staff: updated });
    } catch (e) {
        if (e.code === 'P2002') {
            return NextResponse.json({ error: 'Hardware ID (RFID/Biometric) is already assigned to another staff member.' }, { status: 400 });
        }
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
