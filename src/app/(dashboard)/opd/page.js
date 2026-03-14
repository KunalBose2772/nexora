'use client';
import { Stethoscope, Plus, Search, Filter, Users, Activity, Clock, Eye, Send, ArrowRightCircle, AlertTriangle, CheckCircle, Play, Video, RefreshCw, UserCheck, CalendarDays, ExternalLink, Siren, Ghost, Monitor, LayoutDashboard, Database, X, MoreVertical, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Skeleton from '@/components/common/Skeleton';

export default function OPDPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/appointments');
            if (res.ok) {
                const data = await res.json();
                setAppointments(data.appointments || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAppointments(); }, []);

    const todayStr = new Date().toISOString().split('T')[0];
    const opdAppointments = appointments.filter(a => a.date === todayStr && a.status !== 'Cancelled');
    const filteredQueue = opdAppointments.filter(apt =>
        (apt.patientName && apt.patientName.toLowerCase().includes(search.toLowerCase())) ||
        (apt.doctorName && apt.doctorName.toLowerCase().includes(search.toLowerCase())) ||
        (apt.apptCode && apt.apptCode.toLowerCase().includes(search.toLowerCase()))
    );

    const activeWaiting = opdAppointments.filter(a => a.status === 'Waiting' || a.status === 'Scheduled').length;
    const inProgress = opdAppointments.filter(a => a.status === 'In Progress').length;
    const completedToday = opdAppointments.filter(a => a.status === 'Completed').length;

    const updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/appointments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setAppointments(appointments.map(a =>
                    (a.id === id || a.apptCode === id) ? { ...a, status: newStatus } : a
                ));
            }
        } catch (err) { }
    };

    const getAge = (dob) => {
        if (!dob) return '?';
        const diff = Date.now() - new Date(dob).getTime();
        const age = new Date(diff).getUTCFullYear() - 1970;
        return age > 0 ? age : '?';
    };

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
                .queue-row {
                    transition: all 0.2s;
                    cursor: pointer;
                }
                .queue-row:hover {
                    background: #F8FAFC;
                }
                .status-badge {
                    padding: 4px 10px;
                    border-radius: 8px;
                    font-size: 10px;
                    font-weight: 901;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .status-waiting { background: #FFF7ED; color: #F97316; border: 1px solid #FFEDD5; }
                .status-active { background: #F5F3FF; color: #8B5CF6; border: 1px solid #EDE9FE; }
                .status-done { background: #F0FDF4; color: #10B981; border: 1px solid #DCFCE7; }
            `}</style>

            <div className="dashboard-header-row mb-8">
                <div>
                    <h1 className="responsive-h1">
                        Outpatient Flow Desk
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>Real-time consultation orchestration and medical workflow governance.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button onClick={fetchAppointments} className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync Queue
                    </button>
                    <button onClick={() => window.open('/opd-display', '_blank')} className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        Token TV View
                    </button>
                    <Link href="/appointments/new" className="btn btn-primary btn-sm flex items-center gap-2" style={{ textDecoration: 'none' }}>
                        <Plus size={15} strokeWidth={1.5} /> New Consult
                    </Link>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="kpi-grid" style={{ marginBottom: '28px' }}>
                {[
                    { label: 'Arrived Queue', value: activeWaiting, sub: 'Waiting', icon: Users, color: '#0EA5E9' },
                    { label: 'Consultations', value: inProgress, sub: 'Active Now', icon: Stethoscope, color: '#8B5CF6' },
                    { label: 'Throughput', value: completedToday, sub: 'Completed', icon: Activity, color: '#10B981' },
                    { label: 'Urgent Triage', value: opdAppointments.filter(a => a.type === 'Emergency').length, sub: 'Critical Cases', icon: AlertTriangle, color: '#EF4444' },
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

            <div className="card">
                <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Find patient in queue by Token ID, Name, or Mobile..." className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:border-cyan-500 outline-none transition-all shadow-sm" />
                    </div>
                    <button className="btn btn-secondary btn-sm h-11 px-5 border-slate-200 bg-white">
                        <Filter size={16} /> Filter Rooms
                    </button>
                </div>
                <div className="data-table-wrapper border-none">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Token Identifier</th>
                                <th>Patient Archetype</th>
                                <th>Consultant</th>
                                <th>Timing</th>
                                <th>Clinical State</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="6"><Skeleton height="20px" /></td></tr>) : filteredQueue.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest">Queue Clear</td></tr>
                            ) : (
                                filteredQueue.map(row => (
                                    <tr key={row.id} className="hover:bg-slate-50 transition-all cursor-pointer" onClick={() => router.push(`/appointments/${row.apptCode}`)}>
                                        <td>
                                            <div className="text-[14px] font-black text-navy-900 font-mono tracking-tighter">{row.apptCode}</div>
                                            {row.type === 'Teleconsult' && <div className="text-[9px] font-black text-cyan-600 uppercase tracking-widest mt-1">Virtual Hub</div>}
                                            {row.type === 'Emergency' && <div className="text-[9px] font-black text-red-600 uppercase tracking-widest mt-1 animate-pulse">Critical Priority</div>}
                                        </td>
                                        <td>
                                            <div className="text-[14px] font-black text-navy-900">{row.patientName}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">{row.patient ? `${getAge(row.patient.dob)} Y, ${row.patient.gender}` : 'Guest Record'}</div>
                                        </td>
                                        <td>
                                            <div className="text-[12px] font-black text-slate-600">Dr. {row.doctorName}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{row.department || 'General Practice'}</div>
                                        </td>
                                        <td><div className="text-[12px] font-bold text-navy-900 font-mono">{row.time || 'WALK-IN'}</div></td>
                                        <td>
                                            <span className={`status-badge ${row.status === 'In Progress' ? 'status-active' : row.status === 'Completed' ? 'status-done' : 'status-waiting'}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div className="flex gap-2 justify-end" onClick={e => e.stopPropagation()}>
                                                {(row.status === 'Waiting' || row.status === 'Scheduled') && (
                                                    <button onClick={() => updateStatus(row.id, 'In Progress')} className="h-9 px-4 rounded-lg bg-navy-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm">Call Next</button>
                                                )}
                                                {row.status === 'In Progress' && (
                                                    <Link href={`/opd/consult?appointmentId=${row.id}`} className="h-9 px-4 rounded-lg bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-sm flex items-center justify-center" style={{ textDecoration: 'none' }}>Consult</Link>
                                                )}
                                                {row.type === 'Teleconsult' && row.status !== 'Completed' && (
                                                    <Link href="/telemedicine" className="w-9 h-9 flex items-center justify-center rounded-lg bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-600 transition-all"><Video size={16} /></Link>
                                                )}
                                                <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 text-slate-300 hover:text-navy-900 transition-all"><MoreVertical size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
