/**
 * src/middleware.js
 * Protects /super-admin and /dashboard routes.
 * Redirects to /login if no valid JWT cookie is found.
 */

import { NextResponse } from 'next/server';

const PROTECTED = ['/super-admin', '/dashboard'];
const COOKIE = 'nexora_token';
const SUPER_ADMIN_ROLES = ['superadmin', 'super_admin', 'super admin', 'platform_admin'];
const SECRET = process.env.JWT_SECRET || 'nexora-health-dev-secret';

export function proxy(request) {
    const { pathname } = request.nextUrl;
    
    // Set custom header for internal usage
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', pathname);

    const isProtected = PROTECTED.some(p => pathname.startsWith(p));
    if (!isProtected) {
        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    }

    const token = request.cookies.get(COOKIE)?.value;

    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Lightweight decode — no crypto in Edge runtime, just check structure
    try {
        const parts = token.split('.');
        if (parts.length !== 3) throw new Error('bad token');
        const payload = JSON.parse(atob(parts[1]));

        // Expired?
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('from', pathname);
            const res = NextResponse.redirect(loginUrl);
            res.cookies.delete(COOKIE);
            return res;
        }

        // Role guard: /super-admin is superadmin only
        const userRole = (payload.role || '').toLowerCase();
        const isSuperAdmin = SUPER_ADMIN_ROLES.includes(userRole);
        
        if (pathname.startsWith('/super-admin') && !isSuperAdmin) {
            console.warn(`[Proxy] Access Denied for ${userRole} on ${pathname}. Redirecting to /dashboard`);
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    } catch (e) {
        console.error('[Proxy] Token validation failed:', e.message);
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
