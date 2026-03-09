'use client';

import { use, Suspense } from 'react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { LEGAL_DATA } from '@/data/companyData';
import { ChevronLeft, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function LegalPage({ params }) {
    const unwrappedParams = use(params);
    const slug = unwrappedParams.slug;

    const data = LEGAL_DATA[slug] || {
        title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        tagline: 'Legal & Compliance.',
        desc: 'Information regarding legal terms, platform compliance, and our security commitments.',
        icon: FileText,
        stats: [],
        features: []
    };

    const Icon = data.icon;

    return (
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: '#0F172A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <PublicHeader />

            <main style={{ flex: 1, background: '#FAFCFF', position: 'relative' }}>
                <section style={{ position: 'relative', padding: '100px 24px 80px', overflow: 'hidden' }}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'linear-gradient(180deg, #071220 0%, #0A1C30 100%)',
                        zIndex: 0
                    }} />
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundImage: 'radial-gradient(rgba(0, 194, 255, 0.05) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                        zIndex: 0, pointerEvents: 'none'
                    }} />

                    <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                        <Link href="/" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px',
                            marginBottom: '40px', transition: 'color 150ms'
                        }} onMouseEnter={(e) => e.currentTarget.style.color = '#FFF'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                            <ChevronLeft size={16} /> Back to Home
                        </Link>

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '64px', alignItems: 'center' }}>
                            <div>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    background: 'rgba(0,194,255,0.1)', border: '1px solid rgba(0,194,255,0.2)',
                                    borderRadius: '100px', padding: '6px 16px', fontSize: '13px',
                                    fontWeight: 600, color: '#00C2FF', marginBottom: '24px'
                                }}>
                                    <Icon size={14} />
                                    {data.tagline}
                                </div>

                                <h1 style={{ fontSize: '52px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em', marginBottom: '24px', lineHeight: 1.1 }}>
                                    {data.title}
                                </h1>

                                <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '40px', maxWidth: '600px' }}>
                                    {data.desc}
                                </p>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '24px', padding: '40px',
                                backdropFilter: 'blur(10px)',
                                position: 'relative', overflow: 'hidden'
                            }}>
                                <div style={{
                                    position: 'absolute', top: '-50px', right: '-50px',
                                    width: '150px', height: '150px',
                                    background: 'radial-gradient(circle, rgba(0,194,255,0.2) 0%, transparent 70%)',
                                    filter: 'blur(20px)'
                                }} />
                                {data.stats?.map((stat, i) => (
                                    <div key={i} style={{
                                        background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '16px', padding: '24px', marginBottom: i === data.stats.length - 1 ? 0 : '16px',
                                    }}>
                                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                            {stat.label}
                                        </div>
                                        <div style={{ fontSize: '32px', fontWeight: 700, color: '#00C2FF' }}>
                                            {stat.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section style={{ padding: '80px 24px', background: '#FAFCFF' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'left', marginBottom: '40px' }}>
                            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '16px' }}>
                                Core Policies & Provisions
                            </h2>
                            <p style={{ fontSize: '18px', color: '#64748B', maxWidth: '800px' }}>
                                A consolidated breakdown of our regulatory and legal postures.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {data.features?.map((feat, index) => {
                                const FeatureIcon = feat.icon;
                                return (
                                    <div key={index} style={{
                                        background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.06)',
                                        borderRadius: '20px', padding: '32px',
                                        display: 'flex', gap: '24px', alignItems: 'flex-start'
                                    }}>
                                        <div style={{
                                            width: '48px', height: '48px', background: '#F8FAFC', flexShrink: 0,
                                            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#0A2E4D'
                                        }}>
                                            <FeatureIcon size={24} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                                                {feat.title}
                                            </h3>
                                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.7, maxWidth: '900px' }}>
                                                {feat.desc}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                <section style={{ padding: '80px 24px', background: '#FFFFFF', borderTop: '1px solid rgba(15,23,42,0.04)' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', fontSize: '15px', color: '#475569', lineHeight: 1.8 }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>Full Regulatory Text</h3>
                        <p style={{ marginBottom: '24px' }}>
                            The complete formal legal text, including definitions, arbitration clauses, and jurisdictional bounds for Indian healthcare data compliance, is provided to our enterprise clients directly via their signed initial agreement package.
                        </p>
                        <p style={{ marginBottom: '24px' }}>
                            If your compliance office requires a specific Business Associate Agreement (BAA) or deep-level Data Processing Addendum (DPA) regarding ISO-27001 or HIPAA standards, please contact our dedicated security team at <a href="mailto:compliance@nexorahealth.com" style={{ color: '#00C2FF' }}>compliance@nexorahealth.com</a>.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px', background: 'rgba(0,194,255,0.05)', borderRadius: '8px', border: '1px solid rgba(0,194,255,0.1)', color: '#0A2E4D', fontWeight: 600 }}>
                            <CheckCircle size={18} style={{ color: '#00C2FF' }} /> Validated by 3rd-Party Auditors (2026)
                        </div>
                    </div>
                </section>

            </main>
            <PublicFooter />
        </div>
    );
}
