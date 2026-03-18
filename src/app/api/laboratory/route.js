import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { createSystemNotification, sendExternalMessage } from '@/lib/notifications';
import { logAudit } from '@/lib/audit';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const labRequests = await prisma.labRequest.findMany({
            where: { tenantId: session.tenantId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ labRequests });
    } catch (error) {
        console.error('Fetch Lab Requests Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const { patientId, patientName, patientUhId, tests, referringDoctor, collectionTime } = data;

        if (!patientName || !tests || tests.length === 0) {
            return NextResponse.json({ error: 'Patient name and at least one test are required' }, { status: 400 });
        }

        const count = await prisma.labRequest.count({ where: { tenantId: session.tenantId } });
        const trackingIdBase = `LAB-${String(count + 1).padStart(4, '0')}`;

        const createdRequests = [];
        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            const labReq = await prisma.labRequest.create({
                data: {
                    trackingId: `${trackingIdBase}-${(i + 1).toString().padStart(2, '0')}`,
                    patientName,
                    patientUhId: patientUhId || null,
                    patientId: patientId || null,
                    testName: test.name,
                    category: test.category || 'General',
                    amount: test.price || 0,
                    referringDoctor: referringDoctor || null,
                    collectionTime: collectionTime || null,
                    tenantId: session.tenantId,
                }
            });
            createdRequests.push(labReq);
        }

        await logAudit({
            req, session,
            action: 'CREATE',
            resource: 'LabRequest',
            resourceId: createdRequests[0]?.id,
            description: `Generated ${tests.length} lab requests for ${patientName} (${trackingIdBase})`,
            newValue: createdRequests
        });

        return NextResponse.json({ message: 'Lab requests created', labRequests: createdRequests }, { status: 201 });
    } catch (error) {
        console.error('Create Lab Request Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, status } = await req.json();
        if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });

        const updated = await prisma.labRequest.update({
            where: { id },
            data: { status },
            include: { patient: true }
        });

        // 1. Alert if results are ready
        if (status === 'Result Ready') {
            await createSystemNotification({
                tenantId: session.tenantId,
                text: `Lab report uploaded for ${updated.patientName} (${updated.testName})`,
                type: 'success',
                category: 'Clinical'
            });

            // 2. Send external SMS/WhatsApp to patient if phone exists
            if (updated.patient?.phone) {
                await sendExternalMessage({
                    tenantId: session.tenantId,
                    recipientName: updated.patientName,
                    recipientPhone: updated.patient.phone,
                    channel: 'SMS',
                    type: 'Lab Result Ready',
                    message: `Hi ${updated.patientName}, your lab result for "${updated.testName}" is now ready. You can download it from the Nexora Patient Portal or visit the clinic.`
                });
            }
        }

        await logAudit({
            req, session,
            action: 'UPDATE',
            resource: 'LabRequest',
            resourceId: id,
            description: `Lab status updated to ${status} for ${updated.patientName}`,
            newValue: updated
        });

        return NextResponse.json({ labRequest: updated });
    } catch (error) {
        console.error('Update Lab Request Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
