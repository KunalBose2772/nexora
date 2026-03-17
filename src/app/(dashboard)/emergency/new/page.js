'use client';

import {
    Plus, ArrowLeft, Save, Zap, User,
    ShieldAlert, AlertTriangle, Activity,
    Thermometer, HeartPulse, UserPlus, Search,
    Loader2, CheckCircle2, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewEmergencyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        patientName: '',
        age: '',
        gender: 'Male',
        traumaType: 'RTA',
        admitNotes: '',
        triageLevel: 3,
        bystanderName: '',
        bystanderPhone: '',
        isMLC: false,
        mlcNumber: '',
        policeStation: '',
        bp: '',
        hr: '',
        temp: '',
        spo2: '',
        rr: ''
    });

    const traumaTypes = [
        'RTA (Road Traffic Accident)', 'Fall from Height', 'Physical Assault',
        'Burn Injury', 'Poisoning', 'Cardiac Arrest', 'Respiratory Distress',
        'Snake Bite', 'Drowning', 'Other Trauma'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.patientName) {
            setErrorMsg('Patient Name is required.');
            return;
        }

        setLoading(true);
        setErrorMsg('');

        try {
            const triageVitals = {
                bp: formData.bp,
                hr: formData.hr,
                temp: formData.temp,
                spo2: formData.spo2,
                rr: formData.rr
            };

            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientName: formData.patientName,
                    doctorName: 'ER Duty Doctor',
                    department: 'Emergency & Trauma',
                    date: new Date().toISOString().split('T')[0],
                    type: 'EMERGENCY',
                    admitNotes: formData.admitNotes,
                    triageLevel: parseInt(formData.triageLevel),
                    triageColor: formData.triageLevel === 1 ? 'Red' : formData.triageLevel === 2 ? 'Orange' : 'Yellow',
                    traumaType: formData.traumaType,
                    bystanderName: formData.bystanderName,
                    bystanderPhone: formData.bystanderPhone,
                    isMLC: formData.isMLC,
                    mlcNumber: formData.mlcNumber,
                    policeStation: formData.policeStation,
                    triageVitals: triageVitals,
                    paymentAmount: 0
                })
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => router.push('/emergency'), 1500);
            } else {
                const data = await res.json();
                setErrorMsg(data.error || 'Failed to register emergency case.');
            }
        } catch (error) {
            setErrorMsg('Network error occurred.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] fade-in">
                <div style={{ width: '80px', height: '80px', background: '#F0FDF4', color: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid #DCFCE7' }}>
                    <CheckCircle2 size={40} />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-navy)', margin: 0 }}>Clinical Ingress Confirmed</h2>
                <p style={{ fontSize: '15px', color: '#64748B', marginTop: '8px', fontWeight: 500 }}>The trauma team has been alerted. Synchronizing triage queue...</p>
            </div>
        );
    }

    return (
        <div className="fade-in space-y-8 max-w-6xl mx-auto pb-10">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link href="/emergency" className="btn btn-secondary shadow-sm" style={{ width: '44px', height: '44px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="responsive-h1" style={{ margin: 0 }}>Critical Induction</h1>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0', fontWeight: 500 }}>Rapid trauma profiling and ESI prioritization protocol.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 16px', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '12px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} className="animate-pulse" />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Triage Active</span>
                </div>
            </div>

            {errorMsg && (
                <div style={{ padding: '16px 20px', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '16px', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 500, marginBottom: '24px' }}>
                    <AlertTriangle size={18} />
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Patient Information */}
                    <div className="card shadow-premium" style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <User size={18} style={{ color: '#0EA5E9' }} />
                            Patient Identity Registry
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                            <div style={{ gridColumn: 'span 4' }}>
                                <label className="form-label">Full Name / Trauma Identifier *</label>
                                <input
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g. Unknown Male approx 40y"
                                    style={{ background: '#F8FAFC' }}
                                    required
                                />
                            </div>
                            <div style={{ gridColumn: 'span 1' }}>
                                <label className="form-label">Approx Age</label>
                                <input name="age" value={formData.age} onChange={handleChange} className="form-input" placeholder="Years" style={{ background: '#F8FAFC' }} />
                            </div>
                            <div style={{ gridColumn: 'span 1' }}>
                                <label className="form-label">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="form-select" style={{ background: '#F8FAFC' }}>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Mechanism of Injury</label>
                                <select name="traumaType" value={formData.traumaType} onChange={handleChange} className="form-select" style={{ background: '#F8FAFC' }}>
                                    {traumaTypes.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Triage & Vitals */}
                    <div className="card shadow-premium" style={{ padding: '32px', borderLeft: '4px solid #EF4444' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Activity size={18} style={{ color: '#EF4444' }} />
                            Clinical Prioritization (ESI)
                        </h3>

                        <label className="form-label" style={{ marginBottom: '16px', display: 'block' }}>Emergency Severity Index</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '32px' }}>
                            {[1, 2, 3, 4, 5].map(lvl => {
                                const colors = {
                                    1: { bg: '#FEF2F2', border: '#FEE2E2', text: '#991B1B', active: '#EF4444' },
                                    2: { bg: '#FFF7ED', border: '#FFEDD5', text: '#9A3412', active: '#F97316' },
                                    3: { bg: '#FFFBEB', border: '#FEF3C7', text: '#92400E', active: '#F59E0B' },
                                    4: { bg: '#F0FDF4', border: '#DCFCE7', text: '#166534', active: '#10B981' },
                                    5: { bg: '#EFF6FF', border: '#DBEAFE', text: '#1E40AF', active: '#3B82F6' }
                                };
                                const c = colors[lvl];
                                const isActive = formData.triageLevel === lvl;
                                return (
                                    <button
                                        key={lvl}
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, triageLevel: lvl }))}
                                        style={{
                                            background: isActive ? c.bg : '#fff',
                                            border: `1px solid ${isActive ? c.active : '#E2E8F0'}`,
                                            padding: '16px',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '4px',
                                            transition: 'all 0.2s',
                                            boxShadow: isActive ? `0 4px 12px ${c.active}20` : 'none'
                                        }}
                                    >
                                        <span style={{ fontSize: '9px', fontWeight: 600, color: isActive ? c.text : '#94A3B8', textTransform: 'uppercase' }}>ESI</span>
                                        <span style={{ fontSize: '20px', fontWeight: 700, color: isActive ? c.text : 'var(--color-navy)' }}>{lvl}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                            <div>
                                <label className="form-label">BP</label>
                                <input name="bp" value={formData.bp} onChange={handleChange} className="form-input" style={{ textAlign: 'center', fontWeight: 600, background: '#F8FAFC' }} placeholder="120/80" />
                            </div>
                            <div>
                                <label className="form-label">Pulse</label>
                                <input name="hr" value={formData.hr} onChange={handleChange} className="form-input" style={{ textAlign: 'center', fontWeight: 600, background: '#F8FAFC' }} placeholder="80" />
                            </div>
                            <div>
                                <label className="form-label">Temp</label>
                                <input name="temp" value={formData.temp} onChange={handleChange} className="form-input" style={{ textAlign: 'center', fontWeight: 600, background: '#F8FAFC' }} placeholder="98.6" />
                            </div>
                            <div>
                                <label className="form-label">SpO2 %</label>
                                <input name="spo2" value={formData.spo2} onChange={handleChange} className="form-input" style={{ textAlign: 'center', fontWeight: 600, background: '#F8FAFC' }} placeholder="98" />
                            </div>
                            <div>
                                <label className="form-label">RR</label>
                                <input name="rr" value={formData.rr} onChange={handleChange} className="form-input" style={{ textAlign: 'center', fontWeight: 600, background: '#F8FAFC' }} placeholder="18" />
                            </div>
                        </div>

                        <div style={{ marginTop: '24px' }}>
                            <label className="form-label">Chief Complaint & Trauma Context</label>
                            <textarea
                                name="admitNotes"
                                value={formData.admitNotes}
                                onChange={handleChange}
                                className="form-textarea"
                                style={{ minHeight: '120px', background: '#F8FAFC' }}
                                placeholder="Detail the immediate clinical status or mechanism of trauma..."
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Informant Details */}
                    <div className="card shadow-premium" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Zap size={18} style={{ color: '#F59E0B' }} />
                            Informant / Logistics
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label className="form-label">Full Name</label>
                                <input name="bystanderName" value={formData.bystanderName} onChange={handleChange} className="form-input" style={{ background: '#F8FAFC' }} />
                            </div>
                            <div>
                                <label className="form-label">Contact Number</label>
                                <input name="bystanderPhone" value={formData.bystanderPhone} onChange={handleChange} className="form-input" style={{ background: '#F8FAFC' }} />
                            </div>
                        </div>

                        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', padding: '12px 16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                    <input
                                        type="checkbox"
                                        id="isMLC"
                                        name="isMLC"
                                        checked={formData.isMLC}
                                        onChange={handleChange}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="isMLC" style={{ fontSize: '13px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>Medico-Legal Case (MLC)</label>
                                </div>
                                <ShieldAlert size={18} style={{ color: formData.isMLC ? '#EF4444' : '#CBD5E1' }} />
                            </div>

                            {formData.isMLC && (
                                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="fade-in">
                                    <div>
                                        <label className="form-label">MLC Identifier</label>
                                        <input name="mlcNumber" value={formData.mlcNumber} onChange={handleChange} className="form-input" style={{ background: '#fff', borderColor: '#FEE2E2' }} placeholder="e.g. MLC/HOSP/2026/012" />
                                    </div>
                                    <div>
                                        <label className="form-label">Police Jurisdiction</label>
                                        <input name="policeStation" value={formData.policeStation} onChange={handleChange} className="form-input" style={{ background: '#fff' }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ height: '56px', background: 'var(--color-navy)', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', borderRadius: '16px' }}
                        >
                            {loading ? <Loader2 size={24} className="animate-spin" /> : <><ShieldAlert size={20} /> Deploy Triage Protocol</>}
                        </button>
                        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #F1F5F9', display: 'flex', gap: '12px' }}>
                            <Activity size={16} style={{ color: '#94A3B8', marginTop: '2px', flexShrink: 0 }} />
                            <p style={{ fontSize: '11px', color: '#64748B', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
                                Confirmation triggers immediate synchronization with the Triage Dashboard and alerts the Trauma Duty Team.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
