import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

// GET — list all staff for the tenant
export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const staff = await prisma.user.findMany({
            where: { tenantId: session.tenantId },
            select: { id: true, userId: true, name: true, email: true, role: true, status: true, department: true, phone: true, joinDate: true, specialization: true, createdAt: true },
            orderBy: { name: 'asc' },
        });

        return NextResponse.json({ staff });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST — onboard new staff member
export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const { name, email, role, department, phone, joinDate, specialization, password } = data;

        if (!name || !email || !role) return NextResponse.json({ error: 'Name, email and role are required' }, { status: 400 });

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });

        const count = await prisma.user.count({ where: { tenantId: session.tenantId } });
        const userId = `EMP-${String(count + 1100).padStart(4, '0')}`;

        const bcrypt = await import('bcryptjs');
        const passwordHash = await bcrypt.default.hash(password || 'Welcome@123', 10);

        const user = await prisma.user.create({
            data: {
                userId, name, email, passwordHash,
                role, department: department || null,
                phone: phone || null,
                joinDate: joinDate || new Date().toISOString().split('T')[0],
                specialization: specialization || null,
                tenantId: session.tenantId,
            }
        });

        return NextResponse.json({ staff: { ...user, passwordHash: undefined } }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT — update staff status
export async function PUT(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, status } = await req.json();
        const updated = await prisma.user.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json({ staff: updated });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
