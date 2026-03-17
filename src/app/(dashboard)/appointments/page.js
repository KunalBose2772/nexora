'use client';
import { Calendar as CalIcon, Filter, Plus, Search, CalendarDays, List, ChevronLeft, ChevronRight, Activity, Clock, User, UserCheck, Loader2, MoreVertical, FileText, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Shared Skeleton for loading states
const Skeleton = ({ className }) => <div className={`animate-pulse bg-slate-100 rounded-md ${className}`} />;

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    const [showFilters, setShowFilters] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);

    // Filters logic
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterDept, setFilterDept] = useState('All');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await fetch('/api/appointments');
                if (res.ok) {
                    const data = await res.json();
                    setAppointments(data.appointments || []);
                }
            } catch (err) {
                console.error("Failed to load appointments:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const filteredAppointments = appointments.filter(apt => {
        const matchesSearch = (apt.patientName && apt.patientName.toLowerCase().includes(search.toLowerCase())) ||
            (apt.doctorName && apt.doctorName.toLowerCase().includes(search.toLowerCase())) ||
            (apt.apptCode && apt.apptCode.toLowerCase().includes(search.toLowerCase()));

        const matchesStatus = filterStatus === 'All' || apt.status === filterStatus;
        const matchesDept = filterDept === 'All' || (apt.department && apt.department.includes(filterDept));

        return matchesSearch && matchesStatus && matchesDept;
    });

    // KPI Counters
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(a => a.date === todayStr).length;
    const completedConsults = appointments.filter(a => a.status === 'Completed').length;
    const waitingCount = appointments.filter(a => a.status === 'Waiting').length;

    // Calendar generation logic
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push({ empty: true });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const dayAppts = filteredAppointments.filter(a => a.date === dateStr);
            days.push({ date: i, fullDate: dateStr, appointments: dayAppts });
        }
        return days;
    };

    return (
        <div className="fade-in pb-20">
            <style jsx>{`
                .view-toggle-btn {
                    height: 44px;
                    padding: 0 20px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                }
                .calendar-cell {
                    min-height: 120px;
                    padding: 12px;
                    border-right: 1px solid #F1F5F9;
                    border-bottom: 1px solid #F1F5F9;
                    background: #fff;
                    transition: all 0.2s;
                }
                .calendar-cell:hover {
                    background: #F8FAFC;
                }
                .appt-pill {
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 500;
                    margin-bottom: 4px;
                    border-left: 3px solid transparent;
                }
            `}</style>

            <div className="dashboard-header-row mb-10">
                <div>
                    <h1 className="responsive-h1" style={{ margin: 0 }}>Clinical Scheduler</h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0', fontWeight: 500 }}>Global queue governance, slot optimization, and patient flow.</p>
                </div>
                <div className="dashboard-header-buttons" style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ background: '#F1F5F9', padding: '4px', borderRadius: '12px', display: 'flex', gap: '4px' }}>
                        <button 
                            onClick={() => setViewMode('list')} 
                            className={`view-toggle-btn ${viewMode === 'list' ? 'bg-white shadow-sm text-navy-900' : 'text-slate-500'}`}
                        >
                            <List size={16} /> List
                        </button>
                        <button 
                            onClick={() => setViewMode('calendar')} 
                            className={`view-toggle-btn ${viewMode === 'calendar' ? 'bg-white shadow-sm text-navy-900' : 'text-slate-500'}`}
                        >
                            <CalendarDays size={16} /> Calendar
                        </button>
                    </div>
                    <Link href="/appointments/new" className="btn btn-primary" style={{ textDecoration: 'none', height: '44px', borderRadius: '12px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-navy)' }}>
                        <Plus size={18} /> New Booking
                    </Link>
                </div>
            </div>

            <div className="kpi-grid mb-10">
                {[
                    { label: 'Today\'s Flux', value: todayAppointments, sub: 'Visits Scheduled', icon: CalendarDays, color: '#0EA5E9' },
                    { label: 'Current Queue', value: waitingCount, sub: 'Physically Present', icon: Clock, color: '#F59E0B' },
                    { label: 'Clinical Output', value: completedConsults, sub: 'Consults Finished', icon: UserCheck, color: '#10B981' },
                ].map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="kpi-card" style={{ border: '1px solid #F1F5F9' }}>
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
                    <button onClick={() => setShowFilters(!showFilters)} className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`} style={{ height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', background: showFilters ? 'var(--color-navy)' : '#fff' }}>
                        <Filter size={18} /> Options
                    </button>
                </div>

                {showFilters && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', padding: '24px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Operational State</label>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>
                                <option value="All">All Transactions</option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Waiting">Waiting</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Clinical Dept</label>
                            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>
                                <option value="All">All Specializations</option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Orthopedics">Orthopedics</option>
                                <option value="Neurology">Neurology</option>
                                <option value="General Med">General Med</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button onClick={() => { setFilterStatus('All'); setFilterDept('All'); setSearch(''); }} style={{ width: '100%', height: '40px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#EF4444', textTransform: 'uppercase' }}>Flush Filters</button>
                        </div>
                    </div>
                )}

                {viewMode === 'list' ? (
                    <div className="responsive-table-container">
                        <table className="data-table">
                            <thead>
                                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
                                    <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Time slot & Token</th>
                                    <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Patient Info</th>
                                    <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Consulting Doctor</th>
                                    <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Type</th>
                                    <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i}>
                                            <td colSpan="6" style={{ padding: '16px 24px' }}><Skeleton className="h-4 w-full" /></td>
                                        </tr>
                                    ))
                                ) : filteredAppointments.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '80px 24px', textAlign: 'center' }}>
                                            <div style={{ color: '#94A3B8', fontSize: '14px', fontWeight: 600 }}>No slot transactions found for this query.</div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAppointments.map((row) => (
                                         <tr key={row.id} 
                                            className="registry-row"
                                            onClick={() => window.location.href = `/appointments/${row.apptCode}`}
                                         >
                                             <td style={{ padding: '16px' }}>
                                                 <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                     <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '14px' }}>{row.date} {row.time ? `• ${row.time.split(' ')[0]}` : ''}</span>
                                                     <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{row.apptCode}</span>
                                                 </div>
                                             </td>
                                             <td style={{ padding: '16px' }}>
                                                 <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                     <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '15px' }}>{row.patientName}</span>
                                                     <span style={{ fontSize: '12px', color: '#94A3B8' }}>{row.patient?.patientCode || '-'}</span>
                                                 </div>
                                             </td>
                                             <td style={{ padding: '16px' }}>
                                                 <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                     <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>Dr. {row.doctorName}</span>
                                                     <span style={{ fontSize: '11px', color: '#94A3B8' }}>{row.department}</span>
                                                 </div>
                                             </td>
                                             <td style={{ padding: '16px' }}>
                                                 <span className="badge badge-navy" style={{ fontSize: '11px', padding: '2px 8px' }}>{row.type || 'OPD'}</span>
                                             </td>
                                             <td style={{ padding: '16px' }}>
                                                 <span className={`badge ${row.status === 'Completed' ? 'badge-success' : row.status === 'Cancelled' ? 'badge-error' : 'badge-info'}`} style={{ padding: '4px 10px', fontSize: '12px' }}>
                                                     {row.status}
                                                 </span>
                                             </td>
                                             <td style={{ padding: '16px', textAlign: 'right' }}>
                                                 <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center', position: 'relative' }} onClick={e => e.stopPropagation()}>
                                                     <Link href={`/appointments/${row.apptCode}`} className="btn btn-secondary btn-sm" style={{ padding: '0 12px', height: '32px', background: '#F8FAFC', textDecoration: 'none', borderRadius: '6px', fontSize: '12px', color: 'var(--color-navy)', border: '1px solid #E2E8F0', display: 'inline-flex', alignItems: 'center' }}>
                                                         Manage
                                                     </Link>
                                                     <div style={{ position: 'relative' }}>
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenMenuId(openMenuId === row.id ? null : row.id);
                                                            }}
                                                            className="btn btn-secondary btn-sm" 
                                                            style={{ width: '32px', height: '32px', padding: 0, background: openMenuId === row.id ? '#F1F5F9' : '#fff', borderRadius: '6px', border: '1px solid #E2E8F0' }}
                                                        >
                                                            <MoreVertical size={14} color="#64748B" />
                                                        </button>
                                                        
                                                        {openMenuId === row.id && (
                                                            <div className="actions-dropdown shadow-lg" style={{ right: 0, top: '40px', textAlign: 'left' }} onClick={e => e.stopPropagation()}>
                                                                <Link href={`/appointments/${row.apptCode}`} className="dropdown-item">
                                                                    <FileText size={14} /> Full Details
                                                                </Link>
                                                                <button type="button" className="dropdown-item">
                                                                    <CheckCircle size={14} /> Mark Arrived
                                                                </button>
                                                                <button type="button" className="dropdown-item" style={{ color: '#EF4444' }}>
                                                                    <X size={14} /> No Show
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
                ) : (
                    <div style={{ background: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                            <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <CalIcon size={18} color="var(--color-cyan)" />
                                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h2>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={prevMonth} className="btn-circle-secondary" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#fff', border: '1px solid #E2E8F0' }}><ChevronLeft size={16} /></button>
                                <button onClick={() => setCurrentMonth(new Date())} style={{ height: '36px', padding: '0 16px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '12px', fontWeight: 700 }}>Today</button>
                                <button onClick={nextMonth} className="btn-circle-secondary" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#fff', border: '1px solid #E2E8F0' }}><ChevronRight size={16} /></button>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                                <div key={d} style={{ padding: '12px', textAlign: 'center', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{d}</div>
                            ))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                            {generateCalendarDays().map((day, i) => (
                                <div key={i} className="calendar-cell" style={{ opacity: day.empty ? 0.3 : 1 }}>
                                    {!day.empty && (
                                        <>
                                            <div style={{ marginBottom: '12px' }}>
                                                <span style={{ 
                                                    fontSize: '14px', 
                                                    fontWeight: 800, 
                                                    color: day.fullDate === todayStr ? '#fff' : 'var(--color-navy)', 
                                                    background: day.fullDate === todayStr ? 'var(--color-cyan)' : 'transparent', 
                                                    width: '28px', 
                                                    height: '28px', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center', 
                                                    borderRadius: '8px',
                                                    boxShadow: day.fullDate === todayStr ? '0 4px 12px rgba(0,194,255,0.3)' : 'none'
                                                }}>
                                                    {day.date}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                {day.appointments && day.appointments.slice(0, 3).map(apt => (
                                                    <div key={apt.id} className="appt-pill" style={{ 
                                                        background: apt.status === 'Completed' ? '#F0FDF4' : apt.status === 'Cancelled' ? '#FEF2F2' : '#F0F9FF', 
                                                        borderColor: apt.status === 'Completed' ? '#22C55E' : apt.status === 'Cancelled' ? '#EF4444' : '#0EA5E9',
                                                        color: apt.status === 'Completed' ? '#166534' : apt.status === 'Cancelled' ? '#991B1B' : '#0369A1'
                                                    }}>
                                                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{apt.patientName}</div>
                                                    </div>
                                                ))}
                                                {day.appointments?.length > 3 && (
                                                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textAlign: 'center', marginTop: '4px' }}>+ {day.appointments.length - 3} more</div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
