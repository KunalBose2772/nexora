'use client';
import { useState, useEffect } from 'react';
import { FlaskConical, Filter, Plus, Search, MoreVertical, FileText, CheckCircle2, Clock, RefreshCw, Activity, Cpu, Bug, Microchip, ExternalLink, ShieldAlert, Siren, Ghost, Monitor, LayoutDashboard, Database, LayoutTemplate, Loader2, Microscope, Beaker, Dna, ArrowRightLeft } from 'lucide-react';
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
        <div className="fade-in pb-20">
            <style jsx>{`
                .flux-pulse { animation: flux-glow 2s infinite; }
                @keyframes flux-glow {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.02); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .lab-action-btn {
                    height: 38px;
                    padding: 0 16px;
                    border-radius: 10px;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>

            <div className="dashboard-header-row mb-10">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '52px', height: '52px', background: 'var(--color-navy)', color: '#fff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                        <FlaskConical size={24} />
                    </div>
                    <div>
                        <h1 className="responsive-h1" style={{ margin: 0 }}>Diagnostic Hub</h1>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0', fontWeight: 500 }}>High-throughput laboratory ops and real-time biometric tracking.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons" style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={fetchLabRequests} className="btn btn-secondary shadow-sm" style={{ background: '#fff', color: 'var(--color-navy)', borderRadius: '12px', height: '44px', padding: '0 20px' }}>
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} style={{ marginRight: '8px' }} /> Sync LIS Bridge
                    </button>
                    <Link href="/laboratory/microbiology" className="btn btn-secondary shadow-sm" style={{ background: '#fff', color: 'var(--color-navy)', borderRadius: '12px', height: '44px', padding: '0 20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Bug size={16} style={{ color: '#6366F1' }} /> Bio-Governance
                    </Link>
                    <Link href="/laboratory/new" className="btn btn-primary" style={{ background: 'var(--color-navy)', borderRadius: '12px', height: '44px', padding: '0 24px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Initiate Test
                    </Link>
                </div>
            </div>

            <div className="kpi-grid mb-10">
                {[
                    { label: 'Throughput', value: kpiCounts.active, sub: 'In-Flux Diagnostic Units', icon: Activity, color: '#0EA5E9' },
                    { label: 'Collection Lag', value: kpiCounts.pending, sub: 'Samples Awaiting Triage', icon: Clock, color: '#F59E0B' },
                    { label: 'Validation Yield', value: kpiCounts.ready, sub: 'Verified Path-Reports', icon: CheckCircle2, color: '#10B981' },
                    { label: 'LIS Integrity', value: '100%', sub: 'Real-time Sync Active', icon: Database, color: '#6366F1' },
                ].map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="kpi-card shadow-premium" style={{ border: '1px solid #F1F5F9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} style={{ color: card.color }} strokeWidth={2.5} />
                                </div>
                                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--color-navy)', lineHeight: 1, marginBottom: '6px' }}>
                                {loading ? <Loader2 size={24} className="animate-spin text-slate-200" /> : card.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 400 }}>{card.sub}</div>
                        </div>
                    );
                })}
            </div>

            <div className="card shadow-premium" style={{ padding: '0', overflow: 'hidden', border: '1px solid #F1F5F9' }}>
                <div style={{ padding: '24px', background: '#fff', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                        <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                            type="text" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            placeholder="Search diagnostic ledger by Tracking ID, Patient or Test Name..." 
                            style={{ width: '100%', padding: '12px 16px 12px 48px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', outline: 'none', fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }} 
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {statuses.map(s => (
                            <button key={s} onClick={() => setFilterStatus(s)} style={{ height: '42px', padding: '0 16px', borderRadius: '10px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: filterStatus === s ? '1px solid var(--color-navy)' : '1px solid #E2E8F0', background: filterStatus === s ? 'var(--color-navy)' : '#fff', color: filterStatus === s ? '#fff' : '#94A3B8', transition: 'all 0.2s' }}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="responsive-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ paddingLeft: '24px' }}>Logistics Registry</th>
                                <th>Biological Subject</th>
                                <th>Diagnostic Profile</th>
                                <th>Processing State</th>
                                <th style={{ textAlign: 'right', paddingRight: '24px' }}>Workflow</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i}>
                                        <td colSpan="5" style={{ padding: '16px 24px' }}><Skeleton className="h-4 w-full" /></td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '100px 24px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', color: '#cbd5e1' }}>
                                            <Microchip size={64} strokeWidth={1} />
                                            <div style={{ fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>No biometric data correlated</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((row) => {
                                    const next = nextStatus(row.status);
                                    const isFlux = row.status === 'Pending' || row.status === 'Processing';
                                    return (
                                        <tr key={row.id} className="interactive-row">
                                            <td style={{ paddingLeft: '24px' }}>
                                                <div style={{ color: 'var(--color-navy)', fontWeight: 600, fontSize: '13px', fontFamily: 'monospace', letterSpacing: '-0.02em' }}>#{row.trackingId}</div>
                                                <div style={{ color: '#94A3B8', fontWeight: 500, fontSize: '10px', textTransform: 'uppercase', marginTop: '4px' }}>Logged: {new Date(row.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td>
                                                <div style={{ color: 'var(--color-navy)', fontWeight: 600, fontSize: '14px' }}>{row.patientName}</div>
                                                <div style={{ color: '#94A3B8', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', marginTop: '2px' }}>UHID: {row.patientUhId || 'TRANS-GUEST'}</div>
                                            </td>
                                            <td>
                                                <div style={{ color: 'var(--color-navy)', fontWeight: 500, fontSize: '13px' }}>{row.testName}</div>
                                                <div style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '6px', background: '#F1F5F9', color: '#475569', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', marginTop: '4px', border: '1px solid #E2E8F0' }}>{row.category}</div>
                                            </td>
                                            <td>
                                                <div className={`status-badge ${STATUS_COLORS[row.status] || 'status-pending'} ${isFlux ? 'flux-pulse' : ''}`} style={{ 
                                                    padding: '4px 12px',
                                                    borderRadius: '8px',
                                                    fontSize: '10px',
                                                    fontWeight: 900,
                                                    textTransform: 'uppercase',
                                                    background: row.status === 'Pending' ? '#FFF7ED' : row.status === 'Processing' ? '#F1F5F9' : row.status === 'Result Ready' ? '#F0FDF4' : '#F0F9FF',
                                                    color: row.status === 'Pending' ? '#F97316' : row.status === 'Processing' ? '#475569' : row.status === 'Result Ready' ? '#10B981' : '#0EA5E9',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}>
                                                    {row.status === 'Processing' && <Activity size={10} className="animate-spin" />}
                                                    {row.status}
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                    {row.testResults && <Dna size={16} style={{ color: '#0EA5E9' }} className="animate-pulse" />}
                                                    {next ? (
                                                        <button onClick={() => handleStatusUpdate(row.id, next)} disabled={updatingId === row.id} className="lab-action-btn" style={{ background: 'var(--color-navy)', color: '#fff' }}>
                                                            {updatingId === row.id ? <Loader2 size={12} className="animate-spin" /> : <ArrowRightLeft size={14} />} 
                                                            {next}
                                                        </button>
                                                    ) : (
                                                        <Link href={`/laboratory/reports/${row.id}`} style={{ textDecoration: 'none' }}>
                                                            <button className="lab-action-btn" style={{ background: '#F0FDF4', color: '#10B981', border: '1px solid #DCFCE7' }}>
                                                                <FileText size={14} /> Audit
                                                            </button>
                                                        </Link>
                                                    )}
                                                    <button className="btn-circle-secondary" style={{ width: '38px', height: '38px', background: '#F8FAFC', color: '#94A3B8', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </div>
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
    );
}
