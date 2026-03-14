'use client';
import { useState, useEffect } from 'react';
import { Activity, Stethoscope, Droplet, Plus, User, Syringe, NotepadText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function NursingStationPage() {
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterUnit, setFilterUnit] = useState('All Wards');

    // Vitals Form Flowsheet State
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [tab, setTab] = useState('vitals'); // vitals, rx, notes
    const [saving, setSaving] = useState(false);

    // Modals Data
    const [vitals, setVitals] = useState({ bp: '', pulse: '', temp: '', spo2: '' });
    const [drugName, setDrugName] = useState('');
    const [noteText, setNoteText] = useState('');

    const fetchIPD = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/ipd');
            if (res.ok) {
                const data = await res.json();
                // Nursing station only cares about currently admitted patients
                setAdmissions((data.appointments || []).filter(a => ['Admitted', 'Scheduled'].includes(a.status) && a.ward));
            }
        } catch (e) { console.error('Error fetching IPD list', e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchIPD(); }, []);

    const wards = ['All Wards', ...new Set(admissions.map(a => a.ward))];
    const filtered = filterUnit === 'All Wards' ? admissions : admissions.filter(a => a.ward === filterUnit);

    const submitLog = async (type) => {
        setSaving(true);
        let payload = null;

        if (type === 'vitals') {
            if (!vitals.bp || !vitals.pulse) { setSaving(false); return alert('BP and Pulse are mandatory.'); }
            payload = { ...vitals };
        } else if (type === 'medication') {
            if (!drugName) { setSaving(false); return alert('Enter drug name administered.'); }
            payload = { drugName };
        } else {
            if (!noteText) { setSaving(false); return alert('Note cannot be empty.'); }
            payload = { note: noteText };
        }

        try {
            const res = await fetch('/api/ipd/nursing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentId: selectedPatient.id, type, noteData: payload })
            });

            if (res.ok) {
                const data = await res.json();
                // Instantly update UI without full refresh
                setAdmissions(prev => prev.map(a => {
                    if (a.id === selectedPatient.id) {
                        return { ...a, admitNotes: a.admitNotes ? `${data.newLog}\n${a.admitNotes}` : data.newLog };
                    }
                    return a;
                }));
                // Also update the local selected patient model
                setSelectedPatient(prev => ({
                    ...prev,
                    admitNotes: prev.admitNotes ? `${data.newLog}\n${prev.admitNotes}` : data.newLog
                }));

                // Reset forms
                setVitals({ bp: '', pulse: '', temp: '', spo2: '' });
                setDrugName('');
                setNoteText('');
                alert('Flowsheet successfully updated!');
            } else {
                alert('Failed to log nursing note.');
            }
        } catch (err) {
            alert('Network error occurred.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fade-in">
            <div className="dashboard-header-row mb-6">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Nursing Station Console</h1>
                    <p className="page-header__subtitle">Hourly vitals telemetry, flowsheet charts, and MAR check-offs.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Left Side: Ward List */}
                <div className="col-span-1 border-r border-slate-200 pr-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <User size={18} className="text-emerald-500" /> Active Roster
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {wards.map(w => (
                            <button key={w} onClick={() => setFilterUnit(w)}
                                className={`px-3 py-1 text-xs font-semibold rounded-full border ${filterUnit === w ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}>
                                {w}
                            </button>
                        ))}
                    </div>

                    {loading ? <p className="text-sm text-slate-500 italic">Loading ward telemetry...</p>
                        : filtered.length === 0 ? <p className="text-sm text-slate-500 italic">No patients in this unit.</p>
                            : (
                                <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                                    {filtered.map(patient => (
                                        <div key={patient.id}
                                            onClick={() => setSelectedPatient(patient)}
                                            className={`p-3 rounded-xl border cursor-pointer hover:shadow transition-shadow ${selectedPatient?.id === patient.id ? 'border-emerald-400 bg-emerald-50 ring-1 ring-emerald-400' : 'border-slate-200 bg-white'}`}>
                                            <div className="font-bold text-sm text-slate-800 mb-1">{patient.patientName}</div>
                                            <div className="flex justify-between items-center text-xs">
                                                <div className="text-slate-600 font-medium">B: <span className="text-emerald-700">{patient.bed}</span></div>
                                                <div className="bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono">{patient.apptCode}</div>
                                            </div>
                                            {/* Small vitals preview if available */}
                                            <div className="mt-2 text-[10px] text-slate-400 truncate">
                                                Last Note: {(patient.admitNotes || 'No notes yet.').substring(0, 30)}...
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                </div>

                {/* Right Side: Electronic Flowsheet */}
                <div className="col-span-3">
                    {!selectedPatient ? (
                        <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400 p-12">
                            <Activity size={48} className="mb-4 opacity-50 text-emerald-500" />
                            <h3 className="text-lg font-bold text-slate-500">No Patient Selected</h3>
                            <p className="text-sm">Click a patient from the ward roster to open their charting flowsheet.</p>
                        </div>
                    ) : (
                        <div className="card h-full flex flex-col">
                            {/* Patient Demographics Banner */}
                            <div className="bg-slate-800 rounded-t-xl p-5 text-white flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        {selectedPatient.patientName}
                                        <span className="bg-white/20 text-white text-xs px-2 py-1 rounded font-mono ml-2 tracking-wider">{selectedPatient.apptCode}</span>
                                    </h2>
                                    <div className="text-sm text-slate-300 mt-1 flex items-center gap-4">
                                        <span><strong className="text-white">Ward:</strong> {selectedPatient.ward}</span>
                                        <span><strong className="text-white">Bed:</strong> {selectedPatient.bed}</span>
                                        <span><strong className="text-white">Attending:</strong> {selectedPatient.doctorName}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Admitted</div>
                                    <div className="text-slate-200">{new Date(selectedPatient.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>

                            {/* Charting Tabs */}
                            <div className="flex border-b border-slate-200 bg-slate-50">
                                <button onClick={() => setTab('vitals')} className={`px-6 py-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors ${tab === 'vitals' ? 'border-emerald-500 text-emerald-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                                    <Activity size={16} /> Enter Vitals
                                </button>
                                <button onClick={() => setTab('rx')} className={`px-6 py-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors ${tab === 'rx' ? 'border-purple-500 text-purple-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                                    <Syringe size={16} /> Administer Drug (MAR)
                                </button>
                                <button onClick={() => setTab('notes')} className={`px-6 py-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors ${tab === 'notes' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                                    <NotepadText size={16} /> General Nursing Note
                                </button>
                            </div>

                            {/* Active Charting Area */}
                            <div className="p-6 bg-white flex-1 border-b border-slate-200">
                                {tab === 'vitals' && (
                                    <div className="grid grid-cols-2 gap-4 max-w-lg">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Blood Pressure (mmHg)</label>
                                            <input type="text" placeholder="120/80" value={vitals.bp} onChange={e => setVitals({ ...vitals, bp: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pulse Rate (bpm)</label>
                                            <input type="number" placeholder="72" value={vitals.pulse} onChange={e => setVitals({ ...vitals, pulse: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Temperature (°F)</label>
                                            <input type="text" placeholder="98.6" value={vitals.temp} onChange={e => setVitals({ ...vitals, temp: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">SpO2 (%)</label>
                                            <input type="number" placeholder="99" value={vitals.spo2} onChange={e => setVitals({ ...vitals, spo2: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono" />
                                        </div>
                                        <div className="col-span-2 pt-2">
                                            <button onClick={() => submitLog('vitals')} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow flex items-center gap-2 transition-colors disabled:opacity-50">
                                                {saving ? 'Saving...' : <><CheckCircle2 size={16} /> Save Vitals Log</>}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {tab === 'rx' && (
                                    <div className="max-w-md">
                                        <label className="block text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">Drug Administration Check-Off</label>
                                        <p className="text-sm text-slate-500 mb-4">Log medication exactly when swallowed/injected to maintain accurate MAR tracing.</p>
                                        <input type="text" placeholder="E.g., IV Paracetamol 1000mg slowly" value={drugName} onChange={e => setDrugName(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 mb-4 font-medium" />
                                        <button onClick={() => submitLog('medication')} disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow flex items-center gap-2 transition-colors disabled:opacity-50">
                                            {saving ? 'Logging...' : <><Syringe size={16} /> Mark as Given</>}
                                        </button>
                                    </div>
                                )}

                                {tab === 'notes' && (
                                    <div className="max-w-xl">
                                        <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Clinical Shift Note / Assessment</label>
                                        <textarea rows="4" placeholder="Patient reporting mild nausea. Doctor on call informed. IV fluids running..." value={noteText} onChange={e => setNoteText(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-4 text-sm leading-relaxed" />
                                        <button onClick={() => submitLog('note')} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow flex items-center gap-2 transition-colors disabled:opacity-50">
                                            {saving ? 'Signing...' : <><NotepadText size={16} /> Sign Shift Note</>}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Ongoing Patient Chart Read-only View */}
                            <div className="p-6 overflow-y-auto flex-1 bg-slate-50 rounded-b-xl">
                                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4">Patient Chart & Telemetry Logs</h3>
                                {!selectedPatient.admitNotes ? (
                                    <p className="text-sm text-slate-400 italic">No telemetry or nursing notes charted yet.</p>
                                ) : (
                                    <div className="font-mono text-[13px] leading-relaxed text-slate-700 bg-white p-4 border border-slate-200 rounded-lg shadow-sm whitespace-pre-wrap">
                                        {selectedPatient.admitNotes}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
