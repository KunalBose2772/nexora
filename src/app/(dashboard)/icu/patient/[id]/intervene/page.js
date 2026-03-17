'use client';

import { 
    Activity, 
    Heart, 
    Wind, 
    Thermometer, 
    ChevronLeft, 
    CheckCircle2,
    Save,
    AlertCircle,
    Loader2,
    FlaskConical,
    Droplets
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ICUIntervention() {
    const { id } = useParams();
    const router = useRouter();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        heartRate: '',
        systolicBP: '',
        diastolicBP: '',
        spo2: '',
        temp: '',
        respRate: '',
        isVentilated: false,
        ventMode: 'AC/VC',
        fiO2: 40,
        peep: 5,
        tidalVolume: 450,
        pip: 20,
        intakeTotal: '',
        outputTotal: '',
        infusions: ''
    });

    useEffect(() => {
        async function loadPatient() {
            try {
                const res = await fetch(`/api/emergency/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setAppointment(data.appointment);
                    // Pre-fill from triage vitals if available
                    if (data.appointment.triageVitals) {
                        const v = JSON.parse(data.appointment.triageVitals);
                        setForm(prev => ({ 
                            ...prev, 
                            heartRate: v.hr || '', 
                            systolicBP: v.bp?.split('/')[0] || '',
                            diastolicBP: v.bp?.split('/')[1] || '',
                            spo2: v.spo2 || '',
                            temp: v.temp || ''
                        }));
                    }
                }
            } catch (e) {
                console.error('Load Error:', e);
            } finally {
                setLoading(false);
            }
        }
        loadPatient();
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/icu/monitoring', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    appointmentId: id,
                    ...form
                })
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push(`/icu/patient/${id}/logs`);
                }, 1500);
            }
        } catch (e) {
            console.error('Save Error:', e);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}><Loader2 size={40} className="animate-spin" style={{ margin: '0 auto', opacity: 0.2 }} /></div>;

    return (
        <div className="fade-in pb-20">
            <style jsx>{`
                .control-group { background: #fff; border: 1px solid #F1F5F9; border-radius: 20px; padding: 24px; }
                .input-field { 
                    width: 100%; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px 14px; 
                    font-size: 15px; font-weight: 550; color: var(--color-navy); outline: none; transition: all 0.2s;
                    background: #F8FAFC;
                }
                .input-field:focus { border-color: var(--color-navy); background: #fff; box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.05); }
                .label-text { font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; margin-bottom: 8px; display: block; }
                .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
            `}</style>

            <div className="dashboard-header-row mb-10">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => router.back()} style={{ border: 'none', background: '#fff', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <ChevronLeft size={20} color="var(--color-navy)" />
                    </button>
                    <div>
                        <h1 className="responsive-h1" style={{ margin: 0 }}>Clinical Intervention</h1>
                        <p style={{ fontSize: '14px', color: '#64748B', margin: '4px 0 0 0', fontWeight: 500 }}>
                            Intensive Care Log for <span style={{ color: 'var(--color-navy)', fontWeight: 600 }}>{appointment?.patientName}</span>
                        </p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button onClick={handleSave} disabled={saving || success} className="btn btn-primary" style={{ background: 'var(--color-navy)', border: 'none', borderRadius: '12px', height: '44px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {saving ? <Loader2 size={18} className="animate-spin" /> : (success ? <CheckCircle2 size={18} /> : <Save size={18} />)}
                        {success ? 'Batch Saved' : (saving ? 'Syncing...' : 'Validate & Sync Batch')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Section 1: Core Vitals */}
                <div className="control-group shadow-premium">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Activity size={20} />
                        </div>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', margin: 0 }}>Hemodynamic Parameters</h3>
                    </div>

                    <div className="grid-3">
                        <div>
                            <span className="label-text">Heart Rate (bmp)</span>
                            <input type="number" className="input-field" value={form.heartRate} onChange={e => setForm({...form, heartRate: e.target.value})} placeholder="72" />
                        </div>
                        <div>
                            <span className="label-text">Systolic BP</span>
                            <input type="number" className="input-field" value={form.systolicBP} onChange={e => setForm({...form, systolicBP: e.target.value})} placeholder="120" />
                        </div>
                        <div>
                            <span className="label-text">Diastolic BP</span>
                            <input type="number" className="input-field" value={form.diastolicBP} onChange={e => setForm({...form, diastolicBP: e.target.value})} placeholder="80" />
                        </div>
                        <div>
                            <span className="label-text">SpO2 (%)</span>
                            <input type="number" className="input-field" value={form.spo2} onChange={e => setForm({...form, spo2: e.target.value})} placeholder="98" />
                        </div>
                        <div>
                            <span className="label-text">Temp (°C)</span>
                            <input type="number" className="input-field" value={form.temp} onChange={e => setForm({...form, temp: e.target.value})} placeholder="36.8" />
                        </div>
                        <div>
                            <span className="label-text">Resp Rate</span>
                            <input type="number" className="input-field" value={form.respRate} onChange={e => setForm({...form, respRate: e.target.value})} placeholder="18" />
                        </div>
                    </div>
                </div>

                {/* Section 2: Respiratory Support */}
                <div className="control-group shadow-premium">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F0F9FF', color: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Wind size={20} />
                            </div>
                            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', margin: 0 }}>Ventilatory Analytics</h3>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={form.isVentilated} onChange={e => setForm({...form, isVentilated: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-navy)' }}>Mechanical Vent</span>
                        </label>
                    </div>

                    <div className="grid-3" style={{ opacity: form.isVentilated ? 1 : 0.4, pointerEvents: form.isVentilated ? 'all' : 'none' }}>
                        <div>
                            <span className="label-text">Mode</span>
                            <select className="input-field" value={form.ventMode} onChange={e => setForm({...form, ventMode: e.target.value})}>
                                <option>AC/VC</option>
                                <option>SIMV</option>
                                <option>PSV</option>
                                <option>CPAP</option>
                                <option>BiPAP</option>
                            </select>
                        </div>
                        <div>
                            <span className="label-text">FiO2 (%)</span>
                            <input type="number" className="input-field" value={form.fiO2} onChange={e => setForm({...form, fiO2: e.target.value})} />
                        </div>
                        <div>
                            <span className="label-text">PEEP (cmH2O)</span>
                            <input type="number" className="input-field" value={form.peep} onChange={e => setForm({...form, peep: e.target.value})} />
                        </div>
                        <div>
                            <span className="label-text">Tidal Vol</span>
                            <input type="number" className="input-field" value={form.tidalVolume} onChange={e => setForm({...form, tidalVolume: e.target.value})} />
                        </div>
                        <div>
                            <span className="label-text">PIP</span>
                            <input type="number" className="input-field" value={form.pip} onChange={e => setForm({...form, pip: e.target.value})} />
                        </div>
                    </div>
                </div>

                {/* Section 3: Balance & Fluids */}
                <div className="control-group shadow-premium">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F59E0B1A', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Droplets size={20} />
                        </div>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', margin: 0 }}>Intake / Output Balance</h3>
                    </div>

                    <div className="grid-3">
                        <div>
                            <span className="label-text">Total Intake (mL)</span>
                            <input type="number" className="input-field" value={form.intakeTotal} onChange={e => setForm({...form, intakeTotal: e.target.value})} placeholder="ml" />
                        </div>
                        <div>
                            <span className="label-text">Total Output (mL)</span>
                            <input type="number" className="input-field" value={form.outputTotal} onChange={e => setForm({...form, outputTotal: e.target.value})} placeholder="ml" />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', borderRadius: '12px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '9px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Current Balance</div>
                                <div style={{ fontSize: '18px', fontWeight: 800, color: (form.intakeTotal - form.outputTotal) < 0 ? '#EF4444' : '#10B981' }}>
                                    {form.intakeTotal - form.outputTotal || 0} <small>mL</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                 {/* Section 4: Infusions */}
                <div className="control-group shadow-premium">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#8B5CF61A', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FlaskConical size={20} />
                        </div>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', margin: 0 }}>Active Drug Infusions</h3>
                    </div>
                    <textarea 
                        className="input-field" 
                        rows="4" 
                        value={form.infusions} 
                        onChange={e => setForm({...form, infusions: e.target.value})} 
                        placeholder="e.g. Noradrenaline 0.05 mcg/kg/min, Fentanyl @ 2ml/hr..."
                        style={{ resize: 'none' }}
                    />
                </div>
            </div>

            <div style={{ marginTop: '24px', padding: '20px', background: '#F0F9FF', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <AlertCircle size={20} color="#0EA5E9" />
                <div style={{ fontSize: '13px', color: '#64748B' }}>
                    <strong>Validation Note:</strong> Saving this batch will trigger institutional vital alarms if parameters fall outside safety ranges (SPO2 &lt; 90% or SBP &lt; 90mmHg).
                </div>
            </div>
        </div>
    );
}
