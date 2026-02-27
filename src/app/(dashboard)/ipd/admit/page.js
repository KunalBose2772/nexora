'use client';
import { Save, ArrowLeft, Search, BedDouble, UserPlus, Clock } from 'lucide-react';
import Link from 'next/link';

export default function IPDAdmitPage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/ipd" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Admit Patient (IPD)</h1>
                        <p className="page-header__subtitle">Allocate a ward or bed to admit a patient for inpatient care.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        Cancel Admission
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <Save size={15} strokeWidth={1.5} />
                        Confirm Admission
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px', paddingBottom: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Patient Context */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '6px', borderRadius: '8px' }}>
                                <UserPlus size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Patient Directory</h3>
                        </div>
                        <div style={{ position: 'relative', marginBottom: '16px' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                            <input type="text" placeholder="Search Patient by UHID to pull records..." style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Admitting Doctor / Consultant <span style={{ color: 'red' }}>*</span></label>
                                <select style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                    <option>Select Attending Provider</option>
                                    <option>Dr. Raj Malhotra (Orthopedics)</option>
                                    <option>Dr. Vinita Singh (General Surgery)</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Admission Date & Time</label>
                                <input type="datetime-local" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', color: 'var(--color-text-primary)' }} />
                            </div>
                        </div>
                    </div>

                    {/* Ward Allocation */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', padding: '6px', borderRadius: '8px' }}>
                                <BedDouble size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Bed Allocation & Category</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Ward Type <span style={{ color: 'red' }}>*</span></label>
                                <select style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                    <option>Select Type</option>
                                    <option>General Ward</option>
                                    <option>Semi-Private</option>
                                    <option>Private Room</option>
                                    <option>Pre-Op Area</option>
                                    <option>Intensive Care (ICU)</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Floor / Wing</label>
                                <select style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                    <option>Select Wing</option>
                                    <option>East Wing - Floor 2</option>
                                    <option>South Wing - Floor 1</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Bed Number <span style={{ color: 'red' }}>*</span></label>
                                <select style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                    <option>Available Beds...</option>
                                    <option>Bed 204-A (Vacant)</option>
                                    <option>Bed 204-B (Vacant)</option>
                                    <option>Bed 205 (Vacant - Window)</option>
                                </select>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Admitting Diagnosis / Remarks</label>
                                <textarea rows="3" placeholder="Enter clinical reasoning for ward admission and initial orders..." style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', resize: 'vertical' }}></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admission Finances Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ padding: '24px', background: '#FAFCFF', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '16px' }}>Admission Billing Profile</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', width: '100px' }}>Deposit Reqd:</div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>₹ 10,000.00</div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', width: '100px' }}>Bed Rent/Day:</div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>₹ 1,500.00 (General)</div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', width: '100px' }}>Care Category:</div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Standard</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed var(--color-border-light)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-navy)', cursor: 'pointer' }}>
                                <input type="checkbox" style={{ width: '16px', height: '16px' }} />
                                Capture Security Deposit Now
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
