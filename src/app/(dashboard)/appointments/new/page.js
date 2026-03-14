'use client';
import { Save, ArrowLeft, Clock, UserIcon, Stethoscope, Search, Info, CheckCircle2 } from 'lucide-react';
import Skeleton from '@/components/common/Skeleton';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BookAppointmentPage() {
    const router = useRouter();
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [tenant, setTenant] = useState(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [doctorSearch, setDoctorSearch] = useState('');
    const [isDoctorSearchFocused, setIsDoctorSearchFocused] = useState(false);

    const [formData, setFormData] = useState({
        doctorName: '',
        date: '',
        time: '',
        reason: '',
        isMLC: false,
        mlcNumber: '',
        policeStation: '',
        firNumber: '',
        mlcDetails: '',
        paymentMethod: 'Cash',
        paymentAmount: 750,
        type: 'OPD',
    });

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
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
                    const patientList = data.patients || [];
                    setPatients(patientList);

                    if (pid) {
                        const found = patientList.find(p => p.id === pid);
                        if (found) setSearch(found.patientCode);
                    }
                }
            } catch (err) {
                console.error("Failed to load patients", err);
            }
        };

        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data.tenant) setTenant(data.tenant);
                }
            } catch (err) {
                console.error("Failed to load branding", err);
            }
        };

        const fetchDoctors = async () => {
            try {
                const res = await fetch('/api/hr/staff');
                if (res.ok) {
                    const data = await res.json();
                    const drs = (data.staff || []).filter(s =>
                        s.role?.toLowerCase() === 'doctor' ||
                        s.role?.toLowerCase() === 'consultant' ||
                        s.role?.toLowerCase() === 'physician'
                    );
                    setDoctors(drs);
                }
            } catch (err) {
                console.error("Failed to load doctors", err);
            }
        };

        const loadAll = async () => {
            try {
                await Promise.all([
                    fetchPatients(),
                    fetchSettings(),
                    fetchDoctors()
                ]);
            } catch (err) {
            } finally {
                setLoadingData(false);
            }
        };
        loadAll();
    }, []);

    const filteredPatients = patients.filter(p =>
        p.firstName.toLowerCase().includes(search.toLowerCase()) ||
        p.lastName.toLowerCase().includes(search.toLowerCase()) ||
        p.patientCode.toLowerCase().includes(search.toLowerCase()) ||
        (p.phone && p.phone.includes(search))
    );

    const handlePatientSearch = (e) => setSearch(e.target.value);
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const [showSuccess, setShowSuccess] = useState(false);
    const [bookingData, setBookingData] = useState(null);

    const handleSubmit = async () => {
        setErrorMsg('');
        if (!selectedPatientId || !formData.doctorName || !formData.date || !formData.time) {
            setErrorMsg('Please select a patient, doctor, date, and time.');
            return;
        }

        const patient = patients.find(p => p.id === selectedPatientId);
        if (!patient) return;

        let doctor = formData.doctorName;
        let department = '';
        if (doctor.includes('(')) {
            department = doctor.split('(')[1].replace(')', '').trim();
            doctor = doctor.split('(')[0].trim();
        }

        // Final cleaning of Dr. prefix for API consistency if needed
        const cleanDoctorName = doctor.replace(/^Dr\.\s+/i, '').trim();

        setLoading(true);
        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: patient.id,
                    patientName: `${patient.firstName} ${patient.lastName}`,
                    doctorName: cleanDoctorName,
                    department: department,
                    date: formData.date,
                    time: formData.time,
                    reason: formData.reason,
                    isMLC: formData.isMLC,
                    mlcNumber: formData.mlcNumber,
                    policeStation: formData.policeStation,
                    firNumber: formData.firNumber,
                    mlcDetails: formData.mlcDetails,
                    paymentMethod: formData.paymentMethod,
                    paymentAmount: formData.paymentAmount,
                    type: formData.type
                })
            });

            const data = await res.json();
            if (res.ok) {
                setBookingData(data);
                setShowSuccess(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setErrorMsg(data.error || 'Failed to book appointment.');
            }
        } catch (err) {
            setErrorMsg('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (showSuccess) {
        const { appointment, invoice } = bookingData;
        return (
            <div className="fade-in" style={{ paddingBottom: '60px' }}>
                <div className="no-print" style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: '64px', height: '64px', background: '#DCFCE7', color: '#16A34A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <CheckCircle2 size={32} />
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '8px' }}>Appointment Confirmed!</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>The record and payment have been successfully saved.</p>
                </div>

                <div
                    id="printable-slip"
                    style={{
                        background: '#fff',
                        padding: '44px',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        maxWidth: '850px',
                        margin: '0 auto',
                        boxShadow: '0 4px 25px rgba(0,0,0,0.06)',
                        position: 'relative'
                    }}
                >
                    {/* Official Hospital Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', borderBottom: '30px solid #f8fafc', paddingBottom: '0', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '24px' }}>
                            {tenant?.logoUrl ? (
                                <img src={tenant.logoUrl} alt="Logo" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
                            ) : (
                                <div style={{ width: '70px', height: '70px', background: '#0F172A', color: '#fff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Stethoscope size={38} />
                                </div>
                            )}
                            <div>
                                <h1 style={{ fontSize: '30px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>{tenant?.name || 'Nexora Health Systems'}</h1>
                                <p style={{ fontSize: '13px', color: '#1E293B', margin: '4px 0 0', fontWeight: 700 }}>{tenant?.tagline || 'Clinical Excellence • Patient Care'}</p>
                                <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0', lineHeight: 1.4, maxWidth: '400px' }}>{tenant?.address || 'Hospital Address Configuration Pending'}</p>
                                <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>Phone: {tenant?.phone || 'N/A'} | Web: {typeof window !== 'undefined' ? `${window.location.host}${tenant?.slug ? '/' + tenant.slug : ''}` : 'www.nexora.com'}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ background: '#0F172A', color: '#fff', padding: '8px 20px', fontSize: '15px', fontWeight: 900, borderRadius: '4px', textTransform: 'uppercase', marginBottom: '10px' }}>
                                Appointment Record
                            </div>
                            <p style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>UHID/MRN: {appointment.patient?.patientCode}</p>
                            <p style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>APPT ID: {appointment.apptCode}</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '48px' }}>
                        <div>
                            <div style={{ marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#64748B', borderBottom: '1.5px solid #0F172A', paddingBottom: '6px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Patient Information</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <p style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '2px', textTransform: 'uppercase', fontWeight: 700 }}>Full Name</p>
                                        <p style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>{appointment.patientName}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '2px', textTransform: 'uppercase', fontWeight: 700 }}>Gender / Age</p>
                                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>{appointment.patient?.gender || 'N/A'} / {appointment.patient?.dob ? `${new Date().getFullYear() - new Date(appointment.patient?.dob).getFullYear()}Y` : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '2px', textTransform: 'uppercase', fontWeight: 700 }}>UHID Number</p>
                                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>{appointment.patient?.patientCode}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '2px', textTransform: 'uppercase', fontWeight: 700 }}>Primary Contact</p>
                                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>{appointment.patient?.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#64748B', borderBottom: '1.5px solid #0F172A', paddingBottom: '6px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Consultation Details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <p style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '2px', textTransform: 'uppercase', fontWeight: 700 }}>Consulting Doctor</p>
                                        <p style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Dr. {appointment.doctorName}</p>
                                        <p style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{appointment.department || 'OPD'}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '2px', textTransform: 'uppercase', fontWeight: 700 }}>Scheduled Slot</p>
                                        <p style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>{new Date(appointment.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                        <p style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{appointment.time || 'Walk-in'}</p>
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <p style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '2px', textTransform: 'uppercase', fontWeight: 700 }}>Case History / Remarks</p>
                                        <p style={{ fontSize: '13px', color: '#1E293B', fontStyle: 'italic', borderLeft: '3px solid #E2E8F0', paddingLeft: '12px' }}>"{appointment.reason || 'Routine consultation'}"</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ borderLeft: '1.5px solid #F1F5F9', paddingLeft: '40px' }}>
                            <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#64748B', borderBottom: '1.5px solid #0F172A', paddingBottom: '6px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Billing Summary</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Registration</span>
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>₹ {invoice?.amount > 500 ? '250.00' : '0.00'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>OPD Consultation</span>
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>₹ {invoice?.amount >= 500 ? '500.00' : invoice?.amount.toFixed(2)}</span>
                                </div>
                                <div style={{ marginTop: '12px', padding: '18px', background: '#0F172A', borderRadius: '10px', color: '#fff' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', opacity: 0.8 }}>Amount Paid</span>
                                        <span style={{ fontSize: '22px', fontWeight: 900 }}>₹ {invoice?.netAmount.toFixed(2)}</span>
                                    </div>
                                    <p style={{ fontSize: '11px', marginTop: '6px', opacity: 0.7, fontWeight: 600 }}>Paid via {invoice?.paymentMethod}</p>
                                </div>

                                <div style={{ marginTop: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ padding: '10px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : ''}${tenant?.slug ? '/' + tenant.slug : ''}/verify/appt/${appointment.apptCode}?patient=${appointment.patient?.patientCode}`)}`}
                                            alt="Verification QR"
                                            style={{ width: '120px', height: '120px', imageRendering: 'crisp-edges' }}
                                        />
                                    </div>
                                    <p style={{ fontSize: '10px', color: '#94A3B8', marginTop: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Secure Digital Verification</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '50px', paddingTop: '24px', borderTop: '2px solid #0F172A', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                        <div style={{ textAlign: 'left' }}>
                            <p style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                                * This is a computer-verified medical document. No physical signature is required.
                                <br />
                                <strong>Date Generated:</strong> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} at {new Date().toLocaleTimeString('en-IN')}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '13px', fontWeight: 900, color: '#0F172A', margin: 0 }}>{tenant?.name || 'Nexora'}</p>
                            <p style={{ fontSize: '10px', color: '#94A3B8', margin: 0 }}>Powered by Nexora Health Systems</p>
                        </div>
                    </div>

                    <style>{`
                        @media print {
                            @page { margin: 1cm; size: a4 portrait; }
                            
                            /* Force visibility and reset position for the printable element */
                            #printable-slip { 
                                display: block !important;
                                position: relative !important;
                                visibility: visible !important;
                                width: 100% !important;
                                max-width: 100% !important;
                                margin: 0 !important;
                                padding: 0 !important;
                                border: none !important;
                                boxShadow: none !important;
                                background: white !important;
                            }
                            
                            #printable-slip * { 
                                visibility: visible !important; 
                                -webkit-print-color-adjust: exact !important;
                                print-color-adjust: exact !important;
                            }

                            /* Hide all dashboard UI specifically */
                            aside, header, footer, .no-print, 
                            .dashboard-header-row, 
                            .dashboard-header-buttons,
                            #onboarding-journey,
                            .trial-banner { 
                                display: none !important; 
                                height: 0 !important;
                                overflow: hidden !important;
                            }

                            /* Reset parent containers */
                            .dashboard-main-content, 
                            .dashboard-main-area,
                            #main-content { 
                                margin: 0 !important; 
                                padding: 0 !important; 
                                background: white !important;
                                display: block !important;
                            }
                            
                            body, html {
                                background: white !important;
                                margin: 0 !important;
                                padding: 0 !important;
                            }
                        }
                    `}</style>
                </div>

                <div className="no-print" style={{ display: 'flex', gap: '16px', marginTop: '40px', maxWidth: '850px', margin: '40px auto' }}>
                    <button onClick={handlePrint} className="btn btn-primary" style={{ flex: 1, height: '56px', gap: '12px', fontSize: '16px', fontWeight: 800, borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,194,255,0.2)' }}>
                        <Save size={20} /> PRINT APPOINTMENT SLIP
                    </button>
                    <button onClick={() => router.push('/dashboard')} className="btn btn-secondary" style={{ flex: 1, height: '56px', fontSize: '16px', borderRadius: '12px' }}>
                        GO TO DASHBOARD
                    </button>
                </div>
            </div>
        );
    }

    const selectedPatient = patients.find(p => p.id === selectedPatientId);

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/dashboard" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Book Appointment</h1>
                        <p className="page-header__subtitle">Schedule a consultation for external or registered patients.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <Link href="/dashboard" className="btn btn-secondary btn-sm" style={{ background: '#fff', textDecoration: 'none' }}>
                        Back
                    </Link>
                </div>
            </div>

            {errorMsg && (
                <div style={{ padding: '16px', marginBottom: '20px', background: 'rgba(239,68,68,0.1)', color: '#DC2626', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {errorMsg}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px', paddingBottom: '40px' }}>
                {loadingData ? (
                    <>
                        <div className="space-y-6">
                            <Skeleton height="180px" borderRadius="12px" />
                            <Skeleton height="350px" borderRadius="12px" />
                            <Skeleton height="150px" borderRadius="12px" />
                        </div>
                        <div className="space-y-6">
                            <Skeleton height="400px" borderRadius="12px" />
                            <Skeleton height="100px" borderRadius="12px" />
                        </div>
                    </>
                ) : (
                    <>
                        {/* Main Form Area */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                            {/* Patient Selection */}
                            <div className="card" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                                    <div style={{ background: 'rgba(0,194,255,0.1)', color: 'var(--color-navy)', padding: '6px', borderRadius: '8px' }}>
                                        <Search size={18} />
                                    </div>
                                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>
                                        {selectedPatient ? 'Patient Selected' : 'Select Patient'} <span style={{ color: 'red' }}>*</span>
                                    </h3>
                                </div>
                                {!selectedPatient ? (
                                    <>
                                        <div style={{ position: 'relative', marginBottom: '16px' }}>
                                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                                            <input
                                                onFocus={() => setIsSearchFocused(true)}
                                                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                                type="text"
                                                value={search}
                                                onChange={handlePatientSearch}
                                                placeholder="Search by Patient Name, UHID, or Mobile Number..."
                                                style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}
                                            />
                                        </div>

                                        {(search || isSearchFocused) && (
                                            <div
                                                style={{
                                                    maxHeight: '260px',
                                                    overflowY: 'auto',
                                                    border: '1px solid var(--color-border-light)',
                                                    borderRadius: '8px',
                                                    marginBottom: '16px',
                                                    background: '#fff',
                                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                                                    zIndex: 10
                                                }}
                                            >
                                                {!search && (
                                                    <div style={{ padding: '10px 16px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9', fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        Recent Patients
                                                    </div>
                                                )}
                                                {filteredPatients.length > 0 ? filteredPatients.slice(0, search ? 50 : 5).map((p) => (
                                                    <div
                                                        key={p.id}
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            setSelectedPatientId(p.id);
                                                            setSearch('');
                                                            setIsSearchFocused(false);
                                                        }}
                                                        style={{
                                                            padding: '12px 16px',
                                                            borderBottom: '1px solid var(--color-border-light)',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            transition: 'all 0.2s ease',
                                                        }}
                                                        className="patient-search-item"
                                                    >
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-navy)' }}>{p.firstName} {p.lastName}</span>
                                                            <span style={{ fontSize: '11px', color: '#00C2FF', fontWeight: 600, background: 'rgba(0,194,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{p.patientCode}</span>
                                                        </div>
                                                        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{p.phone || 'No Phone Number Registered'}</span>
                                                    </div>
                                                )) : (
                                                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                                                        {search ? `No patients found matching "${search}"` : "No patients found"}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                                            <span>Not registered yet?</span>
                                            <Link href="/patients/new" style={{ color: '#00C2FF', fontWeight: 500, textDecoration: 'none' }}>Register New Patient</Link>
                                        </div>
                                    </>
                                ) : (
                                    <div className="fade-in" style={{ background: 'rgba(0,194,255,0.03)', border: '1px solid rgba(0,194,255,0.2)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            <div style={{ width: '48px', height: '48px', background: '#00C2FF', color: '#fff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px' }}>
                                                {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {selectedPatient.firstName} {selectedPatient.lastName}
                                                    <CheckCircle2 size={16} color="#16A34A" />
                                                </div>
                                                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                                                    UHID: <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{selectedPatient.patientCode}</span> • {selectedPatient.phone || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedPatientId(null)}
                                            style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#DC2626', cursor: 'pointer', transition: 'all 0.2s' }}
                                        >
                                            Change Patient
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Schedule Specifics */}
                            <div className="card" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                                    <div style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', padding: '6px', borderRadius: '8px' }}>
                                        <Stethoscope size={18} />
                                    </div>
                                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Consultation Details</h3>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                                    <div style={{ gridColumn: '1 / -1', position: 'relative' }}>
                                        <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Department & Doctor <span style={{ color: 'red' }}>*</span></label>

                                        {formData.doctorName ? (
                                            <div className="fade-in" style={{ background: 'rgba(139,92,246,0.03)', border: '1px solid rgba(139,92,246,0.2)', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                    <div style={{ width: '36px', height: '36px', background: '#8B5CF6', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
                                                        {formData.doctorName.replace(/^Dr\.\s+/i, '').charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)' }}>
                                                            {formData.doctorName.startsWith('Dr.') ? formData.doctorName : `Dr. ${formData.doctorName}`}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setFormData({ ...formData, doctorName: '' });
                                                        setDoctorSearch('');
                                                    }}
                                                    style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#DC2626', cursor: 'pointer' }}
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div style={{ position: 'relative' }}>
                                                    <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '11px' }} />
                                                    <input
                                                        type="text"
                                                        value={doctorSearch}
                                                        onFocus={() => setIsDoctorSearchFocused(true)}
                                                        onBlur={() => setTimeout(() => setIsDoctorSearchFocused(false), 200)}
                                                        onChange={(e) => setDoctorSearch(e.target.value)}
                                                        placeholder="Search Doctor by Name, Specialization or Department..."
                                                        style={{ width: '100%', padding: '10px 12px 10px 38px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff' }}
                                                    />
                                                </div>

                                                {(doctorSearch || isDoctorSearchFocused) && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: '100%',
                                                            left: 0,
                                                            right: 0,
                                                            maxHeight: '260px',
                                                            overflowY: 'auto',
                                                            border: '1px solid var(--color-border-light)',
                                                            borderRadius: '8px',
                                                            marginTop: '4px',
                                                            background: '#fff',
                                                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                                            zIndex: 50
                                                        }}
                                                    >
                                                        {doctors.filter(dr =>
                                                            dr.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
                                                            (dr.specialization && dr.specialization.toLowerCase().includes(doctorSearch.toLowerCase())) ||
                                                            (dr.department && dr.department.toLowerCase().includes(doctorSearch.toLowerCase()))
                                                        ).length > 0 ? doctors.filter(dr =>
                                                            dr.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
                                                            (dr.specialization && dr.specialization.toLowerCase().includes(doctorSearch.toLowerCase())) ||
                                                            (dr.department && dr.department.toLowerCase().includes(doctorSearch.toLowerCase()))
                                                        ).map((dr) => {
                                                            const displayName = dr.name.toLowerCase().startsWith('dr.') ? dr.name : `Dr. ${dr.name}`;
                                                            const subText = dr.specialization || dr.department || 'Consultant';
                                                            return (
                                                                <div
                                                                    key={dr.id}
                                                                    onMouseDown={(e) => {
                                                                        e.preventDefault();
                                                                        setFormData({ ...formData, doctorName: `${displayName} (${subText})` });
                                                                        setDoctorSearch('');
                                                                        setIsDoctorSearchFocused(false);
                                                                    }}
                                                                    style={{
                                                                        padding: '10px 16px',
                                                                        borderBottom: '1px solid var(--color-border-light)',
                                                                        cursor: 'pointer',
                                                                        transition: 'background 0.2s'
                                                                    }}
                                                                    className="hover:bg-slate-50"
                                                                >
                                                                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-navy)' }}>{displayName}</div>
                                                                    <div style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 600 }}>{subText}</div>
                                                                </div>
                                                            );
                                                        }) : (
                                                            <div style={{ padding: '20px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                                                                {doctorSearch ? `No doctors found matching "${doctorSearch}"` : "Loading active lineup..."}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Appointment Date <span style={{ color: 'red' }}>*</span></label>
                                        <input type="date" name="date" value={formData.date} onChange={handleFormChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', color: 'var(--color-text-primary)' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Time Slot <span style={{ color: 'red' }}>*</span></label>
                                        <select name="time" value={formData.time} onChange={handleFormChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                            <option value="">Select available time...</option>
                                            <option value="09:00 AM - 09:30 AM">09:00 AM - 09:30 AM</option>
                                            <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                                            <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                                            <option value="02:00 PM - 02:30 PM (Afternoon)">02:00 PM - 02:30 PM (Afternoon)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Consultation Mode <span style={{ color: 'red' }}>*</span></label>
                                        <select name="type" value={formData.type} onChange={handleFormChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                            <option value="OPD">Physical Visit (OPD)</option>
                                            <option value="Emergency">Emergency / Walk-in Visit</option>
                                            <option value="Teleconsult">Virtual Consultation (Telemedicine)</option>
                                        </select>
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Chief Complaint / Reason for Visit</label>
                                        <textarea name="reason" value={formData.reason} onChange={handleFormChange} rows="2" placeholder="Briefly describe the patient's symptoms..." style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }}></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Payment & Invoicing */}
                            <div className="card" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                                    <div style={{ background: 'rgba(22,163,74,0.1)', color: '#16A34A', padding: '6px', borderRadius: '8px' }}>
                                        <CheckCircle2 size={18} />
                                    </div>
                                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Payment & Billing</h3>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Payment Method</label>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            {['Cash', 'UPI', 'Card'].map(m => (
                                                <label key={m} style={{
                                                    flex: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '10px',
                                                    border: `1px solid ${formData.paymentMethod === m ? '#00C2FF' : '#E2E8F0'}`,
                                                    borderRadius: '8px',
                                                    background: formData.paymentMethod === m ? 'rgba(0,194,255,0.05)' : '#fff',
                                                    cursor: 'pointer',
                                                    fontSize: '13px',
                                                    fontWeight: formData.paymentMethod === m ? 600 : 400,
                                                    color: formData.paymentMethod === m ? '#0070F3' : '#64748B'
                                                }}>
                                                    <input type="radio" name="paymentMethod" value={m} checked={formData.paymentMethod === m} onChange={handleFormChange} style={{ display: 'none' }} />
                                                    {m}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Payable Amount (₹)</label>
                                        <select name="paymentAmount" value={formData.paymentAmount} onChange={handleFormChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                            <option value={750}>₹ 750.00 (Reg + Consult)</option>
                                            <option value={500}>₹ 500.00 (Consult Only)</option>
                                            <option value={0}>₹ 0.00 (Pay Later / Free)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* MLC Section */}
                            <div style={{ marginTop: '12px', padding: '16px', background: formData.isMLC ? '#FFF5F5' : '#F8FAFC', border: `1px solid ${formData.isMLC ? '#FEB2B2' : '#E2E8F0'}`, borderRadius: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <input
                                        type="checkbox"
                                        name="isMLC"
                                        id="isMLC"
                                        checked={formData.isMLC}
                                        onChange={handleFormChange}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="isMLC" style={{ fontSize: '14px', fontWeight: 600, color: formData.isMLC ? '#C53030' : 'var(--color-navy)', cursor: 'pointer' }}>
                                        Mark as Medico-Legal Case (MLC)
                                    </label>
                                </div>

                                {formData.isMLC && (
                                    <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#742A2A', fontWeight: 600 }}>MLC Number <span style={{ color: 'red' }}>*</span></label>
                                            <input type="text" name="mlcNumber" value={formData.mlcNumber} onChange={handleFormChange} placeholder="e.g. MLC-2024-001" style={{ width: '100%', padding: '8px 12px', border: '1px solid #FEB2B2', borderRadius: '6px', fontSize: '13px' }} required />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#742A2A', fontWeight: 600 }}>Police Station</label>
                                            <input type="text" name="policeStation" value={formData.policeStation} onChange={handleFormChange} placeholder="Assigned Station" style={{ width: '100%', padding: '8px 12px', border: '1px solid #FEB2B2', borderRadius: '6px', fontSize: '13px' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#742A2A', fontWeight: 600 }}>FIR No. (if any)</label>
                                            <input type="text" name="firNumber" value={formData.firNumber} onChange={handleFormChange} placeholder="FIR Reference" style={{ width: '100%', padding: '8px 12px', border: '1px solid #FEB2B2', borderRadius: '6px', fontSize: '13px' }} />
                                        </div>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#742A2A', fontWeight: 600 }}>Forensic/Incident Details</label>
                                            <textarea name="mlcDetails" value={formData.mlcDetails} onChange={handleFormChange} rows="2" placeholder="Describe the incident (Accident, Assault, Poisoning, etc.)..." style={{ width: '100%', padding: '8px 12px', border: '1px solid #FEB2B2', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit' }}></textarea>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Summary */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="card" style={{ padding: '24px', background: '#FAFCFF', border: '1px solid #E2E8F0' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '16px' }}>Booking Summary</h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{ minWidth: '24px', height: '24px', background: 'rgba(0,194,255,0.1)', color: '#00C2FF', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <UserIcon size={14} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Patient Name</div>
                                            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : '- Not Selected -'}</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{ minWidth: '24px', height: '24px', background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Stethoscope size={14} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Doctor & Dept</div>
                                            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{formData.doctorName || '- Not Selected -'}</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{ minWidth: '24px', height: '24px', background: 'rgba(22,163,74,0.1)', color: '#16A34A', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Clock size={14} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Date & Time</div>
                                            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                                                {formData.date && formData.time ? `${formData.date} at ${formData.time.split(' ')[0]}` : '- Not Selected -'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed var(--color-border-light)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Consultation Fee</span>
                                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>₹ {formData.paymentAmount >= 500 ? '500.00' : '0.00'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Registration</span>
                                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>₹ {formData.paymentAmount > 500 ? '250.00' : '0.00'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-border-light)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>Total Payable</span>
                                            <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>via {formData.paymentMethod}</span>
                                        </div>
                                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#16A34A' }}>₹ {parseFloat(formData.paymentAmount).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="card" style={{ padding: '16px', display: 'flex', gap: '12px', background: 'rgba(217,119,6,0.05)', border: '1px solid rgba(217,119,6,0.2)' }}>
                                <Info size={16} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <p style={{ fontSize: '12px', color: '#B45309', lineHeight: 1.5, margin: 0 }}>
                                    Please ensure the patient brings past medical records if they are consulting for a previously diagnosed condition.
                                </p>
                            </div>

                            {/* Bottom Action Bar */}
                            <div className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                                <Link href="/dashboard" className="btn btn-secondary" style={{ minWidth: '120px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    Cancel
                                </Link>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="btn btn-primary"
                                    style={{ minWidth: '200px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '15px' }}
                                >
                                    {loading ? 'Processing...' : <><Save size={18} /> Confirm & Book Appointment</>}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
