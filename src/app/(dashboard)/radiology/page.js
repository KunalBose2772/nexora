'use client';
import { Activity, Search, Plus, Filter, FileText, CheckCircle2, AlertCircle, ArrowRight, Loader2, Play, Image as LucideImage, ShieldAlert, Clock, MoreVertical, Eye, RefreshCw, ExternalLink, Siren, Ghost, Monitor, LayoutDashboard, Database, LayoutTemplate, Scan } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Skeleton from '@/components/common/Skeleton';

export default function RadiologyDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/radiology/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        } catch (err) { }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchOrders(); }, []);

    const filtered = (orders || []).filter(o =>
        (o.orderCode?.toLowerCase().includes(search.toLowerCase())) ||
        (o.patient?.firstName?.toLowerCase().includes(search.toLowerCase())) ||
        (o.patient?.lastName?.toLowerCase().includes(search.toLowerCase())) ||
        (o.procedureName?.toLowerCase().includes(search.toLowerCase()))
    );

    const kpiStats = {
        pending: orders.filter(o => o.status === 'Pending').length,
        inProgress: orders.filter(o => o.status === 'In-Progress').length,
        completed: orders.filter(o => o.status === 'Completed').length,
        stat: orders.filter(o => o.priority === 'STAT').length
    };

    return (
        <div className="fade-in pb-12">
            <style jsx>{`
                .kpi-card {
                    background: #fff;
                    border: 1px solid var(--color-border-light);
                    border-radius: 20px;
                    padding: 24px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .modality-badge {
                    padding: 4px 10px;
                    border-radius: 8px;
                    font-size: 10px;
                    font-weight: 901;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .status-badge {
                    padding: 4px 10px;
                    border-radius: 8px;
                    font-size: 10px;
                    font-weight: 901;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
            `}</style>

            <div className="dashboard-header-row mb-8">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Scan size={32} className="text-sky-500" />
                        Diagnostic Imaging Command
                    </h1>
                    <p className="page-header__subtitle">PACS-integrated RIS orchestration, modality worklist governance, and radiolology logic.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button onClick={fetchOrders} className="btn btn-secondary btn-sm h-11 px-6 bg-white border-slate-200 text-slate-600">
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync PACS Worklist
                    </button>
                    <Link href="/radiology/modality-worklist" className="btn btn-secondary btn-sm h-11 px-6 bg-white text-navy-900 border-slate-200" style={{ textDecoration: 'none' }}>
                        <LucideImage size={14} /> View Worklist
                    </Link>
                    <Link href="/radiology/orders/new" className="btn btn-primary btn-sm h-11 px-8 flex items-center gap-2" style={{ textDecoration: 'none' }}>
                        <Plus size={15} strokeWidth={1.5} /> Deploy Modality
                    </Link>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="kpi-card" style={{ borderLeft: '4px solid #0EA5E9' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-sky-600/70">Aggregate Load</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-navy-900 leading-none">{orders.length}</h2>}
                        <span className="text-xs font-semibold text-slate-400">Archived</span>
                    </div>
                </div>

                <div className="kpi-card" style={{ borderLeft: '4px solid #EF4444' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-red-600/70">STAT Priority</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-red-600 leading-none">{kpiStats.stat}</h2>}
                        <span className="text-xs font-semibold text-red-400 uppercase animate-pulse">Critical action</span>
                    </div>
                </div>

                <div className="kpi-card" style={{ borderLeft: '4px solid #F59E0B' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-amber-600/70">Live Modalities</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-amber-600 leading-none">{kpiStats.inProgress}</h2>}
                        <span className="text-xs font-semibold text-slate-400 uppercase">In flux</span>
                    </div>
                </div>

                <div className="kpi-card" style={{ borderLeft: '4px solid #10B981' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-emerald-600/70">Report Yield</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-emerald-600 leading-none">{kpiStats.completed}</h2>}
                        <span className="text-xs font-semibold text-slate-400 uppercase">Finalized</span>
                    </div>
                </div>
            </div>

            <div className="card shadow-2xl shadow-slate-200/50">
                <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-1 min-w-[320px]">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Imagery Index by Accession No., Patient or Procedure..." className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-cyan-500 transition-all shadow-sm" />
                    </div>
                    <button className="h-11 px-6 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all flex items-center gap-2">
                        <Filter size={14} /> Modality Filters
                    </button>
                </div>

                <div className="data-table-wrapper border-none">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Accession Registry</th>
                                <th>Subject Demographics</th>
                                <th>Modality</th>
                                <th>Clinical Procedure</th>
                                <th>Lifecycle State</th>
                                <th style={{ textAlign: 'right' }}>PACS Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="6"><Skeleton height="20px" /></td></tr>) : filtered.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-24 text-slate-300 font-bold uppercase tracking-widest text-xs">No imagery correlation detected</td></tr>
                            ) : filtered.map(order => (
                                <tr key={order.id} className="hover:bg-slate-50 transition-all cursor-pointer">
                                    <td>
                                        <div className="text-[14px] font-black text-navy-900 font-mono tracking-tighter flex items-center gap-2">
                                            {order.orderCode}
                                            {order.priority === 'STAT' && <Siren size={14} className="text-outline-red animate-pulse text-red-500" />}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td>
                                        <div className="text-[14px] font-black text-navy-900">{order.patient?.firstName} {order.patient?.lastName}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">{order.patient?.patientCode}</div>
                                    </td>
                                    <td>
                                        <span className="modality-badge" style={{
                                            background: order.modality === 'MRI' ? '#F5F3FF' : order.modality === 'CT' ? '#EFF6FF' : order.modality === 'X-Ray' ? '#FFFBEB' : '#F0FDF4',
                                            color: order.modality === 'MRI' ? '#6D28D9' : order.modality === 'CT' ? '#1D4ED8' : order.modality === 'X-Ray' ? '#B45309' : '#15803D'
                                        }}>
                                            {order.modality}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="text-[13px] font-black text-slate-600">{order.procedureName}</div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${order.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : order.status === 'In-Progress' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                                            {order.status}
                                        </span>
                                        {order.report?.criticalAlert && (
                                            <div className="text-[9px] font-black text-red-600 uppercase mt-1.5 tracking-tighter flex items-center gap-1"><AlertCircle size={10} /> CRITICAL ANOMALY</div>
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div className="flex gap-2 justify-end items-center">
                                            <Link href={`/radiology/${order.id}`}>
                                                <button className={`h-9 px-5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${order.status === 'Completed' ? 'bg-navy-900 text-white' : 'bg-sky-500 text-white shadow-sky-100'}`}>
                                                    {order.status === 'Completed' ? 'Analyze' : 'Acquisition'}
                                                </button>
                                            </Link>
                                            <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:text-navy-900 transition-all"><MoreVertical size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
