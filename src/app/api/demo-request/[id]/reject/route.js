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
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #0f3460; padding: 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">Update on your Request</h1>
            </div>
            <div style="padding: 32px 24px;">
                <p style="color: #1a2336; font-size: 16px; margin-top: 0;">Hello,</p>
                <p style="color: #64748b; font-size: 15px; line-height: 1.6;">Thank you for your interest in Nexora Health. Unfortunately, we are unable to approve the demo request for <strong style="color:#1a2336;">\${demoReq.hospitalName}</strong> at this time.</p>
                <p style="color: #64748b; font-size: 15px; line-height: 1.6;">There are many reasons for this, such as missing verifiable information or region availability. If you believe this was a mistake or would like to provide more details, simply reply to this email.</p>
                <p style="color: #1a2336; font-size: 15px; font-weight: 600; margin-top: 30px; margin-bottom: 0;">Best regards,<br/>The Nexora Health Team</p>
            </div>
        </div>
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
