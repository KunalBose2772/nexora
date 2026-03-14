'use client';
import {
    ShieldCheck, Plus, Search, Filter,
    FileText, CheckCircle2, AlertTriangle,
    ArrowRight, Loader2, DollarSign, Building2,
    Lock, FileUp, History, User, Building,
    ChevronRight, Wallet, Activity, CreditCard, RefreshCw, LayoutDashboard, Database
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Skeleton from '@/components/common/Skeleton';

export default function InsuranceManagementPage() {
    const [tpas, setTpas] = useState([]);
    const [preAuths, setPreAuths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('preauth'); // preauth, tpas

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tpasRes, authRes] = await Promise.all([
                fetch('/api/insurance/tpas'),
                fetch('/api/insurance/pre-auth')
            ]);
            const [tpasData, authData] = await Promise.all([tpasRes.json(), authRes.json()]);
            if (tpasRes.ok) setTpas(tpasData.tpas || []);
            if (authRes.ok) setPreAuths(authData.preAuths || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const stats = {
        total: preAuths.length,
        pending: preAuths.filter(p => p.status === 'Pending').length,
        tpas: tpas.length,
        approvedAmount: preAuths.reduce((acc, p) => acc + (p.approvedAmount || 0), 0)
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
                .tab-btn {
                    padding: 16px 32px;
                    font-size: 11px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    color: #94A3B8;
                    border-bottom: 2px solid transparent;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                }
                .tab-btn.active {
                    color: #10B981;
                    border-bottom-color: #10B981;
                    background: #fff;
                }
                .tpa-card {
                    background: #fff;
                    border: 1px solid var(--color-border-light);
                    border-radius: 20px;
                    padding: 24px;
                    transition: all 0.3s ease;
                }
                .tpa-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 24px rgba(0,0,0,0.06);
                    border-color: #10B981;
                }
            `}</style>

            <div className="dashboard-header-row mb-8">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ShieldCheck size={32} className="text-emerald-500" />
                        Insurance & TPA Governance
                    </h1>
                    <p className="page-header__subtitle">Cashless pre-authorization vault, real-time claim reconciliation, and payer network orchestration.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={fetchData}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync Pipeline
                    </button>
                    <button className="btn btn-primary btn-sm" style={{ background: '#10B981', borderColor: '#10B981' }}>
                        <Plus size={15} strokeWidth={1.5} /> New Pre-Auth
                    </button>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="kpi-card" style={{ borderLeft: '4px solid #10B981' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-emerald-600/70">Auth Pipeline</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-navy-900 leading-none">{stats.total}</h2>}
                        <span className="text-xs font-semibold text-slate-400">Total</span>
                    </div>
                </div>
                <div className="kpi-card" style={{ borderLeft: '4px solid #F59E0B' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-amber-600/70">Approval Latency</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-amber-600 leading-none">{stats.pending}</h2>}
                        <span className="text-xs font-semibold text-slate-400">Pending</span>
                    </div>
                </div>
                <div className="kpi-card" style={{ borderLeft: '4px solid #0EA5E9' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-sky-600/70">Provider Network</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-sky-600 leading-none">{stats.tpas}</h2>}
                        <span className="text-xs font-semibold text-slate-400">Active TPAs</span>
                    </div>
                </div>
                <div className="kpi-card" style={{ borderLeft: '4px solid #navy' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Settlement Flux</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="100px" height="32px" /> : <h2 className="text-2xl font-black text-navy-900 leading-none">₹{stats.approvedAmount.toLocaleString()}</h2>}
                    </div>
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="flex bg-slate-50 border-b border-slate-100">
                    <button onClick={() => setActiveTab('preauth')} className={`tab-btn ${activeTab === 'preauth' ? 'active' : ''}`}>Pre-Auth Monitor</button>
                    <button onClick={() => setActiveTab('tpas')} className={`tab-btn ${activeTab === 'tpas' ? 'active' : ''}`}>Network Registry</button>
                </div>

                <div className="p-0">
                    {activeTab === 'preauth' ? (
                        <div className="data-table-wrapper border-none">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Auth Identifier</th>
                                        <th>Patient & Payer</th>
                                        <th>Exposure Horizon</th>
                                        <th>Settlement Flow</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="6"><Skeleton height="20px" /></td></tr>) : preAuths.length === 0 ? (
                                        <tr><td colSpan="6" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest">Pipeline Clear</td></tr>
                                    ) : preAuths.map(p => (
                                        <tr key={p.id}>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <Lock size={12} className="text-slate-300" />
                                                    <span className="font-mono font-black text-[11px] text-navy-900 uppercase">#{p.authCode?.toUpperCase() || 'VAULT_PENDING'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-[14px] font-black text-navy-900">{p.patient?.firstName} {p.patient?.lastName}</div>
                                                    <div className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1.5"><Building size={12} /> {p.tpa?.name}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-xs font-black text-navy-800">{p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : 'Perpetual Flux'}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Expiry Horizon</div>
                                            </td>
                                            <td>
                                                <div className="flex flex-col">
                                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Approved Caps</div>
                                                    <div className="text-[14px] font-black text-navy-900">₹{(p.approvedAmount || 0).toLocaleString()}</div>
                                                </div>
                                            </td>
                                            <td><span className={`badge ${p.status === 'Approved' ? 'badge-green' : 'badge-yellow'}`}>{p.status}</span></td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-navy-900 hover:text-white transition-all ml-auto"><ChevronRight size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {loading ? [1, 2, 3].map(i => <div key={i} className="tpa-card"><Skeleton height="200px" /></div>) : tpas.map(t => (
                                    <div key={t.id} className="tpa-card group">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 flex items-center justify-center transition-colors border border-slate-100 shadow-sm"><Building2 size={24} /></div>
                                            <span className="badge badge-green">{t.status}</span>
                                        </div>
                                        <h3 className="text-lg font-black text-navy-900 mb-1">{t.name}</h3>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">{t.contactEmail || 'No Governance Email'}</p>
                                        <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                                            <div>
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rebate Logic</div>
                                                <div className="text-sm font-black text-emerald-600">{t.discountRate}% Discount</div>
                                            </div>
                                            <button className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-navy-900 text-slate-400 group-hover:text-white flex items-center justify-center transition-all"><ArrowRight size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
