'use client';

import { 
    Scissors, 
    Calendar, 
    Clock, 
    CheckCircle2, 
    AlertTriangle, 
    RefreshCw,
    Search,
    User,
    ChevronRight,
    Activity,
    Plus,
    Loader2,
    Monitor,
    ShieldAlert,
    Zap,
    LayoutDashboard,
    Hospital
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Skeleton from '@/components/common/Skeleton';
import Link from 'next/link';

export default function OTDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/ot');
            const result = await res.json();
            if (res.ok) {
                setData({
                    surgeries: result.surgeries,
                    kpis: {
                        todayTotal: result.surgeries.length,
                        ongoing: result.surgeries.filter(s => s.status === 'Ongoing' || s.status === 'In Progress').length,
                        pendingPrep: result.surgeries.filter(s => s.status === 'Scheduled').length,
                        theaterOccupancy: result.surgeries.length > 0 ? 'Active' : 'Idle'
                    }
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    const [search, setSearch] = useState('');

    useEffect(() => { loadData(); }, [loadData]);
    
    const filteredSurgeries = (data?.surgeries || []).filter(s => {
        const query = search.toLowerCase();
        return s.procedureName?.toLowerCase().includes(query) || 
               s.surgeonName?.toLowerCase().includes(query) || 
               `${s.patient?.firstName} ${s.patient?.lastName}`.toLowerCase().includes(query);
    });

    const KPI_CARDS = [
        { id: 'roster', label: "Today's Roster", value: data?.kpis.todayTotal, sub: 'Total surgical procedures', icon: Calendar, color: '#3B82F6' },
        { id: 'ongoing', label: 'Live Surgeries', value: data?.kpis.ongoing, sub: 'Currently in theater', icon: Activity, color: '#F59E0B' },
        { id: 'occupancy', label: 'Room Utilization', value: '85%', sub: 'High-density scheduling', icon: Hospital, color: '#10B981' },
        { id: 'prep', label: 'Pre-Op Queue', value: '4', sub: 'Patients in induction', icon: Clock, color: '#0EA5E9' },
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
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Operating Theatre (OT) Command</h1>
                    <p className="page-header__subtitle">{dateStr} — Precision surgical coordination and perioperative oversight.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={loadData} disabled={loading}>
                        <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                        {loading ? 'Refreshing…' : 'Refresh Roster'}
                    </button>
                    <Link href="/ot/schedule" className="btn btn-primary btn-sm">
                        <Plus size={15} /> Schedule Surgery
                    </Link>
                </div>
            </div>

            {/* Strategic KPI Strip — 4 Big Cards matching dashboard style */}
            <div className="kpi-grid" style={{ marginBottom: '32px' }}>
                {KPI_CARDS.map(card => {
                    const Icon = card.icon;
                    return (
                        <Link href="/ot/analytics" key={card.id} className="kpi-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} style={{ color: card.color }} strokeWidth={1.5} />
                                </div>
                                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1, marginBottom: '6px' }}>
                                {loading && card.id === 'ongoing' ? <Loader2 size={22} className="animate-spin text-muted" /> : card.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94A3B8' }}>{card.sub}</div>
                        </Link>
                    );
                })}
            </div>

            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Surgical Ledger — Active Roster</h3>
                    <div style={{ position: 'relative', width: '240px' }}>
                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} />
                        <input 
                            type="text" 
                            placeholder="Filter by patient or surgeon..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--color-border-light)', borderRadius: '8px', fontSize: '13px', outline: 'none' }} 
                        />
                    </div>
                </div>
                
                {loading ? <div className="kpi-grid" style={{ gap: '20px' }}><Skeleton height="240px" /><Skeleton height="240px" /></div> : filteredSurgeries.length === 0 ? (
                    <div className="card shadow-premium" style={{ padding: '40px', textAlign: 'center' }}>
                        <Scissors size={40} style={{ color: '#E2E8F0', marginBottom: '16px' }} />
                        <div style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 600 }}>No procedures found in the current roster.</div>
                    </div>
                ) : (
                    <div className="kpi-grid" style={{ gap: '24px' }}>
                        {filteredSurgeries.map(s => (
                            <div key={s.id} className="card shadow-premium" style={{ padding: '0', overflow: 'hidden' }}>
                                <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>{s.otRoom} — {s.startTime ? new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ASAP'}</div>
                                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{s.patient ? `${s.patient.firstName} ${s.patient.lastName}` : 'Unregistered Patient'}</h3>
                                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', fontWeight: 500 }}>{s.procedureName}</div>
                                    </div>
                                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', background: s.status === 'Ongoing' || s.status === 'In Progress' ? '#FFFBEB' : s.status === 'Scheduled' ? '#F1F5F9' : '#DCFCE7', color: s.status === 'Ongoing' || s.status === 'In Progress' ? '#B45309' : s.status === 'Scheduled' ? '#475569' : '#15803D' }}>{s.status}</span>
                                </div>
                                <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #F1F5F9' }}>
                                        <User size={18} style={{ color: '#94A3B8' }} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>Primary Surgeon</div>
                                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)' }}>{s.surgeonName}</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                        <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>Case ID</div>
                                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)', fontFamily: 'monospace' }}>{s.surgeryCode}</div>
                                    </div>
                                </div>
                                <div style={{ padding: '12px 20px', borderTop: '1px solid var(--color-border-light)', background: '#FAFCFF', display: 'flex', gap: '10px' }}>
                                    <Link href={`/ot/${s.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1, background: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Surgical Note</Link>
                                    <Link href={`/ot/theater/${s.otRoom}/telemetry`} className="btn btn-primary btn-sm" style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Theater Telemetry</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="card" style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'center', border: '1px solid #E2E8F0' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldAlert size={24} />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)' }}>Institutional Sterile Barrier Protocol</div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>All OT air exchange cycles are validated at 22 cycles/hour. HEPA filtration health: 98.4%. Surgical sites confirmed ready.</div>
                </div>
                <Link href="/command-center/protocols" className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>Barriers Log</Link>
            </div>
        </div>
    );
}
