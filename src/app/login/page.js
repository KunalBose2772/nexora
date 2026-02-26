'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                fontFamily: "'Inter', system-ui, sans-serif",
            }}
        >
            {/* ── Left Panel – Branding ── */}
            <div
                style={{
                    background: 'linear-gradient(160deg, #0A2E4D 0%, #0d3a60 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '48px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Subtle grid overlay */}
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage:
                            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)',
                        backgroundSize: '40px 40px',
                        pointerEvents: 'none',
                    }}
                />

                <div style={{ position: 'relative', textAlign: 'left', maxWidth: '440px', width: '100%' }}>
                    <Image
                        src="/nexora-logo.png"
                        alt="Nexora Health"
                        width={260}
                        height={80}
                        priority
                        style={{ filter: 'brightness(0) invert(1)', height: 'auto', marginBottom: '36px', display: 'block', margin: '0' }}
                    />

                    <h1
                        style={{
                            fontSize: '26px',
                            fontWeight: 600,
                            color: 'white',
                            lineHeight: 1.35,
                            marginBottom: '16px',
                            letterSpacing: '-0.01em',
                        }}
                    >
                        Enterprise Hospital Management
                        <br />
                        for Modern Healthcare
                    </h1>

                    <p
                        style={{
                            fontSize: '15px',
                            color: 'rgba(255,255,255,0.60)',
                            lineHeight: 1.7,
                            marginBottom: '40px',
                        }}
                    >
                        Manage patients, appointments, billing, pharmacy, laboratory, and HR operations
                        from a single integrated platform.
                    </p>

                    {/* Feature list */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            textAlign: 'left',
                        }}
                    >
                        {[
                            'Complete EMR with ICD-10 coding',
                            'Multi-branch hospital support',
                            'GST-compliant billing & finance',
                            'Real-time analytics dashboards',
                        ].map((f) => (
                            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <ShieldCheck
                                    size={16}
                                    strokeWidth={1.5}
                                    style={{ color: '#00C2FF', flexShrink: 0 }}
                                    aria-hidden="true"
                                />
                                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)' }}>{f}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Brand footer */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.25)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                    }}
                >
                    Nexora Health | Powered by Global Webify
                </div>
            </div>

            {/* ── Right Panel – Login Form ── */}
            <div
                style={{
                    background: '#F8FAFC',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '48px',
                }}
            >
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    {/* Small logo for mobile fallback / header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '36px' }}>
                        <Image
                            src="/favicon-96x96.png"
                            alt="Nexora Health"
                            width={28}
                            height={28}
                        />
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#0A2E4D' }}>
                            Nexora Health
                        </span>
                    </div>

                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', letterSpacing: '-0.02em' }}>
                        Sign in to your account
                    </h2>
                    <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '28px' }}>
                        Enter your credentials to access your hospital panel.
                    </p>

                    <form aria-label="Sign in form" noValidate>

                        <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="doctor@hospital.com"
                                className="form-input"
                                aria-required="true"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '8px' }}>
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="form-input"
                                    aria-required="true"
                                    style={{ paddingRight: '40px', width: '100%' }}
                                />
                                <button
                                    type="button"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#64748B',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 0,
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                                </button>
                            </div>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '24px',
                            }}
                        >
                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '13px',
                                    color: '#475569',
                                    cursor: 'pointer',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    id="remember"
                                    name="remember"
                                    style={{ accentColor: '#0A2E4D' }}
                                />
                                Remember me
                            </label>
                            <a
                                href="/forgot-password"
                                style={{ fontSize: '13px', color: '#00C2FF', textDecoration: 'none', fontWeight: 500 }}
                            >
                                Forgot password?
                            </a>
                        </div>

                        <Link
                            href="/dashboard"
                            id="sign-in-btn"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                width: '100%',
                                padding: '12px',
                                background: '#0A2E4D',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '15px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                transition: 'background 150ms',
                                marginBottom: '16px',
                            }}
                        >
                            Sign In
                        </Link>

                    </form>

                    {/* Divider */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            margin: '20px 0',
                        }}
                    >
                        <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
                        <span style={{ fontSize: '12px', color: '#94A3B8' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
                    </div>

                    <div
                        style={{
                            background: '#EFF6FF',
                            border: '1px solid #BFDBFE',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            fontSize: '13px',
                            color: '#1E40AF',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                        }}
                        role="note"
                    >
                        <ShieldCheck size={16} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: '1px' }} aria-hidden="true" />
                        <span>
                            Your session is protected with AES-256 encryption. All data is transmitted over HTTPS.
                        </span>
                    </div>

                    <p style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', marginTop: '32px' }}>
                        Need access?{' '}
                        <a href="mailto:support@nexorahealth.com" style={{ color: '#00C2FF', fontWeight: 500 }}>
                            Contact your system administrator
                        </a>
                    </p>

                    {/* Brand footer */}
                    <p
                        style={{
                            textAlign: 'center',
                            marginTop: '40px',
                            fontSize: '10px',
                            color: '#CBD5E1',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Nexora Health | Powered by Global Webify
                    </p>
                </div>
            </div>
        </div>
    );
}
