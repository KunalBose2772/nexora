'use client';
import { Save, ArrowLeft, Receipt, User, Banknote } from 'lucide-react';
import Link from 'next/link';

export default function NewInvoicePage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/billing" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Draft Invoice</h1>
                        <p className="page-header__subtitle">Generate a custom itemized bill.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        Cancel
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <Save size={15} strokeWidth={1.5} />
                        Save & Print
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '24px', paddingBottom: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Invoice Header */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(0,194,255,0.1)', color: 'var(--color-navy)', padding: '6px', borderRadius: '8px' }}>
                                <User size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Bill To Details</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Patient Account <span style={{ color: 'red' }}>*</span></label>
                                <input type="text" placeholder="Select Registered Patient or Walk-In..." style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Billing Date</label>
                                <input type="date" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', color: 'var(--color-text-primary)' }} />
                            </div>
                        </div>
                    </div>

                    {/* Invoice Items Area */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(234,179,8,0.1)', color: '#EAB308', padding: '6px', borderRadius: '8px' }}>
                                <Receipt size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Line Items</h3>
                        </div>

                        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
                            <thead>
                                <tr style={{ background: '#F8FAFC', textAlign: 'left', fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border-light)' }}>Service / Item Description</th>
                                    <th style={{ padding: '8px 12px', width: '100px', borderBottom: '1px solid var(--color-border-light)' }}>Qty</th>
                                    <th style={{ padding: '8px 12px', width: '150px', borderBottom: '1px solid var(--color-border-light)' }}>Rate/Unit (₹)</th>
                                    <th style={{ padding: '8px 12px', width: '150px', borderBottom: '1px solid var(--color-border-light)', textAlign: 'right' }}>Total (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '8px', borderBottom: '1px solid var(--color-border-light)' }}>
                                        <input type="text" placeholder="e.g. Consultation Fee" style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-light)', borderRadius: '6px', outline: 'none', fontSize: '13px' }} />
                                    </td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid var(--color-border-light)' }}>
                                        <input type="number" defaultValue="1" style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-light)', borderRadius: '6px', outline: 'none', fontSize: '13px' }} />
                                    </td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid var(--color-border-light)' }}>
                                        <input type="number" placeholder="0.00" style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border-light)', borderRadius: '6px', outline: 'none', fontSize: '13px' }} />
                                    </td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid var(--color-border-light)', textAlign: 'right', fontWeight: 500 }}>
                                        0.00
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <button className="btn btn-secondary btn-sm">+ Add Item Line</button>
                    </div>

                    {/* Totals & Payment */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 300px)', gap: '20px' }}>
                        <div className="card" style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '16px' }}>Invoice Notes</h3>
                            <textarea rows="4" placeholder="Add terms and conditions to the bill..." style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', resize: 'vertical' }}></textarea>
                        </div>

                        <div className="card" style={{ padding: '24px', background: '#FAFCFF' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                                <span>Subtotal</span>
                                <span>₹ 0.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                                <span>Taxes / VAT</span>
                                <span>+ ₹ 0.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                                <span>Discount</span>
                                <span>- ₹ 0.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border-light)', fontSize: '18px', fontWeight: 700, color: '#16A34A' }}>
                                <span>Grand Total</span>
                                <span>₹ 0.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
