import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const { token, newPassword } = await req.json();
        if (!token || !newPassword) {
            return NextResponse.json({ error: 'Token and new password are required.' }, { status: 400 });
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.id) {
            return NextResponse.json({ error: 'Reset link has expired or is invalid.' }, { status: 401 });
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: decoded.id },
            data: { passwordHash }
        });

        return NextResponse.json({ ok: true, message: 'Password reset successfully.' });
    } catch (err) {
        console.error('Reset Password API error:', err);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
