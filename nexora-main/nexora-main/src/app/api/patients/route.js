import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import bcrypt from 'bcryptjs';

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

        // Auto-generate password for patient login
        const generatedPassword = Math.random().toString(36).slice(-8);
        const passwordHash = await bcrypt.hash(generatedPassword, 10);
        const patientEmail = data.email ? data.email.trim() : null;

        const newPatient = await prisma.patient.create({
            data: {
                tenantId: session.tenantId,
                patientCode,
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                dob: data.dob,
                gender: data.gender,
                phone: data.phone.trim(),
                email: patientEmail,
                address: data.address ? data.address.trim() : null,
                bloodGroup: data.bloodGroup || null,
                passwordHash,
            }
        });

        if (patientEmail) {
            console.log(`\n\n[MOCK EMAIL SEND: WELCOME PATIENT] 
To: ${patientEmail}
Subject: Welcome to Nexora Health! Your Patient Portal Access

Hello ${newPatient.firstName},
You have been registered successfully at our hospital. 
You can now log in to the Patient Portal to view your records, lab reports, and book appointments.

Portal Login ID: ${patientEmail}
Your Temporary Password: ${generatedPassword}

Please log in and change your password immediately.
------------------------------------------------------\n\n`);
        } else {
            // If no email, maybe fallback to sending SMS
            console.log(`\n\n[MOCK SMS SEND: WELCOME PATIENT] 
To: ${newPatient.phone}
Welcome to Nexora Health! Your Patient Portal Login: 
Phone: ${newPatient.phone}
Password: ${generatedPassword}
------------------------------------------------------\n\n`);
        }

        return NextResponse.json({ ok: true, patient: newPatient }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/patients]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
