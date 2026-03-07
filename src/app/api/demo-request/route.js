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
            <h2>New Demo Request Received</h2>
            <p><strong>Hospital Name:</strong> ${demoReq.hospitalName}</p>
            <p><strong>Email:</strong> ${demoReq.email}</p>
            <p><strong>Phone:</strong> ${demoReq.phone}</p>
            <p><strong>Logo URL:</strong> ${demoReq.logoUrl || 'Not provided'}</p>
            <p><strong>Hero Image URL:</strong> ${demoReq.heroImage || 'Not provided'}</p>
            <br/>
            <p>Please log in to the Super Admin panel to approve or reject this request.</p>
            <p><a href="${baseUrl}/super-admin/requests">View Demo Requests</a></p>
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
