import DashboardShell from '@/components/layout/DashboardShell';
import { cookies } from 'next/headers';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { AlertTriangle, Clock } from 'lucide-react';

export const metadata = {
    title: 'Hospital Dashboard | Nexora Health',
};

export default async function DashboardLayout({ children }) {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(COOKIE_NAME);
    if (!tokenCookie) {
        redirect('/login');
    }
    const session = verifyToken(tokenCookie.value);
    if (!session) {
        redirect('/login');
    }
    if (session.role === 'superadmin' || session.role === 'super_admin') {
        redirect('/super-admin');
    }
    if (session.role === 'patient') {
        redirect('/patient-portal');
    }

    let trialDaysLeft = null;
    let isTrialExpired = false;

    if (session.tenantId) {
        const tenant = await prisma.tenant.findUnique({ where: { id: session.tenantId }, select: { plan: true, createdAt: true } });
        if (tenant && tenant.plan.includes('Demo')) {
            const createdAt = new Date(tenant.createdAt);
            const now = new Date();
            const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
            trialDaysLeft = Math.max(0, 15 - diffDays);
            isTrialExpired = trialDaysLeft === 0;
        }
    }

    if (isTrialExpired) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EEF2F8', padding: '20px' }}>
                <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', maxWidth: '480px', textAlign: 'center', borderTop: '4px solid #EF4444' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <Clock size={32} />
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '12px' }}>Your Free Trial has Expired</h1>
                    <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6, marginBottom: '32px' }}>
                        Your 15-day Demo of Nexora Health has concluded. To restore access to your hospital dashboard, Patient EMRs, and billing modules, please upgrade to a permanent plan.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <a href="mailto:help@globalwebify.com" className="btn btn-secondary">Contact Sales</a>
                        <Link href="/login" className="btn btn-primary" style={{ textDecoration: 'none' }}>Back to Login</Link>
                    </div>
                </div>
            </div>
        );
    }

    return <DashboardShell trialDaysLeft={trialDaysLeft}>{children}</DashboardShell>;
}
