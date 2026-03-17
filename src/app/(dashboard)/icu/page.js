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
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ occupied: 0, critical: 0, alerts: 0 });
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/icu/cases');
            if (res.ok) {
                const data = await res.json();
                const appts = data.cases || [];
                setCases(appts);
                setStats({
                    occupied: appts.filter(c => c.status === 'Admitted').length,
                    critical: appts.filter(c => c.triageLevel === 1 || c.status?.includes('Critical')).length,
                    alerts: appts.filter(c => c.status?.includes('Referred')).length
                });
            }
        } catch (error) {
            console.error('ICU Data Load Error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const KPI_CARDS = [
        { id: 'occupancy', label: 'ICU Occupancy', value: `${stats.occupied}/15`, sub: 'Standard Bed Capacity', icon: BedDouble, color: '#3B82F6' },
        { id: 'alerts', label: 'Incoming Referrals', value: stats.alerts, sub: 'Trauma Handover Queue', icon: AlertTriangle, color: '#EF4444' },
        { id: 'support', label: 'Ventilator Load', value: appts => appts.filter(c => c.icuMonitoring?.[0]?.ventilatorActive).length, sub: 'Active Respiratory Assist', icon: Wind, color: '#0EA5E9' },
        { id: 'critical', label: 'Critical Load', value: stats.critical, sub: 'ESI-1 / Red Flag Cases', icon: ShieldAlert, color: '#F59E0B' },
    ];

    return (
        <div className="fade-in">
            <style jsx>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .kpi-card { background: #fff; border: 1px solid var(--color-border-light); border-radius: 16px; padding: 20px; text-decoration: none; display: block; transition: all 0.18s; }
                .kpi-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.06); transform: translateY(-2px); }
                .vitals-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
                .vitals-box { background: #F8FAFC; padding: 10px; border-radius: 8px; border: 1px solid #F1F5F9; text-align: center; }
                .patient-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
                
                @media (max-width: 1200px) {
                    .patient-grid { grid-template-columns: repeat(2, 1fr); }
                }

                @media (max-width: 768px) {
                    .patient-grid { grid-template-columns: 1fr; gap: 16px; }
                    .mobile-small-text { font-size: 11px !important; }
                    .mobile-micro-text { font-size: 9px !important; }
                    .vitals-grid { gap: 6px !important; }
                    .vitals-box { padding: 6px !important; }
                    .vitals-val { font-size: 13px !important; }
                    .patient-name-mobile { font-size: 14px !important; line-height: 1.2; }
                    .kpi-grid { gap: 12px !important; }
                    .kpi-card { padding: 16px !important; }
                    .kpi-value { font-size: 24px !important; }
                }
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
                                <span className="mobile-micro-text" style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
                            </div>
                            <div className="kpi-value" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1, marginBottom: '6px' }}>
                                {loading ? <Loader2 size={22} className="animate-spin text-muted" /> : (typeof card.value === 'function' ? card.value(cases) : card.value)}
                            </div>
                            <div className="mobile-micro-text" style={{ fontSize: '12px', color: '#94A3B8' }}>{card.sub}</div>
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
                
                {loading ? <div className="patient-grid"><Skeleton height="280px" /><Skeleton height="280px" /><Skeleton height="280px" /></div> : (
                    <div className="patient-grid">
                        {cases.length === 0 ? (
                            <div className="card" style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center' }}>
                                <ActivityIcon size={48} style={{ color: '#E2E8F0', marginBottom: '15px' }} />
                                <div style={{ color: '#94A3B8', fontSize: '14px' }}>No active ICU telemetry found. All systems on standby.</div>
                            </div>
                        ) : cases.map(p => {
                            const vitals = p.triageVitals ? JSON.parse(p.triageVitals) : {};
                            return (
                                <div key={p.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                                    <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div className="mobile-micro-text" style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>{p.ward || 'ROOM'} — BED {p.bed || '??'}</div>
                                            <h3 className="patient-name-mobile" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{p.patientName}</h3>
                                        </div>
                                        <span className="mobile-micro-text" style={{ fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', background: p.status?.includes('Critical') ? '#FEF2F2' : p.status?.includes('Referred') ? '#F0F9FF' : '#DCFCE7', color: p.status?.includes('Critical') ? '#B91C1C' : p.status?.includes('Referred') ? '#0891B2' : '#15803D' }}>{p.status}</span>
                                    </div>
                                    <div style={{ padding: '24px' }}>
                                        <div className="vitals-grid">
                                            <div className="vitals-box">
                                                <div className="mobile-micro-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}><Heart size={10} style={{ color: '#EF4444' }} /> HR</div>
                                                <div className="vitals-val" style={{ fontSize: '18px', fontWeight: 800, color: (vitals.hr > 110) ? '#EF4444' : 'var(--color-navy)' }}>{vitals.hr || '--'} <span className="mobile-micro-text" style={{ fontSize: '11px', fontWeight: 500, opacity: 0.5 }}>BPM</span></div>
                                            </div>
                                            <div className="vitals-box">
                                                <div className="mobile-micro-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}><Activity size={10} style={{ color: '#3B82F6' }} /> BP</div>
                                                <div className="vitals-val" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)' }}>{vitals.bp || '--'}</div>
                                            </div>
                                            <div className="vitals-box">
                                                <div className="mobile-micro-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}><Wind size={10} style={{ color: '#0EA5E9' }} /> SpO2</div>
                                                <div className="vitals-val" style={{ fontSize: '18px', fontWeight: 800, color: (vitals.spo2 < 93) ? '#EF4444' : 'var(--color-navy)' }}>{vitals.spo2 || '--'}%</div>
                                            </div>
                                            <div className="vitals-box">
                                                <div className="mobile-micro-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}><Thermometer size={10} style={{ color: '#F59E0B' }} /> Temp</div>
                                                <div className="vitals-val" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)' }}>{vitals.temp || '--'}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ padding: '12px 24px', borderTop: '1px solid var(--color-border-light)', background: '#FAFCFF', display: 'flex', gap: '10px' }}>
                                        <Link href={`/icu/patient/${p.apptCode}/logs`} className="btn btn-secondary btn-sm mobile-small-text" style={{ flex: 1, background: '#fff' }}>Trend Log</Link>
                                        <Link href={`/icu/patient/${p.apptCode}/intervene`} className="btn btn-primary btn-sm mobile-small-text" style={{ flex: 1 }}>Intervene</Link>
                                    </div>
                                </div>
                            );
                        })}
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
