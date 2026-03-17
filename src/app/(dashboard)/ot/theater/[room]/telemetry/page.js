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
import { useState, useEffect, useParams } from 'react';

export default function TheaterTelemetryPage() {
    const { room } = useParams();
    const [loading, setLoading] = useState(true);
    const [vitals, setVitals] = useState({
        temp: 20.4,
        humidity: 48,
        airCycles: 22.4,
        hepaHealth: 98.6,
        positivePressure: '32 Pa',
        currentProcedure: 'Total Knee Replacement'
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

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
                .telemetry-card { background: #fff; border-radius: 20px; border: 1px solid rgba(0,0,0,0.05); padding: 24px; position: relative; overflow: hidden; }
                .live-indicator { width: 8px; height: 8px; border-radius: 50%; background: #10B981; animation: pulse 2s infinite; }
                @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
                .vitals-grid { display: grid; gridTemplateColumns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 32px; }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/ot" className="btn btn-secondary shadow-sm" style={{ width: '44px', height: '44px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h1 className="responsive-h1" style={{ margin: 0 }}>Theater Telemetry — {room}</h1>
                            <div className="live-indicator" />
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Real-time Feed Active</span>
                        </div>
                        <p style={{ fontSize: '14px', color: '#64748B', margin: '4px 0 0 0', fontWeight: 500 }}>Sterile field environmental metrics and perioperative environmental safety logs.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ padding: '8px 16px', background: 'var(--color-navy)', color: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Activity size={18} />
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase' }}>Current Procedure</div>
                            <div style={{ fontSize: '13px', fontWeight: 800 }}>{vitals.currentProcedure}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="vitals-grid">
                {STATUS_CARDS.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="telemetry-card shadow-premium">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${card.color}15`, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} />
                                </div>
                                <RefreshCw size={14} style={{ color: '#E2E8F0' }} />
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '4px' }}>{card.value}</div>
                            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>{card.label}</div>
                            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>{card.sub}</div>
                        </div>
                    );
                })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
                <div className="telemetry-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                        <Zap size={20} color="#00C2FF" />
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>Sterile Barrier Activity Log</h3>
                    </div>
                    <div style={{ border: '1px solid #F1F5F9', borderRadius: '16px', overflow: 'hidden' }}>
                        {[
                            { time: '14:22:01', event: 'Primary door interlocking active', status: 'Secure' },
                            { time: '14:18:45', event: 'Positive pressure drop detected (Interlock-B)', status: 'Alert' },
                            { time: '14:15:20', event: 'Surgical light luminosity recalibrated', status: 'Success' },
                            { time: '14:10:05', event: 'Air exchange cycle complete (Cycle #412)', status: 'Success' },
                        ].map((log, i) => (
                            <div key={i} style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', fontFamily: 'monospace' }}>{log.time}</div>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>{log.event}</div>
                                </div>
                                <span style={{ fontSize: '10px', fontWeight: 800, padding: '4px 10px', borderRadius: '10px', background: log.status === 'Alert' ? '#FEF2F2' : '#F0FDF4', color: log.status === 'Alert' ? '#EF4444' : '#10B981' }}>{log.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="telemetry-card" style={{ background: 'var(--color-navy)', color: '#fff' }}>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                            <AlertCircle size={24} color="#00C2FF" />
                            <div style={{ fontSize: '15px', fontWeight: 800 }}>Atmospheric Integrity</div>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', opacity: 0.8 }}>
                                <span>Positive Pressure Check</span>
                                <span>100% Secure</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: '100%', height: '100%', background: '#00C2FF' }} />
                            </div>
                        </div>
                        <div style={{ fontSize: '13px', lineHeight: 1.6, opacity: 0.8 }}>
                            Environmental sensors are calibrated to ISO Class 5 standards. All non-compliance events are tagged in the Command Hub.
                        </div>
                    </div>

                    <div className="telemetry-card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <CheckCircle2 size={18} color="#10B981" />
                            <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-navy)' }}>Hardware Diagnostics</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8' }}>Anesthesia Unit</div>
                                <div style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>Online</div>
                            </div>
                            <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8' }}>Bauter Vent</div>
                                <div style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>Online</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
