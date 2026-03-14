'use client';

import { 
    Thermometer, 
    Clock, 
    CheckCircle2, 
    AlertTriangle, 
    Play, 
    FileText, 
    RefreshCw,
    History,
    Info,
    Loader2,
    Zap,
    MoveRight,
    Activity,
    ShieldCheck
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Skeleton from '@/components/common/Skeleton';
import Link from 'next/link';

const CYCLE_TYPE_COLORS = {
    'Standard Steam': { bg: '#E0F2FE', color: '#0369A1' },
    'Rapid Flash': { bg: '#FEF3C7', color: '#B45309' },
    'Plasma Sterilisation': { bg: '#F1F5F9', color: '#0F172A' },
};

export default function CSSDDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showStartModal, setShowStartModal] = useState(false);
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            // Simulation
            setTimeout(() => {
                setStats({
                    activeCycles: [
                        { id: 'CY-902', type: 'Standard Steam', start: '10:30 AM', progress: 65, temp: '134°C', pressure: '2.1 bar' },
                        { id: 'CY-903', type: 'Rapid Flash', start: '11:15 AM', progress: 15, temp: '132°C', pressure: '1.9 bar' },
                    ],
                    otDemands: [
                        { id: 'OT-1', desc: 'Arthroplasty Set (2)', urgency: 'High', status: 'In Washing' },
                        { id: 'OT-4', desc: 'General Surgery Kit', urgency: 'Normal', status: 'Pending' },
                    ],
                    metrics: {
                        todayTotal: 24,
                        successRate: '99.2%',
                        pendingLoad: 8,
                        failedCycles: 0,
                        activeMonitors: 2
                    }
                });
                setLoading(false);
            }, 800);
        } catch (e) {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const KPI_CARDS = [
        { id: 'cycles', label: "Today's Cycles", value: stats?.metrics.todayTotal, sub: 'Successfully completed', icon: CheckCircle2, color: '#10B981' },
        { id: 'active', label: 'Active Monitors', value: stats?.activeCycles.length, sub: 'In-progress sterilization', icon: Activity, color: '#3B82F6' },
        { id: 'backlog', label: 'OT Demand Backlog', value: stats?.otDemands.length, sub: 'Instrument sets required', icon: Clock, color: '#F59E0B' },
        { id: 'rate', label: 'Pass Rate', value: '99.2%', sub: 'Biological verification', icon: ShieldCheck, color: '#14B8A6' },
    ];

    return (
        <div className="fade-in">
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .kpi-card { background: #fff; border: 1px solid var(--color-border-light); border-radius: 16px; padding: 20px; text-decoration: none; display: block; transition: all 0.18s; }
                .kpi-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.06); transform: translateY(-2px); }
            `}</style>

            <div className="dashboard-header-row" style={{ marginBottom: '28px' }}>
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Sterilization & CSSD Command</h1>
                    <p className="page-header__subtitle">{dateStr} — Monitor decontamination cycles and instrument availability.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={loadData} disabled={loading}>
                        <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                        {loading ? 'Refreshing…' : 'Sync Cycles'}
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowStartModal(true)}>
                        <Play size={15} /> Start New Cycle
                    </button>
                </div>
            </div>

            {/* Strategic KPI Strip — 4 Big Cards matching dashboard style */}
            <div className="kpi-grid" style={{ marginBottom: '32px' }}>
                {KPI_CARDS.map(card => {
                    const Icon = card.icon;
                    return (
                        <div key={card.id} className="kpi-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} style={{ color: card.color }} strokeWidth={1.5} />
                                </div>
                                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1, marginBottom: '6px' }}>
                                {loading && card.id === 'active' ? <Loader2 size={22} className="animate-spin text-muted" /> : card.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94A3B8' }}>{card.sub}</div>
                        </div>
                    );
                })}
            </div>

            <div className="grid-balanced" style={{ marginBottom: '24px' }}>
                {/* Active Cycles */}
                <div style={{ background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--color-border-light)' }}>
                        <div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)' }}>Active Sterilization Cycles</div>
                            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Live autoclave and plasma telemetry</div>
                        </div>
                        <History size={18} style={{ color: '#94A3B8' }} />
                    </div>
                    <div style={{ padding: '24px' }}>
                        {loading ? <Skeleton height="200px" /> : stats?.activeCycles.map((cycle) => (
                            <div key={cycle.id} style={{ padding: '20px', border: '1px solid var(--color-border-light)', borderRadius: '12px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <div>
                                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{cycle.id} — {cycle.type}</h4>
                                        <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Started at {cycle.start}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-navy)' }}>{cycle.progress}%</div>
                                        <div style={{ fontSize: '10px', color: 'var(--color-cyan)', fontWeight: 700 }}>REMAINING: {(100 - cycle.progress) / 5} mins</div>
                                    </div>
                                </div>
                                <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                                    <div style={{ height: '100%', width: `${cycle.progress}%`, background: 'var(--color-cyan)', borderRadius: '4px', transition: 'width 1s ease' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Thermometer size={14} style={{ color: '#EF4444' }} />
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>{cycle.temp}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Activity size={14} style={{ color: '#3B82F6' }} />
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>{cycle.pressure}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* OT Demands */}
                <div style={{ background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--color-border-light)' }}>
                        <div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)' }}>High-Priority OT Demands</div>
                            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Surgical sets required for upcoming cases</div>
                        </div>
                        <AlertTriangle size={18} style={{ color: '#F59E0B' }} />
                    </div>
                    {loading ? <div style={{ padding: '24px' }}><Skeleton height="200px" /></div> : (
                        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
                            <thead>
                                <tr style={{ background: '#F8FAFC' }}>
                                    {['Unit', 'Description', 'Urgency', 'Status'].map(h => (
                                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border-light)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.otDemands.map(demand => (
                                    <tr key={demand.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                                        <td style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: 'var(--color-navy)' }}>{demand.id}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748B' }}>{demand.desc}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '12px', background: demand.urgency === 'High' ? '#FEF2F2' : '#F1F5F9', color: demand.urgency === 'High' ? '#B91C1C' : '#475569' }}>{demand.urgency}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }} />
                                                <span style={{ fontSize: '12px', color: 'var(--color-navy)', fontWeight: 600 }}>{demand.status}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    )}
                </div>
            </div>

            <div className="card" style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'center', border: '1px solid #E2E8F0' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={24} />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)' }}>Biological Indicator Verification</div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>Last B.I. test for Steam Sterilizer ST-02 confirmed negative (pass) at 09:15 AM. Full microbial clearance achieved.</div>
                </div>
                <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>Verification Log</button>
            </div>

            {/* Modal placeholder — styled professionally */}
            {showStartModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(10, 46, 77, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', borderRadius: '16px', width: '400px', padding: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '8px' }}>Start Decontamination</h2>
                        <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>Confirm equipment availability and biological indicators before initiating.</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn btn-secondary" style={{ flex: 1, background: '#fff' }} onClick={() => setShowStartModal(false)}>Cancel</button>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setShowStartModal(false)}>Start Cycle</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
