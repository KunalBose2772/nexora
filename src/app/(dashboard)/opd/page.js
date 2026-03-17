'use client';
import { Stethoscope, Plus, Search, Filter, Users, Activity, Clock, Eye, Send, ArrowRightCircle, AlertTriangle, CheckCircle, Play, Video, RefreshCw, UserCheck, CalendarDays, ExternalLink, Siren, Ghost, Monitor, LayoutDashboard, Database, X, MoreVertical, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Local Skeleton to match appointments page
const Skeleton = ({ className }) => <div className={`animate-pulse bg-slate-100 rounded-md ${className}`} />;

export default function OPDPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [openMenuId, setOpenMenuId] = useState(null);

    const searchParams = useSearchParams();

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/appointments');
            if (res.ok) {
                const data = await res.json();
                const allAppts = data.appointments || [];
                setAppointments(allAppts);

                // Auto-search if patientId is provided
                const pid = searchParams.get('patientId');
                const pname = searchParams.get('patientName') || searchParams.get('patient');
                
                if (pid) {
                    const found = allAppts.find(p => p.patientId === pid || p.id === pid);
                    if (found) {
                        setSearch(found.patientName || '');
                    } else if (pname) {
                        setSearch(pname);
                    }
                } else if (pname) {
                    setSearch(pname);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAppointments(); }, [searchParams]);

    useEffect(() => {
        const handleOutsideClick = () => setOpenMenuId(null);
        if (openMenuId) window.addEventListener('click', handleOutsideClick);
        return () => window.removeEventListener('click', handleOutsideClick);
    }, [openMenuId]);

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
        <div className="fade-in pb-20">

            <div className="dashboard-header-row mb-10">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '52px', height: '52px', background: 'var(--color-navy)', color: '#fff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                        <Monitor size={24} />
                    </div>
                    <div>
                        <h1 className="responsive-h1" style={{ margin: 0 }}>Clinical Flow Control</h1>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0', fontWeight: 500 }}>Global OPD orchestration, room throughput, and encounter management.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons" style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={fetchAppointments} className="btn btn-secondary" style={{ background: '#fff', color: 'var(--color-navy)', borderRadius: '12px', height: '44px', padding: '0 20px' }}>
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} style={{ marginRight: '8px' }} /> Sync Registry
                    </button>
                    <button onClick={() => window.open('/opd-display', '_blank')} className="btn btn-secondary" style={{ background: '#fff', color: 'var(--color-navy)', borderRadius: '12px', height: '44px', padding: '0 20px' }}>
                        <Monitor size={16} style={{ marginRight: '8px' }} /> Digital Queue View
                    </button>
                    <Link href="/appointments/new" className="btn btn-primary" style={{ background: 'var(--color-navy)', borderRadius: '12px', height: '44px', padding: '0 24px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> New Intake
                    </Link>
                </div>
            </div>

            <div className="kpi-grid mb-10">
                {[
                    { label: 'Waitlist Load', value: activeWaiting, sub: 'Patients Arrived', icon: Users, color: '#0EA5E9' },
                    { label: 'Active Sessions', value: inProgress, sub: 'In Consultation', icon: Stethoscope, color: '#8B5CF6' },
                    { label: 'Clinical Output', value: completedToday, sub: 'Cases Resolved', icon: UserCheck, color: '#10B981' },
                    { label: 'Emergency Tier', value: opdAppointments.filter(a => a.type === 'Emergency').length, sub: 'Critical Priority', icon: Siren, color: '#EF4444' },
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

            <div className="card shadow-premium" style={{ padding: '0', overflow: 'hidden', border: '1px solid #F1F5F9' }}>
                <div style={{ padding: '24px', background: '#fff', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                        <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                            type="text" 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            placeholder="Universal search by Token, Patient, or Clinician..." 
                            style={{ width: '100%', padding: '12px 16px 12px 48px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', outline: 'none', fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }} 
                        />
                    </div>
                </div>

                <div className="responsive-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Token & Patient Info</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Vitals & Triage</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Assigned Physician</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Time Slot</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>State</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i}>
                                        <td colSpan="6" style={{ padding: '16px 24px' }}><Skeleton className="h-4 w-full" /></td>
                                    </tr>
                                ))
                            ) : filteredQueue.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '80px 24px', textAlign: 'center' }}>
                                        <div style={{ color: '#94A3B8', fontSize: '14px', fontWeight: 600 }}>The consultation queue is currently clear.</div>
                                    </td>
                                </tr>
                            ) : (
                                filteredQueue.map((row) => (
                                    <tr key={row.id} 
                                        className="registry-row"
                                        onClick={() => router.push(`/appointments/${row.apptCode}`)}
                                    >
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '15px' }}>{row.apptCode}</span>
                                                <span style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>
                                                    {row.patientName}
                                                    <span style={{ color: 'var(--color-text-muted)', marginLeft: '4px' }}>
                                                        ({row.patient ? `${getAge(row.patient.dob)}, ${row.patient.gender?.charAt(0) || 'U'}` : 'Guest'})
                                                    </span>
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ fontSize: '12px', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <AlertTriangle size={12} /> Triage Pending
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ color: 'var(--color-text-primary)' }}>{row.doctorName}</span>
                                                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{row.department || 'Consulting Room'}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '13px' }}>{row.time || 'Walk-in'}</span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span className={`badge ${row.status === 'In Progress' ? 'badge-info' : row.status === 'Completed' ? 'badge-success' : row.status === 'Waiting' ? 'badge-warning' : 'badge-navy'}`} style={{ padding: '4px 10px', fontSize: '12px' }}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                {(row.status === 'Waiting' || row.status === 'Scheduled') && (
                                                    <button onClick={(e) => { e.stopPropagation(); updateStatus(row.id, 'In Progress'); }} className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', fontSize: '12px', background: '#F8FAFC', color: 'var(--color-navy)' }}>
                                                        Call Next
                                                    </button>
                                                )}
                                                {row.status === 'In Progress' && (
                                                    <button onClick={(e) => { e.stopPropagation(); updateStatus(row.id, 'Completed'); }} className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', fontSize: '12px' }}>
                                                        End
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/opd/consult?appointmentId=${row.id}`}
                                                    onClick={e => e.stopPropagation()}
                                                    className="btn btn-primary btn-sm"
                                                    style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none', background: '#8B5CF6', borderColor: '#8B5CF6' }}>
                                                    Consult
                                                </Link>
                                                <div style={{ position: 'relative' }}>
                                                    <button 
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenMenuId(openMenuId === row.id ? null : row.id);
                                                        }}
                                                        className="btn btn-secondary btn-sm" 
                                                        style={{ width: '32px', height: '32px', padding: 0, background: openMenuId === row.id ? '#F1F5F9' : '#fff', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>
                                                    
                                                    {openMenuId === row.id && (
                                                        <div className="actions-dropdown shadow-lg" onClick={e => e.stopPropagation()} style={{ textAlign: 'left' }}>
                                                            <Link href={`/patients/${row.patient?.id || row.patientId}`} className="dropdown-item">
                                                                <User size={14} /> Patient Profile
                                                            </Link>
                                                            <Link href={`/appointments/${row.apptCode}`} className="dropdown-item">
                                                                <FileText size={14} /> Full Details
                                                            </Link>
                                                            <button type="button" className="dropdown-item" onClick={() => updateStatus(row.id, 'Cancelled')}>
                                                                <X size={14} /> Cancel Visit
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
        </div>
    );
}
