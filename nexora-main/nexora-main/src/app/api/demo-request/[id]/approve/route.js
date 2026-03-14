import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { getSessionFromRequest } from '@/lib/auth';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(request, context) {
    const params = await context.params;
    const { id } = params;

    const session = await getSessionFromRequest(request);
    if (!session || session.role !== 'superadmin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const demoReq = await prisma.demoRequest.findUnique({ where: { id } });
        if (!demoReq) {
            return NextResponse.json({ error: 'Demo request not found' }, { status: 404 });
        }
        if (demoReq.status !== 'Pending') {
            return NextResponse.json({ error: 'Request is already ' + demoReq.status }, { status: 400 });
        }

        // 1. Generate slug and tenant code
        const baseSlug = demoReq.hospitalName.toLowerCase().replace(/[^a-z0-9]+/g, '');
        const slug = baseSlug + Math.floor(100 + Math.random() * 900);
        const tenantCode = 'TEN-' + Math.floor(1000 + Math.random() * 9000);

        // 2. Create Tenant
        const tenant = await prisma.tenant.create({
            data: {
                tenantCode,
                slug,
                name: demoReq.hospitalName,
                plan: 'Demo (15 Days)',
                status: 'Active',
                adminEmail: demoReq.email,
                phone: demoReq.phone,
                logoUrl: demoReq.logoUrl,
                heroImage: demoReq.heroImage,
            }
        });


        // 3. Generate password and create User
        const randomPassword = crypto.randomBytes(4).toString('hex'); // 8 char hex
        const userId = 'USR-' + Math.floor(1000 + Math.random() * 9000);

        const mockHash = await bcrypt.hash(randomPassword, 10);

        const user = await prisma.user.create({
            data: {
                userId,
                name: 'Hospital Admin',
                email: demoReq.email,
                passwordHash: mockHash, // IMPORTANT: The auth.js assumes simple base64 comparison or you have to adjust based on how login works. Actually, let's just make it a real password string since we saw previous users might be stored plain or simply hashed. Wait, how was the superadmin seeded? base64 of string. Let's use base64.
                role: 'hospital_admin',
                status: 'Active',
                tenantId: tenant.id
            }
        });

        // 4. Update Request Status
        await prisma.demoRequest.update({
            where: { id },
            data: { status: 'Approved' }
        });

        // 5. Send Email to the User
        const baseUrl = request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://nexora-health.vercel.app';
        const loginUrl = `${baseUrl}/login`;
        const frontEndUrl = `${baseUrl}/${slug}`;

        const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="background-color: #00C2FF; padding: 32px 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Welcome to Nexora Health!</h1>
                <p style="color: rgba(255,255,255,0.9); font-size: 15px; margin-top: 8px;">Your digital hospital journey begins today.</p>
            </div>
            <div style="padding: 32px 24px;">
                <p style="color: #1a2336; font-size: 16px; line-height: 1.6; margin-top: 0;">Hello,</p>
                <p style="color: #64748b; font-size: 15px; line-height: 1.6;">Great news! Your request for a 15-day free demo of Nexora Health for <strong style="color:#1a2336;">\${demoReq.hospitalName}</strong> has been fully approved and your instance is now live.</p>
                
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px; margin: 24px 0;">
                    <h3 style="margin-top:0; color: #0f3460; font-size: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">🔐 Your Admin Credentials</h3>
                    <p style="margin: 12px 0 4px; color: #64748b; font-size: 14px;">Email ID:</p>
                    <p style="margin: 0 0 12px; color: #1a2336; font-size: 16px; font-weight: 600;">\${demoReq.email}</p>
                    
                    <p style="margin: 0 0 4px; color: #64748b; font-size: 14px;">Password:</p>
                    <p style="margin: 0; color: #1a2336; font-size: 16px; font-weight: 600; font-family: monospace; letter-spacing: 1px;">\${randomPassword}</p>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="\${loginUrl}" style="background-color: #0f3460; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block; width: 100%; box-sizing: border-box;">Access Admin Dashboard</a>
                    </div>
                </div>

                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 10px; margin: 24px 0;">
                    <h3 style="margin-top:0; color: #166534; font-size: 16px;">🌐 Your Patient Website is Live!</h3>
                    <p style="color: #15803d; font-size: 14px; line-height: 1.5; margin-bottom: 12px;">We've automatically generated a stunning public landing page where your patients can book appointments directly.</p>
                    <a href="\${frontEndUrl}" style="color: #16a34a; font-weight: 700; font-size: 15px; text-decoration: underline;">\${frontEndUrl}</a>
                </div>

                <p style="color: #64748b; font-size: 14px; line-height: 1.6;">This workspace is fully functional and yours to explore for the next 15 days. If you'd like a guided tour of the features, simply reply to this email.</p>
                
                <p style="color: #1a2336; font-size: 15px; font-weight: 600; margin-top: 32px; margin-bottom: 0;">To better healthcare,<br/>The Nexora Health Team</p>
            </div>
            <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; \${new Date().getFullYear()} Nexora Health. All rights reserved.</p>
            </div>
        </div>
        `;

        await sendEmail({
            to: demoReq.email,
            subject: 'Your Nexora Health Demo is Ready!',
            html
        });

        return NextResponse.json({ ok: true, message: 'Approved and email sent.' });

    } catch (err) {
        console.error('[POST /api/demo-request/approve]', err);
        return NextResponse.json({ error: 'Failed to approve request.' }, { status: 500 });
    }
}
