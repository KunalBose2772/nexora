'use client';
import { useState, useEffect } from 'react';
import { Settings, Shield, Bell, Database, Hospital, Mail, Building2, Save, CheckCircle, Loader2, Globe, IndianRupee, Palette, Printer, ArrowRight, ShieldCheck, HardDrive, Share2, Languages, Key, UserCheck, Smartphone, ChevronRight, X, LayoutDashboard, Siren, Ghost, Monitor, Activity } from 'lucide-react';
import Skeleton from '@/components/common/Skeleton';

const TABS = [
    { label: 'Hospital Profile', icon: Hospital, key: 'profile', desc: 'Global identity & contact records' },
    { label: 'Branding & Prints', icon: Palette, key: 'branding', desc: 'Visual identity & document layout' },
    { label: 'Billing & Currency', icon: IndianRupee, key: 'billing', desc: 'Tax rules, rates & localization' },
    { label: 'Security & Governance', icon: ShieldCheck, key: 'security', desc: 'Audit trails & clinical workflows' },
    { label: 'Notification Engine', icon: Mail, key: 'smtp', desc: 'SMTP, SMS & Push configurations' },
    { label: 'Warehouse & Data', icon: Database, key: 'backup', desc: 'Cloud backups & data portability' },
];

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
        gstNumber: '', hfrNumber: '', printTerms: '', footerSignature: '',
        requireRxApproval: false, enablePanicAlarms: true
    });

    const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

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
                        ...form,
                        ...t,
                        requireRxApproval: t.requireRxApproval || false,
                        enablePanicAlarms: t.enablePanicAlarms || false,
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

    const inputClasses = "w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-cyan-500 outline-none transition-all shadow-sm";
    const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2";

    return (
        <div className="fade-in pb-12">
            <style jsx>{`
                .sidebar-btn {
                    width: 100%;
                    text-align: left;
                    padding: 16px;
                    border-radius: 20px;
                    border: 1px solid transparent;
                    background: transparent;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .sidebar-btn:hover {
                    background: rgba(255,255,255,0.6);
                    border-color: rgba(0,0,0,0.05);
                }
                .sidebar-btn.active {
                    background: #fff;
                    border-color: #E2E8F0;
                    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
                    color: #0F172A;
                }
                .sidebar-btn.active .icon-container {
                    background: #0F172A;
                    color: #fff;
                }
                .icon-container {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #F1F5F9;
                    color: #64748B;
                    transition: all 0.2s;
                }
                .settings-card {
                    background: #fff;
                    border: 1px solid var(--color-border-light);
                    border-radius: 32px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                }
            `}</style>

            <div className="dashboard-header-row mb-10">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Settings size={32} className="text-slate-400" />
                        System Architecture
                    </h1>
                    <p className="page-header__subtitle">Precision orchestration of hospital workflows, automated clinical policies, and security governance.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm h-11 px-6 bg-white" onClick={() => window.location.reload()}>Sync State</button>
                    <button className="btn btn-primary btn-sm h-11 px-8 flex items-center gap-2" onClick={handleSave} disabled={saving || loading}>
                        {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
                        {saving ? 'Synchronizing…' : saved ? 'State Preserved' : 'Apply Changes'}
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 items-start">
                <div className="w-full lg:w-[320px] flex flex-col gap-3 shrink-0">
                    {TABS.map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`sidebar-btn ${activeTab === tab.key ? 'active' : ''}`}>
                            <div className="icon-container shadow-sm">
                                <tab.icon size={18} />
                            </div>
                            <div className="flex-1">
                                <div className="text-[13px] font-black tracking-tight">{tab.label}</div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">{tab.desc}</div>
                            </div>
                            <ChevronRight size={14} className={`text-slate-200 transition-all ${activeTab === tab.key ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                        </button>
                    ))}
                </div>

                <div className="flex-1 w-full min-w-0">
                    {loading ? (
                        <div className="settings-card p-32 flex flex-col items-center justify-center text-slate-400 gap-6">
                            <Loader2 size={40} className="animate-spin text-cyan-500" />
                            <p className="font-black text-xs uppercase tracking-[0.3em] animate-pulse">Accessing Core Registry...</p>
                        </div>
                    ) : (
                        <div className="settings-card shadow-2xl shadow-slate-200/50">
                            <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/20 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-black text-navy-900 leading-none mb-2">{TABS.find(t => t.key === activeTab).label}</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{TABS.find(t => t.key === activeTab).desc}</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-lg shadow-slate-100 text-cyan-500">
                                    <ShieldCheck size={24} />
                                </div>
                            </div>

                            <div className="p-10">
                                {activeTab === 'profile' && (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className={labelClasses}>Hospital Entity Name</label>
                                                <input className={inputClasses} type="text" value={form.name} onChange={e => updateField('name', e.target.value)} placeholder="e.g. Nexora Multispeciality" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className={labelClasses}>Critical Hotline</label>
                                                <input className={inputClasses} type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+91 1800-000-0000" />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className={labelClasses}>Geographic HQ Address</label>
                                                <textarea rows={3} className={`${inputClasses} resize-none`} value={form.address} onChange={e => updateField('address', e.target.value)} placeholder="Full physical location details..." />
                                            </div>
                                            <div className="space-y-2">
                                                <label className={labelClasses}>Organizational Tagline</label>
                                                <input className={inputClasses} type="text" value={form.tagline} onChange={e => updateField('tagline', e.target.value)} placeholder="Precision. Care. Legacy." />
                                            </div>
                                            <div className="space-y-2">
                                                <label className={labelClasses}>Global Search Title</label>
                                                <input className={inputClasses} type="text" value={form.metaTitle} onChange={e => updateField('metaTitle', e.target.value)} placeholder="Hospital Title for Web Search" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'branding' && (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className={labelClasses}>GSTIN Identifier</label>
                                                <input className={inputClasses} type="text" value={form.gstNumber} onChange={e => updateField('gstNumber', e.target.value)} placeholder="GST Number" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className={labelClasses}>HFR Registry No.</label>
                                                <input className={inputClasses} type="text" value={form.hfrNumber} onChange={e => updateField('hfrNumber', e.target.value)} placeholder="Hospital Registry No." />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className={labelClasses}>Official Print Terms</label>
                                                <textarea rows={3} className={`${inputClasses} resize-none`} value={form.printTerms} onChange={e => updateField('printTerms', e.target.value)} placeholder="Disclaimers shown on bills and prescriptions..." />
                                            </div>
                                            <div className="space-y-2">
                                                <label className={labelClasses}>Interface Primary Color</label>
                                                <div className="flex gap-3">
                                                    <input type="color" value={form.primaryColor} onChange={e => updateField('primaryColor', e.target.value)} className="w-14 h-14 border-0 rounded-2xl cursor-pointer bg-transparent shadow-lg shadow-slate-200" />
                                                    <input className={inputClasses} type="text" value={form.primaryColor} onChange={e => updateField('primaryColor', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="p-6 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-cyan-100 transition-all cursor-pointer">
                                                <div className="flex gap-5 items-center">
                                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm text-cyan-500 flex items-center justify-center"><UserCheck size={24} /></div>
                                                    <div>
                                                        <div className="text-sm font-black text-navy-900 mb-0.5">Clinical Rx Proxy Gatekeeper</div>
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Require senior sign-off for restricted narcotics and psychotropics.</div>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer scale-110">
                                                    <input type="checkbox" className="sr-only peer" checked={form.requireRxApproval} onChange={e => updateField('requireRxApproval', e.target.checked)} />
                                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                                                </label>
                                            </div>

                                            <div className="p-6 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-red-100 transition-all cursor-pointer">
                                                <div className="flex gap-5 items-center">
                                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm text-red-500 flex items-center justify-center"><Siren size={24} /></div>
                                                    <div>
                                                        <div className="text-sm font-black text-navy-900 mb-0.5">Critical Lab Panic Protocols</div>
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Automatic HOD broadcast for physiological panic parameters.</div>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer scale-110">
                                                    <input type="checkbox" className="sr-only peer" checked={form.enablePanicAlarms} onChange={e => updateField('enablePanicAlarms', e.target.checked)} />
                                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'backup' && (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {[
                                                { label: 'Cloud Mirror (EHR)', icon: <Share2 size={24} />, meta: 'Last synced 4h ago', color: 'text-cyan-500' },
                                                { label: 'DB Cold Archive', icon: <Database size={24} />, meta: 'Weekly SQL Snapshot', color: 'text-purple-500' },
                                                { label: 'MPI Master Port', icon: <UserCheck size={24} />, meta: 'Interoperability JSON', color: 'text-emerald-500' },
                                                { label: 'Fiscal Ledger Box', icon: <Key size={24} />, meta: 'Encrypted Audit Log', color: 'text-amber-500' },
                                            ].map(item => (
                                                <div key={item.label} className="p-6 rounded-[24px] border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-center gap-6 cursor-pointer transition-all hover:scale-[1.02] group">
                                                    <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 ${item.color}`}>{item.icon}</div>
                                                    <div className="flex-1">
                                                        <div className="text-[14px] font-black text-navy-900 mb-0.5">{item.label}</div>
                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.meta}</div>
                                                    </div>
                                                    <ChevronRight size={16} className="text-slate-200 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-10 rounded-[32px] bg-slate-900 text-white flex flex-col items-center text-center gap-6 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                                            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 shadow-2xl relative z-1"><HardDrive size={36} /></div>
                                            <div className="relative z-1">
                                                <h3 className="text-xl font-black mb-2">Immutable Cold Storage</h3>
                                                <p className="text-sm text-slate-400 max-w-sm font-bold">Initiating a full environment dump will freeze non-emergency writes for approximately 180 seconds.</p>
                                            </div>
                                            <button className="px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-2xl shadow-cyan-500/30 active:scale-95 relative z-1">Force Migration Drip</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {saved && (
                <div className="fixed bottom-12 right-12 bg-emerald-600 text-white px-8 py-5 rounded-[24px] shadow-2xl flex items-center gap-5 animate-in fade-in slide-in-from-bottom-12 z-[200]">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-inner"><CheckCircle size={24} /></div>
                    <div>
                        <div className="text-sm font-black leading-tight">Sync Established</div>
                        <div className="text-[10px] font-black opacity-70 uppercase tracking-[0.2em] mt-0.5">Master state distributed to all nodes</div>
                    </div>
                </div>
            )}
        </div>
    );
}
