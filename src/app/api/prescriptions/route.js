import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

// GET — list prescriptions (optionally filter by appointmentId or patientId)
export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const appointmentId = searchParams.get('appointmentId');
        const patientId = searchParams.get('patientId');

        const prescriptions = await prisma.prescription.findMany({
            where: {
                tenantId: session.tenantId,
                ...(appointmentId && { appointmentId }),
                ...(patientId && { patientId }),
            },
            include: { items: { include: { medicine: { select: { name: true, drugCode: true, stock: true } } } } },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ prescriptions });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// POST — create a new prescription with items
export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const { chiefComplaint, diagnosis, clinicalNotes, followUpDate, doctorName, patientName, patientUhId, patientId, appointmentId, bp, heartRate, temperature, weight, items = [] } = data;

        if (!doctorName || !patientName) return NextResponse.json({ error: 'Doctor and patient name are required' }, { status: 400 });

        const count = await prisma.prescription.count({ where: { tenantId: session.tenantId } });
        const rxCode = `RX-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

        const prescription = await prisma.prescription.create({
            data: {
                rxCode,
                chiefComplaint: chiefComplaint || null,
                diagnosis: diagnosis || null,
                clinicalNotes: clinicalNotes || null,
                followUpDate: followUpDate || null,
                doctorName,
                patientName,
                patientUhId: patientUhId || null,
                bp: bp || null,
                heartRate: heartRate || null,
                temperature: temperature || null,
                weight: weight || null,
                status: 'Active',
                tenantId: session.tenantId,
                patientId: patientId || null,
                appointmentId: appointmentId || null,
                items: {
                    create: items.map(item => ({
                        medicineName: item.medicineName,
                        genericName: item.genericName || null,
                        dosage: item.dosage || null,
                        frequency: item.frequency || null,
                        duration: item.duration || null,
                        quantity: parseInt(item.quantity) || 0,
                        instructions: item.instructions || null,
                        medicineId: item.medicineId || null,
                    }))
                }
            },
            include: { items: true }
        });

        // If items have medicineIds, mark dispensation as Pending so pharmacy can pick it up
        const medicineItems = items.filter(i => i.medicineId && parseInt(i.quantity) > 0);
        if (medicineItems.length > 0) {
            const subtotal = medicineItems.reduce((s, i) => s + (i.unitPrice || 0) * parseInt(i.quantity || 0), 0);
            const billCount = await prisma.dispensation.count({ where: { tenantId: session.tenantId } });
            await prisma.dispensation.create({
                data: {
                    billCode: `DISP-${String(billCount + 1).padStart(4, '0')}`,
                    patientName,
                    patientUhId: patientUhId || null,
                    patientId: patientId || null,
                    prescribedBy: doctorName,
                    subtotal,
                    tax: 0,
                    netAmount: subtotal,
                    status: 'Pending',
                    tenantId: session.tenantId,
                    items: {
                        create: medicineItems.map(i => ({
                            medicineId: i.medicineId,
                            quantity: parseInt(i.quantity),
                            unitPrice: i.unitPrice || 0,
                            totalPrice: (i.unitPrice || 0) * parseInt(i.quantity || 0),
                        }))
                    }
                }
            });

            // Update appointment status to In Progress
            if (appointmentId) {
                await prisma.appointment.update({ where: { id: appointmentId }, data: { status: 'In Progress' } }).catch(() => { });
            }
        }

        return NextResponse.json({ prescription }, { status: 201 });
    } catch (e) {
        console.error('Prescription error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
