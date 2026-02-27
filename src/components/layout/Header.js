'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
    Bell,
    ChevronDown,
    Search,
    LogOut,
    User,
    Settings,
    Command,
    Menu,
} from 'lucide-react';
import Image from 'next/image';

function getBreadcrumb(pathname) {
    const segs = pathname.split('/').filter(Boolean);
    return segs.map((seg, i) => ({
        label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
        href: '/' + segs.slice(0, i + 1).join('/'),
    }));
}

const NOTIFICATIONS = [
    { id: 1, text: 'Lab report ready: Patient #GW-001234', time: '2 min ago', dot: '#00C2FF' },
    { id: 2, text: 'Low stock alert: Paracetamol 500mg', time: '18 min ago', dot: '#D97706' },
    { id: 3, text: 'Appointment confirmed: Dr. Sharma', time: '1 hr ago', dot: '#16A34A' },
];

export default function Header({ user, setMobileOpen }) {
    const pathname = usePathname();
    const crumbs = getBreadcrumb(pathname);
    const [showUser, setShowUser] = useState(false);
    const [showNotif, setShowNotif] = useState(false);

    const me = user || { name: 'Admin User', role: 'Super Admin' };

    const closeAll = () => { setShowUser(false); setShowNotif(false); };

    return (
        <header
            className="hms-header"
            role="banner"
            style={{
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 30,
                /* Crisp white frosted glass */
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 2px 14px rgba(0,0,0,0.02)',
            }}
        >
            {/* ── Mobile Menu Toggle ── */}
            <button
                className="desktop-hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open sidebar"
                style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'none', alignItems: 'center', justifyContent: 'center',
                    color: '#64748B', marginRight: '8px'
                }}
            >
                <Menu size={20} strokeWidth={2} />
            </button>
            <style>{`
                .hms-header { padding: 0 24px; gap: 16px; }
                .search-input-wrapper { width: 260px; }
                
                @media (max-width: 1024px) {
                    .desktop-hidden { display: flex !important; }
                }
                @media (max-width: 768px) {
                    .hms-header { padding: 0 16px; gap: 12px; }
                    .mobile-hidden { display: none !important; }
                    .search-input-wrapper { width: 140px; }
                    .header-search-input { padding-right: 12px !important; }
                    .search-cmd-hint { display: none !important; }
                    .header-user-info { display: none !important; }
                    .header-user-btn { padding: 4px !important; }
                }
                @media (max-width: 480px) {
                    .search-input-wrapper { width: 40px; }
                    .header-search-input { 
                        padding-left: 32px !important; 
                        padding-right: 0 !important; 
                        background: transparent !important; 
                        border-color: transparent !important; 
                        box-shadow: none !important; 
                        cursor: pointer;
                    }
                    .header-search-input:focus {
                        width: 140px;
                        position: absolute;
                        right: 0;
                        background: #FFFFFF !important;
                        border-color: #00C2FF !important;
                        box-shadow: 0 0 0 3px rgba(0,194,255,0.15) !important;
                        cursor: text;
                    }
                }
            `}</style>

            {/* ── Page title + breadcrumb ── */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div
                    style={{
                        fontSize: '15.5px',
                        fontWeight: 600,
                        color: '#0F172A',
                        marginBottom: '2px',
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {crumbs.at(-1)?.label || 'Dashboard'}
                </div>
                <nav className="mobile-hidden" aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>Nexora Health</span>
                    {crumbs.map((c, i) => (
                        <span key={c.href} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ color: '#CBD5E1' }}>/</span>
                            {i === crumbs.length - 1 ? (
                                <span style={{ color: '#0F172A', fontWeight: 500 }}>{c.label}</span>
                            ) : (
                                <a href={c.href} style={{ color: '#64748B', textDecoration: 'none' }}>{c.label}</a>
                            )}
                        </span>
                    ))}
                </nav>
            </div>

            {/* ── Search ── */}
            <div className="search-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Search
                    size={14}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        left: '10px',
                        color: '#94A3B8',
                        pointerEvents: 'none',
                        zIndex: 2,
                    }}
                />
                <input
                    className="header-search-input"
                    type="search"
                    placeholder="Search…"
                    aria-label="Global search"
                    style={{
                        height: '35px',
                        paddingLeft: '32px',
                        paddingRight: '46px',
                        width: '100%',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: '#0F172A',
                        fontFamily: 'inherit',
                        outline: 'none',
                        transition: 'all 150ms',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    }}
                    onFocus={(e) => {
                        e.target.style.border = '1px solid #00C2FF';
                        e.target.style.boxShadow = '0 0 0 3px rgba(0,194,255,0.15)';
                    }}
                    onBlur={(e) => {
                        e.target.style.border = '1px solid #E2E8F0';
                        e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
                    }}
                />
                {/* ⌘K hint */}
                <div
                    className="search-cmd-hint"
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        right: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        background: '#F1F5F9',
                        border: '1px solid #E2E8F0',
                        borderRadius: '4px',
                        padding: '2px 5px',
                    }}
                >
                    <Command size={10} style={{ color: '#64748B' }} />
                    <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 500 }}>K</span>
                </div>
            </div>

            {/* ── Notification bell ── */}
            <div style={{ position: 'relative' }}>
                <button
                    id="notif-btn"
                    aria-label="Notifications"
                    aria-haspopup="true"
                    aria-expanded={showNotif}
                    onClick={() => { setShowNotif(!showNotif); setShowUser(false); }}
                    style={{
                        position: 'relative',
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: showNotif ? '#F0F9FF' : '#FFFFFF',
                        border: showNotif ? '1px solid #BAE6FD' : '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: showNotif ? '#0284C7' : '#64748B',
                        transition: 'all 150ms',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    }}
                    onMouseEnter={(e) => { if (!showNotif) { e.currentTarget.style.background = '#F8FAFC'; } }}
                    onMouseLeave={(e) => { if (!showNotif) { e.currentTarget.style.background = '#FFFFFF'; } }}
                >
                    <Bell size={17} strokeWidth={1.5} aria-hidden="true" />
                    <span
                        aria-label="3 unread"
                        style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            width: '8px',
                            height: '8px',
                            background: '#00C2FF',
                            borderRadius: '50%',
                            border: '1.5px solid #FFFFFF',
                        }}
                    />
                </button>

                {showNotif && (
                    <>
                        <div
                            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                            onClick={closeAll}
                            aria-hidden="true"
                        />
                        <div
                            role="menu"
                            aria-labelledby="notif-btn"
                            style={{
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                right: 0,
                                width: '320px',
                                background: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                borderRadius: '12px',
                                boxShadow: '0 12px 36px -4px rgba(0,0,0,0.12)',
                                overflow: 'hidden',
                                zIndex: 50,
                                animation: 'slideUp 150ms ease',
                            }}
                        >
                            <div style={{ padding: '14px 16px', borderBottom: '1px solid #E2E8F0', fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                Notifications
                                <span style={{ fontSize: '11px', color: '#00C2FF', fontWeight: 500, cursor: 'pointer' }}>Mark all as read</span>
                            </div>
                            {NOTIFICATIONS.map((n) => (
                                <button
                                    key={n.id}
                                    role="menuitem"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '12px',
                                        padding: '14px 16px',
                                        width: '100%',
                                        background: 'none',
                                        border: 'none',
                                        borderBottom: '1px solid #F1F5F9',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        fontFamily: 'inherit',
                                        transition: 'background 150ms',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                                >
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.dot, flexShrink: 0, marginTop: '6px' }} />
                                    <div>
                                        <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.4, fontWeight: 500 }}>{n.text}</div>
                                        <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '4px' }}>{n.time}</div>
                                    </div>
                                </button>
                            ))}
                            <button
                                style={{
                                    width: '100%', padding: '12px', background: '#F8FAFC', border: 'none',
                                    fontSize: '12.5px', color: '#64748B', fontWeight: 500, cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#0F172A')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
                            >
                                View all notifications
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* ── User menu ── */}
            <div style={{ position: 'relative' }}>
                <button
                    id="user-btn"
                    className="header-user-btn"
                    aria-label="User menu"
                    aria-haspopup="true"
                    aria-expanded={showUser}
                    onClick={() => { setShowUser(!showUser); setShowNotif(false); }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '4px 10px 4px 4px',
                        background: showUser ? '#F8FAFC' : '#FFFFFF',
                        border: showUser ? '1px solid #CBD5E1' : '1px solid #E2E8F0',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 150ms',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    }}
                    onMouseEnter={(e) => { if (!showUser) e.currentTarget.style.background = '#F8FAFC'; }}
                    onMouseLeave={(e) => { if (!showUser) e.currentTarget.style.background = '#FFFFFF'; }}
                >
                    <div
                        aria-hidden="true"
                        style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '7px',
                            background: 'linear-gradient(135deg, #0A2E4D, #00C2FF)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 700,
                            flexShrink: 0,
                        }}
                    >
                        {me.name.charAt(0)}
                    </div>
                    <div className="header-user-info" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', lineHeight: 1.2 }}>{me.name}</span>
                        <span style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.2 }}>{me.role}</span>
                    </div>
                    <ChevronDown
                        className="header-user-info"
                        size={13}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        style={{
                            color: '#94A3B8',
                            transform: showUser ? 'rotate(180deg)' : 'rotate(0)',
                            transition: 'transform 150ms',
                        }}
                    />
                </button>

                {showUser && (
                    <>
                        <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={closeAll} aria-hidden="true" />
                        <div
                            role="menu"
                            aria-labelledby="user-btn"
                            style={{
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                right: 0,
                                width: '220px',
                                background: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                borderRadius: '12px',
                                boxShadow: '0 12px 36px -4px rgba(0,0,0,0.12)',
                                overflow: 'hidden',
                                zIndex: 50,
                                animation: 'slideUp 150ms ease',
                            }}
                        >
                            <div style={{ padding: '12px 14px', borderBottom: '1px solid #E2E8F0' }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{me.name}</div>
                                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>{me.role}</div>
                            </div>
                            <div style={{ padding: '4px' }}>
                                {[
                                    { icon: User, label: 'My Profile' },
                                    { icon: Settings, label: 'Settings' },
                                ].map(({ icon: Icon, label }) => (
                                    <button
                                        key={label}
                                        role="menuitem"
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                            padding: '8px 10px', width: '100%', background: 'none',
                                            border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                                            color: '#334155', fontFamily: 'inherit',
                                            borderRadius: '6px',
                                            transition: 'background 150ms',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#0F172A'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#334155'; }}
                                    >
                                        <Icon size={15} strokeWidth={1.5} aria-hidden="true" />
                                        {label}
                                    </button>
                                ))}
                                <div style={{ borderTop: '1px solid #E2E8F0', margin: '4px 0' }} />
                                <button
                                    role="menuitem"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '8px 10px', width: '100%', background: 'none',
                                        border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                                        color: '#DC2626', fontFamily: 'inherit',
                                        borderRadius: '6px',
                                        transition: 'background 150ms',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = '#FEF2F2')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                                >
                                    <LogOut size={15} strokeWidth={1.5} aria-hidden="true" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
