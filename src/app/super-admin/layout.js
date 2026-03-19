import SuperAdminShell from '@/components/layout/SuperAdminShell';

export const metadata = {
  title: 'Super Admin | Nexora Health',
  description: 'Nexora Health SaaS Operations Center',
};

export default function SuperAdminLayout({ children }) {
  return <SuperAdminShell>{children}</SuperAdminShell>;
}
