'use client';
import { useState, useEffect } from 'react';
import { IndianRupee, Plus, Search, TrendingUp, Clock, CreditCard, Receipt, RefreshCw, X, CheckCircle, ShieldCheck, Filter, ArrowUpRight, MoreVertical, Wallet, Landmark, HandCoins, FileText, Siren, Ghost, Monitor, LayoutDashboard, Database, Activity, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Skeleton from '@/components/common/Skeleton';
import PrintWrapper from '@/components/print/PrintWrapper';
import PrintHeader from '@/components/print/PrintHeader';
import PrintFooter from '@/components/print/PrintFooter';
import ThermalReceipt from '@/components/print/ThermalReceipt';
import AdvanceReceipt from '@/components/print/AdvanceReceipt';

const STATUS_COLORS = {
    'Paid': 'status-paid',
    'Pending': 'status-pending',
    'Refunded': 'status-refunded',
    'Cancelled': 'status-cancelled'
};

const PAYMENT_METHODS = ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'TPA / Insurance', 'Net Banking'];
const SERVICE_TYPES = ['OPD Consult', 'IPD Final Bill', 'Pharmacy Sale', 'Lab Request', 'Radiology', 'Procedure', 'OPD Registration', 'Emergency'];

export default function BillingPage() {
    const [invoices, setInvoices] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ patientName: '', serviceType: 'OPD Consult', amount: '', discount: '0', paymentMethod: 'Cash', notes: '' });
    const [saving, setSaving] = useState(false);
    const [patientSearch, setPatientSearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [managerPin, setManagerPin] = useState('');
    const [requirePin, setRequirePin] = useState(false);

    const [voidInvoiceId, setVoidInvoiceId] = useState(null);
    const [voidReason, setVoidReason] = useState('');
    const [voiding, setVoiding] = useState(false);

    const [activeView, setActiveView] = useState('invoices');
    const [advances, setAdvances] = useState([]);
    const [showAdvanceModal, setShowAdvanceModal] = useState(false);
    const [advanceSaving, setAdvanceSaving] = useState(false);
    const [printAdvance, setPrintAdvance] = useState(null);
    const [advForm, setAdvForm] = useState({ amount: '', paymentMethod: 'Cash', notes: '' });
    const [tan, setTan] = useState(null);

    const [printInvoice, setPrintInvoice] = useState(null);
    const [printThermal, setPrintThermal] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [invRes, ptRes, advRes, setRes] = await Promise.all([
                fetch('/api/billing/invoices'),
                fetch('/api/patients'),
                fetch('/api/billing/advances'),
                fetch('/api/settings')
            ]);
            if (invRes.ok) setInvoices((await invRes.json()).invoices || []);
            if (ptRes.ok) setPatients((await ptRes.json()).patients || []);
            if (advRes.ok) setAdvances((await advRes.json()).advances || []);
            if (setRes.ok) setTan((await setRes.json()).tenant);
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
                body: JSON.stringify({ ...form, patientName, patientUhId: selectedPatient?.patientCode, patientId: selectedPatient?.id, managerOverride: managerPin })
            });
            const data = await res.json();
            if (res.ok) {
                setInvoices(prev => [data.invoice, ...prev]);
                setShowModal(false);
                fetchData();
            } else if (data.requirePin) {
                setRequirePin(true);
            }
        } catch (e) { }
        finally { setSaving(false); }
    };

    const handleCreateAdvance = async (e) => {
        e.preventDefault();
        if (!selectedPatient) return;
        setAdvanceSaving(true);
        try {
            const res = await fetch('/api/billing/advances', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...advForm, patientId: selectedPatient.id })
            });
            if (res.ok) {
                const data = await res.json();
                setAdvances(prev => [data.advance, ...prev]);
                setShowAdvanceModal(false);
                setPrintAdvance(data.advance);
                fetchData();
            }
        } catch (e) { }
        finally { setAdvanceSaving(false); }
    };

    const handleVoidSubmit = async (e) => {
        e.preventDefault();
        setVoiding(true);
        try {
            const res = await fetch('/api/billing/invoices', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: voidInvoiceId, status: 'Cancelled', voidReason })
            });
            if (res.ok) {
                setInvoices(prev => prev.map(i => i.id === voidInvoiceId ? { ...i, status: 'Cancelled' } : i));
                setVoidInvoiceId(null);
            }
        } finally { setVoiding(false); }
    };

    const filteredPatients = patientSearch
        ? patients.filter(p =>
            p.firstName?.toLowerCase().includes(patientSearch.toLowerCase()) ||
            p.lastName?.toLowerCase().includes(patientSearch.toLowerCase()) ||
            p.patientCode?.toLowerCase().includes(patientSearch.toLowerCase())
        ).slice(0, 5)
        : [];

    const filteredInvoices = invoices.filter(inv => {
        const q = searchQuery.toLowerCase();
        const matchSearch = !q || inv.invoiceCode.toLowerCase().includes(q) || inv.patientName.toLowerCase().includes(q) || (inv.patientUhId || '').toLowerCase().includes(q);
        const matchStatus = filterStatus === 'All' || inv.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const filteredAdvances = advances.filter(adv => {
        const q = searchQuery.toLowerCase();
        return !q || adv.receiptCode.toLowerCase().includes(q) || (adv.patient?.firstName || '').toLowerCase().includes(q) || (adv.patient?.lastName || '').toLowerCase().includes(q) || (adv.patient?.patientCode || '').toLowerCase().includes(q);
    });

    const kpi = {
        todayPaid: invoices.filter(i => i.status === 'Paid' && new Date(i.createdAt).toDateString() === new Date().toDateString()).reduce((s, i) => s + i.netAmount, 0),
        pending: invoices.filter(i => i.status === 'Pending').reduce((s, i) => s + i.netAmount, 0),
        advances: advances.reduce((s, a) => s + a.amount, 0),
        totalLife: invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.netAmount, 0),
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
                .status-badge {
                    padding: 4px 10px;
                    border-radius: 8px;
                    font-size: 10px;
                    font-weight: 901;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .status-paid { background: #F0FDF4; color: #10B981; border: 1px solid #DCFCE7; }
                .status-pending { background: #FFF7ED; color: #F97316; border: 1px solid #FFEDD5; }
                .status-refunded { background: #F0F9FF; color: #0EA5E9; border: 1px solid #E0F2FE; }
                .status-cancelled { background: #FEF2F2; color: #EF4444; border: 1px solid #FEE2E2; }
                
                .view-tab {
                    padding: 12px 24px;
                    font-size: 11px;
                    font-weight: 901;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    color: #94A3B8;
                    border-bottom: 2px solid transparent;
                    transition: all 0.2s;
                }
                .view-tab.active {
                    color: #0F172A;
                    border-bottom-color: #0EA5E9;
                }
            `}</style>

            <div className="dashboard-header-row mb-8">
                <div>
                    <h1 className="responsive-h1">
                        Revenue & Financial Orchestration
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>Global financial ledger, patient accounts receivable, and transaction governance.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button onClick={fetchData} className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync Ledger
                    </button>
                    <button onClick={() => setShowAdvanceModal(true)} className="btn btn-secondary btn-sm h-11 px-6 border-emerald-100 text-emerald-600 bg-white" style={{ textDecoration: 'none' }}>
                        <HandCoins size={16} /> Collect Advance
                    </button>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm flex items-center gap-2" style={{ textDecoration: 'none' }}>
                        <Plus size={15} strokeWidth={1.5} /> Generate Invoice
                    </button>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="kpi-grid" style={{ marginBottom: '28px' }}>
                {[
                    { label: 'Daily Flux', value: `₹${kpi.todayPaid.toLocaleString()}`, sub: 'Collected Today', icon: Activity, color: '#10B981' },
                    { label: 'Receivables', value: `₹${kpi.pending.toLocaleString()}`, sub: 'Aging Ledger', icon: Clock, color: '#F59E0B' },
                    { label: 'Advance Trust', value: `₹${kpi.advances.toLocaleString()}`, sub: 'Patient Deposits', icon: Wallet, color: '#0EA5E9' },
                    { label: 'Yield Velocity', value: `₹${(kpi.totalLife / 100000).toFixed(1)}L`, sub: 'Net Lifetime Revenue', icon: TrendingUp, color: '#8B5CF6' },
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

            <div className="card">
                <div className="flex px-6 border-b border-slate-100">
                    <button className={`view-tab ${activeView === 'invoices' ? 'active' : ''}`} onClick={() => setActiveView('invoices')}>Revenue Streams</button>
                    <button className={`view-tab ${activeView === 'advances' ? 'active' : ''}`} onClick={() => setActiveView('advances')}>Deposit Master</button>
                </div>

                <div className="p-6 flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={`Search ${activeView === 'invoices' ? 'Invoices' : 'Advances'} by Code, Patient or Transaction ID...`} className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:border-cyan-500 outline-none transition-all shadow-sm" />
                    </div>
                    {activeView === 'invoices' && (
                        <div className="flex gap-2">
                            {['All', 'Paid', 'Pending', 'Cancelled'].map(f => (
                                <button key={f} onClick={() => setFilterStatus(f)} className={`h-11 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === f ? 'bg-navy-900 text-white shadow-lg shadow-slate-200' : 'bg-white border border-slate-200 text-slate-400'}`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="data-table-wrapper border-none">
                    {activeView === 'invoices' ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Identifier</th>
                                    <th>Payer Demographics</th>
                                    <th>Unit</th>
                                    <th>Net Proceeds</th>
                                    <th>Settlement</th>
                                    <th style={{ textAlign: 'right' }}>Management</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="6"><Skeleton height="20px" /></td></tr>) : filteredInvoices.map(inv => (
                                    <tr key={inv.id} className="hover:bg-slate-50 transition-all cursor-pointer">
                                        <td><div className="text-[13px] font-black text-navy-900 font-mono tracking-tighter">{inv.invoiceCode}</div></td>
                                        <td>
                                            <div className="text-[14px] font-black text-navy-900">{inv.patientName}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">{inv.patientUhId || 'WALK-IN VISIT'}</div>
                                        </td>
                                        <td><div className="text-[10px] font-black uppercase py-1 px-2 rounded-lg bg-slate-100 text-slate-600 inline-block">{inv.serviceType}</div></td>
                                        <td><div className="text-[14px] font-black text-navy-900">₹{inv.netAmount.toLocaleString()}</div></td>
                                        <td><span className={`status-badge ${STATUS_COLORS[inv.status]}`}>{inv.status}</span></td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => setPrintInvoice(inv)} className="h-9 px-4 rounded-lg bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-white border border-transparent hover:border-slate-200 transition-all shadow-sm">Audit Bill</button>
                                                <button onClick={() => setPrintThermal(inv)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 text-cyan-600 shadow-sm border border-transparent hover:border-cyan-100"><Receipt size={16} /></button>
                                                {inv.status === 'Paid' && <button onClick={() => setVoidInvoiceId(inv.id)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-600 border border-transparent hover:border-red-100"><X size={16} /></button>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Receipt</th>
                                    <th>Trustee Account</th>
                                    <th>Holding Amount</th>
                                    <th>Enrollment</th>
                                    <th>Source</th>
                                    <th style={{ textAlign: 'right' }}>Audit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="6"><Skeleton height="20px" /></td></tr>) : filteredAdvances.map(adv => (
                                    <tr key={adv.id} className="hover:bg-slate-50 transition-all">
                                        <td><div className="text-[13px] font-black text-navy-900 font-mono">{adv.receiptCode}</div></td>
                                        <td>
                                            <div className="text-[14px] font-black text-navy-900">{adv.patient?.firstName} {adv.patient?.lastName}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">{adv.patient?.patientCode}</div>
                                        </td>
                                        <td><div className="text-[14px] font-black text-emerald-600">₹{adv.amount.toLocaleString()}</div></td>
                                        <td><div className="text-[12px] font-bold text-navy-900">{new Date(adv.createdAt).toLocaleDateString()}</div></td>
                                        <td><div className="text-[10px] font-bold text-slate-400 uppercase">{adv.paymentMethod}</div></td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button onClick={() => setPrintAdvance(adv)} className="h-9 px-4 rounded-lg bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest shadow-sm">Print Token</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modals & Popups (Refactored for style) */}
            {showAdvanceModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[24px] w-full max-w-[500px] p-8 shadow-2xl animate-scale-up">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black text-navy-900">Capital Induction</h2>
                            <button onClick={() => setShowAdvanceModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 transition-all"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreateAdvance} className="space-y-6">
                            <div className="relative">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Account Search</label>
                                <input value={patientSearch} onChange={e => { setPatientSearch(e.target.value); setSelectedPatient(null); }} placeholder="Find by UHID or Name..." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-cyan-500 transition-all" />
                                {filteredPatients.length > 0 && !selectedPatient && (
                                    <div className="absolute top-full left-0 right-0 z-10 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
                                        {filteredPatients.map(p => (
                                            <div key={p.id} onClick={() => { setSelectedPatient(p); setPatientSearch(`${p.firstName} ${p.lastName} (${p.patientCode})`); }} className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 transition-all">
                                                <div className="font-black text-navy-900 text-sm">{p.firstName} {p.lastName}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase">{p.patientCode}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Principal Sum (₹)</label>
                                    <input required type="number" value={advForm.amount} onChange={e => setAdvForm({ ...advForm, amount: e.target.value })} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-lg text-emerald-600 outline-none focus:border-emerald-500 transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Transaction Hub</label>
                                    <select value={advForm.paymentMethod} onChange={e => setAdvForm({ ...advForm, paymentMethod: e.target.value })} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-cyan-500 transition-all appearance-none cursor-pointer">
                                        {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button disabled={advanceSaving || !selectedPatient} className="w-full py-4 rounded-xl bg-navy-900 text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">Confirm Financial Ledger Posting</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Direct Invoice Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[24px] w-full max-w-[560px] p-8 shadow-2xl animate-scale-up">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black text-navy-900">Revenue Generation</h2>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 transition-all"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="relative">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Debtor Account</label>
                                {selectedPatient ? (
                                    <div className="flex justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl items-center">
                                        <div>
                                            <div className="font-black text-navy-900 text-sm">{selectedPatient.firstName} {selectedPatient.lastName}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">{selectedPatient.patientCode}</div>
                                        </div>
                                        <button type="button" onClick={() => setSelectedPatient(null)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"><X size={16} /></button>
                                    </div>
                                ) : (
                                    <input value={patientSearch} onChange={e => setPatientSearch(e.target.value)} placeholder="Search Ledger Index..." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-cyan-500 transition-all" />
                                )}
                                {filteredPatients.length > 0 && !selectedPatient && (
                                    <div className="absolute top-full left-0 right-0 z-10 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
                                        {filteredPatients.map(p => (
                                            <div key={p.id} onClick={() => { setSelectedPatient(p); setPatientSearch(`${p.firstName} ${p.lastName} (${p.patientCode})`); }} className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-100 transition-all">
                                                <div className="font-black text-navy-900 text-sm">{p.firstName} {p.lastName}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase">{p.patientCode}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Revenue Unit</label>
                                    <select value={form.serviceType} onChange={e => setForm({ ...form, serviceType: e.target.value })} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-cyan-500 transition-all appearance-none cursor-pointer">
                                        {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Settlement Sum (₹)</label>
                                    <input required type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-lg text-navy-900 outline-none focus:border-cyan-500 transition-all" />
                                </div>
                            </div>
                            {requirePin && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl animate-pulse">
                                    <label className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-2 block text-center">Managerial Override Required</label>
                                    <input type="password" value={managerPin} onChange={e => setManagerPin(e.target.value)} placeholder="Enter Secure PIN" className="w-full px-5 py-2.5 bg-white border border-red-200 rounded-lg text-center font-black outline-none focus:border-red-500" />
                                </div>
                            )}
                            <button disabled={saving} className="w-full py-4 rounded-xl bg-cyan-600 text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-cyan-100 hover:bg-cyan-700 transition-all">Authorize & Emit Invoice</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Print Overlays */}
            {printInvoice && (
                <div className="fixed inset-0 z-[120] bg-slate-900/80 backdrop-blur-sm p-6 overflow-y-auto flex items-center justify-center">
                    <div className="bg-white rounded-[32px] w-full max-w-[850px] shadow-2xl overflow-hidden">
                        <PrintWrapper documentTitle={printInvoice.invoiceCode}>
                            <div className="p-16 font-sans text-slate-900">
                                <PrintHeader title="FINANCIAL SETTLEMENT" subtitle={printInvoice.invoiceCode} />
                                <div className="flex justify-between items-end mb-12 border-b-4 border-slate-900 pb-12">
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Counterparty</div>
                                        <div className="text-2xl font-black text-navy-900">{printInvoice.patientName}</div>
                                        <div className="text-xs font-bold text-slate-500 uppercase mt-1 tracking-widest">UHID: {printInvoice.patientUhId || 'TRANS-GUEST'}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Settlement Value</div>
                                        <div className="text-5xl font-black text-navy-900">₹{printInvoice.netAmount.toLocaleString()}</div>
                                        <div className="text-xs font-bold text-slate-500 uppercase mt-3 tracking-widest">{new Date(printInvoice.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <table className="w-full mb-16">
                                    <thead><tr className="border-b-2 border-slate-100"><th className="text-left py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description of Services</th><th className="text-right py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Line Total</th></tr></thead>
                                    <tbody className="divide-y divide-slate-50">
                                        <tr><td className="py-8 font-black text-lg">{printInvoice.serviceType}</td><td className="py-8 text-right font-black text-lg">₹{printInvoice.amount.toLocaleString()}</td></tr>
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-4 border-slate-900">
                                            <td className="py-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Verified Sum</td>
                                            <td className="py-8 text-right font-black text-3xl">₹{printInvoice.netAmount.toLocaleString()}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                                <PrintFooter systemId={printInvoice.id} />
                            </div>
                        </PrintWrapper>
                        <div className="p-6 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setPrintInvoice(null)} className="h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all">Dismiss Preview</button>
                        </div>
                    </div>
                </div>
            )}

            {printThermal && (
                <div className="fixed inset-0 z-[130] bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6">
                    <ThermalReceipt invoice={printThermal} tenant={tan} />
                    <button onClick={() => setPrintThermal(null)} className="mt-8 h-12 px-12 rounded-full bg-white text-navy-900 font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-110 active:scale-95 transition-all">Purge Preview</button>
                </div>
            )}

            {printAdvance && (
                <div className="fixed inset-0 z-[130] bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6">
                    <AdvanceReceipt advance={printAdvance} tenant={tan} />
                    <button onClick={() => setPrintAdvance(null)} className="mt-8 h-12 px-12 rounded-full bg-white text-navy-900 font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-110 active:scale-95 transition-all">Purge Preview</button>
                </div>
            )}

            {voidInvoiceId && (
                <div className="fixed inset-0 z-[140] bg-red-950/40 backdrop-blur-md flex items-center justify-center p-6">
                    <div className="bg-white rounded-[24px] w-full max-w-[400px] p-8 shadow-2xl animate-shake">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto"><X size={32} /></div>
                        <h3 className="text-xl font-black text-navy-900 text-center mb-4">Financial Void Authorization</h3>
                        <p className="text-slate-500 text-sm text-center leading-relaxed mb-8">This operation will irreversibly invalidate the financial record and trigger an audit alert in the compliance ledger.</p>
                        <textarea value={voidReason} onChange={e => setVoidReason(e.target.value)} placeholder="Mandatory audit trail reason..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold min-h-[120px] outline-none focus:border-red-500 transition-all mb-6" />
                        <div className="flex gap-4">
                            <button onClick={() => setVoidInvoiceId(null)} className="flex-1 py-4 rounded-xl bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest">Abort</button>
                            <button onClick={handleVoidSubmit} disabled={!voidReason || voiding} className="flex-1 py-4 rounded-xl bg-red-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-200 disabled:opacity-50">Authorize Void</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
