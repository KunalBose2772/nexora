'use client';
import { useState, useEffect } from 'react';
import { ShieldCheck, Fingerprint, CreditCard, Users, Clock, History, Settings, UserPlus, Search, RefreshCw, X, CheckCircle, AlertCircle, Play } from 'lucide-react';

const ATTENDANCE_METHODS = { RFID: 'CreditCard', Biometric: 'Fingerprint', Manual: 'ShieldCheck' };
const inputStyle = { width: '100%', padding: '12px 16px', border: '1px solid var(--color-border-light)', borderRadius: '10px', outline: 'none', fontSize: '14px', background: '#fff' };
const labelStyle = { display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: 600, color: 'var(--color-text-secondary)' };

export default function AttendancePage() {
    const [staff, setStaff] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('live'); // 'live' | 'mapping' | 'terminal'
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    // Terminal Sim State
    const [simInput, setSimInput] = useState('');
    const [simMethod, setSimMethod] = useState('RFID');
    const [simMessage, setSimMessage] = useState(null); // { type, text }
    const [simProcessing, setSimProcessing] = useState(false);

    // Mapping State
    const [editingStaff, setEditingStaff] = useState(null);
    const [mappingForm, setMappingForm] = useState({ rfidTag: '', biometricId: '' });
    const [mappingSaving, setMappingSaving] = useState(false);

    const fetchData = async () => {
        setRefreshing(true);
        try {
            const [attRes, staffRes] = await Promise.all([
                fetch('/api/hrms/attendance'),
                fetch('/api/hr/staff')
            ]);
            if (attRes.ok) {
                const data = await attRes.json();
                setLogs(data.logs || []);
            }
            if (staffRes.ok) {
                const data = await staffRes.json();
                setStaff(data.staff || []);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); setRefreshing(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSimulate = async (e) => {
        e.preventDefault();
        setSimProcessing(true);
        setSimMessage(null);
        try {
            const res = await fetch('/api/hrms/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: simInput, method: simMethod, location: 'Hospital Main Gate' })
            });
            const data = await res.json();
            if (res.ok) {
                setSimMessage({ type: 'success', text: data.message });
                setSimInput('');
                fetchData();
            } else {
                setSimMessage({ type: 'error', text: data.error });
            }
        } catch (e) {
            setSimMessage({ type: 'error', text: 'Network failure. Biometric relay timed out.' });
        } finally { setSimProcessing(false); }
    };

    const handleSaveMapping = async (e) => {
        e.preventDefault();
        setMappingSaving(true);
        try {
            const res = await fetch('/api/hr/staff', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingStaff.id, rfidTag: mappingForm.rfidTag, biometricId: mappingForm.biometricId })
            });
            if (res.ok) {
                setEditingStaff(null);
                fetchData();
            } else {
                const data = await res.json();
                alert(data.error);
            }
        } finally { setMappingSaving(false); }
    };

    const currentOnDuty = staff.filter(s => s.shiftStarted);
    const filteredStaff = staff.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.userId.toLowerCase().includes(searchQuery.toLowerCase()) || (s.department || '').toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Biometric HRMS & Attendance</h1>
                    <p className="page-header__subtitle">Real-time shift management using RFID and Fingerprint authentication tracking.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={fetchData} disabled={refreshing}>
                        <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Sync Data
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('terminal')}>
                        <Play size={15} /> Device Simulator
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div className="stat-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(16,185,129,0.1)', color: '#059669', padding: '10px', borderRadius: '12px' }}><Users size={20} /></div>
                        <span className="badge badge-green">LIVE</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Staff On-Duty</p>
                    <h4 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>{currentOnDuty.length} <span style={{ fontSize: '14px', fontWeight: 500, color: '#94A3B8' }}>/ {staff.length}</span></h4>
                </div>
                <div className="stat-card" style={{ padding: '24px' }}>
                    <div style={{ background: 'rgba(14,165,233,0.1)', color: '#0284C7', padding: '10px', borderRadius: '12px', marginBottom: '12px', width: 'fit-content' }}><Fingerprint size={20} /></div>
                    <p style={{ fontSize: '13px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Biometric Coverage</p>
                    <h4 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>{Math.round((staff.filter(s => s.biometricId || s.rfidTag).length / staff.length) * 100 || 0)}%</h4>
                </div>
                <div className="stat-card" style={{ padding: '24px' }}>
                    <div style={{ background: 'rgba(245,158,11,0.1)', color: '#D97706', padding: '10px', borderRadius: '12px', marginBottom: '12px', width: 'fit-content' }}><Clock size={20} /></div>
                    <p style={{ fontSize: '13px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Response</p>
                    <h4 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>&lt; 200ms</h4>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #E2E8F0', marginBottom: '24px' }}>
                <button onClick={() => setActiveTab('live')} style={{ padding: '12px 4px', border: 'none', background: 'none', borderBottom: activeTab === 'live' ? '2px solid var(--color-cyan)' : '2px solid transparent', color: activeTab === 'live' ? 'var(--color-navy)' : '#64748B', fontWeight: activeTab === 'live' ? 700 : 500, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><History size={16} /> Activity Ledger</button>
                <button onClick={() => setActiveTab('mapping')} style={{ padding: '12px 4px', border: 'none', background: 'none', borderBottom: activeTab === 'mapping' ? '2px solid var(--color-cyan)' : '2px solid transparent', color: activeTab === 'mapping' ? 'var(--color-navy)' : '#64748B', fontWeight: activeTab === 'mapping' ? 700 : 500, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Settings size={16} /> Device Management</button>
                <button onClick={() => setActiveTab('terminal')} style={{ padding: '12px 4px', border: 'none', background: 'none', borderBottom: activeTab === 'terminal' ? '2px solid var(--color-cyan)' : '2px solid transparent', color: activeTab === 'terminal' ? 'var(--color-navy)' : '#64748B', fontWeight: activeTab === 'terminal' ? 700 : 500, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Play size={16} /> Terminal Simulator</button>
            </div>

            <div style={{ minHeight: '400px' }}>
                {activeTab === 'live' && (
                    <div className="card" style={{ padding: '0' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)' }}>Real-time Logs</h3>
                            <div style={{ position: 'relative', width: '280px' }}>
                                <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                                <input type="text" placeholder="Search logs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...inputStyle, padding: '8px 12px 8px 36px', height: 'auto' }} />
                            </div>
                        </div>
                        <div className="data-table-wrapper" style={{ borderRadius: '0' }}>
                            <table className="data-table">
                                <thead style={{ background: '#F8FAFC' }}>
                                    <tr>
                                        <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Timestamp</th>
                                        <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Staff Member</th>
                                        <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Dept</th>
                                        <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Event</th>
                                        <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Method</th>
                                        <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.length === 0 ? (
                                        <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No activity logged yet. Use the simulator to generate events.</td></tr>
                                    ) : logs.map(log => (
                                        <tr key={log.id}>
                                            <td style={{ color: '#64748B', whiteSpace: 'nowrap', fontSize: '13px' }}>{new Date(log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} · {new Date(log.timestamp).toLocaleDateString()}</td>
                                            <td>
                                                <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '14px' }}>{log.user.name}</div>
                                                <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>{log.user.userId}</div>
                                            </td>
                                            <td><span className="badge badge-navy" style={{ background: '#F1F5F9', color: '#475569', fontSize: '11px' }}>{log.user.department || '—'}</span></td>
                                            <td>
                                                <span className={`badge ${log.type === 'ClockIn' ? 'badge-green' : 'badge-navy'}`} style={{ fontSize: '11px', padding: '3px 8px' }}>
                                                    {log.type === 'ClockIn' ? 'IN' : 'OUT'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                                                    {log.method === 'Biometric' ? <Fingerprint size={14} color="#0EA5E9" /> : log.method === 'RFID' ? <CreditCard size={14} color="#EC4899" /> : <ShieldCheck size={14} color="#475569" />}
                                                    {log.method}
                                                </div>
                                            </td>
                                            <td style={{ fontSize: '13px', color: '#64748B' }}>{log.location}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'mapping' && (
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)' }}>Staff Hardware Identifiers</h3>
                            <div style={{ position: 'relative', width: '300px' }}>
                                <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                                <input type="text" placeholder="Search staff by name or UHID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...inputStyle, paddingLeft: '40px' }} />
                            </div>
                        </div>
                        <div className="data-table-wrapper" style={{ borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
                            <table className="data-table">
                                <thead style={{ background: '#F8FAFC' }}>
                                    <tr>
                                        <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Staff Name</th>
                                        <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Role / Dept</th>
                                        <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>RFID Tag</th>
                                        <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Biometric ID</th>
                                        <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Shift Status</th>
                                        <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStaff.map(s => (
                                        <tr key={s.id}>
                                            <td style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '14px' }}>{s.name}</td>
                                            <td>
                                                <div style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>{s.role}</div>
                                                <div style={{ fontSize: '11px', color: '#94A3B8' }}>{s.department || 'Unassigned'}</div>
                                            </td>
                                            <td>
                                                {s.rfidTag ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0EA5E9', fontFamily: 'monospace', fontSize: '12px', fontWeight: 600 }}>
                                                        <CreditCard size={14} /> {s.rfidTag}
                                                    </div>
                                                ) : <span style={{ color: '#CBD5E1', fontSize: '12px' }}>Not Assigned</span>}
                                            </td>
                                            <td>
                                                {s.biometricId ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EC4899', fontFamily: 'monospace', fontSize: '12px', fontWeight: 600 }}>
                                                        <Fingerprint size={14} /> {s.biometricId}
                                                    </div>
                                                ) : <span style={{ color: '#CBD5E1', fontSize: '12px' }}>Not Bound</span>}
                                            </td>
                                            <td>
                                                <span className={`badge ${s.shiftStarted ? 'badge-green' : 'badge-navy'}`} style={{ color: s.shiftStarted ? '#059669' : '#64748B', opacity: s.shiftStarted ? 1 : 0.5, fontSize: '11px' }}>
                                                    {s.shiftStarted ? 'ACTIVE' : 'IDLE'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button className="btn btn-secondary btn-sm" style={{ padding: '5px 12px', fontSize: '12px' }} onClick={() => { setEditingStaff(s); setMappingForm({ rfidTag: s.rfidTag || '', biometricId: s.biometricId || '' }); }}>
                                                    Map Devices
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'terminal' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                        <div className="card" style={{ padding: '48px', background: 'var(--color-navy)', color: '#fff', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '440px', borderRadius: '24px' }}>
                            <div style={{ width: '100px', height: '100px', background: simProcessing ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s' }}>
                                {simMethod === 'Biometric' ? <Fingerprint size={50} className={simProcessing ? 'animate-pulse' : ''} color={simProcessing ? '#0EA5E9' : '#fff'} /> : <CreditCard size={50} className={simProcessing ? 'animate-pulse' : ''} color={simProcessing ? '#EC4899' : '#fff'} />}
                            </div>
                            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.02em' }}>{simMethod === 'Biometric' ? 'Biometric' : 'RFID'} Terminal</h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '300px', margin: '0 0 32px 0', fontSize: '14px', fontWeight: 500 }}>Please present your identification to the scanner to sync your check-in status.</p>
                            
                            <form onSubmit={handleSimulate} style={{ width: '100%', maxWidth: '320px' }}>
                                <div style={{ marginBottom: '20px', display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '4px' }}>
                                    <button type="button" onClick={() => setSimMethod('RFID')} style={{ flex: 1, padding: '10px', border: 'none', background: simMethod === 'RFID' ? '#fff' : 'transparent', color: simMethod === 'RFID' ? '#000' : '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', transition: 'all 0.2s' }}>RFID Card</button>
                                    <button type="button" onClick={() => setSimMethod('Biometric')} style={{ flex: 1, padding: '10px', border: 'none', background: simMethod === 'Biometric' ? '#fff' : 'transparent', color: simMethod === 'Biometric' ? '#000' : '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', transition: 'all 0.2s' }}>Biometric</button>
                                </div>
                                <input required type="text" placeholder={simMethod === 'RFID' ? "Swipe Card / Enter UID" : "Place Finger / Enter ID"} value={simInput} onChange={e => setSimInput(e.target.value)} style={{ ...inputStyle, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', textAlign: 'center', fontSize: '18px', fontWeight: 700, marginBottom: '20px', borderRadius: '12px' }} />
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: 800, background: '#fff', color: 'var(--color-navy)', border: 'none', borderRadius: '12px' }} disabled={simProcessing}>
                                    {simProcessing ? 'Encrypting & Syncing...' : 'Log Security Event'}
                                </button>
                            </form>

                            {simMessage && (
                                <div className="fade-in" style={{ marginTop: '24px', padding: '14px 20px', borderRadius: '12px', background: simMessage.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${simMessage.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {simMessage.type === 'success' ? <CheckCircle size={18} color="#34D399" /> : <AlertCircle size={18} color="#F87171" />}
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: simMessage.type === 'success' ? '#34D399' : '#F87171', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{simMessage.text}</span>
                                </div>
                            )}
                        </div>

                        <div className="card" style={{ padding: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ background: 'rgba(0,194,255,0.1)', color: 'var(--color-cyan)', padding: '8px', borderRadius: '10px' }}><UserPlus size={18} /></div>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)' }}>Staff Hardware Registry</h3>
                            </div>
                            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', marginBottom: '24px' }}>Use these registered hardware identifiers to simulate clinical staff clock-in/out events.</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {staff.length === 0 ? <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>No staff found in directory.</p> : staff.slice(0, 6).map(s => (
                                    <div key={s.id} style={{ padding: '16px', border: '1px solid #F1F5F9', borderRadius: '16px', transition: 'all 0.2s', background: '#FAFCFF' }}>
                                        <div style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--color-navy)', fontSize: '14px' }}>{s.name}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                            <span style={{ color: '#94A3B8', fontWeight: 600 }}>RFID: <strong style={{ color: s.rfidTag ? 'var(--color-cyan)' : '#CBD5E1', fontFamily: 'monospace' }}>{s.rfidTag || 'None'}</strong></span>
                                            <span style={{ color: '#94A3B8', fontWeight: 600 }}>BIO: <strong style={{ color: s.biometricId ? '#EC4899' : '#CBD5E1', fontFamily: 'monospace' }}>{s.biometricId || 'None'}</strong></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mapping Modal */}
            {editingStaff && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,18,32,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card fade-in" style={{ width: '100%', maxWidth: '440px', padding: '32px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>Register Hardware</h2>
                            <button onClick={() => setEditingStaff(null)} style={{ background: '#F1F5F9', border: 'none', cursor: 'pointer', color: '#64748B', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
                        </div>
                        <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px', lineHeight: 1.5 }}>Assign unique hardware identifiers for <span style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{editingStaff.name}</span> to enable biometric terminal access.</p>
                        <form onSubmit={handleSaveMapping} style={{ display: 'grid', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>RFID Card Access UID</label>
                                <input type="text" value={mappingForm.rfidTag} onChange={e => setMappingForm({ ...mappingForm, rfidTag: e.target.value })} placeholder="e.g. CARD_77201" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Biometric Fingerprint Reference</label>
                                <input type="text" value={mappingForm.biometricId} onChange={e => setMappingForm({ ...mappingForm, biometricId: e.target.value })} placeholder="e.g. BIO_REF_449" style={inputStyle} />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '12px', padding: '14px', fontWeight: 800, fontSize: '14px' }} disabled={mappingSaving}>{mappingSaving ? 'Syncing with Decives...' : 'Register Devices'}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
