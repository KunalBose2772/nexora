import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { signResetToken } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const { email } = await req.json();
        if (!email) return NextResponse.json({ error: 'Email is required.' }, { status: 400 });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Do not reveal if email exists, just return success
            return NextResponse.json({ ok: true, message: 'If an account exists, a reset link was sent.' });
        }

        // Generate a 15-minute token
        const resetToken = signResetToken({ id: user.id, email: user.email });
        const resetLink = `${req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="background-color: #0f3460; padding: 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Nexora Health</h1>
            </div>
            <div style="padding: 32px 24px;">
                <h2 style="color: #1a2336; margin-top: 0; font-size: 20px;">Password Reset Request</h2>
                <p style="color: #64748b; font-size: 15px; line-height: 1.6;">Hello,</p>
                <p style="color: #64748b; font-size: 15px; line-height: 1.6;">We received a request to reset the password for your Nexora Health account associated with <strong>${email}</strong>.</p>
                
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${resetLink}" style="background-color: #00C2FF; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">Reset Your Password</a>
                </div>
                
                <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 0;">If the button above doesn't work, copy and paste this link into your browser:</p>
                <p style="color: #00C2FF; font-size: 13px; word-break: break-all; margin-top: 4px;">${resetLink}</p>
                
                <div style="border-top: 1px solid #e2e8f0; margin-top: 32px; padding-top: 24px;">
                    <p style="color: #94a3b8; font-size: 13px; margin: 0;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                </div>
            </div>
            <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Nexora Health. All rights reserved.</p>
            </div>
        </div>
        `;

        // Send actual email instead of mock
        await sendEmail({
            to: email,
            subject: 'Password Reset Request - Nexora Health',
            html
        });

        return NextResponse.json({ ok: true, message: 'Password reset link sent.' });
    } catch (err) {
        console.error('Forgot Password API error:', err);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
