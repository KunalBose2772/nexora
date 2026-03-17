'use client';
import { BedDouble, Plus, Search, Filter, Activity, ShieldAlert, IndianRupee, ArrowRightLeft, LogOut, Clock, UserRound, MapPin, AlertCircle, CheckCircle2, Siren, Ghost, Monitor, LayoutDashboard, Database, RefreshCw, X, Loader2, ArrowLeft, Users, UserCheck, MoreVertical, FileText, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Skeleton from '@/components/common/Skeleton';
import TransferModal from './TransferModal';

export default function IPDPage() {
    const [ipdPatients, setIpdPatients] = useState([]);
    const [ipdReferrals, setIpdReferrals] = useState([]);
    const [occupancy, setOccupancy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedPatientForTransfer, setSelectedPatientForTransfer] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ipdRes, occupancyRes] = await Promise.all([
                fetch('/api/ipd'),
                fetch('/api/ipd/occupancy')
            ]);

            if (ipdRes.ok) {
                const data = await ipdRes.json();
                setIpdPatients(data.ipdPatients || []);
                setIpdReferrals(data.ipdReferrals || []);
            }

            if (occupancyRes.ok) {
                const data = await occupancyRes.json();
                setOccupancy(data.summary);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleInitiateDischarge = async (id, name) => {
        if (!confirm(`Initiate discharge protocols for ${name}?`)) return;
        try {
            const res = await fetch('/api/ipd', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: 'Discharge Initiated' })
            });
            if (res.ok) fetchData();
        } catch (e) { }
    };

    const filteredPatients = ipdPatients.filter(pt =>
        (pt.patientName && pt.patientName.toLowerCase().includes(search.toLowerCase())) ||
        (pt.apptCode && pt.apptCode.toLowerCase().includes(search.toLowerCase())) ||
        (pt.ward && pt.ward.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="fade-in pb-20">
            <style jsx>{`
                .critical-pulse {
                    animation: critical-glow 2s infinite;
                }
                @keyframes critical-glow {
                    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
                .logistics-btn {
                    height: 38px;
                    width: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    background: #F8FAFC;
                    color: #94A3B8;
                    transition: all 0.2s;
                }
                .logistics-btn:hover {
                    background: #fff;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                    color: var(--color-navy);
                }
                .referral-card {
                    background: #fff;
                    border: 1px solid #F1F5F9;
                    border-radius: 20px;
                    padding: 24px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .referral-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px -10px rgba(0,0,0,0.1);
                }
            `}</style>

            <div className="dashboard-header-row mb-10">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '52px', height: '52px', background: 'var(--color-navy)', color: '#fff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                        <BedDouble size={24} />
                    </div>
                    <div>
                        <h1 className="responsive-h1" style={{ margin: 0 }}>Inpatient Hub (IPD)</h1>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0', fontWeight: 500 }}>Ward occupancy monitoring, clinical logistics, and discharge governance.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons" style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={fetchData} className="btn btn-secondary" style={{ background: '#fff', color: 'var(--color-navy)', borderRadius: '12px', height: '44px', padding: '0 20px' }}>
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} style={{ marginRight: '8px' }} /> Sync Roster
                    </button>
                    <Link href="/ipd/admit" className="btn btn-primary" style={{ background: 'var(--color-navy)', borderRadius: '12px', height: '44px', padding: '0 24px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> New Admission
                    </Link>
                </div>
            </div>

            <div className="kpi-grid mb-10">
                {[
                    { label: 'Ward Load', value: ipdPatients.length, sub: 'Active Inpatients', icon: Users, color: '#0EA5E9' },
                    { label: 'Critical Care', value: ipdPatients.filter(p => p.status === 'Critical').length, sub: 'High Alert Cases', icon: Siren, color: '#EF4444' },
                    { label: 'Admission Pool', value: ipdReferrals.length, sub: 'Transit Hub Queue', icon: ArrowRightLeft, color: '#F59E0B' },
                    { label: 'Unit Capacity', value: occupancy?.availableBeds || 0, sub: 'Available Beds', icon: BedDouble, color: '#10B981' },
                ].map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="kpi-card shadow-premium" style={{ border: '1px solid #F1F5F9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} style={{ color: card.color }} strokeWidth={2} />
                                </div>
                                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--color-navy)', lineHeight: 1, marginBottom: '6px' }}>
                                {loading ? <Loader2 size={24} className="animate-spin text-slate-200" /> : card.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>{card.sub}</div>
                        </div>
                    );
                })}
            </div>

            {!loading && ipdReferrals.length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 10px rgba(245,158,11,0.5)' }}></div>
                        <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Logistics Queue: Admissions Transit Hub</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                        {ipdReferrals.map(ref => (
                            <div key={ref.id} className="referral-card shadow-premium">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div>
                                        <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '4px' }}>{ref.patientName}</div>
                                        <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Stethoscope size={12} /> Ref by Dr. {ref.doctorName}
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', padding: '4px 8px', borderRadius: '6px', background: ref.referralUrgency === 'Emergency' ? '#FEE2E2' : '#FEF3C7', color: ref.referralUrgency === 'Emergency' ? '#EF4444' : '#B45309' }}>
                                        {ref.referralUrgency}
                                    </span>
                                </div>
                                <div style={{ marginBottom: '20px', padding: '12px', background: '#F8FAFC', borderRadius: '12px', fontSize: '12px', color: '#64748B', fontWeight: 500, fontStyle: 'italic' }}>
                                    "{ref.remarks || 'Standard referral for IPD evaluation'}"
                                </div>
                                <Link href={`/ipd/admit?refId=${ref.id}&patientId=${ref.patientId || ''}&patient=${encodeURIComponent(ref.patientName)}&doctor=${encodeURIComponent(ref.doctorName)}`} className="btn btn-primary" style={{ width: '100%', height: '42px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', background: 'var(--color-navy)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Process Admission
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="card shadow-premium" style={{ padding: '0', overflow: 'hidden', border: '1px solid #F1F5F9' }}>
                <div style={{ padding: '24px', background: '#fff', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                        <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                            type="text" 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            placeholder="Find inpatients by Token, Patient Name, or Ward Wing..." 
                            style={{ width: '100%', padding: '12px 16px 12px 48px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', outline: 'none', fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }} 
                        />
                    </div>
                    <Link href="/ipd/clearance" className="btn btn-secondary" style={{ background: '#fff', color: '#F97316', border: '1px solid #FFEDD5', borderRadius: '12px', height: '44px', padding: '0 20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700 }}>
                        <ShieldAlert size={18} /> ClearanceHQ
                    </Link>
                </div>

                <div className="responsive-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>IPD No.</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Patient Demographics</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Ward/Bed Unit</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Admitting Lead</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Admission Status</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Ledger</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i}>
                                        <td colSpan="7" style={{ padding: '16px 24px' }}><Skeleton className="h-4 w-full" /></td>
                                    </tr>
                                ))
                            ) : filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ padding: '80px 24px', textAlign: 'center' }}>
                                        <div style={{ color: '#94A3B8', fontSize: '14px', fontWeight: 600 }}>Inpatient registry is currently empty.</div>
                                    </td>
                                </tr>
                            ) : (
                                    filteredPatients.map((pt) => (
                                        <tr key={pt.id} 
                                            className="registry-row"
                                        >
                                            <td style={{ padding: '16px' }}>
                                                <span style={{ color: 'var(--color-navy)', fontWeight: 600, fontFamily: 'monospace', fontSize: '13px' }}>{pt.apptCode}</span>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '14px' }}>{pt.patientName}</span>
                                                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>UHID: {pt.patientUhId || '-'}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px', fontWeight: 500 }}>{pt.ward} {pt.bed ? `- ${pt.bed}` : ''}</div>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>Dr. {pt.doctorName}</span>
                                                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>{pt.department}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <span className={`badge ${pt.status === 'Critical' ? 'badge-error' : pt.status.includes('Discharge') ? 'badge-success' : 'badge-info'}`} style={{ padding: '4px 10px', fontSize: '11px' }}>
                                                    {pt.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', padding: '4px 8px', borderRadius: '4px', background: pt.paymentStatus === 'Advance Paid' ? '#DCFCE7' : '#FEF3C7', color: pt.paymentStatus === 'Advance Paid' ? '#15803D' : '#B45309' }}>
                                                    {pt.paymentStatus || 'Pending'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center', position: 'relative' }} onClick={e => e.stopPropagation()}>
                                                    <button onClick={() => setSelectedPatientForTransfer(pt)} className="btn btn-secondary btn-sm" style={{ padding: '6px', minWidth: '32px', height: '32px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#fff' }} title="Transfer">
                                                        <ArrowRightLeft size={14} />
                                                    </button>
                                                    <Link href={`/billing/ipd-ledger?ipdId=${pt.id}`} className="btn btn-secondary btn-sm" style={{ padding: '6px', minWidth: '32px', height: '32px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Ledger">
                                                        <IndianRupee size={14} />
                                                    </Link>
                                                    
                                                    <div style={{ position: 'relative' }}>
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenMenuId(openMenuId === pt.id ? null : pt.id);
                                                            }}
                                                            className="btn btn-secondary btn-sm" 
                                                            style={{ width: '32px', height: '32px', padding: 0, background: openMenuId === pt.id ? '#F1F5F9' : '#fff', borderRadius: '6px', border: '1px solid #E2E8F0' }}
                                                        >
                                                            <MoreVertical size={14} color="#64748B" />
                                                        </button>
                                                        
                                                        {openMenuId === pt.id && (
                                                            <div className="actions-dropdown shadow-lg" style={{ right: 0, top: '40px', textAlign: 'left' }} onClick={e => e.stopPropagation()}>
                                                                {pt.patientUhId ? (
                                                                    <Link href={`/patients/records/${pt.patientUhId}`} className="dropdown-item">
                                                                        <FileText size={14} /> Patient Profile
                                                                    </Link>
                                                                ) : (
                                                                    <div className="dropdown-item" style={{ opacity: 0.5, cursor: 'not-allowed' }} title="No registered profile linked">
                                                                        <FileText size={14} /> Profile (Unlinked)
                                                                    </div>
                                                                )}
                                                                <button type="button" className="dropdown-item" onClick={() => handleInitiateDischarge(pt.id, pt.patientName)}>
                                                                    <LogOut size={14} /> Request Discharge
                                                                </button>
                                                                <button type="button" className="dropdown-item" style={{ color: '#EF4444' }}>
                                                                    <AlertCircle size={14} /> Critical Alert
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedPatientForTransfer && (
                <TransferModal
                    isOpen={!!selectedPatientForTransfer}
                    patient={selectedPatientForTransfer}
                    onClose={() => setSelectedPatientForTransfer(null)}
                    onTransferSuccess={fetchData}
                />
            )}
        </div>
    );
}
