'use client';

import {
    Plus, ArrowLeft, Save, Zap, User,
    ShieldAlert, AlertTriangle, Activity,
    Thermometer, HeartPulse, UserPlus, Search,
    Loader2, CheckCircle2, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewEmergencyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        patientName: '',
        age: '',
        gender: 'Male',
        traumaType: 'RTA',
        admitNotes: '',
        triageLevel: 3,
        bystanderName: '',
        bystanderPhone: '',
        isMLC: false,
        mlcNumber: '',
        policeStation: '',
        bp: '',
        hr: '',
        temp: '',
        spo2: '',
        rr: ''
    });

    const traumaTypes = [
        'RTA (Road Traffic Accident)', 'Fall from Height', 'Physical Assault',
        'Burn Injury', 'Poisoning', 'Cardiac Arrest', 'Respiratory Distress',
        'Snake Bite', 'Drowning', 'Other Trauma'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.patientName) {
            setErrorMsg('Patient Name is required.');
            return;
        }

        setLoading(true);
        setErrorMsg('');

        try {
            const triageVitals = {
                bp: formData.bp,
                hr: formData.hr,
                temp: formData.temp,
                spo2: formData.spo2,
                rr: formData.rr
            };

            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientName: formData.patientName,
                    doctorName: 'ER Duty Doctor',
                    department: 'Emergency & Trauma',
                    date: new Date().toISOString().split('T')[0],
                    type: 'EMERGENCY',
                    admitNotes: formData.admitNotes,
                    triageLevel: parseInt(formData.triageLevel),
                    triageColor: formData.triageLevel === 1 ? 'Red' : formData.triageLevel === 2 ? 'Orange' : 'Yellow',
                    traumaType: formData.traumaType,
                    bystanderName: formData.bystanderName,
                    bystanderPhone: formData.bystanderPhone,
                    isMLC: formData.isMLC,
                    mlcNumber: formData.mlcNumber,
                    policeStation: formData.policeStation,
                    triageVitals: triageVitals,
                    paymentAmount: 0
                })
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => router.push('/emergency'), 1500);
            } else {
                const data = await res.json();
                setErrorMsg(data.error || 'Failed to register emergency case.');
            }
        } catch (error) {
            setErrorMsg('Network error occurred.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] fade-in">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-200">
                    <CheckCircle2 size={40} className="text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Emergency Registered</h2>
                <p className="text-slate-500 mt-2 font-medium">Redirecting to Triage Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="fade-in space-y-8 max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="page-header items-center">
                <div className="flex items-center gap-4">
                    <Link href="/emergency" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title">New Emergency Intake</h1>
                        <p className="page-header__subtitle">Immediate registration and triage assessment</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-rose-700 uppercase tracking-widest">Priority One Active</span>
                </div>
            </div>

            {errorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex gap-3 items-center text-sm font-medium animate-shake">
                    <AlertTriangle size={18} />
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    {/* Patient Information */}
                    <div className="card p-6 md:p-8">
                        <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <User size={18} className="text-rose-500" />
                            Patient Identification
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="md:col-span-2 lg:col-span-4 form-group">
                                <label className="form-label">Full Name / Identifier <span className="text-rose-500">*</span></label>
                                <input
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleChange}
                                    className="form-input border-slate-200 focus:border-rose-500"
                                    placeholder="e.g. Unknown Male approx 40y"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Age (Approx)</label>
                                <input name="age" value={formData.age} onChange={handleChange} className="form-input" placeholder="Years" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 form-group">
                                <label className="form-label">Trauma Type / Mechanism</label>
                                <select name="traumaType" value={formData.traumaType} onChange={handleChange} className="form-select">
                                    {traumaTypes.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Triage & Vitals */}
                    <div className="card p-6 md:p-8 border-l-4 border-l-rose-500">
                        <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Activity size={18} className="text-rose-500" />
                            Emergency Triage & Vitals
                        </h3>

                        <label className="form-label mb-3">ESI Triage Level Portfolio</label>
                        <div className="grid grid-cols-5 gap-2 md:gap-4 mb-8">
                            {[1, 2, 3, 4, 5].map(lvl => {
                                const colors = {
                                    1: { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-700', active: 'ring-rose-500 ring-2' },
                                    2: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700', active: 'ring-orange-500 ring-2' },
                                    3: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', active: 'ring-amber-500 ring-2' },
                                    4: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', active: 'ring-emerald-500 ring-2' },
                                    5: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', active: 'ring-blue-500 ring-2' }
                                };
                                const c = colors[lvl];
                                const isActive = formData.triageLevel === lvl;
                                return (
                                    <button
                                        key={lvl}
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, triageLevel: lvl }))}
                                        className={`${c.bg} ${c.border} ${isActive ? c.active : 'border-transparent opacity-70'} p-3 md:p-4 rounded-xl transition-all text-center flex flex-col items-center justify-center gap-1 group`}
                                    >
                                        <span className={`text-[9px] font-black uppercase tracking-tighter ${c.text}`}>ESI</span>
                                        <span className={`text-xl font-black ${c.text}`}>{lvl}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="form-group">
                                <label className="form-label">BP</label>
                                <input name="bp" value={formData.bp} onChange={handleChange} className="form-input text-center font-bold" placeholder="120/80" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Pulse</label>
                                <input name="hr" value={formData.hr} onChange={handleChange} className="form-input text-center font-bold" placeholder="80" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Temp</label>
                                <input name="temp" value={formData.temp} onChange={handleChange} className="form-input text-center font-bold" placeholder="98.6" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">SpO2</label>
                                <input name="spo2" value={formData.spo2} onChange={handleChange} className="form-input text-center font-bold" placeholder="98%" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Resp Rate</label>
                                <input name="rr" value={formData.rr} onChange={handleChange} className="form-input text-center font-bold" placeholder="18" />
                            </div>
                        </div>

                        <div className="mt-8">
                            <label className="form-label">Chief Complaint & Clinical Notes</label>
                            <textarea
                                name="admitNotes"
                                value={formData.admitNotes}
                                onChange={handleChange}
                                className="form-textarea min-h-[100px]"
                                placeholder="Briefly describe the emergency context..."
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    {/* Informant Details */}
                    <div className="card p-6">
                        <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Zap size={18} className="text-rose-500" />
                            Informant / Bystander
                        </h3>
                        <div className="space-y-4">
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input name="bystanderName" value={formData.bystanderName} onChange={handleChange} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Contact Number</label>
                                <input name="bystanderPhone" value={formData.bystanderPhone} onChange={handleChange} className="form-input" />
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="isMLC"
                                        name="isMLC"
                                        checked={formData.isMLC}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                                    />
                                    <label htmlFor="isMLC" className="text-sm font-bold text-slate-700 cursor-pointer">Medico-Legal Case</label>
                                </div>
                                <ShieldAlert size={18} className={formData.isMLC ? 'text-rose-500' : 'text-slate-300'} />
                            </div>

                            {formData.isMLC && (
                                <div className="mt-6 space-y-4 fade-in">
                                    <div className="form-group">
                                        <label className="form-label">MLC Number</label>
                                        <input name="mlcNumber" value={formData.mlcNumber} onChange={handleChange} className="form-input border-rose-200" placeholder="e.g. MLC/HOSP/2026/012" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Local Police Jurisdiction</label>
                                        <input name="policeStation" value={formData.policeStation} onChange={handleChange} className="form-input" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Section */}
                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary h-14 bg-rose-600 border-rose-600 hover:bg-rose-700 text-lg font-bold shadow-xl shadow-rose-200"
                        >
                            {loading ? <Loader2 size={24} className="animate-spin" /> : <><ShieldAlert size={20} /> Register & Alert Team</>}
                        </button>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                            <Activity size={16} className="text-slate-400 mt-1 shrink-0" />
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase tracking-wider">
                                Submitting this form triggers a priority alert to the ER Duty Doctor, Triage Nurse, and Trauma Support Team.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
