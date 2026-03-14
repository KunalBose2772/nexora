import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request, { params }) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const order = await prisma.radiologyOrder.findUnique({
            where: { id: params.id },
            include: {
                patient: true,
                report: true
            }
        });

        if (!order || order.tenantId !== session.tenantId) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ order }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/radiology/[id]]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { status, findings, impression, criticalAlert, radiologistName, reportStatus, dicomLink } = body;

        // Use transaction to update both order and report
        await prisma.$transaction(async (tx) => {
            // Update order status if provided
            if (status) {
                await tx.radiologyOrder.update({
                    where: { id: params.id },
                    data: { status }
                });
            }

            // Create or update report
            if (findings !== undefined || impression !== undefined || reportStatus !== undefined) {
                const reportData = {
                    findings,
                    impression,
                    criticalAlert,
                    radiologistName,
                    status: reportStatus || 'Draft',
                    dicomLink,
                    tenantId: session.tenantId,
                    finalizedAt: reportStatus === 'Finalized' ? new Date() : undefined
                };

                await tx.radiologyReport.upsert({
                    where: { orderId: params.id },
                    create: {
                        ...reportData,
                        orderId: params.id
                    },
                    update: reportData
                });

                // Auto-complete order if finalized
                if (reportStatus === 'Finalized') {
                    await tx.radiologyOrder.update({
                        where: { id: params.id },
                        data: { status: 'Completed' }
                    });
                }
            }
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error('[PATCH /api/radiology/[id]]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
