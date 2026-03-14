'use client';

import {
    ArrowLeft, Activity, User, ShieldAlert,
    Thermometer, HeartPulse, Clock, FileText,
    CheckCircle2, AlertTriangle, ChevronRight,
    Save, Plus, Pill, FlaskConical, Stethoscope
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EmergencyCaseDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(false);

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

    const handleUpdateVitals = async () => {
        setUpdating(true);
        try {
            const res = await fetch('/api/emergency/triage', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: id,
                    triageVitals: vitals
                })
            });
            if (res.ok) {
                await fetchRecord();
                alert('Vitals updated successfully.');
            }
        } catch (error) {
            alert('Failed to update vitals.');
        } finally {
            setUpdating(false);
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/emergency" className="btn btn-secondary btn-sm" style={{ padding: '8px' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{record.patientName}</h1>
                            <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: record.triageLevel === 1 ? '#FEE2E2' : '#FEF9C3', color: record.triageLevel === 1 ? '#EF4444' : '#854D0E' }}>
                                ESI-{record.triageLevel}
                            </span>
                            {record.isMLC && <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#0F172A', color: '#fff' }}>MLC Case</span>}
                        </div>
                        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                            {record.apptCode} • Arrived {timeAgo(record.createdAt)} ({new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary">
                        <FileText size={16} /> Print ER Slip
                    </button>
                    {record.isMLC && (
                        <button className="btn btn-secondary" style={{ borderColor: '#EF4444', color: '#EF4444' }}>
                            <ShieldAlert size={16} /> MLC Documents
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Chief Complaint & Trauma Info */}
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Initial Assessment</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>CHIEF COMPLAINT</label>
                                <p style={{ fontSize: '15px', color: '#1E293B', fontWeight: 500, lineHeight: 1.6 }}>{record.admitNotes || 'No notes'}</p>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>MECHANISM / TRAUMA TYPE</label>
                                <p style={{ fontSize: '15px', color: '#1E293B', fontWeight: 500 }}>{record.traumaType || 'N/A'}</p>

                                {record.bystanderName && (
                                    <div style={{ marginTop: '16px', background: '#F8FAFC', padding: '12px', borderRadius: '12px' }}>
                                        <label style={{ display: 'block', fontSize: '11px', color: '#64748B', fontWeight: 700, marginBottom: '4px' }}>BYSTANDER INFO</label>
                                        <div style={{ fontSize: '13px', color: '#1E293B', fontWeight: 600 }}>{record.bystanderName}</div>
                                        <div style={{ fontSize: '12px', color: '#64748B' }}>{record.bystanderPhone}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Vitals Tracking */}
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Vitals</h3>
                            <button className="btn btn-secondary btn-sm" onClick={handleUpdateVitals} disabled={updating}>
                                {updating ? 'Saving...' : 'Save Current Vitals'}
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#64748B', fontWeight: 700, marginBottom: '6px' }}>BLOOD PRESSURE</label>
                                <input className="vitals-input" value={vitals.bp} onChange={e => setVitals({ ...vitals, bp: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#64748B', fontWeight: 700, marginBottom: '6px' }}>HEART RATE</label>
                                <input className="vitals-input" value={vitals.hr} onChange={e => setVitals({ ...vitals, hr: e.target.value })} style={{ color: parseInt(vitals.hr) > 100 ? '#EF4444' : 'inherit' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#64748B', fontWeight: 700, marginBottom: '6px' }}>TEMPERATURE</label>
                                <input className="vitals-input" value={vitals.temp} onChange={e => setVitals({ ...vitals, temp: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#64748B', fontWeight: 700, marginBottom: '6px' }}>SPO2 (%)</label>
                                <input className="vitals-input" value={vitals.spo2} onChange={e => setVitals({ ...vitals, spo2: e.target.value })} style={{ color: parseInt(vitals.spo2) < 94 ? '#EF4444' : 'inherit' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#64748B', fontWeight: 700, marginBottom: '6px' }}>RESP. RATE</label>
                                <input className="vitals-input" value={vitals.rr} onChange={e => setVitals({ ...vitals, rr: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* ER Clinical Timeline */}
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>Clinical Activities</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ minWidth: '40px', textAlign: 'right', fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>10:30</div>
                                <div style={{ width: '2px', background: '#E2E8F0', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: 0, left: '-4px', width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }}></div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Initial Triage Done</div>
                                    <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>ESI-2 assigned by Nurse Sarah. High priority.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ minWidth: '40px', textAlign: 'right', fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>10:32</div>
                                <div style={{ width: '2px', background: '#E2E8F0', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: 0, left: '-4px', width: '10px', height: '10px', borderRadius: '50%', background: '#94A3B8' }}></div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Case Registered</div>
                                    <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>System record auto-created. MLC flagged.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column - ER Management Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Care Management</div>

                    <div className="action-card">
                        <div style={{ width: '44px', height: '44px', background: '#FEE2E2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                            <Plus size={22} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>ER Order Entry</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>Stat Meds & Labs</div>
                        </div>
                        <ChevronRight size={16} color="#CBD5E1" />
                    </div>

                    <div className="action-card">
                        <div style={{ width: '44px', height: '44px', background: '#DBEAFE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                            <Stethoscope size={22} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Doctor Consult</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>Clinical Notes</div>
                        </div>
                        <ChevronRight size={16} color="#CBD5E1" />
                    </div>

                    <div style={{ marginTop: '10px', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Disposition</div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button onClick={() => router.push(`/ipd/admit?patientId=${record.patient?.id || ''}&from=ER`)} className="btn btn-primary" style={{ height: '48px', background: '#0F172A', color: '#fff', border: 'none', width: '100%', fontSize: '13px' }}>
                                <Plus size={16} /> Admit to IPD / ICU
                            </button>
                            <button className="btn btn-secondary" style={{ height: '48px', width: '100%', fontSize: '13px' }}>
                                <CheckCircle2 size={16} color="#16A34A" /> Discharge from ER
                            </button>
                            <button className="btn btn-secondary" style={{ height: '48px', width: '100%', fontSize: '13px' }}>
                                <ChevronRight size={16} /> Transfer (LAMA/Referral)
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', background: '#F8FAFC', padding: '20px', borderRadius: '16px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Security & Police</h4>
                        <p style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>
                            As an MLC case, police notification is mandatory. Ensure the duty sergeant is informed.
                        </p>
                        <button className="btn btn-secondary btn-sm" style={{ width: '100%', fontSize: '11px', background: '#fff' }}>
                            <ShieldAlert size={14} /> Send Police Intimation
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
