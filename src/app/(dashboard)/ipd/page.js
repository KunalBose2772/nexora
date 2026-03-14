'use client';
import { BedDouble, Plus, Search, Filter, Activity, ShieldAlert, IndianRupee, ArrowRightLeft, LogOut, Clock, UserRound, MapPin, AlertCircle, CheckCircle2, Siren, Ghost, Monitor, LayoutDashboard, Database, RefreshCw, X, Loader2 } from 'lucide-react';
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
        if (!confirm(`Initiate discharge for ${name}?`)) return;
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
        <div className="fade-in pb-12">
            <style jsx>{`
                .kpi-card {
                    background: #fff;
                    border: 1px solid var(--color-border-light);
                    border-radius: 16px;
                    padding: 24px;
                    transition: all 0.2s ease;
                }
                .status-badge {
                    padding: 4px 10px;
                    border-radius: 8px;
                    font-size: 10px;
                    font-weight: 901;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .status-admitted { background: #F0F9FF; color: #0EA5E9; border: 1px solid #E0F2FE; }
                .status-critical { background: #FEF2F2; color: #EF4444; border: 1px solid #FEE2E2; }
                .status-ready { background: #FFF7ED; color: #F97316; border: 1px solid #FFEDD5; }
            `}</style>

            <div className="dashboard-header-row mb-8">
                <div>
                    <h1 className="responsive-h1">
                        Inpatient Management Hub
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>Inpatient orchestration, ward occupancy monitoring, and discharge workflows.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button onClick={fetchData} className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync Roster
                    </button>
                    <Link href="/ipd/admit" className="btn btn-primary btn-sm flex items-center gap-2" style={{ textDecoration: 'none' }}>
                        <Plus size={15} strokeWidth={1.5} /> Admit Patient
                    </Link>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="kpi-grid" style={{ marginBottom: '28px' }}>
                {[
                    { label: 'Total Admissions', value: ipdPatients.length, sub: 'Active Inpatients', icon: Users, color: '#0EA5E9' },
                    { label: 'High Alert Cases', value: ipdPatients.filter(p => p.status === 'Critical').length, sub: 'Critical Care', icon: ShieldAlert, color: '#EF4444' },
                    { label: 'Transit Hub', value: ipdReferrals.length, sub: 'Admission Queue', icon: Siren, color: '#F59E0B' },
                    { label: 'Unit Capacity', value: occupancy?.availableBeds || 0, sub: 'Beds Available', icon: BedDouble, color: '#10B981' },
                ].map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="kpi-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} style={{ color: card.color }} strokeWidth={1.5} />
                                </div>
                                <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>{card.label}</span>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1, marginBottom: '6px' }}>
                                {loading ? <Loader2 size={22} className="animate-spin text-muted" /> : card.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94A3B8' }}>{card.sub}</div>
                        </div>
                    );
                })}
            </div>

            {/* Referrals Section */}
            {!loading && ipdReferrals.length > 0 && (
                <div className="card mb-8 bg-amber-50/30 border-amber-100 overflow-hidden">
                    <div className="p-6 border-b border-amber-100 bg-amber-50 flex items-center gap-3">
                        <Siren size={20} className="text-amber-600" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-800">Pending Admission Logistics</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ipdReferrals.map(ref => (
                                <div key={ref.id} className="p-4 bg-white border border-amber-200 rounded-2xl shadow-sm flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-[15px] font-black text-navy-900">{ref.patientName}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">Ref by: Dr. {ref.doctorName}</div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${ref.referralUrgency === 'Emergency' ? 'bg-red-500 text-white' : 'bg-amber-100 text-amber-700'}`}>{ref.referralUrgency}</span>
                                    </div>
                                    <Link href={`/ipd/admit?refId=${ref.id}`} className="btn btn-primary btn-sm w-full py-2.5 text-[10px] uppercase font-black tracking-widest">Process Flow</Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="card">
                <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search IPD Master Index by Patient, ID, or Ward..." className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:border-cyan-500 outline-none transition-all shadow-sm" />
                    </div>
                    <button className="btn btn-secondary btn-sm h-11 px-5 border-slate-200 bg-white">
                        <Filter size={16} /> Filter Modules
                    </button>
                    <Link href="/ipd/clearance" className="btn btn-secondary btn-sm h-11 flex items-center gap-2 border-amber-200 text-amber-600 bg-white" style={{ textDecoration: 'none' }}>
                        <ShieldAlert size={16} /> ClearanceHQ
                    </Link>
                </div>
                <div className="data-table-wrapper border-none">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>IPD Identifier</th>
                                <th>Demographics</th>
                                <th>Wing & Unit</th>
                                <th>Clinical Lead</th>
                                <th>Vital Status</th>
                                <th>Financials</th>
                                <th style={{ textAlign: 'right' }}>Logistics</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="7"><Skeleton height="20px" /></td></tr>) : filteredPatients.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs italic">Registry Empty</td></tr>
                            ) : (
                                filteredPatients.map(pt => (
                                    <tr key={pt.id} className="hover:bg-slate-50 transition-all cursor-pointer">
                                        <td><div className="text-[13px] font-black text-navy-900 font-mono">{pt.apptCode}</div></td>
                                        <td>
                                            <div className="text-[14px] font-black text-navy-900">{pt.patientName}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">UHID: {pt.patientUhId || 'WALK-IN'}</div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2 text-[12px] font-black text-navy-900">
                                                <MapPin size={10} className="text-slate-400" /> {pt.ward}
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Unit: {pt.bed || 'PENDING'}</div>
                                        </td>
                                        <td><div className="text-[12px] font-bold text-slate-600 uppercase">Dr. {pt.doctorName}</div></td>
                                        <td>
                                            <span className={`status-badge ${pt.status === 'Critical' ? 'status-critical' : pt.status.includes('Discharge') ? 'status-ready' : 'status-admitted'}`}>
                                                {pt.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={`text-[10px] font-black uppercase py-1 px-2 rounded-lg inline-block ${pt.paymentStatus === 'Advance Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {pt.paymentStatus || 'Pending'}
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => setSelectedPatientForTransfer(pt)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:text-cyan-600 transition-all shadow-sm"><ArrowRightLeft size={16} /></button>
                                                <Link href={`/billing/ipd-ledger?ipdId=${pt.id}`} className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:text-emerald-600 transition-all shadow-sm"><IndianRupee size={16} /></Link>
                                                <button onClick={() => handleInitiateDischarge(pt.id, pt.patientName)} className="h-9 px-4 rounded-lg bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all shadow-sm">Discharge</button>
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
