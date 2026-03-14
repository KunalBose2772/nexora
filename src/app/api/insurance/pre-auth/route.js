import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get('patientId');

        const preAuths = await prisma.insurancePreAuth.findMany({
            where: {
                tenantId: session.tenantId,
                ...(patientId ? { patientId } : {})
            },
            include: {
                patient: { select: { firstName: true, lastName: true, patientCode: true } },
                tpa: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ preAuths }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/insurance/pre-auth]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { patientId, tpaId, authCode, requestedAmount, approvedAmount, expiryDate, documentUrl, notes } = body;

        const preAuth = await prisma.insurancePreAuth.create({
            data: {
                patientId,
                tpaId,
                authCode,
                requestedAmount: parseFloat(requestedAmount),
                approvedAmount: approvedAmount ? parseFloat(approvedAmount) : null,
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                documentUrl,
                notes,
                tenantId: session.tenantId,
                status: approvedAmount ? 'Approved' : 'Pending'
            }
        });

        return NextResponse.json({ preAuth }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/insurance/pre-auth]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
