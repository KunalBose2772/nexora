'use client';
import { useState, useEffect } from 'react';
import { Activity, Syringe, ClipboardList, Thermometer, User, Clock, CheckCircle2, BedDouble, AlertCircle, Plus, X, HeartPulse, Search, RefreshCw, LayoutDashboard, Database, Siren, Ghost, Monitor, Clipboard, Pill } from 'lucide-react';
import Skeleton from '@/components/common/Skeleton';

export default function NursingStationPage() {
    const [patients, setPatients] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Vitals'); // 'Vitals' or 'MAR'
    const [vitalsForm, setVitalsForm] = useState({ bp: '', hr: '', temp: '', spo2: '' });
    const [marForm, setMarForm] = useState({ drugName: '', route: 'Oral', dose: '', comments: '' });
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/nursing');
            if (res.ok) {
                const data = await res.json();
                setPatients(data.patients || []);
                setLogs(data.logs || []);
                if (selectedPatient) {
                    const stillExists = data.patients.find(p => p.id === selectedPatient.id);
                    if (stillExists) setSelectedPatient(stillExists);
                }
            }
        } catch (e) { } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const submitLog = async (type) => {
        if (!selectedPatient) return;
        setSaving(true);
        let valStr = '';
        if (type === 'Vitals') {
            if (!vitalsForm.bp && !vitalsForm.hr && !vitalsForm.temp) return setSaving(false);
            valStr = `BP: ${vitalsForm.bp || '-'} mmHg | HR: ${vitalsForm.hr || '-'} bpm | Temp: ${vitalsForm.temp || '-'}°F | SpO2: ${vitalsForm.spo2 || '-'}%`;
        } else {
            if (!marForm.drugName) return setSaving(false);
            valStr = `[${marForm.route.toUpperCase()}] ${marForm.drugName} ${marForm.dose} — ${marForm.comments}`;
        }

        try {
            const res = await fetch('/api/nursing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    logType: type,
                    ipdId: selectedPatient.id,
                    nurseName: 'Nurse/Staff Logged_In_User',
                    value: valStr
                })
            });
            if (res.ok) {
                if (type === 'Vitals') setVitalsForm({ bp: '', hr: '', temp: '', spo2: '' });
                else setMarForm({ drugName: '', route: 'Oral', dose: '', comments: '' });
                fetchData();
            }
        } catch (e) { } finally { setSaving(false); }
    };

    const patientLogs = logs.filter(l => selectedPatient && l.department === selectedPatient.id);
    const vitalsLogs = patientLogs.filter(l => l.patientName === 'Vitals');
    const medicationLogs = patientLogs.filter(l => l.patientName === 'Medication');

    return (
        <div className="fade-in pb-12 h-[calc(100vh-140px)] flex flex-col">
            <style jsx>{`
                .ward-roster {
                    width: 340px;
                    background: #fff;
                    border: 1px solid var(--color-border-light);
                    border-radius: 24px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                .flowsheet-container {
                    flex: 1;
                    background: #fff;
                    border: 1px solid var(--color-border-light);
                    border-radius: 24px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                .patient-item {
                    padding: 20px;
                    border-bottom: 1px solid var(--color-border-light);
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    border-left: 4px solid transparent;
                }
                .patient-item.selected {
                    background: #F8FAFC;
                    border-left-color: var(--color-cyan);
                }
                .input-field {
                    width: 100%;
                    padding: 10px 14px;
                    background: #F1F5F9;
                    border: 1px solid #E2E8F0;
                    border-radius: 10px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #0F172A;
                    outline: none;
                }
                .input-field:focus {
                    border-color: var(--color-cyan);
                    background: #fff;
                    box-shadow: 0 0 0 4px rgba(0, 194, 255, 0.05);
                }
            `}</style>

            <div className="dashboard-header-row mb-6">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ClipboardList size={32} className="text-cyan-500" />
                        Clinical Nursing Station
                    </h1>
                    <p className="page-header__subtitle">Precision ward orchestration, bedside flowsheet synchronization, and MAR governance.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={fetchData}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync Ward
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <Plus size={15} strokeWidth={1.5} /> Ward Handover
                    </button>
                </div>
            </div>

            <div className="flex gap-6 flex-1 min-h-0">
                {/* Ward Roster */}
                <div className="ward-roster shadow-sm">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                        <div className="relative">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                placeholder="Scan ward or patient registry..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-sm outline-none focus:border-cyan-500"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loading && patients.length === 0 ? (
                            [1, 2, 3, 4].map(i => <div key={i} className="p-5"><Skeleton height="60px" /></div>)
                        ) : patients.filter(p => (p.patientName.toLowerCase() + p.ward.toLowerCase()).includes(searchTerm.toLowerCase())).map(p => (
                            <div key={p.id} onClick={() => setSelectedPatient(p)} className={`patient-item ${selectedPatient?.id === p.id ? 'selected' : ''}`}>
                                <div className="flex justify-between items-start mb-1.5">
                                    <h4 className="text-[14px] font-black text-navy-900 leading-tight">{p.patientName}</h4>
                                    <span className="text-[9px] font-black text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-100 uppercase tracking-widest">{p.bed}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.ward}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                    <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">OBJ-#{p.id.slice(0, 6).toUpperCase()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Patient Flowsheet */}
                <div className="flowsheet-container shadow-sm bg-slate-50/10">
                    {!selectedPatient ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200"><Monitor size={48} /></div>
                            <h3 className="text-xl font-black text-navy-900 mb-2">Monitor Station Clear</h3>
                            <p className="text-slate-400 font-semibold max-w-xs mx-auto">Please select a patient from the ward roster to initialize the clinical flowsheet and MAR stream.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="bg-navy-900 p-8 flex justify-between items-center text-white border-b border-navy-800">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-cyan-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-cyan-500/20">{selectedPatient.patientName?.[0]}</div>
                                    <div>
                                        <h2 className="text-2xl font-black tracking-tight">{selectedPatient.patientName}</h2>
                                        <div className="flex items-center gap-3 mt-1 text-cyan-500 font-black uppercase text-[11px] tracking-widest">
                                            <BedDouble size={14} /> {selectedPatient.ward} • {selectedPatient.bed}
                                            <span className="text-slate-500">|</span>
                                            <span className="text-slate-400">ID: {selectedPatient.apptCode}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest">Active Admission</span>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead: Dr. {selectedPatient.doctorName}</div>
                                </div>
                            </div>

                            <div className="flex bg-white px-2 pt-2 border-b border-slate-100">
                                <button onClick={() => setActiveTab('Vitals')} className={`flex-1 flex items-center justify-center gap-2 py-4 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'Vitals' ? 'border-cyan-500 text-cyan-600 bg-cyan-50/30 rounded-t-xl' : 'border-transparent text-slate-400 hover:text-navy-900'}`}>
                                    <Activity size={16} /> Vitals Telemetry
                                </button>
                                <button onClick={() => setActiveTab('MAR')} className={`flex-1 flex items-center justify-center gap-2 py-4 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'MAR' ? 'border-emerald-500 text-emerald-600 bg-emerald-50/30 rounded-t-xl' : 'border-transparent text-slate-400 hover:text-navy-900'}`}>
                                    <Pill size={16} /> Medication Admin (MAR)
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
                                {activeTab === 'Vitals' ? (
                                    <>
                                        <div className="p-6 bg-white border border-slate-100 rounded-[24px] shadow-sm flex items-end gap-6 shadow-xl shadow-slate-200/20">
                                            <div className="flex-1 grid grid-cols-4 gap-6">
                                                {[
                                                    { label: 'BP (Systolic/D)', key: 'bp', ph: '120/80', icon: <Activity size={12} /> },
                                                    { label: 'Heart Rate', key: 'hr', ph: '72', icon: <HeartPulse size={12} /> },
                                                    { label: 'Temp (°F)', key: 'temp', ph: '98.6', icon: <Thermometer size={12} /> },
                                                    { label: 'SpO2 (%)', key: 'spo2', ph: '98', icon: <Monitor size={12} /> },
                                                ].map(f => (
                                                    <div key={f.key}>
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block flex items-center gap-1.5">{f.icon}{f.label}</label>
                                                        <input value={vitalsForm[f.key]} onChange={e => setVitalsForm({ ...vitalsForm, [f.key]: e.target.value })} placeholder={f.ph} className="input-field" />
                                                    </div>
                                                ))}
                                            </div>
                                            <button onClick={() => submitLog('Vitals')} disabled={saving} className="h-11 px-8 bg-cyan-500 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.1em] shadow-lg shadow-cyan-500/20 hover:bg-cyan-600 transition-all flex items-center gap-2">
                                                <Plus size={16} /> Chart Ops
                                            </button>
                                        </div>

                                        <div className="data-table-wrapper border border-slate-100 rounded-[24px]">
                                            <table className="data-table">
                                                <thead>
                                                    <tr>
                                                        <th>Sync Time</th>
                                                        <th>Vitals Telemetry Stream</th>
                                                        <th style={{ textAlign: 'right' }}>Signed By</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {vitalsLogs.length === 0 ? (
                                                        <tr><td colSpan="3" className="text-center py-16 text-slate-400 font-bold uppercase text-[10px] tracking-widest italic opacity-60">No vitals charted for current window</td></tr>
                                                    ) : vitalsLogs.map(log => (
                                                        <tr key={log.id}>
                                                            <td>
                                                                <div className="text-[13px] font-black text-navy-900">{log.time}</div>
                                                                <div className="text-[10px] text-slate-400 font-bold">{log.date}</div>
                                                            </td>
                                                            <td><div className="px-3 py-1.5 bg-slate-100 rounded-lg text-[11px] font-black text-navy-900 font-mono inline-block">{log.notes}</div></td>
                                                            <td style={{ textAlign: 'right' }}><div className="text-[11px] font-black text-cyan-600 uppercase tracking-widest">{log.doctorName}</div></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-6 bg-white border border-emerald-100 rounded-[24px] shadow-sm flex flex-col gap-6 border-l-4 border-l-emerald-500">
                                            <div className="grid grid-cols-4 gap-6">
                                                <div className="col-span-2">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Biological Component / Drug Name</label>
                                                    <input value={marForm.drugName} onChange={e => setMarForm({ ...marForm, drugName: e.target.value })} placeholder="E.g. Inj. Meropenem" className="input-field" />
                                                </div>
                                                <div>
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Dose Registry</label>
                                                    <input value={marForm.dose} onChange={e => setMarForm({ ...marForm, dose: e.target.value })} placeholder="1g" className="input-field" />
                                                </div>
                                                <div>
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Route Logic</label>
                                                    <select value={marForm.route} onChange={e => setMarForm({ ...marForm, route: e.target.value })} className="input-field">
                                                        {['Oral', 'IV', 'IM', 'Sub-Q', 'Topical', 'Inhalation'].map(r => <option key={r}>{r}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex gap-6 items-end">
                                                <div className="flex-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Clinical Observations / Remarks</label>
                                                    <input value={marForm.comments} onChange={e => setMarForm({ ...marForm, comments: e.target.value })} placeholder="Patient stable, monitoring post-induction..." className="input-field" />
                                                </div>
                                                <button onClick={() => submitLog('Medication')} disabled={saving} className="h-11 px-8 bg-emerald-600 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.1em] shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center gap-2">
                                                    <CheckCircle2 size={16} /> Record Admin
                                                </button>
                                            </div>
                                        </div>

                                        <div className="data-table-wrapper border border-slate-100 rounded-[24px]">
                                            <table className="data-table">
                                                <thead>
                                                    <tr>
                                                        <th>Admin Time</th>
                                                        <th>Medication Specifications</th>
                                                        <th style={{ textAlign: 'right' }}>Registered By</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {medicationLogs.length === 0 ? (
                                                        <tr><td colSpan="3" className="text-center py-16 text-slate-400 font-bold uppercase text-[10px] tracking-widest italic opacity-60">No medication logs recorded yet</td></tr>
                                                    ) : medicationLogs.map(log => (
                                                        <tr key={log.id}>
                                                            <td>
                                                                <div className="text-[13px] font-black text-emerald-600">{log.time}</div>
                                                                <div className="text-[10px] text-slate-400 font-bold">{log.date}</div>
                                                            </td>
                                                            <td>
                                                                <div className="text-[14px] font-black text-navy-900">{log.notes.split('—')[0]}</div>
                                                                <div className="text-[11px] font-bold text-slate-400 mt-1 italic">{log.notes.split('—')[1]}</div>
                                                            </td>
                                                            <td style={{ textAlign: 'right' }}><div className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">{log.doctorName}</div></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
