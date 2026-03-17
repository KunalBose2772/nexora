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
                @keyframes heartbeat {
                    0% { transform: scale(1); }
                    14% { transform: scale(1.1); }
                    28% { transform: scale(1); }
                    42% { transform: scale(1.1); }
                    70% { transform: scale(1); }
                }
                .heartbeat-icon { animation: heartbeat 2s infinite ease-in-out; }
                .qa-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: #fff; border: 1px solid var(--color-border-light); border-radius: 16px; padding: 18px 10px; text-decoration: none; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); text-align: center; }
                .qa-btn:hover { box-shadow: var(--shadow-card-hover); transform: translateY(-4px); border-color: var(--color-cyan); }
                .kpi-card { background: #fff; border: 1px solid var(--color-border-light); border-radius: 20px; padding: 24px; text-decoration: none; display: block; transition: all 0.2s; position: relative; overflow: hidden; }
                .kpi-card:hover { box-shadow: var(--shadow-card-hover); transform: translateY(-3px); border-color: var(--color-border); }
                .kpi-card::after { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--color-icon); opacity: 0; transition: opacity 0.2s; }
                .kpi-card:hover::after { opacity: 1; }
                .bot-kpi-card { background: #fff; border: 1px solid var(--color-border-light); border-radius: 14px; padding: 16px; text-decoration: none; display: flex; alignItems: center; gap: 14px; transition: all 0.15s; }
                .bot-kpi-card:hover { box-shadow: var(--shadow-card-hover); transform: translateY(-2px); border-color: var(--color-border); }
            `}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <HeartPulse className="heartbeat-icon" size={28} style={{ color: '#EF4444' }} />
                    </div>
                    <div>
                        <h1 className="responsive-h1" style={{ margin: 0, fontWeight: 600 }}>
                            {greeting}, {data?.tenant?.name || 'Administrator'}
                        </h1>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0', fontWeight: 500 }}>
                            {dateStr} <span style={{ opacity: 0.5, margin: '0 8px' }}>•</span> Status: <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>System Secure • Node Active</span>
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary shadow-sm" onClick={load} disabled={loading} style={{ background: '#fff', height: '44px', padding: '0 20px', borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} style={{ marginRight: '8px' }} />
                        {loading ? 'Polling…' : 'Sync Telemetry'}
                    </button>
                    <Link href="/command-center" className="btn btn-primary shadow-premium" style={{ textDecoration: 'none', height: '44px', padding: '0 24px', background: 'var(--color-navy)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={18} /> Mission Control
                    </Link>
                </div>
            </div>

            {/* Top KPIs — 4 premium cards */}
            <div className="kpi-grid" style={{ marginBottom: '24px' }}>
                {KPI_TOP.map(card => {
                    const Icon = card.icon;
                    return (
                        <Link key={card.id} id={`tour-kpi-${card.id}`} href={card.href} className="kpi-card" style={{ '--color-icon': card.color }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: `${card.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={22} style={{ color: card.color }} strokeWidth={2} />
                                </div>
                                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--color-navy)', lineHeight: 1, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                                {loading ? <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: '#CBD5E1' }} /> : card.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 400 }}>{card.sub}</div>
                        </Link>
                    );
                })}
            </div>

            {/* Bottom KPIs — 4 compact cards */}
            <div className="kpi-grid" style={{ marginBottom: '32px' }}>
                {KPI_BOT.map(card => {
                    const Icon = card.icon;
                    return (
                        <Link key={card.id} id={`tour-kpi-${card.id}`} href={card.href} className="bot-kpi-card">
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${card.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Icon size={20} style={{ color: card.color }} strokeWidth={1.5} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: '19px', fontWeight: 600, color: 'var(--color-navy)', lineHeight: 1.1 }}>
                                    {loading ? '—' : card.value}
                                </div>
                                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>{card.label}</div>
                                <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '1px' }}>{card.sub}</div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div id="tour-quick-actions" style={{ marginBottom: '36px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '3px', height: '14px', background: 'var(--color-cyan)', borderRadius: '2px' }} />
                    Quick Operations
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '14px' }}>
                    {QUICK_ACTIONS.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Link key={action.label} href={action.href} className="qa-btn" style={{ height: '100px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: action.bg, color: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                                    <Icon size={22} strokeWidth={1.5} />
                                </div>
                                <span style={{ fontSize: '12px', color: 'var(--color-navy)', fontWeight: 500, lineHeight: 1.2 }}>{action.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid-balanced" style={{ marginBottom: '32px' }}>
                {/* Financial Pulse */}
                <div style={{ flex: 1, minWidth: '320px', background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div>
                            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', margin: 0 }}>Financial Pulse</h3>
                            <p style={{ fontSize: '12px', color: '#94A3B8', margin: '2px 0 0 0', fontWeight: 500 }}>Global Revenue (Current Fiscal)</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-navy)' }}>{fmtCurr(s.totalRevenue)}</div>
                            <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                                <TrendingUp size={12} /> Positive Trend
                            </div>
                        </div>
                    </div>
                    {loading
                        ? <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /></div>
                        : !data?.revenueByMonth?.some(m => m.revenue > 0)
                            ? <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', color: '#94A3B8' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IndianRupee size={24} strokeWidth={1.5} />
                                </div>
                                <span style={{ fontSize: '14px', fontWeight: 500 }}>Waiting for first paid invoice...</span>
                            </div>
                            : <BarChart data={data.revenueByMonth} height={180} />
                    }
                </div>

                {/* Service Breakdown */}
                <div className="card" style={{ padding: '28px', border: '1px solid var(--color-border-light)', borderRadius: '24px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Service Contribution</div>
                        <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px', fontWeight: 500 }}>High-volume clinical service split</div>
                    </div>
                    {loading
                        ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '140px', color: '#CBD5E1' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /></div>
                        : <ServiceBar data={data?.revenueByService} />
                    }
                </div>
            </div>

            {/* Recent Appointments Table */}
            <div style={{ background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '24px', overflow: 'hidden', marginBottom: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px', borderBottom: '1px solid var(--color-border-light)' }}>
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Recent Triage & Admissions</div>
                        <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px', fontWeight: 500 }}>Latest clinical workflow records</div>
                    </div>
                    <Link href="/appointments" className="btn btn-secondary btn-sm" style={{ fontWeight: 600, borderRadius: '10px' }}>View Full Registry</Link>
                </div>

                {loading ? (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                        <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-cyan)', margin: '0 auto' }} />
                    </div>
                ) : !data?.appointments?.length ? (
                    <div style={{ padding: '80px', textAlign: 'center' }}>
                        <HeartPulse size={48} style={{ color: '#E2E8F0', marginBottom: '16px', margin: '0 auto' }} />
                        <p style={{ margin: 0, fontSize: '15px', color: '#94A3B8', fontWeight: 500 }}>No active clinical records found for this period.</p>
                    </div>
                ) : (
                    <div style={{ width: '100%', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '950px' }}>
                            <thead>
                                <tr>
                                    {['Patient & Token', 'Primary Clinician', 'Operational State', 'Action'].map((h, i) => (
                                        <th key={h} style={{ textAlign: i === 3 ? 'right' : 'left', fontSize: '10px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 16px', borderBottom: '1px solid #F1F5F9' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.appointments.map(apt => {
                                    return (
                                        <tr key={apt.id} className="interactive-row">
                                            <td style={{ padding: '20px 32px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-navy)', fontWeight: 600 }}>{apt.apptCode || apt.id.slice(-6).toUpperCase()}</td>
                                            <td style={{ padding: '20px 32px' }}>
                                                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-navy)' }}>{apt.patientDisplayName || apt.patientName || 'Anonymous'}</div>
                                                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{apt.type || 'OPD'} REGISTRY</div>
                                            </td>
                                            <td style={{ padding: '20px 32px' }}>
                                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>{apt.doctorName || 'General Triage'}</div>
                                                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px', fontWeight: 500 }}>{apt.department || 'Clinical Unit'}</div>
                                            </td>
                                            <td style={{ padding: '20px 32px', fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Clock size={14} style={{ color: '#94A3B8' }} />
                                                    {apt.date || '—'}
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px 32px' }}>
                                                <span className={`status-badge ${apt.status === 'Completed' ? 'badge-completed' : apt.status === 'In Progress' ? 'badge-in-progress' : apt.status === 'Scheduled' ? 'badge-scheduled' : apt.status === 'Waiting' ? 'badge-pending' : apt.status === 'Cancelled' ? 'badge-cancelled' : 'badge-grey'}`} style={{ fontWeight: 600 }}>{apt.status}</span>
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
                        <span style={{ fontWeight: 600, color: '#92400E', fontSize: '14px' }}>Low Stock Alert — </span>
                        <span style={{ color: '#78350F', fontSize: '14px' }}>{s.lowStock} medicine{s.lowStock > 1 ? 's' : ''} are below minimum threshold.</span>
                    </div>
                    <Link href="/pharmacy" style={{ marginLeft: 'auto', color: '#D97706', fontWeight: 600, fontSize: '13px', textDecoration: 'none', flexShrink: 0 }}>View Pharmacy →</Link>
                </div>
            )}
            {!loading && s.pendingDuesAmount > 0 && (
                <div style={{ background: '#FFF5F5', border: '1px solid #FECACA', borderRadius: '12px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Wallet size={20} style={{ color: '#DC2626', flexShrink: 0 }} />
                    <div>
                        <span style={{ fontWeight: 600, color: '#991B1B', fontSize: '14px' }}>Pending Dues — </span>
                        <span style={{ color: '#7F1D1D', fontSize: '14px' }}>{s.pendingDuesCount} invoice{s.pendingDuesCount > 1 ? 's' : ''} unpaid totalling {fmtCurr(s.pendingDuesAmount)}.</span>
                    </div>
                    <Link href="/billing" style={{ marginLeft: 'auto', color: '#DC2626', fontWeight: 600, fontSize: '13px', textDecoration: 'none', flexShrink: 0 }}>View Billing →</Link>
                </div>
            )}
        </div>
    );
}
