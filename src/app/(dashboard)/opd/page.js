'use client';
import { Stethoscope, Plus, Search, Filter, Users, Activity, Clock, Eye, Send, ArrowRightCircle, AlertTriangle, CheckCircle, Play } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OPDPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await fetch('/api/appointments');
                if (res.ok) {
                    const data = await res.json();
                    setAppointments(data.appointments || []);
                }
            } catch (err) {
                console.error("Failed to load operations:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const todayStr = new Date().toISOString().split('T')[0];

    // We filter for active tickets scheduled for today, excluding cancelled.
    const opdAppointments = appointments.filter(a => a.date === todayStr && a.status !== 'Cancelled');

    const filteredQueue = opdAppointments.filter(apt => {
        const matchesSearch = (apt.patientName && apt.patientName.toLowerCase().includes(search.toLowerCase())) ||
            (apt.doctorName && apt.doctorName.toLowerCase().includes(search.toLowerCase())) ||
            (apt.apptCode && apt.apptCode.toLowerCase().includes(search.toLowerCase()));
        return matchesSearch;
    });

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
                // Update local state smoothly
                setAppointments(appointments.map(a =>
                    (a.id === id || a.apptCode === id) ? { ...a, status: newStatus } : a
                ));
            } else {
                alert("Failed to update status.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getAge = (dob) => {
        if (!dob) return '?';
        const diff = Date.now() - new Date(dob).getTime();
        const MathAge = new Date(diff).getUTCFullYear() - 1970;
        return MathAge > 0 ? MathAge : '?';
    };

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Outpatient Department (OPD)</h1>
                    <p className="page-header__subtitle">
                        Manage daily consults, patient tokens, and doctor queues.
                    </p>
                </div>
                <div className="dashboard-header-buttons">
                    <button onClick={() => window.open('/opd-display', '_blank')} className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        Token Display View
                    </button>
                    <Link href="/appointments/new" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <Plus size={15} strokeWidth={1.5} aria-hidden="true" />
                        Initiate Consult
                    </Link>
                </div>
            </div>

            {/* Quick KPI Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(56,189,248,0.1)', color: '#0EA5E9', padding: '10px', borderRadius: '10px' }}>
                            <Users size={20} />
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Active Queue Size</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{activeWaiting}</h4>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Patients Waiting Today</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', padding: '10px', borderRadius: '10px' }}>
                            <Activity size={20} />
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>In-Progress Consults</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#10B981', margin: 0 }}>{inProgress}</h4>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Docs Active</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', padding: '10px', borderRadius: '10px' }}>
                            <CheckCircle size={20} />
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Completed Operations</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#F59E0B', margin: 0 }}>{completedToday}</h4>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Discharged Today</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Master Queue by Token No, Patient, or Doctor..." style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                        </div>
                        <button className="btn btn-secondary" style={{ background: '#fff' }}>
                            <Filter size={16} /> Filter Rooms
                        </button>
                    </div>
                </div>

                <div className="data-table-wrapper" style={{ borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
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
                                <tr>
                                    <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        Loading queue data...
                                    </td>
                                </tr>
                            ) : filteredQueue.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        No active patients in the queue for today.
                                    </td>
                                </tr>
                            ) : (
                                filteredQueue.map((row) => (
                                    <tr key={row.id} onClick={(e) => {
                                        // Prevents row click if an action button was clicked
                                        if (e.target.closest('button')) return;
                                        router.push(`/appointments/${row.apptCode}`);
                                    }} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
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
                                            {row.status === 'Completed' ? (
                                                <span style={{ fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    Discharged
                                                </span>
                                            ) : (
                                                <span style={{ fontSize: '12px', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <AlertTriangle size={12} /> Triage Pending
                                                </span>
                                            )}
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
                                            <span className={`badge ${row.status === 'In Progress' ? 'badge-blue' : row.status === 'Completed' ? 'badge-green' : row.status === 'Waiting' ? 'badge-yellow' : 'badge-navy'}`} style={{ padding: '4px 10px', fontSize: '12px' }}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                {(row.status === 'Waiting' || row.status === 'Scheduled') && (
                                                    <button onClick={(e) => { e.stopPropagation(); updateStatus(row.id, 'In Progress'); }} className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', fontSize: '12px', background: '#F8FAFC', color: 'var(--color-navy)' }}>
                                                        <ArrowRightCircle size={14} /> Call Next
                                                    </button>
                                                )}
                                                {row.status === 'In Progress' && (
                                                    <button onClick={(e) => { e.stopPropagation(); updateStatus(row.id, 'Completed'); }} className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', fontSize: '12px' }}>
                                                        <Play size={14} /> End
                                                    </button>
                                                )}
                                                {row.status !== 'Completed' && row.status !== 'Cancelled' && (
                                                    <Link
                                                        href={`/opd/consult?appointmentId=${row.id}&patient=${encodeURIComponent(row.patientName)}&doctor=${encodeURIComponent(row.doctorName)}`}
                                                        onClick={e => e.stopPropagation()}
                                                        className="btn btn-primary btn-sm"
                                                        style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none', background: '#8B5CF6', borderColor: '#8B5CF6' }}>
                                                        <Stethoscope size={13} /> Consult
                                                    </Link>
                                                )}
                                                {(row.status === 'Completed' || row.status === 'Cancelled') && (
                                                    <button onClick={(e) => { e.stopPropagation(); router.push(`/appointments/${row.apptCode}`); }} className="btn btn-secondary btn-sm" style={{ padding: '6px 10px', background: '#F8FAFC' }}>
                                                        <Eye size={14} /> View
                                                    </button>
                                                )}
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
