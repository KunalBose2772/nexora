'use client';
import { useState, useEffect } from 'react';
import { Safe, IndianRupee, Wallet, CreditCard, AlertCircle, CheckCircle2, RefreshCw, LogOut, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ShiftHandoverPage() {
    const [stats, setStats] = useState({ expectedCash: 0, digitalCash: 0, totalTransactions: 0 });
    const [declaredCash, setDeclaredCash] = useState('');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [closed, setClosed] = useState(false);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/billing/handover');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const expectedCashValue = stats.expectedCash || 0;
    const declaredCashValue = parseFloat(declaredCash) || 0;
    const variance = declaredCashValue - expectedCashValue;

    const handleClosure = async () => {
        if (!declaredCash) return alert('Please enter physical cash count');
        if (!confirm('Are you sure you want to close this shift? This action is permanent.')) return;

        setProcessing(true);
        try {
            const res = await fetch('/api/billing/handover', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    expectedCash: expectedCashValue,
                    declaredCash: declaredCashValue,
                    variance: variance
                })
            });

            if (res.ok) {
                setClosed(true);
            }
        } catch (e) {
            alert('Failed to close shift');
        } finally {
            setProcessing(false);
        }
    };

    if (closed) {
        return (
            <div className="fade-in max-w-2xl mx-auto py-20 text-center">
                <div className="bg-emerald-100 text-emerald-700 p-8 rounded-full inline-block mb-6 shadow-inner ring-8 ring-emerald-50">
                    <CheckCircle2 size={64} />
                </div>
                <h1 className="text-3xl font-black text-slate-800 mb-2">Shift Successfully Closed</h1>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">The handover data has been sent to the finance manager audit trail. Your session's calculated cash balance is now verified.</p>
                
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-10 text-left divide-y divide-slate-100">
                    <div className="flex justify-between py-2"><span className="text-slate-500">System Cash:</span> <span className="font-bold">₹{expectedCashValue.toLocaleString()}</span></div>
                    <div className="flex justify-between py-2"><span className="text-slate-500">Declared Cash:</span> <span className="font-bold">₹{declaredCashValue.toLocaleString()}</span></div>
                    <div className="flex justify-between py-2 font-black"><span className="text-slate-500">Variance:</span> <span className={variance < 0 ? 'text-red-600' : 'text-emerald-600'}>₹{variance.toLocaleString()}</span></div>
                </div>

                <Link href="/billing" className="btn btn-primary px-8 py-3 rounded-full flex items-center justify-center gap-2 mx-auto w-fit">
                    Return to Billing Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="fade-in max-w-6xl mx-auto">
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <Link href="/billing" className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm font-bold uppercase tracking-widest mb-2 transition-colors">
                        <ArrowLeft size={14} /> Back to Billing
                    </Link>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Shift End Handover</h1>
                    <p className="text-slate-500">Verify your cash drawer balance before handing over to the next shift cashier.</p>
                </div>
                <button onClick={fetchStats} className="btn-secondary rounded-full p-3 bg-white border border-slate-200 shadow-sm transition-all active:rotate-180">
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Financial Ledger Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="bg-slate-800 p-5 flex justify-between items-center">
                            <h3 className="text-white font-bold flex items-center gap-2"><Wallet size={18} className="text-blue-400" /> System Calculated Totals</h3>
                            <span className="bg-blue-600 text-[10px] font-black px-2 py-0.5 rounded text-white tracking-widest uppercase">Live Read</span>
                        </div>
                        
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Expected Physical Cash</p>
                                    {loading ? <div className="h-10 w-32 bg-slate-100 animate-pulse rounded"></div> : (
                                        <div className="text-4xl font-black text-slate-800">₹{expectedCashValue.toLocaleString()}</div>
                                    )}
                                    <p className="text-[11px] text-slate-400">Total collected via Cash method</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Digital Settlements</p>
                                    {loading ? <div className="h-10 w-32 bg-slate-100 animate-pulse rounded"></div> : (
                                        <div className="text-4xl font-black text-slate-600">₹{stats.digitalCash.toLocaleString()}</div>
                                    )}
                                    <p className="text-[11px] text-slate-400">Card, UPI, TPA (Non-drawer)</p>
                                </div>
                            </div>

                            <div className="mt-10 border-t border-slate-100 pt-8 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-50 text-blue-600 p-3 rounded-xl border border-blue-100"><CreditCard size={24}/></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{stats.totalTransactions} Transactions Processed</p>
                                        <p className="text-xs text-slate-500">Since last system zeroing / shift start</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                        <AlertCircle className="text-amber-500 shrink-0 mt-1" size={24} />
                        <div>
                            <h4 className="font-bold text-amber-900 mb-1 leading-none">Security Policy Reminder</h4>
                            <p className="text-sm text-amber-800 leading-relaxed">
                                Variances exceeding **₹500** will be automatically flagged for Forensic Billing Audit. Please ensure you have physically counted and double-verified the currency in your drawer before committing.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Input Logic */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8 h-fit ring-4 ring-slate-50">
                    <h3 className="font-black text-xl text-slate-800 mb-6 flex items-center gap-2">Handover Input</h3>
                    
                    <div className="space-y-5 mb-8">
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Physical Cash Count (₹)</label>
                            <input 
                                type="number" 
                                placeholder="0.00" 
                                className="w-full text-2xl font-black p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300"
                                value={declaredCash}
                                onChange={e => setDeclaredCash(e.target.value)}
                            />
                        </div>

                        <div className="pt-4 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium">System Ledger:</span>
                                <span className="font-bold text-slate-800">₹{expectedCashValue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                                <span className="text-slate-500 font-medium">Variance:</span>
                                <span className={`text-lg font-black ${variance === 0 ? 'text-slate-400' : variance < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                    {variance > 0 ? '+' : ''}₹{variance.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button 
                        disabled={processing || !declaredCash}
                        onClick={handleClosure}
                        className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100"
                    >
                        {processing ? 'Closing Shift...' : <><LogOut size={18}/> Finalize & Close Shift</>}
                    </button>
                    
                    <p className="mt-4 text-[10px] text-center text-slate-400 italic">
                        By clicking above, you certify that the physical drawer count matches the declared value.
                    </p>
                </div>
            </div>
        </div>
    );
}
