'use client';
import { useState } from 'react';
import { Calendar } from 'lucide-react';
import AppointmentBooking from '@/components/portal/AppointmentBooking';

export default function PortalDashboardClient({ patient, children }) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    return (
        <div className="relative">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome back, {patient.firstName}! 👋</h1>
                    <p className="text-slate-500 font-medium">View your medical history, reports, and upcoming appointments.</p>
                </div>
                <button 
                    onClick={() => setIsBookingOpen(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-xl text-sm font-bold cursor-pointer flex items-center gap-2 shadow-xl shadow-blue-200 transition-all hover:-translate-y-0.5"
                >
                    <Calendar size={18} /> Book Appointment
                </button>
            </div>

            {children}

            <AppointmentBooking 
                isOpen={isBookingOpen}
                patient={patient}
                onClose={() => setIsBookingOpen(false)}
                onBookingSuccess={() => {
                    // Could refresh data here if needed
                }}
            />
        </div>
    );
}
