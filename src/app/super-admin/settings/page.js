'use client';
import { useState } from 'react';
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
                                <input type="text" defaultValue="Nexora Health SaaS" style={{ width: '100%', maxWidth: '500px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Support Email</label>
                                <input type="email" defaultValue="support@globalwebify.com" style={{ width: '100%', maxWidth: '500px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Platform Default Currency</label>
                                <select style={{ width: '100%', maxWidth: '500px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', background: 'white', boxSizing: 'border-box' }}>
                                    <option>INR (₹)</option>
                                    <option>USD ($)</option>
                                    <option>EUR (€)</option>
                                </select>
                            </div>
                            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input type="checkbox" defaultChecked style={{ accentColor: '#10B981', width: '16px', height: '16px' }} />
                                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#0F172A' }}>Allow Public Signups (Self-Serve)</span>
                                </label>
                                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', marginLeft: '24px' }}>If disabled, tenants can only be provisioned manually by Super Admins.</p>
                            </div>
                            <div>
                                <button style={{ background: '#10B981', color: 'white', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)' }}>
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
                                    <input type="checkbox" defaultChecked style={{ accentColor: '#10B981', width: '16px', height: '16px' }} />
                                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#0F172A' }}>Enforce MFA for all Super Admins</span>
                                </label>
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input type="checkbox" defaultChecked style={{ accentColor: '#10B981', width: '16px', height: '16px' }} />
                                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#0F172A' }}>Enforce strict password complexity</span>
                                </label>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Session Timeout (Minutes)</label>
                                <input type="number" defaultValue="60" style={{ width: '100%', maxWidth: '300px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                                <button style={{ background: '#10B981', color: 'white', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)' }}>
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
                                <select style={{ width: '100%', maxWidth: '500px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', background: 'white', boxSizing: 'border-box' }}>
                                    <option>ap-south-1 (Mumbai)</option>
                                    <option>us-east-1 (N. Virginia)</option>
                                    <option>eu-central-1 (Frankfurt)</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Tenant Storage S3 Bucket</label>
                                <input type="text" defaultValue="nexora-tenant-storage-prod-ap-south" style={{ width: '100%', maxWidth: '500px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                                <button style={{ background: '#10B981', color: 'white', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)' }}>
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
                                <input type="number" defaultValue="250" style={{ width: '100%', maxWidth: '300px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Isolation Level</label>
                                <select style={{ width: '100%', maxWidth: '500px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', background: 'white', boxSizing: 'border-box' }}>
                                    <option>Pool-based (Logical Separation)</option>
                                    <option>Schema-level Separation</option>
                                    <option>Dedicated DB per Tenant (Enterprise Only)</option>
                                </select>
                            </div>
                            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                                <button style={{ background: '#10B981', color: 'white', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)' }}>
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
                                <input type="password" defaultValue="sk_live_123456789" style={{ width: '100%', maxWidth: '500px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Twilio API Key (SMS)</label>
                                <input type="password" defaultValue="AC123xyz" style={{ width: '100%', maxWidth: '500px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>SendGrid API Key (Email)</label>
                                <input type="password" defaultValue="SG.xyz.123" style={{ width: '100%', maxWidth: '500px', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }} />
                            </div>
                            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                                <button style={{ background: '#10B981', color: 'white', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)' }}>
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
