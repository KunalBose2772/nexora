'use client';

import {
    ArrowLeft, Loader2, Save, Send,
    FileText, CheckCircle2, AlertCircle,
    Image as LucideImage, ExternalLink,
    User, Activity, ShieldAlert, BadgeInfo, X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import RadiologyReportSlip from '@/components/print/RadiologyReportSlip';

export default function RadiologyReportingPage() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [report, setReport] = useState({
        findings: '',
        impression: '',
        criticalAlert: false,
        radiologistName: '',
        status: 'Draft'
    });
    const [activeTab, setActiveTab] = useState('Report'); // 'Report' or 'Viewer'
    const [showPrint, setShowPrint] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/radiology/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setOrder(data.order);
                    if (data.order.report) {
                        setReport({
                            findings: data.order.report.findings || '',
                            impression: data.order.report.impression || '',
                            criticalAlert: data.order.report.criticalAlert || false,
                            radiologistName: data.order.report.radiologistName || '',
                            status: data.order.report.status || 'Draft'
                        });
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleSave = async (finalize = false) => {
        setSaving(true);
        try {
            const res = await fetch(`/api/radiology/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reportStatus: finalize ? 'Finalized' : 'Draft',
                    ...report
                })
            });
            if (res.ok) {
                router.push('/radiology');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="animate-spin text-cyan-600" size={40} />
        </div>
    );

    return (
        <div className="fade-in space-y-6 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="page-header items-center">
                <div className="flex items-center gap-4">
                    <Link href="/radiology" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="page-header__title">Reporting Hub</h1>
                            <span className="badge badge-navy px-2">{order?.orderCode}</span>
                        </div>
                        <p className="page-header__subtitle">{order?.modality} • {order?.procedureName}</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    {report?.status === 'Finalized' && (
                        <button className="btn btn-primary bg-slate-900" onClick={() => setShowPrint(true)}>
                            <FileText size={16} /> Print Report
                        </button>
                    )}
                    <button className="btn btn-secondary" onClick={() => handleSave(false)} disabled={saving}>
                        {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Draft
                    </button>
                    <button className="btn btn-primary" onClick={() => handleSave(true)} disabled={saving}>
                        <Send size={16} /> Finalize Report
                    </button>
                </div>
            </div>

            {/* Print Preview Overlay */}
            {showPrint && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4 md:p-10 overflow-auto">
                    <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl relative">
                        <button
                            onClick={() => setShowPrint(false)}
                            className="absolute -top-3 -right-3 w-10 h-10 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-50 transition-all border border-slate-200 z-10"
                        >
                            <X size={20} />
                        </button>
                        <RadiologyReportSlip order={order} />
                    </div>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                {/* Left Sidebar: Patient Info */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="card p-6">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Patient Information</h3>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shadow-sm">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 leading-tight">{order?.patient?.firstName} {order?.patient?.lastName}</p>
                                <p className="text-xs text-slate-500 font-medium">UHID: {order?.patient?.patientCode}</p>
                            </div>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-slate-50">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-medium">Age/Sex</span>
                                <span className="font-bold text-slate-700">{order?.patient?.age}y / {order?.patient?.gender}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-medium">Register Date</span>
                                <span className="font-bold text-slate-700">{new Date(order?.patient?.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Clinical Indication</h3>
                        <p className="text-sm text-slate-600 leading-relaxed italic">
                            {order?.clinicalHistory || 'No history provided.'}
                        </p>
                    </div>

                    <button
                        onClick={() => setActiveTab('Viewer')}
                        className={`w-full card p-6 text-center group border-2 border-dashed transition-all ${activeTab === 'Viewer' ? 'border-cyan-500 bg-cyan-50/30' : 'border-slate-200 hover:border-cyan-300'}`}
                    >
                        <LucideImage size={32} className={`mx-auto mb-3 transition-colors ${activeTab === 'Viewer' ? 'text-cyan-500' : 'text-slate-300 group-hover:text-cyan-400'}`} />
                        <p className={`text-xs font-bold uppercase tracking-wider ${activeTab === 'Viewer' ? 'text-cyan-600' : 'text-slate-500'}`}>PACS DICOM VIEWER</p>
                    </button>
                </div>

                {/* Right Content: Editor/Viewer */}
                <div className="xl:col-span-9 card overflow-hidden border-slate-200">
                    {/* Tabs Navigation */}
                    <div className="tabs mb-0 border-b border-slate-100 bg-slate-50/50">
                        <button
                            onClick={() => setActiveTab('Report')}
                            className={`tab-item h-14 px-8 border-b-2 transition-all ${activeTab === 'Report' ? 'active bg-white' : ''}`}
                        >
                            Report Editor
                        </button>
                        <button
                            onClick={() => setActiveTab('Viewer')}
                            className={`tab-item h-14 px-8 border-b-2 transition-all ${activeTab === 'Viewer' ? 'active bg-white' : ''}`}
                        >
                            DICOM Viewer (Simulated)
                        </button>
                    </div>

                    <div className="p-4 md:p-8">
                        {activeTab === 'Report' ? (
                            <div className="fade-in space-y-8 max-w-4xl mx-auto">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Detailed Findings</label>
                                    <textarea
                                        className="form-textarea min-h-[400px] border-slate-200 focus:border-cyan-500"
                                        placeholder="Start typing your radiological observations..."
                                        value={report.findings}
                                        onChange={(e) => setReport({ ...report, findings: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Clinical Impression</label>
                                    <textarea
                                        className="form-textarea min-h-[120px] border-slate-200 focus:border-cyan-500 font-bold text-slate-800"
                                        placeholder="Final conclusion..."
                                        value={report.impression}
                                        onChange={(e) => setReport({ ...report, impression: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Reporting Radiologist</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Dr. Nexora, MD"
                                            value={report.radiologistName}
                                            onChange={(e) => setReport({ ...report, radiologistName: e.target.value })}
                                        />
                                    </div>
                                    <div className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${report.criticalAlert ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100'}`}>
                                        <input
                                            type="checkbox"
                                            id="critical"
                                            className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                                            checked={report.criticalAlert}
                                            onChange={(e) => setReport({ ...report, criticalAlert: e.target.checked })}
                                        />
                                        <label htmlFor="critical" className={`text-sm font-bold cursor-pointer select-none flex items-center gap-2 ${report.criticalAlert ? 'text-rose-600' : 'text-slate-500'}`}>
                                            {report.criticalAlert && <ShieldAlert size={16} />} Mark as Critical Alert
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="fade-in bg-slate-900 rounded-2xl overflow-hidden h-[600px] relative flex flex-col shadow-2xl">
                                <div className="p-3 bg-black/40 border-b border-white/5 flex flex-wrap gap-4 text-[10px] font-bold text-slate-500 uppercase z-10">
                                    <span className="text-cyan-400">PACS System v2.0</span>
                                    <span>Window: 400/40</span>
                                    <span>Zoom: 100%</span>
                                    <span className="ml-auto text-white/40">Series 1 • Image 12/48</span>
                                </div>
                                <div className="flex-1 overflow-hidden flex items-center justify-center p-8">
                                    <img
                                        src="/mri_viewer_mockup_1773400518531.png"
                                        alt="PACS View"
                                        className="h-full w-auto object-contain brightness-110 contrast-125"
                                    />
                                    {/* Medical Overlay Text */}
                                    <div className="absolute top-8 left-8 text-emerald-400 font-mono text-[10px] leading-relaxed drop-shadow-md">
                                        ID: {order?.patient?.patientCode}<br />
                                        NAME: {order?.patient?.lastName?.toUpperCase()}, {order?.patient?.firstName?.toUpperCase()}<br />
                                        SEX: {order?.patient?.gender?.charAt(0)} • AGE: {order?.patient?.age}Y
                                    </div>
                                    <div className="absolute bottom-8 right-8 text-emerald-400 font-mono text-[10px] text-right leading-relaxed drop-shadow-md">
                                        STUDY: {order?.modality}<br />
                                        DATE: {new Date(order?.createdAt).toLocaleDateString()}<br />
                                        SLICE: 5.0mm
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
