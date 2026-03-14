'use client';

import { 
    Activity, 
    TrendingUp, 
    AlertTriangle, 
    Users, 
    BedDouble, 
    RefreshCw,
    ShieldAlert,
    Siren,
    Bell,
    CheckCircle2,
    Clock,
    User,
    ArrowRight,
    Loader2,
    LayoutDashboard,
    Zap,
    Stethoscope,
    Microscope,
    Pill,
    Scissors,
    HeartPulse,
    ShieldCheck
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Skeleton from '@/components/common/Skeleton';
import Link from 'next/link';

export default function CommandCenterDashboard() {
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
                    metrics: {
                        activeEmergency: 4,
                        criticalIcu: 2,
                        totalPatients: 140,
                        staffOnDuty: 85,
                        occupancy: '92%'
                    },
                    units: [
                        { unit: 'OPD Desk', status: 'Online', perf: 'Optimal', icon: Stethoscope, color: '#10B981', sub: 'Consultation Flow', href: '/opd' },
                        { unit: 'IPD Wards', status: 'Online', perf: 'High Load', icon: BedDouble, color: '#F59E0B', sub: 'Admissions Desk', href: '/ipd' },
                        { unit: 'Laboratory', status: 'Online', perf: 'Processing', icon: Microscope, color: '#0EA5E9', sub: 'Diagnostic Hub', href: '/laboratory' },
                        { unit: 'Pharmacy', status: 'Online', perf: 'Optimal', icon: Pill, color: '#10B981', sub: 'Inventory Sync', href: '/pharmacy' },
                        { unit: 'Emergency', status: 'Active', perf: 'Alert', icon: Siren, color: '#EF4444', sub: 'Triage Center', href: '/emergency' },
                        { unit: 'Surgical OT', status: 'In-Use', perf: 'Optimal', icon: Scissors, color: '#6366F1', sub: 'OR Schedules', href: '/ot' },
                    ],
                    recentAlerts: [
                        { id: 1, type: 'Emergency', msg: 'Triage Overload (Zone A)', time: '2 mins ago', severity: 'critical' },
                        { id: 2, type: 'Pharmacy', msg: 'Adrenaline Stock Critical', time: '15 mins ago', severity: 'warning' },
                        { id: 3, type: 'IPD', msg: 'Bed Shortage (Ward 4)', time: '40 mins ago', severity: 'info' },
                    ]
                });
                setLoading(false);
            }, 800);
        } catch (e) {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const KPI_TOP = [
        { id: 'occupancy', label: 'Hospital Occupancy', value: data?.metrics.occupancy, sub: 'Strategic Max Volume', icon: BedDouble, color: '#3B82F6', href: '/ipd' },
        { id: 'emergency', label: 'Active Emergencies', value: data?.metrics.activeEmergency, sub: 'Triage Nodes Active', icon: Siren, color: '#EF4444', href: '/emergency' },
        { id: 'volume', label: 'Patient Volume', value: data?.metrics.totalPatients, sub: 'Live Facility Census', icon: Users, color: '#0EA5E9', href: '/patients' },
        { id: 'staff', label: 'On-Duty Assets', value: data?.metrics.staffOnDuty, sub: 'All Clinical Roles', icon: ShieldCheck, color: '#10B981', href: '/hr' },
    ];

    return (
        <div className="fade-in">
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .kpi-card { background: #fff; border: 1px solid var(--color-border-light); border-radius: 16px; padding: 20px; text-decoration: none; display: block; transition: all 0.18s; }
                .kpi-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.06); transform: translateY(-2px); }
                .unit-card { background: #fff; border: 1px solid var(--color-border-light); border-radius: 12px; padding: 16px; display: flex; alignItems: center; gap: 14px; transition: all 0.15s; }
                .unit-card:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.06); transform: translateY(-1px); }
            `}</style>

            <div className="dashboard-header-row" style={{ marginBottom: '28px' }}>
                <div>
                    <h1 className="page-header__title" style={{ fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Global Command Centre</h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>{dateStr} — Live operational oversight</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={loadData} disabled={loading}>
                        <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                        {loading ? 'Updating…' : 'Live Update'}
                    </button>
                    <Link href="/command-center/protocols" className="protocol-card-action">
                    <ShieldCheck size={16} />
                    Protocol Access
                </Link>
                </div>
            </div>

            {/* Strategic KPI Strip — 4 Big Cards */}
            <div className="kpi-grid" style={{ marginBottom: '28px' }}>
                {KPI_TOP.map(card => {
                    const Icon = card.icon;
                    return (
                        <Link href={card.href} key={card.id} className="kpi-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} style={{ color: card.color }} strokeWidth={1.5} />
                                </div>
                                <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>{card.label}</span>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1, marginBottom: '6px' }}>
                                {loading ? <Loader2 size={22} className="animate-spin text-muted" /> : card.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94A3B8' }}>{card.sub}</div>
                        </Link>
                    );
                })}
            </div>

            <div className="grid-balanced" style={{ marginBottom: '28px' }}>
                {/* Operations Monitor */}
                <div style={{ background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--color-border-light)' }}>
                        <div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)' }}>Unit Connectivity & Status</div>
                            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Real-time synchronization across clinical departments</div>
                        </div>
                        <Activity size={18} style={{ color: '#94A3B8' }} />
                    </div>
                    <div style={{ padding: '24px' }}>
                        {loading ? <Skeleton height="280px" /> : (
                            <div className="grid-2-col" style={{ gap: '14px' }}>
                                {data?.units.map((unit, i) => {
                                    const UnitIcon = unit.icon;
                                    return (
                                        <Link href={unit.href} key={i} className="unit-card">
                                            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${unit.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <UnitIcon size={18} style={{ color: unit.color }} strokeWidth={1.5} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{unit.unit}</h4>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: unit.color }} />
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                                                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>{unit.status}</span>
                                                    <span style={{ fontSize: '11px', fontWeight: 700, color: unit.color }}>{unit.perf}</span>
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '1px' }}>{unit.sub}</div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Priority Alerts */}
                <div style={{ background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--color-border-light)' }}>
                        <div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)' }}>Strategic Priority Alerts</div>
                            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Clinical signals requiring immediate supervision</div>
                        </div>
                        <Bell size={18} style={{ color: '#EF4444' }} />
                    </div>
                    <div style={{ padding: '24px' }}>
                        {loading ? <Skeleton height="280px" /> : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {data?.recentAlerts.map(alert => (
                                    <div key={alert.id} style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border-light)', transition: 'all 0.15s' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '10px', fontWeight: 800, color: alert.severity === 'critical' ? '#EF4444' : '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{alert.type}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#CBD5E1' }}>
                                                <Clock size={10} />
                                                <span style={{ fontSize: '10px' }}>{alert.time}</span>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {alert.severity === 'critical' && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444', animation: 'pulse 2s infinite' }} />}
                                            {alert.msg}
                                        </div>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', gap: '12px' }}>
                <Link href="/command-center/alerts" className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>View Resolution Ledger</Link>
                <Link href="/command-center/protocols" className="btn btn-primary btn-sm">Protocol Monitor</Link>
            </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Protocol Card — Clean Professional Style */}
            <div className="protocol-card" style={{ background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '16px', marginBottom: '40px' }}>
                <div className="protocol-icon-wrapper">
                    <Zap size={32} strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '8px' }}>Operational Continuity Protocol</h3>
                    <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                        Current facility operations are running at peak capacity. All department heads should verify staffing rosters for the next shift and ensure emergency triage zones are cleared for high turnover. Institutional efficiency protocols are active.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexShrink: 0, flexWrap: 'wrap' }}>
                    <Link href="/command-center/protocols/review" className="btn btn-primary" style={{ padding: '0 24px', flex: '1 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Initiate Review</Link>
                    <Link href="/command-center/protocols" className="btn btn-secondary" style={{ background: '#fff', padding: '0 24px', flex: '1 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Protocol Access</Link>
                </div>
            </div>
        </div>
    );
}
