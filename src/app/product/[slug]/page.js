'use client';

import { use, Suspense } from 'react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { PRODUCT_DATA } from '@/data/productData';
import { ArrowRight, ChevronLeft, Layers, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProductPage({ params }) {
    const unwrappedParams = use(params);
    const slug = unwrappedParams.slug;

    const data = PRODUCT_DATA[slug] || {
        title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        tagline: 'Enterprise Hospital Module.',
        desc: 'This module is designed to streamline your hospital operations and deliver clinical excellence.',
        icon: Layers,
        stats: [],
        features: [],
        workflow: []
    };

    const Icon = data.icon;

    return (
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: '#0F172A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <PublicHeader />

            <main style={{ flex: 1, background: '#FAFCFF', position: 'relative' }}>
                {/* ═════════ HERO SECTION ═════════ */}
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

                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                    <Link href="/request-demo" style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        background: '#00C2FF', color: '#071220', fontWeight: 700,
                                        fontSize: '15px', padding: '14px 28px', borderRadius: '10px',
                                        textDecoration: 'none', transition: 'all 150ms',
                                        boxShadow: '0 4px 24px rgba(0,194,255,0.3)'
                                    }}>
                                        Request Demo
                                        <ArrowRight size={16} strokeWidth={2.5} />
                                    </Link>
                                    <Link href="#features" style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#FFFFFF', fontWeight: 600,
                                        fontSize: '15px', padding: '14px 28px', borderRadius: '10px',
                                        textDecoration: 'none', transition: 'all 150ms'
                                    }}>
                                        Explore Features
                                    </Link>
                                </div>
                            </div>

                            {/* Abstract Visual Box pointing to enterprise scale */}
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

                {/* ═════════ FEATURES GRID ═════════ */}
                <section id="features" style={{ padding: '100px 24px', background: '#FAFCFF' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                            <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '16px' }}>
                                Core Capabilities
                            </h2>
                            <p style={{ fontSize: '18px', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>
                                Discover the powerful features we built to optimize every aspect of your hospital&apos;s technical footprint.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                            {data.features?.map((feat, index) => {
                                const FeatureIcon = feat.icon;
                                return (
                                    <div key={index} style={{
                                        background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.06)',
                                        borderRadius: '20px', padding: '32px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                                        transition: 'transform 200ms, box-shadow 200ms',
                                        cursor: 'default'
                                    }} onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,194,255,0.1)';
                                        e.currentTarget.style.borderColor = 'rgba(0,194,255,0.3)';
                                    }} onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'none';
                                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)';
                                        e.currentTarget.style.borderColor = 'rgba(15,23,42,0.06)';
                                    }}>
                                        <div style={{
                                            width: '48px', height: '48px', background: '#F8FAFC',
                                            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            marginBottom: '20px', color: '#0A2E4D'
                                        }}>
                                            <FeatureIcon size={24} strokeWidth={1.5} />
                                        </div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
                                            {feat.title}
                                        </h3>
                                        <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7 }}>
                                            {feat.desc}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* ═════════ WORKFLOW ═════════ */}
                <section style={{ padding: '100px 24px', background: '#FFFFFF', borderTop: '1px solid rgba(15,23,42,0.04)' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '64px', alignItems: 'start' }}>
                            <div style={{ position: 'sticky', top: '100px' }}>
                                <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '16px', lineHeight: 1.1 }}>
                                    How It Works
                                </h2>
                                <p style={{ fontSize: '18px', color: '#64748B', lineHeight: 1.6, marginBottom: '32px' }}>
                                    A seamless, integrated workflow bypassing bottlenecks and instantly connecting the front desk to clinical operations.
                                </p>
                            </div>

                            <div>
                                {data.workflow?.map((step, i) => (
                                    <div key={i} style={{
                                        display: 'flex', gap: '32px', marginBottom: i === data.workflow.length - 1 ? 0 : '48px',
                                        position: 'relative'
                                    }}>
                                        {i !== data.workflow.length - 1 && (
                                            <div style={{
                                                position: 'absolute', left: '23px', top: '48px', bottom: '-48px',
                                                width: '2px', background: 'rgba(0,194,255,0.2)'
                                            }} />
                                        )}
                                        <div style={{
                                            width: '48px', height: '48px', borderRadius: '24px',
                                            background: 'rgba(0,194,255,0.1)', border: '1px solid rgba(0,194,255,0.3)',
                                            color: '#00C2FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '15px', fontWeight: 700, flexShrink: 0, zIndex: 1
                                        }}>
                                            {step.step}
                                        </div>
                                        <div style={{ paddingTop: '8px' }}>
                                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
                                                {step.title}
                                            </h3>
                                            <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.7 }}>
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═════════ BOTTOM CTA ═════════ */}
                <section style={{ padding: '100px 24px', background: '#071220' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '42px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '24px' }}>
                            Ready to transform your hospital?
                        </h2>
                        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', marginBottom: '40px' }}>
                            Join the hundreds of modern health facilities prioritizing patient outcomes over paperwork.
                        </p>
                        <Link href="/request-demo" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: '#00C2FF', color: '#071220', fontWeight: 700,
                            fontSize: '16px', padding: '16px 36px', borderRadius: '12px',
                            textDecoration: 'none', transition: 'all 150ms',
                            boxShadow: '0 4px 24px rgba(0,194,255,0.3)'
                        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            Schedule a Live Demo <ArrowRight size={18} strokeWidth={2.5} />
                        </Link>
                    </div>
                </section>

            </main>
            <PublicFooter />
        </div>
    );
}
