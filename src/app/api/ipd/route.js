import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized or no tenant' }, { status: 401 });
        }

        const ipdPatients = await prisma.appointment.findMany({
            where: { tenantId: session.tenantId, type: 'IPD' },
            include: { patient: true },
            orderBy: [{ date: 'desc' }, { time: 'desc' }]
        });

        // Calculate ledger totals for each patient
        const ledgerItems = await prisma.appointment.findMany({
            where: {
                tenantId: session.tenantId,
                type: { in: ['IPDCharge', 'IPDDeposit'] },
                department: { in: ipdPatients.map(p => p.id) }
            }
        });

        const advanceDeposits = await prisma.advanceDeposit.findMany({
            where: {
                tenantId: session.tenantId,
                patientId: { in: ipdPatients.map(p => p.patientId).filter(id => !!id) }
            }
        });

        const patientsWithTotals = ipdPatients.map(p => {
            const patientLedger = ledgerItems.filter(item => item.department === p.id);
            const charges = patientLedger.filter(i => i.type === 'IPDCharge').reduce((s, i) => s + parseFloat(i.admitNotes || 0), 0);
            const directDeposits = patientLedger.filter(i => i.type === 'IPDDeposit').reduce((s, i) => s + parseFloat(i.admitNotes || 0), 0);
            
            const tableAdvances = advanceDeposits.filter(a => a.patientId === p.patientId).reduce((s, a) => s + a.amount, 0);

            return {
                ...p,
                patientUhId: p.patient?.patientCode || null,
                patientName: p.patient ? `${p.patient.firstName} ${p.patient.lastName}` : p.patientName,
                ledgerTotal: charges, 
                totalDeposits: directDeposits + tableAdvances
            };
        });

        const activeAdmissionPatientIds = new Set(ipdPatients.map(p => p.patientId).filter(id => !!id));

        const ipdReferrals = await prisma.prescription.findMany({
            where: { 
                tenantId: session.tenantId, 
                isIPDReferral: true
            },
            include: { patient: true },
            orderBy: { createdAt: 'desc' }
        });

        const filteredReferrals = ipdReferrals.filter(ref => !activeAdmissionPatientIds.has(ref.patientId));

        return NextResponse.json({ ipdPatients: patientsWithTotals, ipdReferrals: filteredReferrals }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/ipd]', err);
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

        if (!data.patientName || !data.doctorName || !data.date || !data.ward || !data.bed) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const randNum = Math.floor(1000 + Math.random() * 9000);
        const apptCode = `IPD-${randNum}`;

        const newAdmission = await prisma.appointment.create({
            data: {
                tenantId: session.tenantId,
                apptCode,
                patientName: data.patientName.trim(),
                patientId: data.patientId || null,
                doctorName: data.doctorName.trim(),
                department: data.department ? data.department.trim() : null,
                date: data.date,
                time: data.time || null,
                type: 'IPD',
                status: 'Admitted',
                paymentStatus: data.captureDeposit ? 'Advance Paid' : 'Pending',
                ward: data.ward.trim(),
                bed: data.bed.trim(),
                admitNotes: data.admitNotes ? data.admitNotes.trim() : null,
            }
        });

        // Create Security Deposit record if captured
        if (data.captureDeposit && data.patientId) {
            const receiptCode = `ADV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
            await prisma.advanceDeposit.create({
                data: {
                    tenantId: session.tenantId,
                    receiptCode,
                    amount: 10000.00, // Hardcoded standard deposit for now as per UI
                    paymentMethod: data.payMode || 'Cash',
                    status: 'Available',
                    patientId: data.patientId,
                    notes: `Admission Security Deposit for ${apptCode}`
                }
            }).catch(err => console.error("Failed to save deposit record:", err));
        }

        // If this admission came from an OPD referral, update the original OPD appointment status
        if (data.refId) {
            const rx = await prisma.prescription.findUnique({
                where: { id: data.refId },
                select: { appointmentId: true }
            });
            if (rx?.appointmentId) {
                await prisma.appointment.update({
                    where: { id: rx.appointmentId },
                    data: { 
                        status: 'Admitted',
                        ward: data.ward.trim(),
                        bed: data.bed.trim()
                    }
                }).catch(() => { });
            }
        }


        // Audit Logging for new IPD admission
        await logAudit({
            req: request,
            session,
            action: 'ADMIT',
            resource: 'IPD',
            resourceId: newAdmission.id,
            description: `Patient ${data.patientName} admitted to ${data.ward} - ${data.bed}`,
            newValue: newAdmission
        });

        return NextResponse.json({ ok: true, admission: newAdmission }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/ipd]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, status } = await request.json();

        if (!id || !status) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

        const current = await prisma.appointment.findUnique({ where: { id, tenantId: session.tenantId } });
        if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        let updateData = { status };

        // If initiating discharge, prepare the clearance block
        if (status === 'Discharge Initiated') {
            const clearanceBlock = `\n[CLEARANCE] WARD:Pending | PHARMACY:Pending | FINANCE:Pending\n`;
            // Avoid adding multiple blocks if clicked twice
            if (!current.admitNotes?.includes('[CLEARANCE]')) {
                updateData.admitNotes = (current.admitNotes || '') + clearanceBlock;
            }
        }

        const updated = await prisma.appointment.update({
            where: { id },
            data: updateData
        });

        // Audit Logging for IPD status change
        await logAudit({
            req: request,
            session,
            action: 'UPDATE_STATUS',
            resource: 'IPD',
            resourceId: id,
            description: `IPD Status changed from ${current.status} to ${status} for ${current.patientName}`,
            oldValue: current,
            newValue: updated
        });

        return NextResponse.json({ ok: true, admission: updated });
    } catch (err) {
        console.error('[PUT /api/ipd]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
