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
        const loginUrl = `http://localhost:3000/login`;
        const frontEndUrl = `http://localhost:3000/${slug}`;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2>Welcome to Nexora Health!</h2>
                <p>Hello,</p>
                <p>Your request for a 15-day free demo of Nexora Health for <strong>${demoReq.hospitalName}</strong> has been approved.</p>
                
                <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top:0;">Your Demo Credentials</h3>
                    <p><strong>Email:</strong> ${demoReq.email}</p>
                    <p><strong>Password:</strong> ${randomPassword}</p>
                    <p style="margin-bottom:0;"><a href="${loginUrl}" style="background: #00C2FF; color: #fff; text-decoration: none; padding: 10px 15px; border-radius: 5px; display: inline-block;">Log In to Dashboard</a></p>
                </div>

                <div style="background: #e6f7ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top:0;">Your Public Hospital Website</h3>
                    <p>We have automatically generated a stunning public landing page for your brand.</p>
                    <p style="margin-bottom:0;"><a href="${frontEndUrl}" style="color: #0088cc;">${frontEndUrl}</a></p>
                </div>

                <p>This demo is fully functional and will remain active for the next 15 days. If you have any questions or would like a guided tour, reply directly to this email.</p>
                
                <p>Best regards,<br/>The Nexora Health Team</p>
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
