import { cookies } from 'next/headers';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { LogOut, User as UserIcon, Calendar, FileText, FlaskConical, Stethoscope, Receipt, Printer, IndianRupee } from 'lucide-react';
import PortalInvoices from '@/components/portal/PortalInvoices';
import PortalDashboardClient from './PortalDashboardClient';
import PortalPrescriptions from '@/components/portal/PortalPrescriptions';
import PortalGrievance from '@/components/portal/PortalGrievance';

export default async function PatientPortalPage() {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(COOKIE_NAME);
    if (!tokenCookie) redirect('/login');

    const session = verifyToken(tokenCookie.value);
    if (!session || session.role !== 'patient') {
        redirect('/login');
    }

    // Fetch patient records
    const patientData = await prisma.patient.findUnique({
        where: { id: session.id },
        include: {
            appointments: { orderBy: { date: 'desc' }, take: 5 },
            prescriptions: { orderBy: { createdAt: 'desc' }, take: 5 },
            labRequests: { orderBy: { createdAt: 'desc' }, take: 5 },
            records: { orderBy: { createdAt: 'desc' }, take: 5 }
        }
    });

    const invoices = await prisma.invoice.findMany({
        where: { patientId: session.id },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    if (!patientData) redirect('/login');

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
            <header style={{ background: '#0F172A', color: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Stethoscope color="#00C2FF" size={24} />
                    <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.01em' }}>Nexora Patient Portal</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '14px', color: '#94A3B8' }}>{patientData.firstName} {patientData.lastName}</span>
                    <form action="/api/auth/logout" method="POST" style={{ margin: 0 }}>
                        <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                            <LogOut size={14} /> Sign Out
                        </button>
                    </form>
                </div>
            </header>

            <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px' }}>
                <PortalDashboardClient patient={patientData}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {/* Appointments Card */}
                    <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ background: '#F0F9FF', padding: '10px', borderRadius: '10px', color: '#0EA5E9' }}><Calendar size={20} /></div>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#0F172A' }}>Appointments</h2>
                        </div>
                        {patientData.appointments.length === 0 ? (
                            <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>No appointments found.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {patientData.appointments.map(a => (
                                    <div key={a.id} style={{ padding: '12px', border: '1px solid #F1F5F9', borderRadius: '10px', background: '#F8FAFC' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <strong style={{ fontSize: '14px', color: '#1E293B' }}>{a.doctorName}</strong>
                                            <span style={{ fontSize: '12px', color: a.status === 'Completed' ? '#10B981' : '#F59E0B', fontWeight: 600 }}>{a.status}</span>
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#64748B' }}>{new Date(a.date).toLocaleDateString()} {a.time ? `at ${a.time}` : ''}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Prescriptions Card */}
                    <PortalPrescriptions prescriptions={patientData.prescriptions} />

                    {/* Labs Card */}
                    <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ background: '#FEF2F2', padding: '10px', borderRadius: '10px', color: '#EF4444' }}><FlaskConical size={20} /></div>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#0F172A' }}>Lab Reports</h2>
                        </div>
                        {patientData.labRequests.length === 0 ? (
                            <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>No lab reports available.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {patientData.labRequests.map(l => (
                                    <div key={l.id} style={{ padding: '12px', border: '1px solid #F1F5F9', borderRadius: '10px', background: '#F8FAFC' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <strong style={{ fontSize: '14px', color: '#1E293B' }}>{l.testName}</strong>
                                            <span style={{ fontSize: '12px', color: l.status === 'Completed' ? '#10B981' : '#F59E0B', fontWeight: 600 }}>{l.status}</span>
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#64748B' }}>{new Date(l.createdAt).toLocaleDateString()}</div>
                                        {l.result && <div style={{ marginTop: '8px', fontSize: '13px', color: '#334155', background: '#E2E8F0', padding: '8px', borderRadius: '6px' }}>{l.result}</div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Portal Invoices / Billing Component (Client Side Dynamic with Printing) */}
                    <PortalInvoices invoices={invoices} />

                    {/* Feedback & Grievance Component */}
                    <PortalGrievance />
                </div>
                </PortalDashboardClient>
            </main>
        </div>
    );
}
