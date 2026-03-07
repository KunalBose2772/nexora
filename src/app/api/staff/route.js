import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

// GET /api/staff — returns all staff (doctors, nurses, etc.) for the current tenant
export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const staff = await prisma.user.findMany({
            where: {
                tenantId: session.tenantId,
                status: 'Active',
                role: { in: ['doctor', 'hospital_admin', 'nurse', 'receptionist'] }
            },
            select: { id: true, name: true, role: true },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json({ staff });
    } catch (error) {
        console.error('Fetch Staff Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
