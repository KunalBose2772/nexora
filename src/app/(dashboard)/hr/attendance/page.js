'use client';

import {
    Clock, UserCheck, UserX, Fingerprint,
    Calendar, Search, Loader2, MapPin,
    ArrowRightCircle, History, Filter,
    CheckCircle2, AlertCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AttendancePage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ present: 0, late: 0, onShift: 0 });

    const fetchData = async () => {
        try {
            const res = await fetch('/api/hr/attendance');
            const data = await res.json();
            if (res.ok) {
                setLogs(data.logs);
                // Basic stats calculation for display
                const onShiftCount = new Set(data.logs.filter(l => l.type === 'ClockIn').map(l => l.userId)).size
                    - new Set(data.logs.filter(l => l.type === 'ClockOut').map(l => l.userId)).size;
                setStats({
                    present: new Set(data.logs.map(l => l.userId)).size,
                    onShift: Math.max(0, onShiftCount),
                    late: data.logs.filter(l => l.method === 'Manual').length // Placeholder for lateness
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <Loader2 className="animate-spin" size={40} color="#3B82F6" />
        </div>
    );

    return (
        <div className="fade-in">
            <style>{`
                .att-card { background: #fff; border-radius: 20px; border: 1px solid rgba(0,0,0,0.05); padding: 24px; }
                .stat-box { background: #fff; border: 1px solid #F1F5F9; border-radius: 16px; padding: 20px; }
                .log-row { display: grid; grid-template-columns: 200px 100px 120px 140px 1fr; gap: 16px; padding: 16px; border-bottom: 1px solid #F1F5F9; align-items: center; }
                .type-in { color: #10B981; background: #ECFDF5; padding: 4px 8px; border-radius: 6px; font-weight: 800; font-size: 10px; text-transform: uppercase; }
                .type-out { color: #64748B; background: #F8FAFC; padding: 4px 8px; border-radius: 6px; font-weight: 800; font-size: 10px; text-transform: uppercase; }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Attendance & Rostering</h1>
                    <p style={{ color: '#64748B', margin: '4px 0 0', fontSize: '14px' }}>RFID & Biometric synced real-time logs</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary" style={{ background: '#3B82F6' }}>
                        <Fingerprint size={18} /> SYNC DEVICES
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                <div className="stat-box" style={{ borderLeft: '4px solid #3B82F6' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>On Shift Now</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#1E40AF', marginTop: '4px' }}>{stats.onShift} STAFF</div>
                </div>
                <div className="stat-box">
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Present Today</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>{stats.present}</div>
                </div>
                <div className="stat-box">
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Late Arrivals</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#EF4444', marginTop: '4px' }}>{stats.late}</div>
                </div>
                <div className="stat-box" style={{ background: '#F8FAFC' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Avg Roster Coverage</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>94%</div>
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '15px' }}>REAL-TIME LOGS</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', fontSize: '12px' }}><Filter size={14} /> FILTER</button>
                    </div>
                </div>

                <div className="fade-in">
                    <div className="log-row" style={{ fontWeight: 800, fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', background: '#F8FAFC' }}>
                        <span>Employee</span>
                        <span>Shift Type</span>
                        <span>Method</span>
                        <span>Timestamp</span>
                        <span>Location / Device</span>
                    </div>
                    {logs.map(log => (
                        <div key={log.id} className="log-row" style={{ fontSize: '13px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#3B82F6', fontSize: '12px' }}>
                                    {log.user?.name?.charAt(0)}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 700 }}>{log.user?.name}</span>
                                    <span style={{ fontSize: '10px', color: '#64748B' }}>{log.user?.role} • {log.user?.department}</span>
                                </div>
                            </div>
                            <div>
                                <span className={log.type === 'ClockIn' ? 'type-in' : 'type-out'}>
                                    {log.type === 'ClockIn' ? 'IN' : 'OUT'}
                                </span>
                            </div>
                            <div style={{ fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {log.method === 'RFID' && <Fingerprint size={14} color="#3B82F6" />}
                                {log.method}
                            </div>
                            <div style={{ fontWeight: 700 }}>
                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B' }}>
                                <MapPin size={14} /> {log.location}
                            </div>
                        </div>
                    ))}
                    {logs.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '100px', color: '#94A3B8' }}>
                            <Clock size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
                            <div>Waiting for shift logs...</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
