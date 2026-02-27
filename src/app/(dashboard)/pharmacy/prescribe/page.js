'use client';
import { Pill, Save, ArrowLeft, Search, ScanLine, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function PrescribeMedicinePage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/pharmacy" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Dispense Medicine</h1>
                        <p className="page-header__subtitle">Process prescriptions and manage point-of-sale inventory dispensing.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        Clear Cart
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <Save size={15} strokeWidth={1.5} />
                        Complete Sale & Bill
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px', paddingBottom: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Search Bar */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(56,189,248,0.1)', color: '#0EA5E9', padding: '6px', borderRadius: '8px' }}>
                                <ScanLine size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Link Prescription</h3>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                                <input type="text" placeholder="Scan or type Rx ID, Patient UHID, or Walk-in Name..." style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                <button className="btn btn-secondary btn-sm" style={{ position: 'absolute', right: '6px', top: '6px' }}>Fetch</button>
                            </div>
                        </div>
                    </div>

                    {/* Drug Search & Inventory */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(236,72,153,0.1)', color: '#EC4899', padding: '6px', borderRadius: '8px' }}>
                                <Pill size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Add Drugs to Cart</h3>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                            <input type="text" placeholder="Search drug inventory by exact name or generic composition..." style={{ flex: 1, padding: '10px 16px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                            <input type="number" placeholder="Qty" style={{ width: '80px', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                            <button className="btn btn-primary">Add</button>
                        </div>

                        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
                            <thead>
                                <tr style={{ background: '#F8FAFC', textAlign: 'left', fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border-light)' }}>Medicine Details</th>
                                    <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border-light)' }}>Batch & Expiry</th>
                                    <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border-light)' }}>Stock Status</th>
                                    <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border-light)' }}>MRP (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                                        Search for a medicine to see local pharmacy inventory.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Checkout Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ padding: '24px', background: '#FAFCFF', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                            <div style={{ background: 'rgba(22,163,74,0.1)', color: '#16A34A', padding: '6px', borderRadius: '8px' }}>
                                <ShoppingCart size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)', margin: 0 }}>Checkout Cart</h3>
                        </div>

                        <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px dashed var(--color-border-light)', color: '#94A3B8', fontSize: '13px', marginBottom: '16px' }}>
                            Cart is empty.
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Items Subtotal</span>
                                <span>₹ 0.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>CGST/SGST</span>
                                <span>+ ₹ 0.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Discount %</span>
                                <span>- ₹ 0.00</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border-light)' }}>
                            <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Net Amount</span>
                            <span style={{ fontSize: '18px', fontWeight: 700, color: '#16A34A' }}>₹ 0.00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
