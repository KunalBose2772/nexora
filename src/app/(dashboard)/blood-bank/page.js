'use client';

import { 
    Droplet, 
    Thermometer, 
    AlertTriangle, 
    Plus, 
    Search, 
    RefreshCw,
    History,
    FileText,
    ArrowUpRight,
    CheckCircle2,
    Loader2,
    Clock,
    Zap,
    MoveRight,
    Calendar,
    Activity
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Skeleton from '@/components/common/Skeleton';
import Link from 'next/link';

export default function BloodBankDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDonationModal, setShowDonationModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [donationForm, setDonationForm] = useState({
        bloodGroup: 'O+',
        component: 'Whole Blood',
        units: 1,
        expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        source: 'Voluntary Donor'
    });

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [stockRes, flowRes] = await Promise.all([
                fetch('/api/blood-bank/inventory'),
                fetch('/api/blood-bank/requests')
            ]);
            
            const stockData = await stockRes.json();
            const flowData = await flowRes.json();

            if (stockRes.ok && flowRes.ok) {
                // Aggregate units by type
                const groups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
                const aggregated = groups.map(g => {
                    const units = (stockData.stock || [])
                        .filter(s => s.bloodGroup === g)
                        .reduce((sum, s) => sum + s.units, 0);
                    return {
                        type: g,
                        units: units,
                        status: units > 10 ? 'Optimal' : units > 5 ? 'Low' : 'Critical'
                    };
                });

                setData({
                    inventory: aggregated,
                    pendingRequests: (flowData.requests || []).map(r => ({
                        id: r.requestCode,
                        pt: `${r.patient?.firstName} ${r.patient?.lastName}`,
                        type: r.bloodGroup,
                        qty: `${r.unitsRequired} Units`,
                        urgency: r.priority,
                        time: new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    })).slice(0, 5),
                    metrics: {
                        todayIssued: (flowData.requests || []).filter(r => r.status === 'Issued').length,
                        todayDonations: (stockData.stock || []).filter(s => new Date(s.createdAt).toDateString() === new Date().toDateString()).length,
                        expiringSoon: (stockData.stock || []).filter(s => {
                            const diff = new Date(s.expiryDate) - new Date();
                            return diff > 0 && diff < (7 * 24 * 60 * 60 * 1000);
                        }).length,
                        totalInventory: (stockData.stock || []).reduce((sum, s) => sum + s.units, 0)
                    }
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const KPI_CARDS = [
        { id: 'inventory', label: 'Total Inventory', value: '142', sub: 'Calculated across all types', icon: Droplet, color: '#EF4444' },
        { id: 'issued', label: 'Issued Today', value: data?.metrics.todayIssued, sub: 'Units moved to clinical zones', icon: MoveRight, color: '#3B82F6' },
        { id: 'expiring', label: 'Expiring Soon', value: data?.metrics.expiringSoon, sub: 'Valid for next 7 days', icon: AlertTriangle, color: '#F59E0B' },
        { id: 'ready', label: 'Donations Today', value: data?.metrics.todayDonations, sub: 'Fresh units collected', icon: Zap, color: '#10B981' },
    ];

    return (
        <div className="fade-in">
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .kpi-card { background: #fff; border: 1px solid var(--color-border-light); border-radius: 16px; padding: 20px; text-decoration: none; display: block; transition: all 0.18s; }
                .kpi-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.06); transform: translateY(-2px); }
                .inventory-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
                .inventory-item { background: #fff; border: 1px solid var(--color-border-light); borderRadius: 12px; padding: 16px; text-align: center; transition: all 0.15s; }
                .inventory-item:hover { border-color: #EF4444; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.05); }
            `}</style>

            <div className="dashboard-header-row" style={{ marginBottom: '28px' }}>
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Blood Bank Command</h1>
                    <p className="page-header__subtitle">{dateStr} — Manage components, inventory, and clinical issuance.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={loadData} disabled={loading}>
                        <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                        {loading ? 'Refreshing…' : 'Refresh Data'}
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowDonationModal(true)}>
                        <Plus size={15} /> New Collection
                    </button>
                </div>
            </div>

            {/* Strategic KPI Strip — 4 Big Cards matching dashboard style */}
            <div className="kpi-grid" style={{ marginBottom: '28px' }}>
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
                                {loading ? <Loader2 size={22} className="animate-spin text-muted" /> : card.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94A3B8' }}>{card.sub}</div>
                        </div>
                    );
                })}
            </div>

            {/* Donation Modal */}
            {showDonationModal && (
                <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card fade-in" style={{ width: '480px', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>Register New Collection</h2>
                            <button onClick={() => setShowDonationModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Blood Group</label>
                                <select className="form-input" value={donationForm.bloodGroup} onChange={e => setDonationForm({...donationForm, bloodGroup: e.target.value})}>
                                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g}>{g}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Component</label>
                                <select className="form-input" value={donationForm.component} onChange={e => setDonationForm({...donationForm, component: e.target.value})}>
                                    {['Whole Blood', 'PRC (Red Cells)', 'FFP (Plasma)', 'Platelets'].map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                            <div className="form-group">
                                <label className="form-label">Units</label>
                                <input type="number" className="form-input" value={donationForm.units} onChange={e => setDonationForm({...donationForm, units: e.target.value})} MIN="1" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Expiry Date</label>
                                <input type="date" className="form-input" value={donationForm.expiryDate} onChange={e => setDonationForm({...donationForm, expiryDate: e.target.value})} />
                            </div>
                        </div>
                        <button 
                            className="btn btn-primary" 
                            style={{ width: '100%', height: '52px', background: '#EF4444', borderColor: '#EF4444' }}
                            disabled={saving}
                            onClick={async () => {
                                setSaving(true);
                                try {
                                    const res = await fetch('/api/blood-bank/inventory', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(donationForm)
                                    });
                                    if (res.ok) {
                                        setShowDonationModal(false);
                                        loadData();
                                    }
                                } catch (e) {
                                    alert('Failed to sync donation record.');
                                } finally {
                                    setSaving(false);
                                }
                            }}
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : 'Confirm Clinical Ingress'}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid-balanced" style={{ marginBottom: '28px' }}>
                {/* Inventory Matrix */}
                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--color-border-light)' }}>
                        <div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)' }}>Component Matrix</div>
                            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Live units by blood grouping</div>
                        </div>
                        <Activity size={18} style={{ color: '#EF4444' }} />
                    </div>
                    <div style={{ padding: '24px' }}>
                        {loading ? <Skeleton height="240px" /> : (
                            <div className="inventory-grid">
                                {data?.inventory.map((item, i) => (
                                    <div key={i} className="inventory-item">
                                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#EF4444', marginBottom: '4px' }}>{item.type}</div>
                                        <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1 }}>{item.units}</div>
                                        <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700, marginTop: '8px' }}>Units</div>
                                        <div style={{ marginTop: '8px', fontSize: '9px', fontWeight: 800, color: item.status === 'Optimal' ? '#16A34A' : '#EF4444', textTransform: 'uppercase' }}>{item.status}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Requisition Queue */}
                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--color-border-light)' }}>
                        <div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)' }}>Requisition Ledger</div>
                            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Clinical requests awaiting cross-matching</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', fontSize: '11px', background: '#fff' }}>Manual Request</button>
                            <History size={18} style={{ color: '#94A3B8' }} />
                        </div>
                    </div>
                    {loading ? <div style={{ padding: '24px' }}><Skeleton height="240px" /></div> : (
                        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ background: '#F8FAFC' }}>
                                    {['Request', 'Patient', 'Type', 'Qty', 'Urgency'].map(h => (
                                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border-light)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data?.pendingRequests.map(req => (
                                    <tr key={req.id} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.1s' }} onMouseOver={e => e.currentTarget.style.background = '#FAFAFA'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: 'var(--color-navy)' }}>{req.id}<br/><span style={{ fontSize: '10px', color: '#CBD5E1', fontWeight: 500 }}>{req.time}</span></td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy)' }}>{req.pt}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 800, color: '#EF4444' }}>{req.type}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748B' }}>{req.qty}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '12px', background: req.urgency === 'Stat' ? '#FEE2E2' : '#F1F5F9', color: req.urgency === 'Stat' ? '#B91C1C' : '#475569' }}>{req.urgency}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    )}
                </div>
            </div>

            <div className="card" style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'center', border: '1px solid #E2E8F0' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity size={24} />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)' }}>Institutional Cold-Chain Audit</div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>Storage temperatures across all refrigeration nodes are strictly monitored at 4.2°C. Compliance validated 10 mins ago.</div>
                </div>
                <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>View Logs</button>
            </div>
        </div>
    );
}
