'use client';
import { Calendar as CalIcon, Filter, Plus, Search, CalendarDays, List, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    const [showFilters, setShowFilters] = useState(false);

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
    const cancelledCount = appointments.filter(a => a.status === 'Cancelled').length;

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
        <div className="fade-in">
            <div className="dashboard-header-row mb-8">
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                        Appointments & Scheduling Desk
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>Clinical queue management, slot optimization, and patient flow governance.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')} className="btn btn-secondary btn-sm h-11 px-5 border-slate-200 bg-white shadow-sm">
                        {viewMode === 'list' ? <><CalendarDays size={14} /> Full Calendar</> : <><List size={14} /> List View</>}
                    </button>
                    <Link href="/appointments/new" className="btn btn-primary btn-sm h-11 px-6 flex items-center gap-2" style={{ textDecoration: 'none' }}>
                        <Plus size={15} strokeWidth={1.5} />
                        New Booking
                    </Link>
                </div>
            </div>

            <div className="kpi-grid" style={{ marginBottom: '28px' }}>
                {[
                    { label: 'Today\'s Flux', value: todayAppointments, sub: 'Visits Scheduled', icon: CalendarDays, color: '#0EA5E9' },
                    { label: 'Clinical Output', value: completedConsults, sub: 'Consults Finished', icon: Activity, color: '#10B981' },
                    { label: 'System Leakage', value: cancelledCount, sub: 'Cancellations', icon: Filter, color: '#EF4444' },
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

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search appointments by Patient name, Doctor, or Token..." style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                        </div>
                        <button onClick={() => setShowFilters(!showFilters)} className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`} style={{ background: showFilters ? 'var(--color-navy)' : '#fff' }}>
                            <Filter size={16} /> Advanced Filters
                        </button>
                    </div>
                </div>

                {/* Filter Expandable Area */}
                {showFilters && (
                    <div style={{ display: 'flex', gap: '16px', padding: '16px', background: '#F8FAFC', borderRadius: '8px', marginBottom: '24px', border: '1px solid var(--color-border-light)' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px', fontWeight: 500 }}>Filter by Status</label>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border-light)', borderRadius: '6px', fontSize: '13px' }}>
                                <option value="All">All Statuses</option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Waiting">Waiting</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px', fontWeight: 500 }}>Filter by Department</label>
                            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border-light)', borderRadius: '6px', fontSize: '13px' }}>
                                <option value="All">All Departments</option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Orthopedics">Orthopedics</option>
                                <option value="Neurology">Neurology</option>
                                <option value="General Med">General Med</option>
                                <option value="Pediatrics">Pediatrics</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button onClick={() => { setFilterStatus('All'); setFilterDept('All'); setSearch(''); }} className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>Reset All</button>
                        </div>
                    </div>
                )}

                {/* Main Views Toggle */}
                {viewMode === 'list' ? (
                    <div className="data-table-wrapper border-none">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Time slot & Token</th>
                                    <th>Patient Archetype</th>
                                    <th>Clinical Consultant</th>
                                    <th>Logistics</th>
                                    <th>Operational State</th>
                                    <th style={{ textAlign: 'right' }}>Management</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="6"><Skeleton height="20px" /></td></tr>) : filteredAppointments.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs italic">No matching records</td></tr>
                                ) : (
                                    filteredAppointments.map((row) => (
                                        <tr key={row.id} className="hover:bg-slate-50 transition-all cursor-pointer" onClick={() => window.location.href = `/appointments/${row.apptCode}`}>
                                            <td>
                                                <div className="text-[14px] font-black text-navy-900">{row.date} {row.time ? `• ${row.time.split(' ')[0]}` : ''}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1 font-mono">{row.apptCode}</div>
                                            </td>
                                            <td>
                                                <div className="text-[14px] font-black text-navy-900">{row.patientName}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">{row.patient?.patientCode || 'UHID-PENDING'}</div>
                                            </td>
                                            <td>
                                                <div className="text-[12px] font-bold text-slate-600 uppercase">Dr. {row.doctorName}</div>
                                                <div className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">{row.department}</div>
                                            </td>
                                            <td>
                                                <div className={`text-[10px] font-black uppercase py-1 px-2 rounded-lg inline-block ${row.type === 'IPD' ? 'bg-amber-50 text-amber-600' : 'bg-sky-50 text-sky-600'}`}>{row.type || 'OPD'}</div>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${row.status === 'Completed' ? 'status-ready' : row.status === 'Cancelled' ? 'status-out' : 'status-pending'}`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div className="flex gap-2 justify-end">
                                                    <Link href={`/appointments/${row.apptCode}`} className="h-9 px-4 rounded-lg bg-navy-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center">Manage</Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ border: '1px solid var(--color-border-light)', borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: 'var(--color-navy)' }}>
                                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h2>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={prevMonth} className="btn btn-secondary btn-sm" style={{ padding: '6px', background: '#fff' }}><ChevronLeft size={16} /></button>
                                <button onClick={() => setCurrentMonth(new Date())} className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>Today</button>
                                <button onClick={nextMonth} className="btn btn-secondary btn-sm" style={{ padding: '6px', background: '#fff' }}><ChevronRight size={16} /></button>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#F1F5F9', borderBottom: '1px solid var(--color-border-light)' }}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                                <div key={d} style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>{d}</div>
                            ))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: 'minmax(100px, auto)' }}>
                            {generateCalendarDays().map((day, i) => (
                                <div key={i} style={{ padding: '8px', borderRight: '1px solid var(--color-border-light)', borderBottom: '1px solid var(--color-border-light)', background: day.empty ? '#FAFCFF' : '#fff', position: 'relative' }}>
                                    {!day.empty && (
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '13px', fontWeight: day.fullDate === todayStr ? 700 : 500, color: day.fullDate === todayStr ? 'var(--color-cyan)' : 'var(--color-navy)', background: day.fullDate === todayStr ? 'rgba(0,194,255,0.1)' : 'transparent', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                                                    {day.date}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                {day.appointments && day.appointments.map(apt => (
                                                    <Link key={apt.id} href={`/appointments/${apt.apptCode}`} style={{ display: 'block', padding: '4px 6px', background: apt.status === 'Completed' ? '#F0FDF4' : apt.status === 'Cancelled' ? '#FEF2F2' : 'rgba(0,194,255,0.05)', borderLeft: `3px solid ${apt.status === 'Completed' ? '#22C55E' : apt.status === 'Cancelled' ? '#EF4444' : 'var(--color-cyan)'}`, borderRadius: '4px', fontSize: '11px', textDecoration: 'none', color: 'var(--color-navy)' }}>
                                                        <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{apt.time?.split(' ')[0]}</div>
                                                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.8 }}>{apt.patientName}</div>
                                                    </Link>
                                                ))}
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
