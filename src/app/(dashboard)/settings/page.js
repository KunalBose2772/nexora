'use client';
import { useState, useEffect } from 'react';
import { Settings, Shield, Bell, Database, Hospital, Mail, Building2, Save, CheckCircle, Loader2, Globe, IndianRupee } from 'lucide-react';

const TABS = [
    { label: 'Hospital Profile', icon: Hospital, key: 'profile' },
    { label: 'Billing & Currency', icon: IndianRupee, key: 'billing' },
    { label: 'Security & Access', icon: Shield, key: 'security' },
    { label: 'SMTP / Email', icon: Mail, key: 'smtp' },
    { label: 'Backup & Data', icon: Database, key: 'backup' },
];

const inputStyle = { width: '100%', padding: '11px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#fff', fontFamily: 'inherit', boxSizing: 'border-box' };
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '7px' };
const hintStyle = { fontSize: '12px', color: '#94A3B8', margin: '0 0 8px' };

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        name: '', phone: '', address: '', tagline: '', description: '',
        primaryColor: '#10B981', logoInitials: '', logoUrl: '', heroImage: '', mapUrl: '',
        metaTitle: '', metaDescription: '', faviconUrl: '', servicesContent: '',
    });

    const f = (k) => (v) => setForm(prev => ({ ...prev, [k]: v.target ? v.target.value : v }));

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    const t = data.tenant;
                    setTenant(t);
                    setForm({
                        name: t.name || '',
                        phone: t.phone || '',
                        address: t.address || '',
                        tagline: t.tagline || '',
                        description: t.description || '',
                        primaryColor: t.primaryColor || '#10B981',
                        logoInitials: t.logoInitials || '',
                        logoUrl: t.logoUrl || '',
                        heroImage: t.heroImage || '',
                        mapUrl: t.mapUrl || '',
                        metaTitle: t.metaTitle || '',
                        metaDescription: t.metaDescription || '',
                        faviconUrl: t.faviconUrl || '',
                        servicesContent: t.servicesContent || '',
                    });
                }
            } catch (e) { setError('Failed to load settings.'); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true); setSaved(false); setError('');
        try {
            const res = await fetch('/api/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) { setError(e.message); }
        finally { setSaving(false); }
    };

    const SectionCard = ({ title, subtitle, children }) => (
        <div className="card" style={{ padding: 0, marginBottom: '24px' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border-light)' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{title}</h2>
                {subtitle && <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>{subtitle}</p>}
            </div>
            <div style={{ padding: '24px' }}>{children}</div>
        </div>
    );

    const Row = ({ children }) => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            {children}
        </div>
    );

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>System Configuration</h1>
                    <p className="page-header__subtitle">Manage global hospital settings, preferences, billing rules, and integrations.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={() => window.location.reload()}>Discard Changes</button>
                    <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving || loading}>
                        {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : saved ? <CheckCircle size={14} /> : <Save size={14} />}
                        {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Configuration'}
                    </button>
                </div>
            </div>
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

            {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#DC2626', fontSize: '14px' }}>{error}</div>}
            {saved && <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#065F46', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} /> Settings saved successfully!</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', position: 'sticky', top: '24px' }}>
                    {TABS.map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                            borderRadius: '8px', border: 'none', cursor: 'pointer', textAlign: 'left',
                            fontWeight: activeTab === tab.key ? 600 : 500, fontSize: '14px', transition: 'all 0.15s',
                            color: activeTab === tab.key ? 'var(--color-cyan)' : 'var(--color-text-secondary)',
                            background: activeTab === tab.key ? 'rgba(0,194,255,0.1)' : 'transparent',
                        }}>
                            <tab.icon size={17} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div>
                    {loading ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Loading settings…
                        </div>
                    ) : (
                        <>
                            {activeTab === 'profile' && (
                                <>
                                    <SectionCard title="Hospital Identity" subtitle="This information appears on invoices, reports, prescriptions, and your public website.">
                                        <Row>
                                            <div>
                                                <label style={labelStyle}>Hospital / Clinic Name</label>
                                                <input style={inputStyle} type="text" value={form.name} onChange={f('name')} placeholder="Apollo Health Systems" />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Primary Helpline Number</label>
                                                <input style={inputStyle} type="tel" value={form.phone} onChange={f('phone')} placeholder="+91 1800-000-0000" />
                                            </div>
                                        </Row>
                                        <Row>
                                            <div>
                                                <label style={labelStyle}>Tagline</label>
                                                <p style={hintStyle}>Shown as the hero headline on your public website</p>
                                                <input style={inputStyle} type="text" value={form.tagline} onChange={f('tagline')} placeholder="Your Health, Our Priority" />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Admin Email</label>
                                                <p style={hintStyle}>Read-only — contact support to change</p>
                                                <input style={{ ...inputStyle, background: '#F8FAFC', color: '#94A3B8' }} type="email" value={tenant?.adminEmail || ''} disabled />
                                            </div>
                                        </Row>
                                        <div style={{ marginBottom: '20px' }}>
                                            <label style={labelStyle}>Registered Address</label>
                                            <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' }} value={form.address} onChange={f('address')} placeholder="123 Health Avenue, Medical District, Mumbai - 400001" />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>About Your Hospital</label>
                                            <p style={hintStyle}>2–3 sentences shown in the hero section and footer of your public website</p>
                                            <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.description} onChange={f('description')} placeholder="Describe your hospital — specialities, experience, accreditations…" />
                                        </div>
                                    </SectionCard>

                                    <SectionCard title="Branding & Appearance" subtitle="Configure your brand color, logo initials, and image URLs for the public website.">
                                        <Row>
                                            <div>
                                                <label style={labelStyle}>Brand / Primary Color</label>
                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                    <input type="color" value={form.primaryColor} onChange={f('primaryColor')} style={{ width: '48px', height: '44px', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', padding: '3px' }} />
                                                    <input type="text" value={form.primaryColor} onChange={f('primaryColor')} style={{ ...inputStyle, fontFamily: 'monospace', letterSpacing: '0.04em' }} />
                                                </div>
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Logo Initials (fallback)</label>
                                                <p style={hintStyle}>Used when no logo URL is set</p>
                                                <input type="text" maxLength={3} value={form.logoInitials} onChange={e => setForm(p => ({ ...p, logoInitials: e.target.value.toUpperCase() }))}
                                                    style={{ ...inputStyle, letterSpacing: '0.12em', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center', fontSize: '16px' }} placeholder="NH" />
                                            </div>
                                        </Row>
                                        <Row>
                                            <div>
                                                <label style={labelStyle}>Logo Image URL</label>
                                                <p style={hintStyle}>Direct URL to PNG, SVG, or WebP</p>
                                                <input type="url" style={inputStyle} value={form.logoUrl} onChange={f('logoUrl')} placeholder="https://example.com/logo.png" />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Hero Background Image URL</label>
                                                <p style={hintStyle}>1920×1080 recommended. Uses gradient if empty.</p>
                                                <input type="url" style={inputStyle} value={form.heroImage} onChange={f('heroImage')} placeholder="https://example.com/hero.jpg" />
                                            </div>
                                        </Row>
                                        <Row>
                                            <div>
                                                <label style={labelStyle}>Map iframe src URL</label>
                                                <p style={hintStyle}>Google Maps Embed src URL (e.g. https://www.google.com/maps/embed?...)</p>
                                                <input type="url" style={inputStyle} value={form.mapUrl} onChange={f('mapUrl')} placeholder="https://www.google.com/maps/embed?..." />
                                            </div>
                                        </Row>

                                        {/* Live preview strip */}
                                        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `linear-gradient(135deg, ${form.primaryColor}, ${form.primaryColor}cc)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                {form.logoUrl
                                                    ? <img src={form.logoUrl} alt="logo" style={{ height: '34px', maxWidth: '44px', objectFit: 'contain', borderRadius: '6px' }} onError={e => e.currentTarget.style.display = 'none'} />
                                                    : <span style={{ color: '#fff', fontWeight: 900, fontSize: '13px' }}>{form.logoInitials || form.name?.substring(0, 2).toUpperCase() || 'NH'}</span>}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '15px' }}>{form.name || 'Hospital Name'}</div>
                                                <div style={{ fontSize: '12px', color: '#94A3B8' }}>{form.tagline || 'Your Health, Our Priority'}</div>
                                            </div>
                                            <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#94A3B8' }}>Live Preview</div>
                                        </div>
                                    </SectionCard>

                                    <SectionCard title="SEO, Meta & Services" subtitle="Configure page titles, descriptions, favicon and services displayed on the public landing page.">
                                        <Row>
                                            <div>
                                                <label style={labelStyle}>Meta Title</label>
                                                <p style={hintStyle}>Browser tab title (SEO)</p>
                                                <input type="text" style={inputStyle} value={form.metaTitle} onChange={f('metaTitle')} placeholder="Apollo Hospital - Your Health Priority" />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Favicon URL</label>
                                                <p style={hintStyle}>Direct URL to .ico or .png file</p>
                                                <input type="url" style={inputStyle} value={form.faviconUrl} onChange={f('faviconUrl')} placeholder="https://example.com/favicon.png" />
                                            </div>
                                        </Row>
                                        <div style={{ marginBottom: '20px' }}>
                                            <label style={labelStyle}>Meta Description</label>
                                            <p style={hintStyle}>Short description for search engines</p>
                                            <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' }} value={form.metaDescription} onChange={f('metaDescription')} placeholder="Best hospital providing 24x7 emergency and top doctors..." />
                                        </div>
                                        <div style={{ marginBottom: '20px' }}>
                                            <label style={labelStyle}>Services / Departments List</label>
                                            <p style={hintStyle}>Comma-separated list of services provided. e.g. Cardiology, Neurology, Pediatrics</p>
                                            <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.servicesContent} onChange={f('servicesContent')} placeholder="Cardiology, Neurology, Pediatrics, Orthopedics..." />
                                        </div>
                                    </SectionCard>

                                    {/* Read-only plan info */}
                                    <SectionCard title="Subscription & Plan" subtitle="Managed by Nexora Health. Contact support to upgrade.">
                                        <Row>
                                            <div>
                                                <label style={labelStyle}>Current Plan</label>
                                                <input style={{ ...inputStyle, background: '#F8FAFC', color: '#94A3B8', fontWeight: 600 }} value={tenant?.plan || '—'} disabled />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Tenant Code</label>
                                                <input style={{ ...inputStyle, background: '#F8FAFC', color: '#94A3B8', fontFamily: 'monospace' }} value={tenant?.tenantCode || '—'} disabled />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Hospital Slug (URL)</label>
                                                <input style={{ ...inputStyle, background: '#F8FAFC', color: '#94A3B8', fontFamily: 'monospace' }} value={tenant?.slug ? `/${tenant.slug}` : '—'} disabled />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Account Status</label>
                                                <input style={{ ...inputStyle, background: '#F8FAFC', color: tenant?.status === 'Active' ? '#16A34A' : '#DC2626', fontWeight: 600 }} value={tenant?.status || '—'} disabled />
                                            </div>
                                        </Row>
                                    </SectionCard>
                                </>
                            )}

                            {activeTab === 'billing' && (
                                <SectionCard title="Billing & Currency" subtitle="Configure billing defaults, tax settings, and currency preferences.">
                                    <Row>
                                        <div>
                                            <label style={labelStyle}>Default Currency</label>
                                            <select style={{ ...inputStyle, cursor: 'pointer' }}>
                                                <option>INR (₹) Indian Rupee</option>
                                                <option>USD ($) US Dollar</option>
                                                <option>GBP (£) British Pound</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>GST / Tax Rate (%)</label>
                                            <input style={inputStyle} type="number" defaultValue="5" min="0" max="100" />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Default Payment Method</label>
                                            <select style={{ ...inputStyle, cursor: 'pointer' }}>
                                                <option>Cash</option>
                                                <option>UPI</option>
                                                <option>Credit Card</option>
                                                <option>TPA / Insurance</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Invoice Prefix</label>
                                            <input style={inputStyle} type="text" defaultValue="INV" placeholder="INV" />
                                        </div>
                                    </Row>
                                    <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '14px 18px', fontSize: '13px', color: '#1E40AF' }}>
                                        ℹ️ Tax rate changes apply to new invoices only. Existing invoices are not retroactively updated.
                                    </div>
                                </SectionCard>
                            )}

                            {activeTab === 'security' && (
                                <SectionCard title="Security & Access Control" subtitle="Configure password policies, session timeout, and access restrictions.">
                                    <Row>
                                        <div>
                                            <label style={labelStyle}>Session Timeout (minutes)</label>
                                            <input style={inputStyle} type="number" defaultValue="60" min="5" />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Minimum Password Length</label>
                                            <input style={inputStyle} type="number" defaultValue="8" min="6" />
                                        </div>
                                    </Row>
                                    <Row>
                                        {[
                                            { label: 'Require uppercase in passwords', defaultChecked: true },
                                            { label: 'Require special character in passwords', defaultChecked: true },
                                            { label: 'Enable two-factor authentication (2FA)', defaultChecked: false },
                                            { label: 'Lock account after 5 failed login attempts', defaultChecked: true },
                                        ].map(item => (
                                            <label key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: 'var(--color-text-primary)' }}>
                                                <input type="checkbox" defaultChecked={item.defaultChecked} style={{ width: '16px', height: '16px', accentColor: 'var(--color-cyan)' }} />
                                                {item.label}
                                            </label>
                                        ))}
                                    </Row>
                                </SectionCard>
                            )}

                            {activeTab === 'smtp' && (
                                <SectionCard title="SMTP / Email Configuration" subtitle="Configure outbound email for reports, notifications, and receipts.">
                                    <Row>
                                        <div>
                                            <label style={labelStyle}>SMTP Host</label>
                                            <input style={inputStyle} type="text" placeholder="smtp.gmail.com" />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>SMTP Port</label>
                                            <input style={inputStyle} type="number" placeholder="587" />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>SMTP Username / Email</label>
                                            <input style={inputStyle} type="email" placeholder="notifications@yourhospital.com" />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>SMTP Password</label>
                                            <input style={inputStyle} type="password" placeholder="App password or SMTP key" />
                                        </div>
                                    </Row>
                                    <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '14px 18px', fontSize: '13px', color: '#92400E' }}>
                                        ⚠️ Use app-specific passwords with Gmail. Never use your main Google account password here.
                                    </div>
                                </SectionCard>
                            )}

                            {activeTab === 'backup' && (
                                <SectionCard title="Backup & Data Management" subtitle="Export your hospital data or restore from a previous backup.">
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                        {[
                                            { label: 'Export Patient Records', desc: 'All patient data as CSV', icon: '📋' },
                                            { label: 'Export Appointment History', desc: 'All appointments as CSV', icon: '📅' },
                                            { label: 'Export Pharmacy Inventory', desc: 'Medicine stock as CSV', icon: '💊' },
                                            { label: 'Export Billing Records', desc: 'All invoices as CSV', icon: '🧾' },
                                        ].map(item => (
                                            <div key={item.label} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'all 0.15s' }}
                                                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--color-cyan)'; e.currentTarget.style.background = '#F0FDFF'; }}
                                                onMouseOut={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#fff'; }}>
                                                <div style={{ fontSize: '24px' }}>{item.icon}</div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-navy)' }}>{item.label}</div>
                                                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>{item.desc}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '14px 18px', fontSize: '13px', color: '#991B1B' }}>
                                        🔴 Data deletion is irreversible. Contact Nexora Health support before performing any destructive operations.
                                    </div>
                                </SectionCard>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
