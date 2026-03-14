import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { createSystemNotification, sendExternalMessage } from '@/lib/notifications';
import { logAudit } from '@/lib/audit';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized or no tenant' }, { status: 401 });
        }

        const appointments = await prisma.appointment.findMany({
            where: { tenantId: session.tenantId },
            include: { patient: true },
            orderBy: [{ date: 'asc' }, { time: 'asc' }]
        });

        return NextResponse.json({ appointments }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/appointments]', err);
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

        if (!data.patientName || !data.doctorName || !data.date) {
            return NextResponse.json({ error: 'Missing required fields: patientName, doctorName, date' }, { status: 400 });
        }

        const randNum = Math.floor(1000 + Math.random() * 9000);
        const apptCode = `APT-${randNum}`;

        // Create the appointment
        const newAppointment = await prisma.appointment.create({
            data: {
                tenantId: session.tenantId,
                apptCode,
                patientName: data.patientName.trim(),
                patientId: data.patientId || null,
                doctorName: data.doctorName.trim(),
                department: data.department ? data.department.trim() : null,
                date: data.date,
                time: data.time || null,
                type: data.type || 'OPD',
                status: 'Scheduled',
                paymentStatus: data.paymentMethod ? 'Paid' : 'Pending',
                // MLC Fields
                isMLC: data.isMLC || false,
                mlcNumber: data.mlcNumber || null,
                policeStation: data.policeStation || null,
                firNumber: data.firNumber || null,
                mlcDetails: data.mlcDetails || null,
                // New Emergency/Triage fields
                triageLevel: data.triageLevel || null,
                triageColor: data.triageColor || null,
                bystanderName: data.bystanderName || null,
                bystanderPhone: data.bystanderPhone || null,
                traumaType: data.traumaType || null,
                triageNotes: data.triageNotes || null,
                triageVitals: data.triageVitals ? JSON.stringify(data.triageVitals) : null,
                triageAt: data.triageAt ? new Date(data.triageAt) : (data.type === 'EMERGENCY' ? new Date() : null),
            },
            include: { patient: true }
        });

        // Create an Invoice if payment details are provided
        let newInvoice = null;
        if (data.paymentAmount > 0) {
            const invCode = `INV-${Math.floor(10000 + Math.random() * 90000)}`;
            newInvoice = await prisma.invoice.create({
                data: {
                    tenantId: session.tenantId,
                    invoiceCode: invCode,
                    patientName: data.patientName.trim(),
                    patientUhId: newAppointment.patient?.patientCode || null,
                    patientId: data.patientId || null,
                    serviceType: `OPD Consultation: ${data.doctorName}`,
                    amount: parseFloat(data.paymentAmount),
                    netAmount: parseFloat(data.paymentAmount),
                    paymentMethod: data.paymentMethod || 'Cash',
                    status: 'Paid',
                    notes: `Auto-generated for appointment ${apptCode}`
                }
            });
        }

        // 1. Create a dashboard alert for frontline staff
        await createSystemNotification({
            tenantId: session.tenantId,
            text: `New ${newInvoice ? 'Paid' : 'Unpaid'} Appointment: ${newAppointment.patientName} with Dr. ${newAppointment.doctorName}`,
            type: 'info',
            category: 'Clinical'
        });

        // 2. Dispatch external confirmation communications
        if (newAppointment.patient?.phone) {
            await sendExternalMessage({
                tenantId: session.tenantId,
                recipientName: newAppointment.patientName,
                recipientPhone: newAppointment.patient.phone,
                channel: 'SMS',
                type: 'Appointment Confirmation',
                message: `Hi ${newAppointment.patientName}, your visit #${apptCode} is confirmed. ${newInvoice ? 'Payment Received: ₹' + data.paymentAmount : 'Payment Pending'}.`
            });
        }

        // 3. Log Audit
        await logAudit({
            tenantId: session.tenantId,
            userId: session.userId,
            userName: session.name,
            userRole: session.role,
            action: 'CREATE_APPOINTMENT',
            resourceType: 'Appointment',
            resourceId: newAppointment.id,
            details: `Scheduled ${newAppointment.type} appointment for ${newAppointment.patientName} with Dr. ${newAppointment.doctorName}`,
            newValue: newAppointment
        });

        return NextResponse.json({
            ok: true,
            appointment: newAppointment,
            invoice: newInvoice
        }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/appointments]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
