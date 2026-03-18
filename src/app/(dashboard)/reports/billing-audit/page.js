'use client';
import { useState, useEffect } from 'react';
import { ShieldAlert, IndianRupee, TrendingDown, Trash2, Calendar, FileWarning, CheckCircle, BarChart3, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BillingAuditPage() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/billing/invoices');
            if (res.ok) {
                const data = await res.json();
                setInvoices(data.invoices || []);
            }
        } catch(e) {} finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    // Audit Analytics
    const exceptions = invoices.filter(inv => {
        const isException = inv.discount > 5 || inv.status === 'Cancelled' || inv.status === 'Voided';
        if (!isException) return false;
        
        const query = search.toLowerCase();
        return !query || 
               inv.invoiceCode.toLowerCase().includes(query) || 
               inv.patientName.toLowerCase().includes(query) ||
               (inv.notes || '').toLowerCase().includes(query);
    });
    const totalDiscountsGiven = invoices.reduce((s, inv) => s + (inv.amount * (inv.discount / 100)), 0);
    const totalVoids = invoices.filter(inv => inv.status === 'Cancelled').length;
    const highValueOverrides = invoices.filter(inv => inv.discount > 5).length;

    return (
        <div className="fade-in max-w-7xl mx-auto">
            <div className="dashboard-header-row mb-8">
                <div>
                    <h1 className="page-header__title flex items-center gap-3"><ShieldAlert className="text-red-600" size={32}/> Forensic Billing Audit</h1>
                    <p className="page-header__subtitle">Internal control dashboard monitoring financial exceptions, overrides, and voided revenue.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <Link href="/reports" className="btn btn-secondary btn-sm flex items-center gap-2 bg-white"><ArrowLeft size={16}/> Back to Reports</Link>
                </div>
            </div>

            {/* Audit KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="stat-card p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <div className="bg-red-50 text-red-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4"><TrendingDown size={20}/></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Revenue Leakage (Voids)</p>
                    <h3 className="text-2xl font-black text-slate-800">{totalVoids} Invoices</h3>
                </div>
                <div className="stat-card p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <div className="bg-amber-50 text-amber-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4"><ShieldAlert size={20}/></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Discount Overrides</p>
                    <h3 className="text-2xl font-black text-slate-800">{highValueOverrides} Instances</h3>
                </div>
                <div className="stat-card p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <div className="bg-blue-50 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4"><IndianRupee size={20}/></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Discount Vol.</p>
                    <h3 className="text-2xl font-black text-slate-800">₹{totalDiscountsGiven.toLocaleString()}</h3>
                </div>
                <div className="stat-card p-6 bg-slate-900 text-white border border-slate-800 rounded-2xl shadow-xl">
                    <div className="bg-slate-800 text-blue-400 w-10 h-10 rounded-xl flex items-center justify-center mb-4"><BarChart3 size={20}/></div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Audit Coverage</p>
                    <h3 className="text-2xl font-black">{invoices.length} Total Bills</h3>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
                    <h3 className="font-black text-slate-800 flex items-center gap-2 text-sm uppercase tracking-widest"><FileWarning size={18} className="text-red-500"/> Critical Exceptions</h3>
                    <div className="relative min-w-[300px]">
                        <input 
                            type="text" 
                            placeholder="Search Exceptions by Code or Patient..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-4 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-red-500 transition-all shadow-sm"
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Invoice No</th>
                                <th className="px-6 py-4">Patient Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4 text-center">Exception</th>
                                <th className="px-6 py-4">Audit Trail / Notes</th>
                                <th className="px-6 py-4 text-right">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? <tr><td colSpan="7" className="py-20 text-center text-slate-500 italic">Performing Forensic Scan...</td></tr> : null}
                            {exceptions.length === 0 && !loading ? <tr><td colSpan="7" className="py-20 text-center text-slate-400"><CheckCircle size={48} className="mx-auto mb-4 opacity-20 text-emerald-500"/><p className="font-bold">No Exceptions Found</p><p className="text-xs">All financial transactions are within standard operational thresholds.</p></td></tr> : null}
                            
                            {exceptions.map(inv => {
                                const isVoid = inv.status === 'Cancelled' || inv.status === 'Voided';
                                const isHighDiscount = inv.discount > 5;
                                
                                return (
                                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-5 font-medium text-slate-500 font-mono text-xs">{new Date(inv.createdAt).toLocaleString()}</td>
                                        <td className="px-6 py-5 font-black text-slate-800 font-mono">{inv.invoiceCode}</td>
                                        <td className="px-6 py-5 font-bold text-slate-700">{inv.patientName}</td>
                                        <td className="px-6 py-5"><span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase">{inv.serviceType}</span></td>
                                        <td className="px-6 py-5 text-center">
                                            {isVoid && <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-[10px] font-black tracking-tighter">REVENUE VOID</span>}
                                            {isHighDiscount && <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[10px] font-black tracking-tighter">MANAGER OVERRIDE</span>}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="max-w-xs text-xs text-slate-600 italic whitespace-normal leading-relaxed">
                                                {inv.notes || 'No audit notes provided.'}
                                                {isHighDiscount && !(inv.notes || '').includes('Audit:') && <span className="block mt-1 text-red-500 font-bold uppercase text-[9px]">Missing Audit Log!</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className={`font-black text-sm ${isVoid ? 'text-slate-400 line-through' : 'text-slate-900'}`}>₹{inv.netAmount.toLocaleString()}</div>
                                            {isHighDiscount && <div className="text-[9px] text-amber-600 font-bold">-{inv.discount}% Applied</div>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
                <BarChart3 className="text-blue-500 shrink-0" size={24}/>
                <div>
                    <h4 className="font-black text-blue-900 mb-1 leading-none uppercase text-xs tracking-widest">Auditor Guidelines</h4>
                    <p className="text-xs text-blue-800 leading-relaxed mt-2">
                        Financial exceptions are calculated based on the Nexora RCM Policy (v4.1). Manager Overrides are strictly tracked by a 4-digit security PIN. Any un-annotated voids should be cross-referenced with the shift cashier handover report.
                    </p>
                </div>
            </div>
        </div>
    );
}
