import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/email';
import { sendExternalMessage } from '@/lib/notifications';

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
                photo: data.photo || null,
                passwordHash,
            }
        });

        if (patientEmail) {
            await sendEmail({
                to: patientEmail,
                subject: 'Welcome to Nexora Health! Your Patient Portal Access',
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
                        <h2 style="color: #0ea5e9;">Welcome to Nexora Health, ${newPatient.firstName}!</h2>
                        <p>You have been registered successfully at our hospital. You can now log in to the Patient Portal to view your records, lab reports, and book appointments.</p>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
                            <p style="margin: 0; font-size: 14px; color: #64748b;">Portal Login ID:</p>
                            <p style="margin: 4px 0 16px 0; font-weight: 700; font-size: 18px;">${patientEmail}</p>
                            <p style="margin: 0; font-size: 14px; color: #64748b;">Temporary Password:</p>
                            <p style="margin: 4px 0 0 0; font-weight: 700; font-size: 18px;">${generatedPassword}</p>
                        </div>
                        <p style="font-size: 12px; color: #94a3b8;">Please log in and change your password immediately for security.</p>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || ''}/login" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 10px;">Login to Patient Portal</a>
                    </div>
                `
            });

            await sendExternalMessage({
                tenantId: session.tenantId,
                recipientName: `${newPatient.firstName} ${newPatient.lastName}`,
                recipientPhone: newPatient.phone,
                channel: 'Email',
                type: 'Transactional',
                message: `Portal credentials sent to ${patientEmail}`
            });
        } else {
            // Log the SMS intent
            await sendExternalMessage({
                tenantId: session.tenantId,
                recipientName: `${newPatient.firstName} ${newPatient.lastName}`,
                recipientPhone: newPatient.phone,
                channel: 'SMS',
                type: 'Verification',
                message: `Welcome to Nexora Health! Your login: Phone ${newPatient.phone}, Pwd ${generatedPassword}`
            });
        }

        await logAudit({
            req: request,
            session,
            action: 'CREATE',
            resource: 'Patient',
            resourceId: newPatient.id,
            description: `Registered new patient: ${newPatient.firstName} ${newPatient.lastName} (${newPatient.patientCode})`,
            newValue: newPatient
        });

        return NextResponse.json({ ok: true, patient: newPatient }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/patients]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
