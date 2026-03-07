'use client';
import { useState, useEffect } from 'react';
import { IndianRupee, Plus, Search, TrendingUp, Clock, CreditCard, Receipt, RefreshCw, X, CheckCircle } from 'lucide-react';

const STATUS_COLORS = { 'Paid': 'badge-green', 'Pending': 'badge-yellow', 'Refunded': 'badge-navy', 'Cancelled': 'badge-error' };
const SERVICE_TYPES = ['OPD Consult', 'IPD Final Bill', 'Pharmacy Sale', 'Lab Request', 'Radiology', 'Procedure', 'OPD Registration', 'Emergency'];
const PAYMENT_METHODS = ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'TPA / Insurance', 'Net Banking'];

const defaultForm = { patientName: '', serviceType: 'OPD Consult', amount: '', discount: '0', paymentMethod: 'Cash', notes: '' };

export default function BillingPage() {
    const [invoices, setInvoices] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(defaultForm);
    const [saving, setSaving] = useState(false);
    const [patientSearch, setPatientSearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [invRes, ptRes] = await Promise.all([fetch('/api/billing/invoices'), fetch('/api/patients')]);
            if (invRes.ok) setInvoices((await invRes.json()).invoices || []);
            if (ptRes.ok) setPatients((await ptRes.json()).patients || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSaving(true);
        const patientName = selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : form.patientName;
        try {
            const res = await fetch('/api/billing/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, patientName, patientUhId: selectedPatient?.patientCode, patientId: selectedPatient?.id })
            });
            if (res.ok) {
                const data = await res.json();
                setInvoices(prev => [data.invoice, ...prev]);
                setForm(defaultForm);
                setSelectedPatient(null);
                setPatientSearch('');
                setShowModal(false);
            } else {
                const err = await res.json();
                alert('Error: ' + (err.error || 'Failed'));
            }
        } catch (e) { alert('Network error'); }
        finally { setSaving(false); }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        const res = await fetch('/api/billing/invoices', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: newStatus })
        });
        if (res.ok) setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
    };

    const printReceipt = (inv) => {
        const date = new Date(inv.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Receipt ${inv.invoiceCode}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1a2336; padding: 40px; max-width: 560px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 2px solid #e2e8f0; }
    .header h1 { font-size: 22px; font-weight: 800; color: #0f3460; letter-spacing: -0.5px; }
    .header p { font-size: 13px; color: #64748b; margin-top: 4px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 8px;
      background: ${inv.status === 'Paid' ? '#dcfce7' : inv.status === 'Refunded' ? '#dbeafe' : '#fef9c3'};
      color: ${inv.status === 'Paid' ? '#15803d' : inv.status === 'Refunded' ? '#1d4ed8' : '#854d0e'}; }
    .invoice-no { font-family: monospace; font-size: 13px; color: #64748b; margin-top: 6px; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .row:last-child { border-bottom: none; }
    .label { color: #64748b; }
    .value { font-weight: 600; color: #1a2336; }
    .total-row { display: flex; justify-content: space-between; padding: 14px 0; border-top: 2px solid #0f3460; margin-top: 8px; }
    .total-label { font-size: 16px; font-weight: 700; color: #0f3460; }
    .total-value { font-size: 22px; font-weight: 800; color: #15803d; }
    .footer { text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px dashed #e2e8f0; font-size: 12px; color: #94a3b8; }
    @media print {
      body { padding: 24px; }
      @page { margin: 0.5cm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Nexora Health</h1>
    <p>Official Payment Receipt</p>
    <div class="badge">${inv.status}</div>
    <div class="invoice-no">${inv.invoiceCode}</div>
  </div>

  <div class="section">
    <div class="section-title">Patient Details</div>
    <div class="row"><span class="label">Patient Name</span><span class="value">${inv.patientName}</span></div>
    ${inv.patientUhId ? `<div class="row"><span class="label">UHID</span><span class="value">${inv.patientUhId}</span></div>` : ''}
    <div class="row"><span class="label">Date &amp; Time</span><span class="value">${date}</span></div>
  </div>

  <div class="section">
    <div class="section-title">Bill Summary</div>
    <div class="row"><span class="label">Service Type</span><span class="value">${inv.serviceType}</span></div>
    <div class="row"><span class="label">Payment Method</span><span class="value">${inv.paymentMethod}</span></div>
    <div class="row"><span class="label">Subtotal</span><span class="value">₹${inv.amount.toFixed(2)}</span></div>
    ${inv.discount > 0 ? `<div class="row"><span class="label">Discount (${inv.discount}%)</span><span class="value" style="color:#dc2626">− ₹${(inv.amount * inv.discount / 100).toFixed(2)}</span></div>` : ''}
    <div class="row"><span class="label">Tax (5% GST)</span><span class="value">+ ₹${inv.tax.toFixed(2)}</span></div>
    <div class="total-row">
      <span class="total-label">Net Amount Paid</span>
      <span class="total-value">₹${inv.netAmount.toFixed(2)}</span>
    </div>
  </div>

  <div class="footer">
    <p>Thank you for choosing Nexora Health.</p>
    <p style="margin-top:4px">This is a computer-generated receipt and does not require a signature.</p>
  </div>

  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;
        const win = window.open('', '_blank', 'width=640,height=800');
        win.document.write(html);
        win.document.close();
    };

    const filteredPatients = patientSearch
        ? patients.filter(p => p.firstName.toLowerCase().includes(patientSearch.toLowerCase()) || p.lastName.toLowerCase().includes(patientSearch.toLowerCase()) || p.patientCode.toLowerCase().includes(patientSearch.toLowerCase()))
        : [];

    const filtered = invoices.filter(inv => {
        const q = searchQuery.toLowerCase();
        const matchSearch = !q || inv.invoiceCode.toLowerCase().includes(q) || inv.patientName.toLowerCase().includes(q) || (inv.patientUhId || '').toLowerCase().includes(q);
        const matchStatus = filterStatus === 'All' || inv.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const kpi = {
        todayPaid: invoices.filter(i => i.status === 'Paid' && new Date(i.createdAt).toDateString() === new Date().toDateString()).reduce((s, i) => s + i.netAmount, 0),
        pending: invoices.filter(i => i.status === 'Pending').reduce((s, i) => s + i.netAmount, 0),
        pendingCount: invoices.filter(i => i.status === 'Pending').length,
        totalPaid: invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.netAmount, 0),
    };

    // Compute net for display in modal
    const modalSubtotal = parseFloat(form.amount) || 0;
    const modalDiscount = modalSubtotal * ((parseFloat(form.discount) || 0) / 100);
    const modalNet = (modalSubtotal - modalDiscount) * 1.05;

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Billing & Invoicing</h1>
                    <p className="page-header__subtitle">Manage patient accounts, invoices, and hospital revenue streams.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={fetchData}><RefreshCw size={14} /></button>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                        <Plus size={15} strokeWidth={1.5} /> Draft New Invoice
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ background: 'rgba(16,185,129,0.1)', color: '#16A34A', padding: '10px', borderRadius: '10px', width: 'fit-content', marginBottom: '12px' }}><IndianRupee size={20} /></div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Collected Today</p>
                    <h4 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>₹{kpi.todayPaid.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h4>
                </div>
                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', padding: '10px', borderRadius: '10px', width: 'fit-content', marginBottom: '12px' }}><Clock size={20} /></div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Outstanding Dues</p>
                    <h4 style={{ fontSize: '22px', fontWeight: 700, color: '#F59E0B', margin: 0 }}>₹{kpi.pending.toLocaleString('en-IN', { maximumFractionDigits: 0 })} <span style={{ fontSize: '13px', fontWeight: 400 }}>({kpi.pendingCount})</span></h4>
                </div>
                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '10px', borderRadius: '10px', width: 'fit-content', marginBottom: '12px' }}><TrendingUp size={20} /></div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Total Revenue (All Time)</p>
                    <h4 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>₹{kpi.totalPaid.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h4>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
                        <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                        <input type="text" placeholder="Search by Invoice No, Patient Name or UHID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '11px 16px 11px 40px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['All', 'Paid', 'Pending', 'Refunded'].map(s => (
                            <button key={s} onClick={() => setFilterStatus(s)} style={{
                                padding: '8px 14px', borderRadius: '8px', border: '1px solid', fontSize: '13px', cursor: 'pointer', fontWeight: 500,
                                borderColor: filterStatus === s ? 'var(--color-navy)' : 'var(--color-border-light)',
                                background: filterStatus === s ? 'var(--color-navy)' : '#fff',
                                color: filterStatus === s ? '#fff' : 'var(--color-text-secondary)',
                            }}>{s}</button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading invoices...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <IndianRupee size={36} strokeWidth={1} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                        <p>{invoices.length === 0 ? 'No invoices yet. Create the first one!' : 'No invoices match your search.'}</p>
                    </div>
                ) : (
                    <div className="data-table-wrapper" style={{ borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
                        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
                                <tr>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Invoice & Date</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Patient</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Service</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Amount</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(inv => (
                                    <tr key={inv.id} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.15s' }}
                                        onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'}
                                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontFamily: 'monospace', fontSize: '13px' }}>{inv.invoiceCode}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{new Date(inv.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ fontWeight: 600 }}>{inv.patientName}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{inv.patientUhId || '—'}</div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span className="badge badge-navy" style={{ fontSize: '11px', padding: '3px 8px' }}>{inv.serviceType}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '15px' }}>₹{inv.netAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><CreditCard size={10} /> {inv.paymentMethod}</div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span className={`badge ${STATUS_COLORS[inv.status] || 'badge-yellow'}`} style={{ padding: '4px 10px', fontSize: '12px' }}>{inv.status}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                                {inv.status === 'Pending' && (
                                                    <button className="btn btn-primary btn-sm" style={{ fontSize: '11px', padding: '5px 10px' }} onClick={() => handleStatusUpdate(inv.id, 'Paid')}>
                                                        <CheckCircle size={12} /> Mark Paid
                                                    </button>
                                                )}
                                                <button className="btn btn-secondary btn-sm" style={{ fontSize: '11px', padding: '5px 10px', background: '#F8FAFC' }} onClick={() => printReceipt(inv)}>
                                                    <Receipt size={12} /> Receipt
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Invoice Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '560px', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Create New Invoice</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreate} style={{ display: 'grid', gap: '16px' }}>
                            {/* Patient search */}
                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Patient <span style={{ color: 'red' }}>*</span></label>
                                {selectedPatient ? (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                        <div><div style={{ fontWeight: 600 }}>{selectedPatient.firstName} {selectedPatient.lastName}</div><div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{selectedPatient.patientCode}</div></div>
                                        <button type="button" onClick={() => { setSelectedPatient(null); setPatientSearch(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={15} /></button>
                                    </div>
                                ) : (
                                    <>
                                        <input type="text" placeholder="Search registered patient or type walk-in name..." value={patientSearch || form.patientName}
                                            onChange={e => { setPatientSearch(e.target.value); setForm({ ...form, patientName: e.target.value }); }}
                                            style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                        {filteredPatients.length > 0 && (
                                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '8px', marginTop: '4px', zIndex: 20, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', maxHeight: '160px', overflowY: 'auto' }}>
                                                {filteredPatients.map(p => (
                                                    <div key={p.id} onClick={() => { setSelectedPatient(p); setPatientSearch(''); }} style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                                                        onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                                                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{p.firstName} {p.lastName}</div>
                                                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{p.patientCode}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Service Type</label>
                                    <select value={form.serviceType} onChange={e => setForm({ ...form, serviceType: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', background: '#fff' }}>
                                        {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Payment Method</label>
                                    <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', background: '#fff' }}>
                                        {PAYMENT_METHODS.map(p => <option key={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Amount (₹) <span style={{ color: 'red' }}>*</span></label>
                                    <input required type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 1200" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Discount %</label>
                                    <input type="number" min="0" max="100" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} placeholder="0" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Notes</label>
                                <input type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                            </div>

                            {/* Live preview */}
                            {form.amount > 0 && (
                                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
                                        <span>Subtotal</span><span>₹{modalSubtotal.toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
                                        <span>Discount ({form.discount}%)</span><span>-₹{modalDiscount.toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#16A34A', fontSize: '16px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                                        <span>Net Payable (incl. 5% tax)</span><span>₹{modalNet.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Creating...' : 'Create Invoice'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
