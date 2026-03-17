'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Palette, Globe, Image as ImageIcon, Save, CheckCircle,
    ImagePlus, Link2, Loader2, ExternalLink, Eye, RefreshCw, Upload,
    Type, MousePointer2, Smartphone, Monitor, ShieldCheck, Zap, Activity
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
    const [viewMode, setViewMode] = useState('desktop');

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
                secondaryColor: t.secondaryColor || '#071220',
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

    const [form, setForm] = useState({
        name: '', tagline: '', description: '',
        phone: '', address: '',
        primaryColor: '#10B981',
        secondaryColor: '#071220',
        logoInitials: '', logoUrl: '', heroImage: '',
        mapUrl: '', metaTitle: '', metaDescription: '', faviconUrl: '', servicesContent: '',
    });

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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px', gap: '16px', color: '#94A3B8', fontSize: '14px' }}>
            <Loader2 size={32} className="animate-spin" />
            <p className="font-bold tracking-widest uppercase text-[10px]">Synchronizing Identity</p>
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    const inputStyle = { width: '100%', padding: '11px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#FFFFFF', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'all 0.2s' };
    const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 800, color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' };
    
    const SectionCard = ({ icon: Icon, title, subtitle, children, color = '#3B82F6' }) => (
        <div className="card" style={{ padding: 0, marginBottom: '24px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', background: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} />
                </div>
                <div>
                    <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-navy)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{title}</h2>
                    {subtitle && <p style={{ fontSize: '11px', color: '#94A3B8', margin: '2px 0 0 0', fontWeight: 600, textTransform: 'uppercase' }}>{subtitle}</p>}
                </div>
            </div>
            <div style={{ padding: '28px' }}>{children}</div>
        </div>
    );

    return (
        <div className="fade-in" style={{ maxWidth: '1200px' }}>
            <style>{`
                @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
                .input-hover:focus { border-color: ${accent} !important; box-shadow: 0 0 0 4px ${accent}15 !important; }
            `}</style>

            {/* Header */}
            <div className="dashboard-header-row">
                <div>
                    <h1 className="responsive-h1">Website Branding & Identity</h1>
                    <p className="page-header__subtitle">Manage your public portal, patient interface aesthetics, and discovery metadata.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <div style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '10px', gap: '4px', marginRight: '16px' }}>
                        <button onClick={() => setViewMode('desktop')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: viewMode === 'desktop' ? '#fff' : 'transparent', color: viewMode === 'desktop' ? 'var(--color-navy)' : '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, boxShadow: viewMode === 'desktop' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
                            <Monitor size={14} /> Desktop
                        </button>
                        <button onClick={() => setViewMode('mobile')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: viewMode === 'mobile' ? '#fff' : 'transparent', color: viewMode === 'mobile' ? 'var(--color-navy)' : '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, boxShadow: viewMode === 'mobile' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
                            <Smartphone size={14} /> Mobile
                        </button>
                    </div>
                    {tenant && (
                        <a href={`/${tenant.slug}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                            <Eye size={14} /> Preview Site
                        </a>
                    )}
                    <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving} style={{ background: accent, borderColor: accent, boxShadow: `0 4px 12px ${accent}33` }}>
                        {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : <Save size={14} />}
                        {saving ? 'Publishing...' : saved ? 'Published!' : 'Publish Changes'}
                    </button>
                </div>
            </div>

            {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '14px 18px', marginBottom: '24px', color: '#DC2626', fontSize: '14px', fontWeight: 600 }}>{error}</div>}
            
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '24px', alignItems: 'start' }}>
                
                {/* Editor Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    
                    <SectionCard icon={Globe} title="Hospital Identity" subtitle="Core Information for Public Display" color="#3B82F6">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Hospital Name</label>
                                <input className="input-hover" style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nexora Health Systems" />
                            </div>
                            <div>
                                <label style={labelStyle}>Helpline / Phone</label>
                                <input className="input-hover" style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 80 4000 8000" />
                            </div>
                            <div>
                                <label style={labelStyle}>Admin Email</label>
                                <input style={{ ...inputStyle, background: '#F8FAFC', color: '#94A3B8' }} value={tenant?.adminEmail || ''} disabled />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Catchy Tagline</label>
                                <input className="input-hover" style={inputStyle} value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} placeholder="Providing Care with Excellence" />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>About / Description</label>
                                <textarea className="input-hover" style={{ ...inputStyle, height: '80px', resize: 'none' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Briefly describe your services..." />
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard icon={Palette} title="Aesthetics & Branding" subtitle="Colors, Logos and Visual Theme" color="#8B5CF6">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>Primary Accent Color</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input type="color" value={form.primaryColor} onChange={e => setForm({ ...form, primaryColor: e.target.value })} style={{ width: '44px', height: '44px', padding: '4px', border: '1px solid #E2E8F0', borderRadius: '10px', background: '#fff', cursor: 'pointer' }} />
                                    <input className="input-hover" style={{ ...inputStyle, fontFamily: 'monospace' }} value={form.primaryColor} onChange={e => setForm({ ...form, primaryColor: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Logo Initials</label>
                                <input className="input-hover" style={{ ...inputStyle, textAlign: 'center', fontWeight: 900, letterSpacing: '0.1em' }} maxLength={3} value={form.logoInitials} onChange={e => setForm({ ...form, logoInitials: e.target.value.toUpperCase() })} placeholder="NH" />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Logo Image URL</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input className="input-hover" style={inputStyle} value={form.logoUrl} onChange={e => setForm({ ...form, logoUrl: e.target.value })} placeholder="https://cdn.example.com/logo.png" />
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                                        {logoUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                        <input type="file" onChange={e => handleUpload(e, 'logo')} style={{ display: 'none' }} disabled={logoUploading} />
                                    </label>
                                </div>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Hero Cinematic Image URL</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input className="input-hover" style={inputStyle} value={form.heroImage} onChange={e => setForm({ ...form, heroImage: e.target.value })} placeholder="https://cdn.example.com/hero.jpg" />
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                                        {heroUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                        <input type="file" onChange={e => handleUpload(e, 'hero')} style={{ display: 'none' }} disabled={heroUploading} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard icon={ShieldCheck} title="SEO & Metadata" subtitle="Search Engine Optimization & Social Links" color="#10B981">
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>Page Meta Title</label>
                                <input className="input-hover" style={inputStyle} value={form.metaTitle} onChange={e => setForm({ ...form, metaTitle: e.target.value })} placeholder="Nexora Health - Best Multispeciality Hospital" />
                            </div>
                            <div>
                                <label style={labelStyle}>SEO Meta Description</label>
                                <textarea className="input-hover" style={{ ...inputStyle, height: '60px', resize: 'none' }} value={form.metaDescription} onChange={e => setForm({ ...form, metaDescription: e.target.value })} placeholder="Provide a summary for Google search results..." />
                            </div>
                            <div>
                                <label style={labelStyle}>Map Embed URL (iframe src)</label>
                                <input className="input-hover" style={inputStyle} value={form.mapUrl} onChange={e => setForm({ ...form, mapUrl: e.target.value })} placeholder="Google Maps embed URL..." />
                            </div>
                            <div>
                                <label style={labelStyle}>Clinical Specialties (Comma Separated)</label>
                                <textarea className="input-hover" style={{ ...inputStyle, height: '60px', resize: 'none', fontFamily: 'monospace', fontSize: '12px' }} value={form.servicesContent} onChange={e => setForm({ ...form, servicesContent: e.target.value })} placeholder="Cardiology, Neurology, Pediatrics..." />
                            </div>
                        </div>
                    </SectionCard>
                </div>

                {/* Preview Panel */}
                <div style={{ position: 'sticky', top: '24px' }}>
                    <div className={`preview-container ${viewMode}`} style={{ 
                        width: viewMode === 'mobile' ? '360px' : '100%', 
                        margin: viewMode === 'mobile' ? '0 auto' : '0',
                        height: '760px',
                        background: '#fff',
                        borderRadius: '32px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(10, 46, 77, 0.25)',
                        border: '10px solid #1E293B',
                        position: 'relative'
                    }}>
                        {/* Status bar for mobile */}
                        {viewMode === 'mobile' && (
                            <div className="h-6 bg-slate-900 flex justify-between px-8 pt-2">
                                <span className="text-[10px] text-white font-bold">9:41</span>
                                <div className="flex gap-1.5 items-center">
                                    <div className="w-3.5 h-2 bg-white rounded-sm" />
                                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                                </div>
                            </div>
                        )}

                        <div className="h-full overflow-y-auto bg-white custom-scrollbar">
                            {/* In-Mock Header */}
                            <nav className="px-6 py-4 flex items-center justify-between border-b border-slate-50 sticky top-0 bg-white/90 backdrop-blur-md z-20">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs" style={{ background: accent }}>
                                        {form.logoUrl ? <img src={form.logoUrl} className="w-full h-full object-contain" /> : (form.logoInitials || tenant?.name?.[0] || 'N')}
                                    </div>
                                    <span className="font-extrabold text-[#0F172A] tracking-tighter text-sm uppercase">{form.name || tenant?.name || 'Nexora Hospital'}</span>
                                </div>
                                <button className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg" style={{ background: accent }}>Portal</button>
                            </nav>

                            {/* Hero Section */}
                            <div className="relative py-20 px-8 text-center overflow-hidden">
                                {form.heroImage && (
                                    <div className="absolute inset-0 z-0 scale-110 blur-[1px]">
                                        <img src={form.heroImage} className="w-full h-full object-cover opacity-20" />
                                        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
                                    </div>
                                )}
                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full mb-6 border border-slate-100">
                                        <Zap size={10} className="text-yellow-500 fill-yellow-500" />
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Healthcare Evolution</span>
                                    </div>
                                    <h1 className="text-3xl font-black text-[#0F172A] leading-tight mb-4" style={{ letterSpacing: '-0.03em' }}>
                                        {form.tagline || 'Leading the Future of Clinical Excellence'}
                                    </h1>
                                    <p className="text-slate-500 text-xs leading-relaxed mb-8 px-4 opacity-70">
                                        {form.description || 'Global standards of healthcare met with state-of-the-art infrastructure.'}
                                    </p>
                                    <div className="flex flex-col gap-3 px-10">
                                        <button className="py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl" style={{ background: accent, boxShadow: `0 10px 20px ${accent}25` }}>Book Appointment</button>
                                        <button className="py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-100">Explore Services</button>
                                    </div>
                                </div>
                            </div>

                            {/* Services Preview */}
                            <div className="py-12 px-6 bg-slate-50/50">
                                <div className="text-center mb-8">
                                    <h2 className="text-lg font-black text-[#0F172A] uppercase tracking-tighter">Our Specialties</h2>
                                    <div className="w-8 h-1 mx-auto mt-2 rounded-full" style={{ background: accent }} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {(form.servicesContent || 'Cardiology,Neurology,Oncology,Pediatrics').split(',').slice(0, 4).map((s, i) => (
                                        <div key={i} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
                                            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mx-auto mb-3"><Activity size={16} /></div>
                                            <div className="text-[10px] font-black text-[#0F172A] uppercase tracking-wider">{s.trim()}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Map Preview */}
                            <div className="p-6">
                                <div className="h-40 w-full rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Interactive Map Preview
                                </div>
                                <div className="mt-6 text-center">
                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contact Support</div>
                                    <div className="text-xs font-black text-[#0F172A]">{form.phone || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <MousePointer2 size={12} /> Interactive Omni-Channel Preview
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                .preview-container.mobile { transform: scale(0.95); transform-origin: top center; }
            `}</style>
        </div>
    );
}
