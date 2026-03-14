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

    useEffect(() => {
        // Parse query params for ward and bed
        if (searchParams.get('ward')) {
            setWard(searchParams.get('ward'));
        }
        if (searchParams.get('bed')) {
            setBed(searchParams.get('bed'));
        }

        const fetchData = async () => {
            try {
                const [ptRes, wRes] = await Promise.all([
                    fetch('/api/patients'),
                    fetch('/api/facility/wards')
                ]);

                if (ptRes.ok) {
                    const ptData = await ptRes.json();
                    setPatients(ptData.patients || []);
                }
                if (wRes.ok) {
                    const wData = await wRes.json();
                    setDbWards(wData.wards || []);
                }
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
            p.firstName.toLowerCase().includes(searchPatient.toLowerCase()) ||
            p.lastName.toLowerCase().includes(searchPatient.toLowerCase()) ||
            p.patientCode.toLowerCase().includes(searchPatient.toLowerCase()))
        : [];

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
                    admitNotes: admitNotes
                })
            });

            if (res.ok) {
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
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Admitting Doctor / Consultant <span style={{ color: 'red' }}>*</span></label>
                                <select
                                    value={doctorName}
                                    onChange={(e) => setDoctorName(e.target.value)}
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}
                                >
                                    <option value="">Select Attending Provider</option>
                                    <option value="Dr. Raj Malhotra">Dr. Raj Malhotra (Orthopedics)</option>
                                    <option value="Dr. Vinita Singh">Dr. Vinita Singh (General Surgery)</option>
                                    <option value="Dr. Priya Sharma">Dr. Priya Sharma (Internal Medicine)</option>
                                    <option value="Dr. Arjun Nair">Dr. Arjun Nair (Cardiology)</option>
                                </select>
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
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-navy)', cursor: 'pointer' }}>
                                <input type="checkbox" style={{ width: '16px', height: '16px' }} />
                                Capture Security Deposit Now
                            </label>
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

