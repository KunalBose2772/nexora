'use client';
import { useState, useEffect } from 'react';
import { Download, TrendingUp, IndianRupee, PieChart, BarChart3, Users, FlaskConical, Pill, RefreshCw, Activity, FileText, CheckCircle2, Search, ArrowRight, MousePointer2, ChevronRight, LayoutDashboard, Database, ShieldCheck, Siren, Ghost, Monitor, LayoutTemplate, Zap, FileSpreadsheet } from 'lucide-react';
import Skeleton from '@/components/common/Skeleton';
import Link from 'next/link';

const REPORTS = [
    { name: 'Monthly Revenue Summary', category: 'Finance & Billing', formats: 'CSV', description: 'Complete billing revenue breakdown by service type', downloadType: 'revenue' },
    { name: 'OPD Footfall & Demographics', category: 'Clinical Operations', formats: 'CSV', description: 'Patient visit trends, age groups, gender analysis', downloadType: 'opd' },
    { name: 'Pharmacy Stock Valuation', category: 'Inventory', formats: 'CSV', description: 'Current stock value, expiry risk, and reorder alerts', downloadType: 'pharmacy' },
    { name: 'Lab Test Utilization Report', category: 'Diagnostics', formats: 'CSV', description: 'Test frequency, turnaround time, and pending status', downloadType: 'lab' },
    { name: 'IPD Admissions Report', category: 'Clinical Operations', formats: 'CSV', description: 'IPD admissions, ward/bed assignments, and status', downloadType: 'ipd' },
    { name: 'Staff Directory Export', category: 'HR & Staffing', formats: 'CSV', description: 'Complete staff listing with roles and departments', downloadType: 'staff' },
    { name: 'Outstanding Dues & Collections', category: 'Finance & Billing', formats: 'CSV', description: 'Pending invoice aging and recovery tracking', downloadType: 'dues' },
];

