'use client';

import Image from 'next/image';
import Link from 'next/link';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Globe,
  Lock,
  Cpu,
  Users,
  Activity,
  Database,
  BarChart3,
  Building2,
  FlaskConical,
  Pill,
  Receipt,
  CalendarDays,
  BedDouble,
  UserCog,
  Stethoscope,
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
  Zap,
  ShieldCheck,
  Server,
  FileText,
  HeartPulse,
  Layers,
  Phone,
  MapPin,
  MessageCircle,
  Sparkles,
  Mail,
} from 'lucide-react';

/* ── metadata is defined in root layout.js for SEO ── */

/* ─────────────────────── DATA ─────────────────────── */

const MODULES = [
  { icon: Users, name: 'Patient Management (EMR)', desc: 'Unique Patient IDs, full demographic profiles, allergies, chronic conditions, ICD-10 coding, SOAP notes, S3 document uploads, and complete audit trails for every record access.' },
  { icon: CalendarDays, name: 'Appointment & OPD', desc: 'Doctor calendar, online booking, walk-in registration, token system, consultation workflow, prescription builder, diagnosis, and follow-up scheduling in one seamless workflow.' },
  { icon: BedDouble, name: 'IPD & Ward Management', desc: 'Full inpatient admission workflow, bed allocation engine, ward and floor management, nursing notes, discharge summaries, and real-time bed occupancy dashboard.' },
  { icon: FlaskConical, name: 'Laboratory Module', desc: 'Test catalogue, sample collection tracking, result entry with reference range automation, PDF report generation, barcode-ready labels, and doctor-level result access control.' },
  { icon: Pill, name: 'Pharmacy Management', desc: 'Inventory management, batch tracking, expiry alerts, supplier management, purchase orders, GST-compliant billing, and prescription auto-dispensing from OPD visits.' },
  { icon: Receipt, name: 'Billing & Finance', desc: 'OPD and IPD billing, insurance claim support, refund workflows, revenue reports, GST export, Razorpay and Stripe payment integration, and complete financial audit trail.' },
  { icon: UserCog, name: 'HR & Staff Management', desc: 'Role-based access control, staff attendance, shift scheduling, leave management, payroll computation, and department-wise staff capacity planning.' },
  { icon: BarChart3, name: 'Analytics & Reports', desc: 'Real-time revenue dashboards, patient growth analytics, department revenue breakdown, bed occupancy trends, doctor performance metrics, and exportable financial reports.' },
  { icon: Building2, name: 'Multi-Branch Control', desc: 'Manage unlimited hospital branches under one tenant account. Centralised reporting, independent branch operations, cross-branch patient lookup, and unified billing.' },
  { icon: Globe, name: 'Hospital CMS & Website', desc: 'Editable public hospital landing page per tenant. Manage about, services, doctors, testimonials, gallery, contact page, and SEO metadata — all without a developer.' },
  { icon: Shield, name: 'Security & Compliance', desc: 'RBAC middleware, JWT + Refresh token, bcrypt hashing, AES-256 encryption for sensitive fields, HTTPS-only, daily database backups, and per-tenant S3 isolation.' },
  { icon: Layers, name: 'Super Admin SaaS Control', desc: 'Full tenant onboarding wizard, database provisioning automation, plan assignment, subscription tracking, feature toggles, reseller management, and system-level logs.' },
];

