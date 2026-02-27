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

function getBreadcrumb(pathname) {
    const segs = pathname.split('/').filter(Boolean);
    return segs.map((seg, i) => ({
        label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
        href: '/' + segs.slice(0, i + 1).join('/'),
    }));
}

const NOTIFICATIONS = [
    { id: 1, text: 'New Hospital Signed Up: City General', time: '10 min ago', dot: '#10B981' },
    { id: 2, text: 'System Update: v1.2 deployed successfully', time: '2 hrs ago', dot: '#3B82F6' },
    { id: 3, text: 'High Server Load on Database Cluster A', time: '4 hrs ago', dot: '#EF4444' },
];

export default function SuperAdminHeader({ user, setMobileOpen }) {
    const pathname = usePathname();
    const crumbs = getBreadcrumb(pathname);
    const [showUser, setShowUser] = useState(false);
    const [showNotif, setShowNotif] = useState(false);

    const me = user || { name: 'Kunal Bose', role: 'SaaS Creator' };

    const closeAll = () => { setShowUser(false); setShowNotif(false); };

    return (
        <header
            className="super-admin-top-nav"
            role="banner"
            style={{
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 30,
                background: '#FFFFFF',
                borderBottom: '1px solid #E2E8F0',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            }}
        >
            <button
                className="desktop-hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open sidebar"
                style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'none', alignItems: 'center', justifyContent: 'center',
                    color: '#64748B', marginRight: '16px'
                }}
            >
                <Menu size={20} strokeWidth={2} />
            </button>
            <style>{`
                .super-admin-top-nav { padding: 0 32px; gap: 24px; }
                .search-input-wrapper { width: 320px; }
                
                @media (max-width: 1024px) {
                    .desktop-hidden { display: flex !important; }
                }
                @media (max-width: 768px) {
                    .super-admin-top-nav { padding: 0 16px; gap: 12px; }
                    .mobile-hidden { display: none !important; }
                    .search-input-wrapper { width: 140px; }
                    .header-search-input { padding-right: 12px !important; }
                    .search-cmd-hint { display: none !important; }
                    .header-user-info { display: none !important; }
                    .header-user-btn { padding: 4px !important; }
                }
            `}</style>


            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <nav className="mobile-hidden" aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>Global Webify</span>
                    {crumbs.map((c, i) => (
                        <span key={c.href} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#CBD5E1' }}>/</span>
                            {i === crumbs.length - 1 ? (
                                <span style={{ color: '#0F172A', fontWeight: 600 }}>{c.label}</span>
                            ) : (
                                <a href={c.href} style={{ color: '#64748B', textDecoration: 'none' }}>{c.label}</a>
                            )}
                        </span>
                    ))}
                </nav>
            </div>


            <div className="search-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Search
                    size={14}
                    strokeWidth={1.5}
                    style={{
                        position: 'absolute',
                        left: '12px',
                        color: '#94A3B8',
                        pointerEvents: 'none',
                        zIndex: 2,
                    }}
                />
                <input
                    className="header-search-input"
                    type="search"
                    placeholder="Search tenants, ID, or settings..."
                    style={{
                        height: '38px',
                        paddingLeft: '36px',
                        paddingRight: '46px',
                        width: '100%',
                        background: '#1F293705',
                        border: '1px solid #E2E8F0',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#0F172A',
                        outline: 'none',
                        transition: 'all 150ms',
                    }}
                    onFocus={(e) => {
                        e.target.style.border = '1px solid #10B981';
                        e.target.style.background = '#FFFFFF';
                        e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.15)';
                    }}
                    onBlur={(e) => {
                        e.target.style.border = '1px solid #E2E8F0';
                        e.target.style.background = '#1F293705';
                        e.target.style.boxShadow = 'none';
                    }}
                />
                <div
                    className="search-cmd-hint"
                    style={{
                        position: 'absolute', right: '8px', display: 'flex', alignItems: 'center', gap: '2px',
                        background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '4px', padding: '2px 5px',
                    }}
                >
                    <Command size={10} style={{ color: '#64748B' }} />
                    <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>K</span>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                    <button
                        id="notif-btn"
                        onClick={() => { setShowNotif(!showNotif); setShowUser(false); }}
                        style={{
                            width: '38px', height: '38px', borderRadius: '50%', background: '#F8FAFC',
                            border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#64748B', transition: 'all 150ms',
                        }}
                    >
                        <Bell size={18} strokeWidth={1.5} />
                        <span style={{ position: 'absolute', top: '7px', right: '9px', width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', border: '1.5px solid #FFFFFF' }} />
                    </button>
                    {showNotif && (
                        <>
                            <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={closeAll} />
                            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '340px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', zIndex: 50, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                                <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', fontSize: '14px', fontWeight: 600 }}>Platform Alerts</div>
                                {NOTIFICATIONS.map((n) => (
                                    <button key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #F1F5F9', textAlign: 'left', cursor: 'pointer' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.dot, flexShrink: 0, marginTop: '6px' }} />
                                        <div>
                                            <div style={{ fontSize: '13.5px', color: '#0F172A', fontWeight: 500 }}>{n.text}</div>
                                            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>{n.time}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div style={{ height: '32px', width: '1px', background: '#E2E8F0' }} />

                <div style={{ position: 'relative' }}>
                    <button
                        id="user-btn"
                        className="header-user-btn"
                        onClick={() => { setShowUser(!showUser); setShowNotif(false); }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px', padding: '4px',
                            background: 'none', border: 'none', cursor: 'pointer',
                        }}
                    >
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', fontSize: '14px', fontWeight: 700 }}>
                            {me.name.charAt(0)}
                        </div>
                        <div className="header-user-info" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A' }}>{me.name}</span>
                            <span style={{ fontSize: '11px', color: '#64748B' }}>{me.role}</span>
                        </div>
                        <ChevronDown className="header-user-info" size={14} style={{ color: '#94A3B8' }} />
                    </button>
                    {showUser && (
                        <>
                            <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={closeAll} />
                            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '240px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', zIndex: 50, padding: '8px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                                <div style={{ padding: '8px 12px', marginBottom: '8px', borderBottom: '1px solid #F1F5F9' }}>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{me.name}</div>
                                    <div style={{ fontSize: '12px', color: '#64748B' }}>{me.role}</div>
                                </div>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#334155', borderRadius: '6px' }}><User size={16} /> Platform Profile</button>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#334155', borderRadius: '6px' }}><Settings size={16} /> Global Settings</button>
                                <div style={{ borderTop: '1px solid #F1F5F9', margin: '8px 0' }} />
                                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#EF4444', borderRadius: '6px' }}><LogOut size={16} /> Sign Out</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
