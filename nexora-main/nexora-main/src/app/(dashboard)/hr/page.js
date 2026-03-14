'use client';
import { useState, useEffect } from 'react';
import { Users, Plus, Search, Mail, Phone, CalendarDays, RefreshCw, X, UserCog, Shield } from 'lucide-react';

const ROLE_COLORS = {
    doctor: 'badge-navy',
    nurse: 'badge-green',
    hospital_admin: 'badge-yellow',
    receptionist: 'badge-navy',
    pharmacist: 'badge-green',
    lab_technician: 'badge-navy',
};

const ROLE_LABELS = {
    doctor: 'Doctor',
    nurse: 'Nurse',
    hospital_admin: 'Admin',
    receptionist: 'Receptionist',
    pharmacist: 'Pharmacist',
    lab_technician: 'Lab Technician',
};

const DEPT_OPTIONS = ['General Medicine', 'Surgery', 'Pediatrics', 'Cardiology', 'Orthopedics', 'Gynecology', 'Neurology', 'Oncology', 'Radiology', 'Pathology', 'Pharmacy', 'ICU', 'Emergency', 'Front Desk', 'Billing', 'Administration'];

const defaultForm = { name: '', email: '', role: 'doctor', department: '', phone: '', joinDate: '', specialization: '', password: '' };

