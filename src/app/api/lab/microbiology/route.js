import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const organisms = await prisma.organism.findMany({
            where: { tenantId: session.tenantId }
        });

        // Fetch microbiology requests (LabRequests in Microbiology category)
        const requests = await prisma.labRequest.findMany({
            where: {
                tenantId: session.tenantId,
                category: 'Microbiology'
            },
            include: {
                sensitivities: {
                    include: { organism: true }
                },
                patient: { select: { firstName: true, lastName: true, patientCode: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ organisms, requests }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/lab/microbiology]', err);
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
        const { labRequestId, organismId, sensitivities } = body;

        // sensitivities is an array: [{ antibiotic: 'Amoxicillin', result: 'Sensitive', micValue: '0.5' }]

        await prisma.$transaction(async (tx) => {
            // Delete old sensitivities for this request if any
            await tx.cultureSensitivity.deleteMany({
                where: { labRequestId, tenantId: session.tenantId }
            });

            // Add new sensitivities
            await tx.cultureSensitivity.createMany({
                data: sensitivities.map(s => ({
                    labRequestId,
                    organismId,
                    antibiotic: s.antibiotic,
                    result: s.result,
                    micValue: s.micValue,
                    tenantId: session.tenantId
                }))
            });

            // Update LabRequest status
            await tx.labRequest.update({
                where: { id: labRequestId },
                data: { status: 'Result Ready' }
            });

            // CRITICAL LAB ALARM: Check for MDR / Critical Resistant isolates
            const isCritical = sensitivities.some(s => s.result === 'Resistant');
            if (isCritical) {
                const req = await tx.labRequest.findUnique({
                    where: { id: labRequestId },
                    include: { patient: true }
                });
                const org = await tx.organism.findUnique({ where: { id: organismId } });

                await tx.notification.create({
                    data: {
                        tenantId: session.tenantId,
                        text: `CRITICAL: ${org?.name} resistant isolate detected for patient ${req?.patient?.firstName} ${req?.patient?.lastName} (${req?.patient?.patientCode})`,
                        type: 'error',
                        category: 'Clinical'
                    }
                });
            }
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/lab/microbiology]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
