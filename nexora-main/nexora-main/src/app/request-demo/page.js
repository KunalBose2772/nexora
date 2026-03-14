'use client';
import { useState } from 'react';
import { Building2, Mail, Phone, ImageIcon, CheckCircle2, ChevronRight, Loader2, Link as LinkIcon, Info, Upload } from 'lucide-react';
import Link from 'next/link';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

export default function RequestDemoPage() {
    const [form, setForm] = useState({
        hospitalName: '', email: '', phone: '', logoUrl: '', heroImage: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [logoUploading, setLogoUploading] = useState(false);
    const [heroUploading, setHeroUploading] = useState(false);

    const handleUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        if (type === 'logo') setLogoUploading(true);
        else setHeroUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.ok) {
                if (type === 'logo') setForm({ ...form, logoUrl: data.url });
                else setForm({ ...form, heroImage: data.url });
            } else {
                alert(data.error || 'Upload failed');
            }
        } catch (err) {
            alert('Upload error');
        } finally {
            if (type === 'logo') setLogoUploading(false);
            else setHeroUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const res = await fetch('/api/demo-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to submit request');
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
                <PublicHeader />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px' }}>
                    <div className="fade-in" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '64px 48px', textAlign: 'center', maxWidth: '540px', boxShadow: '0 20px 40px -12px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#D1FAE5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                            <CheckCircle2 size={40} strokeWidth={2.5} />
                        </div>
                        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: '#0F172A', letterSpacing: '-0.02em' }}>
                            Request Submitted
                        </h1>
                        <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.7, marginBottom: '40px' }}>
                            Thank you for requesting a demo of Nexora Health. We have successfully received your details for <strong>{form.hospitalName}</strong>.
                            <br /><br />
                            Our implementation team will review your request. Once verified, you will receive an email containing your 15-day free demo credentials and your custom frontend URL.
                        </p>
                        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 32px', background: '#0F172A', color: '#FFFFFF', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '15px', transition: 'all 0.2s', boxShadow: '0 8px 16px rgba(15, 23, 42, 0.15)' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 20px rgba(15, 23, 42, 0.2)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(15, 23, 42, 0.15)'; }}>
                            Return to Homepage <ChevronRight size={18} />
                        </Link>
                    </div>
                </div>
                <PublicFooter />
            </div>
        );
    }

    const inputStyle = {
        width: '100%', padding: '16px 16px 16px 48px', background: '#F8FAFC', border: '1px solid #E2E8F0',
        borderRadius: '12px', color: '#0F172A', fontSize: '15px', outline: 'none', transition: 'all 0.2s',
        boxSizing: 'border-box', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
    };

    const labelStyle = { display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' };
    const iconStyle = { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
            <PublicHeader />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '80px 24px 120px' }}>

                {/* Visual Header */}
                <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 64px' }}>
                    <div style={{ display: 'inline-block', padding: '8px 16px', background: '#ECFDF5', color: '#10B981', borderRadius: '100px', fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '24px', textTransform: 'uppercase' }}>
                        15-Day Free Trial
                    </div>
                    <h1 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '24px', color: '#0F172A' }}>
                        See Nexora Health in Action.
                    </h1>
                    <p style={{ fontSize: '18px', color: '#475569', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>
                        Fill out the details below to receive a personalized, fully-functional instance of Nexora Health configured specifically for your hospital.
                    </p>
                </div>

                {/* Form Container */}
                <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '48px', boxShadow: '0 20px 40px -12px rgba(0,0,0,0.05)' }}>

                    {error && (
                        <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: '16px', borderRadius: '12px', fontSize: '14px', marginBottom: '32px', border: '1px solid #FCA5A5', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <Info size={18} style={{ marginTop: '2px', flexShrink: 0 }} />
                            <div>{error}</div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '28px' }}>

                        {/* Section 1: Basic Info */}
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Hospital Information</h3>
                            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>Provide your primary contact and organizational details.</p>

                            <div style={{ display: 'grid', gap: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Hospital / Clinic Name <span style={{ color: '#EF4444' }}>*</span></label>
                                    <div style={{ position: 'relative' }}>
                                        <Building2 size={18} style={iconStyle} />
                                        <input required type="text" placeholder="e.g. Apex Multispeciality Hospital" value={form.hospitalName} onChange={e => setForm({ ...form, hospitalName: e.target.value })} style={inputStyle} onFocus={e => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.background = '#FFFFFF'; }} onBlur={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; }} />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                    <div>
                                        <label style={labelStyle}>Admin Email Address <span style={{ color: '#EF4444' }}>*</span></label>
                                        <div style={{ position: 'relative' }}>
                                            <Mail size={18} style={iconStyle} />
                                            <input required type="email" placeholder="admin@hospital.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} onFocus={e => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.background = '#FFFFFF'; }} onBlur={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; }} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Phone Number <span style={{ color: '#EF4444' }}>*</span></label>
                                        <div style={{ position: 'relative' }}>
                                            <Phone size={18} style={iconStyle} />
                                            <input required type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} onFocus={e => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.background = '#FFFFFF'; }} onBlur={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '8px 0' }} />

                        {/* Section 2: Branding (Optional) */}
                        <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Brand Assets (Optional)</h3>
                            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>Provide links to your logo and a hero image to personalize your demo frontend. You can upload images to Imgur or providing existing website links.</p>

                            <div style={{ display: 'grid', gap: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Logo Image URL or Upload</label>
                                    <div style={{ position: 'relative', display: 'flex', gap: '12px' }}>
                                        <div style={{ position: 'relative', flex: 1 }}>
                                            <LinkIcon size={18} style={iconStyle} />
                                            <input type="url" placeholder="https://yourwebsite.com/logo.png" value={form.logoUrl} onChange={e => setForm({ ...form, logoUrl: e.target.value })} style={inputStyle} onFocus={e => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.background = '#FFFFFF'; }} onBlur={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; }} />
                                        </div>
                                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0 20px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#475569', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }} onMouseEnter={e => { e.currentTarget.style.background = '#E2E8F0'; }} onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; }}>
                                            {logoUploading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={18} />}
                                            {logoUploading ? 'Uploading...' : 'Upload File'}
                                            <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'logo')} style={{ display: 'none' }} disabled={logoUploading} />
                                        </label>
                                    </div>
                                    <p style={{ fontSize: '12.5px', color: '#94A3B8', marginTop: '8px' }}>Recommended: Square or landscape transparent PNG.</p>
                                </div>
                                <div>
                                    <label style={labelStyle}>Hero Background Image URL or Upload</label>
                                    <div style={{ position: 'relative', display: 'flex', gap: '12px' }}>
                                        <div style={{ position: 'relative', flex: 1 }}>
                                            <ImageIcon size={18} style={iconStyle} />
                                            <input type="url" placeholder="https://yourwebsite.com/hospital-photo.jpg" value={form.heroImage} onChange={e => setForm({ ...form, heroImage: e.target.value })} style={inputStyle} onFocus={e => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.background = '#FFFFFF'; }} onBlur={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; }} />
                                        </div>
                                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0 20px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#475569', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }} onMouseEnter={e => { e.currentTarget.style.background = '#E2E8F0'; }} onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; }}>
                                            {heroUploading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={18} />}
                                            {heroUploading ? 'Uploading...' : 'Upload File'}
                                            <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'hero')} style={{ display: 'none' }} disabled={heroUploading} />
                                        </label>
                                    </div>
                                    <p style={{ fontSize: '12.5px', color: '#94A3B8', marginTop: '8px' }}>Recommended: High-resolution exterior photo of your hospital.</p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div style={{ marginTop: '16px' }}>
                            <button disabled={loading} type="submit" style={{ width: '100%', padding: '18px', background: 'linear-gradient(to right, #10B981, #059669)', color: '#FFFFFF', borderRadius: '12px', fontWeight: 700, fontSize: '16px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)' }} onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 20px rgba(16, 185, 129, 0.3)'; } }} onMouseLeave={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(16, 185, 129, 0.2)'; } }}>
                                {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : 'Submit Demo Request'}
                                {!loading && <ChevronRight size={20} />}
                            </button>
                            <p style={{ textAlign: 'center', fontSize: '13px', color: '#94A3B8', marginTop: '16px' }}>
                                By submitting this request, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </div>

                    </form>
                </div>
            </div>

            <PublicFooter />
            {loading && <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>}
        </div>
    );
}
