'use client';
import { useState } from 'react';
import { FileText, X, Printer, Download } from 'lucide-react';
import PrescriptionSlip from '@/components/print/PrescriptionSlip';

export default function PortalPrescriptions({ prescriptions }) {
    const [selectedRx, setSelectedRx] = useState(null);

    return (
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: '#F5F3FF', padding: '10px', borderRadius: '10px', color: '#8B5CF6' }}><FileText size={20} /></div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#0F172A' }}>Prescriptions</h2>
            </div>
            
            {prescriptions.length === 0 ? (
                <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>No prescriptions on record.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {prescriptions.map(p => (
                        <div key={p.id} style={{ padding: '12px', border: '1px solid #F1F5F9', borderRadius: '10px', background: '#F8FAFC' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <strong style={{ fontSize: '14px', color: '#1E293B' }}>{p.rxCode}</strong>
                                <span style={{ fontSize: '12px', color: '#64748B' }}>{new Date(p.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                <div style={{ fontSize: '13px', color: '#475569' }}>Dr. {p.doctorName} - {p.diagnosis || 'General Consult'}</div>
                                <button 
                                    onClick={() => setSelectedRx(p)}
                                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
                                >
                                    <Printer size={12}/> View & Print
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedRx && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '800px', maxHeight: '95vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={() => setSelectedRx(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '50%', padding: '6px', cursor: 'pointer', zIndex: 50, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}><X size={18} /></button>
                        
                        <div className="bg-white">
                            <PrescriptionSlip prescription={selectedRx} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
