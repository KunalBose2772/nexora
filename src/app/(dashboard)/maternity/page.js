'use client';
import {
    Heart, Baby, Activity, Plus, Search,
    Filter, Clock, CheckCircle2, ChevronRight,
    Loader2, Users, LineChart, FileText,
    Calendar, Syringe, Clipboard, RefreshCw, LayoutDashboard, Database, Siren
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Skeleton from '@/components/common/Skeleton';

export default function MaternityDashboard() {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAdmitModal, setShowAdmitModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [patients, setPatients] = useState([]);
    const [searchPT, setSearchPT] = useState('');
    const [selectedPT, setSelectedPT] = useState(null);
    const [form, setForm] = useState({
        edd: '',
        gravida: 0,
        para: 0,
        living: 0,
        abortion: 0
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [lRes, pRes] = await Promise.all([
                fetch('/api/maternity/labor'),
                fetch('/api/patients')
            ]);
            const lData = await lRes.json();
            const pData = await pRes.json();
            if (lRes.ok) setCases(lData.cases);
            if (pRes.ok) setPatients(pData.patients || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="fade-in pb-12">
            <style jsx>{`
                .mch-card {
                    background: #fff;
                    border: 1px solid var(--color-border-light);
                    border-radius: 20px;
                    padding: 24px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .mch-card:hover {
                    border-color: #EC4899;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.04);
                }
                .kpi-card {
                    background: #fff;
                    border: 1px solid var(--color-border-light);
                    border-radius: 16px;
                    padding: 24px;
                    transition: all 0.2s ease;
                }
                .vital-box {
                    background: #F8FAFC;
                    border: 1px solid #F1F5F9;
                    border-radius: 12px;
                    padding: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    flex: 1;
                }
            `}</style>

            <div className="dashboard-header-row mb-8">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <HandHeart size={32} className="text-pink-500" />
                        Maternity & Perinatal Hub
                    </h1>
                    <p className="page-header__subtitle">Precision Obstetric care, Partograph tracking, and Maternal-Neonatal orchestration.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={fetchData}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync Records
                    </button>
                    <button className="btn btn-primary btn-sm" style={{ background: '#EC4899', borderColor: '#EC4899' }} onClick={() => setShowAdmitModal(true)}>
                        <Plus size={15} strokeWidth={1.5} /> Admit to Labor
                    </button>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="kpi-card" style={{ borderLeft: '4px solid #EC4899' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-pink-600/70">Labor Active</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-pink-600 leading-none">{cases.length}</h2>}
                        <span className="text-xs font-semibold text-slate-400">Cases</span>
                    </div>
                </div>
                <div className="kpi-card" style={{ borderLeft: '4px solid #6366F1' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-indigo-600/70">Neonatal Pulse</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-indigo-600 leading-none">4</h2>}
                        <span className="text-xs font-semibold text-slate-400">Births Today</span>
                    </div>
                </div>
                <div className="kpi-card" style={{ borderLeft: '4px solid #10B981' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-emerald-600/70">Successful Discharges</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-emerald-600 leading-none">12</h2>}
                        <span className="text-xs font-semibold text-slate-400">Mothers Home</span>
                    </div>
                </div>
                <div className="kpi-card" style={{ borderLeft: '4px solid #F59E0B' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-amber-600/70">ANC Continuum</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-amber-600 leading-none">28</h2>}
                        <span className="text-xs font-semibold text-slate-400">OPD Visits</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 flex flex-col gap-6">
                    <div className="flex justify-between items-center bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                        <h2 className="text-lg font-black text-navy-900 tracking-tight flex items-center gap-3">
                            <Activity size={20} className="text-pink-500" />
                            Active Labor Registry
                        </h2>
                        <div className="relative w-72">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Filter by patient name..." className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:border-pink-300 outline-none transition-all" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        {loading ? [1, 2].map(i => <Skeleton key={i} height="240px" radius="20px" />) : cases.map(c => (
                            <div key={c.id} className="mch-card group">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center font-black text-lg border border-pink-100">{c.patient?.firstName?.[0]}</div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-[17px] font-black text-navy-900 group-hover:text-pink-600 transition-colors">{c.patient?.firstName} {c.patient?.lastName}</h3>
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">{c.patient?.patientCode}</span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1.5">
                                                <div className="text-[11px] font-black text-pink-500 uppercase tracking-widest">Gravida {c.gravida} Para {c.para}</div>
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    <Clock size={12} /> Induction: {new Date(c.admissionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated EDD</div>
                                        <div className="text-[15px] font-black text-navy-900">{new Date(c.edd).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <div className="vital-box">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cervical Dilation</span>
                                        <div className="text-xl font-black text-pink-600">6 <span className="text-[10px] opacity-60">cm</span></div>
                                    </div>
                                    <div className="vital-box">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fetal Heart Rate</span>
                                        <div className="text-xl font-black text-navy-900">142 <span className="text-[10px] opacity-60">BPM</span></div>
                                    </div>
                                    <div className="vital-box">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contractions</span>
                                        <div className="text-xl font-black text-navy-900">3 <span className="text-[10px] opacity-60">/ 10m</span></div>
                                    </div>
                                    <div className="vital-box">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Clinical Phase</span>
                                        <div className="text-xl font-black text-emerald-600">Active</div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <Link href={`/maternity/partograph/${c.id}`} className="h-10 px-6 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-black text-slate-500 hover:bg-slate-100 transition-all flex items-center gap-2">
                                        <LineChart size={14} /> Partograph Stream
                                    </Link>
                                    <Link href={`/maternity/labor/${c.id}`} className="h-10 px-6 bg-navy-900 text-white rounded-xl text-[11px] font-black text-white hover:bg-slate-800 transition-all flex items-center gap-2 group">
                                        Open Labor Monitor <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-all" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="mch-card bg-navy-900 text-white border-none shadow-xl shadow-navy-900/10">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                            <Clipboard size={18} className="text-pink-500" /> Statistical Pulse
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Natural Vaginal (NVD)', value: '82%', color: 'bg-emerald-500' },
                                { label: 'Lower Segment CS', value: '15%', color: 'bg-amber-500' },
                                { label: 'Instrumental Aid', value: '3%', color: 'bg-pink-500' }
                            ].map(stat => (
                                <div key={stat.label}>
                                    <div className="flex justify-between text-[11px] font-bold mb-1.5">
                                        <span className="text-slate-400">{stat.label}</span>
                                        <span>{stat.value}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${stat.color}`} style={{ width: stat.value }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mch-card">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3 text-navy-900">
                            <Baby size={18} className="text-pink-500" /> Recent Arrivals
                        </h3>
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-pink-200 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 shadow-sm"><Baby size={20} /></div>
                                    <div className="flex-1">
                                        <div className="text-[13px] font-black text-navy-900">{i % 2 === 0 ? 'Girl' : 'Boy'} • 3.4 Kg</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mrs. Sharma • 02:40 PM</div>
                                    </div>
                                    <Link href="#" className="w-8 h-8 rounded-lg text-slate-300 hover:text-navy-900 transition-all"><ChevronRight size={18} /></Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mch-card bg-pink-50 border-pink-100 border-dashed border-2">
                        <h3 className="text-[11px] font-black text-pink-700 uppercase tracking-widest mb-2 flex items-center gap-2"><Siren size={14} /> Institutional Alert</h3>
                        <p className="text-xs font-bold text-pink-600 leading-relaxed italic">Bi-monthly Perinatal Audit report is due in 48 hours. Ensure all birth registries are synchronized.</p>
                    </div>
                </div>
            </div>

            {/* Admit Modal */}
            {showAdmitModal && (
                <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card fade-in" style={{ width: '500px', padding: '32px', borderRadius: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--color-navy)', margin: 0 }}>Clinical Labor Ingress</h2>
                            <button onClick={() => setShowAdmitModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><Plus size={24} style={{ transform: 'rotate(45deg)' }} /></button>
                        </div>

                        {!selectedPT ? (
                            <div className="mb-6">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Search Patient Registry</label>
                                <div className="relative">
                                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="text" 
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" 
                                        placeholder="Name or UHID..."
                                        value={searchPT}
                                        onChange={e => setSearchPT(e.target.value)}
                                    />
                                    {searchPT && (
                                        <div className="absolute top-full left-0 right-0 bg-white border border-slate-100 rounded-xl mt-2 shadow-xl z-10 max-h-48 overflow-y-auto">
                                            {patients.filter(p => `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchPT.toLowerCase())).map(p => (
                                                <div key={p.id} className="p-3 hover:bg-pink-50 cursor-pointer border-bottom border-slate-50" onClick={() => setSelectedPT(p)}>
                                                    <div className="text-sm font-bold text-navy-900">{p.firstName} {p.lastName}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase">{p.patientCode}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="mb-6 p-4 bg-pink-50 rounded-2xl border border-pink-100 flex justify-between items-center">
                                <div>
                                    <div className="text-sm font-black text-pink-600">{selectedPT.firstName} {selectedPT.lastName}</div>
                                    <div className="text-[10px] text-pink-400 font-bold uppercase tracking-widest">{selectedPT.patientCode}</div>
                                </div>
                                <button className="text-[10px] font-black text-pink-600 uppercase border-b border-pink-600" onClick={() => setSelectedPT(null)}>Change</button>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Estimated EDD</label>
                                <input type="date" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" value={form.edd} onChange={e => setForm({...form, edd: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Gravida</label>
                                <input type="number" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" value={form.gravida} onChange={e => setForm({...form, gravida: e.target.value})} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {['Para', 'Living', 'Abortion'].map(f => (
                                <div key={f}>
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">{f}</label>
                                    <input type="number" className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" value={form[f.toLowerCase()]} onChange={e => setForm({...form, [f.toLowerCase()]: e.target.value})} />
                                </div>
                            ))}
                        </div>

                        <button 
                            className="btn btn-primary w-full h-14" 
                            style={{ background: '#EC4899', borderColor: '#EC4899', borderRadius: '16px', fontSize: '14px' }}
                            disabled={saving || !selectedPT}
                            onClick={async () => {
                                setSaving(true);
                                try {
                                    const res = await fetch('/api/maternity/labor', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ patientId: selectedPT.id, ...form })
                                    });
                                    if (res.ok) {
                                        setShowAdmitModal(false);
                                        fetchData();
                                    }
                                } catch (e) {
                                    console.error(e);
                                } finally {
                                    setSaving(false);
                                }
                            }}
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : 'CONFIRM LABOR ADMISSION'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function HandHeart(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" />
            <path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-5.4a2 2 0 0 0-1.5-3.3c-.5 0-1 .2-1.3.5l-4.2 3.7" />
            <path d="M2 13a6 6 0 1 1 12 0c0 1.9-1.1 3.5-2.5 4.5V22l-4-1.5L3.5 22v-4.5C2.1 16.5 2 14.9 2 13Z" />
        </svg>
    )
}
