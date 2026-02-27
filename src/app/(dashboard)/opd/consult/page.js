'use client';
import { Save, ArrowLeft, Stethoscope, Search, UserIcon, Clock, HeartPulse, Activity } from 'lucide-react';
import Link from 'next/link';

export default function OPDConsultPage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/opd" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title" style={{ marginBottom: '4px' }}>New OPD Consult</h1>
                        <p className="page-header__subtitle">Generate an Outpatient consultation token and triage summary.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        Cancel
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <Save size={15} strokeWidth={1.5} />
                        Generate Token
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px', paddingBottom: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Patient & Doctor Selection */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(0,194,255,0.1)', color: 'var(--color-navy)', padding: '6px', borderRadius: '8px' }}>
                                <Stethoscope size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Consultation Routing</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Select Patient <span style={{ color: 'red' }}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                                    <input type="text" placeholder="Search by Patient Name, UHID, or Mobile..." style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                    <button className="btn btn-primary btn-sm" style={{ position: 'absolute', right: '6px', top: '6px' }}>Search</button>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Select Department <span style={{ color: 'red' }}>*</span></label>
                                    <select style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                        <option>General Medicine</option>
                                        <option>Cardiology</option>
                                        <option>Orthopedics</option>
                                        <option>Pediatrics</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Select Consulting Doctor <span style={{ color: 'red' }}>*</span></label>
                                    <select style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                        <option>Dr. Priya Sharma</option>
                                        <option>Dr. Kavita Patel</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vitals Triage */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '6px', borderRadius: '8px' }}>
                                <Activity size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Initial Triage / Vitals (Optional)</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Blood Pressure</label>
                                <input type="text" placeholder="120/80" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Heart Rate</label>
                                <input type="text" placeholder="72 bpm" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Temperature</label>
                                <input type="text" placeholder="98.6 °F" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Weight / SpO2</label>
                                <input type="text" placeholder="70kg / 98%" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Nurse's Initial Notes</label>
                                <textarea rows="2" placeholder="Brief notes on patient's current condition before doctor visit..." style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', resize: 'vertical' }}></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Queue Summary Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ padding: '24px', background: '#FAFCFF', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '16px' }}>Current OPD Queue</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ minWidth: '12px', height: '12px', background: '#10B981', borderRadius: '50%' }}></div>
                                    <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Dr. Priya Sharma</span>
                                </div>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>4 Waiting</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ minWidth: '12px', height: '12px', background: '#10B981', borderRadius: '50%' }}></div>
                                    <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Dr. Kavita Patel</span>
                                </div>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>0 Waiting</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ minWidth: '12px', height: '12px', background: '#F59E0B', borderRadius: '50%' }}></div>
                                    <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Dr. Raj Malhotra</span>
                                </div>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>12 Waiting</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed var(--color-border-light)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Estimated Wait Time</span>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>15 mins</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-border-light)' }}>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>OPD Consult Fee</span>
                                <span style={{ fontSize: '16px', fontWeight: 700, color: '#16A34A' }}>₹ 500.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
