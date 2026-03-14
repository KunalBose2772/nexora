'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import {
    TrendingUp, IndianRupee, CalendarDays, BedDouble, FlaskConical,
    AlertTriangle, UserCheck, Users, Activity,
    UserPlus, CalendarPlus, Stethoscope, Pill,
    Receipt, FileText, UserCog, Building2,
    Hospital, Loader2, RefreshCw, HeartPulse, ClipboardList,
    Wallet, PackageX, CheckCircle2, Clock
} from 'lucide-react';

const QUICK_ACTIONS = [
    { label: 'Register Patient', icon: UserPlus, href: '/patients/new', color: '#00C2FF', bg: 'rgba(0,194,255,0.1)' },
    { label: 'Book Appointment', icon: CalendarPlus, href: '/appointments/new', color: '#16A34A', bg: 'rgba(22,163,74,0.1)' },
    { label: 'Admit to IPD', icon: BedDouble, href: '/ipd/admit', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    { label: 'New Lab Request', icon: FlaskConical, href: '/laboratory/new', color: '#EC4899', bg: 'rgba(236,72,153,0.1)' },
    { label: 'Prescribe / Dispense', icon: Pill, href: '/pharmacy/prescribe', color: '#14B8A6', bg: 'rgba(20,184,166,0.1)' },
    { label: 'Create Invoice', icon: Receipt, href: '/billing', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Add Staff', icon: UserCog, href: '/hr', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'New Branch', icon: Building2, href: '/branches', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
];

const APT_STATUS_COLORS = {
    Completed: { bg: '#DCFCE7', color: '#15803D' },
    'In Progress': { bg: '#DBEAFE', color: '#1D4ED8' },
    Scheduled: { bg: '#F1F5F9', color: '#475569' },
    Waiting: { bg: '#FEF9C3', color: '#854D0E' },
    Cancelled: { bg: '#FEE2E2', color: '#DC2626' },
    Admitted: { bg: '#F0FDF4', color: '#16A34A' },
};

// Pure SVG bar chart — no library needed
function BarChart({ data, height = 160 }) {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data.map(d => d.revenue), 1);
    const barW = 100 / data.length;

    return (
        <div style={{ position: 'relative', height: `${height}px` }}>
            <svg width="100%" height={height} style={{ overflow: 'visible' }}>
                {/* Grid lines */}
                {[0.25, 0.5, 0.75, 1].map(pct => (
                    <line key={pct} x1="0" y1={height - pct * height} x2="100%" y2={height - pct * height}
                        stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                ))}
                {data.map((d, i) => {
                    const bh = Math.max((d.revenue / max) * (height - 24), 4);
                    const x = `${i * barW + barW * 0.2}%`;
                    const w = `${barW * 0.6}%`;
                    const y = height - 20 - bh;
                    return (
                        <g key={i}>
                            <rect x={x} y={y} width={w} height={bh} rx="5" ry="5"
                                fill="url(#barGrad)" style={{ transition: 'height 0.5s ease' }} />
                            <text x={`${i * barW + barW / 2}%`} y={height - 4}
                                textAnchor="middle" fontSize="11" fill="#94A3B8" fontFamily="inherit">
                                {d.month}
                            </text>
                            {d.revenue > 0 && (
                                <text x={`${i * barW + barW / 2}%`} y={y - 6}
                                    textAnchor="middle" fontSize="10" fill="#64748B" fontFamily="inherit">
                                    ₹{d.revenue >= 1000 ? `${(d.revenue / 1000).toFixed(1)}K` : d.revenue}
                                </text>
                            )}
                        </g>
                    );
                })}
                <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00C2FF" />
                        <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.6" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

// Horizontal bar for service revenue split
function ServiceBar({ data }) {
    if (!data || data.length === 0) return (
        <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>No paid invoices yet</div>
    );
    const total = data.reduce((s, r) => s + r.amount, 0) || 1;
    const COLORS = ['#00C2FF', '#8B5CF6', '#16A34A', '#F59E0B', '#EC4899', '#3B82F6', '#14B8A6', '#EF4444'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.slice(0, 6).map((r, i) => (
                <div key={r.service}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{r.service}</span>
                        <span style={{ fontSize: '13px', color: 'var(--color-navy)', fontWeight: 700 }}>
                            ₹{r.amount.toLocaleString('en-IN')} <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 400 }}>({Math.round(r.amount / total * 100)}%)</span>
                        </span>
                    </div>
                    <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(r.amount / total) * 100}%`, background: COLORS[i % COLORS.length], borderRadius: '999px', transition: 'width 0.6s ease' }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function DashboardPage() {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const now = new Date();
    const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/dashboard/stats');
            if (res.status === 401 || res.status === 403) { router.replace('/login'); return; }
            if (res.ok) setData(await res.json());
        } catch (e) { /* show zeros */ }
        finally { setLoading(false); }
    }, [router]);

    useEffect(() => { load(); }, [load]);

    const s = data?.stats || {};
    const fmt = n => (n || 0).toLocaleString('en-IN');
    const fmtCurr = n => `₹${(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

    const KPI_TOP = [
        { id: 'patients', label: 'Total Patients', value: fmt(s.patients), sub: 'Registered in DB', icon: Users, color: '#00C2FF', href: '/patients' },
        { id: 'today', label: "Today's Appointments", value: fmt(s.todayAppointments), sub: `${fmt(s.pendingAppointments)} still pending`, icon: CalendarDays, color: '#16A34A', href: '/appointments' },
        { id: 'revenue-today', label: "Total Revenue", value: fmtCurr(s.totalRevenue), sub: `${fmtCurr(s.todayRevenue)} collected today`, icon: IndianRupee, color: '#8B5CF6', href: '/billing' },
        { id: 'pharmacy-profit', label: "Pharmacy Net Profit", value: fmtCurr(s.pharmacyProfit), sub: `${fmtCurr(s.pharmacyRevenue)} total sales`, icon: Pill, color: '#F59E0B', href: '/pharmacy' },
    ];

    const KPI_BOT = [
        { id: 'staff', label: 'Total Staff', value: fmt(s.users), sub: 'All roles', icon: UserCheck, color: '#0A2E4D', href: '/hr' },
        { id: 'ipd', label: 'Active Inpatients', value: fmt(s.ipdAdmissions), sub: 'Currently admitted', icon: BedDouble, color: '#EC4899', href: '/ipd' },
        { id: 'lab', label: 'Pending Lab Tests', value: fmt(s.labPending), sub: `${fmt(s.labTotal)} total requests`, icon: FlaskConical, color: '#14B8A6', href: '/laboratory' },
        { id: 'dues', label: 'Outstanding Dues', value: fmtCurr(s.pendingDuesAmount), sub: `${fmt(s.pendingDuesCount)} invoices pending`, icon: Wallet, color: '#EF4444', href: '/billing' },
    ];

    return (
        <div className="fade-in">
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .qa-btn { display: flex; flex-direction: column; align-items: center; gap: 8px; background: #fff; border: 1px solid var(--color-border-light); border-radius: 14px; padding: 18px 10px; text-decoration: none; transition: all 0.18s; text-align: center; }
                .qa-btn:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.07); transform: translateY(-3px); border-color: #00C2FF; }
                .kpi-card { background: #fff; border: 1px solid var(--color-border-light); border-radius: 16px; padding: 20px; text-decoration: none; display: block; transition: all 0.18s; }
                .kpi-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.06); transform: translateY(-2px); }
            `}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 className="responsive-h1">
                        {greeting}, {data?.tenant?.name || 'Hospital'} 👋
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>{dateStr} — Live clinical overview</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-secondary btn-sm" onClick={load} disabled={loading} style={{ background: '#fff' }}>
                        <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                        {loading ? 'Loading…' : 'Refresh'}
                    </button>
                    <Link href="/reports" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <Activity size={14} /> View Reports
                    </Link>
                </div>
            </div>

            {/* Top KPIs — 4 big cards */}
            <div className="kpi-grid" style={{ marginBottom: '20px' }}>
                {KPI_TOP.map(card => {
                    const Icon = card.icon;
                    return (
                        <Link key={card.id} id={`tour-kpi-${card.id}`} href={card.href} className="kpi-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} style={{ color: card.color }} strokeWidth={1.5} />
                                </div>
                                <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>{card.label}</span>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1, marginBottom: '6px' }}>
                                {loading ? <Loader2 size={22} style={{ animation: 'spin 1s linear infinite', color: '#CBD5E1' }} /> : card.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94A3B8' }}>{card.sub}</div>
                        </Link>
                    );
                })}
            </div>

            {/* Bottom KPIs — 4 smaller cards */}
            <div className="kpi-grid" style={{ gap: '14px', marginBottom: '28px' }}>
                {KPI_BOT.map(card => {
                    const Icon = card.icon;
                    return (
                        <Link key={card.id} id={`tour-kpi-${card.id}`} href={card.href} style={{ background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '12px', padding: '16px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.15s' }}
                            onMouseOver={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Icon size={18} style={{ color: card.color }} strokeWidth={1.5} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1.1 }}>
                                    {loading ? '—' : card.value}
                                </div>
                                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.label}</div>
                                <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '1px' }}>{card.sub}</div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div id="tour-quick-actions" style={{ marginBottom: '28px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Quick Actions</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))', gap: '10px' }}>
                    {QUICK_ACTIONS.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Link key={action.label} href={action.href} className="qa-btn">
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: action.bg, color: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={19} strokeWidth={1.5} />
                                </div>
                                <span style={{ fontSize: '11.5px', fontWeight: 500, color: 'var(--color-navy)', lineHeight: 1.3 }}>{action.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Charts + Recent Appointments */}
            <div className="grid-balanced" style={{ marginBottom: '24px' }}>
                {/* Revenue Chart */}
                <div style={{ background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)' }}>Monthly Revenue</div>
                            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Last 6 months — from paid invoices</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)' }}>{fmtCurr(s.totalRevenue)}</div>
                            <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>Total collected</div>
                        </div>
                    </div>
                    {loading
                        ? <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1' }}><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /></div>
                        : !data?.revenueByMonth?.some(m => m.revenue > 0)
                            ? <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', color: '#94A3B8' }}>
                                <IndianRupee size={28} strokeWidth={1} />
                                <span style={{ fontSize: '13px' }}>No revenue data yet — create and mark invoices as Paid</span>
                            </div>
                            : <BarChart data={data.revenueByMonth} height={160} />
                    }
                </div>

                {/* Revenue by Service */}
                <div style={{ background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '4px' }}>Revenue by Service</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '20px' }}>Paid invoices breakdown</div>
                    {loading
                        ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', color: '#CBD5E1' }}><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /></div>
                        : <ServiceBar data={data?.revenueByService} />
                    }
                </div>
            </div>

            {/* Recent Appointments */}
            <div style={{ background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--color-border-light)' }}>
                    <div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)' }}>Recent Appointments</div>
                        <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Latest 8 across OPD & IPD</div>
                    </div>
                    <Link href="/appointments" style={{ fontSize: '13px', color: 'var(--color-cyan)', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
                </div>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Loading…
                    </div>
                ) : !data?.appointments?.length ? (
                    <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
                        <HeartPulse size={32} style={{ color: '#CBD5E1', marginBottom: '10px' }} />
                        <p style={{ margin: 0, fontSize: '14px' }}>No appointments yet. <Link href="/appointments/new" style={{ color: 'var(--color-cyan)' }}>Book the first one.</Link></p>
                    </div>
                ) : (
                    <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC' }}>
                                {['Appt. ID', 'Patient', 'Doctor', 'Dept.', 'Date', 'Type', 'Status'].map(h => (
                                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--color-border-light)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.appointments.map(apt => {
                                const sc = APT_STATUS_COLORS[apt.status] || { bg: '#F1F5F9', color: '#475569' };
                                return (
                                    <tr key={apt.id} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.15s' }}
                                        onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'}
                                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-navy)', fontWeight: 600 }}>{apt.apptCode || apt.id.slice(-6).toUpperCase()}</td>
                                        <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: 'var(--color-navy)' }}>{apt.patientDisplayName || apt.patientName || '—'}</td>
                                        <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>{apt.doctorName || '—'}</td>
                                        <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>{apt.department || '—'}</td>
                                        <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--color-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{apt.date || '—'}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px', background: apt.type === 'IPD' ? 'rgba(245,158,11,0.1)' : 'rgba(0,194,255,0.1)', color: apt.type === 'IPD' ? '#B45309' : '#0284C7' }}>{apt.type || 'OPD'}</span>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', background: sc.bg, color: sc.color }}>{apt.status}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    </div>
                )}
            </div>

            {/* Alert strip — low stock warning */}
            {!loading && s.lowStock > 0 && (
                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <PackageX size={20} style={{ color: '#D97706', flexShrink: 0 }} />
                    <div>
                        <span style={{ fontWeight: 700, color: '#92400E', fontSize: '14px' }}>Low Stock Alert — </span>
                        <span style={{ color: '#78350F', fontSize: '14px' }}>{s.lowStock} medicine{s.lowStock > 1 ? 's' : ''} are below minimum threshold.</span>
                    </div>
                    <Link href="/pharmacy" style={{ marginLeft: 'auto', color: '#D97706', fontWeight: 700, fontSize: '13px', textDecoration: 'none', flexShrink: 0 }}>View Pharmacy →</Link>
                </div>
            )}
            {!loading && s.pendingDuesAmount > 0 && (
                <div style={{ background: '#FFF5F5', border: '1px solid #FECACA', borderRadius: '12px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Wallet size={20} style={{ color: '#DC2626', flexShrink: 0 }} />
                    <div>
                        <span style={{ fontWeight: 700, color: '#991B1B', fontSize: '14px' }}>Pending Dues — </span>
                        <span style={{ color: '#7F1D1D', fontSize: '14px' }}>{s.pendingDuesCount} invoice{s.pendingDuesCount > 1 ? 's' : ''} unpaid totalling {fmtCurr(s.pendingDuesAmount)}.</span>
                    </div>
                    <Link href="/billing" style={{ marginLeft: 'auto', color: '#DC2626', fontWeight: 700, fontSize: '13px', textDecoration: 'none', flexShrink: 0 }}>View Billing →</Link>
                </div>
            )}
        </div>
    );
}
