import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { getSessionFromRequest } from '@/lib/auth';

export async function POST(request, context) {
    const params = await context.params;
    const { id } = params;

    const session = await getSessionFromRequest(request);
    if (!session || session.role !== 'superadmin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const demoReq = await prisma.demoRequest.update({
            where: { id },
            data: { status: 'Rejected' }
        });

        const html = `
            <h2>Demo Request Status</h2>
            <p>Hello,</p>
            <p>We are unable to approve your demo request for <strong>${demoReq.hospitalName}</strong> at this time.</p>
            <p>If you have any questions or feel this was a mistake, please reply to this email.</p>
            <p>Best regards,<br/>Nexora Health Team</p>
        `;

        await sendEmail({
            to: demoReq.email,
            subject: 'Update on your Nexora Health Demo Request',
            html
        });

        return NextResponse.json({ ok: true, message: 'Request rejected.' });
    } catch (err) {
        console.error('[POST /api/demo-request/reject]', err);
        return NextResponse.json({ error: 'Failed to reject and mail.' }, { status: 500 });
    }
}