export default function ReportsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('All');
    const [running, setRunning] = useState(null);
    const [userRole, setUserRole] = useState('nurse');

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/reports/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
                if (data.userRole) setUserRole(data.userRole.toLowerCase());
            }
        } catch (e) { }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchStats(); }, []);

    const handleRun = async (report) => {
        setRunning(report.name);
        try {
            const res = await fetch(`/api/reports/download?type=${report.downloadType}`);
            if (!res.ok) return;
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${report.downloadType}-report.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } finally { setRunning(null); }
    };

    const categories = ['All', 'Finance & Billing', 'Clinical Operations', 'Inventory', 'Diagnostics', 'HR & Staffing'];

    const filteredReports = REPORTS.filter(r => {
        const isFinancial = r.category === 'Finance & Billing';
        const isAdmin = ['admin', 'hospital_admin', 'accountant'].includes(userRole);
        if (isFinancial && !isAdmin) return false;
        const q = search.toLowerCase();
        const matchSearch = !q || r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
        const matchCat = filterCat === 'All' || r.category === filterCat;
        return matchSearch && matchCat;
    });

    const fmt = (n) => n === undefined || n === null ? '—' : Number(n).toLocaleString('en-IN');
    const fmtCurr = (n) => n === undefined || n === null ? '—' : `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

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
                .revenue-item {
                    background: #fff;
                    border: 1px solid var(--color-border-light);
                    border-radius: 16px;
                    padding: 20px;
                    min-width: 200px;
                    flex: 1;
                    transition: all 0.3s ease;
                }
                .revenue-item:hover {
                    border-color: #0EA5E9;
                    box-shadow: 0 10px 30px -10px rgba(14, 165, 233, 0.15);
                }
            `}</style>

            <div className="dashboard-header-row mb-8">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <BarChart3 size={32} className="text-indigo-500" />
                        Intelligence & Analytics Unit
                    </h1>
                    <p className="page-header__subtitle">High-fidelity clinical telemetry, institutional revenue analysis and governance reporting.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button onClick={fetchStats} className="btn btn-secondary btn-sm h-11 px-6 bg-white border-slate-200 text-slate-600">
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync Intelligence
                    </button>
                    <button className="btn btn-secondary btn-sm h-11 px-6 bg-white text-navy-900 border-slate-200">
                        <Database size={14} /> Warehouse
                    </button>
                    <button className="btn btn-primary btn-sm h-11 px-8 flex items-center gap-2">
                        <Download size={15} /> Mass Export
                    </button>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="kpi-card" style={{ borderLeft: '4px solid #0EA5E9' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-sky-600/70">Aggregate Registry</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="80px" height="32px" /> : <h2 className="text-2xl font-black text-navy-900 leading-none">{fmt(stats?.totalPatients)}</h2>}
                        <span className="text-xs font-semibold text-slate-400">Total Subjects</span>
                    </div>
                </div>

                <div className="kpi-card" style={{ borderLeft: '4px solid #10B981' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-emerald-600/70">Capillary Yield</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="80px" height="32px" /> : <h2 className="text-2xl font-black text-emerald-600 leading-none">{fmtCurr(stats?.totalRevenue)}</h2>}
                    </div>
                </div>

                <div className="kpi-card" style={{ borderLeft: '4px solid #8B5CF6' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-indigo-600/70">Diagnostic Flux</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="80px" height="32px" /> : <h2 className="text-2xl font-black text-indigo-600 leading-none">{fmt(stats?.labRequests)}</h2>}
                        <span className="text-xs font-semibold text-slate-400">Labs</span>
                    </div>
                </div>

                <div className="kpi-card" style={{ borderLeft: '4px solid #F59E0B' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-amber-600/70">Asset Valuation</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="80px" height="32px" /> : <h2 className="text-2xl font-black text-amber-600 leading-none">{fmt(stats?.medicines)}</h2>}
                        <span className="text-xs font-semibold text-slate-400">SKUs</span>
                    </div>
                </div>
            </div>

            {/* Revenue Distribution */}
            {stats?.byService && Object.keys(stats.byService).length > 0 && (
                <div className="card p-8 mb-8 shadow-2xl shadow-slate-200/50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-black text-navy-900 uppercase tracking-widest flex items-center gap-3">
                            <PieChart size={18} className="text-blue-500" /> Unit Revenue Allocation
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Integration</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {Object.entries(stats.byService).map(([type, amount]) => (
                            <div key={type} className="revenue-item border-l-4 border-l-sky-500 bg-slate-50/30">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{type}</div>
                                <div className="text-xl font-black text-navy-900">₹{Number(amount).toLocaleString('en-IN')}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="card shadow-2xl shadow-slate-200/50">
                <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-1 min-w-[320px]">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Ledger by Report Name, Unit or Logic..." className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-cyan-500 transition-all shadow-sm" />
                    </div>
                    <div className="flex gap-2">
                        {categories.map(c => (
                            <button key={c} onClick={() => setFilterCat(c)} className={`h-11 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterCat === c ? 'bg-navy-900 text-white shadow-xl' : 'bg-white border border-slate-200 text-slate-400'}`}>
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="data-table-wrapper border-none">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Intelligence Unit</th>
                                <th>Classification</th>
                                <th>Format</th>
                                <th style={{ textAlign: 'right' }}>Telemetry Execution</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.map(r => (
                                <tr key={r.name} className="hover:bg-slate-50 transition-all cursor-pointer">
                                    <td>
                                        <div className="flex gap-4 items-center">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-100">
                                                <FileSpreadsheet size={18} />
                                            </div>
                                            <div>
                                                <div className="text-[14px] font-black text-navy-900">{r.name}</div>
                                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mt-1">{r.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="h-7 px-3 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest flex items-center w-fit border border-slate-200">{r.category}</span>
                                    </td>
                                    <td>
                                        <div className="text-[11px] font-black text-navy-900 font-mono italic">{r.formats}</div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button onClick={() => handleRun(r)} disabled={running === r.name} className="h-10 px-6 rounded-xl bg-navy-900 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-navy-100 disabled:opacity-50 hover:scale-105 transition-all flex items-center justify-center gap-2 ml-auto">
                                            {running === r.name ? (
                                                <><RefreshCw size={12} className="animate-spin" /> Computing...</>
                                            ) : (
                                                <><Download size={14} /> Fetch Telemetry</>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 p-6 bg-emerald-50/50 border border-emerald-100 rounded-[20px] flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200"><ShieldCheck size={20} /></div>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-tight leading-relaxed">
                    Governance Audit: All intelligence exports are tracked with a bio-metric timestamp. Financial data nodes are restricted to Administrative Command only.
                    <Link href="/audit-logs" className="ml-3 text-emerald-600 underline font-black">Audit Trails</Link>
                </p>
            </div>
        </div>
    );
}
