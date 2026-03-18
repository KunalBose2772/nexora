'use client';

import { 
    Activity, 
    ArrowLeft, 
    Zap, 
    Wind, 
    Thermometer, 
    Droplets, 
    ShieldAlert, 
    Monitor, 
    Clock,
    RefreshCw,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';

export default function TheaterTelemetryPage() {
    const { room } = useParams();
    const [loading, setLoading] = useState(true);
    const [vitals, setVitals] = useState({
        temp: 20.4,
        humidity: 48,
        airCycles: 22.4,
        hepaHealth: 98.6,
        positivePressure: '32 Pa',
        currentProcedure: 'Idle / No Active Case'
    });

    const fetchCurrentProcedure = useCallback(async () => {
        try {
            const res = await fetch('/api/ot');
            const data = await res.json();
            if (res.ok && data.surgeries) {
                // Find the latest ongoing or scheduled surgery for this specific room
                const activeCase = data.surgeries.find(s => 
                    s.otRoom === room && 
                    (s.status === 'Ongoing' || s.status === 'In Progress' || s.status === 'Scheduled')
                );
                
                if (activeCase) {
                    setVitals(prev => ({
                        ...prev,
                        currentProcedure: activeCase.procedureName
                    }));
                }
            }
        } catch (err) {
            console.error('Failed to fetch procedure:', err);
        }
    }, [room]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            fetchCurrentProcedure();
        }, 1200);
        return () => clearTimeout(timer);
    }, [fetchCurrentProcedure]);

    const STATUS_CARDS = [
        { label: 'Ambient Temperature', value: `${vitals.temp}°C`, sub: 'Set Point: 20°C', icon: Thermometer, color: '#3B82F6' },
        { label: 'Relative Humidity', value: `${vitals.humidity}%`, sub: 'Optimal (40-60%)', icon: Droplets, color: '#10B981' },
        { label: 'Air Exchange', value: `${vitals.airCycles}/hr`, sub: 'Target: 20/hr', icon: Wind, color: '#8B5CF6' },
        { label: 'HEPA Status', value: `${vitals.hepaHealth}%`, sub: 'Filter Integrity', icon: ShieldAlert, color: '#F59E0B' },
    ];

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <Monitor size={48} className="animate-pulse" style={{ color: '#E2E8F0', marginBottom: '16px' }} />
                <div style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 600 }}>Syncing room telemetry sensors...</div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <style>{`
                .telemetry-card { 
                    background: #fff; 
                    border-radius: 24px; 
                    border: 1px solid rgba(0,0,0,0.05); 
                    padding: 24px; 
                    position: relative; 
                    overflow: hidden; 
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .telemetry-card:hover { 
                    transform: translateY(-4px); 
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02); 
                }
                .metric-icon-box { 
                    width: 48px; 
                    height: 48px; 
                    border-radius: 14px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    margin-bottom: 20px;
                }
                .live-indicator { 
                    width: 10px; 
                    height: 10px; 
                    border-radius: 50%; 
                    background: #10B981; 
                    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
                    animation: pulse 2s infinite; 
                }
                @keyframes pulse { 
                    0% { transform: scale(1); opacity: 1; } 
                    50% { transform: scale(1.4); opacity: 0.5; } 
                    100% { transform: scale(1); opacity: 1; } 
                }
                .vitals-grid { 
                    display: grid; 
                    grid-template-columns: repeat(4, 1fr); 
                    gap: 24px; 
                    margin-bottom: 32px; 
                }
                @media (max-width: 1200px) { .vitals-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 768px) { .vitals-grid { grid-template-columns: 1fr; } }
                
                .procedure-badge {
                    background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
                    color: #fff;
                    padding: 12px 20px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }
                .log-row {
                    padding: 16px 20px;
                    border-bottom: 1px solid #F1F5F9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: background 0.2s;
                }
                .log-row:hover { background: #F8FAFC; }
                .log-row:last-child { border-bottom: none; }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link href="/ot" className="btn btn-secondary shadow-sm" style={{ width: '48px', height: '48px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0' }}>
                        <ArrowLeft size={22} color="#1E293B" />
                    </Link>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                            <h1 className="responsive-h1" style={{ margin: 0, fontSize: '28px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>Theater Telemetry — {room}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ECFDF5', padding: '4px 12px', borderRadius: '20px', border: '1px solid #A7F3D0' }}>
                                <div className="live-indicator" />
                                <span style={{ fontSize: '10px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Real-time Feed Active</span>
                            </div>
                        </div>
                        <p style={{ fontSize: '15px', color: '#64748B', margin: 0, fontWeight: 500 }}>Sterile field environmental metrics and perioperative environmental safety logs.</p>
                    </div>
                </div>
                <div>
                    <div className="procedure-badge">
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Activity size={18} color="#00C2FF" />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Procedure</div>
                            <div style={{ fontSize: '14px', fontWeight: 800 }}>{vitals.currentProcedure}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="vitals-grid">
                {STATUS_CARDS.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="telemetry-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div className="metric-icon-box" style={{ background: `${card.color}10`, color: card.color }}>
                                    <Icon size={24} />
                                </div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {[1, 2, 3].map(dot => (
                                        <div key={dot} style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#F1F5F9' }} />
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                                <div style={{ fontSize: '36px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em' }}>{card.value}</div>
                            </div>
                            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '12px' }}>{card.label}</div>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                padding: '8px 12px', 
                                background: '#F8FAFC', 
                                borderRadius: '10px', 
                                fontSize: '11px', 
                                color: '#94A3B8', 
                                fontWeight: 600 
                            }}>
                                <CheckCircle2 size={12} color="#10B981" />
                                {card.sub}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
                <div className="telemetry-card" style={{ padding: '0' }}>
                    <div style={{ padding: '24px 32px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Zap size={20} color="#00C2FF" />
                            </div>
                            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Sterile Barrier Activity Log</h3>
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>LAST 4 EVENTS</div>
                    </div>
                    <div style={{ padding: '8px 0' }}>
                        {[
                            { time: '14:22:01', event: 'Primary door interlocking active', status: 'Secure', color: '#10B981' },
                            { time: '14:18:45', event: 'Positive pressure drop detected (Interlock-B)', status: 'Warning', color: '#F59E0B' },
                            { time: '14:15:20', event: 'Surgical light luminosity recalibrated', status: 'Success', color: '#10B981' },
                            { time: '14:10:05', event: 'Air exchange cycle complete (Cycle #412)', status: 'Success', color: '#10B981' },
                        ].map((log, i) => (
                            <div key={i} className="log-row">
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', fontFamily: 'JetBrains Mono, monospace', background: '#F8FAFC', padding: '4px 8px', borderRadius: '6px' }}>{log.time}</div>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>{log.event}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: log.color, textTransform: 'uppercase' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: log.color }} />
                                    {log.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="telemetry-card" style={{ background: '#0F172A', color: '#fff', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
                        <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', alignItems: 'center' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(0, 194, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <AlertCircle size={22} color="#00C2FF" />
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.01em' }}>Atmospheric Integrity</div>
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '10px' }}>
                                <span style={{ opacity: 0.7, fontWeight: 600 }}>Positive Pressure Check</span>
                                <span style={{ color: '#00C2FF', fontWeight: 800 }}>100% SECURE</span>
                            </div>
                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', padding: '2px' }}>
                                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #00C2FF 0%, #3B82F6 100%)', borderRadius: '2px' }} />
                            </div>
                        </div>
                        <div style={{ fontSize: '13px', lineHeight: 1.6, color: '#94A3B8', fontWeight: 500 }}>
                            Environmental sensors are calibrated to <span style={{ color: '#fff' }}>ISO Class 5</span> standards. All non-compliance events are tagged in the Command Hub.
                        </div>
                    </div>

                    <div className="telemetry-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle2 size={16} color="#10B981" />
                            </div>
                            <span style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>Hardware Diagnostics</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Anesthesia</div>
                                <div style={{ fontSize: '13px', fontWeight: 800, color: '#10B981' }}>ONLINE</div>
                            </div>
                            <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Ventilator</div>
                                <div style={{ fontSize: '13px', fontWeight: 800, color: '#10B981' }}>ONLINE</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
