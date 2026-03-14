'use client';
import { useState, useEffect } from 'react';
import { PackageOpen, ArrowRightLeft, ShieldCheck, Box, Send, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SubStoreIndentsPage() {
    const [indents, setIndents] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Create new Indent
    const [formData, setFormData] = useState({
        itemName: '',
        requestedBy: 'Charge Nurse', // Mock staff name
        requestingWard: 'Ward 3 ICU',
        quantity: '',
        priority: 'Normal',
        reason: ''
    });

    const [processing, setProcessing] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/pharmacy/indents');
            if (res.ok) {
                const data = await res.json();
                setIndents(data.indents || []);
                setInventory(data.inventory || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmitIndent = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            const res = await fetch('/api/pharmacy/indents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Indent Request Sent to Main Store!');
                setShowModal(false);
                setFormData({ ...formData, itemName: '', quantity: '', reason: '' });
                fetchData();
            } else {
                alert('Failed to send intent');
            }
        } catch (err) { }
        finally { setProcessing(false); }
    };

    // Fulfilling an indent (Store Manager side)
    const approveIndent = async (indent) => {
        // Quick lookup if medicine exists
        const stockMatch = inventory.find(i => i.name.toLowerCase() === indent.patientName.toLowerCase());

        if (!stockMatch) {
            return alert(`Cannot fulfill. No item named "${indent.patientName}" found in global database.`);
        }

        const qtyRequested = parseInt(indent.time) || 0;

        if (stockMatch.stock < qtyRequested) {
            return alert(`Insufficient Stock in Main Store! Current stock is ${stockMatch.stock}. Requested is ${qtyRequested}.`);
        }

        if (!confirm(`Fulfill ${qtyRequested} units of ${stockMatch.name} (Batch ${stockMatch.batchNo}) to ${indent.department}?`)) return;

        try {
            const res = await fetch('/api/pharmacy/indents', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: indent.id,
                    status: 'Approved',
                    allocatedBatch: stockMatch.batchNo,
                    qtyFulfilled: qtyRequested,
                    medicineId: stockMatch.id
                })
            });
            if (res.ok) {
                alert('Indent Fulfilled & Stock Deducted.');
                fetchData();
            }
        } catch (e) { }
    };

    const rejectIndent = async (indent) => {
        if (!confirm(`Reject request from ${indent.department}?`)) return;
        try {
            const res = await fetch('/api/pharmacy/indents', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: indent.id, status: 'Rejected' })
            });
            if (res.ok) fetchData();
        } catch (e) { }
    };

    const pendingCount = indents.filter(i => i.status === 'Pending').length;

    return (
        <div className="fade-in">
            <div className="dashboard-header-row mb-6">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Sub-Store Indenting</h1>
                    <p className="page-header__subtitle">Internal pharmacy transfers — request bulk supplies from Main Store to departmental wards.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm flex items-center gap-2">
                        <Send size={15} /> Raise Indent Request
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="stat-card p-5 border-l-4 border-amber-500 rounded-lg bg-white shadow-sm flex items-center">
                    <div className="flex-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Awaiting Main Store</p>
                        <h3 className="text-2xl font-bold text-slate-800">{pendingCount} Requests</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                        <PackageOpen size={20} />
                    </div>
                </div>

                <div className="stat-card p-5 border-l-4 border-blue-500 rounded-lg bg-white shadow-sm flex items-center">
                    <div className="flex-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Transfers Today</p>
                        <h3 className="text-2xl font-bold text-slate-800">
                            {indents.filter(s => s.status === 'Approved' && s.date === new Date().toISOString().split('T')[0]).length} Batches
                        </h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                        <ArrowRightLeft size={20} />
                    </div>
                </div>
            </div>

            <div className="card bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-3 mb-4 flex items-center gap-2">
                    <Box size={18} className="text-slate-400" /> Multi-Warehouse Requisitions
                </h3>

                {loading ? <p className="text-center py-10 text-slate-500">Syncing with Main Store...</p> :
                    indents.length === 0 ? <p className="text-center py-10 text-slate-400">No active internal indents.</p> :
                        (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 border-y border-slate-200">
                                        <tr>
                                            <th className="px-5 py-3 font-bold text-slate-600 uppercase text-xs">Indent ID / Date</th>
                                            <th className="px-5 py-3 font-bold text-slate-600 uppercase text-xs">Originating Sub-Store</th>
                                            <th className="px-5 py-3 font-bold text-slate-600 uppercase text-xs">Requested Product & Qty</th>
                                            <th className="px-5 py-3 font-bold text-slate-600 uppercase text-xs text-right">Fulfillment Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {indents.map(indent => {
                                            const qty = indent.time;
                                            const isPriority = indent.notes.includes('Priority: Emergency');

                                            return (
                                                <tr key={indent.id} className="hover:bg-slate-50">
                                                    <td className="px-5 py-4">
                                                        <div className="font-mono font-bold text-slate-800">{indent.apptCode}</div>
                                                        <div className="text-xs text-slate-500 mt-1">{new Date(indent.createdAt).toLocaleDateString()}</div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="font-bold text-slate-800">{indent.department}</div>
                                                        <div className="text-xs text-slate-500 mt-1">Sender: {indent.doctorName}</div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="font-bold text-slate-800 text-base">{indent.patientName} <span className="text-slate-500 font-normal">x {qty} units</span></div>
                                                        {isPriority && <div className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded uppercase inline-block mt-1 tracking-widest">EMERGENCY</div>}
                                                        <div className="text-xs text-slate-500 max-w-[250px] truncate mt-1" title={indent.notes}>{indent.notes}</div>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        {indent.status === 'Pending' ? (
                                                            <div className="flex gap-2 justify-end">
                                                                <button onClick={() => approveIndent(indent)} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-bold text-xs rounded transition-colors flex items-center gap-1"><ShieldCheck size={14} /> Fulfill</button>
                                                                <button onClick={() => rejectIndent(indent)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded transition-colors border border-red-100">Reject</button>
                                                            </div>
                                                        ) : (
                                                            <span className={`px-3 py-1 rounded font-bold text-xs ${indent.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500 line-through'}`}>{indent.status.toUpperCase()}</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="bg-slate-800 px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-white flex items-center gap-2"><Send size={18} className="text-blue-400" /> Raise Indent</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmitIndent} className="p-6">
                            <div className="bg-amber-50 border border-amber-100 text-amber-800 text-xs p-3 rounded flex items-start gap-2 mb-4">
                                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                                <p>Used by Ward Sisters or Sub-Stores to requisition bulk medicaments from Main Pharmacy.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Item Requested (Exact generic or brand name)</label>
                                    <input required type="text" className="w-full p-2.5 border border-slate-300 rounded outline-none focus:border-blue-500" placeholder="E.g. Inj. Paracetamol 100ml" value={formData.itemName} onChange={e => setFormData({ ...formData, itemName: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Bulk Quantity Req.</label>
                                        <input required type="number" min="1" className="w-full p-2.5 border border-slate-300 rounded outline-none focus:border-blue-500 font-bold text-slate-800" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Indent Priority</label>
                                        <select className="w-full p-2.5 border border-slate-300 rounded outline-none focus:border-blue-500" value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                                            <option value="Routine">Routine</option>
                                            <option value="Normal">Normal</option>
                                            <option value="Emergency">EMERGENCY (Stat)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Sending Sub-Store / Ward</label>
                                    <input type="text" className="w-full p-2.5 border border-slate-300 rounded outline-none focus:border-blue-500 bg-slate-50" value={formData.requestingWard} onChange={e => setFormData({ ...formData, requestingWard: e.target.value })} />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Reason for Requisition</label>
                                    <input type="text" className="w-full p-2.5 border border-slate-300 rounded outline-none focus:border-blue-500" placeholder="Ward stock depleted..." value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 bg-slate-100 font-semibold text-slate-600 rounded hover:bg-slate-200">Cancel</button>
                                <button type="submit" disabled={processing} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow flex items-center gap-2 disabled:opacity-50">
                                    {processing ? 'Firing...' : <><Send size={16} /> Send to Store</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
