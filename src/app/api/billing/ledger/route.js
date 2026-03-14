import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const ipdId = searchParams.get('ipdId');

        if (!ipdId) return NextResponse.json({ error: 'Missing admission ID' }, { status: 400 });

        // Get admission to find patientId
        const admission = await prisma.appointment.findFirst({
            where: { id: ipdId, tenantId: session.tenantId }
        });

        if (!admission) return NextResponse.json({ error: 'Admission not found' }, { status: 404 });

        // 1. Fetch ledger entries (Charges/Deposits from this page)
        const appointmentEntries = await prisma.appointment.findMany({
            where: {
                tenantId: session.tenantId,
                department: ipdId,
                type: { in: ['IPDCharge', 'IPDDeposit'] }
            },
            orderBy: { createdAt: 'asc' }
        });

        // 2. Fetch Advance Deposits for this patient
        const advances = await prisma.advanceDeposit.findMany({
            where: {
                tenantId: session.tenantId,
                patientId: admission.patientId,
                // We could filter by date here, but usually a patient only has one active IPD cycle
            }
        });

        // 3. Map Advances to ledger format
        const mappedAdvances = advances.map(adv => ({
            id: adv.id,
            apptCode: adv.receiptCode,
            patientName: adv.notes || 'Advance Deposit',
            doctorName: 'Billing Desk',
            department: ipdId,
            date: adv.createdAt.toISOString().split('T')[0],
            time: adv.createdAt.toLocaleTimeString('en-US', { hour12: false }).substring(0,5),
            type: 'IPDDeposit',
            status: 'Settled',
            admitNotes: adv.amount.toString()
        }));

        const items = [...mappedAdvances, ...appointmentEntries].sort((a,b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date));

        return NextResponse.json({ items });
    } catch (e) {
        console.error('Ledger GET Error:', e);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json(); // { ipdId, serviceName, amount, type: 'IPDCharge' | 'IPDDeposit' }

        if (!data.ipdId || !data.amount) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

        const entry = await prisma.appointment.create({
            data: {
                tenantId: session.tenantId,
                apptCode: data.type === 'IPDDeposit' ? `DEP-${Math.floor(Math.random() * 8999 + 1000)}` : `CHG-${Math.floor(Math.random() * 8999 + 1000)}`,
                patientName: data.serviceName, // Using patientName column to store 'Bed Charge, I.V. Fluid, etc'
                doctorName: 'System Ledger',
                department: data.ipdId, // The link to actual admission
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-US', { hour12: false }).substring(0,5),
                type: data.type || 'IPDCharge',
                status: 'Billed',
                admitNotes: data.amount.toString() // String-mapped amount
            }
        });

        return NextResponse.json({ entry }, { status: 201 });
    } catch (e) {
        console.error('Ledger POST Error:', e);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        // Allow voiding/removing a specific unintentional charge entry
        await prisma.appointment.delete({
            where: { id, tenantId: session.tenantId }
        });

        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
