'use client';
import { useState, useEffect, Suspense } from 'react';
import { IndianRupee, Plus, Search, TrendingUp, Clock, CreditCard, Receipt, RefreshCw, X, CheckCircle, ShieldCheck, Filter, ArrowUpRight, MoreVertical, Wallet, Landmark, HandCoins, FileText, Siren, Ghost, Monitor, LayoutDashboard, Database, Activity, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
    return (
        <Suspense fallback={<div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>}>
            <BillingContent />
        </Suspense>
    );
}

function BillingContent() {
    const searchParams = useSearchParams();
    const targetPatientId = searchParams.get('patientId');
    const targetPatientUhId = searchParams.get('patientUhId');
    const targetSearch = searchParams.get('search');

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
            if (ptRes.ok) {
                const pts = (await ptRes.json()).patients || [];
                setPatients(pts);
                if (targetPatientId || targetPatientUhId) {
                    const match = pts.find(p => p.id === targetPatientId || p.patientCode === targetPatientUhId);
                    if (match) {
                        setSelectedPatient(match);
                        setSearchQuery(targetSearch || match.patientCode); // Prioritize specific search
                    }
                } else if (targetSearch) {
                    setSearchQuery(targetSearch);
                }
            }
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
        const matchPatient = !targetPatientId && !targetPatientUhId || 
                             inv.patientId === targetPatientId || 
                             inv.patientUhId === targetPatientUhId ||
                             (targetPatientUhId && (inv.patientUhId || '').includes(targetPatientUhId));
        return matchSearch && matchStatus && matchPatient;
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

                .modal-overlay-executive {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                }
                .modal-card-executive {
                    background: #fff;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 480px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    overflow: hidden;
                    animation: slideUp 0.2s ease-out;
                }
                .modal-header-executive {
                    padding: 14px 20px;
                    border-bottom: 1px solid #E2E8F0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #F8FAFC;
                }
                .modal-title-executive {
                    font-size: 15px;
                    font-weight: 600;
                    color: #0F172A;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .label-executive { 
                    display: block; 
                    font-size: 12px; 
                    font-weight: 500; 
                    color: #64748B; 
                    margin-bottom: 6px; 
                }
                .form-control-executive { 
                    width: 100%; 
                    border-radius: 6px; 
                    border: 1px solid #CBD5E1; 
                    padding: 8px 12px; 
                    font-size: 13px; 
                    font-weight: 400;
                    color: #0F172A;
                    outline: none; 
                    height: 38px;
                    background: #fff;
                }
                .btn-executive {
                    height: 38px;
                    padding: 0 16px;
                    font-size: 13px;
                    font-weight: 600;
                    border-radius: 6px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                }
                @keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>

            <div className="dashboard-header-row mb-10">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '52px', height: '52px', background: 'var(--color-navy)', color: '#fff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                        <IndianRupee size={24} />
                    </div>
                    <div>
                        <h1 className="responsive-h1" style={{ margin: 0 }}>Revenue & Financial Orchestration</h1>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0', fontWeight: 500 }}>Global financial ledger, patient accounts receivable, and transaction governance.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons" style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={fetchData} className="btn btn-secondary shadow-sm" style={{ background: '#fff', color: 'var(--color-navy)', borderRadius: '12px', height: '44px', padding: '0 20px' }}>
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} style={{ marginRight: '8px' }} /> Sync Ledger
                    </button>
                    <button onClick={() => setShowAdvanceModal(true)} className="btn btn-secondary shadow-sm" style={{ background: '#fff', color: '#10B981', border: '1px solid #DCFCE7', borderRadius: '12px', height: '44px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <HandCoins size={16} /> Collect Advance
                    </button>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ background: 'var(--color-navy)', borderRadius: '12px', height: '44px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Generate Invoice
                    </button>
                </div>
            </div>

            <div className="kpi-grid mb-10">
                {[
                    { label: 'Daily Flux', value: `₹${kpi.todayPaid.toLocaleString()}`, sub: 'Collected Today', icon: Activity, color: '#10B981' },
                    { label: 'Receivables', value: `₹${kpi.pending.toLocaleString()}`, sub: 'Aging Ledger', icon: Clock, color: '#F59E0B' },
                    { label: 'Advance Trust', value: `₹${kpi.advances.toLocaleString()}`, sub: 'Patient Deposits', icon: Wallet, color: '#0EA5E9' },
                    { label: 'Yield Velocity', value: `₹${(kpi.totalLife / 100000).toFixed(1)}L`, sub: 'Net Lifetime Revenue', icon: TrendingUp, color: '#8B5CF6' },
                ].map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="kpi-card shadow-premium" style={{ border: '1px solid #F1F5F9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} style={{ color: card.color }} strokeWidth={2.5} />
                                </div>
                                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--color-navy)', lineHeight: 1, marginBottom: '6px' }}>
                                {loading ? <Loader2 size={24} className="animate-spin text-slate-200" /> : card.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 400 }}>{card.sub}</div>
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
                                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
                                    <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Identifier</th>
                                    <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Payer Demographics</th>
                                    <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Dept Unit</th>
                                    <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Net Proceeds</th>
                                    <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Settlement</th>
                                    <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="6"><Skeleton height="20px" /></td></tr>) : filteredInvoices.map(inv => (
                                    <tr key={inv.id} className="registry-row">
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy)', fontFamily: 'monospace' }}>{inv.invoiceCode}</span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '14px' }}>{inv.patientName}</span>
                                                <span style={{ fontSize: '11px', color: '#94A3B8' }}>{inv.patientUhId || 'Walk-in'}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span className="badge badge-navy" style={{ fontSize: '10px', padding: '2px 8px' }}>{inv.serviceType}</span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>₹{inv.netAmount.toLocaleString()}</span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span className={`badge ${inv.status === 'Paid' ? 'badge-success' : inv.status === 'Pending' ? 'badge-warning' : 'badge-error'}`} style={{ padding: '4px 10px', fontSize: '11px' }}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                <button onClick={() => setPrintInvoice(inv)} className="btn btn-secondary btn-sm" style={{ height: '32px', fontSize: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', color: 'var(--color-navy)' }}>Audit</button>
                                                <button onClick={() => setPrintThermal(inv)} className="btn btn-secondary btn-sm" style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Receipt size={14} /></button>
                                                {inv.status === 'Paid' && <button onClick={() => setVoidInvoiceId(inv.id)} className="btn btn-secondary btn-sm" style={{ width: '32px', height: '32px', padding: 0, color: '#EF4444' }}><X size={14} /></button>}
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
                                    <tr key={adv.id} className="registry-row">
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy)', fontFamily: 'monospace' }}>{adv.receiptCode}</span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '14px' }}>{adv.patient?.firstName} {adv.patient?.lastName}</span>
                                                <span style={{ fontSize: '11px', color: '#94A3B8' }}>{adv.patient?.patientCode}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#10B981' }}>₹{adv.amount.toLocaleString()}</span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>{new Date(adv.createdAt).toLocaleDateString()}</span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>{adv.paymentMethod}</span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <button onClick={() => setPrintAdvance(adv)} className="btn btn-secondary btn-sm" style={{ height: '32px', fontSize: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0 12px' }}>Print</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Executive Modals */}
            {showAdvanceModal && (
                <div className="modal-overlay-executive">

                    <div className="modal-card-executive">
                        <div className="modal-header-executive">
                            <h3 className="modal-title-executive"><Wallet size={16} className="text-emerald-500" /> Capital Induction</h3>
                            <button onClick={() => setShowAdvanceModal(false)} style={{ border: 'none', background: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '20px' }}>×</button>
                        </div>
                        
                        <div style={{ padding: '20px' }}>
                            <form onSubmit={handleCreateAdvance} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ position: 'relative' }}>
                                    <label className="label-executive">Patient Account Locator</label>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                        <input 
                                            value={patientSearch} 
                                            onChange={e => { setPatientSearch(e.target.value); setSelectedPatient(null); }} 
                                            placeholder="Find by UHID or Name..." 
                                            className="form-control-executive"
                                            style={{ paddingLeft: '34px' }}
                                        />
                                    </div>
                                    {filteredPatients.length > 0 && !selectedPatient && (
                                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, marginTop: '4px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                                            {filteredPatients.map(p => (
                                                <div key={p.id} onClick={() => { setSelectedPatient(p); setPatientSearch(`${p.firstName} ${p.lastName} (${p.patientCode})`); }} style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9' }}>
                                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{p.firstName} {p.lastName}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748B' }}>{p.patientCode} • {p.phone || 'N/A'}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label className="label-executive">Principal Sum (₹)</label>
                                        <input 
                                            required 
                                            type="number" 
                                            value={advForm.amount} 
                                            onChange={e => setAdvForm({ ...advForm, amount: e.target.value })} 
                                            className="form-control-executive"
                                            style={{ fontSize: '16px', fontWeight: 600, color: '#10B981', textAlign: 'center' }}
                                            placeholder="0.00" 
                                        />
                                    </div>
                                    <div>
                                        <label className="label-executive">Transaction Mode</label>
                                        <select 
                                            value={advForm.paymentMethod} 
                                            onChange={e => setAdvForm({ ...advForm, paymentMethod: e.target.value })} 
                                            className="form-control-executive"
                                        >
                                            {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '12px', marginTop: '8px' }}>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowAdvanceModal(false)}
                                        className="btn-executive"
                                        style={{ background: '#fff', border: '1px solid #E2E8F0', color: '#64748B' }}
                                    >
                                        Abort
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={advanceSaving || !selectedPatient}
                                        className="btn-executive"
                                        style={{ background: 'var(--color-navy)', color: '#fff' }}
                                    >
                                        {advanceSaving ? <Loader2 size={16} className="animate-spin" /> : 'Commit Ledger Posting'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay-executive">
                    <div className="modal-card-executive" style={{ maxWidth: '520px' }}>
                        <div className="modal-header-executive">
                            <h3 className="modal-title-executive"><Receipt size={16} className="text-blue-500" /> Revenue Generation</h3>
                            <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '20px' }}>×</button>
                        </div>

                        <div style={{ padding: '20px' }}>
                            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ position: 'relative' }}>
                                    <label className="label-executive">Debtor Identity</label>
                                    {selectedPatient ? (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', bg: 'var(--color-navy)', background: '#0F172A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600 }}>
                                                    {selectedPatient.firstName[0]}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{selectedPatient.firstName} {selectedPatient.lastName}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748B' }}>{selectedPatient.patientCode}</div>
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => setSelectedPatient(null)} style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer' }}><X size={16} /></button>
                                        </div>
                                    ) : (
                                        <div style={{ position: 'relative' }}>
                                            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                            <input 
                                                value={patientSearch} 
                                                onChange={e => setPatientSearch(e.target.value)} 
                                                placeholder="Search Ledger Index..." 
                                                className="form-control-executive"
                                                style={{ paddingLeft: '34px' }}
                                            />
                                        </div>
                                    )}
                                    {filteredPatients.length > 0 && !selectedPatient && (
                                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, marginTop: '4px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                                            {filteredPatients.map(p => (
                                                <div key={p.id} onClick={() => { setSelectedPatient(p); setPatientSearch(`${p.firstName} ${p.lastName} (${p.patientCode})`); }} style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9' }}>
                                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{p.firstName} {p.lastName}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748B' }}>{p.patientCode}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label className="label-executive">Revenue Stream</label>
                                        <select 
                                            value={form.serviceType} 
                                            onChange={e => setForm({ ...form, serviceType: e.target.value })} 
                                            className="form-control-executive"
                                        >
                                            {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label-executive">Settlement Amount (₹)</label>
                                        <input 
                                            required 
                                            type="number" 
                                            value={form.amount} 
                                            onChange={e => setForm({ ...form, amount: e.target.value })} 
                                            className="form-control-executive"
                                            style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', textAlign: 'center' }}
                                            placeholder="0.00" 
                                        />
                                    </div>
                                </div>

                                {requirePin && (
                                    <div style={{ padding: '12px', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '8px' }}>
                                        <label className="label-executive" style={{ color: '#B91C1C', textAlign: 'center' }}>Managerial Override Authorization</label>
                                        <input 
                                            type="password" 
                                            value={managerPin} 
                                            onChange={e => setManagerPin(e.target.value)} 
                                            placeholder="••••" 
                                            className="form-control-executive"
                                            style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '8px', border: '1px solid #FCA5A5' }}
                                        />
                                    </div>
                                )}

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '12px', marginTop: '8px' }}>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModal(false)}
                                        className="btn-executive"
                                        style={{ background: '#fff', border: '1px solid #E2E8F0', color: '#64748B' }}
                                    >
                                        Dismiss
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={saving} 
                                        className="btn-executive"
                                        style={{ background: 'var(--color-navy)', color: '#fff' }}
                                    >
                                        {saving ? <Loader2 size={16} className="animate-spin" /> : 'Authorize & Emit Invoice'}
                                    </button>
                                </div>
                            </form>
                        </div>
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
