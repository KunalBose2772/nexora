'use client';
import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, ShieldCheck, Cpu, BellRing, Settings2, Plus, X, Wrench, RefreshCw, CalendarOff, LayoutDashboard, Database, Siren, Ghost, Monitor } from 'lucide-react';
import Skeleton from '@/components/common/Skeleton';

export default function BiomedicalAssetPage() {
    const [assets, setAssets] = useState([]);
    const [summary, setSummary] = useState({ total: 0, active: 0, maintenance: 0, alerts: 0 });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ assetName: 'GE Optima MR450w 1.5T', serialNumber: '', department: 'Radiology', lastCalibrationDate: '', nextCalibrationDate: '', vendorName: '', vendorContact: '' });
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/biomedical');
            if (res.ok) {
                const data = await res.json();
                setAssets(data.assets || []);
                setSummary(data.summary || { total: 0, active: 0, maintenance: 0, alerts: 0 });
            }
        } catch (e) { } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const submitAsset = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/biomedical', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowModal(false);
                setFormData({ ...formData, serialNumber: '', vendorName: '', vendorContact: '' });
                fetchData();
            }
        } catch (e) { } finally { setSaving(false); }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'In Maintenance' : 'Active';
        try {
            const res = await fetch('/api/biomedical', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
            if (res.ok) fetchData();
        } catch (e) { }
    };

    const isOverdue = (nextDate) => nextDate && new Date(nextDate) < new Date();
    const isDueSoon = (nextDate) => {
        if (!nextDate) return false;
        const diff = (new Date(nextDate) - new Date()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 30;
    };

    return (
        <div className="fade-in pb-12">
            <style jsx>{`
                .kpi-card {
                    background: #fff;
                    border: 1px solid var(--color-border-light);
                    border-radius: 16px;
                    padding: 24px;
                    transition: all 0.2s ease;
                }
                .asset-row {
                    transition: all 0.2s;
                    cursor: pointer;
                }
                .asset-row:hover {
                    background: #F8FAFC;
                }
                .status-badge {
                    padding: 4px 12px;
                    border-radius: 100px;
                    font-size: 10px;
                    font-weight: 901;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .status-online { background: #F0FDFA; color: #10B981; border: 1px solid #CCFBF1; }
                .status-offline { background: #FEF2F2; color: #EF4444; border: 1px solid #FEE2E2; }
            `}</style>

            <div className="dashboard-header-row mb-8">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Cpu size={32} className="text-cyan-500" />
                        Biomedical Engineering Command
                    </h1>
                    <p className="page-header__subtitle">Precision machinery lifecycle management, statutory calibration tracking, and preventative maintenance orchestration.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button onClick={fetchData} className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        <RefreshCw size={14} className={loading && "animate-spin"} /> Sync Assets
                    </button>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm">
                        <Plus size={15} strokeWidth={1.5} /> Register Machine
                    </button>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="kpi-card" style={{ borderLeft: '4px solid #3B82F6' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-blue-600/70">Master Ledger</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-navy-900 leading-none">{summary.total}</h2>}
                        <span className="text-xs font-semibold text-slate-400">Tracked Units</span>
                    </div>
                </div>
                <div className="kpi-card" style={{ borderLeft: '4px solid #10B981' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-emerald-600/70">Operational Flow</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-emerald-600 leading-none">{summary.active}</h2>}
                        <span className="text-xs font-semibold text-slate-400">Units Online</span>
                    </div>
                </div>
                <div className="kpi-card" style={{ borderLeft: '4px solid #EF4444' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-red-600/70">Down / Maintenance</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-red-600 leading-none">{summary.maintenance}</h2>}
                        <span className="text-xs font-semibold text-red-500 animate-pulse">Critical</span>
                    </div>
                </div>
                <div className="kpi-card" style={{ borderLeft: '4px solid #F59E0B' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-amber-600/70">Calibration Alert</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-amber-600 leading-none">{summary.alerts}</h2>}
                        <span className="text-xs font-semibold text-slate-400">Due 30D</span>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-sm font-black text-navy-900 uppercase tracking-widest flex items-center gap-3">
                        <Settings2 size={18} className="text-cyan-500" /> Precision Equipment Registry
                    </h3>
                </div>
                <div className="data-table-wrapper border-none">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Asset Identification</th>
                                <th>Clinical Location</th>
                                <th>Service Provider</th>
                                <th>Maintenance Horizon</th>
                                <th style={{ textAlign: 'right' }}>Operational State</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="5"><Skeleton height="20px" /></td></tr>) : assets.map(asset => {
                                const nextCalDate = asset.time;
                                const alertOverdue = isOverdue(nextCalDate);
                                const alertDue = isDueSoon(nextCalDate);
                                const [vendorStr, contactStr] = asset.notes ? asset.notes.split('|') : ['N/A', ''];
                                const vendorName = vendorStr.replace('[VENDOR] ', '').trim();
                                const contact = contactStr ? contactStr.replace('[CONTACT] ', '').trim() : '';

                                return (
                                    <tr key={asset.id} className="asset-row">
                                        <td>
                                            <div className="text-[14px] font-black text-navy-900">{asset.patientName}</div>
                                            <div className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter mt-1 uppercase">S/N: {asset.doctorName} • ID: {asset.apptCode}</div>
                                        </td>
                                        <td><span className="badge badge-navy">{asset.department}</span></td>
                                        <td>
                                            <div className="text-[12px] font-bold text-slate-700">{vendorName}</div>
                                            <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{contact}</div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className={`text-[11px] font-black uppercase tracking-tight py-1 px-2 rounded-lg ${alertOverdue ? 'bg-red-50 text-red-600' : alertDue ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-600'}`}>
                                                    Next: {nextCalDate || 'NOT SET'}
                                                </div>
                                                {alertOverdue && <AlertTriangle size={14} className="text-red-500 animate-pulse" />}
                                            </div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Last PM: {asset.date}</div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button onClick={() => toggleStatus(asset.id, asset.status)} className={`status-badge ${asset.status === 'Active' ? 'status-online' : 'status-offline'}`}>
                                                {asset.status === 'Active' ? 'Online' : 'Down / Maint'}
                                            </button>
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
                    <div className="bg-white w-full max-w-[540px] rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="bg-navy-900 p-8 flex justify-between items-center text-white">
                            <div>
                                <h3 className="text-xl font-black tracking-tight leading-none mb-2">Asset Enrollment</h3>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Register high-value clinical hardware</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"><X size={20} /></button>
                        </div>
                        <form onSubmit={submitAsset} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Hardware Nomenclature</label>
                                    <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-cyan-500 transition-all" value={formData.assetName} onChange={e => setFormData({ ...formData, assetName: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Serial Protocol</label>
                                    <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none font-mono" placeholder="SN-10294" value={formData.serialNumber} onChange={e => setFormData({ ...formData, serialNumber: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Clinical Dept</label>
                                    <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                                        <option>Radiology</option>
                                        <option>ICU / Critical Care</option>
                                        <option>Cardiology</option>
                                        <option>Operation Theatre</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block text-red-500">Next Calib Due</label>
                                    <input required type="date" className="w-full p-3 bg-red-50 border border-red-100 rounded-xl text-sm font-bold outline-none font-mono text-red-600" value={formData.nextCalibrationDate} onChange={e => setFormData({ ...formData, nextCalibrationDate: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Last PM Date</label>
                                    <input required type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none font-mono" value={formData.lastCalibrationDate} onChange={e => setFormData({ ...formData, lastCalibrationDate: e.target.value })} />
                                </div>
                            </div>
                            <button type="submit" disabled={saving} className="w-full py-4 bg-navy-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-xl shadow-navy-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                {saving ? <RefreshCw size={16} className="animate-spin" /> : <><Wrench size={16} /> Push Asset to Ledger</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
