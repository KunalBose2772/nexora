'use client';
import { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, CheckCircle2, Send, Clock, ChevronRight, X, Plus } from 'lucide-react';

export default function PortalGrievance() {
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        subject: '',
        description: '',
        category: 'Others',
        priority: 'Normal'
    });

    const fetchGrievances = async () => {
        try {
            const res = await fetch('/api/patient-portal/grievance');
            if (res.ok) {
                const data = await res.json();
                setGrievances(data.grievances || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGrievances();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/patient-portal/grievance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                setForm({ subject: '', description: '', category: 'Others', priority: 'Normal' });
                setIsFormOpen(false);
                fetchGrievances();
                alert('✅ Your feedback has been submitted. Our admin team will review it shortly.');
            }
        } catch (e) {
            alert('Failed to submit grievance');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ background: '#FEF3F2', padding: '12px', borderRadius: '14px', color: '#DC2626' }}><MessageSquare size={22} /></div>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#0F172A' }}>Support Desk</h2>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748B', fontWeight: 600 }}>TICKETS & FEEDBACK</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsFormOpen(true)}
                    style={{ background: '#0F172A', border: 'none', borderRadius: '12px', padding: '10px 18px', fontSize: '13px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 8px 16px rgba(15, 23, 42, 0.15)' }}
                >
                    <Plus size={16} /> New Ticket
                </button>
            </div>

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                    <div className="animate-spin" style={{ marginBottom: '12px' }}><Clock size={24} /></div>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>Syncing records...</span>
                </div>
            ) : grievances.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', border: '2px dashed #F1F5F9', borderRadius: '16px' }}>
                    <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0, fontWeight: 500 }}>No active support cases.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {grievances.map(g => (
                        <div key={g.id} className="interactive-row" style={{ padding: '20px', border: '1px solid #F1F5F9', borderRadius: '20px', background: '#F8FAFC' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', fontFamily: 'monospace', background: '#fff', padding: '4px 8px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>{g.ticketId}</span>
                                    <span style={{ fontSize: '10px', fontWeight: 900, background: g.status === 'Resolved' ? '#F0FDF4' : '#FEF2F2', color: g.status === 'Resolved' ? '#166534' : '#991B1B', padding: '4px 10px', borderRadius: '8px', textTransform: 'uppercase' }}>{g.status}</span>
                                </div>
                                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>{new Date(g.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>{g.subject}</h4>
                            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>{g.description}</p>
                            
                            {g.adminReply && (
                                <div style={{ marginTop: '16px', padding: '16px', background: '#fff', borderLeft: '4px solid #00C2FF', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                        <CheckCircle2 size={12} color="#00C2FF" />
                                        <div style={{ fontSize: '10px', fontWeight: 900, color: '#00C2FF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Official Response</div>
                                    </div>
                                    <p style={{ fontSize: '13px', color: '#334155', margin: 0, fontWeight: 500 }}>{g.adminReply}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for New Grievance */}
            {isFormOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
                        <div style={{ background: '#F8FAFC', padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Report a Concern</h3>
                            <button onClick={() => setIsFormOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>Category</label>
                                    <select 
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none' }}
                                        value={form.category}
                                        onChange={e => setForm({...form, category: e.target.value})}
                                    >
                                        <option>Staff Behavior</option>
                                        <option>Clinical Quality</option>
                                        <option>Wait Times</option>
                                        <option>Billing Issues</option>
                                        <option>Cleanliness</option>
                                        <option>Others</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>Priority</label>
                                    <select 
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none' }}
                                        value={form.priority}
                                        onChange={e => setForm({...form, priority: e.target.value})}
                                    >
                                        <option>Normal</option>
                                        <option>High</option>
                                        <option>Urgent</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>Subject</label>
                                <input 
                                    type="text" 
                                    placeholder="Brief summary of your issue"
                                    required
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none' }} 
                                    value={form.subject}
                                    onChange={e => setForm({...form, subject: e.target.value})}
                                />
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>Description</label>
                                <textarea 
                                    rows={4} 
                                    placeholder="Describe your concern in detail..."
                                    required
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', resize: 'none' }}
                                    value={form.description}
                                    onChange={e => setForm({...form, description: e.target.value})}
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                disabled={submitting}
                                style={{ width: '100%', padding: '12px', background: '#0F172A', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: submitting ? 0.7 : 1 }}
                            >
                                {submitting ? 'Submitting...' : <><Send size={16} /> Submit Feedback</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
