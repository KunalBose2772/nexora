'use client';

import Link from 'next/link';
import {
    TrendingUp,
    TrendingDown,
    IndianRupee,
    CalendarDays,
    BedDouble,
    FlaskConical,
    AlertTriangle,
    UserCheck,
    Users,
    Activity,
    UserPlus,
    CalendarPlus,
    Stethoscope,
    Pill,
    Receipt,
    FileText,
    UserCog,
    Building2,
    Hospital,
    ClipboardList,
    Stethoscope as DoctorIcon,
    Wallet
} from 'lucide-react';

/* ─── Mock KPI data ─── */
const KPI_CARDS = [
    {
        id: 'revenue-today',
        label: 'Revenue Today',
        value: '₹1,24,500',
        trend: '+8.2%',
        trendDir: 'up',
        icon: IndianRupee,
        iconBg: 'rgba(10,46,77,0.08)',
        iconColor: 'var(--color-navy)',
        href: '/billing',
    },
    {
        id: 'appointments-today',
        label: 'Appointments Today',
        value: '87',
        trend: '+12 from yesterday',
        trendDir: 'up',
        icon: CalendarDays,
        iconBg: 'rgba(0,194,255,0.10)',
        iconColor: 'var(--color-cyan)',
        trendColor: 'var(--color-success)',
        href: '/appointments',
    },
    {
        id: 'bed-occupancy',
        label: 'Bed Occupancy',
        value: '73%',
        trend: '-4% vs last week',
        trendDir: 'down',
        icon: BedDouble,
        iconBg: 'rgba(22,163,74,0.08)',
        iconColor: 'var(--color-success)',
        href: '/ipd/wards',
    },
    {
        id: 'pending-lab',
        label: 'Pending Lab Reports',
        value: '14',
        trend: '3 urgent',
        trendDir: 'neutral',
        icon: FlaskConical,
        iconBg: 'rgba(217,119,6,0.08)',
        iconColor: 'var(--color-warning)',
        href: '/laboratory',
    },
    {
        id: 'low-stock',
        label: 'Low Stock Alerts',
        value: '6',
        trend: 'Requires attention',
        trendDir: 'down',
        icon: AlertTriangle,
        iconBg: 'rgba(220,38,38,0.08)',
        iconColor: 'var(--color-error)',
        href: '/inventory',
    },
    {
        id: 'doctors-available',
        label: 'Doctors Available',
        value: '18 / 24',
        trend: '6 on leave',
        trendDir: 'neutral',
        icon: UserCheck,
        iconBg: 'rgba(10,46,77,0.06)',
        iconColor: 'var(--color-navy)',
        href: '/hr/doctors',
    },
    {
        id: 'active-inpatients',
        label: 'Active Inpatients',
        value: '142',
        trend: '+5 from yesterday',
        trendDir: 'up',
        icon: Hospital,
        iconBg: 'rgba(59,130,246,0.1)',
        iconColor: '#3B82F6',
        href: '/ipd/patients',
    },
    {
        id: 'pending-prescriptions',
        label: 'Pending Rx',
        value: '28',
        trend: 'Pharmacy queue',
        trendDir: 'neutral',
        icon: Pill,
        iconBg: 'rgba(139,92,246,0.1)',
        iconColor: '#8B5CF6',
        href: '/pharmacy',
    },
    {
        id: 'outpatient-consults',
        label: 'OPD Consults',
        value: '210',
        trend: 'Steady flow',
        trendDir: 'neutral',
        icon: DoctorIcon,
        iconBg: 'rgba(20,184,166,0.1)',
        iconColor: '#14B8A6',
        href: '/opd',
    },
    {
        id: 'total-expenses',
        label: 'Total Expenses',
        value: '₹32,400',
        trend: '-2.1% this week',
        trendDir: 'down',
        icon: Wallet,
        iconBg: 'rgba(239,68,68,0.1)',
        iconColor: '#EF4444',
        href: '/billing/expenses',
    }
];

