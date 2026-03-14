import React from 'react';
import { Bug, Thermometer, User, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import PrintWrapper from './PrintWrapper';
import PrintHeader from './PrintHeader';
import PrintFooter from './PrintFooter';

export default function MicrobiologyLabSlip({ request }) {
    if (!request) return null;

    const { sensitivities, patient } = request;
    const organism = sensitivities?.[0]?.organism;

    return (
        <PrintWrapper documentTitle={`Micro_Report_${request.trackingId}`}>
            <div className="p-10 font-sans text-slate-800 bg-white min-h-[297mm] flex flex-col">
                {/* Standardized Header */}
                <PrintHeader title="Microbiology Culture & Sensitivity" subtitle={`Lab ID: ${request.trackingId}`} />

                {/* Patient / Sample Information */}
                <div className="grid grid-cols-2 gap-8 mb-8 bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Details</div>
                        <div className="text-lg font-black text-slate-900">{patient?.firstName} {patient?.lastName}</div>
                        <div className="text-xs font-bold text-slate-500">UHID: {patient?.patientCode} • Dept: {request.department || 'IPD'}</div>
                    </div>
                    <div className="text-right space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sample Information</div>
                        <div className="text-base font-black text-slate-800">{request.testName}</div>
                        <div className="text-xs font-medium text-slate-500">Source: Blood / BACTEC • Date: {new Date(request.createdAt).toLocaleDateString('en-IN')}</div>
                    </div>
                </div>

                {/* Culture Result */}
                <div className="mb-10 bg-blue-50 border border-blue-100 p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-10"><Bug size={100} /></div>
                    <div className="relative z-10">
                        <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            Culture Result
                        </h3>
                        <div className="text-2xl font-black text-blue-900 italic">
                            {organism ? organism.name : 'No Growth After 48 Hours'}
                        </div>
                        {organism && <div className="text-xs font-bold text-blue-600 mt-1 uppercase tracking-wider">{organism.category} • {organism.gramStain}</div>}
                    </div>
                </div>

                {/* Sensitivity Table */}
                {sensitivities && sensitivities.length > 0 && (
                    <div className="mb-12 flex-1">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Activity size={14} className="text-indigo-500" /> Antibiotic Sensitivity Testing (AST)
                        </h3>
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-900 text-white">
                                    <th className="py-3 px-4 text-left font-black tracking-tight rounded-tl-lg">Antibiotic / Drug</th>
                                    <th className="py-3 px-4 text-center font-black tracking-tight">MIC Value</th>
                                    <th className="py-3 px-4 text-right font-black tracking-tight rounded-tr-lg">Sensitivity Result</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 border-x border-b border-slate-200">
                                {sensitivities.map((s, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50">
                                        <td className="py-3 px-4 font-bold text-slate-800">{s.antibiotic}</td>
                                        <td className="py-3 px-4 text-center font-mono text-slate-500">{s.micValue || 'N/A'}</td>
                                        <td className="py-3 px-4 text-right">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${s.result === 'Sensitive' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                    s.result === 'Resistant' ? 'bg-red-50 text-red-700 border-red-100' :
                                                        'bg-amber-50 text-amber-700 border-amber-100'
                                                }`}>
                                                {s.result} ({s.result.charAt(0)})
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Legend */}
                        <div className="mt-4 flex gap-6 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> S - Sensitive</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> R - Resistant</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> I - Intermediate</div>
                        </div>
                    </div>
                )}

                {/* Footnotes */}
                <div className="mt-auto pt-6 border-t border-slate-100">
                    <div className="flex gap-4 items-start mb-6">
                        <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                        <div>
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Antibiotic Stewardship Note</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed italic">
                                Therapy should be based on clinical condition and pharmacological properties of the agents.
                                Report MDR isolates to infection control. MIC values are determined by Vitek/BACTEC automation.
                            </p>
                        </div>
                    </div>
                    <PrintFooter systemId={request.id} doctorName="Lab Superintendent" />
                </div>
            </div>
        </PrintWrapper>
    );
}
