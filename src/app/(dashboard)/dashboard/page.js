'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import {
    TrendingUp, TrendingDown,
    IndianRupee, CalendarDays, BedDouble, FlaskConical,
    AlertTriangle, UserCheck, Users, Activity,
    UserPlus, CalendarPlus, Stethoscope, Pill,
    Receipt, FileText, UserCog, Building2,
    Hospital, Wallet, Loader2, RefreshCw,
    HeartPulse, ClipboardList
} from 'lucide-react';

const QUICK_ACTIONS = [
    { label: 'Register Patient', icon: UserPlus, href: '/patients/new', color: '#00C2FF', bg: 'rgba(0,194,255,0.1)' },
    { label: 'Book Appt.', icon: CalendarPlus, href: '/appointments/new', color: '#16A34A', bg: 'rgba(22,163,74,0.1)' },
    { label: 'OPD Consult', icon: Stethoscope, href: '/opd/consult', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Admit to IPD', icon: BedDouble, href: '/ipd/admit', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Add Lab Test', icon: FlaskConical, href: '/laboratory/new', color: '#EC4899', bg: 'rgba(236,72,153,0.1)' },
    { label: 'Pharmacy', icon: Pill, href: '/pharmacy/prescribe', color: '#14B8A6', bg: 'rgba(20,184,166,0.1)' },
    { label: 'New Invoice', icon: Receipt, href: '/billing/new', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Add Record', icon: FileText, href: '/patients/records', color: '#64748B', bg: 'rgba(100,116,139,0.1)' },
    { label: 'Add Staff', icon: UserCog, href: '/hr/new', color: '#0A2E4D', bg: 'rgba(10,46,77,0.1)' },
    { label: 'New Branch', icon: Building2, href: '/branches/new', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
];

const STATUS_BADGE = {
    Completed: { cls: 'badge badge-success' },
    'In Progress': { cls: 'badge badge-info' },
    Scheduled: { cls: 'badge badge-neutral' },
    Waiting: { cls: 'badge badge-warning' },
    Cancelled: { cls: 'badge badge-error' },
};

export default function DashboardPage() {
    const router = useRouter();
    const [dashData, setDashData] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadDash = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/dashboard/stats');
            if (res.status === 401 || res.status === 403) { router.replace('/login'); return; }
            if (res.ok) {
                const d = await res.json();
                setDashData(d);
            }
        } catch (e) { /* fail silently, will show zeros */ }
        finally { setLoading(false); }
    }, [router]);

    useEffect(() => { loadDash(); }, [loadDash]);

    const s = dashData?.stats;

    const KPI_CARDS = [
        { id: 'patients', label: 'Total Patients', value: loading ? '…' : (s?.patients ?? 0), trend: 'Registered in DB', trendDir: 'neutral', icon: Users, iconBg: 'rgba(0,194,255,0.10)', iconColor: '#00C2FF', href: '/patients' },
        { id: 'appointments', label: 'Total Appointments', value: loading ? '…' : (s?.appointments ?? 0), trend: 'All time', trendDir: 'neutral', icon: CalendarDays, iconBg: 'rgba(22,163,74,0.08)', iconColor: '#16A34A', href: '/appointments' },
        { id: 'today-apts', label: 'Appointments Today', value: loading ? '…' : (s?.todayAppointments ?? 0), trend: "Today's schedule", trendDir: 'up', icon: ClipboardList, iconBg: 'rgba(59, 130, 246, 0.10)', iconColor: '#3B82F6', href: '/appointments' },
        { id: 'pending', label: 'Pending Appointments', value: loading ? '…' : (s?.pendingAppointments ?? 0), trend: 'Requires attention', trendDir: 'neutral', icon: AlertTriangle, iconBg: 'rgba(217,119,6,0.08)', iconColor: '#F59E0B', href: '/appointments' },
        { id: 'staff', label: 'Staff Members', value: loading ? '…' : (s?.users ?? 0), trend: 'Active in system', trendDir: 'neutral', icon: UserCheck, iconBg: 'rgba(10,46,77,0.06)', iconColor: '#0A2E4D', href: '/hr' },
        { id: 'revenue', label: 'Revenue Today', value: '₹0', trend: 'Billing coming soon', trendDir: 'neutral', icon: IndianRupee, iconBg: 'rgba(10,46,77,0.08)', iconColor: 'var(--color-navy)', href: '/billing' },
        { id: 'inpatients', label: 'Active Inpatients', value: '0', trend: 'IPD coming soon', trendDir: 'neutral', icon: Hospital, iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3B82F6', href: '/ipd/patients' },
        { id: 'pharmacy', label: 'Pending Rx', value: '0', trend: 'Pharmacy queue', trendDir: 'neutral', icon: Pill, iconBg: 'rgba(139,92,246,0.1)', iconColor: '#8B5CF6', href: '/pharmacy' },
    ];

    return (
        <div className="fade-in">
            <style>{`
                .dashboard-header-row { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; gap: 16px; }
                .dashboard-header-buttons { display: flex; flex-wrap: wrap; gap: 10px; }
                .dashboard-quick-actions { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 12px; margin-bottom: 28px; }
                .quick-action-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: #FFFFFF; border: 1px solid var(--color-border-light); border-radius: 12px; padding: 16px 8px; text-decoration: none; transition: all 150ms; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
                .quick-action-btn:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-color: #00C2FF; transform: translateY(-2px); }
                .quick-action-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
                .quick-action-label { font-size: 11.5px; font-weight: 500; color: var(--color-navy); }
                .dashboard-kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px; }
                .dashboard-chart-row { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 28px; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    .dashboard-header-row { flex-direction: column; align-items: stretch; }
                    .dashboard-chart-row { grid-template-columns: 1fr; }
                }
            `}</style>

            {/* Page Header */}
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>
                        {dashData?.tenant?.name ? `${dashData.tenant.name} Dashboard` : 'Dashboard'}
                    </h1>
                    <p className="page-header__subtitle">
                        {loading ? 'Loading live data…' : 'Overview of today\'s clinical and operational metrics.'}
                    </p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" onClick={loadDash} disabled={loading}>
                        <RefreshCw size={15} strokeWidth={1.5} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                        {loading ? 'Loading…' : 'Refresh'}
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <Activity size={15} strokeWidth={1.5} aria-hidden />
                        View Reports
                    </button>
                </div>
            </div>

            {/* KPI Grid — live from DB */}
            <div className="dashboard-kpi-grid" role="region" aria-label="Key performance indicators">
                {KPI_CARDS.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link key={card.id} href={card.href || '#'} className="stat-card" id={`kpi-${card.id}`} style={{ textDecoration: 'none', transition: 'all 150ms' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span className="stat-card__label">{card.label}</span>
                                <div aria-hidden style={{ width: '36px', height: '36px', borderRadius: '8px', background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icon size={18} strokeWidth={1.5} style={{ color: card.iconColor }} />
                                </div>
                            </div>
                            <div className="stat-card__value">
                                {loading && (card.id === 'patients' || card.id === 'appointments' || card.id === 'today-apts' || card.id === 'pending' || card.id === 'staff')
                                    ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', color: '#94A3B8' }} />
                                    : card.value}
                            </div>
                            <div className={`stat-card__trend stat-card__trend--${card.trendDir}`}>
                                {card.trendDir === 'up' && <TrendingUp size={13} strokeWidth={1.5} />}
                                {card.trendDir === 'down' && <TrendingDown size={13} strokeWidth={1.5} />}
                                {card.trendDir === 'neutral' && <Activity size={13} strokeWidth={1.5} />}
                                <span>{card.trend}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="section-title" style={{ marginTop: '32px' }}>Quick Actions</div>
            <div className="dashboard-quick-actions" role="region" aria-label="Quick Actions">
                {QUICK_ACTIONS.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                        <Link href={action.href} key={idx} className="quick-action-btn">
                            <div className="quick-action-icon" style={{ background: action.bg, color: action.color }}>
                                <Icon size={20} strokeWidth={1.5} />
                            </div>
                            <span className="quick-action-label">{action.label}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Recent Appointments from DB */}
            <div className="card" style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--color-border-light)' }}>
                    <div className="section-title" style={{ marginBottom: 0 }}>Recent Appointments</div>
                    <a href="/appointments" style={{ fontSize: '13px', color: 'var(--color-cyan)', fontWeight: 500, textDecoration: 'none' }}>View All</a>
                </div>

                <div className="data-table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
                    {loading ? (
                        <div style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px' }}>
                            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Loading appointments…
                        </div>
                    ) : !dashData?.appointments?.length ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                            <HeartPulse size={32} style={{ color: '#CBD5E1', marginBottom: '12px' }} />
                            <p style={{ fontSize: '14px', margin: 0 }}>No appointments yet. <a href="/appointments/new" style={{ color: '#00C2FF' }}>Book the first one.</a></p>
                        </div>
                    ) : (
                        <table className="data-table" aria-label="Recent appointments">
                            <thead>
                                <tr>
                                    <th scope="col">Appointment ID</th>
                                    <th scope="col">Patient</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashData.appointments.map((apt) => (
                                    <tr key={apt.id}>
                                        <td style={{ fontWeight: 500, color: 'var(--color-navy)', fontFamily: 'monospace', fontSize: '13px' }}>
                                            {apt.apptCode || apt.id.slice(-6).toUpperCase()}
                                        </td>
                                        <td>{apt.patientDisplayName || apt.patientName || '—'}</td>
                                        <td style={{ color: 'var(--color-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                                            {apt.date || '—'}
                                        </td>
                                        <td>
                                            <span className={(STATUS_BADGE[apt.status]?.cls) || 'badge badge-neutral'}>{apt.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Charts placeholder */}
            <div className="dashboard-chart-row">
                <div className="card" style={{ padding: '20px' }}>
                    <div className="section-title">Monthly Revenue</div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>Revenue trend for the current financial year</p>
                    <div aria-label="Revenue chart" style={{ height: '220px', background: 'var(--color-bg-clinical)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--color-border)' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Activity size={32} strokeWidth={1} style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }} />
                            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Billing module — coming in next phase</p>
                        </div>
                    </div>
                </div>
                <div className="card" style={{ padding: '20px' }}>
                    <div className="section-title">Dept. Revenue Split</div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>Revenue by department this month</p>
                    <div style={{ height: '220px', background: 'var(--color-bg-clinical)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--color-border)' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Users size={32} strokeWidth={1} style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }} />
                            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Analytics — coming soon</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
