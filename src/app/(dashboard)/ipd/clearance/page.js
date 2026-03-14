'use client';
import { useState, useEffect } from 'react';
import { LogOut, CheckCircle2, XCircle, Clock, ShieldAlert, BedDouble, Receipt, Pill, ArrowRightLeft, FileText } from 'lucide-react';
import Link from 'next/link';

export default function ClearanceGatePage() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/ipd/clearance');
            if (res.ok) {
                const data = await res.json();
                setPatients(data.patients || []);
            }
        } catch (e) { } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const toggleClearance = async (id, currentDept, currentState) => {
        const newState = currentState === 'Cleared' ? 'Pending' : 'Cleared';
        if (!confirm(`Mark ${currentDept} Clearance as ${newState}?`)) return;

        try {
            const res = await fetch('/api/ipd/clearance', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, dept: currentDept, newState })
            });

            if (res.ok) {
                const { isFullyCleared } = await res.json();
                if (isFullyCleared) alert('Patient Fully Cleared! Discharge Completed && Bed Vacated.');
                fetchData();
            }
        } catch (e) { }
    };

    const renderClearancePill = (dept, state, id) => {
        const isCleared = state === 'Cleared';
        return (
            <button
                onClick={() => toggleClearance(id, dept, state)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase transition-colors border shadow-sm ${isCleared ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 ring-2 ring-emerald-500/20' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'}`}
            >
                {isCleared ? <CheckCircle2 size={14} /> : <XCircle size={14} />} {dept}: {state}
            </button>
        );
    };

    return (
        <div className="fade-in max-w-7xl mx-auto">
            <div className="dashboard-header-row mb-6">
                <div>
                    <h1 className="page-header__title flex items-center gap-2"><LogOut className="text-blue-500" size={28} /> Discharge Clearance Gate</h1>
                    <p className="page-header__subtitle mt-1">Multi-department structural interlock preventing premature room discharges without total sign-offs.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <Link href="/ipd" className="btn btn-secondary btn-sm flex items-center gap-2 bg-white"><ArrowRightLeft size={16} /> Back to Main IPD</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="stat-card p-5 border border-slate-200 rounded-xl bg-white shadow-sm flex justify-between items-center">
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clock size={14} /> Awaiting Discharges</div>
                        <div className="text-3xl font-black text-slate-800">{patients.length}</div>
                    </div>
                </div>
                <div className="stat-card p-5 border border-slate-200 rounded-xl bg-white shadow-sm col-span-2 flex items-center border-l-4 border-l-amber-500">
                    <ShieldAlert size={36} className="text-amber-500 mr-4 shrink-0" />
                    <div>
                        <h3 className="font-bold text-slate-800">Clearance Lock Applied</h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Once a clinician clicks "Discharge", the patient drops into this unified queue. The underlying physical bed will <strong className="text-red-500 uppercase">NOT</strong> be vacated by the system until Ward Nursing, Pharmacy (Medicine Returns), and Finance (Bill Paid) simultaneously sign off.</p>
                    </div>
                </div>
            </div>

            {loading ? <p className="text-center py-10 text-slate-500 italic">Reading Clearance Queue...</p>
                : patients.length === 0 ? <div className="text-center py-16 bg-white border border-slate-200 rounded-xl shadow-sm"><CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-4" /><p className="font-bold text-slate-600">No locked patients.</p><p className="text-sm text-slate-400">All initiated discharges have been fully verified.</p></div>
                    : (
                        <div className="grid grid-cols-1 gap-4">
                            {patients.map(p => {
                                const { ward, pharmacy, finance } = p.clearances || {};
                                const prog = [ward, pharmacy, finance].filter(k => k === 'Cleared').length;

                                return (
                                    <div key={p.id} className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col md:flex-row gap-6 md:items-center">
                                        {/* Patient Info Block */}
                                        <div className="md:w-1/3 flex flex-col border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 pr-4">
                                            <h3 className="font-black text-lg text-slate-800 tracking-tight">{p.patientName}</h3>
                                            <div className="text-sm text-slate-600 font-bold mb-2">Dr. {p.doctorName}</div>
                                            <div className="text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5 text-blue-600 bg-blue-50 w-full rounded p-1.5">
                                                <BedDouble size={14} /> {p.ward} · Bed {p.bed}
                                            </div>
                                            <Link href={`/ipd/discharge-summary?id=${p.id}`} className="mt-3 flex items-center gap-2 text-[11px] font-black text-slate-800 uppercase tracking-widest border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors" style={{ textDecoration: 'none' }}>
                                                <FileText size={14} className="text-blue-500" /> Print Summary
                                            </Link>
                                            <div className="text-xs text-slate-400 font-mono mt-3">ID: {p.apptCode}</div>
                                        </div>

                                        {/* Progress & Action Block */}
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="font-bold text-xs text-slate-500 mb-3 flex items-center justify-between">
                                                <span className="uppercase tracking-widest">Clearance Status</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] ${prog === 3 ? 'bg-emerald-100 text-emerald-700' : prog === 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>{prog}/3 VERIFIED</span>
                                            </div>

                                            <div className="flex flex-wrap gap-4">
                                                {/* Ward Clearance */}
                                                <div className="flex-1 min-w-[140px] bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-3">
                                                    <div className="text-xs font-bold text-slate-700 flex items-center gap-2"><BedDouble size={14} className="text-blue-500" /> Station Check</div>
                                                    {renderClearancePill('WARD', ward, p.id)}
                                                </div>

                                                {/* Pharmacy Clearance */}
                                                <div className="flex-1 min-w-[140px] bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-3">
                                                    <div className="text-xs font-bold text-slate-700 flex items-center gap-2"><Pill size={14} className="text-indigo-500" /> Drug Returns</div>
                                                    {renderClearancePill('PHARMACY', pharmacy, p.id)}
                                                </div>

                                                {/* Finance Clearance */}
                                                <div className="flex-1 min-w-[140px] bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-3">
                                                    <div className="text-xs font-bold text-slate-700 flex items-center gap-2"><Receipt size={14} className="text-emerald-500" /> Bill Settled</div>
                                                    {renderClearancePill('FINANCE', finance, p.id)}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
        </div>
    );
}