/* ─── Quick Actions ─── */
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

/* ─── Recent Appointments ─── */
const RECENT_APPOINTMENTS = [
    { id: 'APT-001', patient: 'Ramesh Kumar', doctor: 'Dr. Priya Sharma', dept: 'Cardiology', time: '09:00 AM', status: 'Completed' },
    { id: 'APT-002', patient: 'Sunita Devi', doctor: 'Dr. Raj Malhotra', dept: 'Orthopedics', time: '09:30 AM', status: 'In Progress' },
    { id: 'APT-003', patient: 'Anil Mehta', doctor: 'Dr. Kavita Patel', dept: 'Neurology', time: '10:00 AM', status: 'Scheduled' },
    { id: 'APT-004', patient: 'Geeta Singh', doctor: 'Dr. Arjun Nair', dept: 'Dermatology', time: '10:30 AM', status: 'Waiting' },
    { id: 'APT-005', patient: 'Mohan Lal', doctor: 'Dr. Priya Sharma', dept: 'Cardiology', time: '11:00 AM', status: 'Scheduled' },
];

const STATUS_BADGE = {
    Completed: 'badge badge-success',
    'In Progress': 'badge badge-info',
    Scheduled: 'badge badge-neutral',
    Waiting: 'badge badge-warning',
    Cancelled: 'badge badge-error',
};

