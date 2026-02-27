'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    const FEATURES = [
        'Complete EMR with ICD-10 coding',
        'Multi-branch hospital support',
        'GST-compliant billing & finance',
        'Real-time analytics dashboards',
    ];

    return (
        <>
            <style>{`
                .login-wrap {
                    min-height: 100vh;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    font-family: 'Inter', system-ui, sans-serif;
                }
                .login-left {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 56px 48px;
                    position: relative;
                    background: #071220;
                    overflow: hidden;
                }
                .login-right {
                    background: #F8FAFC;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 48px 32px;
                }
                /* Mobile: stack vertically, left panel collapses to compact banner */
                @media (max-width: 768px) {
                    .login-wrap { grid-template-columns: 1fr; grid-template-rows: auto 1fr; }
                    .login-left { padding: 32px 24px; min-height: auto; align-items: flex-start; }
                    .login-left-inner { flex-direction: row !important; align-items: center !important; gap: 16px !important; }
                    .login-left-inner .login-tagline, .login-left-inner .login-features, .login-left-brand { display: none !important; }
                    .login-left-inner h1 { display: none !important; }
                    .login-left-inner p { display: none !important; }
                    .login-left-logo { margin-bottom: 0 !important; max-width: 140px !important; height: auto !important; }
                    .login-right { padding: 32px 20px; }
                }
                @media (max-width: 480px) { .login-right { padding: 24px 16px; } }
            `}</style>

            <div className="login-wrap">

                {/* ── Left Panel – Branding ── */}
                <div className="login-left">
                    {/* Radial glow — top */}
                    <div aria-hidden="true" style={{
                        position: 'absolute', top: '-10%', left: '50%',
                        transform: 'translateX(-50%)',
                        width: '600px', height: '500px',
                        background: 'radial-gradient(ellipse at 50% 20%, rgba(0,194,255,0.22) 0%, rgba(10,46,77,0.12) 55%, transparent 75%)',
                        pointerEvents: 'none',
                    }} />
                    {/* Radial glow — bottom right */}
                    <div aria-hidden="true" style={{
                        position: 'absolute', bottom: '-15%', right: '-15%',
                        width: '420px', height: '420px',
                        background: 'radial-gradient(circle, rgba(0,194,255,0.12) 0%, transparent 65%)',
                        pointerEvents: 'none',
                    }} />
                    {/* Dot grid overlay */}
                    <div aria-hidden="true" style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.028) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                        maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
                        pointerEvents: 'none',
                    }} />
                    {/* Diagonal lines accent */}
                    <div aria-hidden="true" style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,194,255,0.03) 0px, rgba(0,194,255,0.03) 1px, transparent 1px, transparent 48px)',
                        pointerEvents: 'none',
                    }} />

                    <div className="login-left-inner" style={{ position: 'relative', textAlign: 'left', maxWidth: '440px', width: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Logo */}
                        <Image
                            className="login-left-logo"
                            src="/nexora-logo.png"
                            alt="Nexora Health"
                            width={1500}
                            height={500}
                            priority
                            style={{
                                filter: 'brightness(0) invert(1)',
                                width: '240px',
                                height: 'auto',
                                opacity: 0.92,
                                marginBottom: '44px',
                                display: 'block',
                            }}
                        />

                        {/* Heading */}
                        <h1 style={{
                            fontSize: '28px', fontWeight: 800, color: '#FFFFFF',
                            lineHeight: 1.3, marginBottom: '14px',
                            letterSpacing: '-0.02em',
                            fontFamily: "'Lexend', system-ui, sans-serif",
                        }}>
                            Enterprise Hospital Management{' '}
                            <span style={{ color: '#00C2FF' }}>for Modern Healthcare</span>
                        </h1>

                        <p className="login-tagline" style={{
                            fontSize: '14.5px', color: 'rgba(255,255,255,0.52)',
                            lineHeight: 1.7, marginBottom: '36px',
                        }}>
                            Manage patients, appointments, billing, pharmacy, laboratory, and HR operations from a single integrated platform.
                        </p>

                        {/* Feature list */}
                        <div className="login-features" style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                            {FEATURES.map((f) => (
                                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <CheckCircle2 size={16} strokeWidth={2} style={{ color: '#00C2FF', flexShrink: 0 }} aria-hidden="true" />
                                    <span style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.70)', lineHeight: 1.5 }}>{f}</span>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div style={{ width: '48px', height: '2px', background: 'linear-gradient(90deg, #00C2FF, transparent)', borderRadius: '2px', marginTop: '44px', marginBottom: '20px' }} />

                        {/* Stats row */}
                        {/* Stats row removed per user request */}
                    </div>

                    {/* Brand footer */}
                    <div className="login-brand" style={{
                        position: 'absolute', bottom: '18px',
                        fontSize: '10px', color: 'rgba(255,255,255,0.20)',
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                    }}>
                        Nexora Health | Powered by Global Webify
                    </div>
                </div>

                {/* ── Right Panel – Login Form ── */}
                <div className="login-right">
                    <div style={{ width: '100%', maxWidth: '400px' }}>

                        {/* Small logo for mobile */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
                            <Image src="/favicon-96x96.png" alt="Nexora Health" width={26} height={26} />
                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0A2E4D', letterSpacing: '-0.01em' }}>Nexora Health</span>
                        </div>

                        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '6px', letterSpacing: '-0.02em', fontFamily: "'Lexend', system-ui, sans-serif" }}>
                            Sign in to your account
                        </h2>
                        <p style={{ fontSize: '13.5px', color: '#64748B', marginBottom: '28px', lineHeight: 1.6 }}>
                            Enter your credentials to access your hospital panel.
                        </p>

                        <form aria-label="Sign in form" noValidate>
                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input
                                    id="email" name="email" type="email" required
                                    autoComplete="email"
                                    placeholder="doctor@hospital.com"
                                    className="form-input"
                                    aria-required="true"
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '8px' }}>
                                <label htmlFor="password" className="form-label">Password</label>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <input
                                        id="password" name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="form-input"
                                        aria-required="true"
                                        style={{ paddingRight: '40px', width: '100%' }}
                                    />
                                    <button
                                        type="button"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute', right: '12px',
                                            background: 'transparent', border: 'none',
                                            cursor: 'pointer', color: '#64748B',
                                            display: 'flex', alignItems: 'center', padding: 0,
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
                                    <input type="checkbox" id="remember" name="remember" style={{ accentColor: '#0A2E4D' }} />
                                    Remember me
                                </label>
                                <a href="/forgot-password" style={{ fontSize: '13px', color: '#00C2FF', textDecoration: 'none', fontWeight: 500 }}>
                                    Forgot password?
                                </a>
                            </div>

                            <Link
                                href="/dashboard"
                                id="sign-in-btn"
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    gap: '8px', width: '100%', padding: '13px',
                                    background: 'linear-gradient(135deg, #0A2E4D 0%, #071220 100%)',
                                    color: 'white', fontWeight: 700, fontSize: '15px',
                                    borderRadius: '10px', textDecoration: 'none',
                                    transition: 'opacity 150ms', marginBottom: '16px',
                                    boxShadow: '0 4px 14px rgba(10,46,77,0.35)',
                                }}
                            >
                                Sign In
                            </Link>
                        </form>

                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
                            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
                            <span style={{ fontSize: '11px', color: '#94A3B8', letterSpacing: '0.04em' }}>OR</span>
                            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
                        </div>

                        {/* Security note */}
                        <div style={{
                            background: '#EFF6FF', border: '1px solid #BFDBFE',
                            borderRadius: '10px', padding: '12px 14px', fontSize: '12.5px',
                            color: '#1E40AF', display: 'flex', alignItems: 'flex-start', gap: '8px',
                        }} role="note">
                            <ShieldCheck size={15} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: '1px' }} aria-hidden="true" />
                            <span>Your session is protected with AES-256 encryption. All data is transmitted over HTTPS.</span>
                        </div>

                        <p style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', marginTop: '28px' }}>
                            Need access?{' '}
                            <a href="mailto:help@globalwebify.com" style={{ color: '#00C2FF', fontWeight: 500 }}>
                                Contact your system administrator
                            </a>
                        </p>

                        <p style={{ textAlign: 'center', marginTop: '36px', fontSize: '10px', color: '#CBD5E1', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            Nexora Health | Powered by Global Webify
                        </p>
                    </div>
                </div>

            </div>
        </>
    );
}
