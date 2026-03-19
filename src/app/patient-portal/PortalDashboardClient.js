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

export default function PortalDashboardClient({ patient, children, hospitalName, hospitalLogo }) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const MENU_ITEMS = [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'appointments', label: 'My Sessions', icon: Calendar },
        { id: 'reports', label: 'Records', icon: FileText },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'profile', label: 'My Profile', icon: Settings },
    ];

    const childrenArray = React.Children.toArray(children);

    const renderHeader = () => (
        <div style={{ marginBottom: '32px' }}>
            <div style={{ 
                background: '#FFFFFF', 
                borderRadius: '16px', 
                padding: '32px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '24px'
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00C2FF' }} />
                        <span style={{ color: '#64748B', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Authenticated Patient Hub
                        </span>
                        <span style={{ color: '#CBD5E1', margin: '0 4px' }}>|</span>
                        <span style={{ color: '#94A3B8', fontSize: '11px', fontWeight: 600 }}>Ref: {patient.patientCode}</span>
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#0F172A', letterSpacing: '-0.02em', margin: '0 0 4px 0', lineHeight: 1.2 }}>
                        Welcome, {patient.firstName}
                    </h1>
                    <p style={{ margin: 0, color: '#64748B', fontWeight: 400, fontSize: '14px', maxWidth: '600px' }}>
                        Access your clinical records, manage appointments, and track your healthcare journey.
                    </p>
                </div>

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDir: 'column', gap: '8px' }}>
                    <button 
                        onClick={() => setIsBookingOpen(true)}
                        style={{ 
                            padding: '12px 24px', 
                            background: '#0A2E4D', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '10px', 
                            fontSize: '14px', 
                            fontWeight: 600, 
                            cursor: 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 4px 12px rgba(10, 46, 77, 0.1)'
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = '#00C2FF'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = '#0A2E4D'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        <Calendar size={18} /> Book Session
                    </button>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F0F9FF', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, color: '#00C2FF', border: '1px solid #E0F2FE' }}>
                            <ShieldCheck size={12} /> VERIFIED ACCOUNT
                        </div>
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
                    background: rgba(255, 255, 255, 0.05);
                    color: #FFFFFF !important;
                    transform: translateX(4px);
                }
                .sidebar-item-active {
                    background: rgba(0, 194, 255, 0.08);
                    color: #00C2FF !important;
                    position: relative;
                    border-left: 3px solid #00C2FF;
                    border-radius: 0 4px 4px 0;
                }
                .portal-content-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 24px;
                    align-items: start;
                }
                @media (max-width: 1024px) {
                    .portal-content-grid { grid-template-columns: 1fr; }
                    .portal-sidebar { 
                        position: fixed;
                        top: 0;
                        left: ${isSidebarOpen ? '0' : '-260px'};
                        bottom: 0;
                        width: 260px !important;
                        z-index: 2000;
                        background: #071220;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow: 10px 0 40px rgba(0,0,0,0.2) !important;
                    }
                    .portal-sidebar .sidebar-logo-text { color: #fff !important; }
                    .portal-sidebar .sidebar-item { color: rgba(255,255,255,0.6) !important; }
                    .portal-sidebar .sidebar-item-active { color: #00C2FF !important; background: rgba(0,194,255,0.12) !important; }
                }
            `}</style>

            {/* Header (Nexora Standard) */}
            <header style={{ 
                position: 'fixed', 
                top: 0, 
                right: 0, 
                left: '260px', 
                height: '60px', 
                background: '#FFFFFF', 
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                borderBottom: '1px solid #E2E8F0'
            }} className="hms-header">
                <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', lineHeight: 1.2 }}>{MENU_ITEMS.find(m => m.id === activeTab)?.label}</div>
                    <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <span>{hospitalName || 'Health Center'}</span> <span style={{ color: '#CBD5E1' }}>/</span> <span style={{ color: '#0F172A', fontWeight: 500 }}>{MENU_ITEMS.find(m => m.id === activeTab)?.label}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ position: 'relative', cursor: 'pointer', color: '#64748B', width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bell size={18} strokeWidth={1.5} />
                        <span style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', background: '#00C2FF', borderRadius: '50%', border: '1.5px solid #FFF' }} />
                    </div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #0A2E4D, #00C2FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700 }}>
                        {patient.firstName[0]}
                    </div>
                </div>
            </header>

            {/* Sidebar Overlay */}
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(8px)', zIndex: 1999 }} />}

            {/* Sidebar */}
            <aside className="portal-sidebar" style={{ width: '260px', background: '#071220', padding: '18px 0', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 101, borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ padding: '0 20px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                             {hospitalLogo ? (
                                 <img src={hospitalLogo} alt={hospitalName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                             ) : (
                                 <Stethoscope color="#0A2E4D" size={20} />
                             )}
                        </div>
                        <span className="sidebar-logo-text" style={{ fontSize: '16px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                            {hospitalName || 'Patient Portal'}
                        </span>
                    </div>
                </div>
                
                <nav style={{ flex: 1, padding: '0 8px' }}>
                     <div style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', paddingLeft: '16px' }}>Main Navigation</div>
                    {MENU_ITEMS.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsSidebarOpen(false);
                            }}
                            className={`sidebar-item ${activeTab === item.id ? 'sidebar-item-active' : ''}`}
                        >
                            <item.icon size={18} strokeWidth={activeTab === item.id ? 2 : 1.5} />
                            {item.label}
                        </div>
                    ))}

                    <div style={{ marginTop: '24px', fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', paddingLeft: '16px' }}>Support</div>
                    <div className="sidebar-item" style={{ color: 'rgba(255,255,255,0.6)' }}><HelpCircle size={18} strokeWidth={1.5} /> Help Center</div>
                </nav>

                <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #0A2E4D 0%, #00C2FF 100%)', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px' }}>
                            {patient.firstName[0]}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{patient.firstName}</div>
                            <div style={{ fontSize: '10px', color: '#00C2FF', fontWeight: 700, letterSpacing: '0.05em' }}>PATIENT</div>
                        </div>
                    </div>
                    <form action="/api/auth/logout" method="POST" style={{ margin: 0 }}>
                        <button type="submit" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}>
                            <LogOut size={14} /> Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Mobile Header */}
            <div style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, background: '#071220', padding: '0 20px', height: '60px', zIndex: 1000, color: '#fff' }} className="mobile-only-header">
                <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#fff' }}><Menu size={24} /></button>
                <div style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>Patient Portal</div>
                <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #0A2E4D, #00C2FF)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700 }}>{patient.firstName[0]}</div>
            </div>
            <style jsx>{`
                @media (max-width: 1024px) {
                    .mobile-only-header { display: flex !important; align-items: center; justify-content: space-between; }
                    .main-container { margin-left: 0 !important; padding-top: 80px !important; }
                }
            `}</style>

            {/* Main Content Area */}
            <main className="main-container" style={{ flex: 1, padding: '84px 32px 32px', maxWidth: '1400px', margin: '0 0 0 260px' }}>
                {activeTab === 'overview' && (
                    <div className="fade-in">
                        {renderHeader()}
                        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                             <div style={{ width: '3px', height: '16px', background: '#00C2FF', borderRadius: '2px' }} />
                             <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', margin: 0 }}>Quick Summary</h3>
                        </div>
                        <div className="portal-content-grid" style={{ gap: '24px' }}>
                            {children}
                        </div>
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div className="fade-in">
                        <div style={{ marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0F172A', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Schedules & Bookings</h2>
                            <p style={{ margin: 0, color: '#64748B', fontWeight: 400, fontSize: '14px' }}>Manage and track your upcoming health specialist sessions.</p>
                        </div>
                        <div style={{ maxWidth: '800px' }}>
                            {childrenArray.filter(child => child.props?.id === 'appointments-card')}
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="fade-in">
                        <div style={{ marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0F172A', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Medical Records</h2>
                            <p style={{ margin: 0, color: '#64748B', fontWeight: 400, fontSize: '14px' }}>Secure access to your lab diagnostics, prescriptions, and digital imaging.</p>
                        </div>
                        <div className="portal-content-grid" style={{ gap: '24px' }}>
                            {childrenArray.filter(child => child.props?.id === 'prescriptions-card' || child.props?.id === 'reports-card')}
                        </div>
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className="fade-in">
                        <div style={{ marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0F172A', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Financial Records</h2>
                            <p style={{ margin: 0, color: '#64748B', fontWeight: 400, fontSize: '14px' }}>Verified invoices and transparent billing records for all treatments.</p>
                        </div>
                        <div style={{ maxWidth: '900px' }}>
                            {childrenArray.filter(child => child.props?.id === 'billing-card')}
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="fade-in">
                        <div style={{ marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0F172A', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Personal Profile</h2>
                            <p style={{ margin: 0, color: '#64748B', fontWeight: 400, fontSize: '14px' }}>Update your digital identity and contact preferences.</p>
                        </div>
                        <ProfileSettings patient={patient} />
                    </div>
                )}
                
                {activeTab === 'overview' && (
                    <div style={{ marginTop: '48px', padding: '32px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', margin: '0 0 8px 0' }}>Need Support?</h4>
                            <p style={{ margin: 0, color: '#64748B', fontSize: '14px', lineHeight: 1.6 }}>Our medical care team is available to help with portal navigation, report explanations, or technical support.</p>
                        </div>
                        <button style={{ padding: '12px 24px', background: '#0A2E4D', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#00C2FF'} onMouseOut={e => e.currentTarget.style.background = '#0A2E4D'}>Contact Care Team</button>
                    </div>
                )}
            </main>

            <footer style={{
                position: 'fixed',
                bottom: 0,
                right: 0,
                left: '260px',
                height: '40px',
                borderTop: '1px solid #E2E8F0',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                zIndex: 90
            }} className="portal-footer">
                <span style={{ fontSize: '10px', color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Nexora Portfolio</span>
                <span style={{ color: '#CBD5E1', fontSize: '10px' }}>|</span>
                <span style={{ fontSize: '10px', color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Powered by Global Webify</span>
            </footer>

            <style jsx>{`
                @media (max-width: 1024px) {
                    .main-container { margin-left: 0 !important; padding-top: 80px !important; }
                    .hms-header { left: 0 !important; }
                    .portal-footer { left: 0 !important; }
                }
            `}</style>

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
