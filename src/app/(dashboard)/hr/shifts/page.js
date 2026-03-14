'use client';
import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Search, User, MoreVertical, X, Check, AlertCircle } from 'lucide-react';

export default function ShiftManagementPage() {
    const [activeTab, setActiveTab] = useState('Roster');
    const [doctors, setDoctors] = useState([]);
    const [shifts, setShifts] = useState([
        { id: '1', name: 'Morning Shift', start: '08:00', end: '14:00', color: '#10B981' },
        { id: '2', name: 'Afternoon Shift', start: '14:00', end: '20:00', color: '#3B82F6' },
        { id: '3', name: 'Night Shift', start: '20:00', end: '08:00', color: '#6366F1' },
        { id: '4', name: 'Emergency / On-Call', start: '00:00', end: '23:59', color: '#EF4444' }
    ]);
    const [roster, setRoster] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assignment, setAssignment] = useState({ doctorId: '', shiftId: '', date: new Date().toISOString().split('T')[0] });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/hr/staff');
                if (res.ok) {
                    const data = await res.json();
                    setDoctors(data.staff.filter(s => s.role === 'doctor'));
                }
                
                // Mock roster data
                setRoster([
                    { id: 'r1', doctorName: 'Dr. Rajesh Mehta', shiftName: 'Morning Shift', date: new Date().toISOString().split('T')[0], status: 'Confirmed' },
                    { id: 'r2', doctorName: 'Dr. Sarah Wilson', shiftName: 'Night Shift', date: new Date().toISOString().split('T')[0], status: 'On-Call' }
                ]);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAssign = (e) => {
        e.preventDefault();
        const dr = doctors.find(d => d.id === assignment.doctorId);
        const sh = shifts.find(s => s.id === assignment.shiftId);
        if (!dr || !sh) return;

        const newEntry = {
            id: `r${roster.length + 1}`,
            doctorName: dr.name,
            shiftName: sh.name,
            date: assignment.date,
            status: 'Confirmed'
        };
        setRoster([newEntry, ...roster]);
        setShowAssignModal(false);
    };

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Shift & Roster Management</h1>
                    <p className="page-header__subtitle">Schedule doctor shifts, manage on-call blocks, and track availability.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-primary btn-sm" onClick={() => setShowAssignModal(true)}>
                        <Plus size={15} strokeWidth={1.5} /> Assign Shift
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                {['Roster', 'Shift Definitions', 'Block Leaves'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        padding: '10px 20px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                        background: activeTab === tab ? 'var(--color-navy)' : 'transparent',
                        color: activeTab === tab ? '#fff' : 'var(--color-text-secondary)',
                        transition: 'all 0.2s'
                    }}>{tab}</button>
                ))}
            </div>

            {activeTab === 'Roster' && (
                <div className="grid" style={{ gridTemplateColumns: '1fr 300px', gap: '24px' }}>
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Daily Roster: {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>Today</button>
                                <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>This Week</button>
                            </div>
                        </div>

                        <div className="data-table-wrapper" style={{ borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Doctor Name</th>
                                        <th>Shift Type</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roster.map(r => (
                                        <tr key={r.id}>
                                            <td style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{r.doctorName}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: shifts.find(s => s.name === r.shiftName)?.color || '#94A3B8' }}></div>
                                                    {r.shiftName}
                                                </div>
                                            </td>
                                            <td style={{ color: 'var(--color-text-secondary)' }}>{r.date}</td>
                                            <td>
                                                <span className={`badge ${r.status === 'Confirmed' ? 'badge-green' : 'badge-navy'}`} style={{ fontSize: '11px' }}>{r.status}</span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><MoreVertical size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="card" style={{ padding: '20px' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={16} color="#F59E0B" /> Real-time Availability
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {doctors.slice(0, 4).map((dr, i) => (
                                    <div key={dr.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', background: '#F8FAFC' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>{dr.name[0]}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy)' }}>{dr.name}</div>
                                            <div style={{ fontSize: '11px', color: '#10B981' }}>Available Now</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card" style={{ padding: '20px', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: '#fff' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>On-Call Emergency Contact</h4>
                            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ fontWeight: 600, fontSize: '15px' }}>Dr. Rajesh Mehta</div>
                                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Chief Orthopedic Surgeon</div>
                                <div style={{ fontSize: '16px', fontWeight: 700, color: '#34D399', marginTop: '12px' }}>+91 99887 76655</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'Shift Definitions' && (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {shifts.map(s => (
                        <div key={s.id} className="card" style={{ padding: '24px', borderLeft: `6px solid ${s.color}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{s.name}</h3>
                                <div style={{ background: `${s.color}15`, color: s.color, padding: '4px', borderRadius: '6px' }}><Clock size={16} /></div>
                            </div>
                            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '8px' }}>{s.start} - {s.end}</div>
                            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Full hospital operating hours</div>
                        </div>
                    ))}
                    <div style={{ borderRadius: '16px', border: '2px dashed #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.borderColor='var(--color-primary)'} onMouseOut={e=>e.currentTarget.style.borderColor='#E2E8F0'}>
                        <div style={{ textAlign: 'center', color: '#94A3B8' }}>
                            <Plus size={24} style={{ marginBottom: '8px' }} />
                            <div style={{ fontWeight: 600, fontSize: '14px' }}>Add New Shift Type</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Modal */}
            {showAssignModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Assign Doctor Shift</h2>
                            <button onClick={() => setShowAssignModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAssign} style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 600, color: '#475569' }}>Select Doctor</label>
                                <select required style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#fff' }} value={assignment.doctorId} onChange={e => setAssignment({...assignment, doctorId: e.target.value})}>
                                    <option value="">Choose a doctor...</option>
                                    {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 600, color: '#475569' }}>Select Shift</label>
                                <select required style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#fff' }} value={assignment.shiftId} onChange={e => setAssignment({...assignment, shiftId: e.target.value})}>
                                    <option value="">Choose a shift...</option>
                                    {shifts.map(s => <option key={s.id} value={s.id}>{s.name} ({s.start}-{s.end})</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 600, color: '#475569' }}>Date</label>
                                <input type="date" required style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px' }} value={assignment.date} onChange={e => setAssignment({...assignment, date: e.target.value})} />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>Confirm Assignment</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
