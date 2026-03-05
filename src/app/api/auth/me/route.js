// GET /api/auth/me  — returns current session from JWT cookie
// POST /api/auth/logout — clears the cookie
import { NextResponse } from 'next/server';
import { getSessionFromRequest, clearCookieHeader } from '@/lib/auth';

export async function GET(request) {
    const session = await getSessionFromRequest(request);
    if (!session) {
        return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({ user: session });
}

export async function POST() {
    return NextResponse.json({ ok: true }, {
        headers: { 'Set-Cookie': clearCookieHeader() },
    });
}
