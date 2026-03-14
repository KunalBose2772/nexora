'use client';
import { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle2, RefreshCw, ChevronLeft, MapPin } from 'lucide-react';

export default function AppointmentBooking({ patient, isOpen, onClose, onBookingSuccess }) {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    
    // Form state
    const [form, setForm] = useState({
        doctorName: '',
        department: '',
        date: '',
        time: ''
    });
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchDoctors();
            setStep(1);
        }
    }, [isOpen]);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/hr/staff');
            if (res.ok) {
                const data = await res.json();
                const drs = (data.staff || []).filter(s => 
                    s.role?.toLowerCase() === 'doctor' || 
                    s.role?.toLowerCase() === 'consultant' ||
                    s.role?.toLowerCase() === 'physician'
                );
                setDoctors(drs);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async () => {
        setBooking(true);
        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientName: `${patient.firstName} ${patient.lastName}`,
                    patientId: patient.id,
                    doctorName: form.doctorName,
                    department: form.department,
                    date: form.date,
                    time: form.time
                })
            });

            if (res.ok) {
                setStep(3); // Success step
                if (onBookingSuccess) onBookingSuccess();
                setTimeout(() => {
                    onClose();
                }, 3000);
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to book appointment');
            }
        } catch (e) {
            alert('An error occurred');
        } finally {
            setBooking(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <Calendar size={20} />
                        <h3 className="font-bold text-lg">Self-Service Booking</h3>
                    </div>
                    {step < 3 && (
                        <button onClick={onClose} className="text-white/70 hover:text-white transition-colors text-2xl leading-none">×</button>
                    )}
                </div>

                <div className="p-6">
                    {/* Step Indicators */}
                    <div className="flex gap-1.5 mb-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
                        ))}
                    </div>

                    {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h4 className="font-bold text-slate-800 text-lg mb-1">Choose a Specialist</h4>
                                <p className="text-sm text-slate-500 mb-6">Select the doctor you wish to consult with.</p>
                            </div>

                            {loading ? (
                                <div className="py-12 text-center text-slate-400">
                                    <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                                    <span className="text-sm font-medium">Fetching active lineup...</span>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {doctors.map(dr => (
                                        <button
                                            key={dr.id}
                                            onClick={() => {
                                                setForm({ ...form, doctorName: dr.name, department: dr.department || 'General' });
                                                setStep(2);
                                            }}
                                            className="w-full text-left p-4 rounded-xl border-2 border-slate-50 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-blue-600 font-bold border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    {dr.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 tracking-tight">Dr. {dr.name}</div>
                                                    <div className="text-[11px] font-bold uppercase tracking-wider text-blue-500">{dr.specialization || dr.department || 'Consultant'}</div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                            <button onClick={() => setStep(1)} className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-blue-600 mb-2 uppercase tracking-widest transition-colors">
                                <ChevronLeft size={14}/> Change Doctor
                            </button>

                            <div className="bg-slate-900 rounded-xl p-4 text-white shadow-inner mb-6">
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Confirming with</div>
                                <div className="font-bold text-lg">Dr. {form.doctorName}</div>
                                <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                                    <MapPin size={12}/> {form.department} Department
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Select Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
                                        <input 
                                            type="date" 
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pl-10 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-700" 
                                            value={form.date}
                                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Select Time Slot</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM', '08:00 PM'].map(slot => (
                                            <button
                                                key={slot}
                                                type="button"
                                                onClick={() => setForm({ ...form, time: slot })}
                                                className={`p-2.5 rounded-lg text-xs font-bold border-2 transition-all ${form.time === slot ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:bg-blue-50'}`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 invisible h-0">spacer</div> {/* Layout hack */}

                            <button
                                onClick={handleBook}
                                disabled={!form.date || !form.time || booking}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-200 flex items-center justify-center gap-2 transition-all"
                            >
                                {booking ? <RefreshCw className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                                {booking ? 'Confirming with Hospital...' : 'Finalize Appointment'}
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-8 animate-in zoom-in-90 duration-300">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 scale-110 animate-bounce">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Booking Confirmed!</h3>
                            <p className="text-slate-500 mb-6">Your session with Dr. {form.doctorName} is scheduled for {form.date}. Check your email for the slip.</p>
                            <div className="text-[10px] font-black text-slate-300 tracking-[0.3em] uppercase">Closing in 3 seconds...</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
