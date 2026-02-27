'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    LayoutGrid,
    Building,
    CreditCard,
    Layers,
    Users,
    HeadphonesIcon,
    TerminalSquare,
    Settings,
    ChevronLeft,
    ChevronRight,
    X,
    Activity,
    Shield
} from 'lucide-react';

const NAV_GROUPS = [
    {
        label: 'Platform',
        items: [
            { href: '/super-admin', icon: LayoutGrid, label: 'Overview' },
            { href: '/super-admin/tenants', icon: Building, label: 'Tenants & Hospitals' },
        ],
    },
    {
        label: 'Billing & Subscriptions',
        items: [
            { href: '/super-admin/plans', icon: Layers, label: 'Subscription Plans' },
            { href: '/super-admin/subscriptions', icon: CreditCard, label: 'Active Subscriptions' },
        ],
    },
    {
        label: 'Ecosystem',
        items: [
            { href: '/super-admin/resellers', icon: Users, label: 'Resellers & Partners' },
            { href: '/super-admin/support', icon: HeadphonesIcon, label: 'Support Tickets' },
        ],
    },
    {
        label: 'System Maintenance',
        items: [
            { href: '/super-admin/logs', icon: Activity, label: 'System Logs & Health' },
            { href: '/super-admin/settings', icon: Settings, label: 'Platform Settings' },
        ],
    },
];

export default function SuperAdminSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
    const pathname = usePathname();
    const W = collapsed ? '72px' : '260px';

    return (
        <aside
            className={`saas-sidebar ${mobileOpen ? 'mobile-open' : ''}`}
            style={{
                width: W,
                minWidth: W,
                background: '#0B0F19', // Darker, SaaS tech feel
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                zIndex: 40,
                overflowY: 'auto',
                overflowX: 'hidden',
                borderRight: '1px solid rgba(255,255,255,0.05)',
            }}
            aria-label="Super Admin Navigation"
        >
            {/* ── Logo ── */}
            <div
                style={{
                    padding: collapsed ? '20px 0' : '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    minHeight: '72px',
                    flexShrink: 0,
                }}
            >
                {collapsed ? (
                    <Link href="/super-admin" aria-label="Nexora Health Platform">
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #10B981, #047857)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <Shield size={18} />
                        </div>
                    </Link>
                ) : (
                    <Link
                        href="/super-admin"
                        aria-label="Nexora Health Platform"
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
                    >
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #10B981, #047857)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <Shield size={18} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Nexora Health</span>
                            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Admin</span>
                        </div>
                    </Link>
                )}

                {/* Mobile Close Button */}
                <button
                    className="sidebar-close-btn"
                    onClick={() => setMobileOpen && setMobileOpen(false)}
                    style={{
                        background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer',
                        padding: '4px', marginLeft: 'auto', display: 'none'
                    }}
                >
                    <X size={20} />
                </button>
                <style>{`
                    .saas-sidebar {
                        transition: width 220ms cubic-bezier(0.4,0,0.2,1), transform 350ms cubic-bezier(0.4, 0, 0.2, 1);
                        transform: translateX(0);
                    }
                    @media (max-width: 1024px) {
                        .saas-sidebar {
                            transform: translateX(-100%);
                            width: 260px !important;
                            min-width: 260px !important;
                        }
                        .saas-sidebar.mobile-open {
                            transform: translateX(0);
                            box-shadow: 4px 0 24px rgba(0,0,0,0.8);
                        }
                        .sidebar-close-btn { display: block !important; }
                        .sidebar-logo-img { max-width: 150px; height: auto !important; }
                        .sidebar-hide-on-mobile { display: none !important; }
                    }
                `}</style>
            </div>

            {/* ── Navigation ── */}
            <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
                {NAV_GROUPS.map((group) => (
                    <div key={group.label} style={{ marginBottom: collapsed ? '12px' : '20px' }}>
                        {!collapsed && (
                            <div
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#475569',
                                    padding: '0 24px 8px',
                                }}
                            >
                                {group.label}
                            </div>
                        )}
                        {group.items.map(({ href, icon: Icon, label }) => {
                            const active = pathname === href || pathname.startsWith(href + '/');
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    title={collapsed ? label : undefined}
                                    onClick={() => { if (setMobileOpen) setMobileOpen(false); }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: collapsed ? '12px 0' : '10px 24px',
                                        fontSize: '14px',
                                        fontWeight: active ? 600 : 500,
                                        color: active ? '#FFFFFF' : '#94A3B8',
                                        background: active ? 'rgba(16,185,129,0.1)' : 'transparent',
                                        borderRight: active ? '3px solid #10B981' : '3px solid transparent',
                                        textDecoration: 'none',
                                        transition: 'all 150ms',
                                        justifyContent: collapsed ? 'center' : 'flex-start',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!active) {
                                            e.currentTarget.style.color = '#FFFFFF';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!active) {
                                            e.currentTarget.style.color = '#94A3B8';
                                        }
                                    }}
                                >
                                    <Icon
                                        size={18}
                                        strokeWidth={active ? 2 : 1.5}
                                        aria-hidden="true"
                                        style={{ flexShrink: 0, color: active ? '#10B981' : 'inherit' }}
                                    />
                                    {!collapsed && <span>{label}</span>}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* ── Collapse toggle ── */}
            <div className="sidebar-hide-on-mobile" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '16px',
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748B',
                        fontSize: '13px',
                        fontWeight: 500,
                        fontFamily: 'inherit',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        transition: 'color 150ms',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
                >
                    {collapsed ? (
                        <ChevronRight size={16} strokeWidth={1.5} />
                    ) : (
                        <>
                            <ChevronLeft size={16} strokeWidth={1.5} />
                            <span>Collapse Menu</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
}
