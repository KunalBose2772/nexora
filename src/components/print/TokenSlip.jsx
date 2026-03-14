'use client';
import React from 'react';
import PrintWrapper from './PrintWrapper';
import PrintHeader from './PrintHeader';

/**
 * TokenSlip Component
 * Optimized for Thermal Printers (Standard 58mm or 80mm width).
 * Used for appointment tokens, queue numbers, etc.
 */
export default function TokenSlip({ appointment }) {
    if (!appointment) return null;

    return (
        <PrintWrapper documentTitle={`Token_${appointment.apptCode}`}>
            <div className="thermal-slip p-4 font-mono text-black bg-white w-[80mm] mx-auto text-center border border-dashed border-gray-300">
                {/* Minimalist Header for Thermal */}
                <div className="mb-4">
                    <h1 className="text-xl font-black uppercase leading-tight">NEXORA HEALTH</h1>
                    <p className="text-[10px] font-medium">Multi-Specialty Medical Center</p>
                    <div className="border-b border-black my-2"></div>
                    <p className="text-sm font-black uppercase tracking-widest">Appointment Token</p>
                </div>

                {/* Main Token Info */}
                <div className="my-6">
                    <div className="text-[10px] uppercase font-bold text-gray-600 mb-1">Your Token Number</div>
                    <div className="text-5xl font-black border-2 border-black py-4 rounded-xl leading-none">
                        {appointment.apptCode}
                    </div>
                </div>

                {/* Patient & Doctor Detail */}
                <div className="text-left space-y-2 mb-6 border-b border-black pb-4">
                    <div className="flex justify-between text-[11px]">
                        <span className="font-bold">PATIENT:</span>
                        <span>{appointment.patientName}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                        <span className="font-bold">DOCTOR:</span>
                        <span>{appointment.doctorName}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                        <span className="font-bold">DEPT:</span>
                        <span>{appointment.department || 'General OPD'}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                        <span className="font-bold">DATE:</span>
                        <span>{appointment.date}</span>
                    </div>
                </div>

                {/* Instructions / Footer */}
                <div className="text-[10px] leading-tight text-center">
                    <p className="font-bold mb-1 italic">Please wait for your turn.</p>
                    <p>Track your status on the</p>
                    <p className="font-black uppercase">OPD Display Monitor</p>
                </div>

                {/* QR Code Mock for Thermal */}
                <div className="mt-4 flex justify-center">
                    <div className="w-16 h-16 bg-black p-1">
                        <div className="w-full h-full bg-black border-2 border-white flex flex-wrap content-start">
                            {[...Array(16)].map((_, i) => (
                                <div key={i} className={`w-1/4 h-1/4 ${Math.random() > 0.4 ? 'bg-white' : 'bg-black'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-2 border-t border-dotted border-gray-400 text-[8px] text-gray-500 uppercase tracking-widest">
                    System Generated • {new Date().toLocaleTimeString()}
                </div>

                <style jsx>{`
                    @media print {
                        .thermal-slip {
                            width: 80mm !important;
                            border: none !important;
                            padding: 10px !important;
                        }
                    }
                `}</style>
            </div>
        </PrintWrapper>
    );
}
