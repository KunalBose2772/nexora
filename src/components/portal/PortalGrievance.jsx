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
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: '#FEF3F2', padding: '10px', borderRadius: '10px', color: '#DC2626' }}><MessageSquare size={20} /></div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#0F172A' }}>Feedback & Grievances</h2>
                </div>
                <button 
                    onClick={() => setIsFormOpen(true)}
                    style={{ marginLeft: 'auto', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                    <Plus size={14} /> New Ticket
                </button>
            </div>

            {loading ? (
                <div style={{ py: '20px', textAlign: 'center', color: '#94A3B8' }}>Loading tickets...</div>
            ) : grievances.length === 0 ? (
                <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0, textAlign: 'center', py: '10px' }}>No grievances reported yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {grievances.map(g => (
                        <div key={g.id} style={{ padding: '14px', border: '1px solid #F1F5F9', borderRadius: '12px', background: '#F8FAFC' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', fontFamily: 'monospace' }}>{g.ticketId}</span>
                                    <span style={{ fontSize: '10px', fontWeight: 700, background: g.status === 'Resolved' ? '#DCFCE7' : '#FEE2E2', color: g.status === 'Resolved' ? '#166534' : '#991B1B', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{g.status}</span>
                                </div>
                                <span style={{ fontSize: '11px', color: '#94A3B8' }}>{new Date(g.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>{g.subject}</h4>
                            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{g.description}</p>
                            
                            {g.adminReply && (
                                <div style={{ marginTop: '10px', padding: '10px', background: 'white', borderLeft: '3px solid #0EA5E9', borderRadius: '6px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#0EA5E9', marginBottom: '2px', textTransform: 'uppercase' }}>Admin Reply</div>
                                    <p style={{ fontSize: '12px', color: '#334155', margin: 0 }}>{g.adminReply}</p>
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
