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
            tenant: true, // Fetch hospital data
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
            <main>
                <PortalDashboardClient 
                    patient={patientData} 
                    hospitalName={patientData.tenant.name}
                    hospitalLogo={patientData.tenant.logoUrl}
                >
                    {/* Appointments Component */}
                    <div id="appointments-card" key="appointments" style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{ background: '#F0F9FF', padding: '12px', borderRadius: '14px', color: '#0EA5E9' }}><Calendar size={22} /></div>
                                <div>
                                    <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#0F172A' }}>Appointments</h2>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#64748B', fontWeight: 600 }}>RECENT SESSIONS</p>
                                </div>
                            </div>
                        </div>
                        {patientData.appointments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0', border: '2px dashed #F1F5F9', borderRadius: '16px' }}>
                                <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0, fontWeight: 500 }}>No scheduled visits found.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {patientData.appointments.map(a => (
                                    <div key={a.id} className="interactive-row" style={{ padding: '16px', border: '1px solid #F1F5F9', borderRadius: '16px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
                                                <UserIcon size={18} color="#64748B" />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B' }}>Dr. {a.doctorName}</div>
                                                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>{new Date(a.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })} at {a.time}</div>
                                            </div>
                                        </div>
                                        <span style={{ fontSize: '10px', background: a.status === 'Completed' ? '#F0FDF4' : '#FFF7ED', color: a.status === 'Completed' ? '#16A34A' : '#D97706', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{a.status}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Prescriptions Component */}
                    <PortalPrescriptions id="prescriptions-card" key="prescriptions" prescriptions={patientData.prescriptions} />

                    {/* Labs Component */}
                    <div id="reports-card" key="labs" style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                            <div style={{ background: '#FEF2F2', padding: '12px', borderRadius: '14px', color: '#EF4444' }}><FlaskConical size={22} /></div>
                            <div>
                                <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#0F172A' }}>Clinical Diagnostics</h2>
                                <p style={{ margin: 0, fontSize: '12px', color: '#64748B', fontWeight: 600 }}>LABORATORY RESULTS</p>
                            </div>
                        </div>
                        {patientData.labRequests.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0', border: '2px dashed #F1F5F9', borderRadius: '16px' }}>
                                <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0, fontWeight: 500 }}>No reports available.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {patientData.labRequests.map(l => (
                                    <div key={l.id} style={{ padding: '16px', border: '1px solid #F1F5F9', borderRadius: '16px', background: '#F8FAFC' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <strong style={{ fontSize: '14px', color: '#1E293B', fontWeight: 800 }}>{l.testName}</strong>
                                            <span style={{ fontSize: '10px', color: l.status === 'Completed' ? '#10B981' : '#F59E0B', fontWeight: 800, textTransform: 'uppercase' }}>{l.status}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                            <div style={{ padding: '4px 8px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: '#64748B' }}>
                                                {new Date(l.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        {l.result && (
                                            <div style={{ fontSize: '13px', color: '#334155', background: '#fff', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', lineHeight: 1.5 }}>
                                                <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase' }}>Result Summary</div>
                                                {l.result}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <PortalInvoices id="billing-card" key="billing" invoices={invoices} />
                    <PortalGrievance id="feedback-card" key="feedback" />
                </PortalDashboardClient>
            </main>
        </div>
    );
}
