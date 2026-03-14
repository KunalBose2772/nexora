import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const invoices = await prisma.invoice.findMany({
            where: { tenantId: session.tenantId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ invoices });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const {
            patientName, patientUhId, patientId, serviceType, amount, discount,
            paymentMethod, notes, managerOverride,
            isTpa, tpaId, tpaReference, approvedAmount, copayAmount
        } = data;

        if (!patientName || !amount) return NextResponse.json({ error: 'Patient name and amount are required' }, { status: 400 });

        const requestedDiscount = parseFloat(discount) || 0;

        // TPA Rate-Card Integrity: If TPA is active, we don't allow additional manual discounts 
        // unless manager override is present (prevents 'discount leak' on corporate cases)
        if (isTpa && requestedDiscount > 0 && session.role !== 'admin' && managerOverride !== '1234') {
            return NextResponse.json({
                error: 'Corporate Policy Alert: TPA cases use pre-negotiated rate cards. Manual discounts on TPA bills require Manager Approval.'
            }, { status: 403 });
        }

        // Strict Financial Security: Maker-Checker for Discounts > 5%
        if (requestedDiscount > 5 && session.role !== 'admin' && managerOverride !== '1234') {
            return NextResponse.json({
                error: 'Security Alert: Discounts above 5% require a valid Manager PIN override.',
                requirePin: true
            }, { status: 403 });
        }

        const count = await prisma.invoice.count({ where: { tenantId: session.tenantId } });
        const year = new Date().getFullYear();
        const invoiceCode = `INV-${year}-${String(count + 1).padStart(4, '0')}`;

        const discountAmt = parseFloat(amount) * (requestedDiscount / 100);
        const taxAmt = (parseFloat(amount) - discountAmt) * 0.05; // 5% tax
        const netAmount = parseFloat(amount) - discountAmt + taxAmt;

        let finalNotes = notes || '';
        if (requestedDiscount > 5) {
            finalNotes += ` [Audit: ${requestedDiscount}% discount approved by Manager Override]`;
        }
        if (isTpa) {
            finalNotes += ` [Corporate Bill: TPA Ref ${tpaReference || 'N/A'}]`;
        }

        const invoice = await prisma.invoice.create({
            data: {
                invoiceCode,
                patientName,
                patientUhId: patientUhId || null,
                patientId: patientId || null,
                serviceType: serviceType || 'OPD Consult',
                amount: parseFloat(amount),
                discount: requestedDiscount,
                tax: taxAmt,
                netAmount,
                paymentMethod: paymentMethod || 'Cash',
                status: isTpa ? 'Pending' : 'Paid', // TPA bills stay pending until settlement
                notes: finalNotes.trim() || null,
                tenantId: session.tenantId,
                isTpa: !!isTpa,
                tpaId: tpaId || null,
                tpaReference: tpaReference || null,
                approvedAmount: parseFloat(approvedAmount || 0),
                copayAmount: parseFloat(copayAmount || 0),
                tpaStatus: isTpa ? 'Pending' : 'None'
            }
        });

        return NextResponse.json({ invoice }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, status, voidReason } = await req.json();
        if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });

        // Fetch existing invoice to preserve state and append trails
        const existing = await prisma.invoice.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });

        let finalNotes = existing.notes || '';

        // If voiding, mandate a reason and log the timestamp/user
        if (status === 'Cancelled' || status === 'Voided') {
            if (!voidReason || voidReason.length < 5) {
                return NextResponse.json({ error: 'A detailed reason (min 5 chars) is mandatory to void an invoice.' }, { status: 400 });
            }
            finalNotes += `\n[VOID AUDIT TRAIL: Voided on ${new Date().toISOString()} by UID-${session.id}. Reason: ${voidReason}]`;
        }

        const updated = await prisma.invoice.update({
            where: { id },
            data: {
                status: status === 'Voided' ? 'Cancelled' : status,
                notes: finalNotes
            }
        });

        return NextResponse.json({ invoice: updated });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
