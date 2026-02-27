'use client';
import { FlaskConical, Filter, Plus, Search, MoreVertical, FileText, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function LaboratoryPage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Pathology & Diagnostics Central</h1>
                    <p className="page-header__subtitle">
                        Track lab test orders, manage sample collection tasks, and dispatch results.
                    </p>
                </div>
                <div className="dashboard-header-buttons">
                    <Link href="/laboratory/new" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <Plus size={15} strokeWidth={1.5} />
                        Create Lab Request
                    </Link>
                </div>
            </div>

            {/* Quick KPI Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(56,189,248,0.1)', color: '#0EA5E9', padding: '10px', borderRadius: '10px' }}>
                            <FlaskConical size={20} />
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Active Test Orders</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>142</h4>
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
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Samples Uncollected</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#F59E0B', margin: 0 }}>28</h4>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Urgent: 5</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', padding: '10px', borderRadius: '10px' }}>
                            <CheckCircle2 size={20} />
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Results Generated (Today)</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#10B981', margin: 0 }}>415</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                            <input type="text" placeholder="Search by Order ID, Patient, or Test Name..." style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                        </div>
                        <button className="btn btn-secondary" style={{ background: '#fff' }}>
                            <Filter size={16} /> Filter Status
                        </button>
                    </div>
                </div>

                <div className="data-table-wrapper" style={{ borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
                            <tr>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Tracking ID & Reg. Time</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Patient Details</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Test Prescription</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Workflow Status</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { trk: 'LAB1034-01', time: '10:45 AM Today', patient: 'Ramesh Kumar', uid: 'UHID-890', test: 'Complete Blood Count (CBC)', cat: 'Hematology', status: 'Result Ready' },
                                { trk: 'LAB1034-02', time: '10:30 AM Today', patient: 'Alisha Khan', uid: 'UHID-891', test: 'Lipid Profile', cat: 'Biochemistry', status: 'Processing' },
                                { trk: 'LAB1034-03', time: '09:15 AM Today', patient: 'Suresh Das', uid: 'UHID-892', test: 'Thyroid Panel (T3,T4,TSH)', cat: 'Immunology', status: 'Awaiting Sample' },
                                { trk: 'LAB1034-04', time: '08:00 AM Today', patient: 'Vikram Singh', uid: 'UHID-893', test: 'Urine Routine & Microscopic', cat: 'Clinical Pathology', status: 'Result Ready' },
                                { trk: 'LAB1034-05', time: 'Yesterday', patient: 'Pooja Verma', uid: 'UHID-894', test: 'HbA1c', cat: 'Biochemistry', status: 'Report Dispatched' }
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '13px', fontFamily: 'monospace' }}>{row.trk}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{row.time}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{row.patient}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{row.uid}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                                            <span style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>{row.test}</span>
                                            <span className="badge badge-navy" style={{ fontSize: '11px', padding: '2px 6px' }}>{row.cat}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span className={`badge ${row.status === 'Result Ready' || row.status === 'Report Dispatched' ? 'badge-green' : row.status === 'Processing' ? 'badge-navy' : 'badge-yellow'}`} style={{ padding: '4px 10px', fontSize: '12px' }}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        {row.status.includes('Ready') || row.status.includes('Dispatched') ? (
                                            <button className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', fontSize: '12px', background: '#F8FAFC' }}>
                                                <FileText size={14} /> View
                                            </button>
                                        ) : (
                                            <button className="btn btn-secondary btn-sm" style={{ padding: '8px', background: '#F8FAFC' }}>
                                                <MoreVertical size={14} color="var(--color-text-secondary)" />
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
