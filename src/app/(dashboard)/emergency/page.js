'use client';

import { 
    Siren, 
    Zap, 
    RefreshCw, 
    AlertCircle, 
    Plus, 
    CheckCircle2, 
    Activity, 
    User, 
    Heart, 
    ChevronRight,
    Loader2,
    Clock,
    BedDouble,
    Activity as ActivityIcon,
    Stethoscope,
    Wind,
    Thermometer,
    ArrowUpRight
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Skeleton from '@/components/common/Skeleton';
import Link from 'next/link';

const TRIAGE_LEVELS = {
    1: { label: 'ESI-1: Life Support', color: '#EF4444', bg: '#FEF2F2', pulse: true },
    2: { label: 'ESI-2: Red Flag', color: '#F97316', bg: '#FFF7ED', pulse: false },
    3: { label: 'ESI-3: Urgent', color: '#EAB308', bg: '#FEFCE8', pulse: false },
    4: { label: 'ESI-4: Minor', color: '#22C55E', bg: '#F0FDF4', pulse: false },
    5: { label: 'ESI-5: Stable', color: '#6366F1', bg: '#EEF2FF', pulse: false },
};

export default function EmergencyTriagePage() {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ red: 0, total: 0 });
    const [view, setView] = useState('active'); // 'active' or 'history'

    const loadCases = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/emergency/triage?view=${view}`);
            if (res.ok) {
                const data = await res.json();
                const appts = data.appointments || [];
                setCases(appts);
                
                // Only update stats from active view if possible, or just skip if in history
                if (view === 'active') {
                    setStats({
                        red: appts.filter(c => c.triageLevel === 1).length,
                        total: appts.length
                    });
                }
            }
        } catch (error) { }
        finally { setLoading(false); }
    }, [view]);

    useEffect(() => {
        loadCases();
        const interval = setInterval(loadCases, 30000);
        return () => clearInterval(interval);
    }, [loadCases]);

    return (
        <div className="fade-in pb-20">
            <style jsx>{`
                .emergency-pulse { animation: emergency-glow 1.5s infinite; }
                @keyframes emergency-glow {
                    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
                    70% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
                .vital-chip {
                    background: #fff;
                    border: 1px solid #F1F5F9;
                    border-radius: 10px;
                    padding: 8px 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                }
                @media (max-width: 768px) {
                    .kpi-value { font-size: 24px !important; }
                    .patient-name { font-size: 13px !important; }
                    .uhid-sub { font-size: 9px !important; }
                    .esi-badge { padding: 4px 8px !important; font-size: 9px !important; }
                    .vitals-val { font-size: 11px !important; }
                    .status-badge { font-size: 9px !important; padding: 3px 6px !important; }
                    .btn-sm-mobile { padding: 0 10px !important; height: 32px !important; font-size: 11px !important; }
                    .registry-card { border-radius: 16px !important; }
                    .registry-table th, .registry-table td { padding: 12px 16px !important; }
                }
            `}</style>

            <div className="dashboard-header-row mb-10">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '56px', height: '56px', background: 'var(--color-navy)', color: '#fff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                        <Siren size={28} className="animate-pulse" />
                    </div>
                    <div>
                        <h1 className="responsive-h1" style={{ margin: 0 }}>Triage Command</h1>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0', fontWeight: 500 }}>Trauma orchestration and clinical prioritization for high-intensity ingress.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons" style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <button 
                            onClick={() => setView('active')} 
                            style={{ 
                                padding: '8px 16px', 
                                borderRadius: '8px', 
                                border: 'none', 
                                fontSize: '13px', 
                                fontWeight: 600, 
                                cursor: 'pointer',
                                background: view === 'active' ? '#fff' : 'transparent',
                                color: view === 'active' ? 'var(--color-navy)' : '#64748B',
                                boxShadow: view === 'active' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                            }}
                        >
                            Live Ingress
                        </button>
                        <button 
                            onClick={() => setView('history')} 
                            style={{ 
                                padding: '8px 16px', 
                                borderRadius: '8px', 
                                border: 'none', 
                                fontSize: '13px', 
                                fontWeight: 600, 
                                cursor: 'pointer',
                                background: view === 'history' ? '#fff' : 'transparent',
                                color: view === 'history' ? 'var(--color-navy)' : '#64748B',
                                boxShadow: view === 'history' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                            }}
                        >
                            History
                        </button>
                    </div>
                    <button onClick={loadCases} className="btn btn-secondary shadow-sm" style={{ background: '#fff', color: 'var(--color-navy)', borderRadius: '12px', height: '44px', padding: '0 20px' }}>
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} style={{ marginRight: '8px' }} /> Sync
                    </button>
                    <Link href="/emergency/new" className="btn btn-primary" style={{ background: 'var(--color-navy)', border: 'none', borderRadius: '12px', height: '44px', padding: '0 24px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={18} /> Induction
                    </Link>
                </div>
            </div>

            <div className="kpi-grid mb-10">
                {[
                    { label: 'Red Zone Payload', value: stats.red, sub: 'ESI-1 Critical Load', icon: Siren, color: '#EF4444' },
                    { label: 'Active Trauma', value: stats.total, sub: 'Live Facility Queue', icon: ActivityIcon, color: '#0EA5E9' },
                    { label: 'Triage Latency', value: '4.2m', sub: 'Average Assess Time', icon: Clock, color: '#F59E0B' },
                    { label: 'Unit Readiness', value: 'ICU-08', sub: 'Primary Bed Clear', icon: BedDouble, color: '#10B981' },
                ].map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="kpi-card shadow-premium" style={{ '--color-icon': card.color }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: `${card.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={22} style={{ color: card.color }} strokeWidth={2} />
                                </div>
                                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 550, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
                            </div>
                            <div className="kpi-value" style={{ fontSize: '32px', fontWeight: 600, color: 'var(--color-navy)', lineHeight: 1, marginBottom: '6px', letterSpacing: '-0.02em' }}>
                                {loading ? <Loader2 size={24} className="animate-spin text-slate-200" /> : card.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 400 }}>{card.sub}</div>
                        </div>
                    );
                })}
            </div>

            {!loading && (
                <div className="card shadow-premium registry-card" style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: '24px', overflow: 'hidden' }}>
                    <div style={{ padding: '24px 32px', borderBottom: '1px solid #F1F5F9', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--color-navy)', margin: 0 }}>
                                {view === 'active' ? 'Active Ingress Registry' : 'Clinical Discharge Archives'}
                            </h3>
                            <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px', fontWeight: 500 }}>
                                {view === 'active' ? 'Global trauma queue and clinical prioritization hub' : 'Historical records of triaged and discharged emergency cases'}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                             <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 550, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                 {view === 'active' ? `Traffic: ${cases.length} Live` : `Records: ${cases.length} Total`}
                             </div>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table className="registry-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
                                    {['Emergency Trace', 'Triage State', 'Clinical Vitals', 'Operational Status', 'Management'].map((h, i) => (
                                        <th key={h} style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: i === 4 ? 'right' : 'left' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {cases.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '80px 24px', textAlign: 'center' }}>
                                            <div style={{ width: '64px', height: '64px', background: '#F0FDF4', color: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                                <CheckCircle2 size={32} />
                                            </div>
                                            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Clear Command Terminal</div>
                                            <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>No active trauma payloads detected in the current queue.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    cases.map((record) => {
                                        const esi = TRIAGE_LEVELS[record.triageLevel] || { label: 'In-Audit', color: '#94A3B8', bg: '#F8FAFC' };
                                        const vitals = record.triageVitals ? JSON.parse(record.triageVitals) : {};
                                        const timeIn = new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                         return (
                                               <tr key={record.id} className="registry-row">
                                                <td style={{ padding: '16px' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '14px' }}>{record.patientName}</span>
                                                        <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>{record.patient?.patientCode || 'UHID-PENDING'}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    <div className="esi-badge" style={{ 
                                                        display: 'inline-flex', 
                                                        alignItems: 'center', 
                                                        gap: '8px', 
                                                        padding: '6px 14px', 
                                                        borderRadius: '20px', 
                                                        background: esi.bg, 
                                                        color: esi.color, 
                                                        fontSize: '11px', 
                                                        fontWeight: 600,
                                                        border: `1px solid ${esi.color}25`,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.03em'
                                                    }}>
                                                        
                                                        {esi.label}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    <div style={{ display: 'flex', gap: '12px' }}>
                                                         <div style={{ textAlign: 'center', minWidth: '35px' }}>
                                                            <div style={{ fontSize: '9px', fontWeight: 500, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '1px' }}>BP</div>
                                                            <div className="vitals-val" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy)' }}>{vitals.bp || '--'}</div>
                                                        </div>
                                                        <div style={{ textAlign: 'center', minWidth: '35px' }}>
                                                            <div style={{ fontSize: '9px', fontWeight: 500, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '1px' }}>HR</div>
                                                            <div className="vitals-val" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy)' }}>{vitals.hr || '--'}</div>
                                                        </div>
                                                        <div style={{ textAlign: 'center', minWidth: '35px' }}>
                                                            <div style={{ fontSize: '9px', fontWeight: 500, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '1px' }}>SpO2</div>
                                                            <div className="vitals-val" style={{ fontSize: '13px', fontWeight: 600, color: vitals.spo2 < 90 ? '#EF4444' : '#10B981' }}>{vitals.spo2 || '--'}%</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                     <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                         {(record.status || '').includes('Referred') ? <ArrowUpRight size={12} /> : <Clock size={12} />}
                                                         {record.status === 'Active' ? 'Active Trauma' : (record.status || 'In Transit')}
                                                     </div>
                                                 </td>
                                                  <td style={{ padding: '16px', textAlign: 'right' }}>
                                                     <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                         <Link href={`/emergency/${record.apptCode}?action=assess`} style={{ textDecoration: 'none' }}>
                                                             <button className="btn btn-secondary btn-sm" style={{ padding: '0 12px', height: '32px', fontSize: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', color: 'var(--color-navy)', borderRadius: '6px' }}>Assessment</button>
                                                         </Link>
                                                         <Link href={`/emergency/${record.apptCode}`} style={{ textDecoration: 'none' }}>
                                                             <button className="btn btn-secondary btn-sm" style={{ padding: '0 12px', height: '32px', fontSize: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', color: 'var(--color-navy)', borderRadius: '6px' }}>
                                                                 Manage
                                                             </button>
                                                         </Link>
                                                     </div>
                                                 </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
