'use client';
import { useState, useEffect } from 'react';
import { IndianRupee, Plus, Trash2, ArrowLeft, Receipt, Wallet, User, Calendar, CreditCard, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function IPDLedgerPage() {
    const searchParams = useSearchParams();
    const [ipdId, setIpdId] = useState(searchParams.get('ipdId'));
    const [patientInfo, setPatientInfo] = useState(null);
    const [ledgerItems, setLedgerItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ipdPatients, setIpdPatients] = useState([]); // For selecting if no ID in URL
    
    // Quick Add Form
    const [form, setForm] = useState({ serviceName: 'Ward Bed Charge (General)', amount: '', type: 'IPDCharge' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async () => {
        if (!ipdId) {
            // If no patient selected, load list of admitted patients
            try {
                const res = await fetch('/api/ipd');
                if (res.ok) setIpdPatients((await res.json()).ipdPatients || []);
            } catch(e) {}
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // 1. Fetch patient summary from IPD API
            const ptRes = await fetch('/api/ipd');
            const ptData = await ptRes.json();
            const pt = ptData.ipdPatients?.find(p => p.id === ipdId);
            setPatientInfo(pt);

            // 2. Fetch ledger details
            const ledgerRes = await fetch(`/api/billing/ledger?ipdId=${ipdId}`);
            if (ledgerRes.ok) {
                const data = await ledgerRes.json();
                setLedgerItems(data.items || []);
            }
        } catch(e) {
            setError('Failed to load ledger data');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, [ipdId]);

    const addEntry = async (e) => {
        e.preventDefault();
        if (!ipdId || !form.amount) return;
        setSaving(true);
        try {
            const res = await fetch('/api/billing/ledger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, ipdId })
            });
            if (res.ok) {
                setForm({ ...form, amount: '' });
                fetchData();
                setError('');
            } else {
                const errData = await res.json();
                setError(errData.error || 'Failed to post entry');
            }
        } catch(e) {
            setError('Network error - check connection');
        } finally { setSaving(false); }
    };

    const deleteEntry = async (id) => {
        if (!confirm('Revert/Void this ledger entry?')) return;
        try {
            const res = await fetch(`/api/billing/ledger?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchData();
        } catch(e) {}
    };

    const totalCharges = ledgerItems.filter(i => i.type === 'IPDCharge').reduce((s, i) => s + parseFloat(i.admitNotes || 0), 0);
    const totalDeposits = ledgerItems.filter(i => i.type === 'IPDDeposit').reduce((s, i) => s + parseFloat(i.admitNotes || 0), 0);
    const netDues = totalCharges - totalDeposits;

    if (!ipdId) {
        return (
            <div className="fade-in max-w-4xl mx-auto py-10">
                <h1 className="text-3xl font-black text-slate-800 mb-6">Patient Ledger Selection</h1>
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="px-5 py-3 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Patient Name</th>
                                <th className="px-5 py-3 font-bold text-slate-500 uppercase text-[10px] tracking-widest">Ward/Bed</th>
                                <th className="px-5 py-3 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {ipdPatients.length === 0 ? <tr><td colSpan="3" className="p-10 text-center text-slate-400">No active admitted patients found.</td></tr> : null}
                            {ipdPatients.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50">
                                    <td className="px-5 py-4 font-bold text-slate-800">{p.patientName} <span className="text-slate-400 font-normal">({p.apptCode})</span></td>
                                    <td className="px-5 py-4 text-slate-500 font-medium">{p.ward} • {p.bed}</td>
                                    <td className="px-5 py-4 text-right">
                                        <button onClick={() => setIpdId(p.id)} className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700">Open Ledger</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in max-w-7xl mx-auto">
            <div className="dashboard-header-row mb-6">
                <div>
                    <Link href="/billing" className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-xs font-bold uppercase tracking-widest mb-2">
                        <ArrowLeft size={14} /> Back to Billing
                    </Link>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">IPD In-Patient Ledger</h1>
                    <p className="text-slate-500">Managing running bills and advance deposits for {patientInfo?.patientName || 'Loading...'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Patient Summary Card */}
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 border-l-4 border-l-blue-500">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><User size={24}/></div>
                            <div>
                                <h3 className="font-black text-slate-800 leading-tight">{patientInfo?.patientName}</h3>
                                <p className="text-[10px] font-mono text-slate-400">{patientInfo?.apptCode}</p>
                            </div>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex justify-between text-xs"><span className="text-slate-400 font-bold uppercase tracking-wider">Ward</span><span className="font-bold text-slate-700">{patientInfo?.ward}</span></div>
                            <div className="flex justify-between text-xs"><span className="text-slate-400 font-bold uppercase tracking-wider">Bed</span><span className="font-bold text-slate-700">{patientInfo?.bed}</span></div>
                            <div className="flex justify-between text-xs"><span className="text-slate-400 font-bold uppercase tracking-wider">D.O.A.</span><span className="font-bold text-slate-700">{patientInfo?.date}</span></div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-xl p-5 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-10"><IndianRupee size={120}/></div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 relative z-10 text-emerald-400">Amount Left (Net Due)</p>
                        <h2 className="text-3xl font-black relative z-10">₹{netDues.toLocaleString()}</h2>
                        <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between text-xs relative z-10">
                            <span>Deposits: ₹{totalDeposits.toLocaleString()}</span>
                            <span className="text-slate-300">Amount Used: ₹{totalCharges.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="p-1 px-3 bg-amber-50 border border-amber-200 rounded text-[10px] text-amber-700 leading-relaxed font-medium">
                        Charges accrued here will automatically populate the final "IPD Discharge Invoice".
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600 font-bold">
                            ⚠️ {error}
                        </div>
                    )}
                </div>

                {/* Ledger Listing & Posting */}
                <div className="md:col-span-3 space-y-6">
                    {/* Input Area */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Plus size={16} className="text-blue-500"/> Post New Entry</h4>
                        <form onSubmit={addEntry} className="flex flex-wrap gap-4 items-end">
                            <div className="flex-[2] min-w-[200px]">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Charge/Service Description</label>
                                <input required list="common-services" className="w-full text-sm p-2 border border-slate-300 rounded outline-none focus:border-blue-500 font-bold text-slate-700 bg-slate-50" value={form.serviceName} onChange={e=>setForm({...form, serviceName: e.target.value})} />
                                <datalist id="common-services">
                                    <option value="Ward Bed Charge (General)" />
                                    <option value="Ward Bed Charge (Semi-Private)" />
                                    <option value="ICU Day Charge" />
                                    <option value="Nursing Service Fee" />
                                    <option value="RMO Visit Charges" />
                                    <option value="Patient Meal Charge" />
                                    <option value="Advance Security Deposit" />
                                </datalist>
                            </div>
                            <div className="flex-1 min-w-[120px]">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Category</label>
                                <select className="w-full text-sm p-2 border border-slate-300 rounded outline-none bg-white font-bold text-slate-700" value={form.type} onChange={e=>setForm({...form, type: e.target.value})}>
                                    <option value="IPDCharge">Billable Charge (+)</option>
                                    <option value="IPDDeposit">Patient Deposit (-)</option>
                                </select>
                            </div>
                            <div className="flex-1 min-w-[100px]">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Amount (₹)</label>
                                <input required type="number" className="w-full text-sm p-2 border border-slate-300 rounded outline-none focus:border-blue-500 font-bold text-slate-700" value={form.amount} onChange={e=>setForm({...form, amount: e.target.value})} placeholder="0.00" />
                            </div>
                            <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-[38px] px-6 rounded shadow flex items-center transition-all disabled:opacity-50">
                                {saving ? <RefreshCw size={16} className="animate-spin"/> : 'Commit to Ledger'}
                            </button>
                        </form>
                    </div>

                    {/* Master Ledger Table */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                            <span className="flex items-center gap-2"><Receipt size={18} className="text-slate-500"/> Itemized Running Bill</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest">{ledgerItems.length} Entries Recorded</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-white border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-5 py-3">Date & Time</th>
                                        <th className="px-5 py-3 text-center">Reference</th>
                                        <th className="px-5 py-3">Service / Description</th>
                                        <th className="px-5 py-3 text-right">Debit (+)</th>
                                        <th className="px-5 py-3 text-right">Credit (-)</th>
                                        <th className="px-5 py-3 text-right">Audit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? <tr><td colSpan="6" className="py-10 text-center text-slate-400">Syncing Ledger...</td></tr> : null}
                                    {!loading && ledgerItems.length === 0 ? <tr><td colSpan="6" className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-400">
                                            <Wallet size={48} strokeWidth={1} />
                                            <p className="font-medium italic">Ledger is empty. No charges or deposits posted yet.</p>
                                        </div>
                                    </td></tr> : null}

                                    {ledgerItems.map(item => {
                                        const isDeposit = item.type === 'IPDDeposit';
                                        const amt = parseFloat(item.admitNotes || 0).toLocaleString();

                                        return (
                                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-5 py-4">
                                                    <div className="font-bold text-slate-800 flex items-center gap-2 text-xs"><Clock size={12} className="text-slate-300"/> {item.time}</div>
                                                    <div className="text-[10px] text-slate-400">{item.date}</div>
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <span className="font-mono text-[11px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{item.apptCode}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className={`font-bold text-sm ${isDeposit ? 'text-emerald-700' : 'text-slate-800'}`}>{isDeposit ? 'Advance Deposit' : item.patientName}</div>
                                                    <div className="text-[10px] text-slate-400">System generated posting</div>
                                                </td>
                                                <td className="px-5 py-4 text-right font-bold text-slate-800">
                                                    {!isDeposit && `₹${amt}`}
                                                </td>
                                                <td className="px-5 py-4 text-right font-bold text-emerald-600">
                                                    {isDeposit && `₹${amt}`}
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <button onClick={()=>deleteEntry(item.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
