'use client';
import { Activity, ArrowLeft, TrendingUp, Users, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ICUStatsPage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row" style={{ marginBottom: '28px' }}>
                <div>
                    <h1 className="page-header__title" style={{ fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>ICU Performance Analytics</h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>Strategic oversight of critical care efficiency and patient outcomes.</p>
                </div>
                <Link href="/icu" className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                    <ArrowLeft size={14} /> Back to ICU
                </Link>
            </div>

            <div className="kpi-grid" style={{ marginBottom: '28px' }}>
                {[
                    { label: 'Avg. Recovery Rate', value: '78.4%', trend: '+2.1%', icon: Activity, color: '#10B981' },
                    { label: 'Resource Efficiency', value: '92%', trend: '+0.5%', icon: TrendingUp, color: '#3B82F6' },
                    { label: 'Staff-to-Patient Ratio', value: '1:2.4', trend: 'Optimal', icon: Users, color: '#8B5CF6' },
                    { label: 'Mean Response Time', value: '1.2m', trend: '-12s', icon: Clock, color: '#EF4444' },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="card" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} />
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: stat.color }}>{stat.trend}</span>
                            </div>
                            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '4px' }}>{stat.value}</div>
                            <div style={{ fontSize: '12px', color: '#94A3B8' }}>{stat.label}</div>
                        </div>
                    );
                })}
            </div>

            <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
                <TrendingUp size={48} style={{ color: '#CBD5E1', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '8px' }}>Predictive Analytics Scaling</h3>
                <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '400px', margin: '0 auto' }}>Detailed outcome forecasting and trend line modeling are currently processing. Live syncing will resume as session data matures.</p>
            </div>
        </div>
    );
}
