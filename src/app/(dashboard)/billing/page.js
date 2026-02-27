'use client';
import { IndianRupee, Plus, Search, Filter, TrendingUp, TrendingDown, Clock, CreditCard, Receipt, FileText, Download, Activity, MoreVertical } from 'lucide-react';
import Link from 'next/link';

export default function BillingPage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Billing & Invoicing</h1>
                    <p className="page-header__subtitle">
                        Manage patient accounts, insurance claims, and hospital revenue streams.
                    </p>
                </div>
                <div className="dashboard-header-buttons">
                    <Link href="/billing/new" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <Plus size={15} strokeWidth={1.5} aria-hidden="true" />
                        Draft New Invoice
                    </Link>
                </div>
            </div>

            {/* Quick KPI Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(16,185,129,0.1)', color: '#16A34A', padding: '10px', borderRadius: '10px' }}>
                            <IndianRupee size={20} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={12} /> +5.2%</span>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Total Collected (Today)</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>₹ 1.8L</h4>
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
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Outstanding Dues</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#F59E0B', margin: 0 }}>₹ 45K</h4>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>12 Invoices</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '10px', borderRadius: '10px' }}>
                            <Activity size={20} />
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Pending Insurance Claims</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#3B82F6', margin: 0 }}>₹ 2.4L</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                            <input type="text" placeholder="Search Master Ledger by Invoice No, Patient Name, or Transaction ID..." style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                        </div>
                        <button className="btn btn-secondary" style={{ background: '#fff' }}>
                            <Filter size={16} /> Filter by Status
                        </button>
                    </div>
                </div>

                <div className="data-table-wrapper" style={{ borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
                            <tr>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Invoice & Timestamp</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Account / Patient Info</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Service Category</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Amount Settled</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Clearance Status</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { id: 'INV-2023-1101', patient: 'Ramesh Kumar', uid: 'UHID-10029', date: 'Today, 09:30 AM', amt: '₹ 1,200', type: 'OPD Consult', method: 'UPI (PhonePe)', status: 'Settled', badge: 'badge-green' },
                                { id: 'INV-2023-1102', patient: 'Anita Sharma', uid: 'UHID-10034', date: 'Today, 10:15 AM', amt: '₹ 45,000', type: 'IPD Final Bill', method: 'TPA / Insurance', status: 'Pending Auth', badge: 'badge-yellow' },
                                { id: 'INV-2023-1099', patient: 'Deepak Verma', uid: 'UHID-09941', date: 'Yesterday, 14:00 PM', amt: '₹ 800', type: 'Pharmacy Sales', method: 'Cash', status: 'Settled', badge: 'badge-green' },
                                { id: 'INV-2023-1098', patient: 'Suresh Das', uid: 'UHID-08832', date: 'Yesterday, 11:30 AM', amt: '₹ 12,500', type: 'Laboratory Request', method: 'Credit Card', status: 'Settled', badge: 'badge-green' },
                                { id: 'INV-2023-1095', patient: 'Vinod Mehra', uid: 'UHID-10099', date: 'Oct 25, 2023', amt: '₹ 500', type: 'OPD Registration', method: 'Cash', status: 'Refunded', badge: 'badge-navy' },
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '14px', fontFamily: 'monospace' }}>{row.id}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{row.date}</span>
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
                                            <span style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>{row.type}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '15px' }}>{row.amt}</span>
                                            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <CreditCard size={10} /> {row.method}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span className={`badge ${row.badge}`} style={{ padding: '4px 10px', fontSize: '12px' }}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button className="btn btn-secondary btn-sm" style={{ padding: '6px 10px', fontSize: '12px', background: '#F8FAFC' }}>
                                                <Receipt size={14} /> Rect
                                            </button>
                                            <button className="btn btn-secondary btn-sm" style={{ padding: '8px', background: '#F8FAFC' }}>
                                                <MoreVertical size={14} color="var(--color-text-secondary)" />
                                            </button>
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