const STATS = [
  { value: '1,000+', label: 'Hospitals Onboarded', icon: Building2 },
  { value: '10,000+', label: 'Concurrent Users', icon: Users },
  { value: '99.9%', label: 'Uptime SLA', icon: Activity },
  { value: '<2s', label: 'Dashboard Load Time', icon: Zap },
  { value: '5M+', label: 'Patient Records Managed', icon: FileText },
  { value: '300ms', label: 'Avg. API Response', icon: Clock },
];

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '₹4,999',
    period: '/month',
    desc: 'For small clinics and single-doctor practices.',
    features: [
      'Up to 5 users',
      '1 branch',
      'OPD + Appointment module',
      'Basic billing & invoicing',
      'Patient EMR',
      'Email support',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹12,999',
    period: '/month',
    desc: 'For mid-size hospitals with multiple departments.',
    features: [
      'Up to 30 users',
      '3 branches',
      'OPD + IPD + Lab + Pharmacy',
      'GST-compliant billing & reports',
      'Priority support',
      'Hospital CMS & public website',
      'Analytics dashboard',
      'HR & attendance module',
    ],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For hospital chains and large healthcare networks.',
    features: [
      'Unlimited users & branches',
      'All modules included',
      'Custom integrations & API access',
      'Dedicated account manager',
      'SLA guarantee with credits',
      '24/7 priority support',
      'On-premise deployment option',
      'Custom reporting & BI',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
];

const TESTIMONIALS = [
  {
    name: 'Dr. Rajesh Mehta',
    title: 'Medical Director, Apex Multispeciality Hospital, Ranchi',
    content: 'Nexora Health transformed how we manage our 3 branches across Jharkhand. The bed occupancy dashboard and lab integration alone saved us 4 hours of manual work every day. Our billing accuracy improved by 94%.',
    rating: 5,
  },
  {
    name: 'Ms. Priya Nair',
    title: 'IT Head, MediCare Hospital Group, Kochi',
    content: 'We evaluated 6 HMS vendors before choosing Nexora Health. The database-per-tenant architecture gave our compliance team confidence on patient data isolation. Onboarding was completed in under 2 days.',
    rating: 5,
  },
  {
    name: 'Dr. Suresh Sharma',
    title: 'CEO, HealthFirst Clinics, Delhi NCR',
    content: 'Running 12 clinics from one dashboard is something no other system offered us at this price point. The multi-branch reporting and centralized pharmacy inventory control is exactly what we needed.',
    rating: 5,
  },
];

const TRUST = [
  { icon: Lock, label: 'HIPAA-Aligned Data Handling' },
  { icon: Globe, label: 'Pan-India GST Compliance' },
  { icon: Cpu, label: 'AWS-Hosted with 99.9% SLA' },
  { icon: Server, label: 'Database-Per-Tenant Isolation' },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Patient Registration',
    desc: 'Receptionist registers patient with demographics, insurance, and emergency contact. Unique Patient ID is auto-generated (e.g., NXR-2026-00001).',
  },
  {
    step: '02',
    title: 'Appointment & OPD Consultation',
    desc: 'Doctor reviews EMR, records vitals, SOAP notes, ICD-10 diagnosis, and generates prescriptions in a single workflow.',
  },
  {
    step: '03',
    title: 'Lab & Pharmacy Orders',
    desc: 'Lab requests and prescriptions flow directly to respective departments. Track sample collection, processing, and report delivery in real time.',
  },
  {
    step: '04',
    title: 'Billing & Discharge',
    desc: 'Consolidated GST-compliant invoice is generated covering OPD, lab, pharmacy, and procedures. Payment via UPI, card, cash, or insurance.',
  },
];

const FAQS = [
  {
    q: 'Is Nexora Health hosted on a shared database or does each hospital get separate data?',
    a: 'Every hospital (tenant) gets a completely separate PostgreSQL database. There is zero shared data between tenants. This ensures the highest level of data isolation, compliance, and security.',
  },
  {
    q: 'Can Nexora Health handle multiple branches of the same hospital?',
    a: 'Yes. The Pro and Enterprise plans support multi-branch operations. Each branch has independent operations, staff, and inventory, while the hospital admin gets a unified view across all branches.',
  },
  {
    q: 'Does Nexora Health support GST-compliant billing?',
    a: 'Yes. The billing module is fully GST-compliant. It supports CGST, SGST, and IGST computations, HSN codes for pharmacy, and generates GST-ready invoices and export reports.',
  },
  {
    q: 'How long does onboarding take?',
    a: 'Standard onboarding — including database provisioning, staff user creation, module configuration, and basic training — takes 24 to 48 hours. Enterprise deployments with custom configurations take 5 to 7 business days.',
  },
  {
    q: 'Is patient data backed up? What is the recovery time objective?',
    a: 'Yes. All tenant databases are backed up daily to AWS S3 with point-in-time recovery. The Recovery Time Objective (RTO) is under 4 hours. Backup retention is 30 days on standard plans.',
  },
  {
    q: 'Can we integrate Nexora Health with our existing lab equipment or third-party systems?',
    a: 'Enterprise plans include full REST API access and webhook support for integration with third-party systems, lab analyzers, and diagnostic machines. Contact sales for a custom integration assessment.',
  },
];

