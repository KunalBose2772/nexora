import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // In a real app, this would be a dedicated InsuranceClaim model.
        // For now, we fetch Invoices that have paymentMethod = 'Insurance'
        const claims = await prisma.invoice.findMany({
            where: {
                tenantId: session.tenantId,
                paymentMethod: 'Insurance'
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ claims });
    } catch (error) {
        console.error('Fetch TPA Claims Error:', error);
        return NextResponse.json({ error: 'Failed to fetch claims' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();

        // This simulates a "Pre-Auth" request being converted into an unpaid insurance invoice
        const claim = await prisma.invoice.create({
            data: {
                patientName: data.patientName,
                patientId: data.patientId || null,
                serviceType: data.serviceType || 'TPA Pre-Auth Request',
                amount: Number(data.estimatedAmount),
                discount: 0,
                netPayable: Number(data.estimatedAmount),
                paymentMethod: 'Insurance',
                status: 'Unpaid',
                notes: `[TPA: ${data.insuranceProvider}] Policy No: ${data.policyNumber}. ${data.diagnosis}`,
                tenantId: session.tenantId,
            }
        });

        return NextResponse.json({ message: 'Pre-Authorization Submitted', claim }, { status: 201 });
    } catch (error) {
        console.error('Create TPA Claim Error:', error);
        return NextResponse.json({ error: 'Failed to submit pre-auth' }, { status: 500 });
    }
}
