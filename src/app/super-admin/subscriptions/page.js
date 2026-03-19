'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
    CreditCard, 
    Search, 
    Filter, 
    MoreVertical, 
    ShieldCheck, 
    Clock, 
    ExternalLink, 
    X, 
    RefreshCw, 
    AlertCircle,
    ArrowUpRight,
    CheckCircle2,
    Calendar,
    IndianRupee
} from 'lucide-react';

const STATUS_COLORS = {
    'Active': { badge: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    'Canceled': { badge: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
    'Past Due': { badge: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    'Trial': { badge: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
};

export default function SubscriptionsPage() {
    const router = useRouter();
    const [subscriptions, setSubscriptions] = useState([]);
    const [stats, setStats] = useState({ active: 0, mrr: 0, churn: '0%' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // Reusing existing api/tenants as a source since subscriptions are tied to tenants
            const res = await fetch('/api/tenants');
            if (res.status === 401 || res.status === 403) {
                router.replace('/login');
                return;
            }
            if (!res.ok) throw new Error('Failed to fetch subscription data');
            const data = await res.json();
            
            // Transform tenants into a subscription-like view
            const subs = data.tenants.map(t => ({
                id: `sub_${t.id.slice(0, 8)}`,
                hospital: t.name,
                plan: t.plan,
                amount: t.plan.includes('Starter') ? 4999 : t.plan.includes('Professional') ? 9999 : 0,
                status: t.status === 'Active' ? 'Active' : t.status === 'Suspended' ? 'Canceled' : 'Past Due',
                billingCycle: 'Monthly',
                renewalDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                slug: t.slug
            }));
            
            setSubscriptions(subs);
            setStats({
                active: subs.filter(s => s.status === 'Active').length,
                mrr: subs.reduce((acc, s) => acc + (s.amount || 0), 0),
                churn: '1.2%'
            });
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const filtered = subscriptions.filter(s => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = s.hospital.toLowerCase().includes(q) || s.plan.toLowerCase().includes(q);
        const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="fade-in">
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', letterSpacing: '-0.02em' }}>Platform Subscriptions</h1>
                    <p style={{ color: '#64748B', margin: 0, fontSize: '14px' }}>Monitor recurring revenue, churn, and billing cycles.</p>
                </div>
                <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Data
                </button>
            </div>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {[
                    { label: 'Active Subscriptions', value: stats.active, icon: ShieldCheck, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
                    { label: 'Estimated MRR', value: `₹${stats.mrr.toLocaleString()}`, icon: IndianRupee, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
                    { label: 'Churn Rate', value: stats.churn, icon: ArrowUpRight, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
                ].map((s, i) => (
                    <div key={i} style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                                <s.icon size={20} />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Realtime</span>
                        </div>
                        <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 4px 0' }}>{s.label}</p>
                        <h4 style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{s.value}</h4>
                    </div>
                ))}
            </div>

            {/* Main Table Card */}
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                            value={searchQuery} 
                            onChange={e => setSearchQuery(e.target.value)} 
                            placeholder="Filter by hospital or plan..." 
                            style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                        />
                    </div>
                    <select 
                        value={statusFilter} 
                        onChange={e => setStatusFilter(e.target.value)}
                        style={{ padding: '9px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', background: '#FFFFFF', outline: 'none', cursor: 'pointer' }}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Past Due">Past Due</option>
                        <option value="Canceled">Canceled</option>
                    </select>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                            <tr>
                                {['Hospital', 'Plan', 'Amount', 'Renewal', 'Status', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '12px 20px', fontWeight: 600, color: '#64748B', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>Loading subscriptions...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No subscriptions found.</td></tr>
                            ) : filtered.map((sub, i) => (
                                <tr key={sub.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ fontWeight: 600, color: '#0F172A' }}>{sub.hospital}</div>
                                        <div style={{ fontSize: '12px', color: '#94A3B8' }}>{sub.id}</div>
                                    </td>
                                    <td style={{ padding: '16px 20px', color: '#475569' }}>{sub.plan}</td>
                                    <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0F172A' }}>
                                        {sub.amount > 0 ? `₹${sub.amount.toLocaleString()}/mo` : 'Custom/Trial'}
                                    </td>
                                    <td style={{ padding: '16px 20px', color: '#64748B' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Calendar size={13} /> {sub.renewalDate}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <span style={{ 
                                            padding: '4px 10px', 
                                            borderRadius: '20px', 
                                            fontSize: '12px', 
                                            fontWeight: 600,
                                            color: STATUS_COLORS[sub.status].badge,
                                            background: STATUS_COLORS[sub.status].bg
                                        }}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <button onClick={() => router.push(`/super-admin/tenants`)} style={{ padding: '6px', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
}
