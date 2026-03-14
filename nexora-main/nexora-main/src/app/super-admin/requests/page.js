'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Clock, Search, Eye, Filter, Loader2, Hospital, Mail, Phone, ExternalLink, Image as ImageIcon } from 'lucide-react';

export default function DemoRequestsPage() {
    const router = useRouter();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // ID of request being acted upon
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('Pending');

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/demo-request/list');
            if (res.status === 401 || res.status === 403) { router.replace('/login'); return; }
            const data = await res.json();
            if (data.ok) setRequests(data.requests);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => { fetchRequests(); }, [fetchRequests]);

    const handleAction = async (id, action) => {
        if (!confirm(`Are you sure you want to ${action} this request? An email will be sent automatically.`)) return;

        setActionLoading(id);
        try {
            const endpoint = `/api/demo-request/${id}/${action.toLowerCase()}`;
            const res = await fetch(endpoint, { method: 'POST' });
            const data = await res.json();
            if (data.ok) {
                alert(`Request ${action}d successfully. Email sent!`);
                fetchRequests();
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err) {
            alert('Failed to perform action.');
        } finally {
            setActionLoading(null);
        }
    };

    const filtered = requests.filter(req => {
        if (filter !== 'All' && req.status !== filter) return false;
        const s = search.toLowerCase();
        return req.hospitalName.toLowerCase().includes(s) || req.email.toLowerCase().includes(s);
    });

    return (
        <div className="fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Demo Requests</h1>
                    <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>Review, approve, and auto-provision 15-day free hospital demos.</p>
                </div>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
                    <Search size={16} strokeWidth={2.5} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input type="text" placeholder="Search naming or email..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#FFFFFF', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                    {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            style={{ padding: '12px 18px', border: 'none', background: filter === f ? '#F1F5F9' : 'transparent', color: filter === f ? '#0F172A' : '#64748B', fontSize: '13.5px', fontWeight: filter === f ? 600 : 500, cursor: 'pointer', borderRight: f !== 'Rejected' ? '1px solid #E2E8F0' : 'none', flex: 1 }}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hospital Details</th>
                                <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Info</th>
                                <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Received On</th>
                                <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#94A3B8' }}>
                                        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                                        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                                        Loading requests...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '48px 20px', textAlign: 'center', color: '#94A3B8' }}>
                                        <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', background: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Filter size={20} color="#CBD5E1" />
                                        </div>
                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#64748B' }}>No requests found</p>
                                        <p style={{ margin: '4px 0 0', fontSize: '13px' }}>There are no {filter.toLowerCase()} demo requests at this time.</p>
                                    </td>
                                </tr>
                            ) : filtered.map(req => {
                                const statusColors = {
                                    'Pending': { bg: '#FEF9C3', color: '#854D0E', icon: Clock },
                                    'Approved': { bg: '#D1FAE5', color: '#065F46', icon: CheckCircle },
                                    'Rejected': { bg: '#FEE2E2', color: '#991B1B', icon: XCircle }
                                };
                                const Sc = statusColors[req.status] || statusColors['Pending'];
                                const Icon = Sc.icon;

                                return (
                                    <tr key={req.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {req.logoUrl ? (
                                                    <img src={req.logoUrl} alt="logo" style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '6px', background: '#fff', border: '1px solid #E2E8F0' }} />
                                                ) : (
                                                    <div style={{ width: '36px', height: '36px', background: '#F1F5F9', color: '#94A3B8', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Hospital size={16} />
                                                    </div>
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#0F172A', marginBottom: '2px' }}>{req.hospitalName}</div>
                                                    {req.heroImage && (
                                                        <a href={req.heroImage} target="_blank" rel="noreferrer" style={{ fontSize: '11.5px', color: '#3B82F6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <ImageIcon size={10} /> View Hero Image
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ fontSize: '13.5px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                                <Mail size={13} color="#94A3B8" /> {req.email}
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Phone size={13} color="#94A3B8" /> {req.phone}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px', fontSize: '13.5px', color: '#475569' }}>
                                            {req.createdAt ? new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 10px', background: Sc.bg, color: Sc.color, borderRadius: '8px', fontSize: '12.5px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                                <Icon size={14} /> {req.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                            {req.status === 'Pending' ? (
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                    <button onClick={() => handleAction(req.id, 'Approve')} disabled={actionLoading === req.id}
                                                        style={{ padding: '8px 14px', background: '#10B981', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: actionLoading === req.id ? 'not-allowed' : 'pointer', opacity: actionLoading === req.id ? 0.7 : 1, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                        {actionLoading === req.id ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={14} />} Approve
                                                    </button>
                                                    <button onClick={() => handleAction(req.id, 'Reject')} disabled={actionLoading === req.id}
                                                        style={{ padding: '8px 14px', background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#64748B', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: actionLoading === req.id ? 'not-allowed' : 'pointer', opacity: actionLoading === req.id ? 0.7 : 1 }}>
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: '13px', color: '#94A3B8' }}>Handled</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
