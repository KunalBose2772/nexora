'use client';
import { useState, useEffect } from 'react';
import { Save, ArrowLeft, FlaskConical, Search, Plus, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Master test catalog with categories and default prices
const TEST_CATALOG = [
    { name: 'Complete Blood Count (CBC)', category: 'Hematology', price: 350 },
    { name: 'Hemoglobin Test', category: 'Hematology', price: 150 },
    { name: 'ESR (Erythrocyte Sedimentation Rate)', category: 'Hematology', price: 120 },
    { name: 'Blood Group & Rh Typing', category: 'Hematology', price: 200 },
    { name: 'Lipid Profile', category: 'Biochemistry', price: 600 },
    { name: 'Liver Function Test (LFT)', category: 'Biochemistry', price: 700 },
    { name: 'Kidney Function Test (KFT)', category: 'Biochemistry', price: 700 },
    { name: 'Blood Glucose Fasting', category: 'Biochemistry', price: 150 },
    { name: 'Blood Glucose PP', category: 'Biochemistry', price: 150 },
    { name: 'HbA1c', category: 'Biochemistry', price: 500 },
    { name: 'Serum Uric Acid', category: 'Biochemistry', price: 250 },
    { name: 'Serum Creatinine', category: 'Biochemistry', price: 200 },
    { name: 'Thyroid Panel (T3, T4, TSH)', category: 'Immunology', price: 900 },
    { name: 'TSH (Thyroid Stimulating Hormone)', category: 'Immunology', price: 400 },
    { name: 'Vitamin D3 (25-OH)', category: 'Immunology', price: 1200 },
    { name: 'Vitamin B12', category: 'Immunology', price: 900 },
    { name: 'Serum Ferritin', category: 'Immunology', price: 800 },
    { name: 'C-Reactive Protein (CRP)', category: 'Immunology', price: 500 },
    { name: 'Urine Routine & Microscopic', category: 'Clinical Pathology', price: 250 },
    { name: 'Urine Culture & Sensitivity', category: 'Clinical Pathology', price: 600 },
    { name: 'Stool Routine', category: 'Clinical Pathology', price: 200 },
    { name: 'Chest X-Ray (PA View)', category: 'Radiology', price: 400 },
    { name: 'Chest X-Ray (AP + Lateral)', category: 'Radiology', price: 600 },
    { name: 'Ultrasound Abdomen & Pelvis', category: 'Radiology', price: 1200 },
    { name: 'ECG / EKG', category: 'Cardiology', price: 300 },
    { name: 'Dengue NS1 Antigen', category: 'Serology', price: 700 },
    { name: 'Malaria Antigen Test', category: 'Serology', price: 400 },
    { name: 'HIV 1 & 2 Screening', category: 'Serology', price: 500 },
    { name: 'HBsAg (Hepatitis B)', category: 'Serology', price: 400 },
];

export default function NewLabRequestPage() {
    const router = useRouter();
    const [patients, setPatients] = useState([]);
    const [searchPatient, setSearchPatient] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [staff, setStaff] = useState([]);
    const [doctorSearch, setDoctorSearch] = useState('');
    const [referringDoctor, setReferringDoctor] = useState('');
    const [collectionTime, setCollectionTime] = useState('');
    const [testSearch, setTestSearch] = useState('');
    const [selectedTests, setSelectedTests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ptRes, staffRes] = await Promise.all([
                    fetch('/api/patients'),
                    fetch('/api/staff')
                ]);
                if (ptRes.ok) {
                    const data = await ptRes.json();
                    setPatients(data.patients || []);
                }
                if (staffRes.ok) {
                    const data = await staffRes.json();
                    setStaff(data.staff || []);
                }
            } catch (err) {
                console.error('Error loading data:', err);
            }
        };
        fetchData();
    }, []);

    const filteredPatients = searchPatient
        ? patients.filter(p =>
            p.firstName.toLowerCase().includes(searchPatient.toLowerCase()) ||
            p.lastName.toLowerCase().includes(searchPatient.toLowerCase()) ||
            p.patientCode.toLowerCase().includes(searchPatient.toLowerCase())
        )
        : [];

    const filteredDoctors = doctorSearch.length >= 1
        ? staff.filter(s => s.name.toLowerCase().includes(doctorSearch.toLowerCase()))
        : [];

    const filteredCatalog = testSearch.length >= 2
        ? TEST_CATALOG.filter(t =>
            t.name.toLowerCase().includes(testSearch.toLowerCase()) ||
            t.category.toLowerCase().includes(testSearch.toLowerCase())
        )
        : [];

    const addTest = (test) => {
        if (!selectedTests.find(t => t.name === test.name)) {
            setSelectedTests([...selectedTests, { ...test }]);
        }
        setTestSearch('');
    };

    const removeTest = (name) => {
        setSelectedTests(selectedTests.filter(t => t.name !== name));
    };

    const totalAmount = selectedTests.reduce((sum, t) => sum + (t.price || 0), 0);

    const handleSubmit = async () => {
        if (!selectedPatient && !searchPatient) {
            alert('Please select or enter a patient.');
            return;
        }
        if (selectedTests.length === 0) {
            alert('Please add at least one test.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/laboratory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: selectedPatient?.id || null,
                    patientName: selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : searchPatient,
                    patientUhId: selectedPatient?.patientCode || null,
                    tests: selectedTests,
                    referringDoctor,
                    collectionTime
                })
            });

            if (res.ok) {
                router.push('/laboratory');
            } else {
                const err = await res.json();
                alert('Error: ' + (err.error || 'Failed to create request'));
            }
        } catch (err) {
            alert('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/laboratory" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title" style={{ marginBottom: '4px' }}>New Lab Request</h1>
                        <p className="page-header__subtitle">Create a pathology or radiology diagnostic request for a patient.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={() => router.push('/laboratory')}>
                        Cancel
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={loading}>
                        <Save size={15} strokeWidth={1.5} />
                        {loading ? 'Submitting...' : 'Submit Request & Bill'}
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px', paddingBottom: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Patient & Referral */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(236,72,153,0.1)', color: '#EC4899', padding: '6px', borderRadius: '8px' }}>
                                <Search size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Patient & Referral Details</h3>
                        </div>

                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                                    Patient <span style={{ color: 'red' }}>*</span>
                                </label>
                                {selectedPatient ? (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{selectedPatient.firstName} {selectedPatient.lastName}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>UHID: {selectedPatient.patientCode}</div>
                                        </div>
                                        <button onClick={() => setSelectedPatient(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={16} /></button>
                                    </div>
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Search by UHID or Name..."
                                            value={searchPatient}
                                            onChange={e => setSearchPatient(e.target.value)}
                                            style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }}
                                        />
                                        {filteredPatients.length > 0 && (
                                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '8px', marginTop: '4px', zIndex: 10, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                                                {filteredPatients.map(p => (
                                                    <div key={p.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', fontSize: '14px' }}
                                                        onClick={() => { setSelectedPatient(p); setSearchPatient(''); }}
                                                        onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                                                        onMouseOut={e => e.currentTarget.style.background = '#fff'}
                                                    >
                                                        <div style={{ fontWeight: 600 }}>{p.firstName} {p.lastName}</div>
                                                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{p.patientCode}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Referring Doctor</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            placeholder="Search by name..."
                                            value={referringDoctor || doctorSearch}
                                            onChange={e => { setDoctorSearch(e.target.value); setReferringDoctor(''); }}
                                            style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }}
                                        />
                                        {filteredDoctors.length > 0 && !referringDoctor && (
                                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '8px', marginTop: '4px', zIndex: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: '180px', overflowY: 'auto' }}>
                                                {filteredDoctors.map(s => (
                                                    <div
                                                        key={s.id}
                                                        onClick={() => { setReferringDoctor(s.name); setDoctorSearch(''); }}
                                                        style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', fontSize: '14px' }}
                                                        onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                                                        onMouseOut={e => e.currentTarget.style.background = '#fff'}
                                                    >
                                                        <div style={{ fontWeight: 500 }}>{s.name}</div>
                                                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>{s.role.replace('_', ' ')}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Sample Collection Time</label>
                                    <input
                                        type="datetime-local"
                                        value={collectionTime}
                                        onChange={e => setCollectionTime(e.target.value)}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', color: 'var(--color-text-primary)' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Test Selection */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(56,189,248,0.1)', color: '#0EA5E9', padding: '6px', borderRadius: '8px' }}>
                                <FlaskConical size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Select Investigations</h3>
                        </div>

                        <div style={{ position: 'relative', marginBottom: '20px' }}>
                            <input
                                type="text"
                                placeholder="Type test name (e.g. CBC, Lipid Profile, X-Ray)..."
                                value={testSearch}
                                onChange={e => setTestSearch(e.target.value)}
                                style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }}
                            />
                            {filteredCatalog.length > 0 && (
                                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '8px', marginTop: '4px', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.12)', maxHeight: '240px', overflowY: 'auto' }}>
                                    {filteredCatalog.map(t => (
                                        <div
                                            key={t.name}
                                            onClick={() => addTest(t)}
                                            style={{ padding: '11px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                            onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                                            onMouseOut={e => e.currentTarget.style.background = '#fff'}
                                        >
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: 500 }}>{t.name}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{t.category}</div>
                                            </div>
                                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#16A34A' }}>₹{t.price}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedTests.length === 0 ? (
                            <div style={{ border: '1px dashed var(--color-border-light)', borderRadius: '8px', padding: '32px', textAlign: 'center', color: '#94A3B8' }}>
                                <FlaskConical size={28} strokeWidth={1} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                                <p style={{ fontSize: '14px', margin: 0 }}>Search and add tests to build the request panel.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {selectedTests.map(t => (
                                    <div key={t.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#FAFCFF' }}>
                                        <div>
                                            <div style={{ fontWeight: 500, fontSize: '14px' }}>{t.name}</div>
                                            <span className="badge badge-navy" style={{ fontSize: '11px', padding: '2px 6px', marginTop: '4px' }}>{t.category}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontWeight: 600, color: '#16A34A' }}>₹{t.price}</span>
                                            <button onClick={() => removeTest(t.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px' }}>
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Cart Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ padding: '24px', background: '#FAFCFF', border: '1px solid #E2E8F0', position: 'sticky', top: '80px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '16px' }}>Cart Summary</h3>

                        {selectedTests.length === 0 ? (
                            <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '13px', borderBottom: '1px solid var(--color-border-light)', marginBottom: '16px' }}>
                                No tests added yet
                            </div>
                        ) : (
                            <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {selectedTests.map(t => (
                                    <div key={t.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                        <span style={{ color: 'var(--color-text-secondary)', maxWidth: '70%' }}>{t.name}</span>
                                        <span style={{ fontWeight: 600 }}>₹{t.price}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>Total Payable</span>
                            <span style={{ fontSize: '18px', fontWeight: 700, color: '#16A34A' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Confirm & Submit'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