function StatCard({ card }) {
    const Icon = card.icon;
    return (
        <Link
            href={card.href || '#'}
            className="stat-card"
            id={`kpi-${card.id}`}
            style={{ textDecoration: 'none', transition: 'all 150ms' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="stat-card__label">{card.label}</span>
                <div
                    aria-hidden="true"
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: card.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}
                >
                    <Icon size={18} strokeWidth={1.5} style={{ color: card.iconColor }} />
                </div>
            </div>
            <div className="stat-card__value">{card.value}</div>
            <div
                className={`stat-card__trend stat-card__trend--${card.trendDir}`}
            >
                {card.trendDir === 'up' && <TrendingUp size={13} strokeWidth={1.5} aria-hidden="true" />}
                {card.trendDir === 'down' && <TrendingDown size={13} strokeWidth={1.5} aria-hidden="true" />}
                {card.trendDir === 'neutral' && <Activity size={13} strokeWidth={1.5} aria-hidden="true" />}
                <span>{card.trend}</span>
            </div>
        </Link>
    );
}

export default function DashboardPage() {
    return (
        <div className="fade-in">
            <style>{`
                .dashboard-header-row { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; gap: 16px; }
                .dashboard-header-buttons { display: flex; flex-wrap: wrap; gap: 10px; }
                .dashboard-quick-actions {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
                    gap: 12px;
                    margin-bottom: 28px;
                }
                .quick-action-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    background: #FFFFFF;
                    border: 1px solid var(--color-border-light);
                    border-radius: 12px;
                    padding: 16px 8px;
                    text-decoration: none;
                    transition: all 150ms;
                    text-align: center;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
                }
                .quick-action-btn:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    border-color: #00C2FF;
                    transform: translateY(-2px);
                }
                .quick-action-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .quick-action-label {
                    font-size: 11.5px;
                    font-weight: 500;
                    color: var(--color-navy);
                }
                .dashboard-kpi-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 16px;
                    margin-bottom: 28px;
                }
                .dashboard-chart-row {
                    display: grid; 
                    grid-template-columns: 2fr 1fr; 
                    gap: 20px; 
                    margin-bottom: 28px;
                }
                @media (max-width: 768px) {
                    .dashboard-header-row { flex-direction: column; align-items: stretch; }
                    .dashboard-header-buttons { width: 100%; }
                    .dashboard-header-buttons .btn { flex: 1; justify-content: center; }
                    
                    .dashboard-chart-row {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            {/* Page Header */}
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Dashboard</h1>
                    <p className="page-header__subtitle">
                        Overview of today's clinical and operational metrics.
                    </p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm">
                        <CalendarDays size={15} strokeWidth={1.5} aria-hidden="true" />
                        Today
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <Activity size={15} strokeWidth={1.5} aria-hidden="true" />
                        View Reports
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div
                className="dashboard-kpi-grid"
                role="region"
                aria-label="Key performance indicators"
            >
                {KPI_CARDS.map((card) => (
                    <StatCard key={card.id} card={card} />
                ))}
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



            {/* Charts Row */}
            <div className="dashboard-chart-row">
                {/* Revenue Chart placeholder */}
                <div className="card" style={{ padding: '20px' }}>
                    <div className="section-title">Monthly Revenue</div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                        Revenue trend for the current financial year
                    </p>
                    <div
                        aria-label="Revenue chart"
                        style={{
                            height: '220px',
                            background: 'var(--color-bg-clinical)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px dashed var(--color-border)',
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <Activity size={32} strokeWidth={1} style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }} aria-hidden="true" />
                            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                                ApexCharts – Revenue Line Chart
                            </p>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                Integrated in Phase 1 backend connection
                            </p>
                        </div>
                    </div>
                </div>

                {/* Department Revenue */}
                <div className="card" style={{ padding: '20px' }}>
                    <div className="section-title">Dept. Revenue Split</div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                        Revenue by department this month
                    </p>
                    <div
                        aria-label="Department revenue chart"
                        style={{
                            height: '220px',
                            background: 'var(--color-bg-clinical)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px dashed var(--color-border)',
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <Users size={32} strokeWidth={1} style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }} aria-hidden="true" />
                            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                                ApexCharts – Donut Chart
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Appointments Table */}
            <div className="card" style={{ marginBottom: '28px' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        borderBottom: '1px solid var(--color-border-light)',
                    }}
                >
                    <div className="section-title" style={{ marginBottom: 0 }}>Today's Appointments</div>
                    <a
                        href="/appointments"
                        style={{
                            fontSize: '13px',
                            color: 'var(--color-cyan)',
                            fontWeight: 500,
                            textDecoration: 'none',
                        }}
                    >
                        View All
                    </a>
                </div>

                <div className="data-table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
                    <table className="data-table" aria-label="Today's appointments">
                        <thead>
                            <tr>
                                <th scope="col">Appointment ID</th>
                                <th scope="col">Patient</th>
                                <th scope="col">Doctor</th>
                                <th scope="col">Department</th>
                                <th scope="col">Time</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RECENT_APPOINTMENTS.map((apt) => (
                                <tr key={apt.id}>
                                    <td style={{ fontWeight: 500, color: 'var(--color-navy)', fontFamily: 'monospace', fontSize: '13px' }}>
                                        {apt.id}
                                    </td>
                                    <td>{apt.patient}</td>
                                    <td style={{ color: 'var(--color-text-secondary)' }}>{apt.doctor}</td>
                                    <td>
                                        <span className="badge badge-navy">{apt.dept}</span>
                                    </td>
                                    <td style={{ color: 'var(--color-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                                        {apt.time}
                                    </td>
                                    <td>
                                        <span className={STATUS_BADGE[apt.status] || 'badge badge-neutral'}>
                                            {apt.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pagination" aria-label="Table pagination">
                    <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginRight: '12px' }}>
                        Showing 1–5 of 87
                    </span>
                    <button className="pagination-btn" disabled aria-label="Previous page">&lsaquo;</button>
                    <button className="pagination-btn active" aria-current="page" aria-label="Page 1">1</button>
                    <button className="pagination-btn" aria-label="Page 2">2</button>
                    <button className="pagination-btn" aria-label="Page 3">3</button>
                    <button className="pagination-btn" aria-label="Next page">&rsaquo;</button>
                </div>
            </div>
        </div>
    );
}
