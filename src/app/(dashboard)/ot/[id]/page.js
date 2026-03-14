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

    const fetchSurgery = useCallback(async () => {
        try {
            const res = await fetch(`/api/ot/${id}`);
            const data = await res.json();
            if (res.ok) setSurgery(data.surgery);
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

    if (loading) return <div style={{ padding: '40px' }}><Loader2 className="animate-spin" /></div>;
    if (!surgery) return <div style={{ padding: '40px' }}>Surgery record not found.</div>;

    const checklist = surgery.checklist || {};

    return (
        <div className="fade-in">
            <style>{`
                .tab-btn { padding: 12px 24px; font-size: 14px; font-weight: 700; border: none; background: none; cursor: pointer; color: #64748B; border-bottom: 2px solid transparent; transition: all 0.2s; }
                .tab-btn.active { color: #00C2FF; border-bottom-color: #00C2FF; }
                .checklist-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; border: 1px solid #F1F5F9; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; }
                .checklist-item:hover { background: #F8FAFC; border-color: #E2E8F0; }
                .checklist-item.checked { background: #F0FDF4; border-color: #BBF7D0; }
                .form-control { width: 100%; padding: 10px 14px; border: 1px solid #E2E8F0; border-radius: 10px; font-size: 14px; outline: none; }
                .section-header { font-size: 13px; font-weight: 800; color: #1E293B; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em; border-left: 4px solid #00C2FF; padding-left: 12px; }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/ot" className="btn btn-secondary btn-sm" style={{ padding: '8px' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{surgery.procedureName}</h1>
                            <span className={`badge ${surgery.status === 'Completed' ? 'badge-success' : 'badge-info'}`}>{surgery.status}</span>
                        </div>
                        <p style={{ color: '#64748B', margin: '4px 0 0', fontSize: '14px' }}>
                            {surgery.surgeryCode} • Patient: <span style={{ fontWeight: 700, color: '#00C2FF' }}>{surgery.patient?.firstName} {surgery.patient?.lastName}</span>
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <select
                        value={surgery.status}
                        onChange={(e) => handleUpdate({ status: e.target.value })}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '8px 16px', fontWeight: 700 }}
                    >
                        <option>Scheduled</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                    </select>
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
                                <button className="btn btn-primary" style={{ height: '56px', fontSize: '16px', fontWeight: 800 }}>
                                    <Scissors size={20} /> SIGN PROCEDURAL RECORD
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'anesthesia' && (
                        <div className="fade-in" style={{ textAlign: 'center', padding: '100px', background: '#F8FAFC', borderRadius: '24px', border: '1px dashed #E2E8F0' }}>
                            <ShieldCheck size={48} color="#CBD5E1" style={{ marginBottom: '16px' }} />
                            <h3 style={{ margin: 0, color: '#64748B' }}>Anesthesia Intra-Op Monitoring is under development.</h3>
                            <p style={{ color: '#94A3B8', fontSize: '14px' }}>Hourly monitoring charts will be integrated with ICU vitals.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
