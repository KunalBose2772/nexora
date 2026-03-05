// POST /api/auth/login
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken, buildCookieHeader } from '@/lib/auth';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
            include: { tenant: { select: { id: true, slug: true, name: true, status: true } } },
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
        }

        if (user.status === 'Suspended') {
            return NextResponse.json({ error: 'Your account has been suspended. Contact your administrator.' }, { status: 403 });
        }

        // Also check if tenant is suspended
        if (user.tenant && user.tenant.status === 'Suspended') {
            return NextResponse.json({ error: 'Your hospital account is currently suspended. Contact Nexora support.' }, { status: 403 });
        }

        const payload = {
            id: user.id,
            userId: user.userId,
            name: user.name,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId,
            tenantSlug: user.tenant?.slug || null,
            tenantName: user.tenant?.name || null,
        };

        const token = signToken(payload);
        const cookie = buildCookieHeader(token);

        return NextResponse.json({ ok: true, user: payload }, {
            status: 200,
            headers: { 'Set-Cookie': cookie },
        });
    } catch (err) {
        console.error('[login]', err);
        return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
    }
}
