import SuperAdminShell from '@/components/layout/SuperAdminShell';

export const metadata = {
    title: 'Platform Control Center | Nexora Health SaaS',
};

export default function SuperAdminLayout({ children }) {
    return <SuperAdminShell>{children}</SuperAdminShell>;
}
