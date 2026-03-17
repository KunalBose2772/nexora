'use client';
import { Save, ArrowLeft, User, Phone, MapPin, ShieldPlus, CheckCircle2, Camera, RefreshCw, HeartPulse, UserCheck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPatientPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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

    const [photo, setPhoto] = useState(null);
    const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const startWebcam = async () => {
        setIsWebcamOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing webcam:", err);
            alert("Could not access webcam. Please check permissions.");
            setIsWebcamOpen(false);
        }
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setPhoto(dataUrl);
            stopWebcam();
        }
    };

    const stopWebcam = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsWebcamOpen(false);
    }, []);

    const handleSave = async () => {
        setError('');
        setSuccess('');

        if (!formData.firstName || !formData.lastName || !formData.dob || !formData.gender || !formData.phone) {
            setError('Essential demographics are missing. Please complete all fields marked with *');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);
        try {
            const combinedAddress = [formData.address, formData.city, formData.state, formData.zip, formData.country].filter(Boolean).join(', ');

            const res = await fetch('/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    address: combinedAddress,
                    photo: photo
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'The system was unable to commit the patient record to the EMR.');
            } else {
                setSuccess(`Clinical ID ${data.patient.patientCode} generated! Redirecting to appointment scheduling...`);
                setTimeout(() => {
                    router.push(`/appointments/new?patientId=${data.patient.id}`);
                }, 1800);
            }
        } catch (err) {
            setError('Network latency or server-side interruption detected. Please retry.');
        } finally {
            setLoading(false);
        }
    };

    const tempUhid = useMemo(() => `NXR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`, []);

    return (
        <div className="fade-in pb-20">
            <style jsx>{`
                .form-card {
                    background: #fff;
                    border: 1px solid var(--color-border-light);
                    border-radius: 24px;
                    padding: 32px;
                    transition: all 0.3s ease;
                }
                .form-card:hover {
                    border-color: var(--color-border);
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.04);
                }
                .label-premium {
                    display: block;
                    font-size: 12px;
                    font-weight: 700;
                    color: #64748B;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 8px;
                }
                .input-premium {
                    width: 100%;
                    padding: 12px 16px;
                    background: #F8FAFC;
                    border: 1px solid #E2E8F0;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--color-navy);
                    outline: none;
                    transition: all 0.2s;
                }
                .input-premium:focus {
                    background: #fff;
                    border-color: var(--color-cyan);
                    box-shadow: 0 0 0 4px rgba(0,194,255,0.08);
                }
                .section-header-premium {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 28px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #F1F5F9;
                }
            `}</style>

            <div className="dashboard-header-row mb-10">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link href="/patients" className="btn btn-secondary" style={{ width: '44px', height: '44px', padding: 0, borderRadius: '12px', background: '#fff' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="responsive-h1" style={{ margin: 0 }}>Clinical Registration</h1>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0', fontWeight: 500 }}>Create a new master patient record and digital health identity.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons" style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff', height: '44px', padding: '0 24px' }} onClick={() => router.push('/patients')}>
                        Discard
                    </button>
                    <button className="btn btn-primary btn-sm" style={{ background: 'var(--color-navy)', height: '44px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleSave} disabled={loading}>
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Commit Record
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
                    {/* Demographics */}
                    <div className="form-card">
                        <div className="section-header-premium">
                            <div style={{ width: '40px', height: '40px', background: 'rgba(0,194,255,0.1)', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                                <User size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>Core Demographics</h3>
                                <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0, fontWeight: 500 }}>Verified identity and biometric mapping</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                            <div>
                                <label className="label-premium">First Name <span style={{ color: '#EF4444' }}>*</span></label>
                                <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Legal first name" className="input-premium" />
                            </div>
                            <div>
                                <label className="label-premium">Last Name <span style={{ color: '#EF4444' }}>*</span></label>
                                <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Legal surname" className="input-premium" />
                            </div>
                            <div>
                                <label className="label-premium">Date of Birth <span style={{ color: '#EF4444' }}>*</span></label>
                                <input name="dob" type="date" value={formData.dob} onChange={handleChange} className="input-premium" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label className="label-premium">Gender <span style={{ color: '#EF4444' }}>*</span></label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="input-premium" style={{ appearance: 'none' }}>
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label-premium">Blood Group</label>
                                    <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="input-premium" style={{ appearance: 'none' }}>
                                        <option value="">N/A</option>
                                        {['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact details */}
                    <div className="form-card">
                        <div className="section-header-premium">
                            <div style={{ width: '40px', height: '40px', background: 'rgba(236,72,153,0.1)', color: '#EC4899', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                                <Phone size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>Communication & Residence</h3>
                                <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0, fontWeight: 500 }}>Primary contact nodes and emergency routing</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
                            <div>
                                <label className="label-premium">Mobile Number <span style={{ color: '#EF4444' }}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', fontWeight: 700, color: '#94A3B8' }}>+91</span>
                                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="98765 43210" className="input-premium" style={{ paddingLeft: '50px' }} />
                                </div>
                            </div>
                            <div>
                                <label className="label-premium">Email Address</label>
                                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="patient@cloud.com" className="input-premium" />
                            </div>
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label className="label-premium">Permanent Address</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Street, Apartment, Locality..." className="input-premium" style={{ height: '80px', resize: 'none' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            <input name="city" value={formData.city} onChange={handleChange} placeholder="City/Town" className="input-premium" />
                            <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="input-premium" />
                            <input name="zip" value={formData.zip} onChange={handleChange} placeholder="Zip Code" className="input-premium" />
                        </div>
                    </div>

                    {/* Insurance */}
                    <div className="form-card">
                        <div className="section-header-premium">
                            <div style={{ width: '40px', height: '40px', background: 'rgba(16,185,129,0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                                <ShieldCheck size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>Financial Clearance</h3>
                                <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0, fontWeight: 500 }}>Corporate tie-ups and insurance policy mapping</p>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label className="label-premium">TPA / Insurance Provider</label>
                                <select name="insuranceProvider" value={formData.insuranceProvider} onChange={handleChange} className="input-premium" style={{ appearance: 'none' }}>
                                    <option value="">Self Pay (General)</option>
                                    {['Star Health', 'HDFC Ergo', 'Niva Bupa', 'TATA AIG'].map(i => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label-premium">Policy / Member ID</label>
                                <input name="insuranceId" value={formData.insuranceId} onChange={handleChange} placeholder="Enter policy number" className="input-premium" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Analytics Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div className="form-card" style={{ padding: '24px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
                            <Camera size={18} color="var(--color-navy)" /> 
                            <span style={{ fontWeight: 800, color: 'var(--color-navy)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Biometric Sync</span>
                        </div>

                        <div style={{ width: '100%', aspectRatio: '1', background: '#F8FAFC', borderRadius: '20px', border: '2px dashed #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                            {photo ? (
                                <img src={photo} alt="Patient" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : isWebcamOpen ? (
                                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ color: '#94A3B8', textAlign: 'center', padding: '20px' }}>
                                    <User size={48} style={{ marginBottom: '16px', opacity: 0.1, margin: '0 auto' }} />
                                    <div style={{ fontSize: '12px', fontWeight: 600 }}>Visual confirmation pending</div>
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {!isWebcamOpen ? (
                                <button type="button" onClick={startWebcam} className="btn btn-secondary btn-sm" style={{ width: '100%', height: '40px', background: '#fff' }}>
                                    <Camera size={14} style={{ marginRight: '8px' }} /> {photo ? 'Update Photo' : 'Activate Camera'}
                                </button>
                            ) : (
                                <button type="button" onClick={capturePhoto} className="btn btn-primary btn-sm" style={{ width: '100%', height: '40px' }}>
                                    Capture Frame
                                </button>
                            )}
                            {isWebcamOpen && (
                                <button type="button" onClick={stopWebcam} className="btn btn-secondary btn-sm" style={{ width: '100%', height: '40px', background: '#fff' }}>
                                    Cancel
                                </button>
                            )}
                        </div>
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>

                    <div className="form-card" style={{ padding: '24px', background: 'var(--color-navy)', color: '#fff', border: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <RefreshCw size={16} />
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Registry Preview</span>
                        </div>
                        <div style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '1px', fontFamily: 'monospace', color: 'var(--color-cyan)' }}>
                            {tempUhid}
                        </div>
                        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                <span style={{ opacity: 0.6 }}>Record Status</span>
                                <span style={{ fontWeight: 700, color: '#10B981' }}>Staged</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                <span style={{ opacity: 0.6 }}>Encryption</span>
                                <span style={{ fontWeight: 700 }}>AES-256</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

