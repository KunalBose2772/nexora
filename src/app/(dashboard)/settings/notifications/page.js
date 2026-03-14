'use client';
import { Bell, MessageSquare, Send, Mail, Smartphone, CheckCircle, Clock, XCircle, Filter, Search, RotateCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function NotificationCenterPage() {
    const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' or 'comms'
    const [notifications, setNotifications] = useState([]);
    const [comms, setComms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            // In a real app, these would be separate endpoints. For now, we'll fetch notifications 
            // and assume we'll build /api/notifications/logs for communications soon.
            const [notifRes, commRes] = await Promise.all([
                fetch('/api/notifications'), // existing but limited to 5
                fetch('/api/communications') // making this next
            ]);
            
            if (notifRes.ok) {
                const data = await notifRes.json();
                setNotifications(data.notifications || []);
            }
            if (commRes.ok) {
                const data = await commRes.json();
                setComms(data.communications || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredAlerts = notifications.filter(n => n.text.toLowerCase().includes(search.toLowerCase()));
    const filteredComms = comms.filter(c => 
        c.recipientName.toLowerCase().includes(search.toLowerCase()) || 
        c.message.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title">Communication & Alerts Center</h1>
                    <p className="page-header__subtitle">Track system-wide notifications and patient messaging logs.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button onClick={fetchData} className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        <RotateCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Logs
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <Send size={14} /> Send Manual Blast
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(0,194,255,0.1)', color: '#00C2FF', padding: '10px', borderRadius: '10px' }}><Bell size={20} /></div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#10B981' }}>{notifications.length} Unread</span>
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, margin: '0 0 4px 0' }}>Dashboard Alerts</p>
                        <h4 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Active System Feedback</h4>
                    </div>
                </div>
                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', padding: '10px', borderRadius: '10px' }}><MessageSquare size={20} /></div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>{comms.length} Total</span>
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, margin: '0 0 4px 0' }}>Outgoing Messages</p>
                        <h4 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Patient Communication</h4>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', padding: '0 24px' }}>
                    <button 
                        onClick={() => setActiveTab('alerts')}
                        style={{ padding: '18px 20px', border: 'none', background: 'transparent', fontSize: '14px', fontWeight: 600, color: activeTab === 'alerts' ? '#00C2FF' : '#64748B', borderBottom: activeTab === 'alerts' ? '2px solid #00C2FF' : 'none', cursor: 'pointer' }}
                    >
                        Active System Alerts
                    </button>
                    <button 
                        onClick={() => setActiveTab('comms')}
                        style={{ padding: '18px 20px', border: 'none', background: 'transparent', fontSize: '14px', fontWeight: 600, color: activeTab === 'comms' ? '#00C2FF' : '#64748B', borderBottom: activeTab === 'comms' ? '2px solid #00C2FF' : 'none', cursor: 'pointer' }}
                    >
                        Communication Logs (SMS/WA)
                    </button>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                            <input 
                                type="text" 
                                placeholder="Search logs..." 
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ padding: '8px 12px 8px 34px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', width: '220px' }} 
                            />
                        </div>
                    </div>
                </div>

                <div style={{ padding: '24px' }}>
                    {activeTab === 'alerts' ? (
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {filteredAlerts.length === 0 ? (
                                <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>No alerts found for current filters.</div>
                            ) : filteredAlerts.map(alert => (
                                <div key={alert.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid #F1F5F9', borderRadius: '12px', background: '#fff' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: alert.dot }}></div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>{alert.text}</div>
                                        <div style={{ fontSize: '12px', color: '#94A3B8' }}>{alert.time} • Nexora System Engine</div>
                                    </div>
                                    <button className="btn btn-secondary btn-sm" style={{ padding: '6px 12px' }}>Dismiss</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="data-table-container">
                            <table className="data-table">
                                <thead style={{ background: '#F8FAFC' }}>
                                    <tr>
                                        <th>Recipient & Channel</th>
                                        <th>Message Type</th>
                                        <th>Content Preview</th>
                                        <th>Delivery Status</th>
                                        <th>Time Dispatched</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredComms.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>No communication logs found in history.</td>
                                        </tr>
                                    ) : filteredComms.map(c => (
                                        <tr key={c.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {c.channel === 'SMS' ? <Smartphone size={14} color="#00C2FF" /> : c.channel === 'WhatsApp' ? <MessageSquare size={14} color="#10B981" /> : <Mail size={14} color="#F59E0B" />}
                                                    <div>
                                                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{c.recipientName}</div>
                                                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>{c.recipientPhone || c.recipientEmail}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', background: '#F1F5F9', borderRadius: '4px' }}>{c.type}</span></td>
                                            <td><div style={{ fontSize: '12px', color: '#64748B', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={c.message}>{c.message}</div></td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: c.status === 'Sent' ? '#10B981' : c.status === 'Pending' ? '#F59E0B' : '#EF4444' }}>
                                                    {c.status === 'Sent' ? <CheckCircle size={14} /> : c.status === 'Pending' ? <Clock size={14} /> : <XCircle size={14} />}
                                                    {c.status}
                                                </div>
                                            </td>
                                            <td style={{ fontSize: '12px', color: '#94A3B8' }}>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(c.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
