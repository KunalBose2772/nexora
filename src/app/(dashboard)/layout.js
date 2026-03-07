import DashboardShell from '@/components/layout/DashboardShell';
import { cookies } from 'next/headers';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { redirect } from 'next/navigation';

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

    return <DashboardShell>{children}</DashboardShell>;
}
