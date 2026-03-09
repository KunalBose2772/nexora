'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Palette, Globe, Image as ImageIcon, Save, CheckCircle,
    ImagePlus, Link2, Loader2, ExternalLink, Eye, RefreshCw, Upload
} from 'lucide-react';

export default function BrandingPage() {
    const router = useRouter();
    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    const [logoUploading, setLogoUploading] = useState(false);
    const [heroUploading, setHeroUploading] = useState(false);

    const [form, setForm] = useState({
        name: '', tagline: '', description: '',
        phone: '', address: '',
        primaryColor: '#10B981',
        logoInitials: '', logoUrl: '', heroImage: '',
        mapUrl: '', metaTitle: '', metaDescription: '', faviconUrl: '', servicesContent: '',
    });

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const meRes = await fetch('/api/auth/me');
            if (!meRes.ok) { router.replace('/login'); return; }
            const { user } = await meRes.json();
            if (!user.tenantId) { setError('Super admin accounts do not have a public hospital page.'); setLoading(false); return; }
            const tRes = await fetch(`/api/tenants/${user.tenantId}`);
            if (!tRes.ok) throw new Error('Could not load tenant');
            const { tenant: t } = await tRes.json();
            setTenant(t);
            setForm({
                name: t.name || '',
                tagline: t.tagline || '',
                description: t.description || '',
                phone: t.phone || '',
                address: t.address || '',
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
        } catch (e) {
            setError('Could not load branding settings.');
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => { load(); }, [load]);

    const handleUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        if (type === 'logo') setLogoUploading(true);
        else setHeroUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.ok) {
                if (type === 'logo') setForm(f => ({ ...f, logoUrl: data.url }));
                else setForm(f => ({ ...f, heroImage: data.url }));
            } else {
                alert(data.error || 'Upload failed');
            }
        } catch (err) {
            alert('Upload error');
        } finally {
            if (type === 'logo') setLogoUploading(false);
            else setHeroUploading(false);
        }
    };

    const handleSave = async () => {
        if (!tenant) return;
        setSaving(true); setSaved(false); setError('');
        try {
            const res = await fetch(`/api/tenants/${tenant.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
            setSaved(true);
            setTimeout(() => setSaved(false), 3500);
        } catch (e) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    };

    const accent = form.primaryColor || '#10B981';

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px', gap: '12px', color: '#94A3B8', fontSize: '14px' }}>
            <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            Loading branding settings…
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#FFFFFF', boxSizing: 'border-box', fontFamily: 'inherit' };
    const Field = ({ label, hint, children, full }) => (
        <div style={{ gridColumn: full ? '1/-1' : 'auto', marginBottom: '4px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: hint ? '4px' : '7px' }}>{label}</label>
            {hint && <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 8px' }}>{hint}</p>}
            {children}
        </div>
    );

    return (
        <div className="fade-in" style={{ maxWidth: '920px' }}>
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', letterSpacing: '-0.02em' }}>Website Branding</h1>
                    <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>Configure your public hospital website — hero, logo, colour, and contact details.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {tenant && (
                        <a href={`/${tenant.slug}`} target="_blank" rel="noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 16px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#475569', textDecoration: 'none' }}>
                            <Eye size={14} /> Preview Site
                        </a>
                    )}
                    <button onClick={handleSave} disabled={saving}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', background: saved ? '#10B981' : accent, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: `0 4px 14px ${accent}40`, transition: 'background 0.2s' }}>
                        {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : saved ? <CheckCircle size={15} /> : <Save size={15} />}
                        {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#DC2626', fontSize: '14px' }}>{error}</div>
            )}
            {saved && (
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#065F46', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={16} /> Changes saved! Your public website will reflect the updates shortly.
                </div>
            )}

            <div style={{ display: 'grid', gap: '20px' }}>

                {/* ── General Info Card ── */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ padding: '18px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: `${accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Globe size={16} style={{ color: accent }} />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>Hospital Information</h2>
                            <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>Shown on your public website, invoices, and reports.</p>
                        </div>
                    </div>
                    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>
                        <Field label="Hospital Name">
                            <input style={inputStyle} type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Apollo Health Systems" />
                        </Field>
                        <Field label="Phone / Helpline">
                            <input style={inputStyle} type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
                        </Field>
                        <Field label="Tagline" hint="Shown as the main headline in the hero section">
                            <input style={inputStyle} type="text" value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} placeholder="Your Health, Our Priority" />
                        </Field>
                        <Field label="Admin Email (read-only)">
                            <input style={{ ...inputStyle, background: '#F8FAFC', color: '#94A3B8' }} type="email" value={tenant?.adminEmail || ''} disabled />
                        </Field>
                        <Field label="Address / Location" full>
                            <input style={inputStyle} type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="123 Medical Lane, Mumbai, Maharashtra - 400001" />
                        </Field>
                        <Field label="About Your Hospital" hint="Shown in the hero section and footer (2–3 sentences)" full>
                            <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                placeholder="Describe your hospital — specialities, experience, accreditations…"
                                style={{ ...inputStyle, resize: 'vertical' }} />
                        </Field>
                    </div>
                </div>

                {/* ── Branding Card ── */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ padding: '18px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: `${accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Palette size={16} style={{ color: accent }} />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>Colours & Logo</h2>
                            <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>Brand colour is applied site-wide automatically.</p>
                        </div>
                    </div>
                    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px 28px' }}>
                        <Field label="Brand / Primary Colour">
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input type="color" value={form.primaryColor} onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                                    style={{ width: '46px', height: '42px', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', padding: '3px', boxSizing: 'border-box' }} />
                                <input type="text" value={form.primaryColor} onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                                    style={{ flex: 1, padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontFamily: 'monospace', outline: 'none', letterSpacing: '0.04em' }} />
                            </div>
                        </Field>
                        <Field label="Logo Initials" hint="Fallback when no logo URL is provided">
                            <input type="text" value={form.logoInitials} maxLength={3} onChange={e => setForm(f => ({ ...f, logoInitials: e.target.value.toUpperCase() }))}
                                style={{ ...inputStyle, letterSpacing: '0.1em', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center', fontSize: '16px' }}
                                placeholder="AH" />
                        </Field>
                        <Field label="Live Preview">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#F8FAFC', minHeight: '44px' }}>
                                {form.logoUrl ? (
                                    <img src={form.logoUrl} alt="logo" style={{ height: '32px', width: 'auto', maxWidth: '90px', objectFit: 'contain', borderRadius: '4px' }} onError={e => e.currentTarget.style.display = 'none'} />
                                ) : (
                                    <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 3px 10px ${accent}40` }}>
                                        <span style={{ color: '#fff', fontWeight: 900, fontSize: '11px' }}>{form.logoInitials || form.name?.substring(0, 2).toUpperCase() || 'NH'}</span>
                                    </div>
                                )}
                                <div>
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'block', lineHeight: 1.2 }}>{form.name || 'Hospital Name'}</span>
                                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>Powered by Nexora Health</span>
                                </div>
                            </div>
                        </Field>
                    </div>
                </div>

                {/* ── Images Card ── */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ padding: '18px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: `${accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ImageIcon size={16} style={{ color: accent }} />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>Images & Media</h2>
                            <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>Paste public image URLs — no file upload needed.</p>
                        </div>
                    </div>
                    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
                        {/* Logo URL */}
                        <div>
                            <Field label="Logo Image URL or Upload" hint="Direct URL to PNG, SVG, or WebP. Leave empty to use initials placeholder.">
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <Link2 size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
                                        <input type="url" value={form.logoUrl} onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value }))}
                                            placeholder="https://example.com/logo.png"
                                            style={{ ...inputStyle, paddingLeft: '36px' }} />
                                    </div>
                                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0 16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }} onMouseEnter={e => { e.currentTarget.style.background = '#E2E8F0'; }} onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; }}>
                                        {logoUploading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={16} />}
                                        {logoUploading ? 'Uploading...' : 'Upload File'}
                                        <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'logo')} style={{ display: 'none' }} disabled={logoUploading} />
                                    </label>
                                    {form.logoUrl && (
                                        <a href={form.logoUrl} target="_blank" rel="noreferrer"
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#64748B', flexShrink: 0, textDecoration: 'none' }}>
                                            <ExternalLink size={14} />
                                        </a>
                                    )}
                                </div>
                            </Field>
                            <div style={{ border: '2px dashed #E2E8F0', borderRadius: '12px', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA', marginTop: '4px' }}>
                                {form.logoUrl ? (
                                    <img src={form.logoUrl} alt="Logo preview" style={{ maxHeight: '72px', maxWidth: '200px', objectFit: 'contain', borderRadius: '6px' }}
                                        onError={e => e.currentTarget.parentElement.innerHTML = '<p style="font-size:12px;color:#94A3B8;text-align:center;padding:16px;">⚠️ Could not load image. Check the URL.</p>'} />
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '16px' }}>
                                        <ImagePlus size={22} style={{ color: '#CBD5E1', marginBottom: '8px' }} />
                                        <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>Paste a logo URL above</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hero Image URL */}
                        <div>
                            <Field label="Hero Background Image URL or Upload" hint="Landscape image, 1920×1080 recommended. If empty, a gradient is used automatically.">
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <Link2 size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
                                        <input type="url" value={form.heroImage} onChange={e => setForm(f => ({ ...f, heroImage: e.target.value }))}
                                            placeholder="https://example.com/hospital-hero.jpg"
                                            style={{ ...inputStyle, paddingLeft: '36px' }} />
                                    </div>
                                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0 16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#475569', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }} onMouseEnter={e => { e.currentTarget.style.background = '#E2E8F0'; }} onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; }}>
                                        {heroUploading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={16} />}
                                        {heroUploading ? 'Uploading...' : 'Upload File'}
                                        <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'hero')} style={{ display: 'none' }} disabled={heroUploading} />
                                    </label>
                                    {form.heroImage && (
                                        <a href={form.heroImage} target="_blank" rel="noreferrer"
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#64748B', flexShrink: 0, textDecoration: 'none' }}>
                                            <ExternalLink size={14} />
                                        </a>
                                    )}
                                </div>
                            </Field>
                            <div style={{ border: '2px dashed #E2E8F0', borderRadius: '12px', overflow: 'hidden', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA', marginTop: '4px' }}>
                                {form.heroImage ? (
                                    <img src={form.heroImage} alt="Hero preview" style={{ width: '100%', height: '130px', objectFit: 'cover' }}
                                        onError={e => e.currentTarget.parentElement.innerHTML = '<p style="font-size:12px;color:#94A3B8;text-align:center;padding:16px;">⚠️ Could not load image. Check the URL.</p>'} />
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '16px' }}>
                                        <ImagePlus size={22} style={{ color: '#CBD5E1', marginBottom: '8px' }} />
                                        <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>Paste a hero image URL above</p>
                                        <p style={{ fontSize: '11px', color: '#CBD5E1', margin: '4px 0 0' }}>Gradient is shown if empty</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div style={{ margin: '0 24px 24px', background: `${accent}08`, border: `1px solid ${accent}20`, borderRadius: '10px', padding: '14px 18px' }}>
                        <p style={{ fontSize: '12.5px', color: '#475569', margin: 0, lineHeight: 1.7 }}>
                            <strong>💡 Free image hosting:</strong>{' '}
                            Upload your image to <a href="https://imgbb.com" target="_blank" rel="noreferrer" style={{ color: accent, fontWeight: 600 }}>imgbb.com</a> or{' '}
                            <a href="https://cloudinary.com" target="_blank" rel="noreferrer" style={{ color: accent, fontWeight: 600 }}>Cloudinary</a> (free tier),
                            then paste the <strong>direct image URL</strong> here. For logos, use a transparent PNG or SVG for best results.
                        </p>
                    </div>
                </div>

                {/* ── SEO, Meta & Services Card ── */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ padding: '18px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: `${accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Globe size={16} style={{ color: accent }} />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>SEO, Meta & Services</h2>
                            <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>Configure search indexing and the services displayed to patients.</p>
                        </div>
                    </div>
                    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>
                        <Field label="Meta Title" hint="Browser tab title (SEO)">
                            <input style={inputStyle} type="text" value={form.metaTitle} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))} placeholder={`${form.name || 'Hospital'} - Your Health Priority`} />
                        </Field>
                        <Field label="Favicon URL" hint="Direct URL to .ico or .png file">
                            <input style={inputStyle} type="url" value={form.faviconUrl} onChange={e => setForm(f => ({ ...f, faviconUrl: e.target.value }))} placeholder="https://example.com/favicon.png" />
                        </Field>
                        <Field label="Meta Description" hint="Short description for search engines" full>
                            <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' }} value={form.metaDescription} onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))} placeholder="Best hospital providing 24x7 emergency and top doctors..." />
                        </Field>
                        <Field label="Services / Departments List" hint="Comma-separated list. e.g. Cardiology, Neurology, Pediatrics" full>
                            <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.servicesContent} onChange={e => setForm(f => ({ ...f, servicesContent: e.target.value }))} placeholder="Cardiology, Neurology, Pediatrics, Orthopedics..." />
                        </Field>
                        <Field label="Map iframe src URL" hint="Google Maps Embed URL" full>
                            <input style={inputStyle} type="url" value={form.mapUrl} onChange={e => setForm(f => ({ ...f, mapUrl: e.target.value }))} placeholder="https://www.google.com/maps/embed?..." />
                        </Field>
                    </div>
                </div>

                {/* Bottom Save */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '24px', gap: '12px' }}>
                    <button onClick={load}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '11px 18px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                        <RefreshCw size={14} /> Discard Changes
                    </button>
                    <button onClick={handleSave} disabled={saving}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: saved ? '#10B981' : accent, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: `0 4px 14px ${accent}40` }}>
                        {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
                        {saving ? 'Saving…' : saved ? 'Saved Successfully!' : 'Save All Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
