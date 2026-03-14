'use client';

import {
    FlaskConical, Activity, Bug, Search,
    Plus, Filter, CheckCircle2, ShieldAlert,
    Loader2, Users, FileText, ChevronRight,
    Save, Trash2, Microscope, Beaker, Printer, X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import MicrobiologyLabSlip from '@/components/print/MicrobiologyLabSlip';

import Skeleton from '@/components/common/Skeleton';

export default function MicrobiologyPage() {
    const [requests, setRequests] = useState([]);
    const [organisms, setOrganisms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [saving, setSaving] = useState(false);
    const [showPrint, setShowPrint] = useState(false);

    const [cultureForm, setCultureForm] = useState({
        organismId: '',
        sensitivities: [{ antibiotic: '', result: 'Sensitive', micValue: '' }]
    });

    const fetchData = async () => {
        try {
            const res = await fetch('/api/lab/microbiology');
            const data = await res.json();
            if (res.ok) {
                setRequests(data.requests);
                setOrganisms(data.organisms);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddSensitivity = () => {
        setCultureForm({
            ...cultureForm,
            sensitivities: [...cultureForm.sensitivities, { antibiotic: '', result: 'Sensitive', micValue: '' }]
        });
    };

    const handleRemoveSensitivity = (index) => {
        setCultureForm({
            ...cultureForm,
            sensitivities: cultureForm.sensitivities.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/lab/microbiology', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    labRequestId: selectedRequest.id,
                    ...cultureForm
                })
            });
            if (res.ok) {
                setSelectedRequest(null);
                fetchData();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fade-in space-y-6">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-header__title">Microbiology & Cultures</h1>
                    <p className="page-header__subtitle">Culture isolation, Antibiotic Sensitivity Testing & HAI surveillance</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary">
                        <Activity size={16} /> Surveillance Report
                    </button>
                    <button className="btn btn-primary">
                        <Plus size={16} /> Record Organism
                    </button>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className={`grid gap-8 transition-all duration-300 ${selectedRequest ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
                {/* List Section */}
                <div className={`${selectedRequest ? 'lg:col-span-7' : ''} space-y-4`}>
                    <div className="card overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap justify-between items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-bold text-navy-600">
                                    ACTIVE CULTURES: {loading ? '...' : requests.filter(r => r.status === 'Pending').length}
                                </span>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search tracking ID or name..."
                                    className="form-input pl-9 h-9 text-xs"
                                />
                            </div>
                        </div>

                        <div className="data-table-wrapper border-none">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Tracking ID</th>
                                        <th>Patient</th>
                                        <th>Sample/Source</th>
                                        <th>Result Status</th>
                                        <th className="text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        [1, 2, 3, 4, 5].map(i => (
                                            <tr key={i}>
                                                <td><Skeleton width="100px" height="15px" /><Skeleton width="80px" height="10px" className="mt-2" /></td>
                                                <td><Skeleton width="120px" height="15px" /><Skeleton width="100px" height="10px" className="mt-2" /></td>
                                                <td><Skeleton width="140px" height="15px" /><Skeleton width="80px" height="10px" className="mt-2" /></td>
                                                <td><Skeleton width="100px" height="20px" /></td>
                                                <td className="text-right"><Skeleton width="80px" height="32px" className="ml-auto" /></td>
                                            </tr>
                                        ))
                                    ) : requests.map(req => (
                                        <tr key={req.id} className={selectedRequest?.id === req.id ? 'bg-cyan-50/50' : ''}>
                                            <td>
                                                <p className="font-bold text-slate-900">{req.trackingId}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{new Date(req.createdAt).toLocaleDateString()}</p>
                                            </td>
                                            <td>
                                                <p className="font-bold text-slate-700 text-xs">{req.patient?.firstName} {req.patient?.lastName}</p>
                                                <p className="text-[10px] text-slate-400">{req.patient?.patientCode}</p>
                                            </td>
                                            <td>
                                                <p className="text-xs font-semibold">{req.testName}</p>
                                                <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-tighter">Blood Culture</p>
                                            </td>
                                            <td>
                                                {req.sensitivities.length > 0 ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="badge badge-info italic font-serif px-2">{req.sensitivities[0].organism?.name}</span>
                                                        <span className="text-[9px] font-black text-emerald-500 uppercase">Ready</span>
                                                    </div>
                                                ) : (
                                                    <span className="badge badge-warning text-[10px]">Incubating</span>
                                                )}
                                            </td>
                                            <td className="text-right">
                                                <button
                                                    onClick={() => setSelectedRequest(req)}
                                                    className={`btn btn-sm ${selectedRequest?.id === req.id ? 'btn-primary' : 'btn-secondary'}`}
                                                >
                                                    {req.sensitivities.length > 0 ? 'View Result' : 'Enter AST'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Form Section (Sidebar) */}
                {selectedRequest && (
                    <div className="lg:col-span-5 space-y-6 fade-in">
                        <div className="card p-6 border-l-4 border-l-cyan-500 shadow-xl relative">
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-lg font-bold mb-6">Sensitivity Profile</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="form-group">
                                    <label className="form-label">Isolated Organism</label>
                                    <select
                                        className="form-select border-slate-200"
                                        required
                                        value={cultureForm.organismId}
                                        onChange={e => setCultureForm({ ...cultureForm, organismId: e.target.value })}
                                    >
                                        <option value="">Select Organism...</option>
                                        {organisms.map(o => (
                                            <option key={o.id} value={o.id}>{o.name} ({o.category})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="form-label mb-0">Antibiotic Sensitivity (AST)</label>
                                        <button
                                            type="button"
                                            onClick={handleAddSensitivity}
                                            className="text-[11px] font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                                        >
                                            <Plus size={12} /> Add Drug
                                        </button>
                                    </div>

                                    {cultureForm.sensitivities.map((s, idx) => (
                                        <div key={idx} className="grid grid-cols-12 gap-2 items-end p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                                            <div className="col-span-5">
                                                <input
                                                    placeholder="Antibiotic"
                                                    className="form-input text-xs"
                                                    value={s.antibiotic}
                                                    onChange={e => {
                                                        const newSens = [...cultureForm.sensitivities];
                                                        newSens[idx].antibiotic = e.target.value;
                                                        setCultureForm({ ...cultureForm, sensitivities: newSens });
                                                    }}
                                                />
                                            </div>
                                            <div className="col-span-4">
                                                <select
                                                    className="form-select text-xs h-[42px]"
                                                    value={s.result}
                                                    onChange={e => {
                                                        const newSens = [...cultureForm.sensitivities];
                                                        newSens[idx].result = e.target.value;
                                                        setCultureForm({ ...cultureForm, sensitivities: newSens });
                                                    }}
                                                >
                                                    <option value="Sensitive">S</option>
                                                    <option value="Resistant">R</option>
                                                    <option value="Intermediate">I</option>
                                                </select>
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    placeholder="MIC"
                                                    className="form-input text-xs"
                                                    value={s.micValue}
                                                    onChange={e => {
                                                        const newSens = [...cultureForm.sensitivities];
                                                        newSens[idx].micValue = e.target.value;
                                                        setCultureForm({ ...cultureForm, sensitivities: newSens });
                                                    }}
                                                />
                                            </div>
                                            <div className="col-span-1 flex justify-center pb-3">
                                                <button type="button" onClick={() => handleRemoveSensitivity(idx)} className="text-rose-500">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary flex-1 h-12"
                                        disabled={saving}
                                    >
                                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={18} />}
                                        Save Result
                                    </button>
                                    {selectedRequest.sensitivities.length > 0 && (
                                        <button
                                            type="button"
                                            className="btn btn-secondary flex-1 h-12"
                                            onClick={() => setShowPrint(true)}
                                        >
                                            <Printer size={18} /> Print Profile
                                        </button>
                                    )}
                                </div>
                            </form>

                            <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
                                <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase mb-1">
                                    <ShieldAlert size={14} /> Antibiotic Stewardship
                                </div>
                                <p className="text-[10px] text-amber-600 leading-normal">
                                    All MDR (Multi-Drug Resistant) isolates must be flagged for Infection Control review.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Print Preview Modal */}
            {showPrint && (
                <div className="modal-overlay">
                    <div className="modal max-w-4xl relative overflow-visible">
                        <button
                            onClick={() => setShowPrint(false)}
                            className="absolute -top-3 -right-3 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-2xl z-50 border-2 border-white"
                        >
                            <X size={20} />
                        </button>
                        <div className="p-0">
                            <MicrobiologyLabSlip request={selectedRequest} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
