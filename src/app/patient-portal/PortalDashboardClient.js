'use client';
import React, { useState } from 'react';
import { 
    LayoutDashboard, 
    Calendar, 
    FileText, 
    CreditCard, 
    Settings, 
    User, 
    LogOut, 
    ChevronRight, 
    Menu, 
    X,
    Bell,
    Search,
    Stethoscope,
    Activity,
    ShieldCheck,
    HelpCircle
} from 'lucide-react';
import AppointmentBooking from '@/components/portal/AppointmentBooking';
import ProfileSettings from '@/components/portal/ProfileSettings';

export default function PortalDashboardClient({ patient, children }) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const MENU_ITEMS = [
        { id: 'overview', label: 'Health Snapshot', icon: LayoutDashboard },
        { id: 'appointments', label: 'My Sessions', icon: Calendar },
        { id: 'reports', label: 'Medical Records', icon: FileText },
        { id: 'billing', label: 'Payments & Bills', icon: CreditCard },
        { id: 'profile', label: 'Personal Identity', icon: Settings },
    ];

    const childrenArray = React.Children.toArray(children);

    const renderHeader = () => (
        <div style={{ marginBottom: '40px' }}>
            <div style={{ 
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', 
                borderRadius: '24px', 
                padding: '40px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '30px'
            }}>
                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0, 194, 255, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(0, 194, 255, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <span style={{ background: 'rgba(0, 194, 255, 0.2)', color: '#00C2FF', padding: '6px 14px', borderRadius: '100px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Patient Portfolio
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 600 }}>ID: NXR-{patient.patientCode}</span>
                    </div>
                    <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 8px 0', lineHeight: 1 }}>
                        Welcome back, {patient.firstName}
                    </h1>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: '16px', maxWidth: '500px' }}>
                        Monitor your recovery, manage sessions, and access your digital medical history with ease.
                    </p>
                </div>

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDir: 'column', gap: '12px' }}>
                    <button 
                        onClick={() => setIsBookingOpen(true)}
                        style={{ 
                            padding: '14px 28px', 
                            background: '#00C2FF', 
                            color: '#000', 
                            border: 'none', 
                            borderRadius: '16px', 
                            fontSize: '15px', 
                            fontWeight: 800, 
                            cursor: 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px',
                            boxShadow: '0 10px 25px rgba(0, 194, 255, 0.3)',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <Calendar size={18} strokeWidth={2.5} /> Schedule New Consult
                    </button>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                        {[
                            { icon: ShieldCheck, label: 'Verified Profile' },
                            { icon: Activity, label: 'Active Care Plan' },
                        ].map((badge, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.06)', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                                <badge.icon size={12} color="#00C2FF" /> {badge.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', position: 'relative', fontFamily: "'Inter', sans-serif" }}>
            <style jsx>{`
                .sidebar-item {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 14px 20px;
                    border-radius: 18px;
                    color: #64748B;
                    font-size: 14.5px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    margin-bottom: 6px;
                    text-decoration: none;
                }
                .sidebar-item:hover {
                    background: #fff;
                    color: #0F172A;
                    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
                    transform: translateX(4px);
                }
                .sidebar-item-active {
                    background: #fff;
                    color: #0F172A;
                    box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
                    position: relative;
                }
                .sidebar-item-active::before {
                    content: '';
                    position: absolute;
                    left: -8px;
                    top: 25%;
                    bottom: 25%;
                    width: 4px;
                    background: #00C2FF;
                    border-radius: 0 4px 4px 0;
                }
                .portal-content-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 32px;
                }
                @media (max-width: 1024px) {
                    .portal-content-grid { grid-template-columns: 1fr; }
                    .portal-sidebar { 
                        position: fixed;
                        top: 0;
                        left: ${isSidebarOpen ? '0' : '-320px'};
                        bottom: 0;
                        z-index: 2000;
                        background: #F8FAFC;
                        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow: 20px 0 60px rgba(0,0,0,0.15) !important;
                    }
                }
            `}</style>

            {/* Notification & Desktop Actions Header (Fixed) */}
            <div style={{ 
                position: 'fixed', 
                top: 0, 
                right: 0, 
                left: '300px', 
                height: '80px', 
                background: 'rgba(248, 250, 252, 0.8)', 
                backdropFilter: 'blur(12px)',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '0 40px',
                borderBottom: '1px solid rgba(226, 232, 240, 0.6)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ position: 'relative', cursor: 'pointer', color: '#64748B' }}>
                        <Bell size={20} />
                        <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%', border: '2px solid #F8FAFC' }} />
                    </div>
                </div>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(8px)', zIndex: 1999 }} />}

            {/* Sidebar */}
            <aside className="portal-sidebar" style={{ width: '300px', borderRight: '1px solid #E2E8F0', padding: '40px 24px', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px', padding: '0 8px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#0F172A', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Stethoscope color="#00C2FF" size={22} />
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>Nexora Portfolio</span>
                </div>
                
                <div style={{ flex: 1 }}>
                     <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', paddingLeft: '8px' }}>Personal Hub</div>
                    {MENU_ITEMS.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsSidebarOpen(false);
                            }}
                            className={`sidebar-item ${activeTab === item.id ? 'sidebar-item-active' : ''}`}
                        >
                            <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} color={activeTab === item.id ? '#00C2FF' : 'currentColor'} />
                            {item.label}
                        </div>
                    ))}

                    <div style={{ marginTop: '32px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', paddingLeft: '8px' }}>Support & Help</div>
                    <div className="sidebar-item"><HelpCircle size={20} /> Help Center</div>
                </div>

                <div style={{ marginTop: 'auto', padding: '24px', background: '#fff', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #0F172A 0%, #334155 100%)', color: '#fff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)' }}>
                            {patient.firstName[0]}{patient.lastName[0]}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{patient.firstName} {patient.lastName}</div>
                            <div style={{ fontSize: '11px', color: '#00C2FF', fontWeight: 700 }}>VERIFIED ACCT</div>
                        </div>
                    </div>
                    <form action="/api/auth/logout" method="POST" style={{ margin: 0 }}>
                        <button type="submit" style={{ width: '100%', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px', borderRadius: '14px', fontSize: '13px', fontWeight: 700, color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = '#FEE2E2'; }}>
                            <LogOut size={16} /> Secure Exit
                        </button>
                    </form>
                </div>
            </aside>

            {/* Mobile Header */}
            <div style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, background: '#fff', padding: '16px 20px', zIndex: 1000, borderBottom: '1px solid #E2E8F0' }} className="mobile-only-header">
                <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#0F172A' }}><Menu size={24} /></button>
                <div style={{ fontWeight: 900, fontSize: '16px', color: '#0F172A' }}>Nexora Portfolio</div>
                <div style={{ width: '32px', height: '32px', background: '#0F172A', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700 }}>{patient.firstName[0]}</div>
            </div>
            <style jsx>{`
                @media (max-width: 1024px) {
                    .mobile-only-header { display: flex !important; align-items: center; justify-content: space-between; }
                    .main-container { margin-left: 0 !important; padding-top: 80px !important; }
                }
            `}</style>

            {/* Main Content Area */}
            <main className="main-container" style={{ flex: 1, padding: '120px 40px 40px', maxWidth: '1400px', margin: '0 auto' }}>
                {activeTab === 'overview' && (
                    <div className="fade-in">
                        {renderHeader()}
                        <div style={{ marginBottom: '32px', padding: '0 8px' }}>
                             <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0 }}>Clinical Oversight</h3>
                             <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '14px', fontWeight: 500 }}>Global status of your medical records and appointments.</p>
                        </div>
                        <div className="portal-content-grid">
                            {children}
                        </div>
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div className="fade-in">
                        <div style={{ marginBottom: '40px' }}>
                            <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Schedules & Bookings</h2>
                            <p style={{ margin: 0, color: '#64748B', fontWeight: 500, fontSize: '16px' }}>Manage your verified sessions with health specialists.</p>
                        </div>
                        <div style={{ maxWidth: '800px' }}>
                            {childrenArray.filter(child => child.props?.id === 'appointments-card')}
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="fade-in">
                        <div style={{ marginBottom: '40px' }}>
                            <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Digital Health Records</h2>
                            <p style={{ margin: 0, color: '#64748B', fontWeight: 500, fontSize: '16px' }}>Encrypted access to your lab diagnostics, prescriptions, and digital imaging.</p>
                        </div>
                        <div className="portal-content-grid">
                            {childrenArray.filter(child => child.props?.id === 'prescriptions-card' || child.props?.id === 'reports-card')}
                        </div>
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className="fade-in">
                        <div style={{ marginBottom: '40px' }}>
                            <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Financial Ledger</h2>
                            <p style={{ margin: 0, color: '#64748B', fontWeight: 500, fontSize: '16px' }}>Verified invoices and transparent billing records for all treatments.</p>
                        </div>
                        <div style={{ maxWidth: '900px' }}>
                            {childrenArray.filter(child => child.props?.id === 'billing-card')}
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="fade-in">
                        <div style={{ marginBottom: '40px' }}>
                            <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Privacy & Governance</h2>
                            <p style={{ margin: 0, color: '#64748B', fontWeight: 500, fontSize: '16px' }}>Manage your secure digital identity and access credentials.</p>
                        </div>
                        <ProfileSettings patient={patient} />
                    </div>
                )}
                
                {activeTab === 'overview' && (
                    <div style={{ marginTop: '48px', padding: '40px', background: '#F1F5F9', borderRadius: '32px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h4 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: '0 0 12px 0' }}>Need medical assistance?</h4>
                            <p style={{ margin: 0, color: '#64748B', fontSize: '15px', lineHeight: 1.6 }}>Our 24/7 digital care team is available to help with portal navigation, report explanations, or technical support. No query is too small.</p>
                        </div>
                        <button style={{ padding: '16px 32px', background: '#0F172A', color: '#fff', border: 'none', borderRadius: '18px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>Contact Care Team</button>
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
