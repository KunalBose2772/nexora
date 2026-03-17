'use client';
import { useState, useEffect } from 'react';
import { Pill, Plus, Search, AlertTriangle, AlertCircle, ShoppingCart, Activity, RefreshCw, X, PackagePlus, ArrowDownToLine, Package, ArrowRightLeft, MoreVertical, FileText, FileCheck, Layers, Boxes, TrendingUp, History, Siren, Ghost, Monitor, LayoutDashboard, Database, LayoutTemplate, Zap, Loader2, IndianRupee, Receipt, Stethoscope, Clock } from 'lucide-react';
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

    const [form, setForm] = useState({ name: '', genericName: '', manufacturer: '', category: 'Tablet', batchNumber: '', expiryDate: '', mrp: '', costPrice: '', stock: '', minThreshold: '50' });
    const [saving, setSaving] = useState(false);

    const [receiveModal, setReceiveModal] = useState(null);
    const [receiveForm, setReceiveForm] = useState({ qtyToAdd: '', batchNumber: '', expiryDate: '', mrp: '', costPrice: '' });
    const [receiveSaving, setReceiveSaving] = useState(false);

    const [printBill, setPrintBill] = useState(null);
    const [printThermal, setPrintThermal] = useState(null);
    const [tan, setTan] = useState(null);

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

    useEffect(() => { fetchMedicines(); }, []);

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

    const filtered = medicines.filter(m => {
        const s = searchQuery.toLowerCase();
        const matchSearch = !s || m.name.toLowerCase().includes(s) || (m.genericName || '').toLowerCase().includes(s) || (m.manufacturer || '').toLowerCase().includes(s) || (m.drugCode || '').toLowerCase().includes(s);
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

    const openReceiveModal = (med) => {
        setReceiveModal(med);
        setReceiveForm({ qtyToAdd: '', batchNumber: med.batchNumber || '', expiryDate: med.expiryDate || '', mrp: med.mrp || '', costPrice: med.costPrice || '' });
    };

    return (
        <div className="fade-in pb-20">
            <style jsx>{`
                .stock-out-pulse { animation: stock-out-glow 2.5s infinite; }
                @keyframes stock-out-glow {
                    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                    70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
                .med-action-btn {
                    height: 38px;
                    padding: 0 16px;
                    border-radius: 10px;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>

            <div className="dashboard-header-row mb-10">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '52px', height: '52px', background: 'var(--color-navy)', color: '#fff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                        <Pill size={24} />
                    </div>
                    <div>
                        <h1 className="responsive-h1" style={{ margin: 0 }}>Pharmacy Desk</h1>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0', fontWeight: 500 }}>Precision drug management, stock audits, and clinical fulfillment.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons" style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={fetchMedicines} className="btn btn-secondary" style={{ background: '#fff', color: 'var(--color-navy)', borderRadius: '12px', height: '44px', padding: '0 20px' }}>
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} style={{ marginRight: '8px' }} /> Sync Inventory
                    </button>
                    <button onClick={() => { setShowDispenses(true); fetchDispensations(); }} className="btn btn-secondary" style={{ background: '#fff', color: 'var(--color-navy)', borderRadius: '12px', height: '44px', padding: '0 20px' }}>
                        <History size={16} style={{ marginRight: '8px' }} /> Bill Ledger
                    </button>
                    <Link href="/pharmacy/prescribe" className="btn btn-primary" style={{ background: 'var(--color-navy)', borderRadius: '12px', height: '44px', padding: '0 24px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={18} /> Dispense Hub
                    </Link>
                </div>
            </div>

            <div className="kpi-grid mb-10">
                {[
                    { label: 'Total SKUs', value: kpi.total, sub: 'Pharmacy Registry', icon: Boxes, color: '#0EA5E9' },
                    { label: 'Stock Risks', value: kpi.lowStock, sub: 'Requires Re-order', icon: ShoppingCart, color: '#EF4444' },
                    { label: 'Expiry Watch', value: kpi.expiring, sub: 'Near Expiry (90D)', icon: Clock, color: '#F59E0B' },
                    { label: 'Healthy Stock', value: kpi.total - kpi.lowStock, sub: 'Available Units', icon: Package, color: '#10B981' },
                ].map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="kpi-card shadow-premium" style={{ border: '1px solid #F1F5F9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} style={{ color: card.color }} strokeWidth={2} />
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

            <div className="card shadow-premium" style={{ padding: '0', overflow: 'hidden', border: '1px solid #F1F5F9' }}>
                <div style={{ padding: '24px', background: '#fff', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                        <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                            type="text" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            placeholder="Molecular registry search by Drug Name, Formula, or Batch..." 
                            style={{ width: '100%', padding: '12px 16px 12px 48px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', outline: 'none', fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }} 
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['All', 'Healthy', 'Low Stock', 'Expiring'].map(f => (
                            <button key={f} onClick={() => setFilterStatus(f)} style={{ height: '42px', padding: '0 16px', borderRadius: '10px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: filterStatus === f ? '1px solid var(--color-navy)' : '1px solid #E2E8F0', background: filterStatus === f ? 'var(--color-navy)' : '#fff', color: filterStatus === f ? '#fff' : '#94A3B8', transition: 'all 0.2s' }}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="responsive-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ paddingLeft: '24px' }}>Pharmaceutical Registry</th>
                                <th>Molecular Class</th>
                                <th>Batch & Lifecycle</th>
                                <th>Inventory Depth</th>
                                <th>State</th>
                                <th style={{ textAlign: 'right', paddingRight: '24px' }}>Logistics</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i}>
                                        <td colSpan="6" style={{ padding: '16px 24px' }}><Skeleton className="h-4 w-full" /></td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '80px 24px', textAlign: 'center' }}>
                                        <div style={{ color: '#94A3B8', fontSize: '14px', fontWeight: 600 }}>No molecular data detected in this segment.</div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((med) => {
                                    const { label, cls } = STOCK_STATUS(med.stock, med.minThreshold);
                                    const expWarn = EXPIRY_WARNING(med.expiryDate);
                                    return (
                                        <tr key={med.id} className="interactive-row">
                                            <td style={{ paddingLeft: '24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F1F5F9', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <FileText size={14} />
                                                    </div>
                                                    <div>
                                                        <div style={{ color: 'var(--color-navy)', fontWeight: 600, fontSize: '14px' }}>{med.name}</div>
                                                        <div style={{ color: '#94A3B8', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase' }}>{med.drugCode}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'inline-block', padding: '4px 8px', background: '#F1F5F9', color: '#64748B', borderRadius: '6px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' }}>{med.category}</div>
                                                <div style={{ color: '#94A3B8', fontSize: '11px', fontWeight: 500, marginTop: '2px' }}>{med.genericName || 'Formula Pending'}</div>
                                            </td>
                                            <td>
                                                <div style={{ color: 'var(--color-navy)', fontWeight: 500, fontSize: '13px', fontFamily: 'monospace' }}>Batch: {med.batchNumber || '—'}</div>
                                                <div style={{ color: expWarn ? '#EF4444' : '#94A3B8', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    {expWarn && <AlertTriangle size={10} />} Exp: {med.expiryDate || 'N/A'}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ color: 'var(--color-navy)', fontWeight: 800, fontSize: '15px' }}>{med.stock.toLocaleString()} <span style={{ fontSize: '10px', color: '#94A3B8' }}>Units</span></div>
                                                <div style={{ color: '#10B981', fontSize: '11px', fontWeight: 800, marginTop: '2px' }}>MRP: ₹{med.mrp}</div>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${cls === 'status-out' ? 'status-out stock-out-pulse' : cls === 'status-low' ? 'status-low' : 'status-healthy'}`} style={{ 
                                                    padding: '4px 10px', 
                                                    borderRadius: '8px', 
                                                    fontSize: '10px', 
                                                    fontWeight: 900, 
                                                    textTransform: 'uppercase',
                                                    background: cls === 'status-out' ? '#EF4444' : cls === 'status-low' ? '#FFF7ED' : '#F0FDF4',
                                                    color: cls === 'status-out' ? '#fff' : cls === 'status-low' ? '#F97316' : '#10B981',
                                                    border: 'none'
                                                }}>
                                                    {label}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => openReceiveModal(med)} className="med-action-btn" style={{ background: 'var(--color-navy)', color: '#fff', border: 'none' }}>
                                                        <Plus size={14} /> Replenish
                                                    </button>
                                                    <button className="btn-circle-secondary" style={{ width: '38px', height: '38px', background: '#F8FAFC', color: '#94A3B8', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Replenish Modal */}
            {receiveModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white rounded-[24px] w-full max-w-[500px] p-8 shadow-2xl animate-scale-up">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black text-navy-900">Induction Registry</h2>
                            <button onClick={() => setReceiveModal(null)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 transition-all"><X size={20} /></button>
                        </div>
                        <div className="p-5 bg-sky-50 border border-sky-100 rounded-[20px] flex gap-5 items-center mb-8">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm text-sky-500 flex items-center justify-center shrink-0"><Package size={28} /></div>
                            <div>
                                <div className="text-[16px] font-black text-navy-900 leading-tight">{receiveModal.name}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">CODE: {receiveModal.drugCode}</div>
                            </div>
                        </div>
                        <form onSubmit={handleReceiveStock} className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Stocking Units</label>
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
                                <button type="submit" disabled={receiveSaving} className="flex-2 px-8 py-4 bg-navy-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl shadow-slate-200 active:scale-95 transition-all">Induct Medicine</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDispenses && (
                <div className="fixed inset-0 z-[110] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-10">
                    <div className="bg-white rounded-[32px] w-full max-w-[900px] h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-navy-900">Dispensation Ledger</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Audit log of all processed pharmacy bills</p>
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
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.items.length} Units</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setPrintBill(d)} className="h-10 px-6 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">Audit Bill</button>
                                            <button onClick={() => setPrintThermal(d)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 shadow-sm"><IndianRupee size={18} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

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
