'use client';
import { useState, useEffect } from 'react';
import { Trash2, ShieldCheck, Scale, ArrowLeft, Plus, X, RefreshCw, FileText, LayoutDashboard, Database, Siren, Ghost, Monitor } from 'lucide-react';
import Link from 'next/link';

const WASTE_CATEGORIES = [
    { name: 'Yellow', type: 'Anatomical / Soiled', color: '#FCD34D' },
    { name: 'Red', type: 'Contaminated (Plastic)', color: '#EF4444' },
    { name: 'Blue', type: 'Glassware / Metal', color: '#3B82F6' },
    { name: 'White', type: 'Sharps / Needles', color: '#F1F5F9' },
];

export default function WasteManagementLogPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], category: 'Yellow', wasteType: 'Infectious Waste', collectedBy: 'Clinical Support Staff', weight: '2.5', collectionTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/biomedical/waste');
            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs || []);
            }
        } catch (e) { } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const submitLog = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/biomedical/waste', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowModal(false);
                fetchData();
            }
        } catch (e) { } finally { setSaving(false); }
    };

    return (
        <div className="fade-in pb-12">
            <style jsx>{`
                .status-badge {
                    padding: 4px 12px;
                    border-radius: 100px;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .category-indicator {
                    width: 12px; height: 12px; border-radius: 50%;
                }
            `}</style>

            <div className="dashboard-header-row mb-8">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Trash2 size={32} className="text-amber-500" />
                        Biomedical Waste Tracking
                    </h1>
                    <p className="page-header__subtitle">Statutory compliance ledger for cytotoxic and infectious waste stream orchestration.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <Link href="/biomedical" className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        <ArrowLeft size={14} /> Back to Command
                    </Link>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm" style={{ background: '#0F172A', borderColor: '#0F172A' }}>
                        <Plus size={15} /> Log Collection
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {WASTE_CATEGORIES.map(cat => {
                    const totalWeight = logs.filter(l => l.category === cat.name).reduce((sum, l) => sum + parseFloat(l.weight || 0), 0);
                    return (
                        <div key={cat.name} className="card p-6 border-l-[6px]" style={{ borderLeftColor: cat.color }}>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{cat.name} Stream</span>
                                <div style={{ background: cat.color, width: 8, height: 8, borderRadius: '50%' }} />
                            </div>
                            <h2 className="text-2xl font-black text-navy-900 leading-none mb-1">{totalWeight.toFixed(1)} <span className="text-xs font-semibold text-slate-400">KG</span></h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{cat.type}</p>
                        </div>
                    );
                })}
            </div>

            <div className="card">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-sm font-black text-navy-900 uppercase tracking-widest flex items-center gap-3">
                        <FileText size={18} className="text-amber-500" /> Statutory Waste Log
                    </h3>
                </div>
                <div className="data-table-wrapper border-none">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Category</th>
                                <th>Material Type</th>
                                <th>Weight (KG)</th>
                                <th>Lead Agent</th>
                                <th style={{ textAlign: 'right' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="6"><div className="h-6 bg-slate-50 rounded-lg animate-pulse" /></td></tr>) : logs.map(log => {
                                const cat = WASTE_CATEGORIES.find(c => c.name === log.category) || {};
                                return (
                                    <tr key={log.id} className="hover:bg-slate-50 transition-all">
                                        <td>
                                            <div className="text-[13px] font-black text-navy-900">{log.date}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">{log.collectionTime}</div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="category-indicator" style={{ background: cat.color }} />
                                                <span className="text-[11px] font-black uppercase text-navy-900">{log.category}</span>
                                            </div>
                                        </td>
                                        <td><div className="text-[12px] font-bold text-slate-500 uppercase">{log.wasteType}</div></td>
                                        <td><div className="text-[15px] font-black text-navy-900">{log.weight}</div></td>
                                        <td><div className="text-[12px] font-bold text-slate-500 uppercase">{log.collectedBy}</div></td>
                                        <td style={{ textAlign: 'right' }}>
                                            <span className="status-badge bg-emerald-50 text-emerald-600 border border-emerald-100">{log.status}</span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-[500px] rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="bg-amber-500 p-8 flex justify-between items-center text-white">
                            <div>
                                <h3 className="text-xl font-black tracking-tight leading-none mb-2">Waste Log Entry</h3>
                                <p className="text-[11px] font-bold text-amber-100 uppercase tracking-widest">Compliant disposal documentation</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"><X size={20} /></button>
                        </div>
                        <form onSubmit={submitLog} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Category</label>
                                    <select required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                        {WASTE_CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name} ({c.type})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Weight (KG)</label>
                                    <input required type="number" step="0.1" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Responsible Agent</label>
                                    <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" value={formData.collectedBy} onChange={e => setFormData({ ...formData, collectedBy: e.target.value })} />
                                </div>
                            </div>
                            <button type="submit" disabled={saving} className="w-full py-4 bg-navy-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-xl shadow-navy-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                {saving ? <RefreshCw size={16} className="animate-spin" /> : <><ShieldCheck size={16} /> Certify & Log</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
