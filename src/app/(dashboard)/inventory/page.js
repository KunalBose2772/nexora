'use client';
import { Package, Truck, ShoppingCart, AlertTriangle, Plus, Search, Filter, ArrowUpRight, Users, FileText, MoreVertical, BarChart3, RefreshCw, Layers, ShieldCheck, Warehouse, TrendingUp, Boxes, LayoutDashboard, Database, Siren, Ghost, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Skeleton from '@/components/common/Skeleton';

export default function InventoryDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/inventory');
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filtered = data?.inventory.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.drugCode.toLowerCase().includes(search.toLowerCase())
    );

    const stats = {
        total: data?.stats?.totalItems || 0,
        low: data?.stats?.lowStock || 0,
        pos: data?.stats?.activePOs || 0,
        suppliers: data?.suppliers?.length || 0,
        valuation: '12,45,200'
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
                .inventory-row {
                    transition: all 0.2s;
                    cursor: pointer;
                }
                .inventory-row:hover {
                    background: #F8FAFC;
                }
                .progress-bar {
                    height: 5px;
                    background: #F1F5F9;
                    border-radius: 10px;
                    overflow: hidden;
                    margin-top: 8px;
                }
                .progress-fill {
                    height: 100%;
                    transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .side-card {
                    background: #fff;
                    border: 1px solid var(--color-border-light);
                    border-radius: 24px;
                    padding: 24px;
                }
            `}</style>

            <div className="dashboard-header-row mb-8">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Warehouse size={32} className="text-cyan-500" />
                        Supply Chain Command
                    </h1>
                    <p className="page-header__subtitle">Real-time inventory orchestration, SKU tracking, and procurement pipeline management.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={fetchData}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync Stores
                    </button>
                    <Link href="/pharmacy/procurement" className="btn btn-primary btn-sm flex items-center gap-2" style={{ textDecoration: 'none' }}>
                        <ShoppingCart size={15} strokeWidth={1.5} /> Procurement Hub
                    </Link>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="kpi-card" style={{ borderLeft: '4px solid #0EA5E9' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-sky-600/70">Stock Volume</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-navy-900 leading-none">{stats.total}</h2>}
                        <span className="text-xs font-semibold text-slate-400">SKUs</span>
                    </div>
                </div>
                <div className="kpi-card" style={{ borderLeft: '4px solid #EF4444' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-red-600/70">Critical Replenish</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-red-600 leading-none">{stats.low}</h2>}
                        <span className="text-xs font-semibold text-red-500 animate-pulse">Required</span>
                    </div>
                </div>
                <div className="kpi-card" style={{ borderLeft: '4px solid #F59E0B' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-amber-600/70">Active Procurement</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-amber-600 leading-none">{stats.pos}</h2>}
                        <span className="text-xs font-semibold text-slate-400">Open POs</span>
                    </div>
                </div>
                <div className="kpi-card" style={{ borderLeft: '4px solid #10B981' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-emerald-600/70">Supply Network</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-emerald-600 leading-none">{stats.suppliers}</h2>}
                        <span className="text-xs font-semibold text-slate-400">Vendors</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 flex flex-col gap-6">
                    <div className="card">
                        <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 items-center">
                            <div className="relative flex-1 min-w-[300px]">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input placeholder="Scan by Item Name, Drug Code, or Manufacturer SKU..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:border-cyan-500 outline-none transition-all shadow-sm" />
                            </div>
                            <button className="btn btn-secondary btn-sm h-11 px-5 border-slate-200 bg-white">
                                <Filter size={16} /> Filter Modules
                            </button>
                        </div>
                        <div className="data-table-wrapper border-none">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Asset Registry</th>
                                        <th>Logistics Category</th>
                                        <th>Inventory Velocity</th>
                                        <th>Valuation</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="5"><Skeleton height="20px" /></td></tr>) : filtered?.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest">Stores Clear</td></tr>
                                    ) : (
                                        filtered?.map(item => {
                                            const stockPercent = Math.min((item.stock / (item.minThreshold * 2)) * 100, 100);
                                            const isLow = item.stock <= item.minThreshold;
                                            return (
                                                <tr key={item.id} className="inventory-row">
                                                    <td>
                                                        <div className="text-[14px] font-black text-navy-900">{item.name}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter mt-1 uppercase">CODE: {item.drugCode} • EXP: {item.expiryDate || 'PERPETUAL'}</div>
                                                    </td>
                                                    <td><span className="badge badge-navy">{item.category}</span></td>
                                                    <td style={{ width: '220px' }}>
                                                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-tight">
                                                            <span className={isLow ? 'text-red-500' : 'text-navy-900'}>{item.stock} UNITS</span>
                                                            {isLow && <span className="text-red-500 animate-pulse">Critical</span>}
                                                        </div>
                                                        <div className="progress-bar">
                                                            <div className={`progress-fill ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${stockPercent}%` }} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-sm font-black text-navy-900">₹{(item.stock * item.mrp).toLocaleString()}</div>
                                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">MRP: ₹{item.mrp}</div>
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 text-slate-300 hover:text-navy-900 transition-all ml-auto"><MoreVertical size={18} /></button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="side-card bg-navy-900 text-white border-none shadow-xl shadow-navy-900/10">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500 mb-6">
                            <TrendingUp size={16} /> Asset Valuation Flux
                        </div>
                        <div className="mb-8">
                            <h2 className="text-3xl font-black tracking-tight leading-none mb-2">₹{stats.valuation}</h2>
                            <p className="text-xs font-bold text-slate-400 leading-relaxed italic">Aggregated real-time valuation across all pharmacy and surgical stores.</p>
                        </div>
                        <div className="space-y-4 pt-6 border-t border-white/5">
                            <div className="flex justify-between items-center text-[12px] font-bold">
                                <span className="text-slate-400">Pharmacy Main</span>
                                <span>₹8,20,000</span>
                            </div>
                            <div className="flex justify-between items-center text-[12px] font-bold">
                                <span className="text-slate-400">Surgical Block</span>
                                <span>₹4,25,200</span>
                            </div>
                        </div>
                    </div>

                    <div className="side-card">
                        <h3 className="text-sm font-black text-navy-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                            <Truck size={18} className="text-cyan-500" /> Procurement Pipeline
                        </h3>
                        <div className="space-y-4">
                            {loading ? [1, 2].map(i => <Skeleton key={i} height="80px" radius="16px" />) :
                                data?.activePOs?.length === 0 ? <p className="text-center py-8 text-xs font-bold text-slate-400 italic">No Active POs</p> :
                                    data?.activePOs?.map(po => (
                                        <div key={po.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-cyan-200 transition-all relative">
                                            <div className="text-[10px] font-black text-cyan-600 uppercase tracking-[0.1em] mb-1">#{po.poNumber}</div>
                                            <div className="text-[13px] font-black text-navy-900 line-clamp-1">{po.supplier?.name}</div>
                                            <div className="flex justify-between items-center mt-3">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{po.status}</span>
                                                <span className="text-xs font-black text-navy-900">₹{po.totalAmount.toLocaleString()}</span>
                                            </div>
                                            <Link href={`/inventory/procurement/${po.id}`} className="absolute top-4 right-4 text-slate-300 group-hover:text-cyan-600 transition-colors"><ArrowUpRight size={16} /></Link>
                                        </div>
                                    ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
