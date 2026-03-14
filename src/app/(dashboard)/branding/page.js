'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Palette, Globe, Image as ImageIcon, Save, CheckCircle,
    ImagePlus, Link2, Loader2, ExternalLink, Eye, RefreshCw, Upload, Siren, Ghost, Monitor, LayoutDashboard, Database, LayoutTemplate, Zap, Sparkles
} from 'lucide-react';
import Skeleton from '@/components/common/Skeleton';

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
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.ok) {
                if (type === 'logo') setForm(f => ({ ...f, logoUrl: data.url }));
                else setForm(f => ({ ...f, heroImage: data.url }));
            }
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
            if (!res.ok) throw new Error('Save failed');
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
        <div className="flex items-center justify-center p-20 gap-3 text-slate-400 font-bold uppercase tracking-widest text-xs">
            <RefreshCw size={20} className="animate-spin" />
            Initializing Identity...
        </div>
    );

    const inputStyle = "w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest outline-none focus:border-cyan-500 transition-all shadow-sm";

    return (
        <div className="fade-in max-w-[1000px] pb-20">
            <style jsx>{`
                .section-card {
                    background: #fff;
                    border: 1px solid var(--color-border-light);
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
                }
                .section-header {
                    padding: 24px 32px;
                    border-bottom: 1px solid var(--color-border-light);
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .section-content {
                    padding: 32px;
                }
            `}</style>

            <div className="dashboard-header-row mb-10">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Sparkles size={32} className="text-pink-500" />
                        Brand Identity & UI Logic
                    </h1>
                    <p className="page-header__subtitle">Configure public digital footprint, molecular aesthetics, and visual governance.</p>
                </div>
                <div className="flex gap-3">
                    {tenant && (
                        <a href={`/${tenant.slug}`} target="_blank" rel="noreferrer" className="h-11 px-6 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 shadow-sm">
                            <Eye size={14} /> Preview Engine
                        </a>
                    )}
                    <button onClick={handleSave} disabled={saving} className={`h-11 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2 transition-all shadow-lg ${saved ? 'bg-emerald-500 shadow-emerald-200' : 'bg-navy-900 shadow-navy-200'}`}>
                        {saving ? <RefreshCw size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : <Save size={14} />}
                        {saving ? 'Synchronizing...' : saved ? 'Identity Preserved' : 'Apply Branding'}
                    </button>
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-black uppercase tracking-widest mb-6">{error}</div>}

            <div className="grid gap-8">
                {/* Hospital Information */}
                <div className="section-card">
                    <div className="section-header bg-slate-50/50">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-navy-900 shadow-sm"><Globe size={20} /></div>
                        <div>
                            <h2 className="text-sm font-black text-navy-900 uppercase tracking-widest">Architectural Demographics</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Primary public-facing identifiers</p>
                        </div>
                    </div>
                    <div className="section-content grid grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Hospital Nomenclature</label>
                            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputStyle} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Clinical Helpline</label>
                            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputStyle} />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Institutional Headline</label>
                            <input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} className={inputStyle} />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Geospatial Address</label>
                            <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className={inputStyle} />
                        </div>
                    </div>
                </div>

                {/* Aesthetics */}
                <div className="section-card">
                    <div className="section-header bg-slate-50/50">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-pink-500 shadow-sm"><Palette size={20} /></div>
                        <div>
                            <h2 className="text-sm font-black text-navy-900 uppercase tracking-widest">Visual Aesthetics</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Molecular color palette and symbology</p>
                        </div>
                    </div>
                    <div className="section-content grid grid-cols-3 gap-8">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Primary Color Node</label>
                            <div className="flex gap-2">
                                <input type="color" value={form.primaryColor} onChange={e => setForm({ ...form, primaryColor: e.target.value })} className="w-12 h-11 rounded-xl border border-slate-200 cursor-pointer" />
                                <input value={form.primaryColor} onChange={e => setForm({ ...form, primaryColor: e.target.value })} className={inputStyle} />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Symbology Initials</label>
                            <input value={form.logoInitials} maxLength={3} onChange={e => setForm({ ...form, logoInitials: e.target.value.toUpperCase() })} className={`${inputStyle} text-center text-lg font-black`} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Branding Vector</label>
                            <div className="h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-navy-900 flex items-center justify-center text-[10px] font-black text-white" style={{ background: accent }}>{form.logoInitials || 'NH'}</div>
                                <span className="text-[12px] font-black text-navy-900">{form.name || 'HOSPITAL'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Media Induction */}
                <div className="section-card">
                    <div className="section-header bg-slate-50/50">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-sky-500 shadow-sm"><ImageIcon size={20} /></div>
                        <div>
                            <h2 className="text-sm font-black text-navy-900 uppercase tracking-widest">Media Induction</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Vector logo and architectural imagery</p>
                        </div>
                    </div>
                    <div className="section-content grid grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Logo Vector URL</label>
                                <div className="flex gap-2">
                                    <input value={form.logoUrl} onChange={e => setForm({ ...form, logoUrl: e.target.value })} className={inputStyle} placeholder="https://..." />
                                    <label className="h-11 px-5 bg-navy-900 text-white rounded-xl flex items-center justify-center shrink-0 cursor-pointer shadow-lg shadow-navy-100">
                                        {logoUploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
                                        <input type="file" className="hidden" onChange={e => handleUpload(e, 'logo')} />
                                    </label>
                                </div>
                            </div>
                            <div className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden">
                                {form.logoUrl ? <img src={form.logoUrl} className="max-h-24 object-contain" /> : <div className="text-[10px] font-black text-slate-300 uppercase">Logo Preview</div>}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Hero Mural URL</label>
                                <div className="flex gap-2">
                                    <input value={form.heroImage} onChange={e => setForm({ ...form, heroImage: e.target.value })} className={inputStyle} placeholder="https://..." />
                                    <label className="h-11 px-5 bg-navy-900 text-white rounded-xl flex items-center justify-center shrink-0 cursor-pointer shadow-lg shadow-navy-100">
                                        {heroUploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
                                        <input type="file" className="hidden" onChange={e => handleUpload(e, 'hero')} />
                                    </label>
                                </div>
                            </div>
                            <div className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden">
                                {form.heroImage ? <img src={form.heroImage} className="w-full h-full object-cover" /> : <div className="text-[10px] font-black text-slate-300 uppercase">Mural Preview</div>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEO & Molecular Meta */}
                <div className="section-card">
                    <div className="section-header bg-slate-50/50">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-emerald-500 shadow-sm"><ShieldCheck size={20} /></div>
                        <div>
                            <h2 className="text-sm font-black text-navy-900 uppercase tracking-widest">Metadata Governance</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Search indexing and structural services</p>
                        </div>
                    </div>
                    <div className="section-content grid grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Index Title</label>
                            <input value={form.metaTitle} onChange={e => setForm({ ...form, metaTitle: e.target.value })} className={inputStyle} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Favicon Proxy</label>
                            <input value={form.faviconUrl} onChange={e => setForm({ ...form, faviconUrl: e.target.value })} className={inputStyle} />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Abstract Description (SEO)</label>
                            <textarea value={form.metaDescription} onChange={e => setForm({ ...form, metaDescription: e.target.value })} className={`${inputStyle} h-24 pt-4`} />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Service Protomolecule (Comma Separated)</label>
                            <textarea value={form.servicesContent} onChange={e => setForm({ ...form, servicesContent: e.target.value })} className={`${inputStyle} h-24 pt-4`} placeholder="Cardiology, Neurology, Emergency..." />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
