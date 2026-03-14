'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    Phone, MapPin, Mail, Clock, ChevronRight, Heart, Activity,
    Microscope, Pill, Baby, Brain, Stethoscope, Shield, Users,
    CalendarDays, ArrowRight, HeartPulse, CheckCircle, Menu, X,
    Loader2, Star, Award, Zap, Eye, Thermometer, Bone, FlaskConical,
    Plus, Minus, Building2, Globe, ChevronDown
} from 'lucide-react';

/* ─── Static Data ─────────────────────────────────────────────────────────── */
const SERVICES = [
    { icon: Heart, name: 'Cardiology', desc: 'Advanced cardiac care — ECG, echo, angiography & catheterisation lab.' },
    { icon: Brain, name: 'Neurology', desc: 'Brain & spine diagnostics, stroke management, and neurological rehab.' },
    { icon: Bone, name: 'Orthopaedics', desc: 'Joint replacement, sports injuries, fracture care & physiotherapy.' },
    { icon: Eye, name: 'Ophthalmology', desc: 'Laser eye surgery, cataract removal, retinal care & vision diagnostics.' },
    { icon: Baby, name: 'Paediatrics', desc: 'Comprehensive child health from newborn screening to adolescent care.' },
    { icon: Microscope, name: 'Pathology & Labs', desc: 'NABL-accredited lab with 1,500+ tests, home collection & fast reports.' },
    { icon: Pill, name: 'Pharmacy', desc: '24/7 in-house pharmacy with all branded, generic & specialty medicines.' },
    { icon: Activity, name: 'Emergency Care', desc: 'Round-the-clock emergency with trauma team & ICU step-down facility.' },
    { icon: Thermometer, name: 'Internal Medicine', desc: 'Diabetes, hypertension, infections & preventive health management.' },
    { icon: FlaskConical, name: 'Radiology & Imaging', desc: 'MRI, CT scan, X-ray, ultrasound & interventional radiology services.' },
    { icon: Stethoscope, name: 'Pulmonology', desc: 'Asthma, COPD, sleep apnea, respiratory infections & chest medicine.' },
    { icon: Zap, name: 'Physiotherapy', desc: 'Post-surgery rehab, sports recovery, musculoskeletal & neuro therapy.' },
];

const WHY_US = [
    { title: 'Expert Specialists', desc: 'Internationally trained doctors with 10–25 years of domain expertise.' },
    { title: 'Digital Health Records', desc: 'Secure EMR system — access your reports, prescriptions & history anytime.' },
    { title: 'Cashless Insurance', desc: 'Cashless treatment with 500+ insurers. Zero paperwork at admission.' },
    { title: 'Transparent Billing', desc: 'Clear, itemised billing with no hidden fees or surprise charges.' },
    { title: 'Advanced Diagnostics', desc: 'State-of-the-art lab & imaging — most reports within 2–4 hours.' },
    { title: '24/7 Emergency Care', desc: 'Dedicated emergency bay, trauma team & ICU open round the clock.' },
];

const DOCTORS = [
    { dept: 'Cardiology', exp: '18 yrs', avail: 'Mon, Wed, Fri', color: '#EF4444' },
    { dept: 'Neurology', exp: '14 yrs', avail: 'Tue, Thu, Sat', color: '#8B5CF6' },
    { dept: 'Orthopaedics', exp: '16 yrs', avail: 'Mon–Fri', color: '#3B82F6' },
    { dept: 'General Medicine', exp: '11 yrs', avail: 'Mon–Sat', color: '#10B981' },
];

const FAQS = [
    { q: 'How do I book an appointment online?', a: 'Click "Book Appointment" and log in with your registered mobile number. Select your preferred doctor, date and time slot — confirmation is instant via SMS.' },
    { q: 'Do you offer home sample collection?', a: 'Yes. Our certified phlebotomists visit your home between 6 AM – 10 AM. Book through the patient portal or call us directly.' },
    { q: 'Which insurance plans are accepted?', a: 'We accept 500+ insurance plans including Star Health, HDFC ERGO, Bajaj Allianz, Medi Assist, and all government health schemes.' },
    { q: 'What are the visiting hours for inpatients?', a: 'Visiting hours are 10 AM – 12 PM and 5 PM – 7 PM daily. ICU visits are restricted to one family member per slot.' },
    { q: 'Can I access my reports online?', a: 'Yes. All lab reports, discharge summaries and prescriptions are available on the patient portal within hours of testing.' },
];

