'use client';
import { useState, useEffect } from 'react';
import { ChefHat, Flame, Coffee, Activity, ArrowRight, User, BedDouble, Save, Search, RefreshCw, X, Utensils, LayoutDashboard, Database, Siren, Ghost, Monitor } from 'lucide-react';
import Skeleton from '@/components/common/Skeleton';

const DIET_TYPES = ['Regular', 'Diabetic', 'Low Sodium', 'Liquid Only', 'Renal', 'High Protein', 'NPO (Nil Per Os)'];

export default function DietaryKitchenPage() {
    const [patients, setPatients] = useState([]);
    const [summary, setSummary] = useState({});
    const [totalMeals, setTotalMeals] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingPatient, setEditingPatient] = useState(null);
    const [newDiet, setNewDiet] = useState('Regular');
    const [saving, setSaving] = useState(false);

    const fetchDietaryData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/dietary');
            if (res.ok) {
                const data = await res.json();
                setPatients(data.patients || []);
                setSummary(data.summary || {});
                setTotalMeals(data.totalMeals || 0);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDietaryData(); }, []);

    const updateDiet = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/dietary', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingPatient.id, newDiet })
            });

            if (res.ok) {
                setEditingPatient(null);
                fetchDietaryData();
            }
        } catch (error) {
        } finally {
            setSaving(false);
        }
    };

    const filteredPatients = patients.filter(p =>
        p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.diet.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                .diet-badge {
                    padding: 4px 10px;
                    border-radius: 8px;
                    font-size: 10px;
                    font-weight: 901;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .diet-regular { background: #F1F5F9; color: #475569; }
                .diet-special { background: #FEF2F2; color: #EF4444; border: 1px solid #FEE2E2; }
                .diet-npo { background: #FFF7ED; color: #EA580C; border: 1px solid #FFEDD5; }
            `}</style>

            <div className="dashboard-header-row mb-8">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Utensils size={32} className="text-orange-500" />
                        Dietary & Culinary Ops
                    </h1>
                    <p className="page-header__subtitle">Precision nutrition management, clinical diet orchestration, and kitchen prep synchronization.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button onClick={fetchDietaryData} className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Sync Nutrition
                    </button>
                    <button className="btn btn-primary btn-sm" style={{ background: '#F97316', borderColor: '#F97316' }}>
                        <ChefHat size={15} strokeWidth={1.5} /> Generate Prep Sheet
                    </button>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="kpi-card" style={{ borderLeft: '4px solid #3B82F6' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-blue-600/70">Cover Volume</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-navy-900 leading-none">{totalMeals}</h2>}
                        <span className="text-xs font-semibold text-slate-400">Total Patients</span>
                    </div>
                </div>
                <div className="kpi-card" style={{ borderLeft: '4px solid #EF4444' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-red-600/70">Clinical Diets</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-red-600 leading-none">{totalMeals - (summary['Regular'] || 0)}</h2>}
                        <span className="text-xs font-semibold text-slate-400">Specials</span>
                    </div>
                </div>
                <div className="kpi-card" style={{ borderLeft: '4px solid #F97316' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-orange-600/70">Fasting Protocol</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-orange-600 leading-none">{summary['NPO (Nil Per Os)'] || 0}</h2>}
                        <span className="text-xs font-semibold text-slate-400">NPO Active</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Kitchen Breakdown */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="card h-min">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
                                <Flame size={14} className="text-orange-500" /> Tray Preparation Logic
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {loading ? [1, 2, 3, 4].map(i => <Skeleton key={i} height="24px" />) : Object.entries(summary).sort((a, b) => b[1] - a[1]).map(([diet, count]) => (
                                <div key={diet} className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                    <span className={`text-[11px] font-black uppercase ${diet === 'NPO (Nil Per Os)' ? 'text-orange-600' : 'text-navy-900'}`}>{diet}</span>
                                    <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-navy-900">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Patient Nutrition Roster */}
                <div className="lg:col-span-3 card">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-sm font-black text-navy-900 uppercase tracking-widest">Patient Nutrition Registry</h3>
                        <div className="relative">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Ward or patient search..." className="pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all w-64" />
                        </div>
                    </div>
                    <div className="data-table-wrapper border-none">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Patient & Location</th>
                                    <th>Responsible Lead</th>
                                    <th>Dietary Protocol</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="4"><Skeleton height="20px" /></td></tr>) : filteredPatients.map(p => {
                                    const isNPO = p.diet.includes('NPO');
                                    const isRegular = p.diet === 'Regular';
                                    return (
                                        <tr key={p.id} className="hover:bg-slate-50 transition-all cursor-pointer">
                                            <td>
                                                <div className="text-[14px] font-black text-navy-900">{p.patientName}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{p.ward} • Bed {p.bed}</div>
                                            </td>
                                            <td><div className="text-[12px] font-bold text-slate-500 uppercase tracking-tight">Dr. {p.doctorName}</div></td>
                                            <td><span className={`diet-badge ${isNPO ? 'diet-npo' : isRegular ? 'diet-regular' : 'diet-special'}`}>{p.diet}</span></td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button onClick={() => { setEditingPatient(p); setNewDiet(p.diet); }} className="text-[10px] font-black uppercase text-orange-600 tracking-widest hover:text-orange-700 transition-all">Mod Order</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {editingPatient && (
                <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-[420px] rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="bg-orange-600 p-8 flex justify-between items-center text-white">
                            <div>
                                <h3 className="text-xl font-black tracking-tight leading-none mb-1">Nutrition Mod</h3>
                                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{editingPatient.patientName}</p>
                            </div>
                            <button onClick={() => setEditingPatient(null)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"><X size={20} /></button>
                        </div>
                        <form onSubmit={updateDiet} className="p-8 space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Prescribed Diet Sequence</label>
                                <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-navy-900 outline-none focus:border-orange-500 transition-all" value={newDiet} onChange={e => setNewDiet(e.target.value)}>
                                    {DIET_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <button type="submit" disabled={saving} className="w-full py-4 bg-navy-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-xl shadow-navy-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                {saving ? <RefreshCw size={16} className="animate-spin" /> : <><Save size={16} /> Push Clinical Order</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
