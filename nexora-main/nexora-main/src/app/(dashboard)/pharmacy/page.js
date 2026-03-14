'use client';
import { useState, useEffect } from 'react';
import { Pill, Plus, Search, AlertTriangle, AlertCircle, ShoppingCart, Activity, RefreshCw, X, PackagePlus, ArrowDownToLine, Package } from 'lucide-react';
import Link from 'next/link';

const STOCK_STATUS = (stock, min) => {
    if (stock === 0) return { label: 'Stock-Out', cls: 'badge-error' };
    if (stock < min) return { label: 'Re-Order', cls: 'badge-yellow' };
    return { label: 'Healthy', cls: 'badge-green' };
};

const EXPIRY_WARNING = (expiryDate) => {
    if (!expiryDate) return false;
    const exp = new Date(expiryDate);
    const now = new Date();
    const diff = (exp - now) / (1000 * 60 * 60 * 24);
    return diff <= 90; // warn if expiring within 90 days
};

export default function PharmacyPage() {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDispenses, setShowDispenses] = useState(false);
    const [dispensations, setDispensations] = useState([]);
    const [loadingDispenses, setLoadingDispenses] = useState(false);

    // Add new medicine form state
    const [form, setForm] = useState({ name: '', genericName: '', manufacturer: '', category: 'Tablet', batchNumber: '', expiryDate: '', mrp: '', costPrice: '', stock: '', minThreshold: '50' });
    const [saving, setSaving] = useState(false);

    // Receive Stock modal state
    const [receiveModal, setReceiveModal] = useState(null); // holds the medicine being restocked
    const [receiveForm, setReceiveForm] = useState({ qtyToAdd: '', batchNumber: '', expiryDate: '', mrp: '', costPrice: '' });
    const [receiveSaving, setReceiveSaving] = useState(false);

    const fetchMedicines = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/pharmacy/medicines');
            if (res.ok) {
                const data = await res.json();
                setMedicines(data.medicines || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDispensations = async () => {
        setLoadingDispenses(true);
        try {
            const res = await fetch('/api/pharmacy/dispense');
            if (res.ok) {
                const data = await res.json();
                setDispensations(data.dispensations || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDispenses(false);
        }
    };

    useEffect(() => { fetchMedicines(); }, []);

    const handleAddMedicine = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/pharmacy/medicines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                const data = await res.json();
                setMedicines(prev => [...prev, data.medicine].sort((a, b) => a.name.localeCompare(b.name)));
                setForm({ name: '', genericName: '', manufacturer: '', category: 'Tablet', batchNumber: '', expiryDate: '', mrp: '', costPrice: '', stock: '', minThreshold: '50' });
                setShowAddModal(false);
            } else {
                const err = await res.json();
                alert('Error: ' + (err.error || 'Failed to add medicine'));
            }
        } catch (err) {
            alert('Network error');
        } finally {
            setSaving(false);
        }
    };

    const openReceiveModal = (med) => {
        setReceiveModal(med);
        // Pre-fill with medicine's current batch/expiry/mrp/costPrice as defaults
        setReceiveForm({ qtyToAdd: '', batchNumber: med.batchNumber || '', expiryDate: med.expiryDate || '', mrp: med.mrp || '', costPrice: med.costPrice || '' });
    };

    const handleReceiveStock = async (e) => {
        e.preventDefault();
        if (!receiveModal) return;
        const qty = parseInt(receiveForm.qtyToAdd);
        if (!qty || qty <= 0) return alert('Enter a valid quantity to receive.');

        setReceiveSaving(true);
        try {
            const res = await fetch('/api/pharmacy/medicines', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: receiveModal.id,
                    mode: 'receive',
                    qtyToAdd: qty,
                    batchNumber: receiveForm.batchNumber || undefined,
                    expiryDate: receiveForm.expiryDate || undefined,
                    mrp: receiveForm.mrp !== '' ? receiveForm.mrp : undefined,
                    costPrice: receiveForm.costPrice !== '' ? receiveForm.costPrice : undefined,
                })
            });
            if (res.ok) {
                const data = await res.json();
                setMedicines(prev => prev.map(m => m.id === receiveModal.id ? data.medicine : m));
                setReceiveModal(null);
            } else {
                const err = await res.json();
                alert('Error: ' + (err.error || 'Failed'));
            }
        } catch (err) {
            alert('Network error');
        } finally {
            setReceiveSaving(false);
        }
    };

    const filtered = medicines.filter(m => {
        const s = searchQuery.toLowerCase();
        const matchSearch = !s ||
            m.name.toLowerCase().includes(s) ||
            (m.genericName || '').toLowerCase().includes(s) ||
            (m.manufacturer || '').toLowerCase().includes(s) ||
            m.drugCode.toLowerCase().includes(s) ||
            (m.batchNumber || '').toLowerCase().includes(s);

        const status = STOCK_STATUS(m.stock, m.minThreshold).label;
        const matchStatus = filterStatus === 'All' ||
            (filterStatus === 'Low Stock' && (status === 'Re-Order' || status === 'Stock-Out')) ||
            (filterStatus === 'Expiring' && EXPIRY_WARNING(m.expiryDate)) ||
            (filterStatus === 'Healthy' && status === 'Healthy');

        return matchSearch && matchStatus;
    });

    const kpi = {
        total: medicines.length,
        lowStock: medicines.filter(m => m.stock < m.minThreshold).length,
        expiring: medicines.filter(m => EXPIRY_WARNING(m.expiryDate)).length,
    };

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Pharmacy & Medicines</h1>
                    <p className="page-header__subtitle">Manage drug inventory, prescriptions, and pharmacy sales.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}
                        onClick={() => { setShowDispenses(true); fetchDispensations(); }}>
                        <ShoppingCart size={14} /> View Dispatches
                    </button>
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={() => setShowAddModal(true)}>
                        <PackagePlus size={14} /> Add Medicine
                    </button>
                    <Link href="/pharmacy/prescribe" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <Plus size={15} strokeWidth={1.5} /> Dispense Medicine
                    </Link>
                </div>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ background: 'rgba(56,189,248,0.1)', color: '#0EA5E9', padding: '10px', borderRadius: '10px', width: 'fit-content', marginBottom: '12px' }}>
                        <Activity size={20} />
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Active SKUs in Stock</p>
                    <h4 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{loading ? '—' : kpi.total.toLocaleString()}</h4>
                </div>
                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '10px', borderRadius: '10px', width: 'fit-content', marginBottom: '12px' }}>
                        <AlertCircle size={20} />
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Critical Low Stock</p>
                    <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#EF4444', margin: 0 }}>{loading ? '—' : kpi.lowStock}</h4>
                </div>
                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', padding: '10px', borderRadius: '10px', width: 'fit-content', marginBottom: '12px' }}>
                        <AlertTriangle size={20} />
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Nearing Expiry (90 Days)</p>
                    <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#F59E0B', margin: 0 }}>{loading ? '—' : kpi.expiring}</h4>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                {/* Search + Filter */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
                        <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                        <input
                            type="text"
                            placeholder="Search by name, generic, batch, manufacturer..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '11px 16px 11px 40px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['All', 'Healthy', 'Low Stock', 'Expiring'].map(f => (
                            <button key={f} onClick={() => setFilterStatus(f)} style={{
                                padding: '8px 14px', borderRadius: '8px', border: '1px solid', fontSize: '13px', cursor: 'pointer', fontWeight: 500,
                                borderColor: filterStatus === f ? 'var(--color-navy)' : 'var(--color-border-light)',
                                background: filterStatus === f ? 'var(--color-navy)' : '#fff',
                                color: filterStatus === f ? '#fff' : 'var(--color-text-secondary)',
                            }}>{f}</button>
                        ))}
                    </div>
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={fetchMedicines}>
                        <RefreshCw size={14} />
                    </button>
                </div>

                {loading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading inventory...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <Pill size={36} strokeWidth={1} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                        <p>{medicines.length === 0
                            ? 'No medicines in inventory yet. Click "Add Medicine" to get started.'
                            : 'No medicines match your search.'}</p>
                    </div>
                ) : (
                    <div className="data-table-wrapper" style={{ borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
                        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
                                <tr>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Drug & Details</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Manufacturer & Form</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Batch & Expiry</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Stock Level</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(med => {
                                    const { label, cls } = STOCK_STATUS(med.stock, med.minThreshold);
                                    const expWarn = EXPIRY_WARNING(med.expiryDate);
                                    return (
                                        <tr key={med.id}
                                            style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.15s' }}
                                            onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'}
                                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '14px' }}>{med.name}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{med.genericName || '—'} · {med.drugCode}</div>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <div>{med.manufacturer || '—'}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{med.category}</div>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ fontFamily: 'monospace', fontSize: '13px' }}>{med.batchNumber || '—'}</div>
                                                <div style={{ fontSize: '12px', color: expWarn ? '#F59E0B' : 'var(--color-text-secondary)', fontWeight: expWarn ? 600 : 400 }}>
                                                    {expWarn && '⚠ '}{med.expiryDate || '—'}
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ fontWeight: 600, color: med.stock === 0 ? '#EF4444' : 'var(--color-navy)' }}>{med.stock.toLocaleString()} <span style={{ fontWeight: 400, fontSize: '12px', color: 'var(--color-text-muted)' }}>units</span></div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Min: {med.minThreshold} · MRP ₹{med.mrp}</div>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span className={`badge ${cls}`} style={{ padding: '4px 10px', fontSize: '12px' }}>{label}</span>
                                                {expWarn && <span className="badge badge-warning" style={{ padding: '4px 8px', fontSize: '11px', marginLeft: '6px' }}>Expiring</span>}
                                            </td>
                                            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    style={{ fontSize: '12px', padding: '6px 12px' }}
                                                    onClick={() => openReceiveModal(med)}
                                                >
                                                    <ArrowDownToLine size={13} /> Receive Stock
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Receive Stock Modal ── */}
            {receiveModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Receive New Stock</h2>
                            <button onClick={() => setReceiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
                        </div>

                        {/* Medicine info banner */}
                        <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '10px', padding: '14px 16px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ background: 'rgba(14,165,233,0.12)', color: '#0EA5E9', padding: '8px', borderRadius: '8px' }}><Package size={18} /></div>
                                <div>
                                    <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '15px' }}>{receiveModal.name}</div>
                                    <div style={{ fontSize: '12px', color: '#64748B' }}>
                                        {receiveModal.genericName && <span>{receiveModal.genericName} · </span>}
                                        {receiveModal.drugCode} · {receiveModal.category}
                                    </div>
                                    <div style={{ fontSize: '12px', color: receiveModal.stock < receiveModal.minThreshold ? '#EF4444' : '#16A34A', fontWeight: 600, marginTop: '2px' }}>
                                        Current stock: {receiveModal.stock} units
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleReceiveStock} style={{ display: 'grid', gap: '16px' }}>
                            {/* Qty to add — prominent */}
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 600, color: 'var(--color-navy)' }}>Quantity Received (units) <span style={{ color: 'red' }}>*</span></label>
                                <input required autoFocus type="number" min="1" value={receiveForm.qtyToAdd}
                                    onChange={e => setReceiveForm({ ...receiveForm, qtyToAdd: e.target.value })}
                                    placeholder="e.g. 500"
                                    style={{ width: '100%', padding: '12px 14px', border: '2px solid #0EA5E9', borderRadius: '8px', outline: 'none', fontSize: '20px', fontWeight: 700, color: 'var(--color-navy)', textAlign: 'center' }} />
                                {receiveForm.qtyToAdd > 0 && (
                                    <p style={{ fontSize: '12px', color: '#16A34A', marginTop: '6px', textAlign: 'center' }}>
                                        New total will be: <strong>{receiveModal.stock + parseInt(receiveForm.qtyToAdd || 0)} units</strong>
                                    </p>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>New Batch Number</label>
                                    <input type="text" value={receiveForm.batchNumber}
                                        onChange={e => setReceiveForm({ ...receiveForm, batchNumber: e.target.value })}
                                        placeholder={receiveModal.batchNumber || 'e.g. B24099'}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Leave blank to keep current</p>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>New Expiry Date</label>
                                    <input type="date" value={receiveForm.expiryDate}
                                        onChange={e => setReceiveForm({ ...receiveForm, expiryDate: e.target.value })}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Leave blank to keep current</p>
                                </div>
                                <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Updated Cost Price (₹ per unit)</label>
                                        <input type="number" min="0" step="0.01" value={receiveForm.costPrice}
                                            onChange={e => setReceiveForm({ ...receiveForm, costPrice: e.target.value })}
                                            placeholder={`Current: ₹${receiveModal.costPrice} — leave blank to keep`}
                                            style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Updated MRP (₹ per unit)</label>
                                        <input type="number" min="0" step="0.01" value={receiveForm.mrp}
                                            onChange={e => setReceiveForm({ ...receiveForm, mrp: e.target.value })}
                                            placeholder={`Current: ₹${receiveModal.mrp} — leave blank to keep`}
                                            style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '4px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setReceiveModal(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={receiveSaving}>
                                    <ArrowDownToLine size={15} />
                                    {receiveSaving ? 'Saving...' : 'Confirm Receipt'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Add Medicine Modal ── */}
            {showAddModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Add New Medicine to Inventory</h2>
                            <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddMedicine} style={{ display: 'grid', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Medicine Name <span style={{ color: 'red' }}>*</span></label>
                                    <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Dolo 650mg" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Generic Name</label>
                                    <input type="text" value={form.genericName} onChange={e => setForm({ ...form, genericName: e.target.value })} placeholder="e.g. Paracetamol" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Manufacturer</label>
                                    <input type="text" value={form.manufacturer} onChange={e => setForm({ ...form, manufacturer: e.target.value })} placeholder="e.g. Cipla" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Category</label>
                                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', background: '#fff' }}>
                                        {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Drops', 'Ointment', 'Inhaler', 'Powder'].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Batch Number</label>
                                    <input type="text" value={form.batchNumber} onChange={e => setForm({ ...form, batchNumber: e.target.value })} placeholder="e.g. B22019" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Expiry Date</label>
                                    <input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Cost Price (₹ per unit)</label>
                                    <input type="number" min="0" step="0.01" value={form.costPrice} onChange={e => setForm({ ...form, costPrice: e.target.value })} placeholder="0.00" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>MRP (₹ per unit)</label>
                                    <input type="number" min="0" step="0.01" value={form.mrp} onChange={e => setForm({ ...form, mrp: e.target.value })} placeholder="0.00" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Opening Stock (Units)</label>
                                    <input type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="e.g. 500" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Min Threshold (Reorder at)</label>
                                    <input type="number" min="0" value={form.minThreshold} onChange={e => setForm({ ...form, minThreshold: e.target.value })} placeholder="50" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Add to Inventory'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Dispatch History Modal ── */}
            {showDispenses && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '700px', padding: '32px', maxHeight: '85vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Dispensation History</h2>
                            <button onClick={() => setShowDispenses(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
                        </div>
                        {loadingDispenses ? (
                            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading...</p>
                        ) : dispensations.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '40px 0' }}>No dispensations recorded yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {dispensations.map(d => (
                                    <div key={d.id} style={{ padding: '16px', border: '1px solid var(--color-border-light)', borderRadius: '10px', background: '#FAFCFF' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <div>
                                                <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontFamily: 'monospace' }}>{d.billCode}</div>
                                                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{d.patientName} · {new Date(d.createdAt).toLocaleString('en-IN')}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 700, color: '#16A34A', fontSize: '16px' }}>₹{d.netAmount.toFixed(2)}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{d.items.length} item(s)</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {d.items.map(item => (
                                                <span key={item.id} className="badge badge-navy" style={{ fontSize: '11px', padding: '3px 8px' }}>
                                                    {item.medicine.name} × {item.quantity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
