'use client';
import { useState } from 'react';
import { User, Lock, Phone, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProfileSettings({ patient }) {
    const [form, setForm] = useState({
        firstName: patient.firstName || '',
        lastName: patient.lastName || '',
        phone: patient.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (form.newPassword && form.newPassword !== form.confirmPassword) {
            setStatus({ type: 'error', message: 'New passwords do not match' });
            return;
        }

        setLoading(true);
        setStatus(null);
        try {
            const res = await fetch('/api/portal/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (res.ok) {
                setStatus({ type: 'success', message: 'Profile updated successfully!' });
                setForm({ ...form, currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setStatus({ type: 'error', message: data.error || 'Update failed' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #F1F5F9', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#F0F9FF', color: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={28} />
                </div>
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Account Settings</h2>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Update your profile information and security credentials</p>
                </div>
            </div>

            {status && (
                <div style={{ padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center', background: status.type === 'success' ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${status.type === 'success' ? '#BBF7D0' : '#FEE2E2'}`, color: status.type === 'success' ? '#166534' : '#991B1B' }}>
                    {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{status.message}</span>
                </div>
            )}

            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>First Name</label>
                        <input className="form-input" style={{ width: '100%', borderRadius: '12px' }} value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Last Name</label>
                        <input className="form-input" style={{ width: '100%', borderRadius: '12px' }} value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Contact Number</label>
                    <div style={{ position: 'relative' }}>
                        <Phone size={14} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94A3B8' }} />
                        <input className="form-input" style={{ width: '100%', borderRadius: '12px', paddingLeft: '40px' }} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    </div>
                </div>

                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <Lock size={16} color="#475569" />
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#475569', margin: 0 }}>Security Configuration</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Current Password (Required for changes)</label>
                            <input type="password" className="form-input" style={{ width: '100%', borderRadius: '12px' }} value={form.currentPassword} onChange={e => setForm({...form, currentPassword: e.target.value})} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>New Password</label>
                                <input type="password" className="form-input" style={{ width: '100%', borderRadius: '12px' }} value={form.newPassword} onChange={e => setForm({...form, newPassword: e.target.value})} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Confirm New Password</label>
                                <input type="password" className="form-input" style={{ width: '100%', borderRadius: '12px' }} value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} />
                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={loading} style={{ marginTop: '8px', height: '48px', background: '#0F172A', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.2s shadow-xl shadow-slate-200' }}>
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {loading ? 'Processing...' : 'Synchronize Profile'}
                </button>
            </form>
        </div>
    );
}
