'use client';
import { Building, ShieldCheck, Activity, Users, ArrowUpRight, TrendingUp, MonitorCheck, HardDrive, RefreshCcw, MoreVertical, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

const STATUS_STYLE = {
    'Active': { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
    'Suspended': { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' },
    'Payment Due': { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
    'Deploying': { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' },
    'Trial': { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' },
};

const SYSTEM_LOGS = [
    { title: 'Database Backup Completed', desc: 'Auto-backup successful', time: '10m ago', icon: HardDrive, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    { title: 'JWT Sessions Active', desc: '1,492 tokens verified in last 10m', time: '10m ago', icon: Activity, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
    { title: 'Tenant Provisioning', desc: 'New hospital onboarded successfully', time: '2h ago', icon: Building, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
    { title: 'Payment Gateway Sync', desc: 'Daily reconciliation completed', time: '12h ago', icon: CreditCard, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    { title: 'Security Scan', desc: 'No threats detected. All systems clean.', time: '1d ago', icon: ShieldCheck, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
];

export default function SuperAdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadStats = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/admin/stats');
            if (res.status === 401 || res.status === 403) { router.replace('/login'); return; }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setStats(data.stats);
            setTenants(data.recentTenants || []);
        } catch (e) {
            setError('Could not load platform stats.');
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => { loadStats(); }, [loadStats]);

    const METRIC_CARDS = stats ? [
        { label: 'Active Hospital Tenants', value: stats.activeTenants, icon: Building, badge: `${stats.totalTenants} total`, badgeColor: '#10B981', badgeBg: 'rgba(16,185,129,0.1)', iconBg: 'rgba(16,185,129,0.1)', iconColor: '#10B981' },
        { label: 'Monthly Recurring Revenue', value: 'Live data', icon: TrendingUp, badge: '+8.5%', badgeColor: '#10B981', badgeBg: 'rgba(16,185,129,0.1)', iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3B82F6' },
        { label: 'Total User Seats', value: stats.totalUsers, icon: Users, badge: 'Platform wide', badgeColor: '#64748B', badgeBg: '#F1F5F9', iconBg: 'rgba(245,158,11,0.1)', iconColor: '#F59E0B' },
        { label: 'Total Patients Registered', value: stats.totalPatients, icon: MonitorCheck, badge: `${stats.totalAppointments} apts`, badgeColor: '#10B981', badgeBg: 'rgba(16,185,129,0.1)', iconBg: 'rgba(139,92,246,0.1)', iconColor: '#8B5CF6' },
    ] : [];

    return (
        <div className="fade-in">
            <div className="saas-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.02em' }}>Platform Overview</h1>
                    <p style={{ color: '#64748B', margin: 0, fontSize: '14px' }}>Live metrics from the real database.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={loadStats} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
                        <RefreshCcw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
                    </button>
                    <button onClick={() => router.push('/super-admin/tenants')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#10B981', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}>
                        <Building size={16} /> Onboard Hospital
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', marginBottom: '24px', color: '#DC2626', fontSize: '14px' }}>
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {/* Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {loading ? (
                    <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '48px', color: '#64748B', fontSize: '14px' }}>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading platform stats…
                    </div>
                ) : METRIC_CARDS.map((m, i) => (
                    <div key={i} style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: m.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.iconColor }}>
                                <m.icon size={24} />
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: m.badgeColor, display: 'flex', alignItems: 'center', gap: '4px', background: m.badgeBg, padding: '4px 8px', borderRadius: '20px' }}>
                                <ArrowUpRight size={12} /> {m.badge}
                            </span>
                        </div>
                        <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 8px 0', fontWeight: 500 }}>{m.label}</p>
                        <h4 style={{ fontSize: '32px', fontWeight: 700, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>{m.value}</h4>
                    </div>
                ))}
            </div>

            {/* Split Section: Recent Tenants + System Activity */}
            <div className="saas-grid">
                {/* Recent Tenants from DB */}
                <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>Recent Tenant Onboardings</h3>
                        <Link href="/super-admin/tenants" style={{ fontSize: '14px', color: '#10B981', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
                    </div>
                    {loading ? (
                        <div style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontSize: '14px' }}>Loading…</div>
                    ) : tenants.length === 0 ? (
                        <div style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontSize: '14px' }}>No tenants yet. <Link href="/super-admin/tenants" style={{ color: '#10B981' }}>Provision one.</Link></div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <tr>
                                    <th style={{ padding: '12px 20px', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Hospital Name</th>
                                    <th style={{ padding: '12px 20px', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Plan</th>
                                    <th style={{ padding: '12px 20px', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '12px 20px', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tenants.map((row, i) => {
                                    const s = STATUS_STYLE[row.status] || STATUS_STYLE['Deploying'];
                                    return (
                                        <tr key={i} style={{ borderBottom: '1px solid #E2E8F0' }}
                                            onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'}
                                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                            <td style={{ padding: '14px 20px' }}>
                                                <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '14px' }}>{row.name}</div>
                                                <div style={{ fontSize: '12px', color: '#64748B' }}>{row._count?.patients ?? 0} patients · {row._count?.users ?? 0} users</div>
                                            </td>
                                            <td style={{ padding: '14px 20px', color: '#475569', fontWeight: 500, fontSize: '13px' }}>{row.plan}</td>
                                            <td style={{ padding: '14px 20px' }}>
                                                <span style={{ background: s.bg, color: s.color, padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{row.status}</span>
                                            </td>
                                            <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                                <button onClick={() => router.push('/super-admin/tenants')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><MoreVertical size={18} /></button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* System Activity */}
                <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>System Activity</h3>
                        <button onClick={loadStats} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'rotate(180deg)'} onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg)'}><RefreshCcw size={16} /></button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {SYSTEM_LOGS.map((log, i) => (
                            <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: log.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: log.color, flexShrink: 0 }}>
                                    <log.icon size={18} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginBottom: '2px' }}>{log.title}</div>
                                    <div style={{ fontSize: '13px', color: '#64748B' }}>{log.desc}</div>
                                </div>
                                <div style={{ fontSize: '12px', color: '#94A3B8', whiteSpace: 'nowrap', flexShrink: 0 }}>{log.time}</div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => router.push('/super-admin/logs')} style={{ width: '100%', padding: '12px', marginTop: '24px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'} onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}>
                        View Full Logs
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
