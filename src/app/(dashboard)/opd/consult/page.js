'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import Skeleton from '@/components/common/Skeleton';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Stethoscope, Search, Activity, Plus, Trash2,
    Pill, FileText, Save, CheckCircle, Loader2, User, X, Printer,
    ArrowRightCircle
} from 'lucide-react';

const FREQUENCIES = ['Once daily', 'Twice daily (BD)', 'Thrice daily (TID)', 'Four times daily (QID)', 'Every 6 hours', 'Every 8 hours', 'At bedtime (HS)', 'As needed (SOS)', 'Before meals (AC)', 'After meals (PC)'];
const DURATIONS = ['1 day', '3 days', '5 days', '7 days', '10 days', '14 days', '1 month', '2 months', '3 months', 'Ongoing'];

const iStyle = { width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', fontSize: '14px', fontFamily: 'inherit' };

function OPDConsultContent() {
    const router = useRouter();
    const params = useSearchParams();
    const aptId = params.get('appointmentId');
    const aptPatient = params.get('patient');
    const aptDoctor = params.get('doctor');

    const [patients, setPatients] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patientSearch, setPatientSearch] = useState(aptPatient || '');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [medSearch, setMedSearch] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(null);
    const [error, setError] = useState('');
    const [loadingData, setLoadingData] = useState(true);
    const [tenant, setTenant] = useState(null);

    const [vitals, setVitals] = useState({ bp: '', heartRate: '', temperature: '', weight: '' });
    const [clinical, setClinical] = useState({ chiefComplaint: '', diagnosis: '', clinicalNotes: '', followUpDate: '' });
    const [doctorName, setDoctorName] = useState(aptDoctor || '');
    const [rxItems, setRxItems] = useState([]);
    const [labItems, setLabItems] = useState([]);
    const [labSearch, setLabSearch] = useState('');
    const [referIPD, setReferIPD] = useState({ enabled: false, department: '', urgency: 'Routine' });
    const [doctorSearch, setDoctorSearch] = useState('');
    const [isDoctorSearchFocused, setIsDoctorSearchFocused] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const [pRes, mRes, dRes] = await Promise.all([
                    fetch('/api/patients'),
                    fetch('/api/pharmacy/medicines'),
                    fetch('/api/hr/staff'),
                ]);
                if (pRes.ok) setPatients((await pRes.json()).patients || []);
                if (mRes.ok) setMedicines((await mRes.json()).medicines || []);
                if (dRes.ok) {
                    const staff = (await dRes.json()).staff || [];
                    setDoctors(staff.filter(s =>
                        s.role?.toLowerCase() === 'doctor' ||
                        s.role?.toLowerCase() === 'consultant' ||
                        s.role?.toLowerCase() === 'physician'
                    ));
                }
            } catch (err) {
            } finally {
                setLoadingData(false);
            }
        };
        load();

        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.settings) setTenant(data.settings);
            })
            .catch(() => { });
    }, []);

    const filteredPatients = patientSearch.length > 1
        ? patients.filter(p => `${p.firstName} ${p.lastName} ${p.patientCode} ${p.phone || ''}`.toLowerCase().includes(patientSearch.toLowerCase())).slice(0, 6)
        : [];

    const filteredMeds = medSearch.length > 1
        ? medicines.filter(m => m.name.toLowerCase().includes(medSearch.toLowerCase()) || (m.genericName || '').toLowerCase().includes(medSearch.toLowerCase())).slice(0, 8)
        : [];

    const addMedicine = (med) => {
        if (rxItems.find(r => r.medicineId === med.id)) return;
        setRxItems(prev => [...prev, {
            medicineId: med.id, medicineName: med.name, genericName: med.genericName || '',
            dosage: '', frequency: 'Twice daily (BD)', duration: '5 days',
            quantity: 10, instructions: '', unitPrice: med.mrp, stock: med.stock,
        }]);
        setMedSearch('');
    };

    const updateItem = (idx, field, value) => {
        setRxItems(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
    };

    const removeItem = (idx) => setRxItems(prev => prev.filter((_, i) => i !== idx));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!doctorName) return setError('Doctor name is required');
        const patientName = selectedPatient
            ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
            : patientSearch;
        if (!patientName) return setError('Patient is required');

        setSaving(true); setError('');
        try {
            const res = await fetch('/api/prescriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...vitals, ...clinical, doctorName,
                    patientName,
                    patientUhId: selectedPatient?.patientCode || null,
                    patientId: selectedPatient?.id || null,
                    appointmentId: aptId || null,
                    isIPDReferral: referIPD.enabled,
                    referralDepartment: referIPD.department,
                    referralUrgency: referIPD.urgency,
                    items: rxItems,
                    labItems: labItems,
                })
            });
            if (res.ok) {
                const data = await res.json();
                setSaved(data.prescription);
            } else {
                const err = await res.json();
                setError(err.error || 'Failed to save');
            }
        } catch (e) { setError('Network error'); }
        finally { setSaving(false); }
    };

    const printRx = () => {
        if (!saved) return;
        const patientName = selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : patientSearch;
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Rx ${saved.rxCode}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;color:#1a2336;padding:40px;max-width:800px;margin:0 auto}
.header{display:flex;justify-content:space-between;align-items:start;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #0f3460}
.header-left{flex:1}
.header-right{text-align:right;flex:1}
.rx-symbol{font-size:42px;font-weight:900;color:#0f3460;line-height:1;margin-bottom:4px}
.doctor-name{font-size:24px;font-weight:800;color:#0f3460;margin-bottom:4px}
.dept-name{font-size:13px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
.h-name{font-size:18px;font-weight:900;color:#1e293b;text-transform:uppercase;margin-bottom:6px}
.h-info{font-size:11px;color:#64748b;line-height:1.5;max-width:280px;margin-left:auto}
.logo{width:60px;height:60px;object-fit:contain;margin-bottom:10px}
.logo-placeholder{width:60px;height:60px;background:#0f172a;color:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-left:auto;margin-bottom:10px}
.section{margin-bottom:24px}.section-title{font-size:11px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;border-bottom:1.5px solid #f1f5f9;padding-bottom:6px}
.row{display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px}.label{color:#64748b}.value{font-weight:700;color:#1a2336}
table{width:100%;border-collapse:collapse;margin-top:12px}th{background:#f8fafc;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;padding:10px 14px;text-align:left;border:1.5px solid #e2e8f0}td{padding:10px 14px;font-size:14px;border:1.5px solid #e2e8f0;vertical-align:top}
.footer{text-align:center;margin-top:48px;padding-top:24px;border-top:1px dashed #cbd5e1;font-size:12px;color:#94a3b8}
.sign-box{margin-top:60px;text-align:right}.sign-line{display:inline-block;width:220px;border-top:2px solid #0f172a;padding-top:8px;font-size:13px;color:#0f172a;font-weight:800}
@media print{body{padding:0}.no-print{display:none}}
</style></head><body>
<div class="header">
    <div class="header-left">
        <div class="rx-symbol">℞</div>
        <div class="doctor-name">Dr. ${doctorName}</div>
        <div class="dept-name">OPD Consultation • ${saved.rxCode}</div>
    </div>
    <div class="header-right">
        ${tenant?.logoUrl ? `<img src="${tenant.logoUrl}" class="logo" alt="Logo" />` : `<div class="logo-placeholder"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg></div>`}
        <div class="h-name">${tenant?.name || 'Nexora Health Systems'}</div>
        <div class="h-info">
            ${tenant?.address || 'Hospital Address Configuration Pending'}<br>
            Phone: ${tenant?.phone || 'N/A'}<br>
            Web: ${typeof window !== 'undefined' ? `${window.location.host}${tenant?.slug ? '/' + tenant.slug : ''}` : 'www.nexora.com'}
        </div>
    </div>
</div>
<div class="section"><div class="section-title">Patient Details</div>
<div class="row"><span class="label">Patient</span><span class="value">${patientName}</span></div>
${selectedPatient?.patientCode ? `<div class="row"><span class="label">UHID</span><span class="value">${selectedPatient.patientCode}</span></div>` : ''}
<div class="row"><span class="label">Date</span><span class="value">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
${saved.followUpDate ? `<div class="row"><span class="label">Follow-up</span><span class="value">${saved.followUpDate}</span></div>` : ''}
</div>
${(vitals.bp || vitals.heartRate || vitals.temperature || vitals.weight) ? `
<div class="section"><div class="section-title">Vitals</div>
${vitals.bp ? `<div class="row"><span class="label">Blood Pressure</span><span class="value">${vitals.bp}</span></div>` : ''}
${vitals.heartRate ? `<div class="row"><span class="label">Heart Rate</span><span class="value">${vitals.heartRate}</span></div>` : ''}
${vitals.temperature ? `<div class="row"><span class="label">Temperature</span><span class="value">${vitals.temperature}</span></div>` : ''}
${vitals.weight ? `<div class="row"><span class="label">Weight / SpO2</span><span class="value">${vitals.weight}</span></div>` : ''}
</div>` : ''}
${clinical.chiefComplaint ? `<div class="section"><div class="section-title">Chief Complaint</div><p style="font-size:13px;color:#334155">${clinical.chiefComplaint}</p></div>` : ''}
${clinical.diagnosis ? `<div class="section"><div class="section-title">Diagnosis</div><p style="font-size:14px;font-weight:700;color:#0f3460">${clinical.diagnosis}</p></div>` : ''}
${rxItems.length > 0 ? `
<div class="section"><div class="section-title">Prescription</div>
<table><thead><tr><th>#</th><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Qty</th><th>Instructions</th></tr></thead>
<tbody>${rxItems.map((item, i) => `<tr><td>${i + 1}</td><td><strong>${item.medicineName}</strong>${item.genericName ? `<br><span style="font-size:11px;color:#94a3b8">${item.genericName}</span>` : ''}</td><td>${item.dosage || '—'}</td><td>${item.frequency}</td><td>${item.duration}</td><td>${item.quantity}</td><td>${item.instructions || '—'}</td></tr>`).join('')}</tbody>
</table></div>` : ''}
${clinical.clinicalNotes ? `<div class="section"><div class="section-title">Clinical Notes / Advice</div><p style="font-size:13px;color:#334155;line-height:1.6">${clinical.clinicalNotes}</p></div>` : ''}
<div class="sign-box"><div class="sign-line">${doctorName}<br><span style="font-weight:400">Signature & Stamp</span></div></div>
<div class="footer"><p>This is a computer-generated prescription from Nexora Health.</p></div>
<script>window.onload=()=>{window.print()}<\/script></body></html>`;
        const win = window.open('', '_blank', 'width=720,height=900');
        win.document.write(html);
        win.document.close();
    };

    if (saved) {
        return (
            <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <CheckCircle size={36} style={{ color: '#16A34A' }} />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '8px' }}>Prescription Saved!</h2>
                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '6px' }}>Rx Code: <strong style={{ fontFamily: 'monospace', color: 'var(--color-navy)' }}>{saved.rxCode}</strong></p>
                {rxItems.some(r => r.medicineId) && (
                    <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '14px', marginBottom: '24px', marginTop: '12px', fontSize: '13px', color: '#15803D' }}>
                        ✅ Pharmacy dispense request created — medicines are in the queue.
                    </div>
                )}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
                    <button className="btn btn-secondary" onClick={printRx}><Printer size={15} /> Print Prescription</button>
                    <Link href="/opd" className="btn btn-primary" style={{ textDecoration: 'none' }}>← Back to OPD Queue</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <Link href="/opd" className="btn btn-secondary btn-sm" style={{ padding: '8px', background: '#fff' }}><ArrowLeft size={18} /></Link>
                    <div>
                        <h1 className="page-header__title" style={{ marginBottom: '4px' }}>OPD Consultation</h1>
                        <p className="page-header__subtitle">Write clinical notes, vitals, diagnosis and prescription</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={() => router.push('/opd')}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={saving}>
                        {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
                        {saving ? 'Saving…' : 'Save & Send to Pharmacy'}
                    </button>
                </div>
            </div>
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

            {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#DC2626', fontSize: '14px' }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Patient + Doctor */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(0,194,255,0.1)', color: 'var(--color-cyan)', padding: '6px', borderRadius: '8px' }}><User size={16} /></div>
                            <span style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '15px' }}>Patient & Doctor</span>

                            {/* Templates Trigger */}
                            <div style={{ marginLeft: 'auto' }}>
                                <select
                                    className="btn btn-secondary btn-sm"
                                    style={{ background: '#fff', fontSize: '11px', padding: '4px 8px' }}
                                    onChange={(e) => {
                                        const t = e.target.value;
                                        if (t === 'fever') {
                                            setClinical(prev => ({ ...prev, chiefComplaint: 'High grade fever with chills for 2 days. Body ache and fatigue.', diagnosis: 'Acute Febrile Illness (AFI) - Viral' }));
                                        } else if (t === 'htn') {
                                            setClinical(prev => ({ ...prev, chiefComplaint: 'Routine follow-up for Hypertension. No acute complaints.', diagnosis: 'Essential Hypertension' }));
                                        }
                                    }}
                                >
                                    <option value="">Quick Templates...</option>
                                    <option value="fever">Viral Fever Template</option>
                                    <option value="htn">Hypertension Follow-up</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {/* Patient search */}
                            <div style={{ gridColumn: '1 / -1', position: 'relative' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Patient <span style={{ color: 'red' }}>*</span></label>
                                {selectedPatient ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: '2px solid #10B981', borderRadius: '8px', background: '#F0FDF4' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, color: '#065F46' }}>{selectedPatient.firstName} {selectedPatient.lastName}</div>
                                            <div style={{ fontSize: '12px', color: '#6B7280' }}>{selectedPatient.patientCode} · {selectedPatient.gender || ''} · {selectedPatient.phone || ''}</div>
                                        </div>
                                        <button onClick={() => { setSelectedPatient(null); setPatientSearch(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={16} /></button>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ position: 'relative' }}>
                                            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                                            <input style={{ ...iStyle, paddingLeft: '36px' }} placeholder="Search by name, UHID, or phone…"
                                                value={patientSearch} onChange={e => setPatientSearch(e.target.value)} />
                                        </div>
                                        {filteredPatients.length > 0 && (
                                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 20, marginTop: '4px' }}>
                                                {filteredPatients.map(p => (
                                                    <div key={p.id} onClick={() => { setSelectedPatient(p); setPatientSearch(`${p.firstName} ${p.lastName}`); }}
                                                        style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9', fontSize: '13px' }}
                                                        onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'}
                                                        onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                                                        <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{p.firstName} {p.lastName}</div>
                                                        <div style={{ color: '#94A3B8', fontSize: '12px' }}>{p.patientCode} · {p.gender || '—'} · {p.phone || '—'}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Consulting Doctor <span style={{ color: 'red' }}>*</span></label>

                                {doctorName ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#F8FAFC' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '14px' }}>
                                                {doctorName.startsWith('Dr.') ? doctorName : `Dr. ${doctorName}`}
                                            </div>
                                        </div>
                                        <button onClick={() => { setDoctorName(''); setDoctorSearch(''); }} style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: '#DC2626', cursor: 'pointer' }}>Change</button>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ position: 'relative' }}>
                                            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '11px', zIndex: 1 }} />
                                            <input
                                                style={{ ...iStyle, paddingLeft: '36px' }}
                                                placeholder="Search doctor or specialization…"
                                                value={doctorSearch}
                                                onFocus={() => setIsDoctorSearchFocused(true)}
                                                onBlur={() => setTimeout(() => setIsDoctorSearchFocused(false), 200)}
                                                onChange={e => setDoctorSearch(e.target.value)}
                                            />
                                        </div>
                                        {(doctorSearch || isDoctorSearchFocused) && (
                                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 30, marginTop: '4px', maxHeight: '200px', overflowY: 'auto' }}>
                                                {doctors.filter(d =>
                                                    d.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
                                                    (d.specialization && d.specialization.toLowerCase().includes(doctorSearch.toLowerCase()))
                                                ).length > 0 ? doctors.filter(d =>
                                                    d.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
                                                    (d.specialization && d.specialization.toLowerCase().includes(doctorSearch.toLowerCase()))
                                                ).map(d => (
                                                    <div key={d.id}
                                                        onClick={() => {
                                                            const displayName = d.name.toLowerCase().startsWith('dr.') ? d.name : `Dr. ${d.name}`;
                                                            setDoctorName(displayName);
                                                            setDoctorSearch('');
                                                            setIsDoctorSearchFocused(false);
                                                        }}
                                                        style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9', fontSize: '13px' }}
                                                        onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'}
                                                        onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                                                        <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{d.name.toLowerCase().startsWith('dr.') ? d.name : `Dr. ${d.name}`}</div>
                                                        <div style={{ color: '#8B5CF6', fontSize: '12px', fontWeight: 600 }}>{d.specialization || d.department || 'Consultant'}</div>
                                                    </div>
                                                )) : (
                                                    <div style={{ padding: '15px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                                                        {doctorSearch ? `No providers found matching "${doctorSearch}"` : "Search by doctor name..."}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Follow-up Date</label>
                                <input type="date" style={iStyle} value={clinical.followUpDate} onChange={e => setClinical(c => ({ ...c, followUpDate: e.target.value }))} />
                            </div>
                        </div>
                    </div>

                    {/* Vitals */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '6px', borderRadius: '8px' }}><Activity size={16} /></div>
                            <span style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '15px' }}>Vitals <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 400 }}>(optional)</span></span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
                            {[
                                { key: 'bp', label: 'Blood Pressure', placeholder: '120/80 mmHg' },
                                { key: 'heartRate', label: 'Heart Rate', placeholder: '72 bpm' },
                                { key: 'temperature', label: 'Temperature', placeholder: '98.6 °F' },
                                { key: 'weight', label: 'Weight / SpO2', placeholder: '70 kg / 98%' },
                            ].map(v => (
                                <div key={v.key}>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '5px', color: '#64748B' }}>{v.label}</label>
                                    <input style={iStyle} placeholder={v.placeholder} value={vitals[v.key]} onChange={e => setVitals(prev => ({ ...prev, [v.key]: e.target.value }))} />
                                </div>
                            ))}
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '5px', color: '#64748B' }}>BMI Estimate</label>
                                <div style={{
                                    ...iStyle,
                                    background: '#F8FAFC',
                                    color: '#0EA5E9',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px dashed #0EA5E9'
                                }}>
                                    {(() => {
                                        const w = parseFloat(vitals.weight?.split(' ')[0]);
                                        // Assume average height of 170cm if not available, or just show calc
                                        if (w && w > 0) return (w / (1.7 * 1.7)).toFixed(1);
                                        return '—';
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Clinical Notes */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', padding: '6px', borderRadius: '8px' }}><FileText size={16} /></div>
                            <span style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '15px' }}>Clinical Notes</span>
                        </div>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Chief Complaint</label>
                                <input style={iStyle} placeholder="e.g., Fever and headache for 3 days" value={clinical.chiefComplaint} onChange={e => setClinical(c => ({ ...c, chiefComplaint: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Diagnosis / Impression</label>
                                <input style={iStyle} placeholder="e.g., Viral Upper Respiratory Tract Infection" value={clinical.diagnosis} onChange={e => setClinical(c => ({ ...c, diagnosis: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Clinical Notes / Advice</label>
                                <textarea rows={3} style={{ ...iStyle, resize: 'vertical' }} placeholder="Observations, advice, examination findings, lifestyle recommendations…" value={clinical.clinicalNotes} onChange={e => setClinical(c => ({ ...c, clinicalNotes: e.target.value }))} />
                            </div>
                        </div>
                    </div>

                    {/* IPD Referral */}
                    <div className="card" style={{ padding: '24px', border: referIPD.enabled ? '1px solid #F59E0B' : '1px solid var(--color-border-light)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', paddingBottom: '12px', borderBottom: referIPD.enabled ? '1px solid rgba(245,158,11,0.2)' : '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', padding: '6px', borderRadius: '8px' }}><ArrowRightCircle size={16} /></div>
                            <span style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '15px' }}>Admission / IPD Referral</span>
                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '40px', height: '22px' }}>
                                    <input type="checkbox" checked={referIPD.enabled} onChange={e => setReferIPD(prev => ({ ...prev, enabled: e.target.checked }))} style={{ opacity: 0, width: 0, height: 0 }} />
                                    <span style={{
                                        position: 'absolute', cursor: 'pointer', inset: 0, background: referIPD.enabled ? '#F59E0B' : '#E2E8F0', borderRadius: '22px', transition: '0.4s',
                                        display: 'flex', alignItems: 'center', padding: '2px'
                                    }}>
                                        <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', transform: referIPD.enabled ? 'translateX(18px)' : 'translateX(0)', transition: '0.4s' }} />
                                    </span>
                                </label>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: referIPD.enabled ? '#F59E0B' : '#94A3B8' }}>{referIPD.enabled ? 'ENABLED' : 'DISABLED'}</span>
                            </div>
                        </div>

                        {referIPD.enabled && (
                            <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Refer to Department</label>
                                    <select style={iStyle} value={referIPD.department} onChange={e => setReferIPD(prev => ({ ...prev, department: e.target.value }))}>
                                        <option value="">Select Department...</option>
                                        <option value="General Medicine">General Medicine</option>
                                        <option value="Cardiology">Cardiology</option>
                                        <option value="Orthopedics">Orthopedics</option>
                                        <option value="Neurology">Neurology</option>
                                        <option value="Surgery">General Surgery</option>
                                        <option value="Pediatrics">Pediatrics</option>
                                        <option value="ICU">ICU / Intensive Care</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Admission Urgency</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {['Routine', 'Urgent', 'Emergency'].map(u => (
                                            <button key={u} type="button" onClick={() => setReferIPD(prev => ({ ...prev, urgency: u }))} style={{
                                                flex: 1, padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: '1px solid',
                                                background: referIPD.urgency === u ? (u === 'Emergency' ? '#FEE2E2' : u === 'Urgent' ? '#FEF3C7' : '#EFF6FF') : '#fff',
                                                borderColor: referIPD.urgency === u ? (u === 'Emergency' ? '#EF4444' : u === 'Urgent' ? '#F59E0B' : '#3B82F6') : '#E2E8F0',
                                                color: referIPD.urgency === u ? (u === 'Emergency' ? '#B91C1C' : u === 'Urgent' ? '#B45309' : '#1D4ED8') : '#64748B'
                                            }}>{u}</button>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ gridColumn: '1 / -1', background: '#FFFBEB', padding: '12px', borderRadius: '8px', border: '1px dashed #F59E0B', fontSize: '13px', color: '#92400E' }}>
                                    ⚠️ <strong>Note:</strong> Enabling this will flag this patient for IPD registration. The clinical notes above will be used as the primary referral reason.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Lab Orders (CPOE) */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '6px', borderRadius: '8px' }}><Activity size={16} /></div>
                            <span style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '15px' }}>Lab & Imaging Orders (CPOE)</span>
                            <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#94A3B8' }}>{labItems.length} order{labItems.length !== 1 ? 's' : ''}</span>
                        </div>

                        <div style={{ position: 'relative', marginBottom: '16px' }}>
                            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                            <input
                                style={{ ...iStyle, paddingLeft: '36px' }}
                                placeholder="Search tests: CBC, HbA1c, X-Ray, LFT, Blood Group..."
                                value={labSearch}
                                onChange={e => setLabSearch(e.target.value)}
                            />
                            {labSearch.length > 0 && (
                                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 20, marginTop: '4px' }}>
                                    {[
                                        { testName: 'CBC (Complete Blood Count)', category: 'Hematology', amount: 450 },
                                        { testName: 'HbA1c (Glycated Hemoglobin)', category: 'Biochemistry', amount: 650 },
                                        { testName: 'RFT (Renal Function Test)', category: 'Biochemistry', amount: 800 },
                                        { testName: 'LFT (Liver Function Test)', category: 'Biochemistry', amount: 900 },
                                        { testName: 'Lipid Profile', category: 'Biochemistry', amount: 750 },
                                        { testName: 'Urine Routine', category: 'Microbiology', amount: 200 },
                                        { testName: 'Blood Group & Rh', category: 'Pathology', amount: 150 },
                                        { testName: 'Chest X-Ray (PA View)', category: 'Radiology', amount: 500 },
                                        { testName: 'ECG (12 Lead)', category: 'Cardiology', amount: 400 },
                                        { testName: 'Ultrasound Abdomen', category: 'Radiology', amount: 1200 },
                                    ].filter(t => t.testName.toLowerCase().includes(labSearch.toLowerCase())).map((test, i) => (
                                        <div key={i} onClick={() => {
                                            if (!labItems.find(l => l.testName === test.testName)) {
                                                setLabItems([...labItems, test]);
                                            }
                                            setLabSearch('');
                                        }} style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9' }} onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                                            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-navy)' }}>{test.testName}</div>
                                            <div style={{ fontSize: '11px', color: '#94A3B8' }}>{test.category} · ₹{test.amount}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {labItems.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                <thead style={{ background: '#F8FAFC' }}>
                                    <tr>
                                        <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>Test Name</th>
                                        <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>Category</th>
                                        <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {labItems.map((test, i) => (
                                        <tr key={i}>
                                            <td style={{ padding: '10px 8px', borderBottom: '1px solid #F1F5F9', fontWeight: 600, color: 'var(--color-navy)' }}>{test.testName}</td>
                                            <td style={{ padding: '10px 8px', borderBottom: '1px solid #F1F5F9', color: '#64748B' }}>{test.category}</td>
                                            <td style={{ padding: '10px 8px', borderBottom: '1px solid #F1F5F9', textAlign: 'right' }}>
                                                <button onClick={() => setLabItems(labItems.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8', border: '2px dashed #E2E8F0', borderRadius: '10px' }}>
                                <p style={{ fontSize: '13px' }}>No labs ordered. Search for a test above.</p>
                            </div>
                        )}
                    </div>

                    {/* Prescription items */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(20,184,166,0.1)', color: '#14B8A6', padding: '6px', borderRadius: '8px' }}><Pill size={16} /></div>
                            <span style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '15px' }}>Prescription</span>
                            <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#94A3B8' }}>{rxItems.length} medicine{rxItems.length !== 1 ? 's' : ''} added</span>
                        </div>

                        {/* Medicine search */}
                        <div style={{ position: 'relative', marginBottom: '16px' }}>
                            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                            <input style={{ ...iStyle, paddingLeft: '36px' }} placeholder="Search medicine by name or generic name…"
                                value={medSearch} onChange={e => setMedSearch(e.target.value)} />
                            {filteredMeds.length > 0 && (
                                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 20, marginTop: '4px', maxHeight: '280px', overflowY: 'auto' }}>
                                    {filteredMeds.map(m => (
                                        <div key={m.id} onClick={() => addMedicine(m)}
                                            style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                            onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'}
                                            onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-navy)' }}>{m.name}</div>
                                                <div style={{ fontSize: '11px', color: '#94A3B8' }}>{m.genericName || ''} · {m.category}</div>
                                            </div>
                                            <div style={{ textAlign: 'right', fontSize: '12px' }}>
                                                <div style={{ color: m.stock > 0 ? '#16A34A' : '#DC2626', fontWeight: 600 }}>{m.stock} in stock</div>
                                                <div style={{ color: '#94A3B8' }}>₹{m.mrp}/unit</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {rxItems.length === 0 ? (
                            <div style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', border: '2px dashed #E2E8F0', borderRadius: '10px' }}>
                                <Pill size={28} strokeWidth={1} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                                <p style={{ fontSize: '13px' }}>Search for a medicine above to add it to the prescription</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {rxItems.map((item, idx) => (
                                    <div key={idx} style={{ border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <div>
                                                <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '14px' }}>{item.medicineName}</div>
                                                <div style={{ fontSize: '12px', color: '#94A3B8' }}>{item.genericName} · Stock: {item.stock} · ₹{item.unitPrice}/unit</div>
                                            </div>
                                            <button onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '4px' }}><Trash2 size={15} /></button>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px', gap: '10px' }}>
                                            <div>
                                                <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '4px' }}>Dosage</label>
                                                <input style={{ ...iStyle, padding: '7px 10px', fontSize: '13px' }} placeholder="e.g. 500mg" value={item.dosage} onChange={e => updateItem(idx, 'dosage', e.target.value)} />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '4px' }}>Frequency</label>
                                                <select style={{ ...iStyle, padding: '7px 10px', fontSize: '13px', background: '#fff' }} value={item.frequency} onChange={e => updateItem(idx, 'frequency', e.target.value)}>
                                                    {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '4px' }}>Duration</label>
                                                <select style={{ ...iStyle, padding: '7px 10px', fontSize: '13px', background: '#fff' }} value={item.duration} onChange={e => updateItem(idx, 'duration', e.target.value)}>
                                                    {DURATIONS.map(d => <option key={d}>{d}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '4px' }}>Qty</label>
                                                <input type="number" min="1" style={{ ...iStyle, padding: '7px 10px', fontSize: '13px', textAlign: 'center' }} value={item.quantity} onChange={e => updateItem(idx, 'quantity', parseInt(e.target.value) || 1)} />
                                            </div>
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '4px' }}>Special Instructions</label>
                                                <input style={{ ...iStyle, padding: '7px 10px', fontSize: '13px' }} placeholder="e.g. Take after meals, avoid alcohol" value={item.instructions} onChange={e => updateItem(idx, 'instructions', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right summary panel */}
                <div style={{ position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="card" style={{ padding: '20px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '14px' }}>Consultation Summary</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                            {[
                                { label: 'Patient', value: selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : patientSearch || '—' },
                                { label: 'Doctor', value: doctorName || '—' },
                                { label: 'Chief Complaint', value: clinical.chiefComplaint || '—' },
                                { label: 'Diagnosis', value: clinical.diagnosis || '—' },
                                { label: 'Medicines', value: `${rxItems.length} prescribed` },
                                { label: 'Follow-up', value: clinical.followUpDate || 'Not set' },
                            ].map(r => (
                                <div key={r.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingBottom: '10px', borderBottom: '1px solid #F1F5F9' }}>
                                    <span style={{ color: '#94A3B8', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{r.label}</span>
                                    <span style={{ color: 'var(--color-navy)', fontWeight: 500, wordBreak: 'break-word' }}>{r.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {rxItems.length > 0 && (
                        <div className="card" style={{ padding: '20px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '12px' }}>Rx Cost Estimate</div>
                            {rxItems.map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: '#64748B' }}>
                                    <span>{item.medicineName} × {item.quantity}</span>
                                    <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>₹{((item.unitPrice || 0) * item.quantity).toFixed(0)}</span>
                                </div>
                            ))}
                            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '10px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '14px', color: 'var(--color-navy)' }}>
                                <span>Total</span>
                                <span>₹{rxItems.reduce((s, i) => s + (i.unitPrice || 0) * i.quantity, 0).toFixed(0)}</span>
                            </div>
                        </div>
                    )}

                    <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '14px', fontSize: '12px', color: '#1E40AF' }}>
                        💊 <strong>Auto-dispatch:</strong> When you save, a pharmacy dispense request will be created automatically for all medicines with inventory IDs.
                    </div>

                    <button className="btn btn-primary" onClick={handleSubmit} disabled={saving} style={{ width: '100%', padding: '13px', fontSize: '15px', fontWeight: 700 }}>
                        {saving ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : <><Save size={15} /> Save & Send to Pharmacy</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function OPDConsultPage() {
    return (
        <Suspense fallback={
            <div className="fade-in space-y-6">
                <div className="dashboard-header-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <Skeleton circle width="40px" height="40px" />
                        <div>
                            <Skeleton width="200px" height="24px" />
                            <Skeleton width="300px" height="15px" className="mt-1" />
                        </div>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px' }}>
                    <div className="space-y-6">
                        <Skeleton height="200px" borderRadius="12px" />
                        <Skeleton height="150px" borderRadius="12px" />
                        <Skeleton height="250px" borderRadius="12px" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton height="300px" borderRadius="12px" />
                        <Skeleton height="150px" borderRadius="12px" />
                    </div>
                </div>
            </div>
        }>
            <OPDConsultContent />
        </Suspense>
    );
}
