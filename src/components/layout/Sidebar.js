'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    CalendarDays,
    Stethoscope,
    BedDouble,
    FlaskConical,
    Pill,
    Receipt,
    UserCog,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    Building2,
} from 'lucide-react';

const NAV_GROUPS = [
    {
        label: 'Overview',
        items: [
            { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        ],
    },
    {
        label: 'Clinical',
        items: [
            { href: '/patients', icon: Users, label: 'Patients' },
            { href: '/appointments', icon: CalendarDays, label: 'Appointments' },
            { href: '/opd', icon: Stethoscope, label: 'OPD' },
            { href: '/ipd', icon: BedDouble, label: 'IPD / Wards' },
        ],
    },
    {
        label: 'Services',
        items: [
            { href: '/laboratory', icon: FlaskConical, label: 'Laboratory' },
            { href: '/pharmacy', icon: Pill, label: 'Pharmacy' },
        ],
    },
    {
        label: 'Finance',
        items: [
            { href: '/billing', icon: Receipt, label: 'Billing' },
        ],
    },
    {
        label: 'Administration',
        items: [
            { href: '/hr', icon: UserCog, label: 'HR & Staff' },
            { href: '/reports', icon: BarChart3, label: 'Reports' },
            { href: '/branches', icon: Building2, label: 'Branches' },
            { href: '/settings', icon: Settings, label: 'Settings' },
        ],
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const W = collapsed ? '64px' : '260px';

    return (
        <aside
            style={{
                width: W,
                minWidth: W,
                background: '#071220',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                zIndex: 40,
                overflowY: 'auto',
                overflowX: 'hidden',
                transition: 'width 220ms cubic-bezier(0.4,0,0.2,1)',
                borderRight: '1px solid rgba(255,255,255,0.06)',
            }}
            aria-label="Main navigation"
        >
            {/* ── Logo ── */}
            <div
                style={{
                    padding: collapsed ? '16px 0' : '18px 16px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    minHeight: '68px',
                    flexShrink: 0,
                }}
            >
                {collapsed ? (
                    <Link href="/dashboard" aria-label="Nexora Health – Dashboard">
                        <Image
                            src="/favicon-96x96.png"
                            alt="Nexora Health"
                            width={30}
                            height={30}
                            priority
                            style={{ display: 'block', filter: 'brightness(1.1)' }}
                        />
                    </Link>
                ) : (
                    <Link
                        href="/dashboard"
                        aria-label="Nexora Health – Dashboard"
                        style={{ display: 'block', lineHeight: 0 }}
                    >
                        {/* Full original logo, white-inverted for dark background */}
                        <Image
                            src="/nexora-logo.png"
                            alt="Nexora Health"
                            width={188}
                            height={54}
                            priority
                            style={{
                                height: '40px',
                                width: 'auto',
                                filter: 'brightness(0) invert(1)',
                                opacity: 0.90,
                            }}
                        />
                    </Link>
                )}
            </div>

            {/* ── Navigation ── */}
            <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0', paddingBottom: '4px' }}>
                {NAV_GROUPS.map((group) => (
                    <div key={group.label}>
                        {!collapsed && (
                            <div
                                style={{
                                    fontSize: '9.5px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.10em',
                                    color: 'rgba(255,255,255,0.28)',
                                    padding: '16px 20px 5px',
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
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: collapsed ? '10px 0' : '8px 12px',
                                        margin: '1px 8px',
                                        borderRadius: '8px',
                                        fontSize: '13.5px',
                                        fontWeight: active ? 500 : 400,
                                        color: active ? '#00C2FF' : 'rgba(255,255,255,0.60)',
                                        background: active
                                            ? 'rgba(0,194,255,0.12)'
                                            : 'transparent',
                                        textDecoration: 'none',
                                        transition: 'all 150ms',
                                        justifyContent: collapsed ? 'center' : 'flex-start',
                                        borderLeft: active ? '2px solid #00C2FF' : '2px solid transparent',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!active) {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!active) {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.60)';
                                        }
                                    }}
                                >
                                    <Icon
                                        size={17}
                                        strokeWidth={1.5}
                                        aria-hidden="true"
                                        style={{ flexShrink: 0, color: active ? '#00C2FF' : 'inherit' }}
                                    />
                                    {!collapsed && <span>{label}</span>}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* ── Collapse toggle ── */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'rgba(255,255,255,0.35)',
                        fontSize: '12px',
                        fontFamily: 'inherit',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        transition: 'color 150ms',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.70)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                >
                    {collapsed ? (
                        <ChevronRight size={15} strokeWidth={1.5} />
                    ) : (
                        <>
                            <ChevronLeft size={15} strokeWidth={1.5} />
                            <span>Collapse</span>
                        </>
                    )}
                </button>

                {/* Brand footer */}
                {!collapsed && (
                    <div
                        style={{
                            padding: '6px 16px 14px',
                            textAlign: 'left',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '9px',
                                fontWeight: 500,
                                color: 'rgba(255,255,255,0.22)',
                                letterSpacing: '0.10em',
                                textTransform: 'uppercase',
                            }}
                        >
                            Nexora Health
                        </div>
                        <div
                            style={{
                                fontSize: '8.5px',
                                color: 'rgba(255,255,255,0.14)',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                marginTop: '2px',
                            }}
                        >
                            Powered by Global Webify
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
