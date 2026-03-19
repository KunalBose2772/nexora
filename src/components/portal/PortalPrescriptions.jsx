'use client';
import { useState } from 'react';
import { FileText, X, Printer, Download } from 'lucide-react';
import PrescriptionSlip from '@/components/print/PrescriptionSlip';

export default function PortalPrescriptions({ prescriptions }) {
    const [selectedRx, setSelectedRx] = useState(null);

    return (
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                <div style={{ background: '#F5F3FF', padding: '12px', borderRadius: '14px', color: '#8B5CF6' }}><FileText size={22} /></div>
                <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#0F172A' }}>Pharmacy Records</h2>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748B', fontWeight: 600 }}>PRESCRIPTIONS & MEDS</p>
                </div>
            </div>
            
            {prescriptions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', border: '2px dashed #F1F5F9', borderRadius: '16px' }}>
                    <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0, fontWeight: 500 }}>No medical prescriptions found.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {prescriptions.map(p => (
                        <div key={p.id} className="interactive-row" style={{ padding: '16px', border: '1px solid #F1F5F9', borderRadius: '20px', background: '#F8FAFC' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ background: '#0F172A', color: '#fff', fontSize: '10px', fontWeight: 900, padding: '4px 8px', borderRadius: '6px' }}>RX</div>
                                    <strong style={{ fontSize: '14px', color: '#1E293B', fontWeight: 800 }}>{p.rxCode}</strong>
                                </div>
                                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{new Date(p.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#8B5CF6' }}>
                                        {p.doctorName?.charAt(0)}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>Dr. {p.doctorName} <span style={{ color: '#94A3B8', fontWeight: 400 }}>• {p.diagnosis || 'General'}</span></div>
                                </div>
                                <button 
                                    onClick={() => setSelectedRx(p)}
                                    style={{ 
                                        padding: '8px 16px', 
                                        background: '#fff', 
                                        border: '1px solid #E2E8F0', 
                                        borderRadius: '12px', 
                                        textXS: '12px', 
                                        fontWeight: 800, 
                                        color: '#0F172A', 
                                        cursor: 'pointer', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                                    }}
                                    onMouseOver={e => { e.currentTarget.style.background = '#0F172A'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0F172A'; }}
                                >
                                    <Printer size={14}/> Print Slip
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
