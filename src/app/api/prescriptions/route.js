import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

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
        const { 
            chiefComplaint, diagnosis, clinicalNotes, followUpDate, doctorName, patientName, 
            patientUhId, patientId, appointmentId, bp, heartRate, temperature, weight, 
            isIPDReferral, referralDepartment, referralUrgency,
            validationStatus = 'Signed', items = [], labItems = [] 
        } = data;

        if (!doctorName || !patientName) return NextResponse.json({ error: 'Doctor and patient name are required' }, { status: 400 });

        // Fetch tenant settings for clinical governance
        const tenant = await prisma.tenant.findUnique({ where: { id: session.tenantId } });
        const requireApproval = tenant?.requireRxApproval || false;

        // Determine final validation status
        let finalValidationStatus = 'Signed';
        if (requireApproval) {
            finalValidationStatus = 'Awaiting Approval';
        } else if (session.role !== 'admin' && session.role !== 'doctor') {
            finalValidationStatus = 'Draft';
        }

        // If explicitly requested as Draft, respect it
        if (validationStatus === 'Draft') finalValidationStatus = 'Draft';

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
                validationStatus: finalValidationStatus,
                tenantId: session.tenantId,
                patientId: patientId || null,
                appointmentId: appointmentId || null,
                isIPDReferral: isIPDReferral || false,
                referralDepartment: referralDepartment || null,
                referralUrgency: referralUrgency || null,
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

        // If validationStatus is Signed, trigger pharmacy dispensation
        const medicineItems = items.filter(i => i.medicineId && parseInt(i.quantity) > 0);
        if (medicineItems.length > 0 && finalValidationStatus === 'Signed') {
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

        // Create Lab Requests if provided
        if (labItems.length > 0) {
            for (const lab of labItems) {
                const rand = Math.floor(1000 + Math.random() * 9000);
                await prisma.labRequest.create({
                    data: {
                        trackingId: `LAB-${rand}`,
                        patientName,
                        patientUhId: patientUhId || null,
                        patientId: patientId || null,
                        testName: lab.testName,
                        category: lab.category || 'General',
                        status: 'Pending',
                        referringDoctor: doctorName,
                        tenantId: session.tenantId,
                        amount: lab.amount || 0
                    }
                });
            }
        }

        // Log the creation
        await logAudit({
            session,
            action: 'CREATE',
            resource: 'Prescription',
            resourceId: prescription.id,
            description: `New prescription ${rxCode} created for ${patientName}`,
            newValue: prescription,
            req
        });

        return NextResponse.json({ prescription }, { status: 201 });
    } catch (e) {
        console.error('Prescription error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// PATCH — Approve / Sign a prescription
export async function PATCH(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session || (session.role !== 'admin' && session.role !== 'doctor')) {
            return NextResponse.json({ error: 'Unauthorized. Only Doctors can sign prescriptions.' }, { status: 401 });
        }

        const { id, validationStatus } = await req.json();
        if (validationStatus !== 'Signed') return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });

        const rx = await prisma.prescription.update({
            where: { id, tenantId: session.tenantId },
            data: { validationStatus: 'Signed', locked: true },
            include: { items: true }
        });

        // Trigger Dispensation now
        if (rx.items.length > 0) {
            const medicineItems = rx.items.filter(i => i.medicineId && i.quantity > 0);
            if (medicineItems.length > 0) {
                 const billCount = await prisma.dispensation.count({ where: { tenantId: session.tenantId } });
                 await prisma.dispensation.create({
                     data: {
                         billCode: `DISP-${String(billCount + 1).padStart(4, '0')}`,
                         patientName: rx.patientName,
                         patientUhId: rx.patientUhId,
                         patientId: rx.patientId,
                         prescribedBy: session.name, // The person who signed it
                         subtotal: 0, tax: 0, netAmount: 0, // Pharmacy will calculate MRP-based totals
                         status: 'Pending',
                         tenantId: session.tenantId,
                         items: {
                             create: medicineItems.map(i => ({
                                 medicineId: i.medicineId,
                                 quantity: i.quantity,
                                 unitPrice: 0, totalPrice: 0,
                             }))
                         }
                     }
                 });
            }
        }

        // Log the signing
        await logAudit({
            session,
            action: 'SIGN',
            resource: 'Prescription',
            resourceId: rx.id,
            description: `Prescription ${rx.rxCode} signed and locked by Dr. ${session.name}`,
            newValue: { validationStatus: 'Signed', locked: true },
            req
        });

        return NextResponse.json({ prescription: rx });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
