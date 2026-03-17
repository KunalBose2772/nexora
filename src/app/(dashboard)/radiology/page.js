'use client';
import { Activity, Search, Plus, Filter, FileText, CheckCircle2, AlertCircle, ArrowRight, Loader2, Play, Image as LucideImage, ShieldAlert, Clock, MoreVertical, Eye, RefreshCw, ExternalLink, Siren, Ghost, Monitor, LayoutDashboard, Database, LayoutTemplate, Scan, Radiometer, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Skeleton from '@/components/common/Skeleton';

export default function RadiologyDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/radiology/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        } catch (err) { }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchOrders(); }, []);

    const filtered = (orders || []).filter(o =>
        (o.orderCode?.toLowerCase().includes(search.toLowerCase())) ||
        (o.patient?.firstName?.toLowerCase().includes(search.toLowerCase())) ||
        (o.patient?.lastName?.toLowerCase().includes(search.toLowerCase())) ||
        (o.procedureName?.toLowerCase().includes(search.toLowerCase()))
    );

    const kpiStats = {
        pending: orders.filter(o => o.status === 'Pending').length,
        inProgress: orders.filter(o => o.status === 'In-Progress').length,
        completed: orders.filter(o => o.status === 'Completed').length,
        stat: orders.filter(o => o.priority === 'STAT').length
    };

    return (
        <div className="fade-in pb-20">
            <style jsx>{`
                .stat-pulse { animation: stat-glow 1.5s infinite; }
                @keyframes stat-glow {
                    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
                .modality-btn {
                    height: 38px;
                    padding: 0 16px;
                    border-radius: 10px;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>

            <div className="dashboard-header-row mb-10">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '52px', height: '52px', background: 'var(--color-navy)', color: '#fff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                        <Scan size={24} />
                    </div>
                    <div>
                        <h1 className="responsive-h1" style={{ margin: 0 }}>Imaging Command</h1>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0', fontWeight: 500 }}>PACS-integrated RIS orchestration and modality worklist governance.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons" style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={fetchOrders} className="btn btn-secondary shadow-sm" style={{ background: '#fff', color: 'var(--color-navy)', borderRadius: '12px', height: '44px', padding: '0 20px' }}>
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} style={{ marginRight: '8px' }} /> Sync PACS Worklist
                    </button>
                    <Link href="/radiology/modality-worklist" className="btn btn-secondary shadow-sm" style={{ background: '#fff', color: 'var(--color-navy)', borderRadius: '12px', height: '44px', padding: '0 20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LucideImage size={16} style={{ color: '#0EA5E9' }} /> View DICOM
                    </Link>
                    <Link href="/radiology/orders/new" className="btn btn-primary" style={{ background: 'var(--color-navy)', borderRadius: '12px', height: '44px', padding: '0 24px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={18} /> Deploy Modality
                    </Link>
                </div>
            </div>

            <div className="kpi-grid mb-10">
                {[
                    { label: 'Aggregate Load', value: orders.length, sub: 'Archived Accessions', icon: Database, color: '#0EA5E9' },
                    { label: 'STAT Priority', value: kpiStats.stat, sub: 'Critical Acquisitions', icon: Siren, color: '#EF4444' },
                    { label: 'Live Modalities', value: kpiStats.inProgress, sub: 'Studies In-Flux', icon: Activity, color: '#F59E0B' },
                    { label: 'Report Yield', value: kpiStats.completed, sub: 'Finalized Studies', icon: CheckCircle2, color: '#10B981' },
                ].map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="kpi-card shadow-premium" style={{ border: '1px solid #F1F5F9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} style={{ color: card.color }} strokeWidth={2.5} />
                                </div>
                                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--color-navy)', lineHeight: 1, marginBottom: '6px' }}>
                                {loading ? <Loader2 size={24} className="animate-spin text-slate-200" /> : card.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 400 }}>{card.sub}</div>
                        </div>
                    );
                })}
            </div>

            <div className="card shadow-premium" style={{ padding: '0', overflow: 'hidden', border: '1px solid #F1F5F9' }}>
                <div style={{ padding: '24px', background: '#fff', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                        <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                            type="text" 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            placeholder="Search imagery index by Accession No., Patient or Procedure..." 
                            style={{ width: '100%', padding: '12px 16px 12px 48px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', outline: 'none', fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }} 
                        />
                    </div>
                    <button style={{ height: '42px', padding: '0 20px', borderRadius: '10px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid #E2E8F0', background: '#fff', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Filter size={16} /> Modality Filters
                    </button>
                </div>

                <div className="responsive-table-container">
                    <table className="data-table">
                        <thead>
                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Accession Registry</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Biological Subject</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Modality Class</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Clinical Procedure</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Lifecycle State</th>
                                <th style={{ textAlign: 'right', paddingRight: '24px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>PACS Control</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i}>
                                        <td colSpan="6" style={{ padding: '16px 24px' }}><Skeleton className="h-4 w-full" /></td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '100px 24px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', color: '#cbd5e1' }}>
                                             <Zap size={64} strokeWidth={1} />
                                            <div style={{ fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>No imagery correlation detected</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((order) => {
                                    const isSTAT = order.priority === 'STAT';
                                    return (
                                        <tr key={order.id} className="interactive-row">
                                            <td style={{ paddingLeft: '24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F1F5F9', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <FileText size={14} />
                                                    </div>
                                                    <div style={{ color: 'var(--color-navy)', fontWeight: 600, fontSize: '13px', fontFamily: 'monospace', letterSpacing: '-0.02em' }}>{order.orderCode}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ color: 'var(--color-navy)', fontWeight: 600, fontSize: '14px' }}>{order.patient?.firstName} {order.patient?.lastName}</div>
                                                <div style={{ color: '#94A3B8', fontSize: '11px', marginTop: '2px', fontWeight: 500 }}>UHID: {order.patient?.patientCode}</div>
                                            </td>
                                            <td>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '8px',
                                                    fontSize: '10px',
                                                    fontWeight: 900,
                                                    textTransform: 'uppercase',
                                                    background: order.modality === 'MRI' ? '#F5F3FF' : order.modality === 'CT' ? '#EFF6FF' : order.modality === 'X-Ray' ? '#FFFBEB' : '#F0FDF4',
                                                    color: order.modality === 'MRI' ? '#6D28D9' : order.modality === 'CT' ? '#1D4ED8' : order.modality === 'X-Ray' ? '#B45309' : '#15803D'
                                                }}>
                                                    {order.modality}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ color: 'var(--color-navy)', fontWeight: 700, fontSize: '13px' }}>{order.procedureName}</div>
                                            </td>
                                            <td>
                                                <div style={{ 
                                                    padding: '4px 12px',
                                                    borderRadius: '8px',
                                                    fontSize: '10px',
                                                    fontWeight: 900,
                                                    textTransform: 'uppercase',
                                                    background: order.status === 'Completed' ? '#F0FDF4' : order.status === 'In-Progress' ? '#FFF7ED' : '#F1F5F9',
                                                    color: order.status === 'Completed' ? '#10B981' : order.status === 'In-Progress' ? '#F97316' : '#475569',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}>
                                                    {order.status}
                                                </div>
                                                {order.report?.criticalAlert && (
                                                    <div style={{ color: '#EF4444', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <AlertCircle size={10} /> Critical Anomaly
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                    <Link href={`/radiology/${order.id}`} style={{ textDecoration: 'none' }}>
                                                        <button className="modality-btn" style={{ background: order.status === 'Completed' ? 'var(--color-navy)' : '#0EA5E9', color: '#fff', border: 'none' }}>
                                                            {order.status === 'Completed' ? <Eye size={14} /> : <Play size={14} />} 
                                                            {order.status === 'Completed' ? 'Analyze' : 'Acquire'}
                                                        </button>
                                                    </Link>
                                                    <button className="btn-circle-secondary" style={{ width: '38px', height: '38px', background: '#F8FAFC', color: '#94A3B8', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
                                                        <MoreVertical size={16} />
                                                    </button>
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
        </div>
    );
}
