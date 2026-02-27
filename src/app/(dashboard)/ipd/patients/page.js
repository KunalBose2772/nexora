'use client';
import { ArrowLeft, UserPlus, FileText, Activity, Clock, HeartPulse, Search, Filter, MoreVertical, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function ActiveInpatientsPage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/ipd" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Admitted Patients Census</h1>
                        <p className="page-header__subtitle">Monitor active inpatients, clinical status flags, and attending doctors.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        <Filter size={14} /> View Ward
                    </button>
                    <Link href="/ipd/admit" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <UserPlus size={15} strokeWidth={1.5} />
                        New Admission
                    </Link>
                </div>
            </div>

            {/* Quick KPI Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '10px', borderRadius: '10px' }}>
                            <HeartPulse size={20} />
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Total Admitted Census</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>45</h4>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Patients</span>
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
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Awaiting Discharge</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#F59E0B', margin: 0 }}>8</h4>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Pending Bills</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '10px', borderRadius: '10px' }}>
                            <ShieldAlert size={20} />
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>ICU / Critical Care</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#EF4444', margin: 0 }}>10</h4>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Max capacity reached</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                            <input type="text" placeholder="Search by Patient Name, IPD No, or Ward..." style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                        </div>
                    </div>
                </div>

                <div className="data-table-wrapper" style={{ borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
                            <tr>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>IPD No. & Patient</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Location (Ward/Bed)</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Attending Physician</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Admission Time (Length)</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Acuity Status</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Controls</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { ipd: 'IPD-2023-A81', name: 'Ramesh Kumar', sex: 'M, 45', loc: 'Gen Male - 101A', dr: 'Dr. Sharma', time: 'Oct 20, 08:30 AM', len: '5 Days', stat: 'Stable' },
                                { ipd: 'IPD-2023-A82', name: 'Alisha Khan', sex: 'F, 28', loc: 'Gen Female - 105', dr: 'Dr. Patel', time: 'Oct 24, 11:15 AM', len: '1 Day', stat: 'Stable' },
                                { ipd: 'IPD-2023-A83', name: 'Suresh Das', sex: 'M, 62', loc: 'ICU - Bed 04', dr: 'Dr. Singh', time: 'Oct 25, 02:45 AM', len: '12 Hours', stat: 'Critical' },
                                { ipd: 'IPD-2023-A84', name: 'Pooja Verma', sex: 'F, 34', loc: 'Pvt Suite - 302', dr: 'Dr. Sharma', time: 'Oct 21, 09:00 AM', len: '4 Days', stat: 'Discharging' },
                                { ipd: 'IPD-2023-A85', name: 'Vikram Singh', sex: 'M, 50', loc: 'Gen Male - 104A', dr: 'Dr. Patel', time: 'Oct 24, 20:00 PM', len: '1 Day', stat: 'Stable' }
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '14px' }}>{row.name} <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, fontSize: '12px' }}>({row.sex})</span></span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{row.ipd}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6' }}></div>
                                            <span style={{ color: 'var(--color-text-primary)' }}>{row.loc}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', color: 'var(--color-text-secondary)' }}>
                                        {row.dr}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ color: 'var(--color-text-primary)', fontSize: '13px' }}>{row.time}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Stay: {row.len}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span className={`badge ${row.stat === 'Stable' ? 'badge-green' : row.stat === 'Critical' ? 'badge-yellow' : 'badge-navy'}`} style={{ padding: '4px 10px', fontSize: '12px' }} title="Acuity status generated automatically">
                                            {row.stat}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button className="btn btn-secondary btn-sm" style={{ padding: '8px' }}>
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
