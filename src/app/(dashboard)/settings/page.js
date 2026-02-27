'use client';
import { Settings, Shield, Bell, Database, CheckCircle2, Hospital, Mail, Building2, Save } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>System Configuration</h1>
                    <p className="page-header__subtitle">
                        Manage global hospital settings, preferences, billing rules, and integrations.
                    </p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        Discard Changes
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <Save size={15} strokeWidth={1.5} />
                        Save Configuration
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '24px', alignItems: 'start', paddingBottom: '40px' }}>
                {/* Settings Sidebar Menu */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', position: 'sticky', top: '24px' }}>
                    {[
                        { label: 'Hospital Profile', icon: Hospital, active: true },
                        { label: 'Billing & Currency', icon: Building2, active: false },
                        { label: 'Security & Access', icon: Shield, active: false },
                        { label: 'SMTP / Email', icon: Mail, active: false },
                        { label: 'Backup & Restore', icon: Database, active: false },
                    ].map((item, i) => (
                        <button key={i} className={`nav-item ${item.active ? 'active' : ''}`} style={{ margin: 0, justifyContent: 'flex-start', color: item.active ? 'var(--color-cyan)' : 'var(--color-text-secondary)', background: item.active ? 'rgba(0,194,255,0.1)' : 'transparent', fontWeight: item.active ? 600 : 500, padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s' }}>
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Settings Content Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* General Settings */}
                    <div className="card" style={{ padding: '0' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-navy)', margin: 0 }}>Hospital Identity</h2>
                            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>This information will appear on invoices, reports, and prescriptions.</p>
                        </div>

                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Hospital/Clinic Name</label>
                                    <input type="text" defaultValue="Nexora Health Systems" style={{ padding: '12px 16px', border: '1px solid var(--color-border-light)', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Govt. Registration Number / License</label>
                                    <input type="text" defaultValue="REG-24901844-IN" style={{ padding: '12px 16px', border: '1px solid var(--color-border-light)', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'monospace' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Registered Address</label>
                                    <textarea rows="3" defaultValue="123 Health Avenue, Medical District, Tech City - 560100" style={{ padding: '12px 16px', border: '1px solid var(--color-border-light)', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }}></textarea>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Primary Contact Email</label>
                                    <input type="email" defaultValue="admin@nexorahealth.com" style={{ padding: '12px 16px', border: '1px solid var(--color-border-light)', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Primary Helpline Number</label>
                                    <input type="text" defaultValue="+91 1800-NEXORA" style={{ padding: '12px 16px', border: '1px solid var(--color-border-light)', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Regional & Localization */}
                    <div className="card" style={{ padding: '0' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-navy)', margin: 0 }}>Localization</h2>
                            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>Configure timezone, date formats, and language settings.</p>
                        </div>

                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Timezone</label>
                                    <select style={{ padding: '12px 16px', border: '1px solid var(--color-border-light)', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#fff' }}>
                                        <option>(UTC+05:30) Asia/Kolkata</option>
                                        <option>(UTC+00:00) London</option>
                                        <option>(UTC-05:00) Eastern Time</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Date Format</label>
                                    <select style={{ padding: '12px 16px', border: '1px solid var(--color-border-light)', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#fff' }}>
                                        <option>DD/MM/YYYY</option>
                                        <option>MM/DD/YYYY</option>
                                        <option>YYYY-MM-DD</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Default Currency</label>
                                    <select style={{ padding: '12px 16px', border: '1px solid var(--color-border-light)', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#fff' }}>
                                        <option>INR (₹) Indian Rupee</option>
                                        <option>USD ($) US Dollar</option>
                                        <option>GBP (£) British Pound</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
