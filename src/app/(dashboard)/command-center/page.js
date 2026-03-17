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
    ShieldCheck,
    Globe,
    Terminal,
    ChevronRight
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Skeleton from '@/components/common/Skeleton';
import Link from 'next/link';

export default function CommandCenterDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [systemStatus, setSystemStatus] = useState('All Systems Operational');
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            // Simulation of real-time data fetch
            setTimeout(() => {
                setData({
                    metrics: {
                        activeEmergency: 4,
                        criticalIcu: 2,
                        totalPatients: 140,
                        staffOnDuty: 85,
                        occupancy: '92%',
                        efficiency: '96.8%'
                    },
                    units: [
                        { id: 'opd', unit: 'OPD Desk', status: 'Online', perf: 'Optimal', icon: Stethoscope, color: '#10B981', sub: 'Consultation Flow', href: '/opd' },
                        { id: 'ipd', unit: 'IPD Wards', status: 'Online', perf: 'High Load', icon: BedDouble, color: '#F59E0B', sub: 'Admissions Desk', href: '/ipd' },
                        { id: 'laboratory', unit: 'Laboratory', status: 'Online', perf: 'Processing', icon: Microscope, color: '#0EA5E9', sub: 'Diagnostic Hub', href: '/laboratory' },
                        { id: 'pharmacy', unit: 'Pharmacy', status: 'Online', perf: 'Optimal', icon: Pill, color: '#10B981', sub: 'Inventory Sync', href: '/pharmacy' },
                        { id: 'emergency', unit: 'Emergency', status: 'Active', perf: 'Alert', icon: Siren, color: '#EF4444', sub: 'Triage Center', href: '/emergency' },
                        { id: 'ot', unit: 'Surgical OT', status: 'In-Use', perf: 'Optimal', icon: Scissors, color: '#6366F1', sub: 'OR Schedules', href: '/ot' },
                    ],
                    recentAlerts: [
                        { id: 1, type: 'ER', msg: 'Triage Overload (Zone A)', time: '2 mins ago', severity: 'critical' },
                        { id: 2, type: 'PHARM', msg: 'Adrenaline Stock Warning', time: '15 mins ago', severity: 'warning' },
                        { id: 3, type: 'IPD', msg: 'Bed Shortage (Ward 4)', time: '40 mins ago', severity: 'info' },
                    ],
                    logs: [
                        { time: '11:24', event: 'Oxygen levels verified in Zone B' },
                        { time: '11:15', event: 'Shift changeover completed' },
                        { time: '11:02', event: 'Institutional Backup active' },
                    ]
                });
                setLoading(false);
                setLastUpdated(new Date());
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
        { id: 'efficiency', label: 'Operational Index', value: data?.metrics.efficiency, sub: 'Workflow Throughput', icon: Activity, color: '#8B5CF6', href: '/reports' },
    ];

    return (
        <div className="fade-in" style={{ paddingBottom: '60px' }}>
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse-soft { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
                .kpi-card { 
                    background: #fff; 
                    border: 1px solid var(--color-border-light); 
                    border-radius: 20px; 
                    padding: 24px; 
                    text-decoration: none; 
                    display: block; 
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); 
                    position: relative;
                    overflow: hidden;
                }
                .kpi-card::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 3px;
                    background: transparent;
                    transition: background 0.25s;
                }
                .kpi-card:hover { 
                    box-shadow: 0 12px 30px rgba(0,0,0,0.08); 
                    transform: translateY(-4px); 
                }
                .kpi-card:hover::after {
                    background: var(--kpi-color);
                }
                .unit-card { 
                    background: #fff; 
                    border: 1px solid var(--color-border-light); 
                    border-radius: 14px; 
                    padding: 18px; 
                    display: flex; 
                    align-items: center; 
                    gap: 16px; 
                    transition: all 0.2s; 
                    text-decoration: none;
                }
                .unit-card:hover { 
                    border-color: #CBD5E1;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.04); 
                    transform: translateX(4px); 
                }
                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    position: relative;
                }
                .status-dot::after {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    border-radius: 50%;
                    border: 1px solid currentColor;
                    animation: pulse-soft 2s infinite;
                }
                .btn-premium {
                    background: var(--color-navy);
                    color: #fff;
                    padding: 10px 20px;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s;
                }
                .btn-premium:hover {
                    background: #1a2333;
                    box-shadow: 0 4px 15px rgba(15, 23, 42, 0.2);
                }
                .hover-white-bg:hover {
                    background: rgba(255, 255, 255, 0.1) !important;
                    border-color: rgba(255, 255, 255, 0.5) !important;
                }

                @media (max-width: 1024px) {
                    .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
                    .grid-balanced { grid-template-columns: 1fr !important; gap: 24px !important; }
                }

                @media (max-width: 768px) {
                    .dashboard-header-row { flex-direction: column; align-items: flex-start !important; gap: 20px; }
                    .dashboard-header-buttons { width: 100%; }
                    .dashboard-header-buttons button, .dashboard-header-buttons a { flex: 1; justify-content: center; }
                    .status-banner { flex-direction: column; align-items: flex-start !important; gap: 12px; }
                    .status-banner > div:last-child { align-self: flex-end; }
                    .protocol-card { flex-direction: column; text-align: center; padding: 24px !important; }
                    .protocol-card > div:last-child { width: 100%; flex-direction: column; }
                    .kpi-grid { grid-template-columns: 1fr !important; }
                    .grid-2-col { grid-template-columns: 1fr !important; }
                    .status-meta { display: none; }
                }

                @media (max-width: 480px) {
                    .page-header__title { font-size: 24px !important; }
                    .kpi-card { padding: 18px !important; }
                }
            `}</style>

            {/* System Status Banner */}
            <div className="status-banner" style={{ 
                background: 'rgba(15, 23, 42, 0.03)', 
                border: '1px solid var(--color-border-light)', 
                borderRadius: '12px', 
                padding: '12px 16px', 
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div className="status-dot" style={{ background: 'var(--color-success)', color: 'var(--color-success)' }} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-navy)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                        {systemStatus}
                    </span>
                    <span className="status-meta" style={{ color: '#CBD5E1' }}>|</span>
                    <span className="status-meta" style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
                        Encryption Active • Node Global-01-IND
                    </span>
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>
                    <span className="status-meta">Last Synchronization: </span>{lastUpdated.toLocaleTimeString()}
                </div>
            </div>

            <div className="dashboard-header-row" style={{ marginBottom: '32px' }}>
                <div>
                    <h1 className="page-header__title" style={{ fontSize: '28px', fontWeight: 600, color: 'var(--color-navy)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Global Command Centre</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0, fontWeight: 500 }}>{dateStr}</p>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#CBD5E1' }} />
                        <p style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 600, margin: 0 }}>Live Oversight Mode</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons" style={{ gap: '12px' }}>
                    <button className="btn btn-secondary" style={{ background: '#fff', padding: '0 16px', height: '42px' }} onClick={loadData} disabled={loading}>
                        <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                        {loading ? 'Polling…' : 'Refresh Telemetry'}
                    </button>
                    <Link href="/command-center/protocols" className="btn-premium" style={{ height: '42px' }}>
                        <ShieldCheck size={18} />
                        Protocol Monitor
                    </Link>
                </div>
            </div>

            {/* Strategic KPI Strip */}
            <div className="kpi-grid" style={{ marginBottom: '32px' }}>
                {KPI_TOP.map(card => {
                    const Icon = card.icon;
                    return (
                        <Link href={card.href} key={card.id} className="kpi-card" style={{ '--kpi-color': card.color }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${card.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={24} style={{ color: card.color }} strokeWidth={1.5} />
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</div>
                                    <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, marginTop: '2px' }}>+2.4% Trend</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--color-navy)', lineHeight: 1, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                                {loading ? <Loader2 size={24} className="animate-spin text-muted" /> : card.value}
                            </div>
                            <div style={{ fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {card.sub} <ArrowRight size={12} style={{ color: '#CBD5E1' }} />
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="grid-balanced" style={{ marginBottom: '32px' }}>
                {/* Operations Monitor */}
                <div style={{ background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderBottom: '1px solid var(--color-border-light)' }}>
                        <div>
                            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Globe size={20} style={{ color: '#3B82F6' }} />
                                Unit Connectivity
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', fontWeight: 500 }}>Real-time synchronization across clinical departments</div>
                        </div>
                        <Activity size={20} style={{ color: '#94A3B8' }} />
                    </div>
                    <div style={{ padding: '24px', flex: 1 }}>
                        {loading ? <Skeleton height="320px" /> : (
                            <div className="grid-2-col" style={{ gap: '16px' }}>
                                {data?.units.map((unit) => {
                                    const UnitIcon = unit.icon;
                                    return (
                                        <Link href={unit.href} key={unit.id} className="unit-card">
                                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${unit.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <UnitIcon size={20} style={{ color: unit.color }} strokeWidth={2} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)', margin: 0 }}>{unit.unit}</h4>
                                                    <div style={{ fontSize: '11px', fontWeight: 600, color: unit.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{unit.perf}</div>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                                    <span style={{ fontSize: '12px', color: '#64748B' }}>{unit.status}</span>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <div style={{ width: '100px', height: '4px', background: '#F1F5F9', borderRadius: '2px', overflow: 'hidden' }}>
                                                            <div style={{ width: unit.perf === 'Optimal' ? '90%' : unit.perf === 'High Load' ? '65%' : '30%', height: '100%', background: unit.color }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight size={14} style={{ color: '#CBD5E1' }} />
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Priority Alerts & Command Log */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Priority Alerts */}
                    <div style={{ background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '20px', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Bell size={18} style={{ color: '#EF4444' }} />
                                Priority Signals
                            </div>
                            <Link href="/command-center/alerts" style={{ fontSize: '12px', color: '#3B82F6', fontWeight: 500, textDecoration: 'none' }}>View Ledger</Link>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {data?.recentAlerts.map(alert => (
                                    <div key={alert.id} style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--color-border-light)', background: alert.severity === 'critical' ? '#FFF1F2' : '#fff' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '9px', fontWeight: 600, color: alert.severity === 'critical' ? '#E11D48' : '#64748B', background: alert.severity === 'critical' ? '#FFE4E6' : '#F1F5F9', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>{alert.type}</span>
                                                <div style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                                                    <Clock size={10} /> {alert.time}
                                                </div>
                                            </div>
                                            <button style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                <ChevronRight size={14} />
                                            </button>
                                        </div>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {alert.severity === 'critical' && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444' }} />}
                                            {alert.msg}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Terminal / Log */}
                    <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '20px', overflow: 'hidden', color: '#94A3B8' }}>
                         <div style={{ padding: '12px 20px', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 600, color: '#F8FAFC', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <Terminal size={14} />
                                Institutional Event Log
                             </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1e293b' }} />
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1e293b' }} />
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1e293b' }} />
                            </div>
                         </div>
                         <div style={{ padding: '16px', fontFamily: 'monospace', fontSize: '12px' }}>
                            {data?.logs.map((log, i) => (
                                <div key={i} style={{ marginBottom: '6px', display: 'flex', gap: '12px' }}>
                                    <span style={{ color: '#3B82F6' }}>[{log.time}]</span>
                                    <span style={{ color: '#F1F5F9' }}>{log.event}</span>
                                </div>
                            ))}
                            <div style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px' }}>
                                <span className="animate-pulse">_</span> Listening for priority signals...
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Protocol Governance Card */}
            <div className="protocol-card" style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)', border: 'none', borderRadius: '24px', padding: '32px', display: 'flex', gap: '24px', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.1, color: '#fff' }}>
                    <ShieldCheck size={240} strokeWidth={0.5} />
                </div>
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, margin: '0 auto' }}>
                    <Zap size={32} />
                </div>
                 <div style={{ flex: 1, position: 'relative', zIndex: 1, margin: '12px 0' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Operational Continuity Protocol</h3>
                    <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1.6, margin: '0 auto', maxWidth: '600px', fontWeight: 400 }}>
                        Current facility operations are running at peak capacity. All department heads should verify staffing rosters and ensure emergency triage zones are cleared for high turnover.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexShrink: 0, position: 'relative', zIndex: 1 }}>
                    <Link href="/command-center/protocols/review" className="btn btn-primary" style={{ background: '#fff', color: 'var(--color-navy)', border: 'none', padding: '0 28px', height: '48px', fontWeight: 700, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Initiate Review</Link>
                    <Link href="/command-center/protocols" style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '0 28px', height: '48px', fontWeight: 700, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.2s' }} className="hover-white-bg">Global Standards</Link>
                </div>
            </div>
        </div>
    );
}
