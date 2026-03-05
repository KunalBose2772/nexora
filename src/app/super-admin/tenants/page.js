'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, MoreVertical, ShieldCheck, Clock, ExternalLink, X, Copy, CheckCheck, KeyRound, UserPlus, RefreshCw, AlertCircle } from 'lucide-react';

const BASE_URL = 'http://localhost:3000';
const tenantUrl = (slug) => `${BASE_URL}/${slug}`;

const PLAN_OPTIONS = [
    { value: 'Starter Tier', label: 'Starter Tier (₹4,999/mo)' },
    { value: 'Professional Monthly', label: 'Professional Monthly (₹9,999/mo)' },
    { value: 'Enterprise Annual', label: 'Enterprise Annual (₹99,999/yr)' },
    { value: 'Enterprise Custom', label: 'Enterprise Custom' },
    { value: 'Basic Quarterly', label: 'Basic Quarterly (₹12,999/3mo)' },
];

const STATUS_COLORS = {
    'Active': { badge: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    'Suspended': { badge: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
    'Payment Due': { badge: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
};

export default function TenantsPage() {
    const router = useRouter();
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
    const [editTenant, setEditTenant] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [credModal, setCredModal] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [openActionId, setOpenActionId] = useState(null);
    const [copiedField, setCopiedField] = useState(null);

    // ── Fetch tenants from DB ───────────────────────────────────────────────
    const fetchTenants = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/tenants');
            if (res.status === 401 || res.status === 403) {
                router.replace('/login');
                return;
            }
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setTenants(data.tenants);
        } catch (e) {
            setError('Failed to load tenants. ' + e.message);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => { fetchTenants(); }, [fetchTenants]);

    // ── Filter ───────────────────────────────────────────────────────────────
    const filtered = tenants.filter(t => {
        const q = searchQuery.toLowerCase();
        const match = t.name.toLowerCase().includes(q) || t.slug.includes(q) || t.tenantCode.toLowerCase().includes(q);
        const status = statusFilter === 'All' || t.status === statusFilter;
        return match && status;
    });

    // ── Modal helpers ─────────────────────────────────────────────────────────
    const openCreate = () => { setModalMode('create'); setEditTenant(null); setFormError(''); setIsModalOpen(true); };
    const openEdit = (t) => { setModalMode('edit'); setEditTenant(t); setFormError(''); setOpenActionId(null); setIsModalOpen(true); };

    // ── Create tenant ─────────────────────────────────────────────────────────
    const handleCreate = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');
        const fd = new FormData(e.target);
        const body = {
            name: fd.get('name').trim(),
            slug: fd.get('slug').trim().toLowerCase(),
            plan: fd.get('plan'),
            adminEmail: fd.get('adminEmail').trim(),
        };
        try {
            const res = await fetch('/api/tenants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) { setFormError(data.error || 'Failed to create.'); return; }
            setIsModalOpen(false);
            setCredModal({ email: data.credentials.email, password: data.credentials.tempPassword, tenantName: data.tenant.name });
            fetchTenants();
        } catch {
            setFormError('Network error. Please try again.');
        } finally {
            setFormLoading(false);
        }
    };

    // ── Edit tenant ───────────────────────────────────────────────────────────
    const handleEdit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');
        const fd = new FormData(e.target);
        const body = {
            name: fd.get('name').trim(),
            slug: fd.get('slug').trim().toLowerCase(),
            plan: fd.get('plan'),
        };
        try {
            const res = await fetch(`/api/tenants/${editTenant.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) { setFormError(data.error || 'Update failed.'); return; }
            setIsModalOpen(false);
            fetchTenants();
        } catch {
            setFormError('Network error.');
        } finally {
            setFormLoading(false);
        }
    };

    // ── Suspend / Reactivate ──────────────────────────────────────────────────
    const toggleStatus = async (tenant) => {
        setOpenActionId(null);
        const newStatus = tenant.status === 'Suspended' ? 'Active' : 'Suspended';
        const msg = newStatus === 'Suspended'
            ? `Suspend ${tenant.name}? Their admin will lose access immediately.`
            : `Reactivate ${tenant.name}? They will regain full access.`;
        if (!window.confirm(msg)) return;

        const res = await fetch(`/api/tenants/${tenant.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) fetchTenants();
        else alert('Failed to update status.');
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDelete = async (tenant) => {
        setOpenActionId(null);
        if (!window.confirm(`Permanently delete "${tenant.name}"? This will delete all their data including patients and appointments. This CANNOT be undone.`)) return;
        const res = await fetch(`/api/tenants/${tenant.id}`, { method: 'DELETE' });
        if (res.ok) fetchTenants();
        else alert('Delete failed.');
    };

    // ── Copy helper ────────────────────────────────────────────────────────────
    const copy = (text, field) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        });
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="fade-in">

            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', letterSpacing: '-0.02em' }}>Tenant Management</h1>
                    <p style={{ color: '#64748B', margin: 0, fontSize: '14px' }}>
                        {tenants.length} hospital{tenants.length !== 1 ? 's' : ''} · All data stored in real database
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={fetchTenants} title="Refresh" style={{ padding: '9px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <RefreshCw size={16} color="#64748B" />
                    </button>
                    <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#10B981', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.25)' }}>
                        <Plus size={16} /> Provision New Hospital
                    </button>
                </div>
            </div>

            {/* Error banner */}
            {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
                    <AlertCircle size={16} color="#EF4444" />
                    <span style={{ fontSize: '14px', color: '#B91C1C' }}>{error}</span>
                </div>
            )}

            {/* Table card */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

                {/* Search + Filter bar */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name, slug, or ID…"
                            style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', background: '#F8FAFC', outline: 'none', boxSizing: 'border-box' }}
                            onFocus={e => e.currentTarget.style.borderColor = '#10B981'} onBlur={e => e.currentTarget.style.borderColor = '#E2E8F0'} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <button onClick={() => setIsFilterOpen(!isFilterOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: '#475569', cursor: 'pointer' }}>
                            <Filter size={15} /> {statusFilter !== 'All' ? statusFilter : 'All Statuses'}
                        </button>
                        {isFilterOpen && (
                            <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 50, overflow: 'hidden', minWidth: '160px' }}>
                                {['All', 'Active', 'Payment Due', 'Suspended'].map(s => (
                                    <button key={s} onClick={() => { setStatusFilter(s); setIsFilterOpen(false); }}
                                        style={{ display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left', border: 'none', background: statusFilter === s ? '#F0FDF4' : 'transparent', color: statusFilter === s ? '#10B981' : '#334155', fontSize: '13px', fontWeight: statusFilter === s ? 600 : 400, cursor: 'pointer' }}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '700px' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                            <tr>
                                {['Hospital', 'Homepage URL', 'Plan', 'Patients', 'Status', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '11px 20px', fontWeight: 600, color: '#475569', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: h === 'Actions' ? 'right' : 'left' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>Loading…</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>No hospitals found.</td></tr>
                            ) : filtered.map(t => {
                                const sc = STATUS_COLORS[t.status] || STATUS_COLORS['Active'];
                                return (
                                    <tr key={t.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 150ms' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ fontWeight: 600, color: '#0F172A' }}>{t.name}</div>
                                            <div style={{ fontSize: '12px', color: '#94A3B8', fontFamily: 'monospace', marginTop: '2px' }}>{t.tenantCode}</div>
                                        </td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <a href={tenantUrl(t.slug)} target="_blank" rel="noopener noreferrer"
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#3B82F6', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
                                                /{t.slug} <ExternalLink size={11} />
                                            </a>
                                        </td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ color: '#334155', fontSize: '13px' }}>{t.plan}</div>
                                            <div style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}><Clock size={10} /> {t._count?.users || 0} users</div>
                                        </td>
                                        <td style={{ padding: '14px 20px', color: '#475569', fontWeight: 600 }}>
                                            {t._count?.patients || 0}
                                        </td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <span style={{ padding: '4px 10px', fontSize: '12px', fontWeight: 600, color: sc.badge, background: sc.bg, borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                                                {t.status === 'Active' && <ShieldCheck size={11} />}{t.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 20px', textAlign: 'right', position: 'relative' }}>
                                            <button onClick={() => openEdit(t)} style={{ padding: '6px 14px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#0F172A', cursor: 'pointer', marginRight: '6px' }}>Manage</button>
                                            <button onClick={() => setOpenActionId(openActionId === t.id ? null : t.id)}
                                                style={{ padding: '6px 8px', background: 'none', border: '1px solid transparent', borderRadius: '6px', color: '#94A3B8', cursor: 'pointer' }}>
                                                <MoreVertical size={16} />
                                            </button>

                                            {openActionId === t.id && (
                                                <div style={{ position: 'absolute', top: '100%', right: '20px', marginTop: '4px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.10)', minWidth: '185px', zIndex: 20, overflow: 'hidden', textAlign: 'left' }}>
                                                    <button onClick={() => openEdit(t)} style={ddBtn()} onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>Edit Details</button>
                                                    {t.status === 'Suspended' ? (
                                                        <button onClick={() => toggleStatus(t)} style={{ ...ddBtn(), color: '#10B981', fontWeight: 600 }} onMouseOver={e => e.currentTarget.style.background = 'rgba(16,185,129,0.06)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>✓ Reactivate Tenant</button>
                                                    ) : (
                                                        <button onClick={() => toggleStatus(t)} style={ddBtn()} onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>Suspend Tenant</button>
                                                    )}
                                                    <div style={{ height: '1px', background: '#E2E8F0', margin: '4px 0' }} />
                                                    <button onClick={() => handleDelete(t)} style={{ ...ddBtn(), color: '#EF4444' }} onMouseOver={e => e.currentTarget.style.background = '#FEF2F2'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>Delete Permanently</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Provision / Edit Modal ─────────────────────────────── */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
                    <div style={{ position: 'relative', background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '480px', boxShadow: '0 24px 48px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }}>
                            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                                {modalMode === 'create' ? '🏥 Provision New Hospital' : `✏️ Edit — ${editTenant?.name}`}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}><X size={20} /></button>
                        </div>

                        <div style={{ padding: '24px', overflowY: 'auto' }}>
                            {formError && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 12px', marginBottom: '16px' }}>
                                    <AlertCircle size={14} color="#EF4444" />
                                    <span style={{ fontSize: '13px', color: '#B91C1C' }}>{formError}</span>
                                </div>
                            )}
                            <form id="tenant-form" onSubmit={modalMode === 'create' ? handleCreate : handleEdit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                <div>
                                    <label style={lbl()}>Hospital / Clinic Name</label>
                                    <input name="name" required defaultValue={editTenant?.name} placeholder="e.g. Apex General Hospital"
                                        style={inp()} onFocus={e => e.currentTarget.style.borderColor = '#10B981'} onBlur={e => e.currentTarget.style.borderColor = '#E2E8F0'} />
                                </div>
                                <div>
                                    <label style={lbl()}>Tenant Slug (URL identifier)</label>
                                    <div style={{ display: 'flex', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
                                        <span style={{ padding: '10px 12px', background: '#F8FAFC', color: '#94A3B8', fontSize: '12px', borderRight: '1px solid #E2E8F0', whiteSpace: 'nowrap' }}>localhost:3000/</span>
                                        <input name="slug" required defaultValue={editTenant?.slug} placeholder="apexgeneral"
                                            style={{ flex: 1, padding: '10px 12px', border: 'none', fontSize: '14px', outline: 'none', minWidth: 0, background: 'transparent' }} />
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '5px' }}>Lowercase letters and numbers only. Cannot be changed easily later.</p>
                                </div>
                                {modalMode === 'create' && (
                                    <div>
                                        <label style={lbl()}>Admin Email Address</label>
                                        <input name="adminEmail" type="email" required placeholder="admin@apexgeneral.com"
                                            style={inp()} onFocus={e => e.currentTarget.style.borderColor = '#10B981'} onBlur={e => e.currentTarget.style.borderColor = '#E2E8F0'} />
                                        <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '5px' }}>A temporary password will be shown after creation. Ask the admin to change it after first login.</p>
                                    </div>
                                )}
                                <div>
                                    <label style={lbl()}>Subscription Plan</label>
                                    <select name="plan" defaultValue={editTenant?.plan || 'Starter Tier'}
                                        style={{ ...inp(), background: '#fff', cursor: 'pointer' }}>
                                        {PLAN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                            </form>
                        </div>

                        <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'flex-end', gap: '10px', borderRadius: '0 0 16px 16px' }}>
                            <button onClick={() => setIsModalOpen(false)} type="button" style={{ padding: '9px 18px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" form="tenant-form" disabled={formLoading}
                                style={{ padding: '9px 20px', background: '#10B981', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: formLoading ? 0.7 : 1 }}>
                                {formLoading ? 'Saving…' : modalMode === 'create' ? <><UserPlus size={15} /> Provision &amp; Create User</> : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Credentials Modal ──────────────────────────────────── */}
            {credModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }} />
                    <div style={{ position: 'relative', background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '460px', boxShadow: '0 24px 48px rgba(0,0,0,0.18)' }}>
                        <div style={{ padding: '22px 24px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <KeyRound size={20} color="#10B981" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Hospital Provisioned! 🎉</h2>
                                <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0' }}>Share these login credentials with the hospital admin.</p>
                            </div>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px', marginBottom: '14px' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>{credModal.tenantName}</div>
                                {[{ label: 'Admin Email', value: credModal.email, field: 'email' }, { label: 'Temp Password', value: credModal.password, field: 'password' }].map(row => (
                                    <div key={row.field} style={{ marginBottom: '10px' }}>
                                        <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>{row.label}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 12px' }}>
                                            <span style={{ flex: 1, fontSize: '14px', fontWeight: 600, fontFamily: 'monospace', color: '#0F172A' }}>{row.value}</span>
                                            <button onClick={() => copy(row.value, row.field)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedField === row.field ? '#10B981' : '#94A3B8', display: 'flex' }}>
                                                {copiedField === row.field ? <CheckCheck size={15} /> : <Copy size={15} />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', padding: '12px' }}>
                                <span>⚠️</span>
                                <p style={{ fontSize: '12.5px', color: '#92400E', margin: 0, lineHeight: 1.55 }}>
                                    <strong>Save these now.</strong> The password is shown only once. The admin should change it after their first login.
                                </p>
                            </div>
                        </div>
                        <div style={{ padding: '14px 24px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button onClick={() => copy(`Email: ${credModal.email}\nPassword: ${credModal.password}`, 'all')}
                                style={{ padding: '9px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {copiedField === 'all' ? <><CheckCheck size={14} color="#10B981" /> Copied!</> : <><Copy size={14} /> Copy All</>}
                            </button>
                            <button onClick={() => setCredModal(null)} style={{ padding: '9px 20px', background: '#10B981', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Done</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Style helpers
const ddBtn = () => ({ display: 'block', width: '100%', padding: '10px 16px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: '13px', color: '#334155', cursor: 'pointer' });
const lbl = () => ({ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' });
const inp = () => ({ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' });
