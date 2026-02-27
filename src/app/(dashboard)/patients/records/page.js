'use client';
import { Upload, ArrowLeft, Search, Database } from 'lucide-react';
import Link from 'next/link';

export default function PatientRecordsPage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/patients" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Upload Medical Record</h1>
                        <p className="page-header__subtitle">Attach external lab reports, scans, or discharge summaries to a patient EMR.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        Cancel Upload
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <Upload size={15} strokeWidth={1.5} />
                        Save to EMR
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '24px', paddingBottom: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '16px' }}>1. Select Patient Account</h3>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                            <input type="text" placeholder="Search by UHID, Mobile, or Name..." style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                        </div>
                    </div>

                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '16px' }}>2. Record Metadata</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Category Tag <span style={{ color: 'red' }}>*</span></label>
                                <select style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                    <option>Select Type...</option>
                                    <option>Pathology Results</option>
                                    <option>Radiology/Imaging</option>
                                    <option>External Prescription</option>
                                    <option>Discharge Summary</option>
                                    <option>Consent Form</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Document Title <span style={{ color: 'red' }}>*</span></label>
                                <input type="text" placeholder="e.g. Pre-Op Blood Work 2023" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Date of Creation</label>
                                <input type="date" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', color: 'var(--color-text-primary)' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '16px' }}>3. Secure File Upload</h3>

                        <label style={{ flex: 1, border: '2px dashed var(--color-border-light)', borderRadius: '12px', background: '#FAFCFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--color-cyan)'; e.currentTarget.style.background = 'rgba(0,194,255,0.03)' }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-light)'; e.currentTarget.style.background = '#FAFCFF' }}>
                            <input type="file" style={{ display: 'none' }} multiple />
                            <div style={{ width: '64px', height: '64px', background: 'rgba(0,194,255,0.1)', color: 'var(--color-cyan)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                                <Database size={32} />
                            </div>
                            <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '8px', margin: 0 }}>Click to select or drag files here</h4>
                            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>
                                Supported formats: PDF, JPG, PNG, DICOM (Max. 15MB)
                            </p>

                            <button className="btn btn-secondary" style={{ marginTop: '24px', pointerEvents: 'none' }}>Browse Files</button>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
