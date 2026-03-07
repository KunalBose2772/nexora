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
                        <a href={`/login?tenant=${slug}`} style={{ padding: '10px 22px', background: c, color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '7px', boxShadow: `0 4px 14px ${c}50`, transition: 'transform 0.2s' }}
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
                        <a href={`/login?tenant=${slug}`} style={{ marginTop: '4px', padding: '12px', background: c, color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 700, textAlign: 'center' }}>
                            Book Appointment
                        </a>
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
                            <a href={`/login?tenant=${slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', color: '#0A1628', padding: '15px 30px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', textDecoration: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', transition: 'transform 0.2s' }}
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
                        {SERVICES.map(({ icon: Icon, name, desc }) => (
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
            <section id="about" style={{ padding: '96px 28px', background: `radial-gradient(circle at 50% -20%, ${c}40 0%, #0A1628 50%, #050B14 100%)`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: `${c}20`, filter: 'blur(100px)', pointerEvents: 'none' }} />
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
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${c}30`, border: `1px solid ${c}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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

                                <a href={`/login?tenant=${slug}`}
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

            {/* ─── PROCESS / HOW IT WORKS ─────────────────────────────────── */}
            <section style={{ padding: '80px 28px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                        <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.025em', marginBottom: '12px' }}>How It Works</h2>
                        <p style={{ fontSize: '15px', color: '#64748B' }}>Book an appointment in 3 simple steps.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="hosp-steps">
                        {[
                            { step: '01', title: 'Register & Login', desc: 'Create your patient account with your mobile number. Takes under 60 seconds.', icon: Users },
                            { step: '02', title: 'Choose & Book', desc: 'Pick your specialist, select a preferred date and time slot. Confirm instantly.', icon: CalendarDays },
                            { step: '03', title: 'Visit or Teleconsult', desc: 'Walk in at your scheduled time or join a video consult from anywhere.', icon: HeartPulse },
                        ].map(({ step, title, desc, icon: Icon }) => (
                            <div key={step} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '32px 26px', position: 'relative', textAlign: 'center' }}>
                                <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%) translateY(-50%)', background: c, color: '#fff', fontWeight: 900, fontSize: '11px', padding: '4px 12px', borderRadius: '100px', letterSpacing: '0.05em' }}>{step}</div>
                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${c}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '16px auto 18px' }}>
                                    <Icon size={26} style={{ color: c }} />
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>{title}</h3>
                                <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(236px, 1fr))', gap: '18px', maxWidth: '960px', margin: '0 auto 48px' }}>
                        {[
                            { icon: Phone, label: 'Call Us', value: tenant.phone || 'Contact via email', href: tenant.phone ? `tel:${tenant.phone}` : '#', sub: 'Available 24/7 for emergencies' },
                            { icon: Mail, label: 'Email Us', value: tenant.adminEmail, href: `mailto:${tenant.adminEmail}`, sub: 'We reply within 24 hours' },
                            { icon: MapPin, label: 'Visit Us', value: tenant.address || 'Address not listed', href: '#', sub: 'OPD: 8 AM – 8 PM daily' },
                            { icon: Clock, label: 'Working Hours', value: 'OPD: 8 AM – 8 PM', href: '#', sub: 'Emergency: 24 × 7 always open' },
                        ].map(({ icon: Icon, label, value, href, sub }) => (
                            <a key={label} href={href}
                                style={{ display: 'block', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '26px', textDecoration: 'none', transition: 'all 0.25s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = `${c}50`; e.currentTarget.style.boxShadow = `0 8px 24px ${c}14`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                <div style={{ width: '46px', height: '46px', borderRadius: '13px', background: `${c}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                                    <Icon size={20} style={{ color: c }} />
                                </div>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>{label}</div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', lineHeight: 1.45, marginBottom: '5px' }}>{value}</div>
                                <div style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.5 }}>{sub}</div>
                            </a>
                        ))}
                    </div>

                    {/* Appointment CTA inline */}
                    <div style={{ background: `linear-gradient(135deg, #0A1628 0%, ${c} 100%)`, borderRadius: '20px', padding: '48px', textAlign: 'center', maxWidth: '700px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none' }} />
                        <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.025em', marginBottom: '12px', position: 'relative' }}>Ready to Book?</h3>
                        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.72)', marginBottom: '28px', lineHeight: 1.65, position: 'relative' }}>
                            Book an appointment online in under 2 minutes. Our care coordinators are ready to assist you.
                        </p>
                        <a href={`/login?tenant=${slug}`}
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
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.22)', margin: 0 }}>
                            Powered by{' '}
                            <Link href="/" style={{ color: c, textDecoration: 'none', fontWeight: 600 }}>Nexora Health</Link>
                        </p>
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
