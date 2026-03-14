'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Plus, FileText, CheckCircle, Clock, AlertCircle, TrendingUp, Search } from 'lucide-react';

export default function TPAPage() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // New Pre-Auth Form
    const [formData, setFormData] = useState({
        patientName: '',
        insuranceProvider: '',
        policyNumber: '',
        diagnosis: '',
        estimatedAmount: ''
    });

    const [creating, setCreating] = useState(false);

    const fetchClaims = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/billing/tpa');
            const data = await res.json();
            setClaims(data.claims || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchClaims(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await fetch('/api/billing/tpa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('TPA Pre-Authorization Request submitted to workflow successfully.');
                setShowModal(false);
                setFormData({ patientName: '', insuranceProvider: '', policyNumber: '', diagnosis: '', estimatedAmount: '' });
                fetchClaims(); // Refresh list
            } else {
                alert('Submit failed');
            }
        } catch (err) {
            alert('Error');
        } finally {
            setCreating(false);
        }
    };

    // Calculate Claim Stats
    const totalClaims = claims.length;
    const pendingAmount = claims.filter(c => c.status === 'Unpaid').reduce((sum, c) => sum + c.netPayable, 0);
    const approvedAmount = claims.filter(c => c.status === 'Paid').reduce((sum, c) => sum + c.netPayable, 0);

    return (
        <div className="fade-in">
            <div className="dashboard-header-row mb-6">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>TPA & Insurance Claims</h1>
                    <p className="page-header__subtitle">Manage health insurance pre-authorizations, co-pays, and claim settlements.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm flex items-center gap-2">
                        <Plus size={16} /> New Pre-Auth Request
                    </button>
                </div>
            </div>

            {/* Insurance Stats Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="stat-card p-5 border-l-4 border-blue-500 rounded-lg bg-white shadow-sm flex items-center">
                    <div className="flex-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Active Claims</p>
                        <h3 className="text-2xl font-bold text-slate-800">{totalClaims} Processed</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                        <FileText size={20} />
                    </div>
                </div>

                <div className="stat-card p-5 border-l-4 border-amber-500 rounded-lg bg-white shadow-sm flex items-center">
                    <div className="flex-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Awaiting Settlement</p>
                        <h3 className="text-2xl font-bold text-amber-600">₹{pendingAmount.toLocaleString('en-IN')}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                        <Clock size={20} />
                    </div>
                </div>

                <div className="stat-card p-5 border-l-4 border-emerald-500 rounded-lg bg-white shadow-sm flex items-center">
                    <div className="flex-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Approved Revenue</p>
                        <h3 className="text-2xl font-bold text-emerald-600">₹{approvedAmount.toLocaleString('en-IN')}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <ShieldCheck size={20} />
                    </div>
                </div>
            </div>

            <div className="card p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Claim History</h3>
                    <div className="relative w-64">
                        <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                        <input type="text" placeholder="Search tracking ID or policy..." className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500" />
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-slate-500">Loading Claims Database...</div>
                ) : claims.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                        <ShieldCheck size={48} className="mb-4 opacity-30 text-slate-500" />
                        <h3 className="text-lg font-bold">No Claims Found</h3>
                        <p className="text-sm">Initiate a pre-authorization to secure insurance funding.</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-y border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-slate-600 uppercase text-xs tracking-wider">Patient & Provider</th>
                                <th className="px-6 py-3 font-semibold text-slate-600 uppercase text-xs tracking-wider">Type / Notes</th>
                                <th className="px-6 py-3 font-semibold text-slate-600 uppercase text-xs tracking-wider">Filed Amount</th>
                                <th className="px-6 py-3 font-semibold text-slate-600 uppercase text-xs tracking-wider tracking-widest text-right">TPA Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {claims.map(claim => (
                                <tr key={claim.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800">{claim.patientName}</div>
                                        <div className="text-xs text-slate-500 max-w-[200px] truncate">{claim.notes.split(']')[0]}]</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">{claim.serviceType}</div>
                                        <div className="text-xs text-slate-400 mt-1 max-w-xs truncate">{claim.notes.split('] ')[1] || claim.notes}</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-700">₹{claim.netPayable.toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold w-32 inline-block text-center ${claim.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                            {claim.status === 'Paid' ? 'SETTLED' : 'PROCESSING'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pre-Authorization Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-slate-800 px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-white flex items-center gap-2"><ShieldCheck size={18} className="text-blue-400" /> Pre-Authorization Request</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors text-xl">×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="bg-blue-50 border border-blue-100 text-blue-800 text-xs p-3 rounded flex items-start gap-2 mb-2">
                                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                                <p>Submit this form prior to IPD discharge or major surgery to secure funding lines from the Third Party Administrator (TPA).</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Patient Name</label>
                                    <input required type="text" className="w-full p-2.5 border border-slate-300 rounded outline-none focus:border-blue-500" value={formData.patientName} onChange={e => setFormData({ ...formData, patientName: e.target.value })} />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Insurance Provider</label>
                                    <select required className="w-full p-2.5 border border-slate-300 rounded outline-none focus:border-blue-500 bg-white" value={formData.insuranceProvider} onChange={e => setFormData({ ...formData, insuranceProvider: e.target.value })}>
                                        <option value="">Select TPA...</option>
                                        <option value="Star Health">Star Health</option>
                                        <option value="HDFC ERGO">HDFC Ergo</option>
                                        <option value="Care Health">Care Health</option>
                                        <option value="Max Bupa">Niva Bupa</option>
                                        <option value="Govt Schemes (Ayushman)">Govt Scheme</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Member Policy ID No.</label>
                                    <input required type="text" className="w-full p-2.5 border border-slate-300 rounded outline-none focus:border-blue-500 font-mono" placeholder="PHD-129038" value={formData.policyNumber} onChange={e => setFormData({ ...formData, policyNumber: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Primary Diagnosis / ICD-10 Code</label>
                                    <input required type="text" className="w-full p-2.5 border border-slate-300 rounded outline-none focus:border-blue-500" placeholder="e.g. Acute Appendicitis" value={formData.diagnosis} onChange={e => setFormData({ ...formData, diagnosis: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Total Estimated Filing Amount (₹)</label>
                                    <input required type="number" min="0" className="w-full p-2.5 border border-slate-300 rounded outline-none focus:border-blue-500 font-bold text-slate-800 text-lg" value={formData.estimatedAmount} onChange={e => setFormData({ ...formData, estimatedAmount: e.target.value })} />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 bg-slate-100 font-semibold text-slate-600 rounded hover:bg-slate-200 transition-colors">Cancel</button>
                                <button type="submit" disabled={creating} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow flex items-center gap-2 transition-colors disabled:opacity-50">
                                    {creating ? 'Submitting secure file...' : <><ShieldCheck size={16} /> File Pre-Auth to TPA</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
