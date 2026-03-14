'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Plus, Search, Mail, Phone, CalendarDays, RefreshCw, X, UserCog, Shield, ArrowRight, ShieldCheck, Database, LayoutDashboard, MoreVertical, Ban, CheckCircle, Smartphone } from 'lucide-react';
import Skeleton from '@/components/common/Skeleton';

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
        doctors: staff.filter(s => s.role?.toLowerCase() === 'doctor' || s.role?.toLowerCase() === 'consultant').length,
        nurses: staff.filter(s => s.role?.toLowerCase() === 'nurse').length,
        active: staff.filter(s => s.status === 'Active').length,
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
                .avatar-box {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    background: #F1F5F9;
                    color: #475569;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 14px;
                    border: 1px solid #E2E8F0;
                }
            `}</style>

            <div className="dashboard-header-row mb-8">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Human Capital Management</h1>
                    <p className="page-header__subtitle">Manage medical staff registry, departmental roles, and institutional governance.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <Link href="/hr/shifts" className="btn btn-secondary btn-sm" style={{ background: '#fff', textDecoration: 'none' }}>
                        <CalendarDays size={14} /> Master Roster
                    </Link>
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={fetchStaff}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync Records
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                        <Plus size={15} strokeWidth={1.5} /> Onboard Personnel
                    </button>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="kpi-card" style={{ borderLeft: '4px solid #0EA5E9' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Workforce Volume</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-navy-900 leading-none">{kpi.total}</h2>}
                        <span className="text-xs font-semibold text-slate-400">Employees</span>
                    </div>
                </div>
                <div className="kpi-card" style={{ borderLeft: '4px solid #8B5CF6' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-purple-600/70">Clinical Consultants</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-purple-600 leading-none">{kpi.doctors}</h2>}
                        <span className="text-xs font-semibold text-slate-400">MD/Specialists</span>
                    </div>
                </div>
                <div className="kpi-card" style={{ borderLeft: '4px solid #10B981' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-emerald-600/70">Nursing Excellence</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-emerald-600 leading-none">{kpi.nurses}</h2>}
                        <span className="text-xs font-semibold text-slate-400">Active Staff</span>
                    </div>
                </div>
                <div className="kpi-card" style={{ borderLeft: '4px solid #16A34A' }}>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-green-600/70">Attendance Flux</p>
                    <div className="flex items-baseline gap-2">
                        {loading ? <Skeleton width="60px" height="32px" /> : <h2 className="text-3xl font-black text-green-600 leading-none">{kpi.active}</h2>}
                        <span className="text-xs font-semibold text-slate-400">Shift Active</span>
                    </div>
                </div>
            </div>

            <div className="card">
                <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                        <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                        <input
                            type="text"
                            placeholder="Find personnel by name, email, department or system ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '10px 16px 10px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {roles.map(r => (
                            <button key={r} onClick={() => setFilterRole(r)} className={`btn btn-sm ${filterRole === r ? 'btn-primary' : 'btn-secondary'}`} style={{
                                background: filterRole === r ? 'var(--color-navy)' : '#fff',
                                borderColor: filterRole === r ? 'var(--color-navy)' : 'var(--color-border-light)',
                                color: filterRole === r ? '#fff' : 'var(--color-text-secondary)',
                                borderRadius: '10px'
                            }}>
                                {r === 'All' ? 'All Roles' : ROLE_LABELS[r]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="data-table-wrapper border-none">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Institutional Identity</th>
                                <th>Clinical Cluster</th>
                                <th>Communication Streams</th>
                                <th>Lifecycle Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i}>
                                        <td><Skeleton width="180px" height="14px" /></td>
                                        <td><Skeleton width="140px" height="14px" /></td>
                                        <td><Skeleton width="160px" height="14px" /></td>
                                        <td><Skeleton width="80px" height="20px" /></td>
                                        <td style={{ textAlign: 'right' }}><Skeleton width="40px" height="32px" className="ml-auto" /></td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '64px', color: '#94A3B8', fontWeight: 600 }}>No personnel records matched your query.</td>
                                </tr>
                            ) : (
                                filtered.map(member => (
                                    <tr key={member.id}>
                                        <td>
                                            <div className="flex items-center gap-4">
                                                <div className="avatar-box">
                                                    {member.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 800, color: 'var(--color-navy)' }}>{member.name}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, fontFamily: 'monospace' }}>{member.userId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${ROLE_COLORS[member.role] || 'badge-navy'}`} style={{ marginBottom: '4px' }}>
                                                {ROLE_LABELS[member.role] || member.role}
                                            </span>
                                            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{member.department || 'General Facility'}</div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium"><Mail size={12} className="text-slate-400" /> {member.email}</div>
                                                {member.phone && <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium"><Smartphone size={12} className="text-slate-400" /> {member.phone}</div>}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${member.status === 'Active' ? 'badge-green' : member.status === 'Suspended' ? 'badge-error' : 'badge-yellow'}`} style={{ marginBottom: '4px' }}>
                                                {member.status}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                <CalendarDays size={12} /> Since {member.joinDate || 'TBD'}
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button className="btn btn-secondary btn-sm h-9 px-4 border-slate-200 text-slate-500 hover:text-red-500" onClick={() => handleStatusToggle(member)}>
                                                {member.status === 'Active' ? <Ban size={14} /> : <CheckCircle size={14} />}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card animate-in zoom-in-95 duration-200" style={{ width: '100%', maxWidth: '640px', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>Onboard New Personnel</h2>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors border-none"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAdd} style={{ display: 'grid', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Full Legal Name</label>
                                    <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-cyan-500 transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Professional Email</label>
                                    <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-cyan-500 transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Designation Role</label>
                                    <select required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold">
                                        {Object.entries(ROLE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Institutional Cluster</label>
                                    <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold">
                                        <option value="">Global Unit</option>
                                        {DEPT_OPTIONS.map(d => <option key={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Mobile Identifier</label>
                                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Induction Date</label>
                                    <input type="date" value={form.joinDate} onChange={e => setForm({ ...form, joinDate: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Temporary Token (Password)</label>
                                    <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Default: Welcome@123" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="h-12 px-8 rounded-xl text-xs font-black text-slate-400 hover:bg-slate-50 transition-all border-none">Cancel</button>
                                <button type="submit" disabled={saving} className="h-12 px-8 bg-navy-900 rounded-xl text-xs font-black text-white hover:bg-slate-800 shadow-xl shadow-navy-900/10 transition-all disabled:opacity-50">
                                    {saving ? 'Processing...' : 'Onboard Personnel'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
