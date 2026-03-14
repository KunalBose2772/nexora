'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff, Lock, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(''); // 'success' | 'error' | ''
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid or missing reset token.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');
        setMessage('');

        const newPassword = e.target.newPassword.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (newPassword !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match.');
            setLoading(false);
            return;
        }
        if (newPassword.length < 8) {
            setStatus('error');
            setMessage('Password must be at least 8 characters long.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });
            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage('Your password has been reset successfully.');
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to reset password.');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Network error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', background: '#FEF2F2', padding: '16px', borderRadius: '50%', marginBottom: '20px' }}>
                    <AlertCircle size={32} color="#EF4444" />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Invalid Reset Link</h2>
                <p style={{ color: '#64748B', marginBottom: '24px' }}>The password reset link is invalid or has expired.</p>
                <Link href="/forgot-password" style={{ display: 'inline-block', padding: '10px 20px', background: '#F1F5F9', color: '#0F172A', fontWeight: 600, borderRadius: '8px', textDecoration: 'none' }}>
                    Request New Link
                </Link>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', background: '#F0FDF4', padding: '16px', borderRadius: '50%', marginBottom: '20px' }}>
                    <CheckCircle2 size={32} color="#16A34A" />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Password Reset!</h2>
                <p style={{ color: '#64748B', marginBottom: '24px' }}>Your password has been updated securely. Redirecting to login...</p>
                <Link href="/login" style={{ display: 'inline-block', padding: '10px 20px', background: 'linear-gradient(135deg, #0A2E4D 0%, #00C2FF 100%)', color: '#FFF', fontWeight: 600, borderRadius: '8px', textDecoration: 'none', width: '100%' }}>
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <form noValidate onSubmit={handleSubmit}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '10px', letterSpacing: '-0.02em', fontFamily: "'Lexend', system-ui, sans-serif" }}>
                Create New Password
            </h1>
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '32px', lineHeight: 1.6 }}>
                Your new password must be different from previous used passwords and at least 8 characters long.
            </p>

            {status === 'error' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px' }}>
                    <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '13.5px', color: '#B91C1C' }}>{message}</span>
                </div>
            )}

            <div style={{ marginBottom: '16px' }}>
                <label htmlFor="newPassword" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                    <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        id="newPassword" name="newPassword"
                        type={showPassword ? 'text' : 'password'} required
                        placeholder="••••••••"
                        style={{
                            width: '100%', padding: '12px 42px 12px 42px',
                            border: '1px solid #E2E8F0', borderRadius: '10px',
                            outline: 'none', fontSize: '15px', color: '#0F172A',
                            transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#00C2FF'}
                        onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex' }}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
                <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                    <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        id="confirmPassword" name="confirmPassword"
                        type={showConfirm ? 'text' : 'password'} required
                        placeholder="••••••••"
                        style={{
                            width: '100%', padding: '12px 42px 12px 42px',
                            border: '1px solid #E2E8F0', borderRadius: '10px',
                            outline: 'none', fontSize: '15px', color: '#0F172A',
                            transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#00C2FF'}
                        onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex' }}
                    >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
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
                {loading ? 'Resetting...' : 'Reset Password'}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
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
                        <Image src="/nexora-mark.svg" alt="Nexora Health" width={32} height={32} />
                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#0A2E4D', letterSpacing: '-0.01em' }}>Nexora Health</span>
                    </div>

                    <Suspense fallback={<p style={{ color: '#94A3B8' }}>Loading...</p>}>
                        <ResetPasswordForm />
                    </Suspense>

                    <div style={{
                        marginTop: '32px',
                        background: '#EFF6FF', border: '1px solid #BFDBFE',
                        borderRadius: '10px', padding: '14px', fontSize: '12.5px',
                        color: '#1E40AF', display: 'flex', alignItems: 'flex-start', gap: '10px',
                    }}>
                        <ShieldCheck size={18} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                        <span>Your session is protected with AES-256 encryption.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
