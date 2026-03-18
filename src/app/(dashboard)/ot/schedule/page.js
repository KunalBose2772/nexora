'use client';

import { 
    Save, 
    ArrowLeft, 
    Search, 
    Scissors, 
    Clock, 
    User, 
    Stethoscope, 
    Calendar,
    AlertTriangle,
    Hospital,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ScheduleSurgeryPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [searchPatient, setSearchPatient] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [wards, setWards] = useState([]); // Using as OT rooms

    const [formData, setFormData] = useState({
        procedureName: '',
        surgeonName: '',
        otRoom: 'OT-1',
        startTime: '',
        anesthesiaType: 'General',
        preOpDiagnosis: '',
        isMlc: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ptRes, drRes, wRes] = await Promise.all([
                    fetch('/api/patients'),
                    fetch('/api/hr/staff'),
                    fetch('/api/facility/wards')
                ]);

                if (ptRes.ok) {
                    const d = await ptRes.json();
                    setPatients(d.patients || []);
                }
                if (drRes.ok) {
                    const d = await drRes.json();
                    setDoctors((d.staff || []).filter(s => s.role?.toLowerCase() === 'doctor'));
                }
                if (wRes.ok) {
                    const d = await wRes.json();
                    setWards(d.wards || []);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const filteredPatients = patients.filter(p => 
        p.firstName.toLowerCase().includes(searchPatient.toLowerCase()) || 
        p.lastName.toLowerCase().includes(searchPatient.toLowerCase()) ||
        p.patientCode?.toLowerCase().includes(searchPatient.toLowerCase())
    ).slice(0, 5);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPatient || !formData.procedureName || !formData.surgeonName) {
            alert('Core procedure metrics missing.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/ot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: selectedPatient.id,
                    ...formData
                })
            });

            if (res.ok) {
                router.push('/ot');
            } else {
                alert('Surgical scheduling failed.');
            }
        } catch (err) {
            alert('System synchronization error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in max-w-5xl mx-auto pb-20">
            <style>{`
                .form-group { margin-bottom: 20px; }
                .form-label { 
                    display: block; 
                    font-size: 12px; 
                    font-weight: 500; 
                    color: #475569; 
                    margin-bottom: 6px; 
                }
                .form-input { 
                    width: 100%; 
                    height: 38px;
                    padding: 8px 12px; 
                    border: 1px solid #CBD5E1; 
                    border-radius: 6px; 
                    font-size: 13px; 
                    outline: none; 
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); 
                    background: #fff; 
                    color: #0F172A;
                    font-weight: 400;
                }
                .form-input:focus { 
                    border-color: #00C2FF; 
                    box-shadow: 0 0 0 3px rgba(0, 194, 255, 0.1); 
                }
                .card-section { 
                    background: #fff; 
                    border-radius: 12px; 
                    border: 1px solid rgba(0,0,0,0.05); 
                    padding: 24px; 
                    margin-bottom: 24px; 
                }
                .section-title { 
                    font-size: 15px; 
                    font-weight: 600; 
                    color: #0F172A; 
                    margin-bottom: 24px; 
                    display: flex; 
                    align-items: center; 
                    gap: 12px; 
                }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link href="/ot" className="btn btn-secondary shadow-sm" style={{ width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: '#fff' }}>
                        <ArrowLeft size={18} color="#1E293B" />
                    </Link>
                    <div>
                        <h1 className="responsive-h1" style={{ margin: 0, color: '#0F172A', fontWeight: 600 }}>Surgical Scheduling</h1>
                        <p style={{ fontSize: '14px', color: '#64748B', margin: '2px 0 0', fontWeight: 500 }}>Orchestrating precision perioperative care pathways.</p>
                    </div>
                </div>
                <button onClick={handleSubmit} className="btn-executive" style={{ background: '#0F172A', color: '#fff', border: 'none', padding: '0 24px' }} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    COMMIT SCHEDULE
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
                <div>
                    {/* Patient Context */}
                    <div className="card-section shadow-premium">
                        <div className="section-title">
                            <User size={20} color="#00C2FF" />
                            Patient Identity & Bio-Context
                        </div>
                        
                        {!selectedPatient ? (
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: '#94A3B8' }} />
                                <input 
                                    className="form-input" 
                                    style={{ paddingLeft: '44px', height: '48px' }} 
                                    placeholder="Search Master Registry by Name or UHID..." 
                                    value={searchPatient}
                                    onChange={(e) => setSearchPatient(e.target.value)}
                                />
                                {searchPatient && filteredPatients.length > 0 && (
                                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', marginTop: '8px', zIndex: 10, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                                        {filteredPatients.map(p => (
                                            <div 
                                                key={p.id} 
                                                style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}
                                                onClick={() => { setSelectedPatient(p); setSearchPatient(''); }}
                                                onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'}
                                                onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
                                            >
                                                <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '14px' }}>{p.firstName} {p.lastName}</div>
                                                <div style={{ fontSize: '12px', color: '#94A3B8' }}>{p.patientCode} • {p.gender}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ background: '#F0F9FF', border: '1px solid #B9E6FE', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)' }}>{selectedPatient.firstName} {selectedPatient.lastName}</div>
                                    <div style={{ fontSize: '12px', color: '#0369A1', fontWeight: 500 }}>{selectedPatient.patientCode} • Age: {selectedPatient.dob ? (new Date().getFullYear() - new Date(selectedPatient.dob).getFullYear()) : 'N/A'}</div>
                                </div>
                                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedPatient(null)} style={{ background: '#fff', fontSize: '11px' }}>Change Patient</button>
                            </div>
                        )}
                    </div>

                    {/* Surgical Specs */}
                    <div className="card-section shadow-premium">
                        <div className="section-title">
                            <Scissors size={20} color="#00C2FF" />
                            Procedure Archetype
                        </div>
                        <div className="form-group">
                            <label className="form-label">Name of Procedure <span style={{ color: '#EF4444' }}>*</span></label>
                            <input 
                                className="form-input" 
                                placeholder="e.g. Total Hip Arthroplasty, Laparoscopic Cholecystectomy..." 
                                value={formData.procedureName}
                                onChange={(e) => setFormData({...formData, procedureName: e.target.value})}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Lead Surgeon <span style={{ color: '#EF4444' }}>*</span></label>
                                <select 
                                    className="form-input" 
                                    value={formData.surgeonName}
                                    onChange={(e) => setFormData({...formData, surgeonName: e.target.value})}
                                >
                                    <option value="">Select Consultant...</option>
                                    {doctors.map(d => (
                                        <option key={d.id} value={d.name}>{d.name} ({d.specialization})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Theater Allocation</label>
                                <select 
                                    className="form-input"
                                    value={formData.otRoom}
                                    onChange={(e) => setFormData({...formData, otRoom: e.target.value})}
                                >
                                    <option>OT-1</option>
                                    <option>OT-2</option>
                                    <option>OT-3</option>
                                    <option>Septic OT</option>
                                    <option>Cath Lab</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Pre-Op Clinical Diagnosis</label>
                            <textarea 
                                className="form-input" 
                                rows="3" 
                                placeholder="Primary reason for surgical intervention..." 
                                value={formData.preOpDiagnosis}
                                onChange={(e) => setFormData({...formData, preOpDiagnosis: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card-section shadow-premium" style={{ padding: '24px' }}>
                        <div className="section-title" style={{ fontSize: '14px' }}>
                            <Clock size={16} color="#00C2FF" />
                            Temporal Metrics
                        </div>
                        <div className="form-group">
                            <label className="form-label">Commencement Time</label>
                            <input 
                                type="datetime-local" 
                                className="form-input" 
                                value={formData.startTime}
                                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Anesthesia Type</label>
                            <select 
                                className="form-input"
                                value={formData.anesthesiaType}
                                onChange={(e) => setFormData({...formData, anesthesiaType: e.target.value})}
                            >
                                <option>General Anesthesia (GA)</option>
                                <option>Spinal Anesthesia</option>
                                <option>Local Anesthesia (LA)</option>
                                <option>Regional Block</option>
                                <option>IV Sedation</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ background: '#FFF7ED', border: '1px solid #FFEDD5', padding: '20px', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                            <AlertTriangle size={18} color="#F97316" />
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#9A3412' }}>Risk Governance</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input 
                                type="checkbox" 
                                id="mlc" 
                                style={{ width: '16px', height: '16px' }} 
                                checked={formData.isMlc}
                                onChange={(e) => setFormData({...formData, isMlc: e.target.checked})}
                            />
                            <label htmlFor="mlc" style={{ fontSize: '13px', fontWeight: 600, color: '#9A3412' }}>Flag as Medico-Legal Case (MLC)</label>
                        </div>
                        <p style={{ fontSize: '11px', color: '#C2410C', marginTop: '10px', lineHeight: 1.5, fontWeight: 500 }}>
                            Checking this box will trigger mandatory registry protocols and notify the legal department upon ingress.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
