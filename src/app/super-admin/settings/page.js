'use client';
import { useState, useEffect } from 'react';
import { Settings, Shield, Server, Bell, Database, Key } from 'lucide-react';

const NAV_ITEMS = [
    { id: 'general', icon: Settings, label: 'General Settings' },
    { id: 'security', icon: Shield, label: 'Security & Auth' },
    { id: 'infrastructure', icon: Server, label: 'Infrastructure' },
    { id: 'database', icon: Database, label: 'Database Provisioning' },
    { id: 'api', icon: Key, label: 'API Keys' },
];

export default function PlatformSettingsPage() {
    const [activeTab, setActiveTab] = useState('general');

    // States for the various inputs
    const [generalSettings, setGeneralSettings] = useState({ name: '', email: '', currency: '', allowSignups: true });
    const [security, setSecurity] = useState({ mfa: true, strictPass: true, timeout: 60 });
    const [infra, setInfra] = useState({ region: '', bucket: '' });
    const [db, setDb] = useState({ maxTenants: 250, isolation: '' });
    const [keys, setKeys] = useState({ stripe: '', twilio: '', sendgrid: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/super-admin/settings');
                const data = await res.json();
                if (data.ok && data.settings) {
                    if (data.settings.generalSettings) setGeneralSettings(data.settings.generalSettings);
                    if (data.settings.security) setSecurity(data.settings.security);
                    if (data.settings.infra) setInfra(data.settings.infra);
                    if (data.settings.db) setDb(data.settings.db);
                    if (data.settings.keys) setKeys(data.settings.keys);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (tabName) => {
        try {
            const payload = {
                generalSettings,
                security,
                infra,
                db,
                keys
            };
            const res = await fetch('/api/super-admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.ok) {
                alert(`${tabName} Settings have been saved successfully!`);
            } else {
                alert(`Error saving: ${data.error}`);
            }
        } catch (err) {
            alert('Failed to save settings.');
        }
    };

    if (loading) return <div style={{ padding: '24px' }}>Loading platform settings...</div>;

    return (
        <div className="fade-in">
            {/* Page Header */}
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', letterSpacing: '-0.02em' }}>Platform Settings</h1>
                <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>Manage global configurations, security policies, and integrations.</p>
            </div>

            {/* Two-column layout that stacks on mobile */}
            <div className="settings-layout">
                {/* Sidebar Nav */}
                <div className="settings-nav" style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '8px', height: 'fit-content' }}>
                    {NAV_ITEMS.map(item => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
                            fontSize: '14px', fontWeight: 500, textAlign: 'left', width: '100%',
                            background: activeTab === item.id ? '#ECFDF5' : 'transparent',
                            color: activeTab === item.id ? '#047857' : '#64748B',
                            border: 'none', transition: 'all 150ms'
                        }}>
                            <item.icon size={16} />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Settings Content */}
                {activeTab === 'general' && (
                    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', margin: '0 0 4px 0' }}>General Settings</h2>
                            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Core application settings and branding.</p>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Platform Name</label>
                                <input value={generalSettings.name} onChange={e => setGeneralSettings({ ...generalSettings, name: e.target.value })} type="text" style={{ width: '100%', maxWidth: '500px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Support Email</label>
                                <input value={generalSettings.email} onChange={e => setGeneralSettings({ ...generalSettings, email: e.target.value })} type="email" style={{ width: '100%', maxWidth: '500px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Platform Default Currency</label>
                                <select value={generalSettings.currency} onChange={e => setGeneralSettings({ ...generalSettings, currency: e.target.value })} style={{ width: '100%', maxWidth: '500px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', background: 'white', boxSizing: 'border-box' }}>
                                    <option>INR (₹)</option>
                                    <option>USD ($)</option>
                                    <option>EUR (€)</option>
                                </select>
                            </div>
                            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={generalSettings.allowSignups} onChange={e => setGeneralSettings({ ...generalSettings, allowSignups: e.target.checked })} style={{ accentColor: '#10B981', width: '16px', height: '16px' }} />
                                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#0F172A' }}>Allow Public Signups (Self-Serve)</span>
                                </label>
                                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', marginLeft: '24px' }}>If disabled, tenants can only be provisioned manually by Super Admins.</p>
                            </div>
                            <div>
                                <button onClick={() => handleSave('General')} style={{ background: '#10B981', color: 'white', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)' }}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', margin: '0 0 4px 0' }}>Security & Authentication</h2>
                            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Configure password policies and global MFA settings.</p>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={security.mfa} onChange={e => setSecurity({ ...security, mfa: e.target.checked })} style={{ accentColor: '#10B981', width: '16px', height: '16px' }} />
                                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#0F172A' }}>Enforce MFA for all Super Admins</span>
                                </label>
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={security.strictPass} onChange={e => setSecurity({ ...security, strictPass: e.target.checked })} style={{ accentColor: '#10B981', width: '16px', height: '16px' }} />
                                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#0F172A' }}>Enforce strict password complexity</span>
                                </label>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Session Timeout (Minutes)</label>
                                <input value={security.timeout} onChange={e => setSecurity({ ...security, timeout: e.target.value })} type="number" style={{ width: '100%', maxWidth: '300px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                                <button onClick={() => handleSave('Security')} style={{ background: '#10B981', color: 'white', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)' }}>
                                    Save Security Policies
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'infrastructure' && (
                    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', margin: '0 0 4px 0' }}>Infrastructure & AWS</h2>
                            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Manage core AWS regions, S3 buckets, and instances.</p>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Primary AWS Region</label>
                                <select value={infra.region} onChange={e => setInfra({ ...infra, region: e.target.value })} style={{ width: '100%', maxWidth: '500px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', background: 'white', boxSizing: 'border-box' }}>
                                    <option>ap-south-1 (Mumbai)</option>
                                    <option>us-east-1 (N. Virginia)</option>
                                    <option>eu-central-1 (Frankfurt)</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Tenant Storage S3 Bucket</label>
                                <input value={infra.bucket} onChange={e => setInfra({ ...infra, bucket: e.target.value })} type="text" style={{ width: '100%', maxWidth: '500px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                                <button onClick={() => handleSave('Infrastructure')} style={{ background: '#10B981', color: 'white', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)' }}>
                                    Save Infrastructure Settings
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'database' && (
                    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', margin: '0 0 4px 0' }}>Database Provisioning</h2>
                            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Configure PostgreSQL multitenancy scaling patterns.</p>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Max Tenants per Database Cluster</label>
                                <input value={db.maxTenants} onChange={e => setDb({ ...db, maxTenants: e.target.value })} type="number" style={{ width: '100%', maxWidth: '300px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Isolation Level</label>
                                <select value={db.isolation} onChange={e => setDb({ ...db, isolation: e.target.value })} style={{ width: '100%', maxWidth: '500px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', background: 'white', boxSizing: 'border-box' }}>
                                    <option>Pool-based (Logical Separation)</option>
                                    <option>Schema-level Separation</option>
                                    <option>Dedicated DB per Tenant (Enterprise Only)</option>
                                </select>
                            </div>
                            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                                <button onClick={() => handleSave('Database')} style={{ background: '#10B981', color: 'white', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)' }}>
                                    Apply Database Rules
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'api' && (
                    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', margin: '0 0 4px 0' }}>API Keys & Webhooks</h2>
                            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Manage global API keys for external services.</p>
                        </div>
                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Stripe Secret Key (Billing)</label>
                                <input value={keys.stripe} onChange={e => setKeys({ ...keys, stripe: e.target.value })} type="password" style={{ width: '100%', maxWidth: '500px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Twilio API Key (SMS)</label>
                                <input value={keys.twilio} onChange={e => setKeys({ ...keys, twilio: e.target.value })} type="password" style={{ width: '100%', maxWidth: '500px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>SendGrid API Key (Email)</label>
                                <input value={keys.sendgrid} onChange={e => setKeys({ ...keys, sendgrid: e.target.value })} type="password" style={{ width: '100%', maxWidth: '500px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }} />
                            </div>
                            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                                <button onClick={() => handleSave('API')} style={{ background: '#10B981', color: 'white', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)' }}>
                                    Rotate & Save Keys
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .settings-layout {
                    display: grid;
                    grid-template-columns: 220px 1fr;
                    gap: 24px;
                    align-items: start;
                }
                .settings-nav {
                    min-width: 0;
                }
                @media (max-width: 768px) {
                    .settings-layout {
                        grid-template-columns: 1fr !important;
                    }
                    .settings-nav {
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;
                        gap: 4px;
                        padding: 8px;
                    }
                    .settings-nav button {
                        flex: none !important;
                        width: auto !important;
                        font-size: 13px !important;
                        padding: 8px 12px !important;
                    }
                }
            `}</style>
        </div>
    );
}
