import { Pill, Activity, Calendar, User, UserCheck } from 'lucide-react';
import PrintWrapper from './PrintWrapper';
import PrintHeader from './PrintHeader';
import PrintFooter from './PrintFooter';

export default function PrescriptionSlip({ prescription }) {
    if (!prescription) return null;

    return (
        <PrintWrapper documentTitle={`Rx_${prescription.rxCode}`}>
            <div className="p-10 font-sans text-slate-800 bg-white min-h-[297mm] flex flex-col">
                {/* Standardized Header */}
                <PrintHeader title="Rx" subtitle={prescription.rxCode} />

                {/* Patient / Date Meta */}
                <div className="grid grid-cols-2 gap-8 mb-10 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Details</div>
                        <div className="text-lg font-black text-slate-800 flex items-center gap-2">
                             {prescription.patientName}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">UHID: {prescription.patientUhId || 'N/A'}</div>
                    </div>
                    <div className="text-right space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultation Date</div>
                        <div className="text-lg font-black text-slate-800 flex items-center justify-end gap-2 text-right">
                            {new Date(prescription.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">Follow-up: {prescription.followUpDate || 'As Advised'}</div>
                    </div>
                </div>

                {/* Vitals Section - If available */}
                {(prescription.bp || prescription.weight || prescription.temperature) && (
                    <div className="flex gap-6 mb-10 border-y border-slate-100 py-3">
                        {prescription.bp && (
                            <div className="flex-1 text-center border-r border-slate-100">
                                <div className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Blood Pressure</div>
                                <div className="text-sm font-bold text-slate-700">{prescription.bp} <span className="text-[10px] text-slate-400">mmHg</span></div>
                            </div>
                        )}
                        {prescription.weight && (
                            <div className="flex-1 text-center border-r border-slate-100">
                                <div className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Body Weight</div>
                                <div className="text-sm font-bold text-slate-700">{prescription.weight} <span className="text-[10px] text-slate-400">Kg</span></div>
                            </div>
                        )}
                        {prescription.weight && (
                            <div className="flex-1 text-center border-r border-slate-100">
                                <div className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">BMI</div>
                                <div className="text-sm font-black text-blue-600">
                                    {(parseFloat(prescription.weight.split(' ')[0]) / (1.7 * 1.7)).toFixed(1)}
                                </div>
                            </div>
                        )}
                        {prescription.temperature && (
                            <div className="flex-1 text-center">
                                <div className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Temperature</div>
                                <div className="text-sm font-bold text-slate-700">{prescription.temperature} <span className="text-[10px] text-slate-400">°F</span></div>
                            </div>
                        )}
                    </div>
                )}

                {/* Clinical Context */}
                <div className="grid grid-cols-2 gap-10 mb-10">
                    <div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">Chief Complaints</h3>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium italic">"{prescription.chiefComplaint || 'No complaints recorded.'}"</p>
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">Diagnosis</h3>
                        <p className="text-sm text-slate-800 leading-relaxed font-bold">{prescription.diagnosis || 'Provisional Diagnosis'}</p>
                    </div>
                </div>

                {/* Medications Table */}
                <div className="mb-12">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Pill size={14} className="text-blue-500"/> Medications & Dosage
                    </h3>
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-white">
                                <th className="py-3 px-4 text-left font-black tracking-tight rounded-tl-lg">Medicine Name</th>
                                <th className="py-3 px-4 text-left font-black tracking-tight">Schedule / Frequency</th>
                                <th className="py-3 px-4 text-right font-black tracking-tight rounded-tr-lg">Duration</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {prescription.items && prescription.items.length > 0 ? (
                                prescription.items.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        <td className="py-4 px-4">
                                            <div className="font-bold text-slate-800">{item.medicineName}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase">{item.genericName || 'Generic'} · {item.dosage}</div>
                                        </td>
                                        <td className="py-4 px-4 font-medium text-slate-700">
                                            {item.frequency}
                                            {item.instructions && <p className="text-[11px] text-blue-600 mt-0.5 mt-1">Note: {item.instructions}</p>}
                                        </td>
                                        <td className="py-4 px-4 text-right font-black text-slate-500">
                                            {item.duration}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="py-12 text-center text-slate-400 italic font-medium">No medications prescribed.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footnotes */}
                <div className="mb-20">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">Additional Advice</h3>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{prescription.clinicalNotes || 'Maintain adequate hydration and rest.'}</p>
                </div>

                {/* Standardized Footer */}
                <PrintFooter systemId={prescription.id} doctorName={prescription.doctorName} />
            </div>
        </PrintWrapper>
    );
}

