'use client';
import { Upload, ArrowLeft, Search, Database, CheckCircle, FileText, Plus, Filter, Trash2, ExternalLink, Loader2, Receipt } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function PatientSpecificRecordsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [patient, setPatient] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    
    // Upload state
    const [showUpload, setShowUpload] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({ categoryTag: '', title: '', date: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/patients/${id}`);
            const data = await res.json();
            if (res.ok) {
                setPatient(data.patient);
                setRecords(data.patient.records || []);
            }
        } catch (err) {
            console.error("Fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!formData.categoryTag || !formData.title || !selectedFile) {
            setMessage({ type: 'error', text: 'All fields are required.' });
            return;
        }

        setUploading(true);
        try {
            const submitData = new FormData();
            submitData.append('patientId', patient.id);
            submitData.append('categoryTag', formData.categoryTag);
            submitData.append('title', formData.title);
            submitData.append('date', formData.date);
            submitData.append('file', selectedFile);

            const res = await fetch('/api/patients/records', {
                method: 'POST',
                body: submitData
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Clinical record archived successfully.' });
                setFormData({ categoryTag: '', title: '', date: '' });
                setSelectedFile(null);
                setShowUpload(false);
                fetchData();
            } else {
                setMessage({ type: 'error', text: 'Vault storage failed.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Connection interrupted.' });
        } finally {
            setUploading(false);
        }
    };

    const filteredRecords = records.filter(r => 
        r.title.toLowerCase().includes(search.toLowerCase()) || 
        r.categoryTag.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <Loader2 size={40} className="animate-spin text-slate-200" />
            </div>
        );
    }

    return (
        <div className="fade-in pb-20">
            <style jsx>{`
                .record-card {
                    background: #fff;
                    border: 1px solid var(--color-border-light);
                    border-radius: 16px;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    transition: all 0.2s;
                }
                .record-card:hover {
                    border-color: var(--color-cyan);
                    box-shadow: 0 8px 20px -10px rgba(0,0,0,0.1);
                }
                .category-badge {
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    padding: 4px 8px;
                    border-radius: 6px;
                    background: #F1F5F9;
                    color: #64748B;
                }
            `}</style>

            <div className="dashboard-header-row mb-10">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button onClick={() => router.back()} className="btn btn-secondary" style={{ width: '44px', height: '44px', padding: 0, borderRadius: '12px', background: '#fff' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="responsive-h1" style={{ margin: 0 }}>Clinical Records Hub</h1>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0', fontWeight: 500 }}>
                            Longitudinal medical archive for <span style={{ color: 'var(--color-navy)', fontWeight: 700 }}>{patient?.firstName} {patient?.lastName}</span> ({patient?.patientCode})
                        </p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button onClick={() => setShowUpload(!showUpload)} className="btn btn-primary" style={{ background: 'var(--color-navy)', height: '44px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> {showUpload ? 'Close Vault' : 'New Archive'}
                    </button>
                </div>
            </div>

            {showUpload && (
                <div className="card mb-10 animate-slide-down" style={{ padding: '32px', border: '2px dashed var(--color-cyan)', background: 'rgba(0,194,255,0.02)' }}>
                    <form onSubmit={handleUpload}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>Category</label>
                                <select value={formData.categoryTag} onChange={e => setFormData({...formData, categoryTag: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                                    <option value="">Select Category</option>
                                    <option value="Pathology">Pathology Results</option>
                                    <option value="Radiology">Radiology/Scans</option>
                                    <option value="Discharge">Discharge Summary</option>
                                    <option value="Prescription">External Scripts</option>
                                    <option value="Consent">Consent Forms</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>Document Title</label>
                                <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Chest X-Ray (AP View)" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>Capture Date</label>
                                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <input type="file" onChange={handleFileChange} id="clinical-file" style={{ display: 'none' }} />
                            <label htmlFor="clinical-file" style={{ flex: 1, padding: '16px', border: '2px dashed #CBD5E1', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', background: '#fff', fontSize: '14px', color: '#64748B', fontWeight: 600 }}>
                                {selectedFile ? <span style={{ color: 'var(--color-navy)' }}>{selectedFile.name}</span> : 'Selected clinical file to archive (PDF/JPG)'}
                            </label>
                            <button type="submit" disabled={uploading} className="btn btn-primary" style={{ height: '56px', padding: '0 40px', background: 'var(--color-navy)' }}>
                                {uploading ? <Loader2 size={20} className="animate-spin" /> : 'Execute Archival'}
                            </button>
                        </div>
                        {message.text && (
                            <div style={{ marginTop: '16px', color: message.type === 'error' ? '#EF4444' : '#10B981', fontSize: '13px', fontWeight: 600 }}>{message.text}</div>
                        )}
                    </form>
                </div>
            )}

            <div className="card shadow-premium" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter records by diagnosis, category or clinical context..." style={{ width: '100%', padding: '12px 16px 12px 48px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', outline: 'none', fontSize: '14px', fontWeight: 600 }} />
                    </div>
                </div>

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredRecords.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <Database size={48} color="#CBD5E1" style={{ margin: '0 auto 16px' }} />
                            <p style={{ color: '#94A3B8', fontWeight: 600 }}>No medical documents found in the clinical vault.</p>
                        </div>
                    ) : (
                        filteredRecords.map(record => (
                            <div key={record.id} className="record-card shadow-sm">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '44px', height: '44px', background: 'rgba(0,194,255,0.1)', color: 'var(--color-navy)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)' }}>{record.title}</h4>
                                            <span className="category-badge">{record.categoryTag}</span>
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px', fontWeight: 500 }}>
                                            Timestamp: {record.date ? record.date : new Date(record.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <a href={record.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ background: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {record.fileUrl?.startsWith('/billing') ? <Receipt size={14} /> : <ExternalLink size={14} />}
                                        {record.fileUrl?.startsWith('/billing') ? 'View Invoice' : 'Full View'}
                                    </a>
                                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff', color: '#EF4444', border: '1px solid #FEE2E2', padding: '0 10px' }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
