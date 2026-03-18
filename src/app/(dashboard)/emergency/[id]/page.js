'use client';

import {
    ArrowLeft, Activity, User, ShieldAlert,
    Thermometer, HeartPulse, Clock, FileText,
    CheckCircle2, AlertTriangle, ChevronRight,
    Save, Plus, Pill, FlaskConical, Stethoscope,
    ArrowUpRight, BedDouble
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

export default function EmergencyCaseDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const action = searchParams.get('action');
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(false);
    const [referralModal, setReferralModal] = useState(false);
    const [dischargeModal, setDischargeModal] = useState(false);
    const [referring, setReferring] = useState(false);

    // Form states for vitals update
    const [vitals, setVitals] = useState({
        bp: '', hr: '', temp: '', spo2: '', rr: ''
    });

    const fetchRecord = useCallback(async () => {
        try {
            const res = await fetch(`/api/emergency/${id}`);
            const data = await res.json();
            if (res.ok) {
                setRecord(data.appointment);
                if (data.appointment.triageVitals) {
                    setVitals(JSON.parse(data.appointment.triageVitals));
                }
            } else {
                setError(data.error || 'Failed to load case.');
            }
        } catch (err) {
            setError('Network error.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchRecord();
    }, [fetchRecord]);

    useEffect(() => {
        if (!loading && action) {
            const el = document.getElementById(action === 'assess' ? 'assessment-hub' : 'disposition-hub');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [loading, action]);

    const handleUpdateVitals = async () => {
        setUpdating(true);
        try {
            const res = await fetch('/api/emergency/triage', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: record.id,
                    triageVitals: vitals
                })
            });
            if (res.ok) {
                await fetchRecord();
                alert('Clinical vitals synchronized successfully.');
            }
        } catch (error) {
            alert('Failed to synchronize vitals.');
        } finally {
            setUpdating(false);
        }
    };

    const handleStatusUpdate = async (newStatus, msg) => {
        setUpdating(true);
        try {
            const res = await fetch('/api/emergency/triage', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: record.id,
                    status: newStatus
                })
            });
            if (res.ok) {
                alert(msg);
                router.push('/emergency');
            }
        } catch (error) {
            alert('Operation failed.');
        } finally {
            setUpdating(false);
        }
    };

    const handleDischarge = async (type) => {
        const msg = type === 'Stable' 
            ? 'Patient marked as Stable for Discharge. Routing to billing.' 
            : `Patient marked as ${type}. Terminal disposition logged.`;
        
        await handleStatusUpdate(`Discharged: ${type}`, msg);
        setDischargeModal(false);
    };

    const handleReferral = async (unit) => {
        setReferring(true);
        try {
            const res = await fetch('/api/emergency/triage', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: record.id,
                    status: `Referred: ${unit}`,
                    triageNotes: `${record.triageNotes || ''}\n[${new Date().toLocaleString()}] Clinical Handover initiated to ${unit}.`
                })
            });
            if (res.ok) {
                alert(`Referral successful: specialized trauma payload transmitted to ${unit}.`);
                router.push('/emergency');
            }
        } catch (error) {
            alert('Referral orchestration failed.');
        } finally {
            setReferring(false);
            setReferralModal(false);
        }
    };

    if (loading) return <div style={{ padding: '24px' }}>Loading case details...</div>;
    if (error) return <div style={{ padding: '24px', color: '#DC2626' }}>{error}</div>;
    if (!record) return <div style={{ padding: '24px' }}>Record not found.</div>;

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const minutes = Math.floor(seconds / 60);
        return minutes < 60 ? `${minutes}m ago` : `${Math.floor(minutes / 60)}h ago`;
    };

    return (
        <div className="fade-in">
            <style>{`
                .vitals-input { width: 100%; padding: 8px 12px; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 14px; font-weight: 700; background: #F8FAFC; }
                .action-card { background: #fff; border: 1px solid rgba(0,0,0,0.05); border-radius: 16px; padding: 20px; transition: all 0.2s; cursor: pointer; display: flex; align-items: center; gap: 15px; }
                .action-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-color: #EF4444; }
                .esi-marker { width: 12px; height: 12px; border-radius: 50%; }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link href="/emergency" className="btn btn-secondary shadow-sm" style={{ width: '44px', height: '44px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                            <h1 className="responsive-h1" style={{ margin: 0 }}>{record.patientName}</h1>
                            <span style={{ 
                                fontSize: '11px', 
                                fontWeight: 700, 
                                padding: '4px 10px', 
                                borderRadius: '20px', 
                                background: record.triageLevel === 1 ? '#FEF2F2' : '#FFFBEB', 
                                color: record.triageLevel === 1 ? '#EF4444' : '#92400E',
                                border: `1px solid ${record.triageLevel === 1 ? '#FEE2E2' : '#FEF3C7'}`,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                ESI-{record.triageLevel} Protocol
                            </span>
                            {record.isMLC && (
                                <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: 'var(--color-navy)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    MLC Flagged
                                </span>
                            )}
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0, fontWeight: 500 }}>
                            {record.apptCode} • Arrived {timeAgo(record.createdAt)} ({new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary shadow-sm" style={{ background: '#fff' }} onClick={() => window.print()}>
                        <FileText size={16} style={{ marginRight: '8px' }} /> Print Clinical Case
                    </button>
                    {record.isMLC && (
                        <button className="btn btn-secondary shadow-sm" style={{ background: '#fff', borderColor: '#EF4444', color: '#EF4444' }}>
                            <ShieldAlert size={16} style={{ marginRight: '8px' }} /> Legal Registry
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Chief Complaint & Trauma Info */}
                    <div id="assessment-hub" className="card shadow-premium" style={{ padding: '28px', border: action === 'assess' ? '2px solid var(--color-navy)' : '1px solid rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Initial Clinical Assessment</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#94A3B8', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>Chief Complaint</label>
                                <p style={{ fontSize: '15px', color: 'var(--color-navy)', fontWeight: 500, lineHeight: 1.6, margin: 0 }}>{record.admitNotes || 'No immediate clinical notes recorded.'}</p>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#94A3B8', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>Mechanism of Injury</label>
                                <p style={{ fontSize: '15px', color: 'var(--color-navy)', fontWeight: 500, margin: 0 }}>{record.traumaType || 'Non-traumatic / General'}</p>

                                {record.bystanderName && (
                                    <div style={{ marginTop: '20px', background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                                        <label style={{ display: 'block', fontSize: '10px', color: '#64748B', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>Informant Registry</label>
                                        <div style={{ fontSize: '14px', color: 'var(--color-navy)', fontWeight: 600 }}>{record.bystanderName}</div>
                                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{record.bystanderPhone}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Vitals Tracking */}
                    <div className="card shadow-premium" style={{ padding: '28px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Clinical Parameters (Live)</h3>
                            <button className="btn btn-secondary btn-sm shadow-sm" onClick={handleUpdateVitals} disabled={updating} style={{ background: '#fff', height: '32px' }}>
                                <Save size={14} style={{ marginRight: '6px' }} /> {updating ? 'Saving...' : 'Sync Parameters'}
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                            <div>
                                <label className="form-label" style={{ marginBottom: '8px' }}>BP</label>
                                <input className="form-input" value={vitals.bp} onChange={e => setVitals({ ...vitals, bp: e.target.value })} style={{ fontWeight: 600, textAlign: 'center', background: '#F8FAFC' }} />
                            </div>
                            <div>
                                <label className="form-label" style={{ marginBottom: '8px' }}>Heart Rate</label>
                                <input className="form-input" value={vitals.hr} onChange={e => setVitals({ ...vitals, hr: e.target.value })} style={{ fontWeight: 600, textAlign: 'center', background: '#F8FAFC', color: parseInt(vitals.hr) > 100 ? '#EF4444' : 'inherit' }} />
                            </div>
                            <div>
                                <label className="form-label" style={{ marginBottom: '8px' }}>Temp (°F)</label>
                                <input className="form-input" value={vitals.temp} onChange={e => setVitals({ ...vitals, temp: e.target.value })} style={{ fontWeight: 600, textAlign: 'center', background: '#F8FAFC' }} />
                            </div>
                            <div>
                                <label className="form-label" style={{ marginBottom: '8px' }}>SpO2 %</label>
                                <input className="form-input" value={vitals.spo2} onChange={e => setVitals({ ...vitals, spo2: e.target.value })} style={{ fontWeight: 600, textAlign: 'center', background: '#F8FAFC', color: parseInt(vitals.spo2) < 94 ? '#EF4444' : '#10B981' }} />
                            </div>
                            <div>
                                <label className="form-label" style={{ marginBottom: '8px' }}>RR</label>
                                <input className="form-input" value={vitals.rr} onChange={e => setVitals({ ...vitals, rr: e.target.value })} style={{ fontWeight: 600, textAlign: 'center', background: '#F8FAFC' }} />
                            </div>
                        </div>
                    </div>

                    {/* ER Clinical Timeline - Dynamic Telemetry */}
                    <div className="card shadow-premium" style={{ padding: '28px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live clinical Feed</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Arrival Event */}
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ minWidth: '45px', textAlign: 'right', fontSize: '12px', color: '#94A3B8', fontWeight: 600, paddingTop: '3px' }}>
                                    {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div style={{ width: '2px', background: 'var(--color-success)', opacity: 0.3, position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: '6px', left: '-5px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-success)', border: '3px solid #fff' }}></div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>Patient Origin & Ingress</div>
                                    <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0', lineHeight: 1.5 }}>Case initialized in Emergency Registry. Initial chief complaint registered.</p>
                                </div>
                            </div>

                            {/* Triage Event */}
                            {record.triageAt && (
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ minWidth: '45px', textAlign: 'right', fontSize: '12px', color: '#94A3B8', fontWeight: 600, paddingTop: '3px' }}>
                                        {new Date(record.triageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div style={{ width: '2px', background: '#EF4444', opacity: 0.3, position: 'relative' }}>
                                        <div style={{ position: 'absolute', top: '6px', left: '-5px', width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444', border: '3px solid #fff' }}></div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>ESI Triage Authentication</div>
                                        <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0', lineHeight: 1.5 }}>Priority Level {record.triageLevel} protocol established. Telemetry sync active.</p>
                                    </div>
                                </div>
                            )}

                            {/* Audit Logs from Triage Notes */}
                            {record.triageNotes && record.triageNotes.includes('[') && record.triageNotes.split('\n').filter(line => line.includes('[')).map((log, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ minWidth: '45px', textAlign: 'right', fontSize: '12px', color: '#94A3B8', fontWeight: 600, paddingTop: '3px' }}>
                                        {log.match(/\d{1,2}:\d{2}/)?.[0] || 'NOW'}
                                    </div>
                                    <div style={{ width: '2px', background: 'var(--color-navy)', opacity: 0.2, position: 'relative' }}>
                                        <div style={{ position: 'absolute', top: '6px', left: '-5px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-navy)', border: '2px solid #fff' }}></div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>Inter-Clinical Handover</div>
                                        <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0', lineHeight: 1.5 }}>{log.split(']').pop().trim()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column - ER Management Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Clinical Orchestration</div>

                    <div className="card shadow-premium" style={{ padding: '0', overflow: 'hidden' }}>
                        {[
                            { label: 'ER Order Entry', sub: 'Stat Meds & Labs', icon: Pill, color: '#EF4444', bg: '#FEF2F2', path: `/pharmacy/prescribe?patientId=${record.patient?.id || ''}&patient=${encodeURIComponent(record.patientName)}&source=ER` },
                            { label: 'Consultant Review', sub: 'Clinical Progression', icon: Stethoscope, color: '#0EA5E9', bg: '#F0F9FF', path: `/opd?patientId=${record.patient?.id || ''}&patientName=${encodeURIComponent(record.patientName)}` },
                            { label: 'Nursing & Procedures', sub: 'Procedure Logging', icon: User, color: '#F59E0B', bg: '#FFFBEB', path: `/patients?search=${encodeURIComponent(record.patientName)}` },
                        ].map((action, i) => (
                            <div 
                                key={i} 
                                onClick={() => router.push(action.path)}
                                style={{ padding: '20px', borderBottom: i < 2 ? '1px solid #F1F5F9' : 'none', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'background 0.2s' }} 
                                className="hover:bg-slate-50"
                            >
                                <div style={{ width: '44px', height: '44px', background: action.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: action.color }}>
                                    <action.icon size={22} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>{action.label}</div>
                                    <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>{action.sub}</div>
                                </div>
                                <ChevronRight size={14} color="#CBD5E1" />
                            </div>
                        ))}
                    </div>

                    <div id="disposition-hub" style={{ paddingTop: '8px', padding: action === 'logistics' ? '12px' : '0', borderRadius: '16px', background: action === 'logistics' ? 'rgba(10,46,77,0.03)' : 'transparent', border: action === 'logistics' ? '1px dashed var(--color-navy)' : 'none' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Terminal Disposition</div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button onClick={() => router.push(`/ipd/admit?patientId=${record.patient?.id || ''}&patient=${encodeURIComponent(record.patientName)}&from=ER`)} className="btn btn-primary" style={{ height: '52px', background: 'var(--color-navy)', fontSize: '14px', fontWeight: 600, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <Plus size={18} /> Admit to IPD / ICU
                            </button>
                            <button onClick={() => setDischargeModal(true)} className="btn btn-secondary shadow-sm" style={{ height: '52px', background: '#fff', fontSize: '14px', fontWeight: 600, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <CheckCircle2 size={18} color="var(--color-success)" /> Discharge from ER
                            </button>
                            <Link href={`/ipd/admit?patientId=${record.patientId || ''}&patient=${encodeURIComponent(record.patientName)}&doctor=${encodeURIComponent(record.doctorName)}`} className="btn btn-primary shadow-sm" style={{ height: '52px', background: 'var(--color-navy)', fontSize: '14px', fontWeight: 600, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none' }}>
                                <BedDouble size={18} color="#fff" /> Admit to IPD / ICU
                            </Link>
                            <button onClick={() => setReferralModal(true)} className="btn btn-secondary shadow-sm" style={{ height: '52px', background: '#fff', fontSize: '14px', fontWeight: 600, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <ArrowUpRight size={18} color="var(--color-navy)" /> Clinical Referral
                            </button>
                        </div>
                    </div>

                    {record.isMLC && (
                        <div style={{ background: '#FEF2F2', padding: '20px', borderRadius: '16px', border: '1px solid #FEE2E2' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                <ShieldAlert size={18} style={{ color: '#EF4444' }} />
                                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#991B1B', margin: 0 }}>Security Protocol</h4>
                            </div>
                            <p style={{ fontSize: '11px', color: '#B91C1C', lineHeight: 1.5, marginBottom: '16px', fontWeight: 500 }}>
                                Medico-Legal Case detected. Local police jurisdiction must be notified immediately per clinical protocol.
                            </p>
                            <button className="btn btn-secondary btn-sm shadow-sm" style={{ width: '100%', fontSize: '11px', background: '#fff', borderColor: '#FEE2E2', color: '#991B1B', fontWeight: 700 }}>
                                Send Police Intimation
                            </button>
                        </div>
                    )}

                </div>
            </div>
            {/* Specialized Referral Modal */}
            {referralModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(7, 18, 32, 0.4)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => !referring && setReferralModal(false)}>
                    <div style={{ background: '#fff', width: '100%', maxWidth: '440px', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{ width: '60px', height: '60px', background: 'rgba(10,46,77,0.05)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-navy)' }}>
                                <ArrowUpRight size={28} />
                            </div>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-navy)', margin: '0 0 8px' }}>Clinical Referral Orchestration</h2>
                            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>Select the specialized unit for acute trauma handover. This will initiate an electronic priority notification.</p>
                        </div>

                        {referring ? (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid #F1F5F9', borderTopColor: 'var(--color-navy)', borderRadius: '50%', margin: '0 auto 16px' }}></div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>Establishing Tele-Priority...</div>
                                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contacting Specialized Units</div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {['Cardiology (Stat)', 'Neurology (Acute)', 'Nephrology', 'Burn Unit / Plastics', 'Infectious Disease'].map(unit => (
                                    <button 
                                        key={unit} 
                                        onClick={() => handleReferral(unit)} 
                                        className="btn btn-secondary" 
                                        style={{ height: '48px', justifyContent: 'space-between', padding: '0 20px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}
                                    >
                                        <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{unit}</span>
                                        <ChevronRight size={14} color="#CBD5E1" />
                                    </button>
                                ))}
                                <button onClick={() => setReferralModal(false)} style={{ marginTop: '10px', fontSize: '12px', fontWeight: 600, color: '#94A3B8', border: 'none', background: 'none', cursor: 'pointer' }}>Cancel Handover</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Discharge Modal */}
            {dischargeModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(7, 18, 32, 0.4)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setDischargeModal(false)}>
                    <div style={{ background: '#fff', width: '100%', maxWidth: '440px', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{ width: '60px', height: '60px', background: 'rgba(16,185,129,0.05)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-success)' }}>
                                <CheckCircle2 size={28} />
                            </div>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-navy)', margin: '0 0 8px' }}>Terminal Discharge Disposition</h2>
                            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>Verify clinical stability and financial clearance before final registry closure.</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button 
                                onClick={() => handleDischarge('Stable')} 
                                className="btn btn-primary" 
                                style={{ height: '52px', background: 'var(--color-navy)', borderRadius: '12px', fontSize: '13px', fontWeight: 600, justifyContent: 'center' }}
                            >
                                Stable Discharge (Direct to Billing)
                            </button>
                            <button 
                                onClick={() => handleDischarge('DAMA')} 
                                className="btn btn-secondary" 
                                style={{ height: '48px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, justifyContent: 'center', color: '#EF4444' }}
                            >
                                DAMA (Against Medical Advice)
                            </button>
                            <button 
                                onClick={() => handleDischarge('Absconded')} 
                                className="btn btn-secondary" 
                                style={{ height: '48px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, justifyContent: 'center' }}
                            >
                                Absconded / LAMA
                            </button>
                            
                            <div style={{ marginTop: '20px', padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                    <FileText size={14} color="#64748B" />
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Financial Protocol</span>
                                </div>
                                <p style={{ fontSize: '11px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                                    Selecting "Stable Discharge" will flag the patient for final bill settlement in the Pharmacy & Billing terminals. Admissions and Referrals bypass immediate final billing till hospital-wide exit.
                                </p>
                            </div>

                            <button onClick={() => setDischargeModal(false)} style={{ marginTop: '10px', fontSize: '12px', fontWeight: 600, color: '#94A3B8', border: 'none', background: 'none', cursor: 'pointer' }}>Close Modal</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
