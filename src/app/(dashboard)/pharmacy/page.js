'use client';
import { Pill, Plus, Search, Filter, AlertTriangle, AlertCircle, ShoppingCart, Activity, RefreshCcw, MoreVertical } from 'lucide-react';
import Link from 'next/link';

export default function PharmacyPage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Pharmacy & Medicines</h1>
                    <p className="page-header__subtitle">
                        Manage drug inventory, prescriptions, and pharmacy sales.
                    </p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        <ShoppingCart size={14} /> View Dispatches
                    </button>
                    <Link href="/pharmacy/prescribe" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <Plus size={15} strokeWidth={1.5} aria-hidden="true" />
                        Dispense Medicine
                    </Link>
                </div>
            </div>

            {/* Quick KPI Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(56,189,248,0.1)', color: '#0EA5E9', padding: '10px', borderRadius: '10px' }}>
                            <Activity size={20} />
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Active SKUs in Stock</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>1,245</h4>
                        </div>
                    </div>
                </div>

                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '10px', borderRadius: '10px' }}>
                            <AlertCircle size={20} />
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Critical Low Stock Warning</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#EF4444', margin: 0 }}>18</h4>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Urgent Restock Req.</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', padding: '10px', borderRadius: '10px' }}>
                            <AlertTriangle size={20} />
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Nearing Expiry (30 Days)</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#F59E0B', margin: 0 }}>42</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                            <input type="text" placeholder="Search Master Inventory by name, generic, batch or code..." style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                        </div>
                        <button className="btn btn-secondary" style={{ background: '#fff' }}>
                            <Filter size={16} /> Filters
                        </button>
                    </div>
                </div>

                <div className="data-table-wrapper" style={{ borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
                            <tr>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Drug Code & Item Details</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Manufacturer & Form</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Current Batch & Expiry</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Physical Stock Level</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Inventory Status</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { id: 'MED-1011', name: 'Dolo 650mg', generic: 'Paracetamol', mfg: 'Micro Labs Ltd', cat: 'Tablet', batch: 'B22019', expiry: 'Jan 2026', stock: '4,200', req: '500', status: 'Healthy', badge: 'badge-green' },
                                { id: 'MED-1084', name: 'Augmentin 625 Duo', generic: 'Amoxicillin + Clavulanic Acid', mfg: 'GSK', cat: 'Tablet', batch: 'B22144', expiry: 'Mar 2025', stock: '85', req: '150', status: 'Re-Order', badge: 'badge-yellow' },
                                { id: 'MED-1102', name: 'Benadryl Cough Formula', generic: 'Diphenhydramine', mfg: 'J&J', cat: 'Syrup 100ml', batch: 'B22112', expiry: 'Dec 2024', stock: '0', req: '50', status: 'Stock-Out', badge: 'badge-error' },
                                { id: 'MED-1150', name: 'Pan 40mg', generic: 'Pantoprazole', mfg: 'Alkem', cat: 'Tablet', batch: 'B66020', expiry: 'Jun 2025', stock: '1,500', req: '200', status: 'Healthy', badge: 'badge-green' },
                                { id: 'MED-1205', name: 'Novamox 250mg DT', generic: 'Amoxicillin', mfg: 'Cipla', cat: 'Tablet', batch: 'B11005', expiry: 'Nov 2023', stock: '120', req: '-', status: 'Expiring', badge: 'badge-warning' },
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '14px' }}>{row.name}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{row.generic} ({row.id})</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ color: 'var(--color-text-primary)' }}>{row.mfg}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{row.cat}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontFamily: 'monospace', color: 'var(--color-text-primary)' }}>{row.batch}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <RefreshCcw size={10} color={row.status === 'Expiring' ? '#F59E0B' : 'var(--color-text-muted)'} /> {row.expiry}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '14px' }}>{row.stock} <span style={{ fontWeight: 400, color: 'var(--color-text-muted)', fontSize: '12px' }}>Units</span></span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Min. Thresh: {row.req}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span className={`badge ${row.badge}`} style={{ padding: '4px 10px', fontSize: '12px' }}>
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