/* ─────────────────────── COMPONENTS ─────────────────────── */

function StarRating({ count }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} fill="#F59E0B" stroke="none" aria-hidden="true" />
      ))}
    </div>
  );
}

/* ─────────────────────── PAGE ─────────────────────── */

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: '#0F172A' }}>

      {/* ══════════════════════════════════════
          TOP NAVIGATION BAR
      ══════════════════════════════════════ */}
      <PublicHeader />

      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section
        aria-label="Hero — Nexora Health Enterprise Hospital Management System"
        style={{
          position: 'relative',
          background: '#071220',
          minHeight: 'calc(100vh - 6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '20px 48px 12px',
        }}
      >
        {/* Background radial glow */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '600px',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(0,194,255,0.15) 0%, rgba(10,46,77,0.1) 60%, transparent 80%)',
          pointerEvents: 'none',
        }} />
        {/* Dot grid overlay */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '1480px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>

          <div style={{ maxWidth: '960px', textAlign: 'center', marginBottom: 'auto', marginTop: 'auto' }}>
            {/* Category pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0,194,255,0.08)',
              border: '1px solid rgba(0,194,255,0.20)',
              borderRadius: '100px',
              padding: '5px 16px',
              fontSize: '12px',
              fontWeight: 500,
              color: '#00C2FF',
              marginBottom: '32px',
              letterSpacing: '0.04em',
            }}>
              <HeartPulse size={13} strokeWidth={1.5} aria-hidden="true" />
              Pan-India Multi-Tenant SaaS Hospital ERP
            </div>

            <h1 style={{
              fontSize: '56px',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.10,
              letterSpacing: '-0.03em',
              marginBottom: '24px',
            }}>
              One Platform.
              <br />
              <span style={{
                background: 'linear-gradient(90deg, #00C2FF 0%, #4DD9FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Every Hospital Module.
              </span>
            </h1>

            <p style={{
              fontSize: '18px',
              color: 'rgba(255,255,255,0.58)',
              lineHeight: 1.75,
              maxWidth: '680px',
              margin: '0 auto 48px',
            }}>
              Nexora Health is India's most comprehensive multi-tenant SaaS Hospital ERP — managing patients,
              appointments, IPD, laboratory, pharmacy, billing, HR, and your hospital website, all from a
              single enterprise-grade platform.
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#00C2FF', color: '#071220', fontWeight: 700,
                fontSize: '15px', padding: '14px 32px', borderRadius: '10px',
                textDecoration: 'none', transition: 'all 150ms',
                boxShadow: '0 0 32px rgba(0,194,255,0.25)',
              }}>
                Start Free Trial
                <ArrowRight size={16} strokeWidth={2.5} aria-hidden="true" />
              </Link>
              <Link href="#modules" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)',
                color: 'rgba(255,255,255,0.85)', fontWeight: 500,
                fontSize: '15px', padding: '14px 32px', borderRadius: '10px',
                textDecoration: 'none', transition: 'all 150ms',
              }}>
                Explore All Modules
                <ChevronRight size={16} strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Stats bar - Uses full 1480px width to fit 6 columns gracefully */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '0',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            paddingTop: '32px',
            marginTop: '40px',
            width: '100%',
          }}>
            {STATS.map(({ value, label, icon: Icon }, i) => (
              <div
                key={label}
                style={{
                  textAlign: 'center',
                  padding: '0 16px',
                  borderRight: i < 5 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                  <Icon size={16} strokeWidth={1.5} style={{ color: '#00C2FF' }} aria-hidden="true" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                  {value}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', marginTop: '4px', lineHeight: 1.4 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRUST STRIP
      ══════════════════════════════════════ */}
      <section
        aria-label="Security and compliance certifications"
        style={{
          background: '#FFFFFF',
          borderTop: '1px solid rgba(0,0,0,0.04)',
          borderBottom: '1px solid rgba(0,0,0,0.04)',
          padding: '12px 48px',
        }}
      >
        <div style={{
          maxWidth: '1480px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap',
        }}>
          {TRUST.map(({ icon: Icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap' }}>
              <div style={{ padding: '6px', background: '#F8FAFC', borderRadius: '8px' }}>
                <Icon size={16} strokeWidth={1.5} style={{ color: '#0A2E4D' }} aria-hidden="true" />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', letterSpacing: '0.01em' }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          ALL MODULES
      ══════════════════════════════════════ */}
      <section id="modules" aria-label="All hospital management modules" style={{ padding: '40px 48px', background: '#F4F9FF' }}>
        <div style={{ maxWidth: '1480px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#FFFFFF', border: '1px solid #E2E8F0',
              borderRadius: '100px', padding: '6px 16px',
              fontSize: '12.5px', fontWeight: 600, color: '#0A2E4D',
              marginBottom: '20px', letterSpacing: '0.02em',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}>
              <Layers size={14} strokeWidth={1.5} aria-hidden="true" style={{ color: '#00C2FF' }} />
              12 Integrated Clinical Modules
            </div>
            <h2 style={{ fontSize: '42px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '16px' }}>
              Everything Your Hospital Needs
            </h2>
            <p style={{ fontSize: '17px', color: '#64748B', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
              From the moment a patient walks in to the day they are discharged — every clinical, financial,
              and administrative process in one fully integrated platform.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px',
          }}>
            {MODULES.map(({ icon: Icon, name, desc }) => (
              <article
                key={name}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(15, 23, 42, 0.04)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                  borderRadius: '16px',
                  padding: '32px',
                  transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.border = '1px solid rgba(0,194,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.03)';
                  e.currentTarget.style.border = '1px solid rgba(15, 23, 42, 0.04)';
                }}
              >
                {/* Decorative background accent */}
                <div style={{
                  position: 'absolute',
                  top: 0, right: 0,
                  width: '100px', height: '100px',
                  background: 'radial-gradient(circle at top right, rgba(0,194,255,0.08) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />

                <div style={{
                  width: '48px', height: '48px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                  color: '#0A2E4D',
                }} aria-hidden="true">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>{name}</h3>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section >

      {/* ══════════════════════════════════════
          WORKFLOW / HOW IT WORKS
      ══════════════════════════════════════ */}
      <section id="workflow" aria-label="How Nexora Health works" style={{ position: 'relative', padding: '50px 48px', background: '#FAFCFF', overflow: 'hidden' }}>
        {/* Beautiful Dotted Grid Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(0, 194, 255, 0.15) 2px, transparent 2px)',
          backgroundSize: '36px 36px',
          maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          pointerEvents: 'none',
        }} aria-hidden="true" />

        {/* Dynamic Glows */}
        <div style={{
          position: 'absolute', top: '10%', left: '-10%', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(0, 194, 255, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(40px)'
        }} aria-hidden="true" />
        <div style={{
          position: 'absolute', bottom: '10%', right: '-10%', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(0, 194, 255, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(40px)'
        }} aria-hidden="true" />

        <div style={{ maxWidth: '1480px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#FFFFFF', border: '1px solid #E2E8F0',
              borderRadius: '100px', padding: '6px 16px',
              fontSize: '12.5px', fontWeight: 600, color: '#0A2E4D',
              marginBottom: '20px', letterSpacing: '0.02em',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}>
              <HeartPulse size={14} strokeWidth={1.5} aria-hidden="true" style={{ color: '#00C2FF' }} />
              Seamless Operational Flow
            </div>
            <h2 style={{ fontSize: '46px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '18px' }}>
              A Complete Patient Journey
            </h2>
            <p style={{ fontSize: '18px', color: '#64748B', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
              Every step of the clinical workflow is connected. Drop the manual hand-offs, paperwork, and data silos with our fully integrated platform.
            </p>
          </div>

          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '28px' }}>
            {WORKFLOW_STEPS.map(({ step, title, desc }, i) => (
              <article
                key={step}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(15, 23, 42, 0.06)',
                  borderRadius: '24px',
                  padding: '40px 32px',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.02)',
                  transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 24px 48px -12px rgba(0, 194, 255, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(0,194,255,0.4)';

                  const num = e.currentTarget.querySelector('.step-num');
                  if (num) {
                    num.style.color = '#00C2FF';
                    num.style.transform = 'translateX(5px)';
                  }
                  const line = e.currentTarget.querySelector('.step-line');
                  if (line) {
                    line.style.background = 'linear-gradient(90deg, #00C2FF, transparent)';
                    line.style.opacity = '1';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.06)';

                  const num = e.currentTarget.querySelector('.step-num');
                  if (num) {
                    num.style.color = '#E2E8F0';
                    num.style.transform = 'translateX(0)';
                  }
                  const line = e.currentTarget.querySelector('.step-line');
                  if (line) {
                    line.style.background = '#E2E8F0';
                    line.style.opacity = '0.5';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
                  <span className="step-num" style={{
                    fontSize: '56px', fontWeight: 900, color: '#E2E8F0',
                    letterSpacing: '-0.05em', lineHeight: 1, transition: 'all 300ms',
                    fontFamily: 'system-ui, sans-serif'
                  }}>
                    {step}
                  </span>
                  {i < WORKFLOW_STEPS.length - 1 && (
                    <div className="step-line" style={{
                      flex: 1, height: '2px', background: '#E2E8F0', marginLeft: '20px',
                      borderRadius: '2px', opacity: 0.5, transition: 'all 300ms'
                    }} aria-hidden="true"></div>
                  )}
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#0F172A', marginBottom: '14px', lineHeight: 1.3 }}>{title}</h3>
                <p style={{ fontSize: '14.5px', color: '#64748B', lineHeight: 1.70 }}>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECURITY HIGHLIGHT
      ══════════════════════════════════════ */}
      <section aria-label="Hospital Data Security" style={{ padding: '50px 48px', background: '#071220' }}>
        <div style={{ maxWidth: '1480px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) minmax(400px, 1fr)', gap: '80px', alignItems: 'center' }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(0,194,255,0.10)', border: '1px solid rgba(0,194,255,0.20)',
                borderRadius: '100px', padding: '4px 14px',
                fontSize: '12px', fontWeight: 600, color: '#00C2FF',
                marginBottom: '20px',
              }}>
                <Lock size={12} strokeWidth={1.5} aria-hidden="true" />
                Bank-Grade Security
              </div>
              <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '18px', lineHeight: 1.2 }}>
                Bulletproof Privacy.<br />
                <span style={{ color: '#00C2FF' }}>Your Data is 100% Yours.</span>
              </h2>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: '32px' }}>
                We treat your patients' data with the highest level of security. Unlike generic platforms, we give your hospital a dedicated, isolated space. Your medical and financial records are never mixed with anyone else's.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  'Dedicated private space for your hospital alone',
                  'Military-grade encryption for all medical records',
                  'Daily automated cloud backups for total peace of mind',
                  'Strict access controls mapped to hospital staff roles',
                  'Comprehensive audit trails for every single action',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle size={16} strokeWidth={2} style={{ color: '#00C2FF', flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security diagram card */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '32px',
            }}>
              {[
                { label: 'Cloud Security Layer', bg: '#0A2E4D', items: ['Firewall', '256-bit Encryption', 'Threat Defense', 'Access Logs'] },
                { label: 'Your Hospital Space (Isolated)', bg: '#052038', items: ['Patient Records', 'Financial Data', 'Staff Info', 'Inventories'] },
                { label: 'Automated Cloud Backup', bg: '#052038', items: ['Daily Sync', 'Disaster Recovery', '99.9% Uptime', 'AWS Infrastructure'] },
                { label: 'Compliance & Audit Engine', bg: '#052038', items: ['Detailed Audit Trails', 'Role-Based Access', 'Data Privacy', 'Session Tracking'] },
              ].map((layer, i) => (
                <div
                  key={layer.label}
                  style={{
                    background: layer.bg,
                    border: '1px solid rgba(0,194,255,0.10)',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    marginBottom: i < 3 ? '10px' : 0,
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#00C2FF', marginBottom: '8px', letterSpacing: '0.04em' }}>
                    {layer.label}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {layer.items.map((item) => (
                      <span
                        key={item}
                        style={{
                          background: 'rgba(0,194,255,0.08)',
                          border: '1px solid rgba(0,194,255,0.12)',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '11px',
                          color: 'rgba(255,255,255,0.60)',
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section id="testimonials" aria-label="Customer testimonials" style={{ padding: '50px 48px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1480px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '14px' }}>
              Trusted by Hospital Leaders Across India
            </h2>
            <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '520px', margin: '0 auto' }}>
              Hear directly from medical directors, IT heads, and CEOs who run their hospitals on Nexora Health.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {TESTIMONIALS.map(({ name, title, content, rating }) => (
              <blockquote
                key={name}
                style={{
                  margin: 0,
                  background: '#F8FAFF',
                  border: '1px solid #E2EBF8',
                  borderRadius: '14px',
                  padding: '28px',
                }}
              >
                <StarRating count={rating} />
                <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: 1.70, margin: '14px 0 20px', fontStyle: 'normal' }}>
                  "{content}"
                </p>
                <footer>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{name}</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '3px' }}>{title}</div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRICING
      ══════════════════════════════════════ */}
      <section id="pricing" aria-label="Pricing plans" style={{ padding: '50px 48px', background: '#F0F7FF' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '14px' }}>
              Transparent, Predictable Pricing
            </h2>
            <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '520px', margin: '0 auto' }}>
              No hidden fees. No per-patient charges. One flat monthly fee that scales with your hospital.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'stretch' }}>
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                style={{
                  background: plan.highlight ? '#0A2E4D' : '#FFFFFF',
                  border: plan.highlight ? '2px solid #00C2FF' : '1px solid #E2EBF8',
                  borderRadius: '16px',
                  padding: '36px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {plan.highlight && (
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #00C2FF, #4DD9FF)',
                  }} aria-hidden="true" />
                )}
                {plan.highlight && (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    background: 'rgba(0,194,255,0.15)', border: '1px solid rgba(0,194,255,0.25)',
                    borderRadius: '100px', padding: '3px 10px',
                    fontSize: '11px', fontWeight: 700,
                    color: '#00C2FF', letterSpacing: '0.06em',
                    marginBottom: '12px', textTransform: 'uppercase',
                    width: 'fit-content',
                  }}>
                    Most Popular
                  </div>
                )}

                <h3 style={{ fontSize: '18px', fontWeight: 700, color: plan.highlight ? '#FFFFFF' : '#0F172A', marginBottom: '6px' }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: '13px', color: plan.highlight ? 'rgba(255,255,255,0.50)' : '#94A3B8', marginBottom: '20px' }}>
                  {plan.desc}
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '28px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 800, color: plan.highlight ? '#00C2FF' : '#0A2E4D', letterSpacing: '-0.02em' }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: '14px', color: plan.highlight ? 'rgba(255,255,255,0.40)' : '#94A3B8' }}>
                    {plan.period}
                  </span>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px', flex: 1, marginBottom: '32px' }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '13.5px', color: plan.highlight ? 'rgba(255,255,255,0.70)' : '#475569' }}>
                      <CheckCircle size={15} strokeWidth={2} style={{ color: '#00C2FF', flexShrink: 0, marginTop: '1px' }} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    padding: '13px', borderRadius: '10px',
                    fontSize: '14px', fontWeight: 700, textDecoration: 'none',
                    transition: 'all 150ms',
                    background: plan.highlight ? '#00C2FF' : 'transparent',
                    color: plan.highlight ? '#071220' : '#0A2E4D',
                    border: plan.highlight ? '1px solid #00C2FF' : '1px solid #0A2E4D',
                    marginTop: 'auto',
                  }}
                >
                  {plan.cta}
                  <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#94A3B8', marginTop: '28px' }}>
            All plans include a 14-day free trial. No credit card required.
            Enterprise plans include custom commercial terms.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section id="faq" aria-label="Frequently asked questions" style={{ padding: '50px 48px', background: '#FFFFFF', position: 'relative' }}>
        {/* Subtle Background Elements */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(0, 194, 255, 0.05) 0%, transparent 60%)',
          pointerEvents: 'none', filter: 'blur(60px)'
        }} aria-hidden="true" />

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#F8FAFC', border: '1px solid #E2E8F0',
              borderRadius: '100px', padding: '6px 16px',
              fontSize: '12.5px', fontWeight: 600, color: '#0A2E4D',
              marginBottom: '20px', letterSpacing: '0.02em',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}>
              <MessageCircle size={14} strokeWidth={1.5} aria-hidden="true" style={{ color: '#00C2FF' }} />
              Got Questions?
            </div>
            <h2 style={{ fontSize: '46px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '18px' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: '18px', color: '#64748B', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
              Everything you need to know about the product, onboarding, and how we handle your hospital's data.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {FAQS.map(({ q, a }, i) => (
              <article
                key={i}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(15, 23, 42, 0.06)',
                  borderRadius: '20px',
                  padding: '32px 32px 36px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                  transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0, 194, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(0,194,255,0.3)';

                  const iconwrap = e.currentTarget.querySelector('.faq-icon-wrap');
                  if (iconwrap) {
                    iconwrap.style.background = '#00C2FF';
                    iconwrap.style.color = '#FFFFFF';
                    iconwrap.style.boxShadow = '0 4px 12px rgba(0,194,255,0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.06)';

                  const iconwrap = e.currentTarget.querySelector('.faq-icon-wrap');
                  if (iconwrap) {
                    iconwrap.style.background = 'rgba(0,194,255,0.1)';
                    iconwrap.style.color = '#00C2FF';
                    iconwrap.style.boxShadow = 'none';
                  }
                }}
              >
                <div className="faq-icon-wrap" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: 'rgba(0,194,255,0.1)', color: '#00C2FF',
                  marginBottom: '20px', transition: 'all 300ms'
                }}>
                  <MessageCircle size={20} strokeWidth={2} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '14px', lineHeight: 1.45 }}>{q}</h3>
                <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.70 }}>{a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PREMIUM CTA SECTION
      ══════════════════════════════════════ */}
      <section aria-label="Call to action" style={{ padding: '50px 48px', background: '#FFFFFF' }}>
        <div style={{
          position: 'relative',
          maxWidth: '1280px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, #0A2E4D 0%, #041220 100%)',
          borderRadius: '32px',
          padding: '80px 48px',
          textAlign: 'center',
          overflow: 'hidden',
          boxShadow: '0 24px 48px -12px rgba(10, 46, 77, 0.4)',
        }}>
          {/* Background Elements */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
          }} />
          <div aria-hidden="true" style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px', height: '500px',
            background: 'radial-gradient(ellipse, rgba(0,194,255,0.15) 0%, transparent 60%)',
            pointerEvents: 'none', filter: 'blur(50px)'
          }} />

          {/* Content */}
          <div style={{ position: 'relative', maxWidth: '720px', margin: '0 auto', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'rgba(0,194,255,0.1)', border: '1px solid rgba(0,194,255,0.2)',
              color: '#00C2FF', marginBottom: '24px',
              boxShadow: '0 0 20px rgba(0,194,255,0.2) inset'
            }}>
              <Sparkles size={28} strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h2 style={{ fontSize: '48px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '20px', lineHeight: 1.15 }}>
              Ready to Digitise Your Hospital?
            </h2>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.65)', marginBottom: '48px', lineHeight: 1.70 }}>
              Schedule a personalised 45-minute product walkthrough with our implementation team.
              We will show you exactly how Nexora Health fits into your local workflow.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: 'linear-gradient(90deg, #00C2FF 0%, #009FD1 100%)',
                color: '#FFFFFF', fontWeight: 700,
                fontSize: '16px', padding: '16px 36px', borderRadius: '12px',
                textDecoration: 'none', boxShadow: '0 12px 24px -8px rgba(0,194,255,0.5)',
                transition: 'all 200ms',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 16px 32px -8px rgba(0,194,255,0.7)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(0,194,255,0.5)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Schedule a Demo
                <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
              </Link>
              <a href="tel:+917563901100" style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                color: '#FFFFFF', fontWeight: 600,
                fontSize: '16px', padding: '16px 32px', borderRadius: '12px',
                textDecoration: 'none', transition: 'all 200ms',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              >
                <Phone size={18} strokeWidth={2} aria-hidden="true" />
                Talk to Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <PublicFooter />

    </div >
  );
}
