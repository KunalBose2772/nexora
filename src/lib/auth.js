/**
 * src/lib/auth.js
 * JWT helpers for Next.js API routes
 */

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET = process.env.JWT_SECRET || 'nexora-health-dev-secret';
const COOKIE = 'nexora_token';

export function signToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function signResetToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: '15m' });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch {
        return null;
    }
}

/** Read the session from the request cookie header (works in Route Handlers) */
export async function getSessionFromRequest(request) {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
    if (!match) return null;
    return verifyToken(decodeURIComponent(match[1]));
}

/** Build a Set-Cookie header string */
export function buildCookieHeader(token) {
    const maxAge = 7 * 24 * 60 * 60; // 7 days
    return `${COOKIE}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function clearCookieHeader() {
    return `${COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
}

export const COOKIE_NAME = COOKIE;
