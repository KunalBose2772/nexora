'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Search, Download, MoreVertical, Building, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function SubscriptionsPage() {
    const router = useRouter();
    const [subs, setSubs] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearch] = useState('');
    const [openActionId, setOpenAction] = useState(null);

    const fetchSubs = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const res = await fetch('/api/subscriptions');
            if (res.status === 401 || res.status === 403) { router.replace('/login'); return; }
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setSubs(data.subscriptions);
            setSummary(data.summary);
        } catch (e) {
            setError('Failed to load subscriptions. ' + e.message);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => { fetchSubs(); }, [fetchSubs]);

    // Update tenant status via PATCH /api/tenants/[id]
    const updateStatus = async (sub, newStatus) => {
        setOpenAction(null);
        try {
            const res = await fetch(`/api/tenants/${sub.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error('Update failed');
            await fetchSubs(); // refresh
        } catch (e) {
            alert('Could not update status: ' + e.message);
        }
    };

    const filteredSubs = subs.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleExport = () => {
        const header = 'Tenant,Slug,Plan,Amount,Status,Users,Patients\n';
        const csv = filteredSubs.map(s =>
            `${s.name},${s.slug},${s.plan},${s.amount},${s.status},${s.users},${s.patients}`
        ).join('\n');
        const blob = new Blob([header + csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'subscriptions-export.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    const statusBadge = (status) => {
        const map = {
            'Active': { bg: '#ECFDF5', color: '#059669' },
            'Suspended': { bg: '#FEF2F2', color: '#DC2626' },
            'Past Due': { bg: '#FFFBEB', color: '#D97706' },
            'Payment Due': { bg: '#FFFBEB', color: '#D97706' },
        };
        return map[status] || { bg: '#F1F5F9', color: '#64748B' };
    };

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="saas-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.02em' }}>Active Subscriptions</h1>
                    <p style={{ color: '#64748B', margin: 0, fontSize: '14px' }}>Monitor recurring billing, invoices, and payment statuses across all tenants.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={fetchSubs} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
                        <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                    </button>
                    <button onClick={handleExport} disabled={loading || subs.length === 0} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', marginBottom: '24px', color: '#DC2626', fontSize: '14px' }}>
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {/* Summary Metrics from DB */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {loading ? (
                    <div style={{ gridColumn: '1/-1', padding: '24px', textAlign: 'center', color: '#94A3B8' }}>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : [
                    { label: 'Active Tenants', value: summary?.active ?? 0, color: '#0F172A' },
                    { label: 'Total Enrolled', value: summary?.total ?? 0, color: '#0F172A' },
                    { label: 'Past Due', value: summary?.pastDue ?? 0, color: '#EF4444' },
                    { label: 'Estimated MRR', value: `₹${(summary?.mrr || 0).toLocaleString('en-IN')}`, color: '#0F172A' },
                ].map((m, i) => (
                    <div key={i} style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                        <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 500, marginBottom: '8px' }}>{m.label}</div>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: m.color }}>{m.value}</div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '11px', color: '#94A3B8' }} />
                        <input value={searchQuery} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search by hospital name, slug, or email…"
                            style={{ width: '100%', padding: '10px 14px 10px 40px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' }}
                            onFocus={e => e.currentTarget.style.borderColor = '#10B981'} onBlur={e => e.currentTarget.style.borderColor = '#E2E8F0'} />
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '14px' }}>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading from database…
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Tenant / Hospital</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Plan</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Est. Amount</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Users / Patients</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '12px 20px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubs.length === 0 ? (
                                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748B', fontSize: '14px' }}>No subscriptions found.</td></tr>
                            ) : filteredSubs.map((sub) => {
                                const badge = statusBadge(sub.status);
                                return (
                                    <tr key={sub.id} style={{ borderBottom: '1px solid #E2E8F0' }}
                                        onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'}
                                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', flexShrink: 0 }}>
                                                    <Building size={16} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{sub.name}</div>
                                                    <div style={{ fontSize: '12px', color: '#64748B' }}>/{sub.slug} · {sub.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 20px', fontSize: '14px', color: '#334155', fontWeight: 500 }}>{sub.plan}</td>
                                        <td style={{ padding: '14px 20px', fontSize: '14px', color: '#0F172A', fontWeight: 700 }}>{sub.amount}/mo</td>
                                        <td style={{ padding: '14px 20px', fontSize: '13px', color: '#64748B' }}>{sub.users} users · {sub.patients} patients</td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: badge.bg, color: badge.color }}>{sub.status}</span>
                                        </td>
                                        <td style={{ padding: '14px 20px', textAlign: 'right', position: 'relative' }}>
                                            <button onClick={() => setOpenAction(openActionId === sub.id ? null : sub.id)}
                                                style={{ padding: '7px', background: openActionId === sub.id ? '#F8FAFC' : 'none', border: openActionId === sub.id ? '1px solid #E2E8F0' : '1px solid transparent', color: '#94A3B8', cursor: 'pointer', borderRadius: '6px' }}>
                                                <MoreVertical size={16} />
                                            </button>
                                            {openActionId === sub.id && (
                                                <div style={{ position: 'absolute', top: '100%', right: '20px', marginTop: '4px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minWidth: '170px', zIndex: 10, overflow: 'hidden', textAlign: 'left' }}>
                                                    {sub.status !== 'Active' && (
                                                        <button onClick={() => updateStatus(sub, 'Active')} style={{ display: 'block', width: '100%', padding: '10px 14px', background: 'none', border: 'none', textAlign: 'left', fontSize: '13px', color: '#10B981', cursor: 'pointer' }}
                                                            onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                                            ✓ Reactivate
                                                        </button>
                                                    )}
                                                    {sub.status !== 'Payment Due' && (
                                                        <button onClick={() => updateStatus(sub, 'Payment Due')} style={{ display: 'block', width: '100%', padding: '10px 14px', background: 'none', border: 'none', textAlign: 'left', fontSize: '13px', color: '#D97706', cursor: 'pointer' }}
                                                            onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                                            Mark Payment Due
                                                        </button>
                                                    )}
                                                    <div style={{ height: '1px', background: '#E2E8F0', margin: '4px 0' }} />
                                                    {sub.status !== 'Suspended' && (
                                                        <button onClick={() => { if (confirm(`Suspend ${sub.name}? This will block their login.`)) updateStatus(sub, 'Suspended'); }}
                                                            style={{ display: 'block', width: '100%', padding: '10px 14px', background: 'none', border: 'none', textAlign: 'left', fontSize: '13px', color: '#EF4444', cursor: 'pointer' }}
                                                            onMouseOver={e => e.currentTarget.style.background = '#FEF2F2'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                                            Suspend Tenant
                                                        </button>
                                                    )}
                                                    <button onClick={() => router.push('/super-admin/tenants')} style={{ display: 'block', width: '100%', padding: '10px 14px', background: 'none', border: 'none', textAlign: 'left', fontSize: '13px', color: '#334155', cursor: 'pointer' }}
                                                        onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                                        Manage Tenant →
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
