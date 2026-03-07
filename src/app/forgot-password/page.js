'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(''); // 'success' | 'error' | ''
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');
        setMessage('');

        const email = e.target.email.value.trim();
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setStatus('success');
                setMessage('A password reset link has been sent to your email. Please check your inbox.');
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to send reset link.');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Network error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F8FAFC',
            fontFamily: "'Inter', system-ui, sans-serif"
        }}>
            <div style={{ width: '100%', maxWidth: '420px', padding: '24px' }}>
                <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748B', textDecoration: 'none', fontSize: '13px', fontWeight: 500, marginBottom: '24px', transition: 'color 150ms' }} onMouseEnter={e => e.currentTarget.style.color = '#0F172A'} onMouseLeave={e => e.currentTarget.style.color = '#64748B'}>
                    <ArrowLeft size={16} /> Back to login
                </Link>

                <div style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '40px 32px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 24px 48px -12px rgba(0, 0, 0, 0.08)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                        <Image src="/favicon-96x96.png" alt="Nexora Health" width={32} height={32} />
                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#0A2E4D', letterSpacing: '-0.01em' }}>Nexora Health</span>
                    </div>

                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '10px', letterSpacing: '-0.02em', fontFamily: "'Lexend', system-ui, sans-serif" }}>
                        Reset Password
                    </h1>
                    <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '32px', lineHeight: 1.6 }}>
                        Enter the email address associated with your account and we will send you a link to reset your password.
                    </p>

                    {status === 'success' ? (
                        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <CheckCircle2 size={20} style={{ color: '#16A34A', flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#15803D', margin: '0 0 6px 0' }}>Email Sent</h3>
                                <p style={{ fontSize: '13px', color: '#166534', margin: 0, lineHeight: 1.5 }}>{message}</p>
                            </div>
                        </div>
                    ) : (
                        <form noValidate onSubmit={handleSubmit}>
                            {status === 'error' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px' }}>
                                    <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
                                    <span style={{ fontSize: '13.5px', color: '#B91C1C' }}>{message}</span>
                                </div>
                            )}

                            <div style={{ marginBottom: '24px' }}>
                                <label htmlFor="email" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        id="email" name="email" type="email" required
                                        placeholder="doctor@nexorahealth.com"
                                        style={{
                                            width: '100%', padding: '12px 16px 12px 42px',
                                            border: '1px solid #E2E8F0', borderRadius: '10px',
                                            outline: 'none', fontSize: '15px', color: '#0F172A',
                                            transition: 'border-color 0.2s',
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#00C2FF'}
                                        onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '100%', padding: '14px',
                                    background: 'linear-gradient(135deg, #0A2E4D 0%, #00C2FF 100%)',
                                    color: 'white', fontWeight: 700, fontSize: '15px',
                                    borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'opacity 150ms, transform 150ms', opacity: loading ? 0.8 : 1,
                                    boxShadow: '0 6px 16px rgba(0,194,255,0.25)',
                                }}
                            >
                                {loading ? 'Sending Link...' : 'Send Reset Link'}
                            </button>
                        </form>
                    )}

                    <div style={{
                        marginTop: '32px',
                        background: '#EFF6FF', border: '1px solid #BFDBFE',
                        borderRadius: '10px', padding: '14px', fontSize: '12.5px',
                        color: '#1E40AF', display: 'flex', alignItems: 'flex-start', gap: '10px',
                    }}>
                        <ShieldCheck size={18} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                        <span>If you do not see the email in your inbox within 5 minutes, please check your spam folder or contact your IT admin.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