export default function HRStaffPage() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(defaultForm);
    const [saving, setSaving] = useState(false);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/hr/staff');
            if (res.ok) setStaff((await res.json()).staff || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchStaff(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/hr/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                const data = await res.json();
                setStaff(prev => [...prev, data.staff].sort((a, b) => a.name.localeCompare(b.name)));
                setForm(defaultForm);
                setShowModal(false);
            } else {
                const err = await res.json();
                alert('Error: ' + (err.error || 'Failed to add staff'));
            }
        } catch (e) { alert('Network error'); }
        finally { setSaving(false); }
    };

    const handleStatusToggle = async (member) => {
        const newStatus = member.status === 'Active' ? 'Suspended' : 'Active';
        const res = await fetch('/api/hr/staff', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: member.id, status: newStatus })
        });
        if (res.ok) setStaff(prev => prev.map(s => s.id === member.id ? { ...s, status: newStatus } : s));
    };

    const roles = ['All', 'doctor', 'nurse', 'hospital_admin', 'receptionist', 'pharmacist', 'lab_technician'];

    const filtered = staff.filter(s => {
        const q = searchQuery.toLowerCase();
        const matchSearch = !q || s.name.toLowerCase().includes(q) || (s.email || '').toLowerCase().includes(q) || (s.department || '').toLowerCase().includes(q) || (s.userId || '').toLowerCase().includes(q);
        const matchRole = filterRole === 'All' || s.role === filterRole;
        return matchSearch && matchRole;
    });

    const kpi = {
        total: staff.length,
        doctors: staff.filter(s => s.role === 'doctor').length,
        nurses: staff.filter(s => s.role === 'nurse').length,
        active: staff.filter(s => s.status === 'Active').length,
    };

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Human Resources & Staff</h1>
                    <p className="page-header__subtitle">Manage employee records, roles, and HR administration.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={fetchStaff}><RefreshCw size={14} /></button>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                        <Plus size={15} strokeWidth={1.5} /> Onboard New Staff
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                {[
                    { label: 'Total Staff', value: loading ? '—' : kpi.total, color: '#0EA5E9', icon: <Users size={20} /> },
                    { label: 'Doctors', value: loading ? '—' : kpi.doctors, color: '#8B5CF6', icon: <UserCog size={20} /> },
                    { label: 'Nurses', value: loading ? '—' : kpi.nurses, color: '#10B981', icon: <Shield size={20} /> },
                    { label: 'Active Today', value: loading ? '—' : kpi.active, color: '#16A34A', icon: <Users size={20} /> },
                ].map(k => (
                    <div key={k.label} className="stat-card" style={{ padding: '20px' }}>
                        <div style={{ background: `${k.color}18`, color: k.color, padding: '10px', borderRadius: '10px', width: 'fit-content', marginBottom: '12px' }}>{k.icon}</div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>{k.label}</p>
                        <h4 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{k.value}</h4>
                    </div>
                ))}
            </div>

            <div className="card" style={{ padding: '24px' }}>
                {/* Filters */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
                        <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                        <input type="text" placeholder="Search by name, ID, email, department..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '11px 16px 11px 40px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {roles.map(r => (
                            <button key={r} onClick={() => setFilterRole(r)} style={{
                                padding: '8px 12px', borderRadius: '8px', border: '1px solid', fontSize: '12px', cursor: 'pointer', fontWeight: 500,
                                borderColor: filterRole === r ? 'var(--color-navy)' : 'var(--color-border-light)',
                                background: filterRole === r ? 'var(--color-navy)' : '#fff',
                                color: filterRole === r ? '#fff' : 'var(--color-text-secondary)',
                            }}>{r === 'All' ? 'All' : ROLE_LABELS[r]}</button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading staff...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <Users size={36} strokeWidth={1} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                        <p>{staff.length === 0 ? 'No staff onboarded yet. Click "Onboard New Staff" to begin.' : 'No staff match your filters.'}</p>
                    </div>
                ) : (
                    <div className="data-table-wrapper" style={{ borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
                        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
                                <tr>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Employee</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Role & Department</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Contact</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Status & Joined</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(member => (
                                    <tr key={member.id} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.15s' }}
                                        onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'}
                                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                                                    {member.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{member.name}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{member.userId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span className={`badge ${ROLE_COLORS[member.role] || 'badge-navy'}`} style={{ fontSize: '11px', padding: '3px 8px', marginBottom: '4px', display: 'inline-block' }}>
                                                {ROLE_LABELS[member.role] || member.role}
                                            </span>
                                            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{member.department || '—'}</div>
                                            {member.specialization && <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{member.specialization}</div>}
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '13px', color: 'var(--color-text-secondary)' }}><Mail size={12} /> {member.email}</div>
                                                {member.phone && <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '13px', color: 'var(--color-text-secondary)' }}><Phone size={12} /> {member.phone}</div>}
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span className={`badge ${member.status === 'Active' ? 'badge-green' : member.status === 'Suspended' ? 'badge-error' : 'badge-yellow'}`}
                                                style={{ fontSize: '12px', padding: '4px 10px', marginBottom: '6px', display: 'inline-block' }}>{member.status}</span>
                                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', fontSize: '12px', color: 'var(--color-text-muted)' }}><CalendarDays size={12} /> {member.joinDate || '—'}</div>
                                        </td>
                                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                            <button className="btn btn-secondary btn-sm" style={{ fontSize: '12px', padding: '6px 10px', background: '#F8FAFC' }} onClick={() => handleStatusToggle(member)}>
                                                {member.status === 'Active' ? 'Suspend' : 'Reactivate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Staff Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Onboard New Staff Member</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAdd} style={{ display: 'grid', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Full Name <span style={{ color: 'red' }}>*</span></label>
                                    <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Dr. Rajesh Mehta" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Email <span style={{ color: 'red' }}>*</span></label>
                                    <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="staff@hospital.com" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Role <span style={{ color: 'red' }}>*</span></label>
                                    <select required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', background: '#fff' }}>
                                        {Object.entries(ROLE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Department</label>
                                    <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', background: '#fff' }}>
                                        <option value="">Select department</option>
                                        {DEPT_OPTIONS.map(d => <option key={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Phone</label>
                                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 9999 888 777" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Join Date</label>
                                    <input type="date" value={form.joinDate} onChange={e => setForm({ ...form, joinDate: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Specialization (for Doctors)</label>
                                    <input type="text" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} placeholder="e.g. MBBS, MD Cardiology" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Temporary Password (default: Welcome@123)</label>
                                    <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Leave blank for Welcome@123" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Onboard Staff'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
