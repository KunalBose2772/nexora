'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Building2, MapPin, Phone, Mail, Activity, RefreshCw, X, Pencil, Trash2, CheckCircle } from 'lucide-react';

const FACILITY_TYPES = ['Full Scale Multispeciality', 'Outpatient Day-care', 'Pathology Lab', 'Pharmacy Outlet', 'Radiology Centre', 'ER / Satellite', 'Maternity Centre', 'Dental Clinic', 'Eye Care Centre', 'Physiotherapy Centre', 'Dialysis Centre', 'Administration Office'];
const STATUS_OPTS = ['Operational', 'Under Construction', 'Maintenance', 'Temporarily Closed'];

const STATUS_COLORS = { 'Operational': 'badge-green', 'Under Construction': 'badge-yellow', 'Maintenance': 'badge-yellow', 'Temporarily Closed': 'badge-error' };

const defaultForm = { name: '', facilityType: 'Full Scale Multispeciality', city: '', state: '', address: '', phone: '', email: '', beds: '', notes: '' };

export default function BranchesPage() {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editBranch, setEditBranch] = useState(null);
    const [form, setForm] = useState(defaultForm);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);

    const fetchBranches = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/branches');
            if (res.ok) setBranches((await res.json()).branches || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchBranches(); }, []);

    const openAdd = () => { setEditBranch(null); setForm(defaultForm); setShowModal(true); };
    const openEdit = (b) => { setEditBranch(b); setForm({ name: b.name, facilityType: b.facilityType, city: b.city || '', state: b.state || '', address: b.address || '', phone: b.phone || '', email: b.email || '', beds: b.beds || '', notes: b.notes || '' }); setShowModal(true); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editBranch) {
                const res = await fetch('/api/branches', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editBranch.id, ...form }) });
                if (res.ok) { const data = await res.json(); setBranches(prev => prev.map(b => b.id === editBranch.id ? data.branch : b)); setShowModal(false); }
                else { const e = await res.json(); alert(e.error || 'Failed'); }
            } else {
                const res = await fetch('/api/branches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
                if (res.ok) { const data = await res.json(); setBranches(prev => [...prev, data.branch]); setShowModal(false); }
                else { const e = await res.json(); alert(e.error || 'Failed'); }
            }
        } catch (e) { alert('Network error'); }
        finally { setSaving(false); }
    };

    const handleStatusToggle = async (branch) => {
        const next = branch.status === 'Operational' ? 'Temporarily Closed' : 'Operational';
        const res = await fetch('/api/branches', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: branch.id, status: next }) });
        if (res.ok) setBranches(prev => prev.map(b => b.id === branch.id ? { ...b, status: next } : b));
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this branch? This cannot be undone.')) return;
        setDeleting(id);
        try {
            const res = await fetch(`/api/branches?id=${id}`, { method: 'DELETE' });
            if (res.ok) setBranches(prev => prev.filter(b => b.id !== id));
        } catch (e) { console.error(e); }
        finally { setDeleting(null); }
    };

    const filtered = branches.filter(b => {
        const q = searchQuery.toLowerCase();
        return !q || b.name.toLowerCase().includes(q) || (b.city || '').toLowerCase().includes(q) || (b.branchCode || '').toLowerCase().includes(q) || b.facilityType.toLowerCase().includes(q);
    });

    const kpi = {
        total: branches.length,
        operational: branches.filter(b => b.status === 'Operational').length,
        cities: [...new Set(branches.map(b => b.city).filter(Boolean))].length,
        types: [...new Set(branches.map(b => b.facilityType))].length,
    };

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Hospital Network & Branches</h1>
                    <p className="page-header__subtitle">Oversee multi-location facilities, centers, and administrative branches.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={fetchBranches}><RefreshCw size={14} /></button>
                    <button className="btn btn-primary btn-sm" onClick={openAdd}><Plus size={15} strokeWidth={1.5} /> Add Branch</button>
                </div>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                {[
                    { label: 'Total Branches', value: loading ? '—' : kpi.total, color: '#0EA5E9' },
                    { label: 'Operational', value: loading ? '—' : kpi.operational, color: '#16A34A' },
                    { label: 'Cities Covered', value: loading ? '—' : kpi.cities, color: '#8B5CF6' },
                    { label: 'Facility Types', value: loading ? '—' : kpi.types, color: '#F59E0B' },
                ].map(k => (
                    <div key={k.label} className="stat-card" style={{ padding: '20px' }}>
                        <div style={{ background: `${k.color}18`, color: k.color, padding: '10px', borderRadius: '10px', width: 'fit-content', marginBottom: '12px' }}><Building2 size={20} /></div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>{k.label}</p>
                        <h4 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{k.value}</h4>
                    </div>
                ))}
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                        <input type="text" placeholder="Search by name, branch code, city or facility type..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '11px 16px 11px 40px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading branches…</div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <Building2 size={40} strokeWidth={1} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                        <p style={{ marginBottom: '16px' }}>{branches.length === 0 ? 'No branches yet. Add your first facility.' : 'No branches match your search.'}</p>
                        {branches.length === 0 && <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add First Branch</button>}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                        {filtered.map(branch => (
                            <div key={branch.id} style={{ border: '1px solid var(--color-border-light)', borderRadius: '14px', padding: '20px', background: '#fff', transition: 'all 0.2s', cursor: 'default' }}
                                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--color-cyan)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,194,255,0.08)'; }}
                                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--color-border-light)'; e.currentTarget.style.boxShadow = 'none'; }}>

                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(0,194,255,0.1)', color: 'var(--color-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Building2 size={20} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)', margin: '0 0 2px 0', lineHeight: 1.2 }}>{branch.name}</h3>
                                            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, fontFamily: 'monospace' }}>{branch.branchCode}</p>
                                        </div>
                                    </div>
                                    <span className={`badge ${STATUS_COLORS[branch.status] || 'badge-yellow'}`} style={{ fontSize: '11px', padding: '3px 8px', flexShrink: 0 }}>{branch.status}</span>
                                </div>

                                {/* Type badge */}
                                <div style={{ marginBottom: '14px' }}>
                                    <span className="badge badge-navy" style={{ fontSize: '11px', padding: '3px 8px' }}>{branch.facilityType}</span>
                                    {branch.beds && <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginLeft: '8px' }}>🛏 {branch.beds} beds</span>}
                                </div>

                                {/* Details */}
                                <div style={{ borderTop: '1px dashed var(--color-border-light)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {(branch.city || branch.state) && (
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                                            <MapPin size={13} />
                                            <span>{[branch.city, branch.state].filter(Boolean).join(', ')}</span>
                                        </div>
                                    )}
                                    {branch.address && <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', paddingLeft: '21px' }}>{branch.address}</div>}
                                    {branch.phone && (
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                                            <Phone size={13} /><span>{branch.phone}</span>
                                        </div>
                                    )}
                                    {branch.email && (
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                                            <Mail size={13} /><span>{branch.email}</span>
                                        </div>
                                    )}
                                    {branch.notes && <div style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic', marginTop: '4px' }}>{branch.notes}</div>}
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--color-border-light)' }}>
                                    <button className="btn btn-secondary btn-sm" style={{ flex: 1, background: '#F8FAFC', fontSize: '12px' }} onClick={() => openEdit(branch)}>
                                        <Pencil size={12} /> Edit
                                    </button>
                                    <button className="btn btn-secondary btn-sm" style={{ background: '#F8FAFC', fontSize: '12px', padding: '6px 12px' }} onClick={() => handleStatusToggle(branch)}>
                                        <Activity size={12} /> {branch.status === 'Operational' ? 'Close' : 'Reopen'}
                                    </button>
                                    <button className="btn btn-secondary btn-sm" style={{ background: '#FEF2F2', color: '#DC2626', fontSize: '12px', padding: '6px 10px', border: '1px solid #FECACA' }}
                                        onClick={() => handleDelete(branch.id)} disabled={deleting === branch.id}>
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add / Edit Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '620px', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{editBranch ? 'Edit Branch' : 'Add New Branch'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Branch / Facility Name <span style={{ color: 'red' }}>*</span></label>
                                    <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Nexora Health South Campus"
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Facility Type</label>
                                    <select value={form.facilityType} onChange={e => setForm({ ...form, facilityType: e.target.value })}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', fontSize: '14px', background: '#fff' }}>
                                        {FACILITY_TYPES.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Bed Capacity</label>
                                    <input type="text" value={form.beds} onChange={e => setForm({ ...form, beds: e.target.value })} placeholder="e.g. 250 or N/A"
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>City</label>
                                    <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="e.g. Bangalore"
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>State</label>
                                    <input type="text" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="e.g. Karnataka"
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Full Address</label>
                                    <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Street, Area, Pin Code"
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Phone</label>
                                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 80 4000 8000"
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Email</label>
                                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="branch@hospital.com"
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Notes</label>
                                    <input type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any additional notes about this facility"
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : editBranch ? 'Save Changes' : 'Add Branch'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
