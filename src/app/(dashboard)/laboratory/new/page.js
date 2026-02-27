'use client';
import { Save, ArrowLeft, FlaskConical, Search, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewLabTestPage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/laboratory" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title" style={{ marginBottom: '4px' }}>New Lab Request</h1>
                        <p className="page-header__subtitle">Create a pathology or radiology diagnostic request.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        Cancel
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <Save size={15} strokeWidth={1.5} />
                        Submit Request & Bill
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px', paddingBottom: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Patient & Request Origin */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(236,72,153,0.1)', color: '#EC4899', padding: '6px', borderRadius: '8px' }}>
                                <Search size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Patient & Referral Details</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Patient Ref <span style={{ color: 'red' }}>*</span></label>
                                <input type="text" placeholder="Search Patient by UHID or Name..." style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Referring Provider</label>
                                    <input type="text" placeholder="Internal Doctor or External referral..." style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Sample Collection Time</label>
                                    <input type="datetime-local" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', color: 'var(--color-text-primary)' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Test Selection */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(56,189,248,0.1)', color: '#0EA5E9', padding: '6px', borderRadius: '8px' }}>
                                <FlaskConical size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Select Investigations</h3>
                        </div>
                        <div>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                <input type="text" placeholder="Type test name (e.g., CBC, Lipid Profile, X-Ray Chest)..." style={{ flex: 1, padding: '12px 16px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                <button className="btn btn-secondary">Add Test</button>
                            </div>

                            {/* Applied Tests List (Empty State visual) */}
                            <div style={{ border: '1px dashed var(--color-border-light)', borderRadius: '8px', padding: '32px', textAlign: 'center', color: '#94A3B8' }}>
                                <p style={{ fontSize: '14px', margin: 0 }}>Search and add tests to build the request panel.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Billing Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ padding: '24px', background: '#FAFCFF', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '16px' }}>Cart Summary</h3>

                        <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '13px', borderBottom: '1px solid var(--color-border-light)', marginBottom: '16px' }}>
                            No tests added yet
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px' }}>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>Total Payable</span>
                                <span style={{ fontSize: '16px', fontWeight: 700, color: '#16A34A' }}>₹ 0.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
