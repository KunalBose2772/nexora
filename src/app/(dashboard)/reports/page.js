'use client';
import { Download, Search, Filter, TrendingUp, TrendingDown, IndianRupee, PieChart, BarChart3, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Analytics & Reports Central</h1>
                    <p className="page-header__subtitle">
                        Comprehensive insights into clinical, operational, and financial performance metrics.
                    </p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        <Clock size={14} /> Schedule Automations
                    </button>
                    <button className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <Download size={15} strokeWidth={1.5} aria-hidden="true" />
                        Export Data Dump
                    </button>
                </div>
            </div>

            {/* Quick KPI Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(16,185,129,0.1)', color: '#16A34A', padding: '10px', borderRadius: '10px' }}>
                            <IndianRupee size={20} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={12} /> +12.5%</span>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>MTD Revenue</p>
                        <h4 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>₹ 24.5L</h4>
                    </div>
                </div>

                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '10px', borderRadius: '10px' }}>
                            <PieChart size={20} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>Stable</span>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>IPD Occupancy Rate</p>
                        <h4 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>82.4%</h4>
                    </div>
                </div>

                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '10px', borderRadius: '10px' }}>
                            <AlertTriangle size={20} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingDown size={12} /> -2.1%</span>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Patient Wait Time (Avg)</p>
                        <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#EF4444', margin: 0 }}>24 Mins</h4>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                        <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                        <input type="text" placeholder="Search report templates by ID, Name or Data Source..." style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                    </div>
                    <button className="btn btn-secondary" style={{ background: '#FFFFFF' }}>
                        <Filter size={16} /> Category
                    </button>
                    <button className="btn btn-secondary" style={{ background: '#FFFFFF' }}>
                        Sort by: Recent
                    </button>
                </div>

                <div className="data-table-wrapper" style={{ borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#F8FAFC' }}>
                            <tr>
                                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Report Document Name</th>
                                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Data Domain</th>
                                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Last Generated</th>
                                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Output Formats</th>
                                <th style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { id: 'RPT-1033', name: 'Comprehensive Monthly Revenue Summary', cat: 'Finance & Billing', date: 'Today, 08:30 AM', fmt: 'PDF, CSV' },
                                { id: 'RPT-1034', name: 'OPD Footfall & Patient Demographics Analysis', cat: 'Clinical Operations', date: 'Yesterday, 18:00 PM', fmt: 'PDF, CSV, XLSX' },
                                { id: 'RPT-1035', name: 'Pharmacy Stock Valuation against Thresholds', cat: 'Inventory Management', date: 'Oct 31, 2023', fmt: 'CSV, JSON' },
                                { id: 'RPT-1036', name: 'Doctors Attendance & Consultation Count', cat: 'HR & Staffing', date: 'Oct 30, 2023', fmt: 'PDF' },
                                { id: 'RPT-1037', name: 'Laboratory Test Utilization Frequency', cat: 'Diagnostics', date: 'Oct 28, 2023', fmt: 'PDF, CSV' },
                            ].map((pt, i) => (
                                <tr key={pt.id} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '14px' }}>{pt.name}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{pt.id}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}><span className="badge badge-navy" style={{ padding: '6px 10px', fontSize: '12px' }}>{pt.cat}</span></td>
                                    <td style={{ padding: '16px', color: 'var(--color-text-secondary)', fontSize: '14px' }}>{pt.date}</td>
                                    <td style={{ padding: '16px', color: 'var(--color-text-secondary)', fontSize: '13px', fontFamily: 'monospace' }}>{pt.fmt}</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button className="btn btn-primary btn-sm" style={{ padding: '6px 12px', fontSize: '12px' }}>Run Now</button>
                                        </div>
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
