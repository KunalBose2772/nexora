'use client';
import { Save, ArrowLeft, User, Phone, MapPin, ShieldPlus, CheckCircle2, Camera, RefreshCw, HeartPulse, UserCheck, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditPatientPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        bloodGroup: '',
        maritalStatus: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: 'India',
        emergencyName: '',
        emergencyRelation: '',
        emergencyPhone: '',
        insuranceProvider: '',
        insuranceId: ''
    });

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await fetch(`/api/patients/${id}`);
                const data = await res.json();
                if (res.ok) {
                    const p = data.patient;
                    // Split address if it contains commas
                    const addrParts = (p.address || '').split(', ');
                    setFormData({
                        firstName: p.firstName || '',
                        lastName: p.lastName || '',
                        dob: p.dob || '',
                        gender: p.gender || '',
                        bloodGroup: p.bloodGroup || '',
                        maritalStatus: p.maritalStatus || '',
                        phone: p.phone || '',
                        email: p.email || '',
                        address: addrParts[0] || '',
                        city: addrParts[1] || '',
                        state: addrParts[2] || '',
                        zip: addrParts[3] || '',
                        country: addrParts[4] || 'India',
                        emergencyName: p.emergencyName || '',
                        emergencyRelation: p.emergencyRelation || '',
                        emergencyPhone: p.emergencyPhone || '',
                        insuranceProvider: p.insuranceProvider || '',
                        insuranceId: p.insuranceId || ''
                    });
                } else {
                    setError('Failed to load patient data.');
                }
            } catch (err) {
                setError('Network error. Failed to load patient.');
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setError('');
        setSuccess('');

        if (!formData.firstName || !formData.lastName || !formData.dob || !formData.gender || !formData.phone) {
            setError('Essential demographics are missing. Please complete all fields marked with *');
            return;
        }

        setSaving(true);
        try {
            const combinedAddress = [formData.address, formData.city, formData.state, formData.zip, formData.country].filter(Boolean).join(', ');

            const res = await fetch(`/api/patients/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    address: combinedAddress
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'The system was unable to update the patient record.');
            } else {
                setSuccess(`Patient record updated successfully!`);
                setTimeout(() => {
                    router.push(`/patients/${data.patient.patientCode}`);
                }, 1500);
            }
        } catch (err) {
            setError('Network latency or server-side interruption detected. Please retry.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '20px' }}>
                <Loader2 size={48} className="animate-spin text-slate-300" />
                <p style={{ color: '#94A3B8', fontWeight: 600 }}>Securing Clinical Data Context...</p>
            </div>
        );
    }

    return (
        <div className="fade-in pb-20">
            <style jsx>{`
                .form-card {
                    background: #fff;
                    border: 1px solid #F1F5F9;
                    border-radius: 24px;
                    padding: 32px;
                    transition: all 0.2s ease;
                }
                .shadow-premium {
                    box-shadow: 0 10px 25px -5px rgba(10, 46, 77, 0.05), 0 8px 10px -6px rgba(10, 46, 77, 0.05);
                }
                .label-premium {
                    display: block;
                    font-size: 11px;
                    font-weight: 600;
                    color: #94A3B8;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 10px;
                }
                .input-premium {
                    width: 100%;
                    padding: 14px 18px;
                    background: #F8FAFC;
                    border: 1.5px solid #E2E8F0;
                    border-radius: 14px;
                    font-size: 14px;
                    font-weight: 500;
                    color: var(--color-navy);
                    outline: none;
                    transition: all 0.2s;
                    box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.02);
                }
                .input-premium:focus {
                    background: #fff;
                    border-color: var(--color-cyan);
                    box-shadow: 0 0 0 4px rgba(0,194,255,0.08), inset 0 2px 4px 0 rgba(0,0,0,0.01);
                }
                .section-header-premium {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 32px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #F1F5F9;
                }
                .profile-avatar-matrix {
                    width: 80px;
                    height: 80px;
                    border-radius: 20px;
                    background: #F1F5F9;
                    border: 2px dashed #CBD5E1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #94A3B8;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .profile-avatar-matrix:hover {
                    border-color: var(--color-cyan);
                    color: var(--color-cyan);
                    background: #fff;
                }
            `}</style>

            <div className="dashboard-header-row mb-10">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link href="/patients" className="btn btn-secondary" style={{ width: '44px', height: '44px', padding: 0, borderRadius: '12px', background: '#fff' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="responsive-h1" style={{ margin: 0 }}>Update Profile</h1>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0', fontWeight: 500 }}>Synchronize demographic changes and insurance mapping for EMR integrity.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons" style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff', height: '44px', padding: '0 24px' }} onClick={() => router.back()}>
                        Discard
                    </button>
                    <button className="btn btn-primary btn-sm" style={{ background: 'var(--color-navy)', height: '44px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Update EMR
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ padding: '16px 20px', background: '#FEF2F2', border: '1px solid #FEE2E2', color: '#B91C1C', borderRadius: '16px', marginBottom: '24px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#FCA5A5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>!</div>
                    {error}
                </div>
            )}

            {success && (
                <div style={{ padding: '16px 20px', background: '#F0FDF4', border: '1px solid #DCFCE7', color: '#15803D', borderRadius: '16px', marginBottom: '24px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle2 size={20} /> {success}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(320px, 1fr)', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div className="form-card shadow-premium">
                        <div className="section-header-premium">
                            <div style={{ width: '48px', height: '48px', background: 'rgba(0,194,255,0.1)', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px' }}>
                                <UserCheck size={24} strokeWidth={2} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)', margin: 0, letterSpacing: '-0.02em' }}>Identity Matrix</h3>
                                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '2px 0 0 0', fontWeight: 500 }}>Legal demographics and biometric verification</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                            <div>
                                <label className="label-premium">First Name <span style={{ color: '#EF4444' }}>*</span></label>
                                <input name="firstName" value={formData.firstName} onChange={handleChange} className="input-premium" />
                            </div>
                            <div>
                                <label className="label-premium">Last Name <span style={{ color: '#EF4444' }}>*</span></label>
                                <input name="lastName" value={formData.lastName} onChange={handleChange} className="input-premium" />
                            </div>
                            <div>
                                <label className="label-premium">Date of Birth <span style={{ color: '#EF4444' }}>*</span></label>
                                <input name="dob" type="date" value={formData.dob} onChange={handleChange} className="input-premium" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label className="label-premium">Gender <span style={{ color: '#EF4444' }}>*</span></label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="input-premium">
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label-premium">Blood Group</label>
                                    <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="input-premium">
                                        <option value="">N/A</option>
                                        {['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-card shadow-premium">
                        <div className="section-header-premium">
                            <div style={{ width: '48px', height: '48px', background: 'rgba(236,72,153,0.1)', color: '#EC4899', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px' }}>
                                <Phone size={24} strokeWidth={2} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)', margin: 0, letterSpacing: '-0.02em' }}>Connectivity Vault</h3>
                                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '2px 0 0 0', fontWeight: 500 }}>Active contact nodes and residential metadata</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
                            <div>
                                <label className="label-premium">Mobile Number <span style={{ color: '#EF4444' }}>*</span></label>
                                <input name="phone" value={formData.phone} onChange={handleChange} className="input-premium" />
                            </div>
                            <div>
                                <label className="label-premium">Email Address</label>
                                <input name="email" type="email" value={formData.email} onChange={handleChange} className="input-premium" />
                            </div>
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label className="label-premium">Permanent Address</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} className="input-premium" style={{ height: '80px', resize: 'none' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="input-premium" />
                            <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="input-premium" />
                            <input name="zip" value={formData.zip} onChange={handleChange} placeholder="Zip" className="input-premium" />
                        </div>
                    </div>

                    <div className="form-card shadow-premium">
                        <div className="section-header-premium">
                            <div style={{ width: '48px', height: '48px', background: 'rgba(16,185,129,0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px' }}>
                                <ShieldCheck size={24} strokeWidth={2} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)', margin: 0, letterSpacing: '-0.02em' }}>Financial Safeguards</h3>
                                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '2px 0 0 0', fontWeight: 500 }}>Insurance policy mapping and corporate coverage</p>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label className="label-premium">TPA / Insurance Provider</label>
                                <select name="insuranceProvider" value={formData.insuranceProvider} onChange={handleChange} className="input-premium">
                                    <option value="">Self Pay (General)</option>
                                    {['Star Health', 'HDFC Ergo', 'Niva Bupa', 'TATA AIG'].map(i => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label-premium">Policy / Member ID</label>
                                <input name="insuranceId" value={formData.insuranceId} onChange={handleChange} className="input-premium" />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div className="form-card shadow-premium" style={{ background: 'var(--color-navy)', color: '#fff', border: 'none' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <HeartPulse size={18} color="var(--color-cyan)" />
                            <span style={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Clinical Analytics</span>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 500, opacity: 0.9, lineHeight: 1.6 }}>
                            Maintaining demographic integrity is the foundation of patient safety. Every change here scales across the entire Unified Health Interface.
                        </div>
                        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '8px' }}>
                                <span style={{ opacity: 0.6 }}>Registry Update</span>
                                <span style={{ fontWeight: 700 }}>{new Date().toLocaleDateString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                                <span style={{ opacity: 0.6 }}>Encryption Mode</span>
                                <span style={{ fontWeight: 700, color: '#10B981' }}>Secure 256-bit</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
