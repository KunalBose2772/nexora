'use client';
import { Scissors, ArrowLeft, TrendingUp, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function OTAnalyticsPage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row" style={{ marginBottom: '28px' }}>
                <div>
                    <h1 className="page-header__title" style={{ fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>OT Performance Analytics</h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>Strategic oversight of surgical throughput and perioperative efficiency.</p>
                </div>
                <Link href="/ot" className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                    <ArrowLeft size={14} /> Back to OT
                </Link>
            </div>

            <div className="kpi-grid" style={{ marginBottom: '28px' }}>
                {[
                    { label: 'Surgical Success Rate', value: '99.2%', trend: '+0.4%', icon: CheckCircle2, color: '#10B981' },
                    { label: 'Theater Utilization', value: '85.6%', trend: '+4.2%', icon: Scissors, color: '#3B82F6' },
                    { label: 'Avg. Turnover Time', value: '24m', trend: '-5m', icon: Clock, color: '#8B5CF6' },
                    { label: 'Procedures Forecast', value: '82', trend: 'Target', icon: Calendar, color: '#F59E0B' },
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
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '8px' }}>Throughput Modeling Scaling</h3>
                <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '400px', margin: '0 auto' }}>Detailed surgical volume forecasting and OT utilization heatmaps are currently generating based on the last 30 operational cycles.</p>
            </div>
        </div>
    );
}
