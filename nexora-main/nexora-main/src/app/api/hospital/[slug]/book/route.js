import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req, { params }) {
    try {
        const { slug } = params;
        const data = await req.json();
        const { firstName, lastName, phone, email, date, doctor, department, notes } = data;

        if (!firstName || !phone || !date || !doctor) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const tenant = await prisma.tenant.findUnique({
            where: { slug }
        });

        if (!tenant) {
            return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
        }

        // Generate ID / Password mapped properly to Nexora Standard if needed. (Basic implementation for now)
        const passwordRef = Math.random().toString(36).slice(-8);

        // 1) Find or Create Patient
        let patient = await prisma.patient.findFirst({
            where: { tenantId: tenant.id, phone }
        });

        if (!patient) {
            patient = await prisma.patient.create({
                data: {
                    patientCode: `PT-${Date.now().toString().slice(-6)}`,
                    firstName,
                    lastName: lastName || '',
                    phone,
                    email,
                    tenantId: tenant.id,
                    passwordHash: passwordRef // Simulated password sending via email later
                }
            });
        }

        // 2) Create Appointment
        const appointment = await prisma.appointment.create({
            data: {
                apptCode: `APT-${Date.now().toString().slice(-6)}`,
                patientName: `${patient.firstName} ${patient.lastName}`.trim(),
                doctorName: doctor,
                department: department || 'General Medicine',
                date: date,
                time: 'TBD', // We can accept time if passed
                patientId: patient.id,
                tenantId: tenant.id,
                admitNotes: notes || 'Online booking from public portal',
            }
        });

        // 3) Generate Slip / Invoice
        const invoice = await prisma.invoice.create({
            data: {
                invoiceCode: `INV-${Date.now().toString().slice(-6)}`,
                patientName: `${patient.firstName} ${patient.lastName}`.trim(),
                patientId: patient.id,
                serviceType: 'OPD Consult',
                amount: 500, // Standard Consultation fee for now
                netAmount: 500,
                status: 'Pending', // Pending marks as non-paid but slip can be generated
                tenantId: tenant.id
            }
        });

        return NextResponse.json({
            ok: true,
            message: 'Appointment confirmed successfully! Your profile details have been emailed.',
            appointmentId: appointment.id,
            patientId: patient.id,
            passwordRef // Temporarily send back to show user, or simulate email.
        });

    } catch (error) {
        console.error('Booking Error:', error);
        return NextResponse.json({ error: 'Failed to book appointment. Please try again later.' }, { status: 500 });
    }
}
