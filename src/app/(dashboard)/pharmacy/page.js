'use client';
import { useState, useEffect } from 'react';
import { Pill, Plus, Search, AlertTriangle, AlertCircle, ShoppingCart, Activity, RefreshCw, X, PackagePlus, ArrowDownToLine, Package, ArrowRightLeft, MoreVertical, FileText, FileCheck, Layers, Boxes, TrendingUp, History, Siren, Ghost, Monitor, LayoutDashboard, Database, LayoutTemplate, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Skeleton from '@/components/common/Skeleton';
import PrintWrapper from '@/components/print/PrintWrapper';
import PrintHeader from '@/components/print/PrintHeader';
import PrintFooter from '@/components/print/PrintFooter';
import ThermalReceipt from '@/components/print/ThermalReceipt';

const STOCK_STATUS = (stock, min) => {
    if (stock === 0) return { label: 'Stock-Out', cls: 'status-out' };
    if (stock < min) return { label: 'Re-Order', cls: 'status-low' };
    return { label: 'Healthy', cls: 'status-healthy' };
};

const EXPIRY_WARNING = (expiryDate) => {
    if (!expiryDate) return false;
    const exp = new Date(expiryDate);
    const now = new Date();
    const diff = (exp - now) / (1000 * 60 * 60 * 24);
    return diff <= 90;
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

    const [showAdjustHistory, setShowAdjustHistory] = useState(false);
    const [adjustments, setAdjustments] = useState([]);
    const [loadingAdjustments, setLoadingAdjustments] = useState(false);

    const [form, setForm] = useState({ name: '', genericName: '', manufacturer: '', category: 'Tablet', batchNumber: '', expiryDate: '', mrp: '', costPrice: '', stock: '', minThreshold: '50' });
    const [saving, setSaving] = useState(false);

    const [receiveModal, setReceiveModal] = useState(null);
    const [receiveForm, setReceiveForm] = useState({ qtyToAdd: '', batchNumber: '', expiryDate: '', mrp: '', costPrice: '' });
    const [receiveSaving, setReceiveSaving] = useState(false);

    const [printBill, setPrintBill] = useState(null);
    const [printThermal, setPrintThermal] = useState(null);
    const [tan, setTan] = useState(null);

    const [adjustModal, setAdjustModal] = useState(null);
    const [adjustForm, setAdjustForm] = useState({ type: 'Damaged', quantity: '', notes: '', adjustmentPrice: '' });
    const [adjustSaving, setAdjustSaving] = useState(false);

    const fetchMedicines = async () => {
        setLoading(true);
        try {
            const [mRes, tRes] = await Promise.all([
                fetch('/api/pharmacy/medicines'),
                fetch('/api/settings')
            ]);
            if (mRes.ok) setMedicines((await mRes.json()).medicines || []);
            if (tRes.ok) setTan((await tRes.json()).tenant);
        } catch (err) { }
        finally { setLoading(false); }
    };

    const fetchDispensations = async () => {
        setLoadingDispenses(true);
        try {
            const res = await fetch('/api/pharmacy/dispense');
            if (res.ok) {
                const data = await res.json();
                setDispensations(data.dispensations || []);
            }
        } catch (err) { }
        finally { setLoadingDispenses(false); }
    };

    const fetchAdjustments = async () => {
        setLoadingAdjustments(true);
        try {
            const res = await fetch('/api/pharmacy/stock-adjustments');
            if (res.ok) {
                const data = await res.json();
                setAdjustments(data.adjustments || []);
            }
        } catch (err) { }
        finally { setLoadingAdjustments(false); }
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
                setShowAddModal(false);
            }
        } finally { setSaving(false); }
    };

    const openReceiveModal = (med) => {
        setReceiveModal(med);
        setReceiveForm({ qtyToAdd: '', batchNumber: med.batchNumber || '', expiryDate: med.expiryDate || '', mrp: med.mrp || '', costPrice: med.costPrice || '' });
    };

    const handleReceiveStock = async (e) => {
        e.preventDefault();
        if (!receiveModal) return;
        setReceiveSaving(true);
        try {
            const res = await fetch('/api/pharmacy/medicines', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: receiveModal.id,
                    mode: 'receive',
                    qtyToAdd: parseInt(receiveForm.qtyToAdd),
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
            }
        } finally { setReceiveSaving(false); }
    };

    const handlePostAdjustment = async (e) => {
        e.preventDefault();
        if (!adjustModal || !adjustForm.quantity) return;
        setAdjustSaving(true);
        try {
            const res = await fetch('/api/pharmacy/stock-adjustments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    medicineId: adjustModal.id,
                    ...adjustForm
                })
            });
            if (res.ok) {
                setMedicines(prev => prev.map(m => m.id === adjustModal.id ? { ...m, stock: m.stock - parseInt(adjustForm.quantity) } : m));
                setAdjustModal(null);
            }
        } finally { setAdjustSaving(false); }
    };

    const filtered = medicines.filter(m => {
        const s = searchQuery.toLowerCase();
        const matchSearch = !s || m.name.toLowerCase().includes(s) || (m.genericName || '').toLowerCase().includes(s) || (m.manufacturer || '').toLowerCase().includes(s) || m.drugCode.toLowerCase().includes(s);
        const statusLabel = STOCK_STATUS(m.stock, m.minThreshold).label;
        const matchStatus = filterStatus === 'All' || (filterStatus === 'Low Stock' && (statusLabel === 'Re-Order' || statusLabel === 'Stock-Out')) || (filterStatus === 'Expiring' && EXPIRY_WARNING(m.expiryDate)) || (filterStatus === 'Healthy' && statusLabel === 'Healthy');
        return matchSearch && matchStatus;
    });

    const kpi = {
        total: medicines.length,
        lowStock: medicines.filter(m => m.stock < m.minThreshold).length,
        expiring: medicines.filter(m => EXPIRY_WARNING(m.expiryDate)).length,
        outOfStock: medicines.filter(m => m.stock === 0).length,
    };

    return (
        <div className="fade-in pb-12">
            <style jsx>{`
                .kpi-card {
                    background: #fff;
                    border: 1px solid var(--color-border-light);
                    border-radius: 20px;
                    padding: 24px;
                    transition: all 0.3s ease;
                }
                .status-badge {
                    padding: 4px 10px;
                    border-radius: 8px;
                    font-size: 10px;
                    font-weight: 901;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .status-healthy { background: #F0FDF4; color: #10B981; border: 1px solid #DCFCE7; }
                .status-low { background: #FFF7ED; color: #F97316; border: 1px solid #FFEDD5; }
                .status-out { background: #FEF2F2; color: #EF4444; border: 1px solid #FEE2E2; }
            `}</style>

            <div className="dashboard-header-row mb-8">
                <div>
                    <h1 className="responsive-h1">
                        Clinical Pharmacy Operations
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>Precision drug registry, pharmaceutical logistics, and prescription fulfillment.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button onClick={fetchMedicines} className="btn btn-secondary btn-sm h-11 px-6 bg-white shadow-sm border-slate-200 text-slate-600">
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync Store
                    </button>
                    <button onClick={() => { setShowDispenses(true); fetchDispensations(); }} className="btn btn-secondary btn-sm h-11 px-6 bg-white text-navy-900 border-slate-200">
                        <History size={14} /> Bills
                    </button>
                    <button onClick={() => setShowAddModal(true)} className="btn btn-secondary btn-sm h-11 px-6 bg-white text-emerald-600 border-emerald-100">
                        <PackagePlus size={14} /> Drug Registry
                    </button>
                    <Link href="/pharmacy/prescribe" className="btn btn-primary btn-sm h-11 px-8 flex items-center gap-2" style={{ textDecoration: 'none' }}>
                        <Zap size={14} /> Dispense
                    </Link>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="kpi-grid" style={{ marginBottom: '28px' }}>
                {[
                    { label: 'Store Volume', value: kpi.total, sub: 'Total SKUs', icon: Boxes, color: '#10B981' },
                    { label: 'Availability Risk', value: kpi.lowStock, sub: 'Critical low', icon: AlertTriangle, color: '#EF4444' },
                    { label: 'Stability Watch', value: kpi.expiring, sub: 'Near Expiry', icon: Clock, color: '#F59E0B' },
                    { label: 'Daily Flux', value: 84, sub: 'Dispensed', icon: Activity, color: '#0EA5E9' },
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

            <div className="card shadow-2xl shadow-slate-200/40">
                <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-1 min-w-[320px]">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search Molecular Registry by Drug Name, Batch or Code..." className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-cyan-500 transition-all shadow-sm" />
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Healthy', 'Low Stock', 'Expiring'].map(f => (
                            <button key={f} onClick={() => setFilterStatus(f)} className={`h-11 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === f ? 'bg-navy-900 text-white shadow-xl' : 'bg-white border border-slate-200 text-slate-400'}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="data-table-wrapper border-none">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Drug & Demographics</th>
                                <th>Category / Class</th>
                                <th>Batch / Lifecycle</th>
                                <th>Inventory Depth</th>
                                <th>State</th>
                                <th style={{ textAlign: 'right' }}>Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="6"><Skeleton height="20px" /></td></tr>) : filtered.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-24 text-slate-300 font-bold uppercase tracking-widest text-xs">No molecular data detected</td></tr>
                            ) : filtered.map(med => {
                                const { label, cls } = STOCK_STATUS(med.stock, med.minThreshold);
                                const expWarn = EXPIRY_WARNING(med.expiryDate);
                                return (
                                    <tr key={med.id} className="hover:bg-slate-50 transition-all">
                                        <td>
                                            <div className="text-[14px] font-black text-navy-900">{med.name}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tight">{med.genericName || 'Formula Pending'} · {med.drugCode}</div>
                                        </td>
                                        <td>
                                            <div className="text-[10px] font-black uppercase py-1 px-2 rounded-lg bg-slate-100 text-slate-600 inline-block">{med.category}</div>
                                            <div className="text-[10px] font-bold text-slate-400 truncate max-w-[120px] mt-1 uppercase">{med.manufacturer || 'Global Generic'}</div>
                                        </td>
                                        <td>
                                            <div className="text-[13px] font-black text-navy-900 font-mono italic tracking-tighter">{med.batchNumber || '—'}</div>
                                            <div className={`text-[10px] font-black uppercase mt-1 ${expWarn ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                                                {expWarn ? 'EXPIRING: ' : 'EXP: '}{med.expiryDate || 'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-[15px] font-black text-navy-900">{med.stock.toLocaleString()} <span className="text-[10px] font-bold text-slate-400">UNITS</span></div>
                                            <div className="text-[10px] font-bold text-emerald-600 mt-1 uppercase">MRP: ₹{med.mrp}</div>
                                        </td>
                                        <td><span className={`status-badge ${cls}`}>{label}</span></td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => setAdjustModal(med)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-600 border border-transparent hover:border-red-100"><AlertTriangle size={16} /></button>
                                                <button onClick={() => openReceiveModal(med)} className="h-9 px-4 rounded-lg bg-navy-900 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-navy-200">Replenish</button>
                                                <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400"><MoreVertical size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals Refactored */}
            {receiveModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white rounded-[24px] w-full max-w-[500px] p-8 shadow-2xl animate-scale-up">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black text-navy-900">Capital Induction</h2>
                            <button onClick={() => setReceiveModal(null)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 transition-all"><X size={20} /></button>
                        </div>
                        <div className="p-5 bg-sky-50 border border-sky-100 rounded-[20px] flex gap-5 items-center mb-8">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm text-sky-500 flex items-center justify-center shrink-0"><Package size={28} /></div>
                            <div>
                                <div className="text-[16px] font-black text-navy-900 leading-tight">{receiveModal.name}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Registry: {receiveModal.drugCode}</div>
                            </div>
                        </div>
                        <form onSubmit={handleReceiveStock} className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Induction Units</label>
                                <input required autoFocus type="number" min="1" value={receiveForm.qtyToAdd} onChange={e => setReceiveForm({ ...receiveForm, qtyToAdd: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-2xl text-navy-900 focus:border-sky-500 outline-none transition-all placeholder:text-slate-200" placeholder="000" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Batch Trace</label>
                                    <input value={receiveForm.batchNumber} onChange={e => setReceiveForm({ ...receiveForm, batchNumber: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Expiry Gate</label>
                                    <input type="date" value={receiveForm.expiryDate} onChange={e => setReceiveForm({ ...receiveForm, expiryDate: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs" />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setReceiveModal(null)} className="flex-1 py-4 bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-xl">Abort</button>
                                <button type="submit" disabled={receiveSaving} className="flex-2 px-8 py-4 bg-navy-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl shadow-slate-200 active:scale-95 transition-all">Preserve to Registry</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bil History / Dispenses Modal */}
            {showDispenses && (
                <div className="fixed inset-0 z-[110] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-10">
                    <div className="bg-white rounded-[32px] w-full max-w-[900px] h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-navy-900">Dispensation Ledger</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Complete historical bill registry for pharmacy unit</p>
                            </div>
                            <button onClick={() => setShowDispenses(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-white text-slate-400 transition-all shadow-sm border border-transparent hover:border-slate-100"><X size={24} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-10 space-y-4">
                            {loadingDispenses ? <Skeleton count={5} height="80px" /> : dispensations.map(d => (
                                <div key={d.id} className="p-6 rounded-[24px] border border-slate-100 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all flex justify-between items-center group bg-white">
                                    <div className="flex gap-6 items-center">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all"><FileText size={20} /></div>
                                        <div>
                                            <div className="text-[14px] font-black text-navy-900 font-mono tracking-tighter">{d.billCode}</div>
                                            <div className="text-[14px] font-black text-slate-600 mt-0.5">{d.patientName}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">{new Date(d.createdAt).toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-8 items-center">
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-emerald-600">₹{d.netAmount.toFixed(2)}</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.items.length} Molecular Units</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setPrintBill(d)} className="h-10 px-6 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">Audit A4</button>
                                            <button onClick={() => setPrintThermal(d)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 shadow-sm"><Receipt size={18} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Overlays / Prints (Refactored to match) */}
            {printBill && (
                <div className="fixed inset-0 z-[150] bg-slate-900/80 backdrop-blur-sm p-10 flex items-center justify-center animate-fade-in">
                    <div className="bg-white rounded-[32px] w-full max-w-[850px] shadow-2xl overflow-hidden flex flex-col h-[90vh]">
                        <div className="flex-1 overflow-y-auto">
                            <PrintWrapper documentTitle={printBill.billCode}>
                                <div className="p-16 font-sans text-slate-900">
                                    <PrintHeader title="PHARMACY DISPENSATION" subtitle={printBill.billCode} />
                                    <div className="flex justify-between items-end mb-12 border-b-4 border-slate-900 pb-12">
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Counterparty Subject</div>
                                            <div className="text-2xl font-black text-navy-900">{printBill.patientName}</div>
                                            <div className="text-xs font-bold text-slate-500 uppercase mt-1">UHID: {printBill.patientUhId || 'TRANS-GUEST'}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Settled Net Value</div>
                                            <div className="text-5xl font-black text-navy-900">₹{printBill.netAmount.toFixed(2)}</div>
                                            <div className="text-xs font-bold text-slate-500 uppercase mt-3">{new Date(printBill.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <table className="w-full mb-16">
                                        <thead><tr className="border-b-2 border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left"><th className="py-4">Unit Description</th><th className="py-4 text-center">Qty</th><th className="py-4 text-right">Unit Rate</th><th className="py-4 text-right">Extended</th></tr></thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {printBill.items.map(item => (
                                                <tr key={item.id} className="text-sm font-black">
                                                    <td className="py-6">{item.medicine.name}</td>
                                                    <td className="py-6 text-center">{item.quantity}</td>
                                                    <td className="py-6 text-right text-slate-500">₹{item.unitPrice.toFixed(2)}</td>
                                                    <td className="py-6 text-right">₹{(item.unitPrice * item.quantity).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="border-t-4 border-slate-900"><td colSpan={3} className="py-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Sum Verified</td><td className="py-8 text-right font-black text-3xl">₹{printBill.netAmount.toFixed(2)}</td></tr>
                                        </tfoot>
                                    </table>
                                    <PrintFooter systemId={printBill.id} />
                                </div>
                            </PrintWrapper>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 text-right"><button onClick={() => setPrintBill(null)} className="h-12 px-10 rounded-xl bg-white border border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest shadow-sm">Dismiss Bill</button></div>
                    </div>
                </div>
            )}

            {printThermal && (
                <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6">
                    <ThermalReceipt invoice={{ ...printThermal, invoiceCode: printThermal.billCode }} tenant={tan} />
                    <button onClick={() => setPrintThermal(null)} className="mt-8 h-14 px-12 rounded-full bg-white text-navy-900 font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:scale-110 active:scale-95 transition-all">Destroy Preview</button>
                </div>
            )}
        </div>
    );
}
