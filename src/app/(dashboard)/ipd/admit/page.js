'use client';
import { Save, ArrowLeft, Search, BedDouble, UserPlus, Clock } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AdmitForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [patients, setPatients] = useState([]);
    const [searchPatient, setSearchPatient] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);

    const [doctorName, setDoctorName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [ward, setWard] = useState('');
    const [floor, setFloor] = useState('');
    const [bed, setBed] = useState('');
    const [admitNotes, setAdmitNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [dbWards, setDbWards] = useState([]);
    const [tenant, setTenant] = useState(null);
    const [captureDeposit, setCaptureDeposit] = useState(false);
    const [payMode, setPayMode] = useState('Cash');
    const [admittedPatientIds, setAdmittedPatientIds] = useState(new Set());
    
    // Doctor search states
    const [doctors, setDoctors] = useState([]);
    const [doctorSearch, setDoctorSearch] = useState('');
    const [isDoctorSearchFocused, setIsDoctorSearchFocused] = useState(false);

    useEffect(() => {
        const refId = searchParams.get('refId');
        const refPatientId = searchParams.get('patientId');
        const refPatient = searchParams.get('patient');
        const refDoctor = searchParams.get('doctor');
        const refWard = searchParams.get('ward');

        const fetchData = async () => {
            try {
                const [ptRes, wRes, dRes, tRes, iRes] = await Promise.all([
                    fetch('/api/patients'),
                    fetch('/api/facility/wards'),
                    fetch('/api/hr/staff'),
                    fetch('/api/settings'),
                    fetch('/api/ipd')
                ]);

                if (ptRes.ok) {
                    const ptData = await ptRes.json();
                    const allPatients = ptData.patients || [];
                    setPatients(allPatients);

                    // Auto-select patient from referral
                    if (refPatientId) {
                        const found = allPatients.find(p => p.id === refPatientId);
                        if (found) setSelectedPatient(found);
                    } else if (refPatient) {
                        const searchLower = refPatient.toLowerCase().trim();
                        const found = allPatients.find(p => 
                            `${p.firstName} ${p.lastName}`.toLowerCase().trim() === searchLower ||
                            p.firstName.toLowerCase().trim() === searchLower ||
                            p.lastName.toLowerCase().trim() === searchLower
                        );
                        if (found) {
                            setSelectedPatient(found);
                        } else {
                            // If direct registration match fails, at least pre-fill the search box to suggest results
                            setSearchPatient(refPatient);
                        }
                    }
                }
                if (wRes.ok) {
                    const wData = await wRes.json();
                    setDbWards(wData.wards || []);
                }
                if (dRes.ok) {
                    const dData = await dRes.json();
                    setDoctors((dData.staff || []).filter(s => 
                        s.role?.toLowerCase() === 'doctor' || 
                        s.role?.toLowerCase() === 'consultant' ||
                        s.role?.toLowerCase() === 'physician'
                    ));
                }
                if (tRes.ok) {
                    const tData = await tRes.json();
                    setTenant(tData.settings);
                }
                if (iRes.ok) {
                    const iData = await iRes.json();
                    const admitted = new Set((iData.ipdPatients || []).map(p => p.patientId));
                    setAdmittedPatientIds(admitted);
                }

                // Set other pre-filled fields
                if (refDoctor) setDoctorName(refDoctor);
                if (refWard) setWard(refWard);
                if (searchParams.get('bed')) setBed(searchParams.get('bed'));
                
                // Pre-set today's date
                setDate(new Date().toISOString().split('T')[0]);

            } catch (err) {
                console.error("Failed to load data:", err);
            }
        };
        fetchData();
    }, [searchParams]);

    const activeWardObj = dbWards.find(w => w.name === ward) || null;
    const availableBeds = activeWardObj ? (activeWardObj.beds || []) : [];

    const filteredPatients = searchPatient
        ? patients.filter(p =>
            !admittedPatientIds.has(p.id) && (
            p.firstName.toLowerCase().includes(searchPatient.toLowerCase()) ||
            p.lastName.toLowerCase().includes(searchPatient.toLowerCase()) ||
            p.patientCode.toLowerCase().includes(searchPatient.toLowerCase()))
        )
        : [];

    const printDepositReceipt = (apptCode) => {
        const patientName = `${selectedPatient.firstName} ${selectedPatient.lastName}`;
        const amount = "10,000.00";
        const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
        
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Deposit Receipt - ${apptCode}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;color:#1a2336;padding:40px;max-width:600px;margin:0 auto}
.receipt-container{border: 2px solid #0f3460; padding: 30px; border-radius: 12px; position: relative; overflow: hidden;}
.watermark{position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; color: rgba(15, 52, 96, 0.05); font-weight: 900; z-index: -1; white-space: nowrap;}
.header{text-align: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px;}
.h-name{font-size: 20px; font-weight: 900; color: #0f3460; text-transform: uppercase;}
.h-info{font-size: 11px; color: #64748b; margin-top: 4px;}
.receipt-title{text-align: center; font-size: 14px; font-weight: 800; color: #fff; background: #0f3460; padding: 6px; border-radius: 4px; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px;}
.details-grid{display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 30px;}
.field{margin-bottom: 12px;}
.label{font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;}
.value{font-size: 14px; font-weight: 700; color: #1e293b;}
.amount-box{background: #f8fafc; border: 1.5px solid #e2e8f0; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;}
.amount-label{font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 4px;}
.amount-value{font-size: 32px; font-weight: 900; color: #0f3460;}
.footer{display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px;}
.signature{text-align: center; width: 180px; border-top: 1.5px solid #0f172a; padding-top: 6px; font-size: 11px; font-weight: 700;}
.note{font-size: 10px; color: #94a3b8; text-align: center; margin-top: 24px; border-top: 1px dashed #e2e8f0; padding-top: 12px;}
@media print{body{padding:0}.no-print{display:none}}
</style></head><body>
<div class="receipt-container">
    <div class="watermark">PAID RECEIPT</div>
    <div class="header">
        <div class="h-name">${tenant?.name || 'Nexora Health Systems'}</div>
        <div class="h-info">${tenant?.address || 'Medical Centre, Main Road'}<br>Phone: ${tenant?.phone || 'N/A'}</div>
    </div>
    <div class="receipt-title">IPD Advance Security Deposit</div>
    <div class="details-grid">
        <div class="field"><div class="label">Receipt No.</div><div class="value">DEP-${Math.floor(Math.random()*900000+100000)}</div></div>
        <div class="field" style="text-align: right;"><div class="label">Date</div><div class="value">${dateStr}</div></div>
        <div class="field"><div class="label">Patient Name</div><div class="value">${patientName}</div></div>
        <div class="field" style="text-align: right;"><div class="label">IPD / Appt No.</div><div class="value">${apptCode}</div></div>
        <div class="field"><div class="label">Patient UHID</div><div class="value">${selectedPatient.patientCode}</div></div>
        <div class="field" style="text-align: right;"><div class="label">Admitting Dept.</div><div class="value">${ward}</div></div>
    </div>
    <div class="amount-box">
        <div class="amount-label">RECEIVED SUM OF</div>
        <div class="amount-value">₹ ${amount}</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 6px; font-style: italic;">Rupees Ten Thousand Only</div>
    </div>
    <div class="footer">
        <div style="font-size: 11px; color: #64748b;">Method: ${payMode}</div>
        <div class="signature">Authorized Signatory<br><span style="font-weight: 400; font-size: 9px;">${tenant?.name || 'Nexora Health'}</span></div>
    </div>
    <div class="note">This is a valid financial document for security deposit. Please preserve for final discharge settlement.</div>
</div>
<script>window.onload=()=>{window.print(); setTimeout(()=>window.close(), 1000);}<\/script></body></html>`;

        const win = window.open('', '_blank', 'width=700,height=800');
        win.document.write(html);
        win.document.close();
    };

    const handleAdmit = async () => {
        if (!selectedPatient || !doctorName || !date || !ward || !bed) {
            alert('Please fill out all required fields.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/ipd', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: selectedPatient.id,
                    patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
                    doctorName: doctorName,
                    date: date,
                    time: time,
                    ward: ward,
                    bed: bed,
                    admitNotes: admitNotes,
                    refId: searchParams.get('refId'),
                    captureDeposit: captureDeposit,
                    payMode: payMode
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (captureDeposit) {
                    printDepositReceipt(data.admission.apptCode);
                }
                router.push('/ipd');
            } else {
                alert('Failed to admit patient');
            }
        } catch (err) {
            console.error('Admission error:', err);
            alert('An error occurred during admission');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/ipd" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Admit Patient (IPD)</h1>
                        <p className="page-header__subtitle">Allocate a ward or bed to admit a patient for inpatient care.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={() => router.push('/ipd')}>
                        Cancel Admission
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={handleAdmit} disabled={loading}>
                        <Save size={15} strokeWidth={1.5} />
                        {loading ? 'Admitting...' : 'Confirm Admission'}
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px', paddingBottom: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Patient Context */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '6px', borderRadius: '8px' }}>
                                <UserPlus size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Patient Directory</h3>
                        </div>

                        {!selectedPatient ? (
                            <div style={{ position: 'relative', marginBottom: '16px' }}>
                                <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                                <input
                                    type="text"
                                    placeholder="Search Patient by UHID or Name to pull records..."
                                    value={searchPatient}
                                    onChange={(e) => setSearchPatient(e.target.value)}
                                    style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }}
                                />
                                {filteredPatients.length > 0 && (
                                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '8px', marginTop: '4px', zIndex: 10, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                                        {filteredPatients.map(p => (
                                            <div
                                                key={p.id}
                                                style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', fontSize: '14px' }}
                                                onClick={() => { setSelectedPatient(p); setSearchPatient(''); }}
                                                onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                                                onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
                                            >
                                                <div style={{ fontWeight: 600 }}>{p.firstName} {p.lastName}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{p.patientCode}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ marginBottom: '20px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{selectedPatient.firstName} {selectedPatient.lastName}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>UHID: {selectedPatient.patientCode}</div>
                                </div>
                                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedPatient(null)} style={{ padding: '6px 12px', fontSize: '12px' }}>Change</button>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Admitting Doctor / Consultant <span style={{ color: 'red' }}>*</span></label>
                                
                                {doctorName ? (
                                    <div style={{ background: 'rgba(139,92,246,0.03)', border: '1px solid rgba(139,92,246,0.2)', padding: '10px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>
                                            {doctorName.startsWith('Dr.') ? doctorName : `Dr. ${doctorName}`}
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setDoctorName('');
                                                setDoctorSearch('');
                                            }}
                                            style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: '#DC2626', cursor: 'pointer' }}
                                        >
                                            Change
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ position: 'relative' }}>
                                        <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '11px', zIndex: 1 }} />
                                        <input 
                                            type="text" 
                                            value={doctorSearch}
                                            onFocus={() => setIsDoctorSearchFocused(true)}
                                            onBlur={() => setTimeout(() => setIsDoctorSearchFocused(false), 200)}
                                            onChange={(e) => setDoctorSearch(e.target.value)}
                                            placeholder="Search attending doctor..." 
                                            style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff' }} 
                                        />

                                        {(doctorSearch || isDoctorSearchFocused) && (
                                            <div 
                                                style={{ 
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: 0,
                                                    right: 0,
                                                    maxHeight: '200px', 
                                                    overflowY: 'auto', 
                                                    border: '1px solid var(--color-border-light)', 
                                                    borderRadius: '8px', 
                                                    marginTop: '4px',
                                                    background: '#fff', 
                                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                                    zIndex: 100
                                                }}
                                            >
                                                {doctors.filter(dr => 
                                                    dr.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
                                                    (dr.specialization && dr.specialization.toLowerCase().includes(doctorSearch.toLowerCase()))
                                                ).length > 0 ? doctors.filter(dr => 
                                                    dr.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
                                                    (dr.specialization && dr.specialization.toLowerCase().includes(doctorSearch.toLowerCase()))
                                                ).map((dr) => (
                                                    <div
                                                        key={dr.id}
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            const displayName = dr.name.toLowerCase().startsWith('dr.') ? dr.name : `Dr. ${dr.name}`;
                                                            setDoctorName(displayName);
                                                            setDoctorSearch('');
                                                            setIsDoctorSearchFocused(false);
                                                        }}
                                                        style={{ 
                                                            padding: '10px 14px', 
                                                            borderBottom: '1px solid var(--color-border-light)', 
                                                            cursor: 'pointer'
                                                        }}
                                                        onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                                                        onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
                                                    >
                                                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-navy)' }}>
                                                            {dr.name.toLowerCase().startsWith('dr.') ? dr.name : `Dr. ${dr.name}`}
                                                        </div>
                                                        <div style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 600 }}>{dr.specialization || dr.department || 'Consultant'}</div>
                                                    </div>
                                                )) : (
                                                    <div style={{ padding: '15px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                                                        {doctorSearch ? `No providers found matching "${doctorSearch}"` : "Search by doctor name..."}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Date <span style={{ color: 'red' }}>*</span></label>
                                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', color: 'var(--color-text-primary)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Time</label>
                                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', color: 'var(--color-text-primary)' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ward Allocation */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', padding: '6px', borderRadius: '8px' }}>
                                <BedDouble size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Bed Allocation & Category</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Ward Type <span style={{ color: 'red' }}>*</span></label>
                                <select
                                    value={ward}
                                    onChange={(e) => { setWard(e.target.value); setBed(''); }}
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}
                                >
                                    <option value="">Select Ward</option>
                                    {dbWards.map(w => (
                                        <option key={w.id} value={w.name}>{w.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Floor / Wing</label>
                                <div style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', fontSize: '14px', backgroundColor: '#F8FAFC', color: 'var(--color-text-secondary)' }}>
                                    {activeWardObj?.floorWing ? activeWardObj.floorWing : 'N/A (Select Ward First)'}
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Bed Number <span style={{ color: 'red' }}>*</span></label>
                                <select
                                    value={bed}
                                    onChange={(e) => setBed(e.target.value)}
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}
                                    disabled={!ward}
                                >
                                    <option value="">Available Beds...</option>
                                    {availableBeds.map(b => (
                                        <option key={b.id} value={`Bed ${b.bedNumber}`}>Bed {b.bedNumber}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Admitting Diagnosis / Remarks</label>
                                <textarea
                                    value={admitNotes}
                                    onChange={(e) => setAdmitNotes(e.target.value)}
                                    rows="3"
                                    placeholder="Enter clinical reasoning for ward admission and initial orders..."
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', resize: 'vertical' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admission Finances Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ padding: '24px', background: '#FAFCFF', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '16px' }}>Admission Billing Profile</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', width: '100px' }}>Deposit Reqd:</div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>₹ 10,000.00</div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', width: '100px' }}>Bed Rent/Day:</div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>₹ 1,500.00 (General)</div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', width: '100px' }}>Care Category:</div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Standard</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed var(--color-border-light)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-navy)', cursor: 'pointer', marginBottom: captureDeposit ? '12px' : 0 }}>
                                <input 
                                    type="checkbox" 
                                    style={{ width: '16px', height: '16px' }} 
                                    checked={captureDeposit}
                                    onChange={(e) => setCaptureDeposit(e.target.checked)}
                                />
                                Capture Security Deposit Now (Prints Bill)
                            </label>

                            {captureDeposit && (
                                <div className="fade-in" style={{ padding: '12px', background: '#F0F9FF', borderRadius: '8px', border: '1px solid #BAE6FD' }}>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase', marginBottom: '6px' }}>Select Payment Mode</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {['Cash', 'Card', 'UPI', 'Cheque'].map(mode => (
                                            <button 
                                                key={mode}
                                                type="button"
                                                onClick={() => setPayMode(mode)}
                                                style={{ 
                                                    flex: 1, padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: '1.5px solid',
                                                    background: payMode === mode ? '#0284C7' : '#fff',
                                                    color: payMode === mode ? '#fff' : '#0369A1',
                                                    borderColor: payMode === mode ? '#0284C7' : '#BAE6FD'
                                                }}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function IPDAdmitPageWrapper() {
    return (
        <Suspense fallback={<div style={{ padding: '20px' }}>Loading admission form...</div>}>
            <AdmitForm />
        </Suspense>
    );
}

