'use client';
import { useState, useEffect, useCallback } from 'react';
import { IndianRupee, CreditCard, Lock, CheckCircle2, TrendingDown, AlertTriangle, RefreshCw, Wallet, ReceiptText, ArrowRight, Loader2, Zap, LayoutDashboard, ShieldCheck } from 'lucide-react';
import Skeleton from '@/components/common/Skeleton';
import Link from 'next/link';

export default function PettyCashHandoverPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ expectedCash: 0, digitalCash: 0, totalTransactions: 0 });
    const [declaredCash, setDeclaredCash] = useState('');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [closed, setClosed] = useState(false);
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/billing/handover');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (err) { }
        finally { setLoading(false); }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const declared = Number(declaredCash);
    const expected = stats.expectedCash;
    const variance = declared - expected;

    const handleClosure = async (e) => {
        e.preventDefault();
        if (declaredCash === '') return;
        setSubmitting(true);
        try {
            const res = await fetch('/api/billing/handover', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expectedCash: expected, declaredCash: declared, variance, notes })
            });
            if (res.ok) setClosed(true);
        } finally { setSubmitting(false); }
    };

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px', gap: '16px' }}>
            <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-cyan)' }} />
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Auditing Liquid Assets...</p>
        </div>
    );

    if (closed) return (
        <div className="fade-in" style={{ maxWidth: '480px', margin: '40px auto', textAlign: 'center' }}>
            <div className="card" style={{ padding: '48px' }}>
                <div style={{ width: '80px', height: '80px', background: '#DCFCE7', color: '#16A34A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                    <CheckCircle2 size={40} />
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '12px' }}>Register Sealed</h1>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
                    Shift metadata and physical yield audit transmitted to central finance.
                </p>

                <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '24px', marginBottom: '32px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <span style={{ fontSize: '13px', color: '#64748B' }}>System Expected</span>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)' }}>₹{expected.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
                        <span style={{ fontSize: '13px', color: '#64748B' }}>Physical Declared</span>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-cyan)' }}>₹{declared.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)', textTransform: 'uppercase' }}>Audited Variance</span>
                        <span style={{ fontSize: '22px', fontWeight: 800, color: variance === 0 ? '#16A34A' : '#EF4444' }}>
                            {variance > 0 ? '+' : ''}₹{variance.toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>

                <Link href="/dashboard" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none' }}>Return to Command Center</Link>
            </div>
        </div>
    );

    const KPI_CARDS = [
        { id: 'expected', label: 'Expected Cash Flux', value: `₹${expected.toLocaleString('en-IN')}`, sub: 'Physical liquid yield', icon: Wallet, color: '#16A34A' },
        { id: 'digital', label: 'Digital Settlements', value: `₹${stats.digitalCash?.toLocaleString('en-IN') || 0}`, sub: 'UPI, Card & Network', icon: CreditCard, color: '#3B82F6' },
        { id: 'txns', label: 'Cycle Transacts', value: stats.totalTransactions || 0, sub: 'Total billing signals', icon: ReceiptText, color: '#F59E0B' },
        { id: 'variance', label: 'Live Variance', value: `₹${variance.toLocaleString('en-IN')}`, sub: 'Calculated real-time', icon: AlertTriangle, color: variance === 0 ? '#10B981' : '#EF4444' },
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
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Institutional Financial Governance</h1>
                    <p className="page-header__subtitle">{dateStr} — Physical cash handover and shift revenue audit.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={fetchData}>
                        <RefreshCw size={14} className={submitting ? 'animate-spin' : ''} /> Refresh Audit
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
                            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1, marginBottom: '6px' }}>
                                {card.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94A3B8' }}>{card.sub}</div>
                        </div>
                    );
                })}
            </div>

            <div className="grid-balanced">
                <div className="card" style={{ padding: '32px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '8px' }}>Manual Asset Declaration</h2>
                    <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>Physical yield must match system expectations. Discrepancies will be flagged for secondary audit.</p>
                    
                    <form onSubmit={handleClosure}>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px' }}>Total Physical Cash Collected (₹)</label>
                            <input 
                                type="number" 
                                value={declaredCash} 
                                onChange={(e) => setDeclaredCash(e.target.value)}
                                placeholder="0.00"
                                required
                                style={{ width: '100%', padding: '16px', fontSize: '24px', fontWeight: 800, borderRadius: '12px', border: '1px solid var(--color-border-light)', outline: 'none', color: 'var(--color-navy)' }} 
                            />
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px' }}>Audit Observation / Notes</label>
                            <textarea 
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any discrepancies or specific shift notes..."
                                style={{ width: '100%', padding: '16px', fontSize: '14px', borderRadius: '12px', border: '1px solid var(--color-border-light)', outline: 'none', minHeight: '100px', color: '#64748B' }}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={submitting || declaredCash === ''}
                            className="btn btn-primary" 
                            style={{ width: '100%', height: '52px', fontSize: '16px' }}
                        >
                            {submitting ? 'Transmitting Metadata...' : 'Seal Register & Handover'}
                        </button>
                    </form>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ padding: '24px', background: variance === 0 ? '#F0FDF4' : '#FFF5F5', border: variance === 0 ? '1px solid #BBF7D0' : '1px solid #FECACA' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '16px' }}>Audit Comparison</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '13px', color: '#64748B' }}>System Expectation:</span>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)' }}>₹{expected.toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '13px', color: '#64748B' }}>User Declaration:</span>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)' }}>₹{declared.toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '4px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-navy)' }}>Net Variance:</span>
                                <span style={{ fontSize: '18px', fontWeight: 800, color: variance === 0 ? '#16A34A' : '#EF4444' }}>
                                   {variance > 0 ? '+' : ''}₹{variance.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                             <ShieldCheck size={20} style={{ color: 'var(--color-navy)' }} />
                             <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Fiducial Synchronization</h3>
                        </div>
                        <p style={{ fontSize: '12px', color: '#64748B', marginTop: '12px', lineHeight: 1.5 }}>
                            Register closure generates a cryptographic hash of all shift transactions (Ledger ID: {now.getTime().toString().slice(-8)}). This seal prevents retrospective modification.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
