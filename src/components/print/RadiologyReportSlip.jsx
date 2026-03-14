import React from 'react';
import { FileText, User, Calendar, Activity, ShieldAlert, BadgeInfo } from 'lucide-react';
import PrintWrapper from './PrintWrapper';
import PrintHeader from './PrintHeader';
import PrintFooter from './PrintFooter';

export default function RadiologyReportSlip({ order }) {
    if (!order) return null;

    const { report, patient } = order;

    return (
        <PrintWrapper documentTitle={`Report_${order.orderCode}`}>
            <div className="p-10 font-sans text-slate-800 bg-white min-h-[297mm] flex flex-col">
                {/* Standardized Header */}
                <PrintHeader title="Radiology Report" subtitle={order.orderCode} />

                {/* Patient Information Bar */}
                <div className="grid grid-cols-2 gap-8 mb-8 bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Details</div>
                        <div className="text-lg font-black text-slate-900 line-clamp-1">{patient?.firstName} {patient?.lastName}</div>
                        <div className="flex gap-4 text-xs font-bold text-slate-500">
                            <span>{patient?.age}y / {patient?.gender}</span>
                            <span>UHID: {patient?.patientCode}</span>
                        </div>
                    </div>
                    <div className="text-right space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Study Information</div>
                        <div className="text-base font-black text-slate-800">{order.modality} {order.procedureName}</div>
                        <div className="text-xs font-medium text-slate-500">Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                </div>

                {/* Clinical History */}
                <div className="mb-8 border-b border-slate-100 pb-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <BadgeInfo size={14} className="text-blue-500" /> Clinical Indication
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        {order.clinicalHistory || 'No history provided by referring physician.'}
                    </p>
                </div>

                {/* Findings Section */}
                <div className="mb-8 flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <FileText size={14} className="text-blue-500" /> Radiological Findings
                        </h3>
                        {report?.criticalAlert && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse border border-red-200">
                                <ShieldAlert size={12} /> Critical Value
                            </div>
                        )}
                    </div>

                    <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-medium min-h-[300px] border border-slate-100 p-6 rounded-xl bg-white shadow-inner">
                        {report?.findings || 'Final report pending...'}
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Activity size={14} className="text-blue-500" /> Impression
                        </h3>
                        <p className="text-sm text-slate-900 font-bold leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                            {report?.impression || 'PROVISIONAL'}
                        </p>
                    </div>
                </div>

                {/* Standardized Footer */}
                <div className="mt-auto">
                    <PrintFooter systemId={order.id} doctorName={report?.radiologistName || 'Duty Radiologist'} />
                    <p className="text-[10px] text-slate-400 italic text-center mt-4">
                        * This is an electronic report authorized by the reporting radiologist. Clinical correlation is advised.
                    </p>
                </div>
            </div>
        </PrintWrapper>
    );
}
