'use client';
import { useState, useEffect } from 'react';
import { Save, ArrowLeft, FlaskConical, Search, Plus, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Skeleton from '@/components/common/Skeleton';

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
    const [submitting, setSubmitting] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

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
            } finally {
                setDataLoading(false);
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

        setSubmitting(true);
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
            setSubmitting(false);
        }
    };

    return (
        <div className="fade-in space-y-6">
            <div className="page-header">
                <div className="flex items-center gap-4">
                    <Link href="/laboratory" className="btn btn-secondary p-2 rounded-full w-10 h-10 flex items-center justify-center">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title">Initialize Diagnostic Order</h1>
                        <p className="page-header__subtitle">Register a new pathology or radiology investigation request</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary px-6" onClick={() => router.push('/laboratory')}>
                        Back to Portal
                    </button>
                    <button className="btn btn-primary px-8" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? 'Registering...' : 'Complete & Generate Bill'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-6">
                    {/* Patient Context */}
                    <div className="card p-6 border-l-4 border-l-cyan-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                                <Search size={20} />
                            </div>
                            <div>
                                <h3 className="text-navy-900 font-bold">Patient Identification</h3>
                                <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">Mandatory Context</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <label className="form-label text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Search Master Patient Registry</label>
                                {dataLoading ? (
                                    <div className="space-y-4">
                                        <Skeleton width="100%" height="56px" borderRadius="12px" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Skeleton width="100%" height="48px" borderRadius="12px" />
                                            <Skeleton width="100%" height="48px" borderRadius="12px" />
                                        </div>
                                    </div>
                                ) : selectedPatient ? (
                                    <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-black">
                                                {selectedPatient.firstName[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-navy-900">{selectedPatient.firstName} {selectedPatient.lastName}</div>
                                                <div className="text-xs text-slate-500 font-mono">UID: {selectedPatient.patientCode}</div>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedPatient(null)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors">
                                            <X size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                placeholder="Enter UHID, Name or Contact Number..."
                                                value={searchPatient}
                                                onChange={e => setSearchPatient(e.target.value)}
                                                className="form-input pl-12 h-14 text-sm font-semibold border-slate-200 focus:border-cyan-500 rounded-xl transition-all"
                                            />
                                        </div>
                                        {filteredPatients.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 bg-white border border-slate-100 rounded-xl shadow-2xl mt-2 z-50 overflow-hidden">
                                                {filteredPatients.map(p => (
                                                    <div key={p.id} className="p-4 hover:bg-cyan-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                                                        onClick={() => { setSelectedPatient(p); setSearchPatient(''); }}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <div className="font-bold text-navy-900 text-sm">{p.firstName} {p.lastName}</div>
                                                                <div className="text-[10px] text-slate-400 font-mono">UHID: {p.patientCode}</div>
                                                            </div>
                                                            <div className="text-[10px] px-2 py-1 bg-slate-100 rounded text-slate-500 font-bold uppercase">Select</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {!dataLoading && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="form-label text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Ordering Clinician</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Assign referring doctor..."
                                                value={referringDoctor || doctorSearch}
                                                onChange={e => { setDoctorSearch(e.target.value); setReferringDoctor(''); }}
                                                className="form-input h-12 text-sm font-semibold border-slate-200 focus:border-cyan-500 rounded-xl"
                                            />
                                            {filteredDoctors.length > 0 && !referringDoctor && (
                                                <div className="absolute top-full left-0 right-0 bg-white border border-slate-100 rounded-xl shadow-2xl mt-2 z-50 overflow-hidden max-h-48 overflow-y-auto">
                                                    {filteredDoctors.map(s => (
                                                        <div
                                                            key={s.id}
                                                            onClick={() => { setReferringDoctor(s.name); setDoctorSearch(''); }}
                                                            className="p-3 hover:bg-cyan-50 cursor-pointer border-b border-slate-50 transition-colors"
                                                        >
                                                            <div className="font-bold text-navy-800 text-xs">Dr. {s.name}</div>
                                                            <div className="text-[9px] text-slate-400 uppercase font-black">{s.role.split('_').join(' ')}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="form-label text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Preferred Collection Slot</label>
                                        <input
                                            type="datetime-local"
                                            value={collectionTime}
                                            onChange={e => setCollectionTime(e.target.value)}
                                            className="form-input h-12 text-sm font-semibold border-slate-200 focus:border-cyan-500 rounded-xl"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Investigation Selection */}
                    <div className="card p-6 border-l-4 border-l-cyan-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                                <FlaskConical size={20} />
                            </div>
                            <div>
                                <h3 className="text-navy-900 font-bold">Investigation Catalog</h3>
                                <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">Select Tests</p>
                            </div>
                        </div>

                        <div className="relative mb-6">
                            <input
                                type="text"
                                placeholder="Search by test name or laboratory category..."
                                value={testSearch}
                                onChange={e => setTestSearch(e.target.value)}
                                className="form-input pl-4 h-14 text-sm font-semibold border-slate-200 focus:border-cyan-500 rounded-xl shadow-sm"
                            />
                            {filteredCatalog.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-slate-100 rounded-xl shadow-2xl mt-2 z-50 overflow-hidden max-h-64 overflow-y-auto">
                                    {filteredCatalog.map(t => (
                                        <div
                                            key={t.name}
                                            onClick={() => addTest(t)}
                                            className="p-4 hover:bg-cyan-50 cursor-pointer border-b border-slate-50 flex justify-between items-center transition-colors"
                                        >
                                            <div>
                                                <div className="text-sm font-bold text-navy-900">{t.name}</div>
                                                <div className="text-[10px] text-cyan-600 font-black uppercase tracking-tight">{t.category}</div>
                                            </div>
                                            <div className="text-sm font-black text-emerald-600">₹{t.price}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedTests.length === 0 ? (
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                                <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                                    <Plus size={32} />
                                </div>
                                <h4 className="text-slate-400 font-black uppercase tracking-widest text-xs mb-1">Investigation Panel Empty</h4>
                                <p className="text-slate-400 text-[11px] font-medium">Use the catalog search above to add diagnostic tests</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {selectedTests.map(t => (
                                    <div key={t.name} className="flex justify-between items-center p-4 bg-white border border-slate-100 hover:border-cyan-200 rounded-xl shadow-sm transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-10 rounded-full bg-cyan-100 group-hover:bg-cyan-500 transition-colors" />
                                            <div>
                                                <div className="font-bold text-navy-900 text-sm">{t.name}</div>
                                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-tight">{t.category}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-sm font-black text-emerald-600">₹{t.price}</div>
                                            <button onClick={() => removeTest(t.name)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="card shadow-2xl border-none overflow-hidden sticky top-6">
                        <div className="bg-navy-900 p-6 text-white">
                            <h3 className="text-lg font-black tracking-tight mb-1">Billing Summary</h3>
                            <p className="text-navy-300 text-[10px] font-bold uppercase tracking-[0.2em]">Live Order Valuation</p>
                        </div>
                        <div className="p-6 space-y-6">
                            {selectedTests.length === 0 ? (
                                <div className="py-10 text-center">
                                    <p className="text-slate-400 text-xs font-bold italic tracking-tight">Add tests to generate quote</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedTests.map(t => (
                                        <div key={t.name} className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500 font-bold truncate pr-4">{t.name}</span>
                                            <span className="text-navy-900 font-black">₹{t.price}</span>
                                        </div>
                                    ))}
                                    <div className="h-px bg-slate-100 my-4" />
                                    <div className="flex justify-between items-center pt-2">
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Net Payable</div>
                                            <div className="text-2xl font-black text-navy-900 tracking-tighter">₹{totalAmount.toLocaleString()}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500">GST Incl.</div>
                                            <div className="text-xs font-bold text-slate-400">v1.2 Standard</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3 pt-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || selectedTests.length === 0}
                                    className="btn btn-primary w-full h-14 text-sm font-black uppercase tracking-widest shadow-xl shadow-cyan-900/20 disabled:opacity-50"
                                >
                                    {submitting ? 'Processing Transaction...' : 'Complete Order'}
                                </button>
                                <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest px-4">
                                    By clicking complete, you verify that samples will be collected as per protocol.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
