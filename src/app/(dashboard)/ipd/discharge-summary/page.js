'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, X, FileText, Download, Printer, Share2 } from 'lucide-react';
import Link from 'next/link';
import DischargeSummary from '@/components/print/DischargeSummary';

function DischargeSummaryContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [admission, setAdmission] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/ipd`);
                if (res.ok) {
                    const data = await res.json();
                    const adm = data.ipdPatients?.find(p => p.id === id);
                    setAdmission(adm);

                    if (adm?.patientId) {
                        const rxRes = await fetch(`/api/opd/consultations?patientId=${adm.patientId}`);
                        if (rxRes.ok) {
                            const rxData = await rxRes.json();
                            setPrescriptions(rxData.consultations || []);
                        }
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (!id) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
            <FileText size={48} className="mb-4 opacity-20" />
            <p className="font-bold uppercase tracking-widest text-xs">No patient ID provided</p>
        </div>
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
            <div className="relative">
                <Loader2 className="animate-spin text-cyan-500" size={48} />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-navy-600 rounded-full animate-ping" />
                </div>
            </div>
            <div className="text-center">
                <p className="text-navy-900 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">Nexora Intelligence</p>
                <p className="text-slate-400 text-xs font-medium">Assembling clinical dossier and histories...</p>
            </div>
        </div>
    );

    if (!admission) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-rose-500">
            <X size={48} className="mb-4 opacity-50" />
            <p className="font-bold uppercase tracking-widest text-xs font-serif">Stay Record Not Found</p>
        </div>
    );

    return (
        <div className="fade-in max-w-5xl mx-auto py-8 md:py-12 px-4 space-y-8">
            {/* Action Header */}
            <div className="page-header flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-1">
                    <Link href="/ipd" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-600 font-bold uppercase tracking-widest text-[10px] mb-3 transition-all group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Ward Control
                    </Link>
                    <h1 className="text-3xl font-black text-navy-900 tracking-tight flex items-center gap-3">
                        Discharge Dossier
                        <span className="px-3 py-1 bg-cyan-50 text-cyan-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-100">
                            ID: {id.slice(-6).toUpperCase()}
                        </span>
                    </h1>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="btn btn-secondary flex-1 md:flex-none">
                        <Download size={18} /> Export
                    </button>
                    <button className="btn btn-primary flex-1 md:flex-none" onClick={() => window.print()}>
                        <Printer size={18} /> Print Final
                    </button>
                </div>
            </div>

            {/* Premium Document Container */}
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-navy-900/5 border border-slate-100 overflow-hidden relative group">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-navy-600 via-cyan-500 to-navy-600" />
                <div className="p-1 md:p-4">
                    <DischargeSummary admission={admission} prescriptions={prescriptions} />
                </div>
            </div>

            {/* Footer Notice */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Verified Clinical Record
                </div>
                <div className="text-center md:text-right">
                    Generated by Nexora Health Systems • {new Date().toLocaleString()}
                </div>
            </div>
        </div>
    );
}

export default function DischargeSummaryPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-cyan-500" size={40} />
            </div>
        }>
            <DischargeSummaryContent />
        </Suspense>
    );
}
