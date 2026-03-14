'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileText, CheckCircle, Calculator, Printer, Activity } from 'lucide-react';
import Link from 'next/link';
import PrintWrapper from '@/components/print/PrintWrapper';

export default function DischargePage() {
    const params = useParams();
    const router = useRouter();
    const [admission, setAdmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // IPD Billing Form State
    const [dischargeNotes, setDischargeNotes] = useState('');
    const [finalDiagnosis, setFinalDiagnosis] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');

    // Itemized Bill
    const [roomCharges, setRoomCharges] = useState(0);
    const [doctorFee, setDoctorFee] = useState(0);
    const [nursingFee, setNursingFee] = useState(0);
    const [medicationFee, setMedicationFee] = useState(0);
    const [otherCharges, setOtherCharges] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('Cash');

    useEffect(() => {
        const fetchAdmission = async () => {
            try {
                // Fetch existing IPD appointment directly (Next.js server action/route)
                const res = await fetch(`/api/appointments/${params.id}`);
                const data = await res.json();
                if (data.appointment) {
                    setAdmission(data.appointment);
                    // Pre-fill some defaults based on length of stay
                    const admitDate = new Date(data.appointment.createdAt);
                    const days = Math.max(1, Math.ceil((new Date() - admitDate) / (1000 * 60 * 60 * 24)));
                    setRoomCharges(days * 1500); // e.g. 1500 per day base ward
                    setNursingFee(days * 400);  // 400 per day nursing
                    setDoctorFee(days * 1000); // 1000 per day visit
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAdmission();
    }, [params.id]);

    const subtotal = Number(roomCharges) + Number(doctorFee) + Number(nursingFee) + Number(medicationFee) + Number(otherCharges);
    const discountAmt = subtotal * (Number(discount) / 100);
    const netTotal = subtotal - discountAmt; // Optional Tax logic can be added

    const handleDischarge = async (e) => {
        e.preventDefault();
        if (admission.status === 'Discharged') return;

        setSaving(true);
        try {
            // 1. Create Final Invoice
            const invRes = await fetch('/api/billing/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientName: admission.patientName,
                    patientId: admission.patientId,
                    serviceType: 'IPD Final Bill',
                    amount: subtotal,
                    discount: Number(discount),
                    paymentMethod,
                    notes: `Discharge Bill for ${admission.apptCode}. ${finalDiagnosis}`
                })
            });

            if (!invRes.ok) throw new Error('Failed to create invoice');

            // 2. Update Appointment Status & Empty the bed (done via dedicated discharge endpoint)
            const disRes = await fetch(`/api/ipd/discharge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    appointmentId: admission.id,
                    dischargeNotes,
                    finalDiagnosis,
                    followUpDate
                })
            });

            if (disRes.ok) {
                setAdmission(prev => ({ ...prev, status: 'Discharged' }));
                alert('Patient Successfully Discharged and Billed!');
            }
        } catch (err) {
            alert('Error discharging patient.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading IPD Case File...</div>;
    if (!admission) return <div style={{ padding: '60px', textAlign: 'center' }}>Admissions Record Not Found.</div>;

    const isDischarged = admission.status === 'Discharged';

    return (
        <div className="fade-in">
            <div className="dashboard-header-row mb-6 print:hidden">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/ipd/patients" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title" style={{ marginBottom: '4px' }}>IPD Discharge & Final Billing</h1>
                        <p className="page-header__subtitle">Review stay, generate discharge summary, and clear dues.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:hidden">
                {/* Clinical Section */}
                <div className="card p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-500" /> Clinical Summary</h2>

                    <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-lg">
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-semibold">Patient Name</span>
                            <div className="font-bold text-slate-800">{admission.patientName}</div>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-semibold">IPD Code / Room</span>
                            <div className="font-mono text-sm text-slate-700">{admission.apptCode} | {admission.ward} - {admission.bed}</div>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-semibold">Admitted On</span>
                            <div className="text-sm font-medium">{new Date(admission.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-semibold">Attending Doctor</span>
                            <div className="text-sm font-medium">{admission.doctorName}</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Final Diagnosis <span className="text-red-500">*</span></label>
                            <input type="text" value={finalDiagnosis} onChange={e => setFinalDiagnosis(e.target.value)} disabled={isDischarged} className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. Acute Appendicitis (Post-Op)" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Discharge Condition & Notes</label>
                            <textarea rows="4" value={dischargeNotes} onChange={e => setDischargeNotes(e.target.value)} disabled={isDischarged} className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Vitals stable. Discharge medications prescribed. Patient advised soft diet." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Follow-Up Date</label>
                            <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} disabled={isDischarged} className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>
                </div>

                {/* Financial Section */}
                <div className="card p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Calculator className="w-5 h-5 text-emerald-500" /> Final Master Bill</h2>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-slate-600">Room & Bed Charges</label>
                            <div className="flex items-center">
                                <span className="bg-slate-100 text-slate-500 px-3 py-2 rounded-l border border-r-0 border-slate-300">₹</span>
                                <input type="number" value={roomCharges} onChange={e => setRoomCharges(e.target.value)} disabled={isDischarged} className="w-32 p-2 border border-slate-300 rounded-r text-right font-medium outline-none" />
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-slate-600">Doctor & Surgery Fee</label>
                            <div className="flex items-center">
                                <span className="bg-slate-100 text-slate-500 px-3 py-2 rounded-l border border-r-0 border-slate-300">₹</span>
                                <input type="number" value={doctorFee} onChange={e => setDoctorFee(e.target.value)} disabled={isDischarged} className="w-32 p-2 border border-slate-300 rounded-r text-right font-medium outline-none" />
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-slate-600">Nursing Fee</label>
                            <div className="flex items-center">
                                <span className="bg-slate-100 text-slate-500 px-3 py-2 rounded-l border border-r-0 border-slate-300">₹</span>
                                <input type="number" value={nursingFee} onChange={e => setNursingFee(e.target.value)} disabled={isDischarged} className="w-32 p-2 border border-slate-300 rounded-r text-right font-medium outline-none" />
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-slate-600">Pharmacy & Medicines</label>
                            <div className="flex items-center">
                                <span className="bg-slate-100 text-slate-500 px-3 py-2 rounded-l border border-r-0 border-slate-300">₹</span>
                                <input type="number" value={medicationFee} onChange={e => setMedicationFee(e.target.value)} disabled={isDischarged} className="w-32 p-2 border border-slate-300 rounded-r text-right font-medium outline-none" />
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-slate-600">Other (Diet, Consumables)</label>
                            <div className="flex items-center">
                                <span className="bg-slate-100 text-slate-500 px-3 py-2 rounded-l border border-r-0 border-slate-300">₹</span>
                                <input type="number" value={otherCharges} onChange={e => setOtherCharges(e.target.value)} disabled={isDischarged} className="w-32 p-2 border border-slate-300 rounded-r text-right font-medium outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-600">Subtotal</span>
                            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-slate-600">Apply Discount (%)</span>
                            <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} disabled={isDischarged} max="100" min="0" className="w-20 p-1 text-sm border border-slate-300 rounded text-center outline-none" />
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-slate-300">
                            <span className="text-lg font-bold text-slate-800">Net Payable</span>
                            <span className="text-2xl font-bold text-emerald-600">₹{netTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    {!isDischarged && (
                        <div className="mt-6">
                            <button onClick={handleDischarge} disabled={saving || !finalDiagnosis} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow disabled:opacity-50 transition-colors flex justify-center items-center gap-2">
                                {saving ? 'Processing...' : <><CheckCircle className="w-5 h-5" /> Finalize & Discharge Patient</>}
                            </button>
                        </div>
                    )}
                    {isDischarged && (
                        <div className="mt-6 p-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-center font-medium flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5" /> Patient Discharged & Billed
                        </div>
                    )}
                </div>
            </div>

            {/* Generated Document utilizing our Universal Printer */}
            {isDischarged && (
                <div className="mt-8">
                    <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider print:hidden">Generated Official Document</h3>
                    <PrintWrapper documentTitle={`Discharge_${admission.apptCode}`}>
                        {/* THE PIXEL PERFECT DOCUMENT A4 VIEW */}
                        <div className="p-10 font-sans text-slate-800">
                            {/* Hospital Header */}
                            <div className="text-center border-b-2 border-slate-800 pb-6 mb-8">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">NEXORA HOSPITAL</h1>
                                <p className="text-sm text-slate-500 mt-1">123 Health Avenue, MedCity • Ph: +1 800-NEXORA • admin@nexora.health</p>
                                <div className="mt-4 uppercase tracking-widest text-sm font-bold bg-slate-100 inline-block px-4 py-1 rounded">Discharge Summary & Invoice</div>
                            </div>

                            {/* Patient Demographics */}
                            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                                <div><b className="text-slate-500 font-semibold w-28 inline-block">Patient Name:</b> <span className="font-bold">{admission.patientName}</span></div>
                                <div><b className="text-slate-500 font-semibold w-28 inline-block">IPD No:</b> {admission.apptCode}</div>
                                <div><b className="text-slate-500 font-semibold w-28 inline-block">Admitted:</b> {new Date(admission.createdAt).toLocaleDateString()}</div>
                                <div><b className="text-slate-500 font-semibold w-28 inline-block">Discharged:</b> {new Date().toLocaleDateString()}</div>
                                <div><b className="text-slate-500 font-semibold w-28 inline-block">Attending:</b> {admission.doctorName}</div>
                                <div><b className="text-slate-500 font-semibold w-28 inline-block">Department:</b> {admission.department || 'General'}</div>
                            </div>

                            {/* Clinical Info */}
                            <div className="mb-10">
                                <h4 className="text-sm font-bold text-blue-800 border-b border-blue-200 mb-3 uppercase tracking-wider pb-1">Clinical Details</h4>
                                <div className="mb-3">
                                    <h5 className="font-bold text-slate-700 text-sm">Final Diagnosis</h5>
                                    <p className="text-sm mt-1">{finalDiagnosis}</p>
                                </div>
                                <div className="mb-3">
                                    <h5 className="font-bold text-slate-700 text-sm">Condition on Discharge</h5>
                                    <p className="text-sm mt-1">{dischargeNotes}</p>
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-700 text-sm">Follow Up Status</h5>
                                    <p className="text-sm mt-1">{followUpDate ? `Patient advised to return for review on ${followUpDate}` : 'SOS / No further immediate review explicitly scheduled.'}</p>
                                </div>
                            </div>

                            {/* Itemized Bill */}
                            <div className="mb-10">
                                <h4 className="text-sm font-bold text-emerald-800 border-b border-emerald-200 mb-3 uppercase tracking-wider pb-1">Master IPD Bill Summary</h4>
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="text-left font-semibold text-slate-600 py-2 px-3">Description</th>
                                            <th className="text-right font-semibold text-slate-600 py-2 px-3">Amount (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr><td className="py-2 px-3">Room & Bed Charges ({admission.ward})</td><td className="text-right py-2 px-3">{Number(roomCharges).toFixed(2)}</td></tr>
                                        <tr><td className="py-2 px-3">Professional & Surgical Fees</td><td className="text-right py-2 px-3">{Number(doctorFee).toFixed(2)}</td></tr>
                                        <tr><td className="py-2 px-3">Nursing Care Services</td><td className="text-right py-2 px-3">{Number(nursingFee).toFixed(2)}</td></tr>
                                        <tr><td className="py-2 px-3">Pharmacy & Medical Consumables</td><td className="text-right py-2 px-3">{Number(medicationFee).toFixed(2)}</td></tr>
                                        <tr><td className="py-2 px-3">Others</td><td className="text-right py-2 px-3">{Number(otherCharges).toFixed(2)}</td></tr>
                                    </tbody>
                                </table>
                                <div className="flex justify-end mt-4">
                                    <div className="w-64 text-sm mt-2 border-t border-slate-300 pt-2 text-right">
                                        <div className="flex justify-between mb-1"><span className="text-slate-500">Gross Total:</span> <span className="font-medium text-slate-800">₹{subtotal.toFixed(2)}</span></div>
                                        {discount > 0 && <div className="flex justify-between mb-1"><span className="text-slate-500">Discount ({discount}%):</span> <span className="text-red-500">-₹{discountAmt.toFixed(2)}</span></div>}
                                        <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-slate-800"><span className="text-slate-800">Net Settled:</span> <span className="text-emerald-700">₹{netTotal.toFixed(2)}</span></div>
                                    </div>
                                </div>
                            </div>

                            {/* Signatures */}
                            <div className="mt-20 pt-10 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-sm font-semibold text-slate-500">
                                <div>
                                    <div className="border-b border-slate-300 w-48 mx-auto mb-2"></div>
                                    Patient / Attendant Signature
                                </div>
                                <div>
                                    <div className="border-b border-slate-300 w-48 mx-auto mb-2 mt-4 inline-block font-mono text-xs text-slate-800 font-bold block">Digitally Signed By {admission.doctorName}</div>
                                    Authorized Medical Officer
                                </div>
                            </div>
                        </div>
                    </PrintWrapper>
                </div>
            )}
        </div>
    );
}
