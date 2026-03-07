import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { signResetToken } from '@/lib/auth';
import nodemailer from 'nodemailer';

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
        const resetLink = `${req.headers.get('origin') || process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        console.log(`\n\n[MOCK EMAIL SEND] Password Reset for ${email} -> ${resetLink}\n\n`);

        // If you actually setup SMTP, here is an example:
        /*
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });
        await transporter.sendMail({
            from: '"Nexora Health" <noreply@nexorahealth.com>',
            to: email,
            subject: 'Password Reset Request',
            html: `<p>Click here to reset your password:</p><a href="${resetLink}">Reset Password</a>`
        });
        */

        return NextResponse.json({ ok: true, message: 'Password reset link sent.' });
    } catch (err) {
        console.error('Forgot Password API error:', err);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
