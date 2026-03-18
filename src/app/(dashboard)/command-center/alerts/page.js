'use client';
import { Bell, ArrowLeft, Search, Filter, CheckCircle2, AlertTriangle, Siren, Clock, X, Info, User, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

export default function AlertsLedgerPage() {
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/command-center/alerts');
            if (res.ok) {
                const data = await res.json();
                setAlerts(data.alerts || []);
            }
        } catch(e) {} finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleInvestigate = (alert) => {
        setSelectedAlert(alert);
    };

    const handleResolve = async (id) => {
        // Find the database ID. In my API, I used `ALT-XXXX` for display.
        // Let's modify the API to return the actual database ID too.
        // Or for now, I'll update the API to return `dbId`.
        const dbId = selectedAlert.dbId;
        try {
            const res = await fetch('/api/command-center/alerts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: dbId, resolve: true })
            });
            if (res.ok) {
                setSelectedAlert(null);
                fetchData();
            }
        } catch(e) {}
    };

    return (
        <div className="fade-in">
            <style>{`
                .modal-overlay {
                    position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px);
                    display: flex; align-items: center; justify-content: center; z-index: 1000;
                }
                .modal-card {
                    background: #fff; width: 100%; max-width: 500px; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                    overflow: hidden; animation: slideUp 0.3s ease-out;
                }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .action-btn {
                    padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s;
                }
            `}</style>

            <div className="dashboard-header-row" style={{ marginBottom: '28px' }}>
                <div>
                    <h1 className="page-header__title" style={{ fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Alert Resolution Ledger</h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>Comprehensive audit log for all clinical and operational priority signals.</p>
                </div>
                <Link href="/command-center" className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                    <ArrowLeft size={14} /> Back to Command
                </Link>
            </div>

            <div className="card" style={{ padding: '24px', borderRadius: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ position: 'relative', width: '260px' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} />
                            <input type="text" placeholder="Filter signals..." style={{ width: '100%', padding: '10px 12px 10px 40px', border: '1px solid var(--color-border-light)', borderRadius: '10px', outline: 'none', fontSize: '13px' }} />
                        </div>
                        <button className="btn btn-secondary btn-sm" style={{ background: '#fff', border: '1px solid var(--color-border-light)' }}>
                            <Filter size={14} /> Refine View
                        </button>
                    </div>
                </div>

                <div style={{ width: '100%', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Alert ID</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Signal Source</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Description</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && <tr><td colSpan="5" className="text-center py-10 text-slate-400">Scanning neural signals...</td></tr>}
                            {!loading && alerts.length === 0 && <tr><td colSpan="5" className="text-center py-20 text-slate-400"><Siren className="mx-auto mb-4 opacity-10" size={48} /><p className="font-bold">Signals Clear</p></td></tr>}
                            {alerts.map((a) => (
                                <tr key={a.id} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.15s' }} className="table-row-hover">
                                    <td style={{ padding: '16px', fontSize: '13px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-navy)' }}>{a.id}</td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: a.severity === 'critical' ? '#EF4444' : a.severity === 'warning' ? '#F59E0B' : '#3B82F6' }} />
                                            <span style={{ fontSize: '13px', color: '#475569', fontWeight: 700 }}>{a.type}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>{a.msg}</div>
                                        <div style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                            <Clock size={10} /> {a.time}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: a.status === 'Resolved' ? '#DCFCE7' : a.status === 'Active' ? '#FEE2E2' : '#FEFABE', color: a.status === 'Resolved' ? '#15803D' : a.status === 'Active' ? '#B91C1C' : '#854D0E' }}>
                                            {a.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button 
                                            onClick={() => handleInvestigate(a)}
                                            className="btn btn-secondary btn-sm" 
                                            style={{ background: '#fff' }}
                                        >
                                            Investigate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Investigation Modal */}
            {selectedAlert && (
                <div className="modal-overlay" onClick={() => setSelectedAlert(null)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: selectedAlert.severity === 'critical' ? '#FFF1F2' : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedAlert.severity === 'critical' ? '#E11D48' : '#2563EB' }}>
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-navy)' }}>Investigate Signal</div>
                                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>{selectedAlert.id} • {selectedAlert.type}</div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedAlert(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Info size={14} /> Description
                                </div>
                                <div style={{ fontSize: '15px', color: 'var(--color-navy)', fontWeight: 600, lineHeight: 1.5 }}>
                                    {selectedAlert.msg}
                                </div>
                                <div style={{ fontSize: '14px', color: '#64748B', marginTop: '10px' }}>
                                    {selectedAlert.details}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                <div>
                                    <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Impact Level</div>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: selectedAlert.severity === 'critical' ? '#E11D48' : '#F59E0B' }}>
                                        {selectedAlert.severity.toUpperCase()}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Escalation</div>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)' }}>Level 2 Supervisor</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="action-btn" style={{ flex: 1, background: 'var(--color-navy)', color: '#fff', border: 'none' }} onClick={() => handleResolve(selectedAlert.id)}>
                                    Resolve Signal
                                </button>
                                <button className="action-btn" style={{ flex: 1, background: '#fff', color: '#64748B', border: '1px solid #CBD5E1' }}>
                                    Escalate Case
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
