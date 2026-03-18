import React, { useState } from 'react';
import { LayoutDashboard, Calendar, FileText, CreditCard, Settings, User, LogOut, ChevronRight, Menu, X } from 'lucide-react';
import AppointmentBooking from '@/components/portal/AppointmentBooking';
import ProfileSettings from '@/components/portal/ProfileSettings';

export default function PortalDashboardClient({ patient, children }) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const MENU_ITEMS = [
        { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
        { id: 'appointments', label: 'My Appointments', icon: Calendar },
        { id: 'reports', label: 'Clinical Reports', icon: FileText },
        { id: 'billing', label: 'Financials & Invoices', icon: CreditCard },
        { id: 'profile', label: 'Account Settings', icon: Settings },
    ];

    const childrenArray = React.Children.toArray(children);

    const renderHeader = () => (
        <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', margin: '0 0 4px 0' }}>
                        Welcome back, {patient.firstName}! 👋
                    </h1>
                    <p style={{ margin: 0, color: '#64748B', fontWeight: 500, fontSize: '15px' }}>
                        Your personalized health monitoring dashboard.
                    </p>
                </div>
                <button 
                    onClick={() => setIsBookingOpen(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-xl text-sm font-bold cursor-pointer flex items-center gap-2 shadow-xl shadow-blue-100 transition-all hover:-translate-y-0.5"
                >
                    <Calendar size={18} /> Book Appointment
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', position: 'relative' }}>
            <style jsx>{`
                .sidebar-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 20px;
                    border-radius: 14px;
                    color: #64748B;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-bottom: 4px;
                    text-decoration: none;
                }
                .sidebar-item:hover {
                    background: #F1F5F9;
                    color: #0F172A;
                }
                .sidebar-item-active {
                    background: #F1F5F9;
                    color: #0F172A;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                }
                .portal-content-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 24px;
                }
                .mobile-header { display: none; }
                
                @media (max-width: 1024px) {
                    .portal-sidebar { 
                        position: fixed;
                        top: 0;
                        left: ${isSidebarOpen ? '0' : '-100%'};
                        bottom: 0;
                        z-index: 2000;
                        background: #fff;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow: 20px 0 50px rgba(0,0,0,0.1);
                    }
                    .sidebar-overlay {
                        position: fixed;
                        inset: 0;
                        background: rgba(15, 23, 42, 0.4);
                        backdrop-filter: blur(4px);
                        z-index: 1999;
                        display: ${isSidebarOpen ? 'block' : 'none'};
                    }
                    .mobile-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 16px 20px;
                        border-bottom: 1px solid #E2E8F0;
                        background: #fff;
                        position: sticky;
                        top: 0;
                        z-index: 100;
                    }
                    .main-area { padding: 24px !important; }
                }
            `}</style>

            {/* Mobile Header */}
            <div className="mobile-header w-full">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#0F172A', cursor: 'pointer' }}><Menu size={24} /></button>
                    <span style={{ fontWeight: 800, fontSize: '15px' }}>Menu</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                     <div style={{ width: '32px', height: '32px', background: '#0F172A', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>{patient.firstName[0]}</div>
                </div>
            </div>

            {/* Sidebar Overlay */}
            <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />

            {/* Sidebar */}
            <aside className="portal-sidebar" style={{ width: '300px', borderRight: '1px solid #E2E8F0', padding: '32px 16px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', padding: '0 8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>Navigation</span>
                    <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#64748B' }}><X size={20} /></button>
                </div>
                
                <div style={{ flex: 1 }}>
                    {MENU_ITEMS.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsSidebarOpen(false);
                            }}
                            className={`sidebar-item ${activeTab === item.id ? 'sidebar-item-active' : ''}`}
                        >
                            <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                            {item.label}
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: 'auto', padding: '20px', background: '#F8FAFC', borderRadius: '20px', border: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ width: '40px', height: '40px', background: '#0F172A', color: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                            {patient.firstName[0]}{patient.lastName[0]}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{patient.firstName}</div>
                            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>NXR-{patient.patientCode}</div>
                        </div>
                    </div>
                    <form action="/api/auth/logout" method="POST" style={{ margin: 0 }}>
                        <button type="submit" style={{ width: '100%', background: '#fff', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <LogOut size={14} /> End Session
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-area" style={{ flex: 1, padding: '40px', background: '#fff', maxWidth: '100%', overflowX: 'hidden' }}>
                {activeTab === 'overview' && (
                    <div className="fade-in">
                        {renderHeader()}
                        <div className="portal-content-grid">
                            {children}
                        </div>
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div className="fade-in">
                        <div style={{ marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: '0 0 8px' }}>Appointment Hub</h2>
                            <p style={{ margin: 0, color: '#64748B', fontWeight: 500 }}>Track upcoming visits and reschedule bookings.</p>
                        </div>
                        <div className="portal-content-grid" style={{ maxWidth: '600px' }}>
                            {childrenArray.filter(child => child.props?.id === 'appointments-card')}
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="fade-in">
                        <div style={{ marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: '0 0 8px' }}>Clinical Reports</h2>
                            <p style={{ margin: 0, color: '#64748B', fontWeight: 500 }}>Global access to your lab diagnostics, prescriptions and imaging.</p>
                        </div>
                        <div className="portal-content-grid">
                            {childrenArray.filter(child => child.props?.id === 'prescriptions-card' || child.props?.id === 'reports-card')}
                        </div>
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className="fade-in">
                        <div style={{ marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: '0 0 8px' }}>Financial Ledger</h2>
                            <p style={{ margin: 0, color: '#64748B', fontWeight: 500 }}>Securely manage invoices, payments, and receipts.</p>
                        </div>
                        <div style={{ maxWidth: '800px' }}>
                            {childrenArray.filter(child => child.props?.id === 'billing-card')}
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="fade-in">
                        <div style={{ marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: '0 0 8px' }}>Privacy & Account</h2>
                            <p style={{ margin: 0, color: '#64748B', fontWeight: 500 }}>Manage your digital identity and security settings.</p>
                        </div>
                        <ProfileSettings patient={patient} />
                    </div>
                )}
            </main>

            <AppointmentBooking 
                isOpen={isBookingOpen}
                patient={patient}
                onClose={() => setIsBookingOpen(false)}
                onBookingSuccess={() => {
                    window.location.reload();
                }}
            />
        </div>
    );
}
