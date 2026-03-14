'use client';

import { 
    Share2, 
    Smartphone, 
    MessageSquare, 
    Mail, 
    Send, 
    Search, 
    Filter, 
    RefreshCw, 
    CheckCircle2, 
    Activity, 
    ShieldCheck, 
    Clock,
    Loader2,
    Zap,
    MoveRight,
    Radio
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Skeleton from '@/components/common/Skeleton';
import Link from 'next/link';

export default function CommunicationsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/communications');
            const data = await res.json();
            if (res.ok) setLogs(data.logs || []);
        } catch (err) { }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    const getIcon = (channel) => {
        switch (channel) {
            case 'SMS': return <Smartphone size={14} />;
            case 'WhatsApp': return <MessageSquare size={14} className="text-emerald-500" />;
            case 'Email': return <Mail size={14} />;
            default: return <Send size={14} />;
        }
    };

    const KPI_CARDS = [
        { id: 'total', label: 'Total Transmissions', value: logs.length, sub: 'Outbound clinical signals', icon: Radio, color: '#3B82F6' },
        { id: 'delivery', label: 'Delivery Success', value: '98.2%', sub: 'Carrier confirmation rate', icon: CheckCircle2, color: '#10B981' },
        { id: 'engagement', label: 'WhatsApp Engagement', value: '86%', sub: 'Patient open rate', icon: MessageSquare, color: '#14B8A6' },
        { id: 'health', label: 'Gateway Health', value: '100%', sub: 'Carriers operational', icon: ShieldCheck, color: '#6366F1' },
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
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Outbound Communication Hub</h1>
                    <p className="page-header__subtitle">{dateStr} — Monitoring real-time patient engagement and delivery lifecycle.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={fetchLogs} disabled={loading}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Logs
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <Send size={15} /> New Broadcast
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
                                {loading && card.id === 'total' ? <Loader2 size={22} className="animate-spin text-muted" /> : card.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94A3B8' }}>{card.sub}</div>
                        </div>
                    );
                })}
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Transmission History</h3>
                    <div style={{ position: 'relative', width: '280px' }}>
                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} />
                        <input type="text" placeholder="Search recipients or messages..." style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid var(--color-border-light)', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                    </div>
                </div>
                
                <div className="data-table-wrapper" style={{ border: 'none' }}>
                    <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table className="data-table" style={{ width: '100%', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC' }}>
                                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Recipient Info</th>
                                <th style={{ textAlign: 'left', fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Protocol</th>
                                <th style={{ textAlign: 'left', fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Category</th>
                                <th style={{ textAlign: 'left', fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Message Payload</th>
                                <th style={{ textAlign: 'right', paddingRight: '24px', fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Status & Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? [1, 2, 3].map(i => <tr key={i}><td colSpan="5" style={{ padding: '16px' }}><Skeleton height="40px" /></td></tr>) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '48px', textAlign: 'center' }}>
                                        <Activity size={32} style={{ color: '#CBD5E1', marginBottom: '12px' }} />
                                        <p style={{ margin: 0, fontSize: '14px', color: '#94A3B8' }}>No communication logs found.</p>
                                    </td>
                                </tr>
                            ) : logs.map(log => (
                                <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.15s' }} onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '14px' }}>{log.recipientName}</div>
                                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>{log.recipientPhone || log.recipientEmail}</div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy)' }}>
                                            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {getIcon(log.channel)}
                                            </div>
                                            {log.channel}
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px', background: '#F1F5F9', color: 'var(--color-navy)' }}>{log.type}</span>
                                    </td>
                                    <td style={{ maxWidth: '300px' }}>
                                        <div style={{ fontSize: '13px', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            "{log.message}"
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                                        <span style={{ fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px', background: log.status === 'Sent' ? '#DCFCE7' : '#FEF3C7', color: log.status === 'Sent' ? '#15803D' : '#B45309' }}>{log.status === 'Sent' ? 'DELIVERED' : 'PENDING'}</span>
                                        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', fontWeight: 500 }}>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginTop: '24px', background: '#fff', border: '1px solid #E2E8F0', padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <ShieldCheck size={28} style={{ color: '#10B981' }} />
                <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Institutional Encryption Protocol</h4>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>All clinical notifications are end-to-end encrypted and delivery receipts are validated against 4 global gateway responders.</p>
                </div>
                <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto', background: '#fff' }}>Gateway Audit</button>
            </div>
        </div>
    );
}
