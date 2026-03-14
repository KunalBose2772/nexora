import HospitalHomePage from '@/components/hospital/HospitalHomePage';
import prisma from '@/lib/prisma';

export async function generateMetadata({ params }) {
    const { tenant: slug } = await params;
    const tenant = await prisma.tenant.findUnique({ where: { slug } });

    if (!tenant) return { title: 'Not Found' };

    return {
        title: tenant.metaTitle || `${tenant.name} | Hospital Portal`,
        description: tenant.metaDescription || tenant.description || tenant.tagline || 'Experience world-class healthcare.',
        icons: {
            icon: tenant.faviconUrl || '/favicon.ico',
        }
    };
}

export default async function TenantPage({ params }) {
    const { tenant } = await params;
    return <HospitalHomePage slug={tenant} />;
}
