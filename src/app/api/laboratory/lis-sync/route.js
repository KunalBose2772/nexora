import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { createSystemNotification, sendExternalMessage } from '@/lib/notifications';
import { analyzeLabResults } from '@/lib/clinical_alerts';

/**
 * POST /api/laboratory/lis-sync
 */
export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { trackingId, results } = await req.json();

        // 1. Find the pending lab request
        const labReq = await prisma.labRequest.findFirst({
            where: { 
                tenantId: session.tenantId,
                trackingId: trackingId
            },
            include: { patient: true }
        });

        if (!labReq) {
            return NextResponse.json({ error: 'Lab Request not found' }, { status: 404 });
        }

        // 2. Perform automated clinical analysis for panic values
        const alarms = await analyzeLabResults({
            tenantId: session.tenantId,
            patientName: labReq.patientName,
            testName: labReq.testName,
            results: results
        });

        // 3. Map results and update status
        const updated = await prisma.labRequest.update({
            where: { id: labReq.id },
            data: { 
                status: 'Result Ready',
                testResults: JSON.stringify(results)
            }
        });

        // 3. Trigger Dashboard Notification for Pathologist
        await createSystemNotification({
            tenantId: session.tenantId,
            text: `Machine results synced for ${labReq.patientName} (${labReq.testName}). Diagnostic Review Needed.`,
            type: 'success',
            category: 'Clinical'
        });

        // 4. Trace-log the communication attempt
        if (labReq.patient?.phone) {
            await sendExternalMessage({
                tenantId: session.tenantId,
                recipientName: labReq.patientName,
                recipientPhone: labReq.patient.phone,
                channel: 'SMS',
                type: 'Lab Result Ready (LIS Auto)',
                message: `Dear ${labReq.patientName}, your analyzer results for "${labReq.testName}" are now ready. View your report: Nexora Portal.`
            });
        }

        return NextResponse.json({ ok: true, labRequestId: updated.id });
    } catch (e) {
        console.error("LIS API Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
