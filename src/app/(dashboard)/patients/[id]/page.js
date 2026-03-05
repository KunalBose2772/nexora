'use client';
import { ArrowLeft, User, Phone, MapPin, ShieldPlus, Calendar, Activity, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function PatientProfilePage() {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await fetch(`/api/patients/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setPatient(data.patient);
                } else {
                    setError(data.error || 'Failed to load patient profile.');
                }
            } catch (err) {
                setError('Network error. Failed to load patient profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [id]);

    if (loading) return <div style={{ padding: '24px' }}>Loading profile...</div>;
    if (error) return <div style={{ padding: '24px', color: '#DC2626' }}>{error}</div>;
    if (!patient) return <div style={{ padding: '24px' }}>Patient not found.</div>;

    const getAge = (dob) => {
        if (!dob) return 'N/A';
        const diff = Date.now() - new Date(dob).getTime();
        const MathAge = new Date(diff).getUTCFullYear() - 1970;
        return MathAge > 0 ? MathAge : 0;
    };

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/patients" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                            <h1 className="page-header__title" style={{ margin: 0 }}>
                                {patient.firstName} {patient.lastName}
                            </h1>
                            <span className="badge badge-success">Active</span>
                        </div>
                        <p className="page-header__subtitle" style={{ fontFamily: 'monospace' }}>
                            {patient.patientCode} • Registered: {new Date(patient.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <Link href={`/patients/records?patientId=${patient.id}`} className="btn btn-secondary btn-sm" style={{ background: '#fff', textDecoration: 'none' }}>
                        <FileText size={14} /> Upload Lab Results
                    </Link>
                    <Link href={`/appointments/new?patientId=${patient.id}`} className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <Calendar size={14} /> Schedule Appointment
                    </Link>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '24px', paddingBottom: '40px' }}>
                {/* Left Column - Main Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Demographics Card */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(0,194,255,0.1)', color: 'var(--color-navy)', padding: '6px', borderRadius: '8px' }}>
                                <User size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Demographics</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                            <div>
                                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: 500 }}>Gender</p>
                                <p style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>{patient.gender || 'N/A'}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: 500 }}>Date of Birth</p>
                                <p style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>{patient.dob || 'N/A'} <span style={{ color: 'var(--color-text-muted)' }}>({getAge(patient.dob)} yrs)</span></p>
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: 500 }}>Blood Group</p>
                                <p style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>{patient.bloodGroup || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(236,72,153,0.1)', color: '#EC4899', padding: '6px', borderRadius: '8px' }}>
                                <Phone size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Contact Info</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                            <div>
                                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: 500 }}>Mobile Number</p>
                                <p style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>{patient.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: 500 }}>Email Address</p>
                                <p style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>{patient.email || 'N/A'}</p>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: 500 }}>Home Address</p>
                                <p style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>{patient.address || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Appointments History */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', padding: '6px', borderRadius: '8px' }}>
                                    <Activity size={18} />
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Appointment History</h3>
                            </div>
                        </div>
                        {patient.appointments && patient.appointments.length > 0 ? (
                            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                <tbody>
                                    {patient.appointments.map(apt => (
                                        <tr key={apt.id} onClick={() => window.location.href = `/appointments/${apt.apptCode}`} style={{ borderBottom: '1px solid var(--color-border-light)', cursor: 'pointer', transition: 'background 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                            <td style={{ padding: '12px 0' }}>
                                                <div style={{ fontWeight: 500 }}>{apt.date} {apt.time && `• ${apt.time}`}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{apt.department} • {apt.doctorName}</div>
                                            </td>
                                            <td style={{ textAlign: 'right', padding: '12px 0' }}>
                                                <span className={`badge ${apt.status === 'Completed' ? 'badge-success' : apt.status === 'Cancelled' ? 'badge-error' : 'badge-info'}`}>
                                                    {apt.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px 0' }}>
                                No appointments recorded yet.
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Column - Sideline Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(22,163,74,0.1)', color: '#16A34A', padding: '6px', borderRadius: '8px' }}>
                                <ShieldPlus size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Medical Flags</h3>
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: 500 }}>Allergies</p>
                            {patient.allergies ? (
                                <p style={{ fontSize: '14px', color: '#DC2626', fontWeight: 500 }}>{patient.allergies}</p>
                            ) : (
                                <p style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>None Reported</p>
                            )}
                        </div>
                    </div>

                    {/* Patient Records Section */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '6px', borderRadius: '8px' }}>
                                    <FileText size={18} />
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Uploaded Records</h3>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {patient.records && patient.records.length > 0 ? (
                                patient.records.map(record => (
                                    <div key={record.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', background: '#FAFCFF' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ background: '#E2E8F0', padding: '8px', borderRadius: '6px', color: '#64748B' }}>
                                                <FileText size={16} />
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--color-navy)' }}>{record.title}</p>
                                                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>{record.categoryTag} • {record.date ? record.date : new Date(record.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <a href={record.fileUrl || "#"} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none', background: '#fff', fontSize: '12px', padding: '6px 10px' }}>
                                            View
                                        </a>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px 0' }}>
                                    No records uploaded yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
