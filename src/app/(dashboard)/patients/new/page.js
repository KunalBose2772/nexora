'use client';
import { Save, ArrowLeft, User, Phone, MapPin, ShieldPlus, CheckCircle2, Camera, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPatientPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [photo, setPhoto] = useState(null);
    const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const startWebcam = async () => {
        setIsWebcamOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing webcam:", err);
            alert("Could not access webcam. Please check permissions.");
        }
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setPhoto(dataUrl);
            stopWebcam();
        }
    };

    const stopWebcam = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsWebcamOpen(false);
    };

    const handleSave = async () => {
        setError('');
        setSuccess('');

        if (!formData.firstName || !formData.lastName || !formData.dob || !formData.gender || !formData.phone) {
            setError('Please fill in all required fields (marked with *).');
            return;
        }

        setLoading(true);
        try {
            const combinedAddress = [formData.address, formData.city, formData.state, formData.zip, formData.country].filter(Boolean).join(', ');

            const res = await fetch('/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    dob: formData.dob,
                    gender: formData.gender,
                    bloodGroup: formData.bloodGroup,
                    phone: formData.phone,
                    email: formData.email,
                    address: combinedAddress
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to save patient record.');
            } else {
                setSuccess(`Patient ${data.patient.firstName} ${data.patient.lastName} saved successfully. Redirecting to book appointment...`);
                setTimeout(() => {
                    router.push(`/appointments/new?patientId=${data.patient.id}`);
                }, 1500);
            }
        } catch (err) {
            setError('Network error. Failed to save patient record.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/patients" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Register New Patient</h1>
                        <p className="page-header__subtitle">Enter comprehensive patient demographic and medical history details.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={() => router.push('/patients')}>
                        Back
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ padding: '12px 16px', background: '#FEE2E2', color: '#B91C1C', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: 500 }}>
                    {error}
                </div>
            )}

            {success && (
                <div style={{ padding: '12px 16px', background: '#DCFCE7', color: '#15803D', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} /> {success}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 1fr)', gap: '24px', paddingBottom: '40px' }}>
                {/* Form Wrapper */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Basic Info */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(0,194,255,0.1)', color: 'var(--color-navy)', padding: '6px', borderRadius: '8px' }}>
                                <User size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Personal Information</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>First Name <span style={{ color: 'red' }}>*</span></label>
                                <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" placeholder="Current" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Last Name <span style={{ color: 'red' }}>*</span></label>
                                <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" placeholder="Patient" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Date of Birth <span style={{ color: 'red' }}>*</span></label>
                                <input name="dob" value={formData.dob} onChange={handleChange} type="date" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', color: 'var(--color-text-primary)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Gender <span style={{ color: 'red' }}>*</span></label>
                                <select name="gender" value={formData.gender} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Blood Group</label>
                                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                    <option value="">Select Group</option>
                                    <option value="A+">A+</option><option value="O+">O+</option><option value="B+">B+</option><option value="AB+">AB+</option>
                                    <option value="A-">A-</option><option value="O-">O-</option><option value="B-">B-</option><option value="AB-">AB-</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Marital Status</label>
                                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                    <option value="">Select Status</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Address */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(236,72,153,0.1)', color: '#EC4899', padding: '6px', borderRadius: '8px' }}>
                                <MapPin size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Contact & Address</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Mobile Number <span style={{ color: 'red' }}>*</span></label>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ padding: '10px', background: '#F8FAFC', border: '1px solid var(--color-border-light)', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>+91</span>
                                        <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="98765 43210" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '0 8px 8px 0', outline: 'none', fontSize: '14px' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Email Address</label>
                                    <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="patient@example.com" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Street Address</label>
                                    <input name="address" value={formData.address} onChange={handleChange} type="text" placeholder="Enter full address..." style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignContent: 'start' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>City</label>
                                    <input name="city" value={formData.city} onChange={handleChange} type="text" placeholder="City" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>State / Province</label>
                                    <input name="state" value={formData.state} onChange={handleChange} type="text" placeholder="State/Region" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Zip / Postal Code</label>
                                    <input name="zip" value={formData.zip} onChange={handleChange} type="text" placeholder="Postal Code" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Country</label>
                                    <select name="country" value={formData.country} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                        <option value="India">India</option>
                                        <option value="United States">United States</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Emergency & Insurance */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(22,163,74,0.1)', color: '#16A34A', padding: '6px', borderRadius: '8px' }}>
                                <ShieldPlus size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Emergency Contact & Insurance</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Emergency Contact Name</label>
                                <input name="emergencyName" value={formData.emergencyName} onChange={handleChange} type="text" placeholder="Relative Name" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Relationship</label>
                                <input name="emergencyRelation" value={formData.emergencyRelation} onChange={handleChange} type="text" placeholder="Spouse, Parent, etc." style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Emergency Phone</label>
                                <input name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} type="tel" placeholder="+91 xxxxx xxxxx" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Insurance Provider</label>
                                <select name="insuranceProvider" value={formData.insuranceProvider} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                    <option value="">None / Self Pay</option>
                                    <option value="Star Health">Star Health</option>
                                    <option value="HDFC Ergo">HDFC Ergo</option>
                                    <option value="LIC Health">LIC Health</option>
                                </select>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Insurance Policy / Group Number</label>
                                <input name="insuranceId" value={formData.insuranceId} onChange={handleChange} type="text" placeholder="Policy ID" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                        <button className="btn btn-secondary" style={{ minWidth: '120px' }} onClick={() => router.push('/patients')}>
                            Cancel
                        </button>
                        <button 
                            className="btn btn-primary" 
                            onClick={handleSave} 
                            disabled={loading}
                            style={{ minWidth: '220px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '15px' }}
                        >
                            {loading ? 'Saving...' : <><Save size={18} /> Register Patient Record</>}
                        </button>
                    </div>
                </div>

                {/* Right Sidebar: Photo Capture & UID */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <Camera size={18} color="var(--color-navy)" /> 
                            <span style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '15px' }}>Patient Photo</span>
                        </div>

                        <div style={{ width: '100%', aspectRatio: '4/3', background: '#F8FAFC', borderRadius: '12px', border: '2px dashed #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                            {photo ? (
                                <img src={photo} alt="Patient" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : isWebcamOpen ? (
                                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ color: '#94A3B8', fontSize: '13px' }}>
                                    <Camera size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                                    <div>No Photo Captured</div>
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {!isWebcamOpen ? (
                                <button type="button" onClick={startWebcam} className="btn btn-secondary btn-sm" style={{ width: '100%', background: '#fff' }}>
                                    <Camera size={14} style={{ marginRight: '6px' }} /> {photo ? 'Retake Photo' : 'Open Webcam'}
                                </button>
                            ) : (
                                <button type="button" onClick={capturePhoto} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                                    Capture Frame
                                </button>
                            )}
                            {isWebcamOpen && (
                                <button type="button" onClick={stopWebcam} className="btn btn-secondary btn-sm" style={{ width: '100%', background: '#fff' }}>
                                    Cancel
                                </button>
                            )}
                        </div>
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>

                    <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '8px' }}><RefreshCw size={16} /></div>
                            <span style={{ fontWeight: 600, fontSize: '14px', color: '#94A3B8' }}>System Generated UID</span>
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '1px', fontFamily: 'monospace' }}>
                            NXR-{new Date().getFullYear()}-{Math.floor(10000 + Math.random() * 90000)}
                        </div>
                        <p style={{ fontSize: '11px', color: '#64748B', marginTop: '12px', lineHeight: '1.4' }}>
                            This Temporary ID will be finalized upon saving the record and mapped to the patient's EMR.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

