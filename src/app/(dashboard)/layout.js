import DashboardShell from '@/components/layout/DashboardShell';

export const metadata = {
    title: 'Hospital Dashboard',
};

export default function DashboardLayout({ children }) {
    return <DashboardShell>{children}</DashboardShell>;
}
