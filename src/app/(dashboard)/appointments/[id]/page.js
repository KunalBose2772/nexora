'use client';
import { Save, ArrowLeft, Clock, UserIcon, Stethoscope, FileText, CreditCard, Activity, ShieldAlert, Lock, Unlock } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AppointmentDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [prescriptions, setPrescriptions] = useState([]);
    const [signingId, setSigningId] = useState(null);

    // Editable states
    const [formData, setFormData] = useState({
        status: '',
        date: '',
        time: '',
        doctorName: '', // Composed of "Doctor (Department)"
        paymentStatus: ''
    });

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const res = await fetch(`/api/appointments/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setAppointment(data.appointment);
                    setFormData({
                        status: data.appointment.status,
                        date: data.appointment.date,
                        time: data.appointment.time || '',
                        doctorName: `${data.appointment.doctorName} ${data.appointment.department ? `(${data.appointment.department})` : ''}`.trim(),
                        paymentStatus: data.appointment.paymentStatus || 'Pending'
                    });
                    
                    // Fetch prescriptions for this appointment
                    const rxRes = await fetch(`/api/prescriptions?appointmentId=${data.appointment.id}`);
                    if (rxRes.ok) {
                        const rxData = await rxRes.json();
                        setPrescriptions(rxData.prescriptions || []);
                    }
                } else {
                    setErrorMsg(data.error || 'Failed to load appointment details.');
                }
            } catch (err) {
                setErrorMsg('Network error. Failed to load appointment details.');
            } finally {
                setLoading(false);
            }
        };
        fetchAppointment();
    }, [id]);

    const handleSignPrescription = async (rxId) => {
        setSigningId(rxId);
        try {
            const res = await fetch('/api/prescriptions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: rxId, validationStatus: 'Signed' })
            });

            if (res.ok) {
                setPrescriptions(prev => prev.map(p => p.id === rxId ? { ...p, validationStatus: 'Signed', locked: true } : p));
                setSuccessMsg('Prescription signed and sent to pharmacy.');
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                const data = await res.json();
                setErrorMsg(data.error || 'Failed to sign prescription.');
            }
        } catch (e) {
            setErrorMsg('Network error during signing.');
        } finally {
            setSigningId(null);
        }
    };

    const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleUpdate = async () => {
        setErrorMsg('');
        setSuccessMsg('');
        setSaving(true);
        try {
            let doctor = formData.doctorName;
            let department = appointment.department;
            if (doctor.includes('(')) {
                department = doctor.split('(')[1].replace(')', '').trim();
                doctor = doctor.split('(')[0].trim();
            }

            const res = await fetch(`/api/appointments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: formData.status,
                    date: formData.date,
                    time: formData.time,
                    doctorName: doctor,
                    department: department,
                    paymentStatus: formData.paymentStatus
                })
            });

            if (res.ok) {
                const data = await res.json();
                setAppointment(data.appointment);
                setSuccessMsg('Appointment updated successfully!');
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                const data = await res.json();
                setErrorMsg(data.error || 'Failed to update appointment.');
            }
        } catch (err) {
            setErrorMsg('An unexpected error occurred.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '24px' }}>Loading appointment ticket...</div>;
    if (!appointment) return <div style={{ padding: '24px', color: '#DC2626' }}>{errorMsg || 'Not found'}</div>;

    const isPaid = formData.paymentStatus === 'Paid';

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/appointments" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                            <h1 className="page-header__title" style={{ margin: 0 }}>
                                Booking Ticket: {appointment.apptCode}
                            </h1>
                            <span className={`badge ${appointment.status === 'Completed' ? 'badge-success' : appointment.status === 'Cancelled' ? 'badge-error' : 'badge-info'}`}>
                                {appointment.status}
                            </span>
                            {appointment.isMLC && (
                                <span className="badge" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <ShieldAlert size={12} /> Medico-Legal
                                </span>
                            )}
                        </div>
                        <p className="page-header__subtitle" style={{ fontFamily: 'monospace' }}>
                            Generated on: {new Date(appointment.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button 
                        onClick={handleUpdate} 
                        disabled={saving || appointment.isLocked} 
                        className="btn btn-primary btn-sm" 
                        style={{ minWidth: '140px', opacity: appointment.isLocked ? 0.6 : 1 }}
                    >
                        {saving ? 'Saving...' : <><Save size={15} strokeWidth={1.5} /> Save Changes</>}
                    </button>
                    {appointment.isMLC && !appointment.isLocked && (
                        <button 
                            onClick={async () => {
                                if(confirm("Are you sure? Locking an MLC record prevents ANY further modifications for legal integrity.")) {
                                    const res = await fetch(`/api/appointments/${id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ isLocked: true })
                                    });
                                    if(res.ok) {
                                        const data = await res.json();
                                        setAppointment(data.appointment);
                                        setSuccessMsg("Record locked successfully for legal proceedings.");
                                    }
                                }
                            }}
                            className="btn btn-sm"
                            style={{ background: '#000', color: '#fff' }}
                        >
                            <Lock size={14} /> Lock Record
                        </button>
                    )}
                </div>
            </div>

            {successMsg && (
                <div style={{ padding: '16px', marginBottom: '20px', background: 'rgba(34,197,94,0.1)', color: '#16A34A', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.2)', fontWeight: 500 }}>
                    {successMsg}
                </div>
            )}

            {errorMsg && (
                <div style={{ padding: '16px', marginBottom: '20px', background: 'rgba(239,68,68,0.1)', color: '#DC2626', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {errorMsg}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '24px', paddingBottom: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Editable Booking Specs */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(56,189,248,0.1)', color: '#0EA5E9', padding: '6px', borderRadius: '8px' }}>
                                <Activity size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Reschedule & Operations</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Ticket Status</label>
                                <select name="status" value={formData.status} onChange={handleFormChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: formData.status === 'Completed' ? '#F0FDF4' : formData.status === 'Cancelled' ? '#FEF2F2' : '#fff', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Waiting">Waiting</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Department & Doctor</label>
                                <select name="doctorName" value={formData.doctorName} onChange={handleFormChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                    <option value={formData.doctorName}>{formData.doctorName}</option>
                                    <option value="Dr. Priya Sharma (Cardiology)">Dr. Priya Sharma (Cardiology)</option>
                                    <option value="Dr. Raj Malhotra (Orthopedics)">Dr. Raj Malhotra (Orthopedics)</option>
                                    <option value="Dr. Kavita Patel (Neurology)">Dr. Kavita Patel (Neurology)</option>
                                    <option value="Dr. Amit Singh (General Med)">Dr. Amit Singh (General Med)</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Appointment Date</label>
                                <input type="date" name="date" value={formData.date} onChange={handleFormChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', color: 'var(--color-text-primary)' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Time Slot</label>
                                <select name="time" value={formData.time} onChange={handleFormChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                    {formData.time && !["09:00 AM - 09:30 AM", "10:00 AM - 10:30 AM", "11:30 AM - 12:00 PM", "02:00 PM - 02:30 PM (Afternoon)"].includes(formData.time) && <option value={formData.time}>{formData.time}</option>}
                                    <option value="09:00 AM - 09:30 AM">09:00 AM - 09:30 AM</option>
                                    <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                                    <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                                    <option value="02:00 PM - 02:30 PM (Afternoon)">02:00 PM - 02:30 PM (Afternoon)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Clinical Approvals Panel */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', padding: '6px', borderRadius: '8px' }}>
                                <Stethoscope size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Clinical Approvals & Meds</h3>
                        </div>

                        {prescriptions.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#94A3B8' }}>
                                <p style={{ fontSize: '14px', margin: 0 }}>No consultations recorded yet for this visit.</p>
                                <Link 
                                    href={`/opd/consult?appointmentId=${appointment.id}&patient=${encodeURIComponent(appointment.patientName)}&doctor=${encodeURIComponent(appointment.doctorName)}`}
                                    className="btn btn-secondary btn-sm"
                                    style={{ marginTop: '12px', background: '#fff' }}
                                >
                                    Record New Consult
                                </Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {prescriptions.map(rx => (
                                    <div key={rx.id} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                                        <div style={{ background: rx.validationStatus === 'Signed' ? '#F8FAFC' : '#FFFBEB', padding: '12px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', fontFamily: 'monospace' }}>{rx.rxCode}</div>
                                                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy)' }}>{rx.diagnosis || 'General Consult'}</div>
                                            </div>
                                            <span style={{ fontSize: '11px', fontWeight: 700, background: rx.validationStatus === 'Signed' ? '#DCFCE7' : '#FEF3C7', color: rx.validationStatus === 'Signed' ? '#166534' : '#92400E', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>
                                                {rx.validationStatus}
                                            </span>
                                        </div>
                                        <div style={{ padding: '16px', fontSize: '13px' }}>
                                            <div style={{ color: '#475569', marginBottom: '12px' }}>{rx.clinicalNotes?.substring(0, 100)}{rx.clinicalNotes?.length > 100 ? '...' : ''}</div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {rx.validationStatus !== 'Signed' && (
                                                    <button 
                                                        onClick={() => handleSignPrescription(rx.id)}
                                                        disabled={signingId === rx.id}
                                                        className="btn btn-primary btn-sm"
                                                        style={{ background: '#10B981', borderColor: '#10B981' }}
                                                    >
                                                        {signingId === rx.id ? 'Signing...' : 'Approve & Sign'}
                                                    </button>
                                                )}
                                                <Link 
                                                    href={`/api/prescriptions/print/${rx.id}`}
                                                    target="_blank"
                                                    className="btn btn-secondary btn-sm" 
                                                    style={{ background: '#fff' }}
                                                >
                                                    View Detail
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Patient Context */}
                    <div className="card" style={{ padding: '24px', background: '#FAFCFF', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', margin: 0 }}>Linked Patient</h3>
                            {appointment.patient?.patientCode && (
                                <Link href={`/patients/${appointment.patient.patientCode}`} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '12px', background: '#fff' }}>
                                    Open Profile
                                </Link>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ minWidth: '32px', height: '32px', background: 'rgba(0,194,255,0.1)', color: '#00C2FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <UserIcon size={16} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)' }}>{appointment.patientName}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{appointment.patient?.patientCode || 'Guest / Unlinked'}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{appointment.patient?.phone || 'No Contact'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MLC / Police Details Card */}
                    {appointment.isMLC && (
                        <div className="card" style={{ padding: '24px', border: '1px solid #FCA5A5', background: '#FFF5F5' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                < ShieldAlert size={18} color="#DC2626" />
                                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#9B1C1C', margin: 0 }}>Police & MLC Record</h3>
                            </div>
                            
                            <div style={{ display: 'grid', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                    <span style={{ color: '#7F1D1D', fontWeight: 500 }}>MLC Number</span>
                                    <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{appointment.mlcNumber || 'N/A'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                    <span style={{ color: '#7F1D1D', fontWeight: 500 }}>Police Station</span>
                                    <span style={{ fontWeight: 600 }}>{appointment.policeStation || 'Pending'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                    <span style={{ color: '#7F1D1D', fontWeight: 500 }}>FIR Reference</span>
                                    <span style={{ fontWeight: 600 }}>{appointment.firNumber || 'None'}</span>
                                </div>
                                
                                {appointment.mlcDetails && (
                                    <div style={{ marginTop: '8px', padding: '10px', background: '#fff', borderRadius: '6px', border: '1px solid #FEE2E2', fontSize: '12px', color: '#451A03', lineHeight: 1.5 }}>
                                        <strong>Incident Summary:</strong><br/>
                                        {appointment.mlcDetails}
                                    </div>
                                )}

                                <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px', color: appointment.isLocked ? '#059669' : '#DC2626', fontSize: '12px', fontWeight: 600 }}>
                                    {appointment.isLocked ? <><Lock size={12} /> Record is Legally Sealed</> : <><Unlock size={12} /> Under Active Entry</>}
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Financial/Ledger Placeholder */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(34,197,94,0.1)', color: '#16A34A', padding: '6px', borderRadius: '8px' }}>
                                <CreditCard size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Billing Ledger</h3>
                        </div>

                        <div style={{ padding: '16px', background: isPaid ? '#F0FDF4' : '#FFFBEB', border: `1px solid ${isPaid ? '#BBF7D0' : '#FEF3C7'}`, borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
                            <span className={`badge ${isPaid ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '13px' }}>
                                {isPaid ? 'Paid Online' : 'Payment Pending'}
                            </span>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                                This token currently holds a {isPaid ? 'paid' : 'pending'} balance.
                            </p>

                            <div style={{ marginTop: '8px', width: '100%', textAlign: 'left' }}>
                                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Update Payment Status manually</label>
                                <select name="paymentStatus" value={formData.paymentStatus} onChange={handleFormChange} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '13px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Refunded">Refunded</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
