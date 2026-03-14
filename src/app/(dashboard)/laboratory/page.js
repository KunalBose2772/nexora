'use client';
import { useState, useEffect } from 'react';
import { FlaskConical, Filter, Plus, Search, MoreVertical, FileText, CheckCircle2, Clock, RefreshCw, Activity, Cpu, Bug, Microchip, ExternalLink, ShieldAlert, Siren, Ghost, Monitor, LayoutDashboard, Database, LayoutTemplate, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Skeleton from '@/components/common/Skeleton';

const STATUS_COLORS = {
    'Pending': 'status-pending',
    'Processing': 'status-processing',
    'Result Ready': 'status-ready',
    'Report Dispatched': 'status-dispatched',
};

export default function LaboratoryPage() {
    const [labRequests, setLabRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [updatingId, setUpdatingId] = useState(null);

    const fetchLabRequests = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/laboratory');
            if (res.ok) {
                const data = await res.json();
                setLabRequests(data.labRequests || []);
            }
        } catch (err) { }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchLabRequests(); }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            const res = await fetch('/api/laboratory', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
            if (res.ok) {
                setLabRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
            }
        } finally { setUpdatingId(null); }
    };

    const filtered = labRequests.filter(r => {
        const q = searchQuery.toLowerCase();
        const matchSearch = !q || r.trackingId.toLowerCase().includes(q) || r.patientName.toLowerCase().includes(q) || r.testName.toLowerCase().includes(q);
        const matchStatus = filterStatus === 'All' || r.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const statuses = ['All', 'Pending', 'Processing', 'Result Ready', 'Report Dispatched'];

    const kpiCounts = {
        active: labRequests.filter(r => r.status === 'Pending' || r.status === 'Processing').length,
        pending: labRequests.filter(r => r.status === 'Pending').length,
        ready: labRequests.filter(r => r.status === 'Result Ready' || r.status === 'Report Dispatched').length,
    };

    const nextStatus = (current) => {
        const flow = ['Pending', 'Processing', 'Result Ready', 'Report Dispatched'];
        const idx = flow.indexOf(current);
        return idx < flow.length - 1 ? flow[idx + 1] : null;
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
                .status-badge {
                    padding: 4px 10px;
                    border-radius: 8px;
                    font-size: 10px;
                    font-weight: 901;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }
                .status-pending { background: #FFF7ED; color: #F97316; border: 1px solid #FFEDD5; }
                .status-processing { background: #F1F5F9; color: #475569; border: 1px solid #E2E8F0; }
                .status-ready { background: #F0FDF4; color: #10B981; border: 1px solid #DCFCE7; }
                .status-dispatched { background: #F0F9FF; color: #0EA5E9; border: 1px solid #E0F2FE; }
            `}</style>

            <div className="dashboard-header-row mb-8">
                <div>
                    <h1 className="responsive-h1">
                        Laboratory Diagnostic Hub
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>High-throughput clinical diagnostics and LIS-integrated sample tracking.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button onClick={fetchLabRequests} className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync LIS Bridge
                    </button>
                    <Link href="/laboratory/microbiology" className="btn btn-secondary btn-sm bg-white" style={{ textDecoration: 'none' }}>
                        <Bug size={14} className="text-indigo-500" /> Bio-Governance
                    </Link>
                    <Link href="/laboratory/new" className="btn btn-primary btn-sm flex items-center gap-2" style={{ textDecoration: 'none' }}>
                        <Plus size={15} strokeWidth={1.5} /> Initiate Test
                    </Link>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="kpi-grid" style={{ marginBottom: '28px' }}>
                {[
                    { label: 'Throughput', value: kpiCounts.active, sub: 'Tests in Flux', icon: Activity, color: '#0EA5E9' },
                    { label: 'Collection Latency', value: kpiCounts.pending, sub: 'Samples Awaiting', icon: Clock, color: '#F59E0B' },
                    { label: 'Yield Success', value: kpiCounts.ready, sub: 'Validated Reports', icon: CheckCircle2, color: '#10B981' },
                ].map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="kpi-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} style={{ color: card.color }} strokeWidth={1.5} />
                                </div>
                                <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>{card.label}</span>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1, marginBottom: '6px' }}>
                                {loading ? <Loader2 size={22} className="animate-spin text-muted" /> : card.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94A3B8' }}>{card.sub}</div>
                        </div>
                    );
                })}
            </div>

            <div className="card shadow-2xl shadow-slate-200/50">
                <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search Ledger by Tracking ID, Patient or Diagnostic Unit..." className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest outline-none focus:border-cyan-500 transition-all shadow-sm" />
                    </div>
                    <div className="flex gap-2">
                        {statuses.map(s => (
                            <button key={s} onClick={() => setFilterStatus(s)} className={`h-10 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-navy-900 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-400'}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="data-table-wrapper border-none">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Registry ID</th>
                                <th>Subject Demographics</th>
                                <th>Diagnostic Profile</th>
                                <th>Molecular State</th>
                                <th style={{ textAlign: 'right' }}>Workflow Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="5"><Skeleton height="20px" /></td></tr>) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-20 bg-slate-50/30">
                                        <div className="flex flex-col items-center gap-4 text-slate-300">
                                            <FlaskConical size={64} strokeWidth={1} />
                                            <p className="text-sm font-black uppercase tracking-[0.2em]">Zero Data Correlation Found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map(row => {
                                const next = nextStatus(row.status);
                                return (
                                    <tr key={row.id} className="hover:bg-slate-50 transition-all cursor-pointer">
                                        <td>
                                            <div className="text-[13px] font-black text-navy-900 font-mono tracking-tighter">{row.trackingId}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">{new Date(row.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td>
                                            <div className="text-[14px] font-black text-navy-900">{row.patientName}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">{row.patientUhId || 'TRANS-GUEST'}</div>
                                        </td>
                                        <td>
                                            <div className="text-[13px] font-black text-slate-600">{row.testName}</div>
                                            <div className="text-[10px] font-bold text-cyan-600 uppercase mt-1 tracking-widest">{row.category}</div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${STATUS_COLORS[row.status] || 'status-pending'}`}>
                                                {row.status === 'Processing' && <Activity size={10} className="animate-spin" />}
                                                {row.status}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div className="flex gap-2 justify-end items-center">
                                                {row.testResults && <Microchip size={16} className="text-cyan-400 animate-pulse" />}
                                                {next ? (
                                                    <button onClick={() => handleStatusUpdate(row.id, next)} disabled={updatingId === row.id} className="h-9 px-4 rounded-lg bg-navy-900 text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-navy-200 disabled:opacity-50">
                                                        {updatingId === row.id ? 'Updating...' : `Pivot to ${next}`}
                                                    </button>
                                                ) : (
                                                    <Link href={`/laboratory/reports/${row.id}`}>
                                                        <button className="h-9 px-4 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-emerald-100 transition-all">Audit Report</button>
                                                    </Link>
                                                )}
                                                <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:text-navy-900 transition-all"><MoreVertical size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
