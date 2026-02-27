'use client';
import { Stethoscope, Plus, Search, Filter, Users, Activity, Clock, Eye, Send, ArrowRightCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function OPDPage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Outpatient Department (OPD)</h1>
                    <p className="page-header__subtitle">
                        Manage daily consults, patient tokens, and doctor queues.
                    </p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        Token Display View
                    </button>
                    <Link href="/opd/consult" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <Plus size={15} strokeWidth={1.5} aria-hidden="true" />
                        Initiate Consult
                    </Link>
                </div>
            </div>

            {/* Quick KPI Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(56,189,248,0.1)', color: '#0EA5E9', padding: '10px', borderRadius: '10px' }}>
                            <Users size={20} />
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Active Queue Size</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>42</h4>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Patients Waiting</span>
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
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>In-Progress Consults</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#10B981', margin: 0 }}>5</h4>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Docs Active</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', padding: '10px', borderRadius: '10px' }}>
                            <Clock size={20} />
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Average Wait Time</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#F59E0B', margin: 0 }}>24m</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                            <input type="text" placeholder="Search Master Queue by Token No, Patient, or Doctor..." style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                        </div>
                        <button className="btn btn-secondary" style={{ background: '#fff' }}>
                            <Filter size={16} /> Filter Rooms
                        </button>
                    </div>
                </div>

                <div className="data-table-wrapper" style={{ borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
                            <tr>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Token & Patient Info</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Vitals & Triage</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Assigned Physician</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Wait Duration</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>State</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { token: 'T-402', patient: 'Vinod Mehra', age: '45, M', vitals: 'BP: 120/80', dr: 'Dr. Kavita Patel', room: 'Room 102', wait: '0m', status: 'In Session', badge: 'badge-info' },
                                { token: 'T-403', patient: 'Anita Sharma', age: '32, F', vitals: 'Triage Pending', dr: 'Dr. Priya Sharma', room: 'Room 101', wait: '15m', status: 'Next Calling', badge: 'badge-yellow' },
                                { token: 'T-404', patient: 'Suresh Das', age: '62, M', vitals: 'BP: 140/90, Temp: 99F', dr: 'Dr. Priya Sharma', room: 'Room 101', wait: '32m', status: 'Waiting', badge: 'badge-navy' },
                                { token: 'T-405', patient: 'Alisha Khan', age: '28, F', vitals: 'Triage Pending', dr: 'Dr. Kavita Patel', room: 'Room 102', wait: '45m', status: 'Waiting', badge: 'badge-navy' },
                                { token: 'T-401', patient: 'Deepak Verma', age: '24, M', vitals: 'Normal', dr: 'Dr. Arjun Nair', room: 'Room 105', wait: '-', status: 'Discharged', badge: 'badge-green' },
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '15px' }}>{row.token}</span>
                                            <span style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>{row.patient} <span style={{ color: 'var(--color-text-muted)' }}>({row.age})</span></span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ fontSize: '12px', color: row.vitals === 'Triage Pending' ? '#F59E0B' : 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {row.vitals === 'Triage Pending' && <AlertTriangle size={12} />} {row.vitals}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ color: 'var(--color-text-primary)' }}>{row.dr}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{row.room}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ fontWeight: 600, color: row.wait.includes('45') || row.wait.includes('3') ? '#EF4444' : 'var(--color-text-primary)' }}>{row.wait}</span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span className={`badge ${row.badge}`} style={{ padding: '4px 10px', fontSize: '12px' }}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        {row.status === 'Waiting' || row.status === 'Next Calling' ? (
                                            <button className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', fontSize: '12px', background: '#F8FAFC', color: 'var(--color-navy)' }}>
                                                <ArrowRightCircle size={14} /> Send In
                                            </button>
                                        ) : row.status === 'In Session' ? (
                                            <button className="btn btn-primary btn-sm" style={{ padding: '6px 12px', fontSize: '12px' }}>
                                                Open Desk
                                            </button>
                                        ) : (
                                            <button className="btn btn-secondary btn-sm" style={{ padding: '8px', background: '#F8FAFC' }}>
                                                <Eye size={14} color="var(--color-text-secondary)" />
                                            </button>
                                        )}
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
