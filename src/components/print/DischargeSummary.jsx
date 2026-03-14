import React from 'react';
import { Home, ClipboardList, Pill, Calendar, User, Activity, CheckCircle2 } from 'lucide-react';
import PrintWrapper from './PrintWrapper';
import PrintHeader from './PrintHeader';
import PrintFooter from './PrintFooter';

export default function DischargeSummary({ admission, prescriptions = [] }) {
    if (!admission) return null;

    const { patient } = admission;
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <PrintWrapper documentTitle={`Discharge_${patient?.lastName || 'Patient'}`}>
            <div className="p-10 font-sans text-slate-800 bg-white min-h-[297mm] flex flex-col">
                {/* Standardized Header */}
                <PrintHeader title="Discharge Summary" subtitle={`IPD-${admission.id.substring(0, 6).toUpperCase()}`} />

                {/* Admission Timeline Grid */}
                <div className="grid grid-cols-3 gap-6 mb-10 border-y border-slate-100 py-6">
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Admission</div>
                        <div className="text-sm font-bold text-slate-800">{new Date(admission.createdAt).toLocaleDateString('en-IN')}</div>
                    </div>
                    <div className="space-y-1 text-center">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Discharge</div>
                        <div className="text-sm font-black text-blue-600 underline underline-offset-4">{today}</div>
                    </div>
                    <div className="space-y-1 text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration of Stay</div>
                        <div className="text-sm font-bold text-slate-800">
                            {Math.ceil((new Date() - new Date(admission.createdAt)) / (1000 * 60 * 60 * 24))} Days
                        </div>
                    </div>
                </div>

                {/* Patient / Doctor Meta */}
                <div className="grid grid-cols-2 gap-10 mb-10">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <User size={14} className="text-blue-500" /> Patient Bio-Data
                        </h3>
                        <div className="space-y-2">
                            <div className="text-xl font-black text-slate-900">{patient?.firstName} {patient?.lastName}</div>
                            <div className="text-sm font-bold text-slate-600">UHID: {patient?.patientCode} • {patient?.age}y / {patient?.gender}</div>
                            <div className="text-xs text-slate-400 font-medium">Address: {patient?.address || 'Available on Records'}</div>
                        </div>
                    </div>
                    <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Activity size={14} className="text-indigo-500" /> Clinical Care Team
                        </h3>
                        <div className="space-y-2">
                            <div className="text-base font-black text-slate-800">DR. {admission.doctorName?.toUpperCase()}</div>
                            <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{admission.department || 'General Medicine'}</div>
                            <div className="text-xs text-slate-500 font-medium">Primary Consultant</div>
                        </div>
                    </div>
                </div>

                {/* Main Clinical Sections */}
                <div className="space-y-8 mb-12 flex-1">
                    <section>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 border-b-2 border-slate-100 pb-1 flex items-center gap-2">
                            <ClipboardList size={14} className="text-blue-500" /> Final Diagnosis
                        </h3>
                        <p className="text-sm font-black text-slate-900 border-l-4 border-blue-500 pl-4 py-2">
                            {admission.diagnosis || 'Diagnosis Pending Final Review'}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 border-b-2 border-slate-100 pb-1">Clinical Course & Procedures</h3>
                        <div className="text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap italic">
                            {admission.admitNotes || 'The patient was admitted for management of the above diagnosis. Treated with standard protocols. Course in hospital was stable. Vital signs at discharge: Stable.'}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b-2 border-slate-100 pb-1 flex items-center gap-2">
                            <Pill size={14} className="text-emerald-500" /> Discharge Medications
                        </h3>
                        {prescriptions.length > 0 ? (
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b-2 border-slate-900 text-left">
                                        <th className="py-2 px-2 font-black">Medicine</th>
                                        <th className="py-2 px-2 font-black">Schedule</th>
                                        <th className="py-2 px-2 text-right font-black">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 border-b border-slate-100">
                                    {prescriptions.flatMap(p => p.items || []).map((m, idx) => (
                                        <tr key={idx}>
                                            <td className="py-3 px-2">
                                                <div className="font-bold text-slate-800">{m.medicineName}</div>
                                                <div className="text-[10px] text-slate-400">{m.dosage}</div>
                                            </td>
                                            <td className="py-3 px-2 font-medium text-slate-600">{m.frequency} — {m.duration}</td>
                                            <td className="py-3 px-2 text-right font-black text-slate-400"># {m.quantity || 'Stat'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-sm text-slate-400 italic">No medications prescribed on discharge.</p>
                        )}
                    </section>

                    <section className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                        <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Home size={14} className="text-amber-500" /> Follow-up Instructions
                        </h3>
                        <div className="flex justify-between items-start">
                            <p className="text-sm text-amber-900 font-medium leading-relaxed max-w-[70%]">
                                Visit the OPD on {new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString()} for wound review / repeat checkup. Contact ER immediately if fever or severe pain develops.
                            </p>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-1">Follow up with</span>
                                <span className="text-sm font-black text-amber-700">DR. {admission.doctorName?.toUpperCase()}</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer / Auth */}
                <div className="mt-auto">
                    <div className="flex justify-between items-end mb-8 px-10">
                        <div className="text-center">
                            <div className="w-32 h-1 border-b border-slate-300 mb-2 mx-auto"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Superintendent</span>
                        </div>
                        <div className="text-center">
                            <div className="w-32 h-1 border-b border-slate-300 mb-2 mx-auto"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Consultant</span>
                        </div>
                    </div>
                    <PrintFooter systemId={admission.id} doctorName={admission.doctorName} />
                </div>
            </div>
        </PrintWrapper>
    );
}
