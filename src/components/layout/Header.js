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

export default function Header({ user }) {
    const pathname = usePathname();
    const crumbs = getBreadcrumb(pathname);
    const [showUser, setShowUser] = useState(false);
    const [showNotif, setShowNotif] = useState(false);

    const me = user || { name: 'Admin User', role: 'Super Admin' };

    const closeAll = () => { setShowUser(false); setShowNotif(false); };

    return (
        <header
            role="banner"
            style={{
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
                gap: '16px',
                position: 'sticky',
                top: 0,
                zIndex: 30,
                /* Dark frosted glass */
                background: 'rgba(7, 18, 36, 0.82)',
                backdropFilter: 'blur(14px) saturate(160%)',
                WebkitBackdropFilter: 'blur(14px) saturate(160%)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 1px 24px rgba(0,0,0,0.28)',
            }}
        >
            {/* ── Page title + breadcrumb ── */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div
                    style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#F1F5F9',
                        marginBottom: '2px',
                        lineHeight: 1.2,
                    }}
                >
                    {crumbs.at(-1)?.label || 'Dashboard'}
                </div>
                <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.35)' }}>Nexora Health</span>
                    {crumbs.map((c, i) => (
                        <span key={c.href} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ color: 'rgba(255,255,255,0.20)' }}>/</span>
                            {i === crumbs.length - 1 ? (
                                <span style={{ color: 'rgba(255,255,255,0.60)', fontWeight: 500 }}>{c.label}</span>
                            ) : (
                                <a href={c.href} style={{ color: 'rgba(255,255,255,0.40)', textDecoration: 'none' }}>{c.label}</a>
                            )}
                        </span>
                    ))}
                </nav>
            </div>

            {/* ── Search ── */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search
                    size={14}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        left: '10px',
                        color: 'rgba(255,255,255,0.35)',
                        pointerEvents: 'none',
                    }}
                />
                <input
                    type="search"
                    placeholder="Search patients, invoices…"
                    aria-label="Global search"
                    style={{
                        height: '35px',
                        paddingLeft: '32px',
                        paddingRight: '46px',
                        width: '240px',
                        background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.80)',
                        fontFamily: 'inherit',
                        outline: 'none',
                        transition: 'border 150ms, background 150ms',
                    }}
                    onFocus={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.10)';
                        e.target.style.border = '1px solid rgba(0,194,255,0.40)';
                    }}
                    onBlur={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.07)';
                        e.target.style.border = '1px solid rgba(255,255,255,0.10)';
                    }}
                />
                {/* ⌘K hint */}
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        right: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: '4px',
                        padding: '2px 5px',
                    }}
                >
                    <Command size={10} style={{ color: 'rgba(255,255,255,0.30)' }} />
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.30)' }}>K</span>
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
                        background: showNotif ? 'rgba(0,194,255,0.12)' : 'rgba(255,255,255,0.06)',
                        border: showNotif ? '1px solid rgba(0,194,255,0.30)' : '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'rgba(255,255,255,0.70)',
                        transition: 'all 150ms',
                    }}
                    onMouseEnter={(e) => { if (!showNotif) { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; } }}
                    onMouseLeave={(e) => { if (!showNotif) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; } }}
                >
                    <Bell size={17} strokeWidth={1.5} aria-hidden="true" />
                    <span
                        aria-label="3 unread"
                        style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            width: '7px',
                            height: '7px',
                            background: '#00C2FF',
                            borderRadius: '50%',
                            border: '1.5px solid rgba(7,18,36,0.9)',
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
                                background: 'rgba(10,20,40,0.96)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.10)',
                                borderRadius: '12px',
                                boxShadow: '0 16px 48px rgba(0,0,0,0.50)',
                                overflow: 'hidden',
                                zIndex: 50,
                                animation: 'slideUp 150ms ease',
                            }}
                        >
                            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '13px', fontWeight: 600, color: '#F1F5F9' }}>
                                Notifications
                            </div>
                            {NOTIFICATIONS.map((n) => (
                                <button
                                    key={n.id}
                                    role="menuitem"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '10px',
                                        padding: '12px 16px',
                                        width: '100%',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        fontFamily: 'inherit',
                                        transition: 'background 150ms',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                                >
                                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: n.dot, flexShrink: 0, marginTop: '5px' }} />
                                    <div>
                                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.80)', lineHeight: 1.4 }}>{n.text}</div>
                                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '3px' }}>{n.time}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* ── User menu ── */}
            <div style={{ position: 'relative' }}>
                <button
                    id="user-btn"
                    aria-label="User menu"
                    aria-haspopup="true"
                    aria-expanded={showUser}
                    onClick={() => { setShowUser(!showUser); setShowNotif(false); }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '4px 10px 4px 4px',
                        background: showUser ? 'rgba(0,194,255,0.10)' : 'rgba(255,255,255,0.06)',
                        border: showUser ? '1px solid rgba(0,194,255,0.30)' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 150ms',
                    }}
                    onMouseEnter={(e) => { if (!showUser) e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
                    onMouseLeave={(e) => { if (!showUser) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
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
                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#F1F5F9', lineHeight: 1.2 }}>{me.name}</span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.40)', lineHeight: 1.2 }}>{me.role}</span>
                    </div>
                    <ChevronDown
                        size={13}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        style={{
                            color: 'rgba(255,255,255,0.35)',
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
                                background: 'rgba(10,20,40,0.96)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.10)',
                                borderRadius: '12px',
                                boxShadow: '0 16px 48px rgba(0,0,0,0.50)',
                                overflow: 'hidden',
                                zIndex: 50,
                                animation: 'slideUp 150ms ease',
                            }}
                        >
                            <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#F1F5F9' }}>{me.name}</div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.40)', marginTop: '2px' }}>{me.role}</div>
                            </div>
                            {[
                                { icon: User, label: 'My Profile' },
                                { icon: Settings, label: 'Settings' },
                            ].map(({ icon: Icon, label }) => (
                                <button
                                    key={label}
                                    role="menuitem"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '10px 14px', width: '100%', background: 'none',
                                        border: 'none', cursor: 'pointer', fontSize: '14px',
                                        color: 'rgba(255,255,255,0.70)', fontFamily: 'inherit',
                                        transition: 'background 150ms',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                                >
                                    <Icon size={15} strokeWidth={1.5} aria-hidden="true" />
                                    {label}
                                </button>
                            ))}
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '4px 0' }} />
                            <button
                                role="menuitem"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '10px 14px', width: '100%', background: 'none',
                                    border: 'none', cursor: 'pointer', fontSize: '14px',
                                    color: '#F87171', fontFamily: 'inherit',
                                    transition: 'background 150ms',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(248,113,113,0.08)')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                            >
                                <LogOut size={15} strokeWidth={1.5} aria-hidden="true" />
                                Sign Out
                            </button>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
