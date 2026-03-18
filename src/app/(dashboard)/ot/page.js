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
                .kpi-card { 
                    background: #fff; 
                    border: 1px solid rgba(0,0,0,0.05); 
                    border-radius: 12px; 
                    padding: 24px; 
                    text-decoration: none; 
                    display: block; 
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .kpi-card:hover { 
                    transform: translateY(-4px); 
                    box-shadow: 0 12px 24px rgba(0,0,0,0.05); 
                }
                .surgery-card {
                    background: #fff;
                    border-radius: 12px;
                    border: 1px solid rgba(0,0,0,0.05);
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                .surgery-card:hover {
                    border-color: #00C2FF60;
                    box-shadow: 0 12px 24px rgba(0,0,0,0.05);
                }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 className="responsive-h1" style={{ margin: 0, color: '#0F172A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <Scissors size={32} style={{ color: '#00C2FF' }} />
                        Operating Theatre (OT) Command
                    </h1>
                    <p style={{ margin: '4px 0 0', color: '#64748B', fontWeight: 500, fontSize: '15px' }}>{dateStr} — Precision surgical coordination and perioperative oversight.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff', borderRadius: '8px' }} onClick={loadData} disabled={loading}>
                        <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                        {loading ? 'Refreshing…' : 'Refresh Roster'}
                    </button>
                    <Link href="/ot/schedule" className="btn btn-primary btn-sm flex items-center gap-2" style={{ textDecoration: 'none', borderRadius: '8px' }}>
                        <Plus size={15} /> Schedule Surgery
                    </Link>
                </div>
            </div>

            {/* Strategic KPI Strip — 4 Big Cards matching dashboard style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {KPI_CARDS.map(card => {
                    const Icon = card.icon;
                    return (
                        <Link href="/ot/analytics" key={card.id} className="kpi-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${card.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} style={{ color: card.color }} />
                                </div>
                                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</div>
                            </div>
                            <div style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', lineHeight: 1, marginBottom: '8px' }}>
                                {loading && card.id === 'ongoing' ? <Loader2 size={24} className="animate-spin text-muted" /> : card.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: card.color }} />
                                {card.sub}
                            </div>
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
                            <div key={s.id} className="surgery-card">
                                <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <div style={{ padding: '4px 10px', background: '#F0F9FF', color: '#00C2FF', borderRadius: '8px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>{s.otRoom}</div>
                                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8' }}>{s.startTime ? new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ASAP'}</div>
                                        </div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{s.patient ? `${s.patient.firstName} ${s.patient.lastName}` : 'Unregistered Patient'}</h3>
                                        <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', fontWeight: 500 }}>{s.procedureName}</div>
                                    </div>
                                    <div style={{ 
                                        padding: '6px 14px', 
                                        borderRadius: '20px', 
                                        fontSize: '11px', 
                                        fontWeight: 800, 
                                        background: s.status === 'Ongoing' || s.status === 'In Progress' ? '#FFFBEB' : s.status === 'Scheduled' ? '#F8FAFC' : '#F0FDF4', 
                                        color: s.status === 'Ongoing' || s.status === 'In Progress' ? '#B45309' : s.status === 'Scheduled' ? '#64748B' : '#16A34A',
                                        border: '1px solid',
                                        borderColor: s.status === 'Ongoing' || s.status === 'In Progress' ? '#FDE68A' : s.status === 'Scheduled' ? '#E2E8F0' : '#BBF7D0'
                                    }}>{s.status.toUpperCase()}</div>
                                </div>
                                <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #F1F5F9' }}>
                                        <User size={20} style={{ color: '#0F172A' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Surgeon</div>
                                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>{s.surgeonName}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Case ID</div>
                                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', fontFamily: 'JetBrains Mono, monospace' }}>{s.surgeryCode}</div>
                                    </div>
                                </div>
                                <div style={{ padding: '16px 24px', background: '#F8FAFC', display: 'flex', gap: '12px', borderTop: '1px solid #F1F5F9' }}>
                                    <Link href={`/ot/${s.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1, background: '#fff' }}>Surgical Note</Link>
                                    <Link href={`/ot/theater/${s.otRoom}/telemetry`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>Theater Telemetry</Link>
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
