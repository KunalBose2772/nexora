'use client';

import {
    HeartHandshake, 
    AlertCircle, 
    CheckCircle2,
    MessageSquare, 
    Search, 
    RefreshCw,
    Clock, 
    BadgeHelp,
    ArrowRight,
    User,
    Activity,
    ShieldCheck,
    Loader2,
    Zap,
    HeartPulse,
    ThumbsUp,
    ShieldAlert
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Skeleton from '@/components/common/Skeleton';
import Link from 'next/link';

export default function GrievancePage() {
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const fetchGrievances = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/grievances');
            const data = await res.json();
            if (res.ok) setGrievances(data.grievances || []);
        } catch (err) { }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchGrievances(); }, [fetchGrievances]);

    const KPI_CARDS = [
        { id: 'active', label: 'Active Grievances', value: grievances.length, sub: 'Resolution pending', icon: MessageSquare, color: '#EF4444' },
        { id: 'satisfaction', label: 'Institution CSAT', value: '92.4%', sub: 'Target achieved', icon: ThumbsUp, color: '#10B981' },
        { id: 'resolution', label: 'Resolution SLA', value: '1.8h', sub: 'Average response time', icon: Clock, color: '#3B82F6' },
        { id: 'rating', label: 'Staff Governance', value: '4.8', sub: 'Responsive rating', icon: ShieldCheck, color: '#6366F1' },
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
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Patient Experience Governance</h1>
                    <p className="page-header__subtitle">{dateStr} — Managing institutional feedback and resolution workflows.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={fetchGrievances} disabled={loading}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Ledger
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <MessageSquare size={15} /> Log New Feedback
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

            <div className="grid-balanced">
                {/* Grievance List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Clinical Grievance Ledger</h3>
                        <div style={{ position: 'relative', width: '240px' }}>
                            <Search size={14} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} />
                            <input type="text" placeholder="Search feedback..." style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--color-border-light)', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                        </div>
                    </div>

                    {loading ? [1, 2].map(i => <Skeleton key={i} height="180px" />) : grievances.length === 0 ? (
                        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
                            <div style={{ width: '64px', height: '64px', background: '#F0FDF4', color: '#16A34A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                <HeartHandshake size={32} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '4px' }}>Excellence Confirmed</h3>
                            <p style={{ fontSize: '14px', color: '#94A3B8' }}>No active grievances detected in the current resolution cycle.</p>
                        </div>
                    ) : grievances.map((g) => (
                        <div key={g.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{g.subject}</h4>
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                                        <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>Category: <span style={{ color: 'var(--color-navy)' }}>{g.category}</span></div>
                                        <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>Recieved: <span style={{ color: 'var(--color-navy)' }}>{new Date(g.createdAt).toLocaleDateString()}</span></div>
                                    </div>
                                </div>
                                <span style={{ fontSize: '10px', fontWeight: 800, padding: '4px 10px', borderRadius: '12px', background: g.urgency === 'Critical' ? '#FEF2F2' : '#F1F5F9', color: g.urgency === 'Critical' ? '#B91C1C' : '#475569', textTransform: 'uppercase' }}>{g.urgency}</span>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>"{g.description}"</p>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '20px', alignItems: 'center' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #F1F5F9' }}>
                                        <User size={14} style={{ color: '#94A3B8' }} />
                                    </div>
                                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-navy)' }}>{g.patientName}</span>
                                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>Escalate</button>
                                        <button className="btn btn-primary btn-sm">Engage Resolution</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Resolution Overview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '16px' }}>Institutional Sentiment</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Clinical Quality</span>
                                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#16A34A' }}>96%</span>
                                </div>
                                <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: '96%', background: '#16A34A', borderRadius: '4px' }} />
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Staff Behavior</span>
                                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#10B981' }}>88%</span>
                                </div>
                                <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: '88%', background: '#10B981', borderRadius: '4px' }} />
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Infrastructure</span>
                                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#F59E0B' }}>82%</span>
                                </div>
                                <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: '82%', background: '#F59E0B', borderRadius: '4px' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '24px', background: 'var(--color-navy)', color: '#fff', border: 'none' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                            <ShieldAlert size={20} style={{ color: 'var(--color-cyan)' }} />
                            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Resolution Protocol</h3>
                        </div>
                        <p style={{ fontSize: '12px', opacity: 0.8, lineHeight: 1.6, margin: 0 }}>
                            Critical grievances must be engaged within 30 minutes of ingress. Institutional SLA requires full closure within 24 operational hours.
                        </p>
                        <button className="btn btn-sm" style={{ width: '100%', marginTop: '20px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>View Full Protocol</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
