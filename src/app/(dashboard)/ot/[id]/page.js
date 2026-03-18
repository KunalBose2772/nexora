'use client';

import {
    ArrowLeft, CheckCircle2, AlertTriangle,
    Save, Loader2, User, Activity,
    Scissors, ShieldCheck, FileText,
    Clock, Plus, X, ChevronDown, ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';

export default function SurgeryDetailPage() {
    const { id } = useParams();
    const [surgery, setSurgery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('checklist'); // checklist, postop, anesthesia

    const [vitalsHistory, setVitalsHistory] = useState([]);
    const [vitalsLoading, setVitalsLoading] = useState(false);
    const [showVitalsForm, setShowVitalsForm] = useState(false);
    const [vitalsFormData, setVitalsFormData] = useState({
        heartRate: '', systolicBP: '', diastolicBP: '', spo2: '', temp: '', respRate: ''
    });

    const fetchVitals = useCallback(async (apptId) => {
        if (!apptId) return;
        setVitalsLoading(true);
        try {
            const res = await fetch(`/api/icu/monitoring?appointmentId=${apptId}`);
            const data = await res.json();
            if (res.ok) setVitalsHistory(data.history);
        } catch (err) {
            console.error(err);
        } finally {
            setVitalsLoading(false);
        }
    }, []);

    const fetchSurgery = useCallback(async () => {
        try {
            const res = await fetch(`/api/ot/${id}`);
            const data = await res.json();
            if (res.ok) {
                setSurgery(data.surgery);
                if (data.surgery.appointmentId) {
                    fetchVitals(data.surgery.appointmentId);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchSurgery();
    }, [fetchSurgery]);

    const handleUpdate = async (updateData) => {
        setSaving(true);
        try {
            const res = await fetch(`/api/ot/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });
            if (res.ok) fetchSurgery();
        } catch (err) {
            alert('Failed to update surgery record');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveVitals = async (e) => {
        e.preventDefault();
        if (!surgery?.appointmentId) return;
        setSaving(true);
        try {
            const res = await fetch('/api/icu/monitoring', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...vitalsFormData, appointmentId: surgery.appointmentId })
            });
            if (res.ok) {
                setShowVitalsForm(false);
                fetchVitals(surgery.appointmentId);
                setVitalsFormData({ heartRate: '', systolicBP: '', diastolicBP: '', spo2: '', temp: '', respRate: '' });
            }
        } catch (err) {
            alert('Failed to save vitals');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '40px' }}><Loader2 className="animate-spin" /></div>;
    if (!surgery) return <div style={{ padding: '40px' }}>Surgery record not found.</div>;

    const checklist = surgery.checklist || {};

    return (
        <div className="fade-in">
            <style>{`
                .tab-btn { 
                    padding: 16px 28px; 
                    font-size: 13px; 
                    font-weight: 800; 
                    border: none; 
                    background: none; 
                    cursor: pointer; 
                    color: #94A3B8; 
                    border-bottom: 3px solid transparent; 
                    transition: all 0.2s; 
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .tab-btn.active { color: #00C2FF; border-bottom-color: #00C2FF; }
                .tab-btn:hover:not(.active) { color: #64748B; }

                .checklist-item { 
                    display: flex; 
                    align-items: center; 
                    gap: 14px; 
                    padding: 14px 18px; 
                    border-radius: 14px; 
                    border: 1px solid #F1F5F9; 
                    margin-bottom: 10px; 
                    cursor: pointer; 
                    transition: all 0.2s; 
                    background: #fff;
                }
                .checklist-item:hover { transform: translateX(4px); border-color: #00C2FF40; background: #F8FAFC; }
                .checklist-item.checked { background: #F0FDF4; border-color: #BBF7D0; }
                
                .form-control { 
                    width: 100%; 
                    padding: 12px 16px; 
                    border: 1px solid #E2E8F0; 
                    border-radius: 12px; 
                    font-size: 14px; 
                    outline: none; 
                    transition: border-color 0.2s;
                    background: #fff;
                }
                .form-control:focus { border-color: #00C2FF; box-shadow: 0 0 0 3px rgba(0, 194, 255, 0.1); }
                
                .section-header { 
                    font-size: 13px; 
                    font-weight: 900; 
                    color: #0F172A; 
                    margin-bottom: 20px; 
                    text-transform: uppercase; 
                    letter-spacing: 0.08em; 
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .section-header::before {
                    content: '';
                    width: 4px;
                    height: 16px;
                    background: #00C2FF;
                    border-radius: 2px;
                }

                .icu-table { width: 100%; border-collapse: separate; border-spacing: 0; }
                .icu-table th { 
                    background: #F8FAFC; 
                    padding: 14px 20px; 
                    font-size: 11px; 
                    font-weight: 800; 
                    color: #94A3B8; 
                    border-bottom: 1px solid #E2E8F0; 
                    text-transform: uppercase; 
                    text-align: left; 
                    letter-spacing: 0.05em;
                }
                .icu-table td { 
                    padding: 16px 20px; 
                    font-size: 14px; 
                    color: #1E293B; 
                    border-bottom: 1px solid #F1F5F9; 
                }
                .icu-table tr:hover td { background: #F8FAFC; }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link href="/ot" className="btn btn-secondary shadow-sm" style={{ width: '48px', height: '48px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', background: '#fff' }}>
                        <ArrowLeft size={22} color="#1E293B" />
                    </Link>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                            <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>{surgery.procedureName}</h1>
                            <div style={{ 
                                padding: '6px 14px', 
                                borderRadius: '20px', 
                                fontSize: '11px', 
                                fontWeight: 800, 
                                background: surgery.status === 'Completed' ? '#F0FDF4' : '#F0F9FF', 
                                color: surgery.status === 'Completed' ? '#16A34A' : '#00C2FF',
                                border: '1px solid',
                                borderColor: surgery.status === 'Completed' ? '#BBF7D0' : '#B9E6FF'
                            }}>{surgery.status.toUpperCase()}</div>
                        </div>
                        <p style={{ color: '#64748B', margin: 0, fontSize: '15px', fontWeight: 500 }}>
                            Case: <span style={{ color: '#0F172A', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>{surgery.surgeryCode}</span> • Patient: <span style={{ fontWeight: 800, color: '#00C2FF' }}>{surgery.patient?.firstName} {surgery.patient?.lastName}</span>
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ background: '#fff', padding: '4px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center' }}>
                        <select
                            value={surgery.status}
                            onChange={(e) => handleUpdate({ status: e.target.value })}
                            style={{ 
                                border: 'none', 
                                outline: 'none', 
                                padding: '8px 16px', 
                                fontSize: '13px', 
                                fontWeight: 700, 
                                background: 'transparent',
                                cursor: 'pointer',
                                color: '#1E293B'
                            }}
                        >
                            <option>Scheduled</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                            <option>Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #F1F5F9', padding: '0 20px' }}>
                    <button className={`tab-btn ${activeTab === 'checklist' ? 'active' : ''}`} onClick={() => setActiveTab('checklist')}>SURGICAL SAFETY CHECKLIST</button>
                    <button className={`tab-btn ${activeTab === 'postop' ? 'active' : ''}`} onClick={() => setActiveTab('postop')}>POST-OP NOTES & FINDINGS</button>
                    <button className={`tab-btn ${activeTab === 'anesthesia' ? 'active' : ''}`} onClick={() => setActiveTab('anesthesia')}>ANESTHESIA RECORD</button>
                </div>

                <div style={{ padding: '32px' }}>
                    {activeTab === 'checklist' && (
                        <div className="fade-in">
                            <div style={{ border: '1px solid #FEE2E2', background: '#FEF2F2', padding: '16px', borderRadius: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <AlertTriangle size={24} color="#EF4444" />
                                <div style={{ fontSize: '13px', color: '#991B1B', fontWeight: 600 }}>
                                    WHO Surgical Safety Checklist compliance is mandatory for all procedures. Ensure verification before incision.
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                                <div>
                                    <div className="section-header">Sign In (Before Induction)</div>
                                    {[
                                        { key: 'patientConfirmed', label: 'Patient Identity & Consent Confirmed' },
                                        { key: 'siteMarked', label: 'Surgical Site Marked' },
                                        { key: 'anaesthesiaSafety', label: 'Anaesthesia Machine & Med Check' },
                                        { key: 'pulseOximeter', label: 'Pulse Oximeter Connected & Audible' },
                                        { key: 'allergyKnown', label: 'Known Allergies Reviewed' }
                                    ].map(item => (
                                        <div
                                            key={item.key}
                                            className={`checklist-item ${checklist[item.key] ? 'checked' : ''}`}
                                            onClick={() => handleUpdate({ checklist: { [item.key]: !checklist[item.key] } })}
                                        >
                                            <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: '2px solid', borderColor: checklist[item.key] ? '#22C55E' : '#CBD5E1', background: checklist[item.key] ? '#22C55E' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {checklist[item.key] && <CheckCircle2 size={14} color="#fff" />}
                                            </div>
                                            <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <div className="section-header">Time Out (Before Incision)</div>
                                    {[
                                        { key: 'teamIntroduced', label: 'Team Members Introduced' },
                                        { key: 'surgicalSiteConfirmed', label: 'Verbal Confirmation of Patient/Site' },
                                        { key: 'antibioticProphylaxis', label: 'Antibiotic Prophylaxis (last 60m)' },
                                        { key: 'anticipateCritical', label: 'Surgeon/Anaes. Review Critical Steps' },
                                        { key: 'imagingDisplayed', label: 'Relevant Imaging Displayed' }
                                    ].map(item => (
                                        <div
                                            key={item.key}
                                            className={`checklist-item ${checklist[item.key] ? 'checked' : ''}`}
                                            onClick={() => handleUpdate({ checklist: { [item.key]: !checklist[item.key] } })}
                                        >
                                            <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: '2px solid', borderColor: checklist[item.key] ? '#22C55E' : '#CBD5E1', background: checklist[item.key] ? '#22C55E' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {checklist[item.key] && <CheckCircle2 size={14} color="#fff" />}
                                            </div>
                                            <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <div className="section-header">Sign Out (Before Departure)</div>
                                    {[
                                        { key: 'countsCorrect', label: 'Sponge & Instrument Counts Correct' },
                                        { key: 'specimenLabeled', label: 'Specimen Labeled Correct' },
                                        { key: 'equipmentFixed', label: 'Equipment Issues Addressed' },
                                        { key: 'recoveryPlan', label: 'Post-Op Management/Recovery Plan' }
                                    ].map(item => (
                                        <div
                                            key={item.key}
                                            className={`checklist-item ${checklist[item.key] ? 'checked' : ''}`}
                                            onClick={() => handleUpdate({ checklist: { [item.key]: !checklist[item.key] } })}
                                        >
                                            <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: '2px solid', borderColor: checklist[item.key] ? '#22C55E' : '#CBD5E1', background: checklist[item.key] ? '#22C55E' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {checklist[item.key] && <CheckCircle2 size={14} color="#fff" />}
                                            </div>
                                            <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'postop' && (
                        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#64748B', marginBottom: '8px' }}>POST-OP DIAGNOSIS</label>
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        defaultValue={surgery.postOpDiagnosis}
                                        onBlur={(e) => handleUpdate({ postOpDiagnosis: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#64748B', marginBottom: '8px' }}>SURGICAL FINDINGS & PROCEDURE NOTES</label>
                                    <textarea
                                        className="form-control"
                                        rows="10"
                                        defaultValue={surgery.findings}
                                        onBlur={(e) => handleUpdate({ findings: e.target.value })}
                                        placeholder="Detailed step-by-step procedure notes, intra-operative findings, complications..."
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '20px' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B', marginBottom: '16px' }}>Recovery Metrics</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '6px' }}>BLOOD LOSS (ML)</label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                defaultValue={surgery.bloodLoss}
                                                onBlur={(e) => handleUpdate({ bloodLoss: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '6px' }}>SPECIMENS SENT</label>
                                            <input className="form-control" placeholder="Biopsy, fluids, etc." />
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    className="btn btn-primary" 
                                    style={{ height: '56px', fontSize: '16px', fontWeight: 800 }}
                                    onClick={() => handleUpdate({ status: 'Completed' })}
                                    disabled={saving}
                                >
                                    {saving ? <Loader2 size={20} className="animate-spin" /> : <Scissors size={20} />} 
                                    SIGN PROCEDURAL RECORD
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'anesthesia' && (
                        <div className="fade-in">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                                <div>
                                    <div className="section-header">Anesthesia Agents & Technique</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#F8FAFC', padding: '24px', borderRadius: '20px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '6px' }}>ANESTHESIA TYPE</label>
                                            <select 
                                                className="form-control"
                                                defaultValue={surgery.anesthesiaType}
                                                onChange={(e) => handleUpdate({ anesthesiaType: e.target.value })}
                                            >
                                                <option>General Anesthesia (GA)</option>
                                                <option>Spinal Anesthesia</option>
                                                <option>Epidural</option>
                                                <option>Local Anesthesia (LA)</option>
                                                <option>MAC / Sedation</option>
                                                <option>Regional Block</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '6px' }}>PRE-MEDICATION</label>
                                            <textarea 
                                                className="form-control" 
                                                rows="2"
                                                defaultValue={surgery.anesthesia?.preMedication}
                                                onBlur={(e) => handleUpdate({ anesthesia: { preMedication: e.target.value } })}
                                                placeholder="Midazolam, Fentanyl, Glycopyrrolate..."
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '6px' }}>INDUCTION AGENTS</label>
                                            <textarea 
                                                className="form-control" 
                                                rows="2"
                                                defaultValue={surgery.anesthesia?.inductionAgents}
                                                onBlur={(e) => handleUpdate({ anesthesia: { inductionAgents: e.target.value } })}
                                                placeholder="Propofol, Etomidate, Ketamine..."
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '6px' }}>MAINTENANCE / GASES</label>
                                            <textarea 
                                                className="form-control" 
                                                rows="2"
                                                defaultValue={surgery.anesthesia?.maintenance}
                                                onBlur={(e) => handleUpdate({ anesthesia: { maintenance: e.target.value } })}
                                                placeholder="Sevoflurane, N2O, O2, Propofol TCI..."
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '6px' }}>INTUBATION / AIRWAY NOTES</label>
                                            <textarea 
                                                className="form-control" 
                                                rows="2"
                                                defaultValue={surgery.anesthesia?.intubationNotes}
                                                onBlur={(e) => handleUpdate({ anesthesia: { intubationNotes: e.target.value } })}
                                                placeholder="ETT Size, Cormack-Lehane Grade, Fixed/Loose teeth..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <div className="section-header" style={{ marginBottom: 0 }}>Intra-Op Monitoring Chart</div>
                                        <button className="btn btn-primary btn-sm" onClick={() => setShowVitalsForm(!showVitalsForm)}>
                                            <Plus size={14} /> NEW ENTRY
                                        </button>
                                    </div>

                                    {showVitalsForm && (
                                        <div className="fade-in" style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #00C2FF', marginBottom: '24px', boxShadow: '0 10px 15px -3px rgba(0, 194, 255, 0.1)' }}>
                                            <form onSubmit={handleSaveVitals}>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: '#64748B', marginBottom: '4px' }}>HR (BPM)</label>
                                                        <input className="form-control" placeholder="bpm" value={vitalsFormData.heartRate} onChange={e => setVitalsFormData({...vitalsFormData, heartRate: e.target.value})} />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: '#64748B', marginBottom: '4px' }}>BP (SYSTOLIC)</label>
                                                        <input className="form-control" placeholder="mmHg" value={vitalsFormData.systolicBP} onChange={e => setVitalsFormData({...vitalsFormData, systolicBP: e.target.value})} />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: '#64748B', marginBottom: '4px' }}>BP (DIASTOLIC)</label>
                                                        <input className="form-control" placeholder="mmHg" value={vitalsFormData.diastolicBP} onChange={e => setVitalsFormData({...vitalsFormData, diastolicBP: e.target.value})} />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: '#64748B', marginBottom: '4px' }}>SPO2 (%)</label>
                                                        <input className="form-control" placeholder="%" value={vitalsFormData.spo2} onChange={e => setVitalsFormData({...vitalsFormData, spo2: e.target.value})} />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: '#64748B', marginBottom: '4px' }}>TEMP (°F)</label>
                                                        <input className="form-control" placeholder="98.6" value={vitalsFormData.temp} onChange={e => setVitalsFormData({...vitalsFormData, temp: e.target.value})} />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: '#64748B', marginBottom: '4px' }}>RR</label>
                                                        <input className="form-control" placeholder="/min" value={vitalsFormData.respRate} onChange={e => setVitalsFormData({...vitalsFormData, respRate: e.target.value})} />
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowVitalsForm(false)}>CANCEL</button>
                                                    <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                                                        {saving ? <Loader2 className="animate-spin" size={14} /> : 'RECORD VITALS'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                                        <table className="icu-table">
                                            <thead>
                                                <tr>
                                                    <th>Time</th>
                                                    <th>HR</th>
                                                    <th>BP (S/D)</th>
                                                    <th>SpO2</th>
                                                    <th>Temp</th>
                                                    <th>RR</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {vitalsHistory.map((h) => (
                                                    <tr key={h.id}>
                                                        <td style={{ fontWeight: 700 }}>{new Date(h.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                        <td style={{ color: (h.heartRate > 100 || h.heartRate < 50) ? '#DC2626' : 'inherit' }}>{h.heartRate}</td>
                                                        <td>{h.systolicBP}/{h.diastolicBP}</td>
                                                        <td style={{ color: h.spo2 < 93 ? '#DC2626' : '#16A34A', fontWeight: 700 }}>{h.spo2}%</td>
                                                        <td>{h.temp}°F</td>
                                                        <td>{h.respRate}</td>
                                                    </tr>
                                                ))}
                                                {vitalsHistory.length === 0 && (
                                                    <tr>
                                                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                                                            {vitalsLoading ? <Loader2 className="animate-spin" style={{ margin: 'auto' }} /> : 'No intra-op vitals recorded.'}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                        <div style={{ padding: '12px', background: '#F8FAFC', fontSize: '11px', color: '#64748B', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Activity size={12} color="#00C2FF" />
                                            Vitals are synced with the patient's Clinical Monitoring (ICU) records.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
