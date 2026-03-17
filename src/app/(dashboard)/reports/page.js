'use client';
import { useState, useEffect } from 'react';
import { Download, TrendingUp, IndianRupee, PieChart, BarChart3, Users, FlaskConical, Pill, RefreshCw, Activity, FileText, CheckCircle2 } from 'lucide-react';

const REPORTS = [
    { name: 'Monthly Revenue Summary', category: 'Finance & Billing', formats: 'CSV', description: 'Complete billing revenue breakdown by service type', downloadType: 'revenue' },
    { name: 'OPD Footfall & Demographics', category: 'Clinical Operations', formats: 'CSV', description: 'Patient visit trends, age groups, gender analysis', downloadType: 'opd' },
    { name: 'Pharmacy Stock Valuation', category: 'Inventory', formats: 'CSV', description: 'Current stock value, expiry risk, and reorder alerts', downloadType: 'pharmacy' },
    { name: 'Lab Test Utilization Report', category: 'Diagnostics', formats: 'CSV', description: 'Test frequency, turnaround time, and pending status', downloadType: 'lab' },
    { name: 'IPD Admissions Report', category: 'Clinical Operations', formats: 'CSV', description: 'IPD admissions, ward/bed assignments, and status', downloadType: 'ipd' },
    { name: 'Staff Directory Export', category: 'HR & Staffing', formats: 'CSV', description: 'Complete staff listing with roles and departments', downloadType: 'staff' },
    { name: 'Outstanding Dues & Collections', category: 'Finance & Billing', formats: 'CSV', description: 'Pending invoice aging and recovery tracking', downloadType: 'dues' },
];

function StatCard({ icon, label, value, color, sub }) {
    return (
        <div className="stat-card" style={{ padding: '20px' }}>
            <div style={{ background: `${color}18`, color, padding: '10px', borderRadius: '10px', width: 'fit-content', marginBottom: '12px' }}>{icon}</div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>{label}</p>
            <h4 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{value}</h4>
            {sub && <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>{sub}</p>}
        </div>
    );
}

export default function ReportsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('All');
    const [running, setRunning] = useState(null);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/reports/stats');
            if (res.ok) setStats(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchStats(); }, []);

    const handleRun = async (report) => {
        setRunning(report.name);
        try {
            const res = await fetch(`/api/reports/download?type=${report.downloadType}`);
            if (!res.ok) {
                const err = await res.json();
                alert('Error generating report: ' + (err.error || 'Unknown error'));
                return;
            }
            // Extract filename from Content-Disposition header
            const disposition = res.headers.get('Content-Disposition') || '';
            const filenameMatch = disposition.match(/filename="(.+?)"/);
            const filename = filenameMatch ? filenameMatch[1] : `${report.downloadType}-report.csv`;

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            alert('Download failed: ' + e.message);
        } finally {
            setRunning(null);
        }
    };

    const categories = ['All', 'Finance & Billing', 'Clinical Operations', 'Inventory', 'Diagnostics', 'HR & Staffing'];

    const filteredReports = REPORTS.filter(r => {
        const q = search.toLowerCase();
        const matchSearch = !q || r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
        const matchCat = filterCat === 'All' || r.category === filterCat;
        return matchSearch && matchCat;
    });

    const fmt = (n) => n === undefined || n === null ? '—' : Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
    const fmtCurr = (n) => n === undefined || n === null ? '—' : `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Analytics & Reports Central</h1>
                    <p className="page-header__subtitle">Comprehensive insights into clinical, operational, and financial performance metrics.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={fetchStats}><RefreshCw size={14} /> Refresh</button>
                    <button className="btn btn-primary btn-sm"><Download size={15} strokeWidth={1.5} /> Export All</button>
                </div>
            </div>

            {/* Live KPI Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <StatCard icon={<Users size={20} />} label="Total Patients" value={loading ? '…' : fmt(stats?.totalPatients)} color="#0EA5E9" sub={`${fmt(stats?.opdCount)} OPD · ${fmt(stats?.ipdCount)} IPD`} />
                <StatCard icon={<IndianRupee size={20} />} label="Total Revenue" value={loading ? '…' : fmtCurr(stats?.totalRevenue)} color="#16A34A" sub={`${fmtCurr(stats?.pendingRevenue)} pending`} />
                <StatCard icon={<FlaskConical size={20} />} label="Lab Requests" value={loading ? '…' : fmt(stats?.labRequests)} color="#8B5CF6" sub={`${fmt(stats?.labPending)} pending · ${fmt(stats?.labReady)} ready`} />
                <StatCard icon={<Pill size={20} />} label="Pharmacy SKUs" value={loading ? '…' : fmt(stats?.medicines)} color="#F59E0B" sub={`${fmt(stats?.dispensationCount)} dispensations`} />
                <StatCard icon={<Activity size={20} />} label="Active Staff" value={loading ? '…' : fmt(stats?.staff)} color="#EC4899" />
                <StatCard icon={<BarChart3 size={20} />} label="Invoices Issued" value={loading ? '…' : fmt(stats?.invoiceCount)} color="#3B82F6" sub={`Billing revenue: ${fmtCurr(stats?.billingRevenue)}`} />
            </div>

            {/* Revenue by service type */}
            {stats?.byService && Object.keys(stats.byService).length > 0 && (
                <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PieChart size={18} color="#3B82F6" /> Revenue by Service Type
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        {Object.entries(stats.byService).map(([type, amount]) => (
                            <div key={type} style={{ padding: '12px 20px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #e2e8f0', minWidth: '160px' }}>
                                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{type}</div>
                                <div style={{ fontSize: '18px', fontWeight: 700, color: '#16A34A' }}>₹{Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Report Templates */}
            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
                        <input type="text" placeholder="Search reports by name or category..." value={search} onChange={e => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '11px 16px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {categories.map(c => (
                            <button key={c} onClick={() => setFilterCat(c)} style={{
                                padding: '7px 12px', borderRadius: '8px', border: '1px solid', fontSize: '12px', cursor: 'pointer', fontWeight: 500,
                                borderColor: filterCat === c ? 'var(--color-navy)' : 'var(--color-border-light)',
                                background: filterCat === c ? 'var(--color-navy)' : '#fff',
                                color: filterCat === c ? '#fff' : 'var(--color-text-secondary)',
                            }}>{c}</button>
                        ))}
                    </div>
                </div>

                <div className="data-table-wrapper" style={{ borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
                            <tr>
                                <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Report Name</th>
                                <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Category</th>
                                <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Formats</th>
                                <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.map(r => (
                                <tr key={r.name} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.15s' }}
                                    onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'}
                                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '7px', borderRadius: '8px' }}><FileText size={16} /></div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{r.name}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{r.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}><span className="badge badge-navy" style={{ fontSize: '11px', padding: '3px 8px' }}>{r.category}</span></td>
                                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-text-secondary)' }}>{r.formats}</td>
                                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                        <button className="btn btn-primary btn-sm" style={{ fontSize: '12px', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                            disabled={running === r.name} onClick={() => handleRun(r)}>
                                            {running === r.name
                                                ? <><span style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Generating...</>
                                                : <><Download size={13} /> Download CSV</>}
                                        </button>
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
