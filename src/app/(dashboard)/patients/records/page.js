'use client';
import { Upload, ArrowLeft, Search, Database, CheckCircle, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PatientRecordsPage() {
    const router = useRouter();
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState('');

    const [formData, setFormData] = useState({
        categoryTag: '',
        title: '',
        date: ''
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const pid = urlParams.get('patientId');
        if (pid) setSelectedPatientId(pid);

        const fetchPatients = async () => {
            try {
                const res = await fetch('/api/patients');
                if (res.ok) {
                    const data = await res.json();
                    setPatients(data.patients || []);
                }
            } catch (err) {
                console.error("Failed to fetch patients", err);
            }
        };
        fetchPatients();
    }, []);

    const handlePatientSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        setErrorMsg('');
        setSuccessMsg('');
        if (!selectedPatientId || !formData.categoryTag || !formData.title || !selectedFile) {
            setErrorMsg('Please select a patient, fill in metadata, and attach a file.');
            return;
        }

        setLoading(true);
        try {
            const submitData = new FormData();
            submitData.append('patientId', selectedPatientId);
            submitData.append('categoryTag', formData.categoryTag);
            submitData.append('title', formData.title);
            submitData.append('date', formData.date);
            submitData.append('file', selectedFile);

            const res = await fetch('/api/patients/records', {
                method: 'POST',
                body: submitData
            });

            if (res.ok) {
                const data = await res.json();
                setSelectedFile(null);
                setSuccessMsg('Record saved successfully!');
                setTimeout(() => {
                    const selectedPatient = patients.find(p => p.id === selectedPatientId);
                    router.push(`/patients/${selectedPatient ? selectedPatient.patientCode : selectedPatientId}`);
                }, 1500);
            } else {
                const errorData = await res.json();
                setErrorMsg(errorData.error || 'Failed to save record.');
            }
        } catch (err) {
            setErrorMsg('An unexpected error occurred while saving.');
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(p =>
        p.firstName.toLowerCase().includes(search.toLowerCase()) ||
        p.lastName.toLowerCase().includes(search.toLowerCase()) ||
        p.patientCode.toLowerCase().includes(search.toLowerCase()) ||
        (p.phone && p.phone.includes(search))
    );

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/patients" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Upload Medical Record</h1>
                        <p className="page-header__subtitle">Attach external lab reports, scans, or discharge summaries to a patient EMR.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <Link href="/patients" className="btn btn-secondary btn-sm" style={{ background: '#fff', textDecoration: 'none' }}>
                        Cancel Upload
                    </Link>
                    <button onClick={handleSubmit} disabled={loading} className="btn btn-primary btn-sm">
                        {loading ? 'Processing...' : <><Upload size={15} strokeWidth={1.5} /> Save to EMR</>}
                    </button>
                </div>
            </div>

            {errorMsg && (
                <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(239,68,68,0.1)', color: '#DC2626', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {errorMsg}
                </div>
            )}

            {successMsg && (
                <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(34,197,94,0.1)', color: '#16A34A', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle size={20} />
                    <span style={{ fontWeight: 500 }}>{successMsg} Redirecting to profile...</span>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '24px', paddingBottom: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '16px' }}>1. Select Patient Account <span style={{ color: 'red' }}>*</span></h3>
                        <div style={{ position: 'relative', marginBottom: '12px' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                            <input type="text" value={search} onChange={handlePatientSearch} placeholder="Search by UHID, Mobile, or Name..." style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                        </div>

                        <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--color-border-light)', borderRadius: '8px' }}>
                            {filteredPatients.length > 0 ? filteredPatients.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => setSelectedPatientId(p.id)}
                                    style={{ padding: '12px', borderBottom: '1px solid var(--color-border-light)', cursor: 'pointer', background: selectedPatientId === p.id ? 'rgba(0,194,255,0.05)' : '#fff', display: 'flex', flexDirection: 'column' }}
                                >
                                    <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-navy)' }}>{p.firstName} {p.lastName}</span>
                                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{p.patientCode} • {p.phone || 'No Phone'}</span>
                                </div>
                            )) : (
                                <div style={{ padding: '12px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                                    No patients found
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '16px' }}>2. Record Metadata</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Category Tag <span style={{ color: 'red' }}>*</span></label>
                                <select name="categoryTag" value={formData.categoryTag} onChange={handleFormChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                    <option value="">Select Type...</option>
                                    <option value="Pathology Results">Pathology Results</option>
                                    <option value="Radiology/Imaging">Radiology/Imaging</option>
                                    <option value="External Prescription">External Prescription</option>
                                    <option value="Discharge Summary">Discharge Summary</option>
                                    <option value="Consent Form">Consent Form</option>
                                    <option value="Other">Other Category</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Document Title <span style={{ color: 'red' }}>*</span></label>
                                <input type="text" name="title" value={formData.title} onChange={handleFormChange} placeholder="e.g. Pre-Op Blood Work 2023" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Date of Creation</label>
                                <input type="date" name="date" value={formData.date} onChange={handleFormChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', color: 'var(--color-text-primary)' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '16px' }}>3. Secure File Upload <span style={{ color: 'red' }}>*</span></h3>

                        <label style={{ flex: 1, border: `2px dashed ${selectedFile ? 'var(--color-cyan)' : 'var(--color-border-light)'}`, borderRadius: '12px', background: selectedFile ? 'rgba(0,194,255,0.03)' : '#FAFCFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                            <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                            <div style={{ width: '64px', height: '64px', background: 'rgba(0,194,255,0.1)', color: 'var(--color-cyan)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                                {selectedFile ? <FileText size={32} /> : <Database size={32} />}
                            </div>

                            {selectedFile ? (
                                <>
                                    <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '8px', margin: 0 }}>File Selected: {selectedFile.name}</h4>
                                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>Proceed to Save to EMR</p>
                                    <button onClick={(e) => { e.preventDefault(); document.querySelector('input[type="file"]').click(); }} className="btn btn-secondary" style={{ marginTop: '24px', background: 'var(--color-cyan)', color: 'white', border: 'none' }}>Change File</button>
                                </>
                            ) : (
                                <>
                                    <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '8px', margin: 0 }}>Click to select or drag files here</h4>
                                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>Supported formats: PDF, JPG, PNG, DICOM (Max. 15MB)</p>
                                    <button onClick={(e) => { e.preventDefault(); document.querySelector('input[type="file"]').click(); }} className="btn btn-secondary" style={{ marginTop: '24px' }}>Browse Files</button>
                                </>
                            )}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
