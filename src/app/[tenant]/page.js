import HospitalHomePage from '@/components/hospital/HospitalHomePage';

export default async function TenantPage({ params }) {
    const { tenant } = await params;
    return <HospitalHomePage slug={tenant} />;
}
