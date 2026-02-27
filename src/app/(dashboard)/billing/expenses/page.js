'use client';
import { ArrowLeft, IndianRupee, Search, Filter, Plus, FileText, Download, TrendingDown, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ExpensesPage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/billing" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Expense & Payable Tracker</h1>
                        <p className="page-header__subtitle">Manage hospital supply chain costs, vendor payments, and operational expenses.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        <Download size={14} /> Export CSV
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <Plus size={15} strokeWidth={1.5} />
                        Record New Expense
                    </button>
                </div>
            </div>

            {/* Expense KPI Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="stat-card">
                    <div className="stat-card__icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                        <TrendingDown size={24} />
                    </div>
                    <div className="stat-card__info">
                        <h4 className="stat-card__title">Total Expenses (This Month)</h4>
                        <p className="stat-card__value" style={{ color: '#EF4444' }}>₹ 4.5L</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
                        <Clock size={24} />
                    </div>
                    <div className="stat-card__info">
                        <h4 className="stat-card__title">Pending Vendor Payables</h4>
                        <p className="stat-card__value" style={{ color: '#F59E0B' }}>₹ 1.2L</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon" style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}>
                        <FileText size={24} />
                    </div>
                    <div className="stat-card__info">
                        <h4 className="stat-card__title">Unapproved Requests</h4>
                        <p className="stat-card__value">14 Drafts</p>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                            <input type="text" placeholder="Search by Vendor, Voucher ID, or Category..." style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                        </div>
                        <button className="btn btn-secondary" style={{ background: '#fff' }}>
                            <Filter size={16} /> Filters
                        </button>
                    </div>
                </div>

                <div className="data-table-wrapper" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border-light)' }}>
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
                            <tr>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '13px', textTransform: 'uppercase' }}>Voucher ID</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '13px', textTransform: 'uppercase' }}>Date</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '13px', textTransform: 'uppercase' }}>Category / Head</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '13px', textTransform: 'uppercase' }}>Vendor / Payee</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '13px', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { id: 'EXP-4509', date: 'Oct 24, 2023', cat: 'Pharmacy Procurement', payee: 'Cipla Distributors Pvt Ltd', status: 'Paid', amt: '45,000' },
                                { id: 'EXP-4510', date: 'Oct 23, 2023', cat: 'Utility Bills', payee: 'State Electricity Board', status: 'Paid', amt: '18,500' },
                                { id: 'EXP-4511', date: 'Oct 22, 2023', cat: 'Lab Reagents', payee: 'Transasia Biomedicals', status: 'Pending', amt: '1,24,000' },
                                { id: 'EXP-4512', date: 'Oct 21, 2023', cat: 'Maintenance / Housekeeping', payee: 'CleanWorks Agency', status: 'Paid', amt: '32,000' },
                                { id: 'EXP-4513', date: 'Oct 20, 2023', cat: 'Stationery & Admin', payee: 'OfficeMart Supplies', status: 'Draft', amt: '5,400' },
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '16px', fontWeight: 500, fontFamily: 'monospace', color: 'var(--color-navy)' }}>{row.id}</td>
                                    <td style={{ padding: '16px', color: 'var(--color-text-secondary)' }}>{row.date}</td>
                                    <td style={{ padding: '16px', color: 'var(--color-text-primary)' }}>{row.cat}</td>
                                    <td style={{ padding: '16px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{row.payee}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span className={`badge ${row.status === 'Paid' ? 'badge-green' : row.status === 'Pending' ? 'badge-yellow' : 'badge-navy'}`} style={{ padding: '4px 10px', fontSize: '12px' }}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'right' }}>{row.amt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
