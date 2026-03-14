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
    Activity as ActivityIcon
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Skeleton from '@/components/common/Skeleton';
import Link from 'next/link';

const TRIAGE_LEVELS = {
    1: { label: 'ESI-1: Life Support', color: '#EF4444', bg: '#FEF2F2' },
    2: { label: 'ESI-2: Red Flag', color: '#F97316', bg: '#FFF7ED' },
    3: { label: 'ESI-3: Urgent', color: '#EAB308', bg: '#FEFCE8' },
    4: { label: 'ESI-4: Minor', color: '#22C55E', bg: '#F0FDF4' },
    5: { label: 'ESI-5: Stable', color: '#6366F1', bg: '#EEF2FF' },
};

export default function EmergencyTriagePage() {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ red: 0, total: 0 });

    const loadCases = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/emergency/triage');
            if (res.ok) {
                const data = await res.json();
                const appts = data.appointments || [];
                setCases(appts);
                setStats({
                    red: appts.filter(c => c.triageLevel === 1).length,
                    total: appts.length
                });
            }
        } catch (error) { }
        finally { setLoading(false); }
    }, []);

    useEffect(() => {
        loadCases();
        const interval = setInterval(loadCases, 30000);
        return () => clearInterval(interval);
    }, [loadCases]);

    const KPI_CARDS = [
        { id: 'red', label: 'Saturation: Red Zone', value: stats.red, sub: 'ESI-1 Priority Load', icon: Siren, color: '#EF4444' },
        { id: 'total', label: 'Active Trauma Cases', value: stats.total, sub: 'Live Facility Queue', icon: ActivityIcon, color: '#3B82F6' },
        { id: 'latency', label: 'Triage Latency', value: '4.2m', sub: 'Average per Case', icon: Clock, color: '#F59E0B' },
        { id: 'readiness', label: 'Unit Readiness', value: 'ICU-08', sub: 'Beds Clear for Ingress', icon: BedDouble, color: '#10B981' },
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
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Emergency Triage Command</h1>
                    <p className="page-header__subtitle">Real-time trauma orchestration and clinical prioritization for high-intensity ingress.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={loadCases}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Queue
                    </button>
                    <Link href="/emergency/new" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <Zap size={15} /> Critical Induction
                    </Link>
                </div>
            </div>

            {/* Emergency KPIs — 4 Big Cards matching dashboard style */}
            <div className="kpi-grid" style={{ marginBottom: '24px' }}>
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
                                {loading && card.value === stats.red ? <Loader2 size={22} className="animate-spin text-muted" /> : card.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94A3B8' }}>{card.sub}</div>
                        </div>
                    );
                })}
            </div>

            {loading && cases.length === 0 ? (
                <div className="kpi-grid" style={{ gap: '24px' }}>
                    {[1, 2, 3].map(i => <Skeleton key={i} height="280px" />)}
                </div>
            ) : cases.length === 0 ? (
                <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', background: '#F1F5F9', color: '#94A3B8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '4px' }}>Unit Optimization Achieved</h3>
                    <p style={{ fontSize: '14px', color: '#94A3B8' }}>Zero critical payloads detected in current queue.</p>
                </div>
            ) : (
                <div className="kpi-grid" style={{ gap: '24px' }}>
                    {cases.map((record) => {
                        const esi = TRIAGE_LEVELS[record.triageLevel] || { label: 'In-Audit', color: '#94A3B8', bg: '#F8FAFC' };
                        const vitals = record.triageVitals ? JSON.parse(record.triageVitals) : {};
                        const timeIn = new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                        return (
                            <div key={record.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ height: '4px', background: esi.color }} />
                                <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>{timeIn} Ingress</div>
                                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{record.patientName}</h3>
                                        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{record.patient?.patientCode || 'GUEST-UNIDENTIFIED'}</div>
                                    </div>
                                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: esi.bg, color: esi.color }}>{esi.label}</span>
                                </div>
                                
                                <div style={{ padding: '20px', flex: 1 }}>
                                    <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #F1F5F9', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                            <AlertCircle size={14} style={{ color: '#EF4444', marginTop: '2px' }} />
                                            <p style={{ fontSize: '12px', color: '#64748B', margin: 0, fontStyle: 'italic' }}>
                                                {record.admitNotes || 'Trauma assessment required immediately.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                        <div style={{ textAlign: 'center', padding: '10px', background: '#F8FAFC', borderRadius: '8px' }}>
                                            <div style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>BP</div>
                                            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-navy)' }}>{vitals.bp || '--'}</div>
                                        </div>
                                        <div style={{ textAlign: 'center', padding: '10px', background: '#F8FAFC', borderRadius: '8px' }}>
                                            <div style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Pulse</div>
                                            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-navy)' }}>{vitals.hr || '--'}</div>
                                        </div>
                                        <div style={{ textAlign: 'center', padding: '10px', background: '#F8FAFC', borderRadius: '8px' }}>
                                            <div style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>SpO2</div>
                                            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-navy)' }}>{vitals.spo2 || '--'}%</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ padding: '12px 20px', borderTop: '1px solid var(--color-border-light)', background: '#FAFCFF', display: 'flex', gap: '10px' }}>
                                    <Link href={`/emergency/${record.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                                        <button className="btn btn-secondary btn-sm" style={{ width: '100%', background: '#fff' }}>Assessment</button>
                                    </Link>
                                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>Disposition</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