/* ─── Logo Component ──────────────────────────────────────────────────────── */
function HospitalLogo({ tenant, size = 48, textSize = 15 }) {
    const color = tenant.primaryColor || '#10B981';
    const initials = tenant.logoInitials || tenant.name?.substring(0, 2).toUpperCase() || 'NH';
    if (tenant.logoUrl) {
        return (
            <img src={tenant.logoUrl} alt={`${tenant.name} logo`}
                style={{ height: size, width: 'auto', maxWidth: size * 3, objectFit: 'contain', borderRadius: '6px' }} />
        );
    }
    return (
        <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.22) + 'px', background: `linear-gradient(135deg, ${color}, ${color}cc)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 4px 12px ${color}40` }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: Math.round(size * 0.28) + 'px', letterSpacing: '-0.02em' }}>{initials}</span>
        </div>
    );
}

/* ─── FAQ Item ────────────────────────────────────────────────────────────── */
function FaqItem({ q, a, color }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ borderBottom: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <button onClick={() => setOpen(o => !o)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '16px' }}>
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', lineHeight: 1.4 }}>{q}</span>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: open ? color : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>
                    {open ? <Minus size={14} color="#fff" /> : <Plus size={14} color="#475569" />}
                </div>
            </button>
            <div style={{ maxHeight: open ? '200px' : '0', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.75, paddingBottom: '20px', margin: 0 }}>{a}</p>
            </div>
        </div>
    );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function HospitalHomePage({ slug }) {
    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const heroRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form States
    const [booking, setBooking] = useState({ firstName: '', lastName: '', phone: '', email: '', date: '', doctor: '', department: '', notes: '' });
    const [bookingStatus, setBookingStatus] = useState({ loading: false, success: false, message: '' });
    const [contact, setContact] = useState({ name: '', email: '', phone: '', message: '' });
    const [contactStatus, setContactStatus] = useState({ loading: false, success: false });

    const handleBook = async (e) => {
        e.preventDefault();
        setBookingStatus({ loading: true, success: false, message: '' });
        try {
            const res = await fetch(`/api/hospital/${slug}/book`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(booking)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to book appointment');
            setBookingStatus({ loading: false, success: true, message: data.message || 'Appointment requested successfully' });
            setBooking({ firstName: '', lastName: '', phone: '', email: '', date: '', doctor: '', department: '', notes: '' });
        } catch (err) {
            setBookingStatus({ loading: false, success: false, message: err.message });
        }
    };

    const handleContact = (e) => {
        e.preventDefault();
        setContactStatus({ loading: true, success: false });
        setTimeout(() => {
            setContactStatus({ loading: false, success: true });
            setContact({ name: '', email: '', phone: '', message: '' });
            setTimeout(() => setContactStatus(s => ({ ...s, success: false })), 3000);
        }, 1200);
    };

    useEffect(() => {
        if (!slug) return;
        fetch(`/api/hospital/${slug}`)
            .then(r => { if (r.status === 404) { setNotFound(true); return null; } return r.json(); })
            .then(d => { if (d) setTenant(d.tenant); })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [slug]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', fontFamily: "'Inter', sans-serif", background: '#F8FAFC' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg,#10B981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
                <HeartPulse size={28} color="#fff" />
            </div>
            <Loader2 size={24} color="#10B981" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#64748B', fontSize: '14px' }}>Loading hospital portal…</p>
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    if (notFound || !tenant) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', fontFamily: "'Inter', sans-serif", background: '#F8FAFC' }}>
            <HeartPulse size={56} color="#CBD5E1" />
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A' }}>Hospital Not Found</h1>
            <p style={{ color: '#64748B', fontSize: '15px' }}>No hospital registered as <strong>&quot;{slug}&quot;</strong>.</p>
            <Link href="/" style={{ marginTop: '8px', padding: '11px 24px', background: '#10B981', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
                Back to Nexora Health
            </Link>
        </div>
    );

    if (tenant.status === 'Suspended') return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', fontFamily: "'Inter', sans-serif", background: '#FEF2F2', padding: '24px' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={36} color="#EF4444" />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A' }}>Service Temporarily Unavailable</h1>
            <p style={{ color: '#64748B', fontSize: '15px', textAlign: 'center', maxWidth: '420px', lineHeight: 1.6 }}>
                The portal for <strong>{tenant.name}</strong> is currently suspended. Please contact the hospital administration directly.
            </p>
            <Link href="/" style={{ marginTop: '8px', padding: '11px 24px', background: '#EF4444', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Back to Nexora Health</Link>
        </div>
    );

    const c = tenant.primaryColor || '#10B981';
    const stats = [
        { value: `${(tenant._count?.patients || 0)}+`, label: 'Patients Served', icon: Users },
        { value: `${(tenant._count?.users || 0)}+`, label: 'Specialist Staff', icon: Stethoscope },
        { value: `${(tenant._count?.appointments || 0)}+`, label: 'Appointments', icon: CalendarDays },
        { value: '24/7', label: 'Emergency Care', icon: Shield },
    ];

    const activeServices = tenant.servicesContent
        ? tenant.servicesContent.split(',').map(s => {
            const trimmed = s.trim();
            const existing = SERVICES.find(x => x.name.toLowerCase() === trimmed.toLowerCase());
            return existing || { icon: Activity, name: trimmed, desc: 'Specialised consulting & advanced medical care.' };
        })
        : SERVICES;

    const heroStyle = tenant.heroImage
        ? { backgroundImage: `url(${tenant.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {};

    return (
        <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: '#0F172A', overflowX: 'hidden' }}>

            {/* ─── STICKY NAV ─────────────────────────────────────────────── */}
            <nav style={{
                background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.0)',
                borderBottom: scrolled ? '1px solid #E2E8F0' : '1px solid transparent',
                backdropFilter: scrolled ? 'blur(16px)' : 'none',
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
                transition: 'all 0.3s ease',
                boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <HospitalLogo tenant={tenant} size={42} />
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '15px', color: scrolled ? '#0F172A' : '#FFFFFF', lineHeight: 1.2 }}>{tenant.name}</div>
                            <div style={{ fontSize: '11px', color: scrolled ? '#94A3B8' : 'rgba(255,255,255,0.6)' }}>Powered by Nexora Health</div>
                        </div>
                    </div>

                    <div className="hosp-nav-links" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                        {['Services', 'Doctors', 'About', 'FAQ', 'Contact'].map(l => (
                            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: '14px', fontWeight: 500, color: scrolled ? '#475569' : 'rgba(255,255,255,0.85)', textDecoration: 'none', transition: 'color 0.2s' }}
                                onMouseOver={e => e.currentTarget.style.color = c}
                                onMouseOut={e => e.currentTarget.style.color = scrolled ? '#475569' : 'rgba(255,255,255,0.85)'}>{l}</a>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <a href="#" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }} style={{ padding: '10px 22px', background: c, color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '7px', boxShadow: `0 4px 14px ${c}50`, transition: 'transform 0.2s' }}
                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <CalendarDays size={14} /> Book Appointment
                        </a>
                        <button onClick={() => setMenuOpen(!menuOpen)} className="hosp-hamburger" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'none' }}>
                            {menuOpen ? <X size={22} color={scrolled ? '#0F172A' : '#fff'} /> : <Menu size={22} color={scrolled ? '#0F172A' : '#fff'} />}
                        </button>
                    </div>
                </div>

                {menuOpen && (
                    <div style={{ background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(16px)', borderTop: '1px solid #F1F5F9', padding: '16px 28px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {['Services', 'Doctors', 'About', 'FAQ', 'Contact'].map(l => (
                            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                                style={{ fontSize: '15px', fontWeight: 600, color: '#334155', textDecoration: 'none' }}>{l}</a>
                        ))}
                        <button onClick={(e) => { e.preventDefault(); setMenuOpen(false); setIsModalOpen(true); }} style={{ marginTop: '4px', padding: '12px', background: c, color: '#fff', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: 700, textAlign: 'center', cursor: 'pointer' }}>
                            Book Appointment
                        </button>
                    </div>
                )}
            </nav>

            {/* ─── HERO ───────────────────────────────────────────────────── */}
            <section ref={heroRef} style={{
                position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center',
                overflow: 'hidden', padding: '100px 28px 80px',
                ...heroStyle,
            }}>
                {/* Overlay */}
                <div style={{
                    position: 'absolute', inset: 0, background: tenant.heroImage
                        ? `linear-gradient(135deg, rgba(10,20,40,0.88) 0%, rgba(10,20,40,0.55) 60%, rgba(10,20,40,0.4) 100%)`
                        : `linear-gradient(135deg, #0A1628 0%, #0F2D4A 40%, ${c}cc 100%)`,
                    pointerEvents: 'none'
                }} />

                {/* Decorative dots */}
                {!tenant.heroImage && (
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none' }} />
                )}

                {/* Glow orbs */}
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '480px', height: '480px', borderRadius: '50%', background: `${c}20`, filter: 'blur(80px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '360px', height: '360px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', filter: 'blur(60px)', pointerEvents: 'none' }} />

                <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                    {/* Left: Content */}
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '7px 16px', fontSize: '12px', fontWeight: 600, color: '#fff', marginBottom: '32px', backdropFilter: 'blur(8px)' }}>
                            <HeartPulse size={13} style={{ color: c }} />
                            <span>{tenant._count?.patients || 0} patients served · Est. {new Date(tenant.createdAt).getFullYear()}</span>
                        </div>

                        <h1 style={{ fontSize: 'clamp(36px, 5vw, 62px)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.06, letterSpacing: '-0.03em', marginBottom: '20px' }}>
                            {tenant.tagline ? (
                                <>{tenant.tagline}</>
                            ) : (
                                <>Your Health,<br /><span style={{ color: c }}>Our Priority</span></>
                            )}
                        </h1>

                        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, marginBottom: '36px', maxWidth: '500px' }}>
                            {tenant.description || `${tenant.name} delivers world-class, compassionate healthcare with the latest technology — making quality medical care accessible to every patient.`}
                        </p>

                        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                            <a href="#" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', color: '#0A1628', padding: '15px 30px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', textDecoration: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', transition: 'transform 0.2s' }}
                                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                <CalendarDays size={16} style={{ color: c }} /> Book Appointment
                                <ArrowRight size={15} />
                            </a>
                            {tenant.phone && (
                                <a href={`tel:${tenant.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', color: '#FFFFFF', padding: '15px 26px', borderRadius: '10px', fontWeight: 600, fontSize: '15px', textDecoration: 'none', backdropFilter: 'blur(8px)', transition: 'transform 0.2s' }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                    <Phone size={15} /> {tenant.phone}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right: Floating info cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} className="hosp-hero-cards">
                        {[
                            { icon: Shield, label: 'NABH Accredited', sub: 'National Accreditation Board for Hospitals', bg: '#10B98120', iconColor: '#10B981' },
                            { icon: Activity, label: 'Emergency Always Open', sub: '24 × 7 Trauma, ICU & Emergency Care', bg: '#EF444420', iconColor: '#EF4444' },
                            { icon: Award, label: 'Top-Rated Specialists', sub: 'Doctors with 10–25 years of domain expertise', bg: `${c}20`, iconColor: c },
                            { icon: Globe, label: 'Digital Health Ecosystem', sub: 'Paperless records, online booking & teleconsult', bg: '#3B82F620', iconColor: '#3B82F6' },
                        ].map((card, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '14px', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'transform 0.2s' }}
                                onMouseOver={e => e.currentTarget.style.transform = 'translateX(4px)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'translateX(0)'}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <card.icon size={20} style={{ color: card.iconColor }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '3px' }}>{card.label}</div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.62)', lineHeight: 1.4 }}>{card.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll cue */}
                <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', zIndex: 2 }}
                    onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Scroll to explore</span>
                    <ChevronDown size={18} color="rgba(255,255,255,0.45)" style={{ animation: 'bounce 2s infinite' }} />
                </div>
            </section>

            {/* ─── STATS BAND ─────────────────────────────────────────────── */}
            <section id="stats" style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 28px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }} className="hosp-stats-grid">
                    {stats.map(({ value, label, icon: Icon }, i) => (
                        <div key={label} style={{ padding: '36px 20px', textAlign: 'center', borderRight: i < 3 ? '1px solid #F1F5F9' : 'none', position: 'relative' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${c}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                                <Icon size={22} style={{ color: c }} />
                            </div>
                            <div style={{ fontSize: '34px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
                            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '6px', fontWeight: 500 }}>{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── SERVICES ───────────────────────────────────────────────── */}
            <section id="services" style={{ padding: '96px 28px', background: '#F8FAFC' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: `${c}12`, border: `1px solid ${c}30`, borderRadius: '100px', padding: '6px 16px', fontSize: '12px', fontWeight: 700, color: c, marginBottom: '18px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            <Heart size={12} /> Our Services
                        </div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.025em', marginBottom: '14px' }}>Specialised Medical Services</h2>
                        <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '520px', margin: '0 auto', lineHeight: 1.65 }}>
                            Comprehensive multispeciality care delivered by experienced specialists using cutting-edge technology.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '20px' }}>
                        {activeServices.map(({ icon: Icon, name, desc }) => (
                            <div key={name}
                                style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px', transition: 'all 0.25s ease', cursor: 'default', position: 'relative', overflow: 'hidden' }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 12px 32px ${c}18`; e.currentTarget.style.borderColor = `${c}45`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: `${c}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                                    <Icon size={24} style={{ color: c }} />
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '9px' }}>{name}</h3>
                                <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                                <div style={{ position: 'absolute', bottom: '20px', right: '20px', opacity: 0.08 }}>
                                    <Icon size={48} style={{ color: c }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── WHY US ─────────────────────────────────────────────────── */}
            <section id="about" className="hosp-why-section-anim" style={{ padding: '96px 28px', position: 'relative', overflow: 'hidden' }}>
                <style>{`
                    .hosp-why-section-anim {
                        background-color: color-mix(in srgb, ${c}, black 75%);
                        background-image: radial-gradient(circle, ${c}10 0%, ${c} 100%);
                        background-size: 200% 200%;
                        animation: pulseBg 15s ease-in-out infinite alternate;
                    }
                    @keyframes pulseBg {
                        0%   { background-position: 0% 0%; }
                        100% { background-position: 100% 100%; }
                    }
                `}</style>
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: `rgba(255,255,255,0.05)`, filter: 'blur(100px)', pointerEvents: 'none' }} />
                <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '6px 16px', fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '18px', letterSpacing: '0.04em', textTransform: 'uppercase', backdropFilter: 'blur(8px)' }}>
                            <Star size={12} /> Why Choose Us
                        </div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.025em', marginBottom: '14px' }}>Why Choose {tenant.name}?</h2>
                        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.62)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.65 }}>
                            Excellence, compassion and technology — every step of your healthcare journey.
                        </p>
                    </div>

                    <div className={WHY_US.length === 6 ? "hosp-why-grid-6" : "hosp-why-grid"} style={{ gap: '18px' }}>
                        {WHY_US.map(({ title, desc }) => (
                            <div key={title}
                                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: '16px', padding: '26px', backdropFilter: 'blur(8px)', transition: 'all 0.25s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <CheckCircle size={16} style={{ color: c }} />
                                    </div>
                                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>{title}</span>
                                </div>
                                <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── DOCTORS ────────────────────────────────────────────────── */}
            <section id="doctors" style={{ padding: '96px 28px', background: '#FFFFFF' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: `${c}12`, border: `1px solid ${c}30`, borderRadius: '100px', padding: '6px 16px', fontSize: '12px', fontWeight: 700, color: c, marginBottom: '18px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            <Stethoscope size={12} /> Our Team
                        </div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.025em', marginBottom: '14px' }}>Our Medical Specialists</h2>
                        <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '480px', margin: '0 auto', lineHeight: 1.65 }}>
                            Expert clinicians dedicated to delivering evidence-based, personalised care.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                        {DOCTORS.map((d, i) => (
                            <div key={i}
                                style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '32px 28px', transition: 'all 0.25s ease', overflow: 'hidden', position: 'relative' }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 12px 32px ${c}20`; e.currentTarget.style.borderColor = `${c}45`; e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.transform = 'translateY(0)'; }}>

                                {/* Specialty Icon Block — no images */}
                                <div style={{ marginBottom: '22px' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: `linear-gradient(135deg, ${d.color}20, ${d.color}10)`, border: `1px solid ${d.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                                        <Stethoscope size={28} style={{ color: d.color }} />
                                    </div>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: `${d.color}12`, borderRadius: '100px', padding: '4px 12px' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: d.color }} />
                                        <span style={{ fontSize: '12px', fontWeight: 700, color: d.color }}>{d.dept}</span>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '18px' }}>
                                    <div style={{ fontSize: '14px', color: '#475569', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Award size={14} style={{ color: '#F59E0B', flexShrink: 0 }} />
                                        {d.exp} of clinical experience
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CalendarDays size={14} style={{ color: c, flexShrink: 0 }} />
                                        Available: {d.avail}
                                    </div>
                                </div>

                                {/* Status chip */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '18px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 0 3px rgba(16,185,129,0.2)' }} />
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#10B981' }}>Accepting new patients</span>
                                </div>

                                <a href="#" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px', background: `${c}12`, color: c, borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: 700, transition: 'all 0.2s', border: `1px solid ${c}25` }}
                                    onMouseOver={e => { e.currentTarget.style.background = c; e.currentTarget.style.color = '#fff'; }}
                                    onMouseOut={e => { e.currentTarget.style.background = `${c}12`; e.currentTarget.style.color = c; }}>
                                    Book Consultation <ChevronRight size={14} />
                                </a>
                            </div>
                        ))}
                    </div>

                    <p style={{ textAlign: 'center', fontSize: '13px', color: '#94A3B8', marginTop: '28px' }}>
                        Our team grows as the hospital grows. Login to see all available specialists.
                    </p>
                </div>
            </section>

            {/* ─── BOOK APPOINTMENT MODAL ────────────────────────────────────────────── */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', padding: '20px' }}>
                    <div style={{ maxWidth: '800px', width: '100%', background: '#FFFFFF', borderRadius: '24px', padding: '44px 48px', boxShadow: '0 24px 64px rgba(0,0,0,0.15)', border: '1px solid #E2E8F0', position: 'relative', overflowY: 'auto', maxHeight: '90vh' }}>

                        <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '24px', right: '28px', background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#F1F5F9'} onMouseOut={e => e.currentTarget.style.background = 'none'}>
                            <X size={24} />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: `${c}12`, border: `1px solid ${c}30`, borderRadius: '100px', padding: '6px 16px', fontSize: '12px', fontWeight: 700, color: c, marginBottom: '14px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                <CalendarDays size={12} /> Book Appointment
                            </div>
                            <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '8px' }}>Request a Consultation</h2>
                            <p style={{ fontSize: '15px', color: '#64748B', margin: 0 }}>Fill out the form below. Your patient profile will be securely created.</p>
                        </div>

                        {bookingStatus.message && (
                            <div style={{ padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '10px', background: bookingStatus.success ? '#ECFDF5' : '#FEF2F2', color: bookingStatus.success ? '#065F46' : '#991B1B', border: `1px solid ${bookingStatus.success ? '#A7F3D0' : '#FECACA'}` }}>
                                {bookingStatus.success ? <CheckCircle size={18} flexShrink={0} /> : <Zap size={18} flexShrink={0} />}
                                {bookingStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleBook} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="hosp-booking-form">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>First Name *</label>
                                <input required type="text" value={booking.firstName} onChange={e => setBooking({ ...booking, firstName: e.target.value })} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', width: '100%', boxSizing: 'border-box' }} placeholder="John" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Last Name</label>
                                <input type="text" value={booking.lastName} onChange={e => setBooking({ ...booking, lastName: e.target.value })} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', width: '100%', boxSizing: 'border-box' }} placeholder="Doe" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Phone Number *</label>
                                <input required type="tel" value={booking.phone} onChange={e => setBooking({ ...booking, phone: e.target.value })} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', width: '100%', boxSizing: 'border-box' }} placeholder="+91 98765 43210" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Email Address *</label>
                                <input required type="email" value={booking.email} onChange={e => setBooking({ ...booking, email: e.target.value })} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', width: '100%', boxSizing: 'border-box' }} placeholder="john@example.com" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Preferred Department</label>
                                <select value={booking.department} onChange={e => setBooking({ ...booking, department: e.target.value })} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', width: '100%', boxSizing: 'border-box', background: '#fff' }}>
                                    <option value="">Select Department...</option>
                                    {activeServices.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Preferred Doctor *</label>
                                <select required value={booking.doctor} onChange={e => setBooking({ ...booking, doctor: e.target.value })} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', width: '100%', boxSizing: 'border-box', background: '#fff' }}>
                                    <option value="">Select Specialist...</option>
                                    {DOCTORS.map(d => <option key={d.dept} value={`${d.dept} Specialist`}>{d.dept} Specialist</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Preferred Date *</label>
                                <input required type="date" value={booking.date} onChange={e => setBooking({ ...booking, date: e.target.value })} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', width: '100%', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Additional Notes / Symptoms</label>
                                <textarea rows={3} value={booking.notes} onChange={e => setBooking({ ...booking, notes: e.target.value })} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', width: '100%', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }} placeholder="Briefly describe your issue..." />
                            </div>
                            <button disabled={bookingStatus.loading} type="submit" style={{ gridColumn: '1 / -1', marginTop: '12px', padding: '16px', background: c, color: '#fff', borderRadius: '12px', border: 'none', fontSize: '15px', fontWeight: 700, cursor: bookingStatus.loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: 'all 0.2s', opacity: bookingStatus.loading ? 0.7 : 1 }}>
                                {bookingStatus.loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <CalendarDays size={18} />}
                                {bookingStatus.loading ? 'Processing...' : 'Confirm Appointment'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ─── FAQ ────────────────────────────────────────────────────── */}
            <section id="faq" style={{ padding: '96px 28px', background: '#FFFFFF' }}>
                <div style={{ maxWidth: '760px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: `${c}12`, border: `1px solid ${c}30`, borderRadius: '100px', padding: '6px 16px', fontSize: '12px', fontWeight: 700, color: c, marginBottom: '18px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            <Zap size={12} /> FAQ
                        </div>
                        <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.025em', marginBottom: '12px' }}>Frequently Asked Questions</h2>
                        <p style={{ fontSize: '15px', color: '#64748B' }}>Everything you need to know before your visit.</p>
                    </div>
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '8px 32px' }}>
                        {FAQS.map(faq => <FaqItem key={faq.q} {...faq} color={c} />)}
                    </div>
                </div>
            </section>

            {/* ─── CONTACT ────────────────────────────────────────────────── */}
            <section id="contact" style={{ padding: '96px 28px', background: '#F8FAFC' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.025em', marginBottom: '14px' }}>Get in Touch</h2>
                        <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '440px', margin: '0 auto', lineHeight: 1.65 }}>We&apos;re here to help — reach out to schedule a visit or ask any questions.</p>
                    </div>

                    <div className="hosp-contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1100px', margin: '0 auto 60px' }}>
                        {/* Map & Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {tenant.mapUrl ? (
                                <div style={{ width: '100%', height: '280px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', background: '#E2E8F0' }}>
                                    <iframe
                                        src={tenant.mapUrl.includes('<iframe') ? (tenant.mapUrl.match(/src="([^"]+)"/) || [])[1] || tenant.mapUrl : (tenant.mapUrl.includes('/place/') && !tenant.mapUrl.includes('/embed') ? tenant.mapUrl.replace('/place/', '/embed/place/') : tenant.mapUrl)}
                                        width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                                    </iframe>
                                </div>
                            ) : (
                                <div style={{ width: '100%', height: '280px', borderRadius: '16px', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', color: '#94A3B8' }}>
                                    <MapPin size={32} />
                                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Map not configured by hospital</span>
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                {[
                                    { icon: Phone, label: 'Call Us', value: tenant.phone || 'Contact via email', href: tenant.phone ? `tel:${tenant.phone}` : '#' },
                                    { icon: Mail, label: 'Email Us', value: tenant.adminEmail, href: `mailto:${tenant.adminEmail}` },
                                    { icon: MapPin, label: 'Visit Us', value: tenant.address || 'Address not listed', href: '#' },
                                    { icon: Clock, label: 'Working Hours', value: '24 × 7 Emergency', href: '#' },
                                ].map(({ icon: Icon, label, value, href }) => (
                                    <a key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '16px', textDecoration: 'none' }}>
                                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${c}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Icon size={18} style={{ color: c }} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</div>
                                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', lineHeight: 1.3 }}>{value}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '36px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>Send us a Message</h3>
                            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '28px' }}>Have a question? Our support team is here to help.</p>

                            {contactStatus.success && (
                                <div style={{ padding: '14px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' }}>
                                    <CheckCircle size={16} /> Message sent! We will contact you shortly.
                                </div>
                            )}

                            <form onSubmit={handleContact} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Your Name *</label>
                                        <input required type="text" value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', fontFamily: 'inherit' }} placeholder="John Doe" />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Phone Number *</label>
                                        <input required type="tel" value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', fontFamily: 'inherit' }} placeholder="+1 234 567 89" />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Email Address *</label>
                                    <input required type="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', fontFamily: 'inherit' }} placeholder="john@example.com" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Your Message *</label>
                                    <textarea required rows={4} value={contact.message} onChange={e => setContact({ ...contact, message: e.target.value })} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit' }} placeholder="How can we help you?" />
                                </div>
                                <button disabled={contactStatus.loading} type="submit" style={{ marginTop: '8px', padding: '14px', background: c, color: '#fff', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: 700, cursor: contactStatus.loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: contactStatus.loading ? 0.7 : 1 }}>
                                    {contactStatus.loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Appointment CTA inline */}
                    <div style={{ background: `linear-gradient(135deg, #0A1628 0%, ${c} 100%)`, borderRadius: '20px', padding: '48px', textAlign: 'center', maxWidth: '700px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none' }} />
                        <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.025em', marginBottom: '12px', position: 'relative' }}>Ready to Book?</h3>
                        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.72)', marginBottom: '28px', lineHeight: 1.65, position: 'relative' }}>
                            Book an appointment online in under 2 minutes. Our care coordinators are ready to assist you.
                        </p>
                        <a href="#" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#FFFFFF', color: '#0A1628', padding: '14px 32px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', textDecoration: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', position: 'relative', transition: 'transform 0.2s' }}
                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <CalendarDays size={16} style={{ color: c }} />
                            Book Appointment Online
                            <ArrowRight size={15} />
                        </a>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ─────────────────────────────────────────────────── */}
            <footer style={{ background: '#0A1628', padding: '56px 28px 32px' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '48px', marginBottom: '48px' }} className="hosp-footer-grid">
                        {/* Brand */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <HospitalLogo tenant={tenant} size={44} />
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#FFFFFF' }}>{tenant.name}</div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Powered by Nexora Health</div>
                                </div>
                            </div>
                            <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, maxWidth: '320px', margin: 0 }}>
                                {tenant.description || `Committed to delivering world-class healthcare with compassion, transparency and the latest medical technology.`}
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>Quick Links</div>
                            {['Services', 'Our Doctors', 'About Us', 'FAQ', 'Contact'].map(l => (
                                <a key={l} href={`#${l.toLowerCase().replace(' ', '')}`} style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', marginBottom: '10px', transition: 'color 0.2s' }}
                                    onMouseOver={e => e.currentTarget.style.color = c}
                                    onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}>{l}</a>
                            ))}
                        </div>

                        {/* Contact */}
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>Contact</div>
                            {tenant.phone && (
                                <a href={`tel:${tenant.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', marginBottom: '10px' }}>
                                    <Phone size={13} style={{ color: c }} /> {tenant.phone}
                                </a>
                            )}
                            <a href={`mailto:${tenant.adminEmail}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', marginBottom: '10px' }}>
                                <Mail size={13} style={{ color: c }} /> {tenant.adminEmail}
                            </a>
                            {tenant.address && (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13.5px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>
                                    <MapPin size={13} style={{ color: c, marginTop: '3px', flexShrink: 0 }} /> {tenant.address}
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.22)', margin: 0 }}>
                            © {new Date().getFullYear()} {tenant.name}. All rights reserved.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.22)', margin: 0 }}>
                                Powered by{' '}
                                <Link href="/" style={{ color: c, textDecoration: 'none', fontWeight: 600 }}>Nexora Health</Link>
                            </p>
                            <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '12px' }}>·</span>
                            <Link href="/login" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}>
                                Staff Login
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* ─── GLOBAL STYLES ────────────────────────────────────────── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                * { box-sizing: border-box; }
                @keyframes spin   { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
                .hosp-nav-links   { display: flex; }
                .hosp-hamburger   { display: none; }
                .hosp-hero-cards  { display: flex; }
                .hosp-stats-grid  { display: grid; grid-template-columns: repeat(4, 1fr); }
                .hosp-steps       { display: grid; grid-template-columns: repeat(3, 1fr); }
                .hosp-why-grid    { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
                .hosp-why-grid-6  { display: grid; grid-template-columns: repeat(3, 1fr); }
                .hosp-footer-grid { grid-template-columns: 2fr 1fr 1fr; }
                @media (max-width: 1024px) {
                    .hosp-hero-cards  { display: none; }
                    .hosp-why-grid-6  { grid-template-columns: repeat(2, 1fr) !important; }
                }
                @media (max-width: 768px) {
                    .hosp-nav-links   { display: none !important; }
                    .hosp-hamburger   { display: flex !important; }
                    .hosp-stats-grid  { grid-template-columns: repeat(2, 1fr) !important; }
                    .hosp-why-grid-6  { grid-template-columns: 1fr !important; }
                    .hosp-steps       { grid-template-columns: 1fr !important; }
                    .hosp-footer-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
                }
                @media (max-width: 480px) {
                    .hosp-stats-grid  { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
