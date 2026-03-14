'use client';

import { 
    Activity, 
    Thermometer, 
    Wind, 
    Heart, 
    AlertTriangle, 
    RefreshCw,
    Search,
    Monitor,
    BedDouble,
    Scissors,
    ShieldAlert,
    Loader2,
    Clock,
    Zap,
    MoveRight,
    Calendar,
    Activity as ActivityIcon
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Skeleton from '@/components/common/Skeleton';
import Link from 'next/link';

export default function ICUDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            // Simulation
            setTimeout(() => {
                setData({
                    patients: [
                        { id: 'BED-01', pt: 'Kunal Bose', status: 'Critical', hr: 112, bp: '145/95', spo2: 92, temp: '38.5°C' },
                        { id: 'BED-02', pt: 'Amit Kumar', status: 'Stable', hr: 78, bp: '120/80', spo2: 98, temp: '36.8°C' },
                        { id: 'BED-04', pt: 'Riya Sharma', status: 'High Alert', hr: 95, bp: '138/88', spo2: 94, temp: '37.2°C' },
                        { id: 'BED-05', pt: 'Suresh Raina', status: 'Stable', hr: 72, bp: '118/76', spo2: 99, temp: '36.5°C' },
                    ],
                    metrics: {
                        occupied: 8,
                        available: 2,
                        criticalAlerts: 3
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
        { id: 'occupancy', label: 'ICU Occupancy', value: '80%', sub: '8 of 10 beds occupied', icon: BedDouble, color: '#3B82F6' },
        { id: 'alerts', label: 'Active Alerts', value: data?.metrics.criticalAlerts, sub: 'Vital flux detected', icon: AlertTriangle, color: '#EF4444' },
        { id: 'support', label: 'Support Systems', value: '4', sub: 'Ventilators active', icon: Wind, color: '#0EA5E9' },
        { id: 'staff', label: 'Clinical Staff', value: '6', sub: 'Active intensivists', icon: ShieldAlert, color: '#10B981' },
    ];

    return (
        <div className="fade-in">
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .kpi-card { background: #fff; border: 1px solid var(--color-border-light); border-radius: 16px; padding: 20px; text-decoration: none; display: block; transition: all 0.18s; }
                .kpi-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.06); transform: translateY(-2px); }
                .vitals-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
                .vitals-box { background: #F8FAFC; padding: 10px; border-radius: 8px; border: 1px solid #F1F5F9; text-align: center; }
            `}</style>

            <div className="dashboard-header-row" style={{ marginBottom: '28px' }}>
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>ICU Telemetry Command</h1>
                    <p className="page-header__subtitle">{dateStr} — Real-time vital monitoring and critical care oversight.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={loadData} disabled={loading}>
                        <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                        {loading ? 'Syncing...' : 'Refresh Telemetry'}
                    </button>
                    <Link href="/command-center" className="btn btn-primary btn-sm">
                        <Monitor size={15} /> Central Command
                    </Link>
                </div>
            </div>

            {/* Strategic KPI Strip — 4 Big Cards matching dashboard style */}
            <div className="kpi-grid" style={{ marginBottom: '32px' }}>
                {KPI_CARDS.map(card => {
                    const Icon = card.icon;
                    return (
                        <Link href="/icu/stats" key={card.id} className="kpi-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} style={{ color: card.color }} strokeWidth={1.5} />
                                </div>
                                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1, marginBottom: '6px' }}>
                                {loading && card.id === 'alerts' ? <Loader2 size={22} className="animate-spin text-muted" /> : card.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94A3B8' }}>{card.sub}</div>
                        </Link>
                    );
                })}
            </div>

            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Active Clinical Telemetry</h3>
                    <div style={{ position: 'relative', width: '240px' }}>
                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} />
                        <input type="text" placeholder="Filter by patient or bed..." style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--color-border-light)', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                    </div>
                </div>
                
                {loading ? <div className="kpi-grid" style={{ gap: '20px' }}><Skeleton height="280px" /><Skeleton height="280px" /><Skeleton height="280px" /></div> : (
                    <div className="kpi-grid" style={{ gap: '24px' }}>
                        {data?.patients.map(p => (
                            <div key={p.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                                <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>{p.id} — Clinical Space</div>
                                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{p.pt}</h3>
                                    </div>
                                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', background: p.status === 'Critical' ? '#FEF2F2' : p.status === 'High Alert' ? '#FFFBEB' : '#DCFCE7', color: p.status === 'Critical' ? '#B91C1C' : p.status === 'High Alert' ? '#B45309' : '#15803D' }}>{p.status}</span>
                                </div>
                                <div style={{ padding: '24px' }}>
                                    <div className="vitals-grid">
                                        <div className="vitals-box">
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}><Heart size={10} style={{ color: '#EF4444' }} /> HR</div>
                                            <div style={{ fontSize: '18px', fontWeight: 800, color: p.hr > 110 ? '#EF4444' : 'var(--color-navy)' }}>{p.hr} <span style={{ fontSize: '11px', fontWeight: 500, opacity: 0.5 }}>BPM</span></div>
                                        </div>
                                        <div className="vitals-box">
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}><Activity size={10} style={{ color: '#3B82F6' }} /> BP</div>
                                            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)' }}>{p.bp}</div>
                                        </div>
                                        <div className="vitals-box">
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}><Wind size={10} style={{ color: '#0EA5E9' }} /> SpO2</div>
                                            <div style={{ fontSize: '18px', fontWeight: 800, color: p.spo2 < 93 ? '#EF4444' : 'var(--color-navy)' }}>{p.spo2}%</div>
                                        </div>
                                        <div className="vitals-box">
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}><Thermometer size={10} style={{ color: '#F59E0B' }} /> Temp</div>
                                            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)' }}>{p.temp}</div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ padding: '12px 24px', borderTop: '1px solid var(--color-border-light)', background: '#FAFCFF', display: 'flex', gap: '10px' }}>
                                    <Link href={`/icu/patient/${p.id}/logs`} className="btn btn-secondary btn-sm" style={{ flex: 1, background: '#fff' }}>Trend Log</Link>
                                    <Link href={`/icu/patient/${p.id}/intervene`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>Intervene</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="card" style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'center', border: '1px solid #E2E8F0' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F0F9FF', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldAlert size={24} />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)' }}>Institutional Code Blue Protocol</div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>Central medical response team is currently on standby. All ICU vitals are synced to central hub every 2,000ms.</div>
                </div>
                <Link href="/command-center/protocols/review" className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>Protocol Review</Link>
            </div>
        </div>
    );
}
