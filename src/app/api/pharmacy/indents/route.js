import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Using Appointment table to safely mock Indent requests without DB migrations
        const indents = await prisma.appointment.findMany({
            where: {
                tenantId: session.tenantId,
                type: 'Pharmacy Indent'
            },
            orderBy: { createdAt: 'desc' }
        });

        // Also fetch active stock to show available inventory to the pharmacist fulfilling the indent
        const inventory = await prisma.medicine.findMany({
            where: { tenantId: session.tenantId },
            select: { id: true, name: true, stock: true, batchNo: true }
        });

        return NextResponse.json({ indents, inventory });
    } catch (e) {
        console.error('Indent GET Error:', e);
        return NextResponse.json({ error: 'Failed to fetch indents' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();

        const indentId = `IND-${Math.floor(10000 + Math.random() * 90000)}`;

        const newIndent = await prisma.appointment.create({
            data: {
                apptCode: indentId,
                // patientName stores the item requested
                patientName: data.itemName,
                // doctorName stores the requesting user
                doctorName: data.requestedBy,
                // department stores the requesting department/ward
                department: data.requestingWard,
                date: new Date().toISOString().split('T')[0],
                time: String(data.quantity), // Store requested qty in time field safely as a string
                type: 'Pharmacy Indent',
                status: 'Pending',
                notes: `[INDENT REQUEST] Priority: ${data.priority} | Reason: ${data.reason}`,
                tenantId: session.tenantId,
            }
        });

        return NextResponse.json({ message: 'Indent Created', newIndent }, { status: 201 });
    } catch (e) {
        console.error('Indent POST Error:', e);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, status, allocatedBatch, qtyFulfilled, medicineId } = await req.json();

        // 1. Update the Indent Status
        let completionNote = '';
        if (status === 'Approved') {
            completionNote = `\n[ACTIONED] Store Issued ${qtyFulfilled} units from Batch ${allocatedBatch}.`;
        } else if (status === 'Rejected') {
            completionNote = `\n[ACTIONED] Request Rejected by Store Manager.`;
        }

        const currentIndent = await prisma.appointment.findUnique({ where: { id } });

        await prisma.appointment.update({
            where: { id },
            data: {
                status,
                notes: currentIndent.notes + completionNote
            }
        });

        // 2. Actually deduct physical stock logic if 'Approved'
        if (status === 'Approved' && medicineId && qtyFulfilled > 0) {
            await prisma.medicine.update({
                where: { id: medicineId },
                data: {
                    stock: { decrement: Number(qtyFulfilled) }
                }
            });
        }

        return NextResponse.json({ ok: true, status });
    } catch (e) {
        console.error('Indent PUT Error:', e);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
