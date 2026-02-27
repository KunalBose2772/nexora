'use client';

import { Settings, Shield, Server, Bell, Database, Key } from 'lucide-react';

export default function PlatformSettingsPage() {
    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Platform Settings</h1>
                <p style={{ fontSize: '14px', color: '#64748B' }}>Manage global configurations, security policies, and integrations.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }}>
                {/* Nav */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {[
                        { id: 'general', icon: Settings, label: 'General Settings', active: true },
                        { id: 'security', icon: Shield, label: 'Security & Auth', active: false },
                        { id: 'infrastructure', icon: Server, label: 'Infrastructure', active: false },
                        { id: 'database', icon: Database, label: 'Database Provisioning', active: false },
                        { id: 'api', icon: Key, label: 'API Keys', active: false },
                    ].map(item => (
                        <button key={item.id} style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
                            fontSize: '14px', fontWeight: 500, textAlign: 'left',
                            background: item.active ? '#ECFDF5' : 'transparent',
                            color: item.active ? '#047857' : '#64748B',
                            border: 'none', transition: 'all 150ms'
                        }}>
                            <item.icon size={16} />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>General Settings</h2>
                        <p style={{ fontSize: '13px', color: '#64748B' }}>Core application settings and branding.</p>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Platform Name</label>
                            <input type="text" defaultValue="Nexora Health SaaS" style={{ width: '100%', maxWidth: '500px', padding: '10px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Support Email</label>
                            <input type="email" defaultValue="support@globalwebify.com" style={{ width: '100%', maxWidth: '500px', padding: '10px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Platform Default Currency</label>
                            <select style={{ width: '100%', maxWidth: '500px', padding: '10px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', background: 'white' }}>
                                <option>INR (₹)</option>
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                            </select>
                        </div>
                        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px', marginTop: '10px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked style={{ accentColor: '#10B981', width: '16px', height: '16px' }} />
                                <span style={{ fontSize: '14px', fontWeight: 500, color: '#0F172A' }}>Allow Public Signups (Self-Serve)</span>
                            </label>
                            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', marginLeft: '24px' }}>If disabled, tenants can only be provisioned manually by Super Admins.</p>
                        </div>
                        <div>
                            <button style={{
                                background: '#10B981', color: 'white', padding: '10px 20px',
                                borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                                border: 'none', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)'
                            }}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
