'use client';

import {
    Activity, ArrowLeft, Wind, Droplets,
    Save, Plus, History, ChevronRight,
    Loader2, AlertTriangle, CheckCircle2,
    Thermometer, HeartPulse
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';

export default function IcuMonitorPage() {
    const { id } = useParams();
    const [record, setRecord] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        heartRate: '', systolicBP: '', diastolicBP: '', spo2: '', temp: '', respRate: '',
        isVentilated: false, ventMode: 'AC/VC', fiO2: '40', peep: '5', tidalVolume: '400', pip: '',
        intakeTotal: '', outputTotal: '', infusions: []
    });

    const fetchData = useCallback(async () => {
        try {
            const [caseRes, histRes] = await Promise.all([
                fetch(`/api/emergency/${id}`), // Reusing existing appt fetcher
                fetch(`/api/icu/monitoring?appointmentId=${id}`)
            ]);

            const [caseData, histData] = await Promise.all([caseRes.json(), histRes.json()]);

            if (caseRes.ok) setRecord(caseData.appointment);
            if (histRes.ok) setHistory(histData.history);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
        const int = setInterval(fetchData, 60000);
        return () => clearInterval(int);
    }, [fetchData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/icu/monitoring', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, appointmentId: id })
            });
            if (res.ok) {
                setShowForm(false);
                fetchData();
            }
        } catch (err) {
            alert('Failed to save record');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '40px' }}><Loader2 className="animate-spin" /></div>;
    if (!record) return <div style={{ padding: '40px' }}>Admission not found.</div>;

    return (
        <div className="fade-in">
            <style>{`
                .icu-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; }
                .icu-table th { background: #f8fafc; padding: 12px 16px; font-size: 11px; font-weight: 800; color: #64748B; border-bottom: 2px solid #E2E8F0; text-transform: uppercase; text-align: left; }
                .icu-table td { padding: 12px 16px; font-size: 13px; color: #0F172A; border-bottom: 1px solid #F1F5F9; }
                .form-control { width: 100%; padding: 8px 12px; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 14px; outline: none; transition: all 0.2s; }
                .form-control:focus { border-color: #00C2FF; box-shadow: 0 0 0 3px rgba(0, 194, 255, 0.1); }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/icu" className="btn btn-secondary btn-sm" style={{ padding: '8px' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{record.patientName}</h1>
                            <span className="badge badge-info">{record.bed || 'NO BED'}</span>
                        </div>
                        <p style={{ color: '#64748B', margin: '4px 0 0', fontSize: '13px' }}>{record.patient?.patientCode} • {record.ward} • {record.admitNotes}</p>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <Plus size={18} /> NEW MONITORING ENTRY
                </button>
            </div>

            {showForm && (
                <div className="fade-in" style={{ background: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #E2E8F0', marginBottom: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                    <form onSubmit={handleSubmit}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={18} color="#00C2FF" /> New Observational Chart Entry
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '6px' }}>HEART RATE</label>
                                <input className="form-control" placeholder="bpm" value={formData.heartRate} onChange={e => setFormData({ ...formData, heartRate: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '6px' }}>BP (SYSTOLIC)</label>
                                <input className="form-control" placeholder="mmHg" value={formData.systolicBP} onChange={e => setFormData({ ...formData, systolicBP: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '6px' }}>BP (DIASTOLIC)</label>
                                <input className="form-control" placeholder="mmHg" value={formData.diastolicBP} onChange={e => setFormData({ ...formData, diastolicBP: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '6px' }}>SPO2 (%)</label>
                                <input className="form-control" placeholder="%" value={formData.spo2} onChange={e => setFormData({ ...formData, spo2: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '6px' }}>TEMP (°F)</label>
                                <input className="form-control" placeholder="98.6" value={formData.temp} onChange={e => setFormData({ ...formData, temp: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '6px' }}>RESP RATE</label>
                                <input className="form-control" placeholder="/min" value={formData.respRate} onChange={e => setFormData({ ...formData, respRate: e.target.value })} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '24px', padding: '20px', background: '#F8FAFC', borderRadius: '16px' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                    <input type="checkbox" checked={formData.isVentilated} onChange={e => setFormData({ ...formData, isVentilated: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                                    <label style={{ fontWeight: 700, color: '#1E293B', fontSize: '14px' }}>Mechanical Ventilation Enabled</label>
                                </div>
                                {formData.isVentilated && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <select className="form-control" value={formData.ventMode} onChange={e => setFormData({ ...formData, ventMode: e.target.value })}>
                                            <option>AC/VC</option><option>SIMV</option><option>CPAP/PS</option><option>BIPAP</option>
                                        </select>
                                        <input className="form-control" placeholder="FiO2 %" value={formData.fiO2} onChange={e => setFormData({ ...formData, fiO2: e.target.value })} />
                                        <input className="form-control" placeholder="PEEP" value={formData.peep} onChange={e => setFormData({ ...formData, peep: e.target.value })} />
                                        <input className="form-control" placeholder="TV (ml)" value={formData.tidalVolume} onChange={e => setFormData({ ...formData, tidalVolume: e.target.value })} />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '12px' }}>FLUID BALANCE</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <input className="form-control" placeholder="Intake (ml)" value={formData.intakeTotal} onChange={e => setFormData({ ...formData, intakeTotal: e.target.value })} />
                                    <input className="form-control" placeholder="Output (ml)" value={formData.outputTotal} onChange={e => setFormData({ ...formData, outputTotal: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>CANCEL</button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> SAVE HOURLY CHART</>}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <History size={18} color="#64748B" /> Clinical Flowsheet (Last 24 Hours)
                </h3>

                <table className="icu-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>HR</th>
                            <th>BP (S/D)</th>
                            <th>SpO2</th>
                            <th>Temp</th>
                            <th>RR</th>
                            <th>Vent Settings</th>
                            <th>I/O Balance</th>
                            <th>By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((h) => (
                            <tr key={h.id}>
                                <td style={{ fontWeight: 700 }}>{new Date(h.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                <td style={{ color: (h.heartRate > 100 || h.heartRate < 60) ? '#DC2626' : 'inherit' }}>{h.heartRate}</td>
                                <td>{h.systolicBP}/{h.diastolicBP}</td>
                                <td style={{ color: h.spo2 < 93 ? '#DC2626' : '#16A34A', fontWeight: 700 }}>{h.spo2}%</td>
                                <td>{h.temp}°F</td>
                                <td>{h.respRate}</td>
                                <td>
                                    {h.isVentilated ? (
                                        <div style={{ fontSize: '11px', color: '#3B82F6' }}>
                                            {h.ventMode} • FiO2:{h.fiO2}% • P:{h.peep}
                                        </div>
                                    ) : (
                                        <span style={{ fontSize: '10px', color: '#94A3B8' }}>No Ventilator</span>
                                    )}
                                </td>
                                <td>
                                    <div style={{ fontSize: '11px' }}>
                                        <span style={{ color: '#22C55E' }}>+{h.intakeTotal}</span> / <span style={{ color: '#EF4444' }}>-{h.outputTotal}</span>
                                        <div style={{ fontWeight: 800 }}>{h.balance > 0 ? '+' : ''}{h.balance}ml</div>
                                    </div>
                                </td>
                                <td style={{ fontSize: '11px', color: '#64748B' }}>{h.recordedBy}</td>
                            </tr>
                        ))}
                        {history.length === 0 && (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>No monitoring data recorded for this period.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
