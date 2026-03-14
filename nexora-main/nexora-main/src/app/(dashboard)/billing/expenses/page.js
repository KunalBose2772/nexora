'use client';
import { ArrowLeft, IndianRupee, Search, Filter, Plus, FileText, Download, TrendingDown, Clock, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchExpenses = async () => {
        try {
            const res = await fetch('/api/billing/expenses');
            const data = await res.json();
            if (data.ok) setExpenses(data.expenses);
        } catch (err) {
            console.error('Failed to fetch expenses', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchExpenses(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData(e.target);

        const payload = {
            date: formData.get('date'),
            category: formData.get('category'),
            vendor: formData.get('vendor'),
            status: formData.get('status'),
            amount: formData.get('amount')
        };

        try {
            const res = await fetch('/api/billing/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                await fetchExpenses();
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error('Failed to create expense', err);
        } finally {
            setSubmitting(false);
        }
    };

    const filteredExpenses = expenses.filter(ex =>
        (ex.vendor && ex.vendor.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ex.voucherId && ex.voucherId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ex.category && ex.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const totalExpenses = expenses.reduce((acc, curr) => curr.status === 'Paid' ? acc + curr.amount : acc, 0);
    const pendingPayables = expenses.reduce((acc, curr) => curr.status === 'Pending' ? acc + curr.amount : acc, 0);
    const draftCount = expenses.filter(ex => ex.status === 'Draft').length;
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
                    <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-sm">
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
                        <h4 className="stat-card__title">Total Paid Expenses</h4>
                        <p className="stat-card__value" style={{ color: '#EF4444' }}>₹ {totalExpenses.toLocaleString()}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
                        <Clock size={24} />
                    </div>
                    <div className="stat-card__info">
                        <h4 className="stat-card__title">Pending Vendor Payables</h4>
                        <p className="stat-card__value" style={{ color: '#F59E0B' }}>₹ {pendingPayables.toLocaleString()}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card__icon" style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}>
                        <FileText size={24} />
                    </div>
                    <div className="stat-card__info">
                        <h4 className="stat-card__title">Unapproved Requests</h4>
                        <p className="stat-card__value">{draftCount} Drafts</p>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} type="text" placeholder="Search by Vendor, Voucher ID, or Category..." style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
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
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#94A3B8' }}>
                                        <Loader2 size={24} className="spin" style={{ margin: '0 auto 12px auto' }} />
                                        Loading expenses...
                                    </td>
                                </tr>
                            ) : filteredExpenses.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#94A3B8' }}>No expenses found.</td>
                                </tr>
                            ) : filteredExpenses.map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '16px', fontWeight: 500, fontFamily: 'monospace', color: 'var(--color-navy)' }}>{row.voucherId}</td>
                                    <td style={{ padding: '16px', color: 'var(--color-text-secondary)' }}>{new Date(row.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '16px', color: 'var(--color-text-primary)' }}>{row.category}</td>
                                    <td style={{ padding: '16px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{row.vendor}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span className={`badge ${row.status === 'Paid' ? 'badge-green' : row.status === 'Pending' ? 'badge-yellow' : 'badge-navy'}`} style={{ padding: '4px 10px', fontSize: '12px' }}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'right' }}>₹ {row.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Record Expense Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: '#fff', width: '100%', maxWidth: '500px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#0F172A' }}>Record New Expense</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>Expense Date</label>
                                    <input required name="date" type="date" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>Category / Head</label>
                                    <select required name="category" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', background: 'white' }}>
                                        <option value="">Select Category</option>
                                        <option value="Pharmacy Procurement">Pharmacy Procurement</option>
                                        <option value="Utility Bills">Utility Bills</option>
                                        <option value="Lab Reagents">Lab Reagents</option>
                                        <option value="Maintenance / Housekeeping">Maintenance / Housekeeping</option>
                                        <option value="Stationery & Admin">Stationery & Admin</option>
                                        <option value="Miscellaneous">Miscellaneous</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>Vendor / Payee Name</label>
                                    <input required name="vendor" type="text" placeholder="e.g. Cipla Distributors or CleanWorks" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                </div>

                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>Amount (₹)</label>
                                        <input required name="amount" type="number" step="0.01" min="0" placeholder="0.00" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>Status</label>
                                        <select required name="status" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', background: 'white' }}>
                                            <option value="Pending">Pending</option>
                                            <option value="Paid">Paid</option>
                                            <option value="Draft">Draft</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', background: 'none', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: '#475569', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={submitting} style={{ padding: '10px 16px', background: '#3B82F6', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {submitting && <Loader2 size={16} className="spin" />}
                                    {submitting ? 'Saving...' : 'Record Expense'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
