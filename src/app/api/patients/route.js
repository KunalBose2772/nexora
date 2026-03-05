import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized or no tenant' }, { status: 401 });
        }

        const patients = await prisma.patient.findMany({
            where: { tenantId: session.tenantId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ patients }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/patients]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized or no tenant' }, { status: 401 });
        }

        const data = await request.json();

        if (!data.firstName || !data.lastName || !data.dob || !data.gender || !data.phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Generate a random patient code NXR-[YEAR]-[RANDOM]
        const year = new Date().getFullYear();
        const randNum = Math.floor(10000 + Math.random() * 90000);
        const patientCode = `NXR-${year}-${randNum}`;

        const newPatient = await prisma.patient.create({
            data: {
                tenantId: session.tenantId,
                patientCode,
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                dob: data.dob,
                gender: data.gender,
                phone: data.phone.trim(),
                email: data.email ? data.email.trim() : null,
                address: data.address ? data.address.trim() : null,
                bloodGroup: data.bloodGroup || null,
                // you could format address from city/state/zip but let's just store the raw string or combine them
            }
        });

        return NextResponse.json({ ok: true, patient: newPatient }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/patients]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
