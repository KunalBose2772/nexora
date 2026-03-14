'use client';
import { useState, useEffect } from 'react';
import { FlaskConical, Filter, Plus, Search, MoreVertical, FileText, CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const STATUS_COLORS = {
    'Pending': 'badge-yellow',
    'Processing': 'badge-navy',
    'Result Ready': 'badge-green',
    'Report Dispatched': 'badge-green',
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
        } catch (err) {
            console.error('Failed to load lab requests:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLabRequests();
    }, []);

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
        } catch (err) {
            console.error('Status update error:', err);
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = labRequests.filter(r => {
        const matchSearch = !searchQuery ||
            r.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.testName.toLowerCase().includes(searchQuery.toLowerCase());
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
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Pathology & Diagnostics Central</h1>
                    <p className="page-header__subtitle">
                        Track lab test orders, manage sample collection tasks, and dispatch results.
                    </p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" onClick={fetchLabRequests} style={{ background: '#fff' }}>
                        <RefreshCw size={14} /> Refresh
                    </button>
                    <Link href="/laboratory/new" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <Plus size={15} strokeWidth={1.5} />
                        Create Lab Request
                    </Link>
                </div>
            </div>

            {/* KPI Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(56,189,248,0.1)', color: '#0EA5E9', padding: '10px', borderRadius: '10px' }}>
                            <FlaskConical size={20} />
                        </div>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Active Test Orders</p>
                    <h4 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{loading ? '—' : kpiCounts.active}</h4>
                </div>
                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', padding: '10px', borderRadius: '10px' }}>
                            <Clock size={20} />
                        </div>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Samples Pending</p>
                    <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#F59E0B', margin: 0 }}>{loading ? '—' : kpiCounts.pending}</h4>
                </div>
                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', padding: '10px', borderRadius: '10px' }}>
                            <CheckCircle2 size={20} />
                        </div>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Results Ready / Dispatched</p>
                    <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#10B981', margin: 0 }}>{loading ? '—' : kpiCounts.ready}</h4>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                {/* Search + Filter */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
                        <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                        <input
                            type="text"
                            placeholder="Search by Order ID, Patient, or Test Name..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '11px 16px 11px 40px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {statuses.map(s => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                style={{
                                    padding: '8px 14px', borderRadius: '8px', border: '1px solid', fontSize: '13px', cursor: 'pointer', fontWeight: 500,
                                    borderColor: filterStatus === s ? 'var(--color-navy)' : 'var(--color-border-light)',
                                    background: filterStatus === s ? 'var(--color-navy)' : '#fff',
                                    color: filterStatus === s ? '#fff' : 'var(--color-text-secondary)',
                                }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading lab requests...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <FlaskConical size={36} strokeWidth={1} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                        <p>{labRequests.length === 0 ? 'No lab requests yet. Create the first one!' : 'No requests match your search.'}</p>
                    </div>
                ) : (
                    <div className="data-table-wrapper" style={{ borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
                        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
                                <tr>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Tracking ID</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Patient</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Test</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((row) => {
                                    const next = nextStatus(row.status);
                                    return (
                                        <tr
                                            key={row.id}
                                            style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.15s' }}
                                            onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'}
                                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontFamily: 'monospace', fontSize: '13px' }}>{row.trackingId}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{new Date(row.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ fontWeight: 600 }}>{row.patientName}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{row.patientUhId || '—'}</div>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ fontSize: '13px', marginBottom: '4px' }}>{row.testName}</div>
                                                <span className="badge badge-navy" style={{ fontSize: '11px', padding: '2px 6px' }}>{row.category}</span>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span className={`badge ${STATUS_COLORS[row.status] || 'badge-yellow'}`} style={{ padding: '4px 10px', fontSize: '12px' }}>
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                                {next ? (
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        style={{ fontSize: '12px', padding: '6px 12px', background: '#F8FAFC' }}
                                                        disabled={updatingId === row.id}
                                                        onClick={() => handleStatusUpdate(row.id, next)}
                                                    >
                                                        {updatingId === row.id ? '...' : `→ ${next}`}
                                                    </button>
                                                ) : (
                                                    <button className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', fontSize: '12px', background: '#F8FAFC' }}>
                                                        <FileText size={14} /> Report
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
