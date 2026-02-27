'use client';
import { Save, ArrowLeft, CalendarAdd, Clock, UserIcon, Stethoscope, Search, Info } from 'lucide-react';
import Link from 'next/link';

export default function BookAppointmentPage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/appointments" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Book Appointment</h1>
                        <p className="page-header__subtitle">Schedule a consultation for external or registered patients.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        Cancel
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <Save size={15} strokeWidth={1.5} />
                        Confirm Booking
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px', paddingBottom: '40px' }}>
                {/* Main Form Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Patient Selection */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(0,194,255,0.1)', color: 'var(--color-navy)', padding: '6px', borderRadius: '8px' }}>
                                <Search size={18} />
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Select Patient</h3>
                        </div>
                        <div style={{ position: 'relative', marginBottom: '16px' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                            <input type="text" placeholder="Search by Patient Name, UHID, or Mobile Number..." style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }} />
                            <button className="btn btn-primary btn-sm" style={{ position: 'absolute', right: '6px', top: '6px' }}>Search</button>
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                            <span>Not registered yet?</span>
                            <Link href="/patients/new" style={{ color: '#00C2FF', fontWeight: 500, textDecoration: 'none' }}>Register New Patient</Link>
                        </div>
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
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Department & Doctor <span style={{ color: 'red' }}>*</span></label>
                                <select style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                    <option>Select Doctor (Department)...</option>
                                    <option>Dr. Priya Sharma (Cardiology)</option>
                                    <option>Dr. Raj Malhotra (Orthopedics)</option>
                                    <option>Dr. Kavita Patel (Neurology)</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Appointment Date <span style={{ color: 'red' }}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <input type="date" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', color: 'var(--color-text-primary)' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Time Slot <span style={{ color: 'red' }}>*</span></label>
                                <select style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                                    <option>Select available time...</option>
                                    <option>09:00 AM - 09:30 AM</option>
                                    <option>10:00 AM - 10:30 AM</option>
                                    <option>11:30 AM - 12:00 PM</option>
                                    <option>02:00 PM - 02:30 PM (Afternoon)</option>
                                </select>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Chief Complaint / Reason for Visit</label>
                                <textarea rows="3" placeholder="Briefly describe the patient's symptoms or reason for booking..." style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }}></textarea>
                            </div>
                        </div>
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
                                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>- Not Selected -</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ minWidth: '24px', height: '24px', background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Stethoscope size={14} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Doctor & Dept</div>
                                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>- Not Selected -</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ minWidth: '24px', height: '24px', background: 'rgba(22,163,74,0.1)', color: '#16A34A', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Clock size={14} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Date & Time</div>
                                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>- Not Selected -</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed var(--color-border-light)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Consultation Fee</span>
                                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>₹ 0.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Registration</span>
                                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>₹ 0.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-border-light)' }}>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>Total Payable</span>
                                <span style={{ fontSize: '16px', fontWeight: 700, color: '#16A34A' }}>₹ 0.00</span>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '16px', display: 'flex', gap: '12px', background: 'rgba(217,119,6,0.05)', border: '1px solid rgba(217,119,6,0.2)' }}>
                        <Info size={16} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ fontSize: '12px', color: '#B45309', lineHeight: 1.5, margin: 0 }}>
                            Please ensure the patient brings past medical records if they are consulting for a previously diagnosed condition.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
