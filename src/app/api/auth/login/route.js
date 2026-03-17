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

        let user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
            include: { tenant: { select: { id: true, slug: true, name: true, status: true } } },
        });

        let payload = null;

        if (user) {
            // It's a standard user/staff/admin
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

            payload = {
                id: user.id,
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId,
                tenantSlug: user.tenant?.slug || null,
                tenantName: user.tenant?.name || null,
            };
        } else {
            // Check if it's a patient (by email, patientCode, or phone)
            const patient = await prisma.patient.findFirst({
                where: {
                    OR: [
                        { email: email.toLowerCase().trim() },
                        { patientCode: email.trim() },
                        { phone: email.trim() }
                    ]
                },
                include: { tenant: { select: { id: true, slug: true, name: true, status: true } } },
            });

            if (!patient) {
                return NextResponse.json({ error: 'Invalid identifier or password.' }, { status: 401 });
            }

            if (!patient.passwordHash) {
                return NextResponse.json({ error: 'Patient account has no password set.' }, { status: 401 });
            }

            const valid = await bcrypt.compare(password, patient.passwordHash);
            if (!valid) {
                return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
            }

            if (patient.status === 'Suspended') {
                return NextResponse.json({ error: 'Your patient profile is suspended.' }, { status: 403 });
            }

            payload = {
                id: patient.id,
                patientCode: patient.patientCode,
                name: `${patient.firstName} ${patient.lastName}`,
                email: patient.email,
                role: 'patient', // Specific role mapping
                tenantId: patient.tenantId,
                tenantSlug: patient.tenant?.slug || null,
                tenantName: patient.tenant?.name || null,
            };
        }

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
