import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function POST(request) {
    try {
        const body = await request.json();
        const { hospitalName, email, phone, logoUrl, heroImage } = body;

        if (!hospitalName || !email || !phone) {
            return NextResponse.json({ error: 'Hospital Name, Email, and Phone number are required.' }, { status: 400 });
        }

        // 1. Create DemoRequest record
        const demoReq = await prisma.demoRequest.create({
            data: {
                hospitalName: hospitalName.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.trim(),
                logoUrl: logoUrl?.trim() || null,
                heroImage: heroImage?.trim() || null,
                status: 'Pending',
            }
        });

        // 2. Send notification email to the admin
        const baseUrl = request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://nexora-health.vercel.app';
        const adminHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #F59E0B; padding: 20px 24px;">
                <h2 style="color: #ffffff; margin: 0; font-size: 20px;">🛎️ New Demo Request</h2>
            </div>
            <div style="padding: 24px;">
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px; width: 120px;">Hospital Name:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1a2336; font-size: 15px; font-weight: 600;">${demoReq.hospitalName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;">Email:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #00C2FF; font-size: 15px; font-weight: 600;">${demoReq.email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;">Phone:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1a2336; font-size: 15px; font-weight: 600;">${demoReq.phone}</td>
                    </tr>
                </table>
                <div style="text-align: center;">
                    <a href="${baseUrl}/super-admin/requests" style="background-color: #0f3460; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">Review in Super Admin</a>
                </div>
            </div>
        </div>
        `;

        await sendEmail({
            to: 'help@globalwebify.com',
            subject: `New Nexora Demo Request - ${hospitalName}`,
            html: adminHtml,
        });

        return NextResponse.json({ ok: true, message: 'Your request has been submitted successfully.' });

    } catch (err) {
        console.error('[POST /api/demo-request] error:', err);
        return NextResponse.json({ error: 'Failed to submit demo request. Please try again later.' }, { status: 500 });
    }
}
