'use client';
import { Calendar as CalIcon, Filter, Plus, Search, CalendarDays, MoreVertical, MapPin, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AppointmentsPage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Appointments Desk</h1>
                    <p className="page-header__subtitle">
                        Schedule and manage upcoming patient visits, consultations, and follow-ups.
                    </p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        <CalendarDays size={14} /> Full Calendar
                    </button>
                    <Link href="/appointments/new" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <Plus size={15} strokeWidth={1.5} />
                        New Booking
                    </Link>
                </div>
            </div>

            {/* Quick KPI Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(56,189,248,0.1)', color: '#0EA5E9', padding: '10px', borderRadius: '10px' }}>
                            <CalIcon size={20} />
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Total Booked Today</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>45</h4>
                        </div>
                    </div>
                </div>

                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', padding: '10px', borderRadius: '10px' }}>
                            <Activity size={20} />
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Completed Consults</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#10B981', margin: 0 }}>18</h4>
                        </div>
                    </div>
                </div>

                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '10px', borderRadius: '10px' }}>
                            <Filter size={20} />
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Cancellations / No-Shows</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#EF4444', margin: 0 }}>2</h4>
                        </div>
                    </div>
                </div>
            </div>


            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                            <input type="text" placeholder="Search appointments by Patient name, Doctor, or Token..." style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                        </div>
                        <button className="btn btn-secondary" style={{ background: '#fff' }}>
                            <Filter size={16} /> Date Filter: Today
                        </button>
                    </div>
                </div>

                <div className="data-table-wrapper" style={{ borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
                            <tr>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Time slot & Token</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Patient Info</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Consulting Doctor</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Type</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { time: '09:00 AM', token: 'TKN-01', patient: 'Aarav Sharma', uid: 'UHID-10029', dr: 'Dr. Priya Sharma', dept: 'Cardiology', type: 'First Visit', status: 'Completed' },
                                { time: '09:30 AM', token: 'TKN-02', patient: 'Pooja Verma', uid: 'UHID-10044', dr: 'Dr. Amit Singh', dept: 'General Med', type: 'Follow Up', status: 'Completed' },
                                { time: '09:45 AM', token: 'TKN-03', patient: 'Rahul Desai', uid: 'UHID-09941', dr: 'Dr. Kavita Patel', dept: 'Neurology', type: 'Internal Ref.', status: 'Waiting' },
                                { time: '10:15 AM', token: 'TKN-04', patient: 'Megha Singh', uid: 'UHID-10099', dr: 'Dr. Priya Sharma', dept: 'Cardiology', type: 'First Visit', status: 'Scheduled' },
                                { time: '11:00 AM', token: 'TKN-05', patient: 'Vikram Mehta', uid: 'UHID-08832', dr: 'Dr. Sarah Jones', dept: 'Pediatrics', type: 'First Visit', status: 'Scheduled' }
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '14px' }}>{row.time}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{row.token}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{row.patient}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{row.uid}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ color: 'var(--color-text-primary)' }}>{row.dr}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{row.dept}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span className="badge badge-navy" style={{ fontSize: '11px', padding: '2px 8px' }}>{row.type}</span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span className={`badge ${row.status === 'Completed' ? 'badge-green' : row.status === 'Waiting' ? 'badge-yellow' : 'badge-navy'}`} style={{ padding: '4px 10px', fontSize: '12px' }}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button className="btn btn-secondary btn-sm" style={{ padding: '8px', background: '#F8FAFC' }}>
                                            <MoreVertical size={14} color="var(--color-text-secondary)" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
