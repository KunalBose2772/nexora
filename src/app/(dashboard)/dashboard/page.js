'use client';

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
    },
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
        <div className="stat-card" id={`kpi-${card.id}`}>
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
        </div>
    );
}

export default function DashboardPage() {
    return (
        <div className="fade-in">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-header__title">Dashboard</h1>
                    <p className="page-header__subtitle">
                        Overview of today's clinical and operational metrics.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
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
                role="region"
                aria-label="Key performance indicators"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                    gap: '16px',
                    marginBottom: '28px',
                }}
            >
                {KPI_CARDS.map((card) => (
                    <StatCard key={card.id} card={card} />
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '28px' }}>
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
