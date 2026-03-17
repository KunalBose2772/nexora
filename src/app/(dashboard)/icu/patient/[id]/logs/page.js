'use client';

import { 
    Activity, 
    Heart, 
    Wind, 
    Thermometer, 
    ChevronLeft, 
    RefreshCw, 
    Download,
    Calendar,
    ArrowUpRight,
    Loader2,
    Activity as ActivityIcon
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ICUPatientLogs() {
    const { id } = useParams();
    const router = useRouter();
    const [history, setHistory] = useState([]);
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            // Get appointment details
            const apptRes = await fetch(`/api/emergency/${id}`);
            if (apptRes.ok) {
                const apptData = await apptRes.json();
                const appt = apptData.appointment;
                setAppointment(appt);

                // Get monitoring history using the internal DB ID
                const histRes = await fetch(`/api/icu/monitoring?appointmentId=${appt.id}`);
                if (histRes.ok) {
                    const histData = await histRes.json();
                    setHistory(histData.history || []);
                }
            }
        } catch (error) {
            console.error('Failed to load ICU logs:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { loadData(); }, [loadData]);

    // Clinical fallback: If no history, use triage vitals from appointment
    const triage = appointment?.triageVitals ? JSON.parse(appointment.triageVitals) : {};
    const stats = history.length > 0 ? history[0] : {
        heartRate: triage.hr,
        systolicBP: triage.bp?.split('/')[0],
        diastolicBP: triage.bp?.split('/')[1],
        spo2: triage.spo2,
        temp: triage.temp
    };

    return (
        <div className="fade-in pb-20">
            <style jsx>{`
                .trend-line { 
                    stroke-width: 2; 
                    fill: none; 
                    stroke-linecap: round; 
                    stroke-linejoin: round; 
                    transition: all 0.5s ease;
                }
                .point-dot { transition: r 0.2s ease; cursor: pointer; }
                .point-dot:hover { r: 6; }
                
                @media (max-width: 768px) {
                    .mobile-micro-text { font-size: 9px !important; }
                    .mobile-small-text { font-size: 11px !important; }
                    .chart-container { height: 180px !important; }
                    .registry-card { border-radius: 12px !important; }
                    .vital-chip { padding: 10px !important; }
                }
            `}</style>

            <div className="dashboard-header-row mb-10">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => router.back()} style={{ border: 'none', background: '#fff', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <ChevronLeft size={20} color="var(--color-navy)" />
                    </button>
                    <div>
                        <h1 className="responsive-h1" style={{ margin: 0 }}>Clinical Trend Log</h1>
                        <p style={{ fontSize: '14px', color: '#64748B', margin: '4px 0 0 0', fontWeight: 500 }}>
                            Patient: <span style={{ color: 'var(--color-navy)', fontWeight: 600 }}>{appointment?.patientName || 'Loading...'}</span> — {appointment?.apptCode}
                        </p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button onClick={loadData} className="btn btn-secondary shadow-sm" style={{ background: '#fff', borderRadius: '12px', height: '44px' }}>
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button className="btn btn-primary" style={{ background: 'var(--color-navy)', border: 'none', borderRadius: '12px', height: '44px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={16} /> Export clinical data
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '100px', textAlign: 'center' }}>
                    <Loader2 size={40} className="animate-spin" style={{ color: 'var(--color-navy)', opacity: 0.2, margin: '0 auto' }} />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left - Vitals Summary Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Current Parameters</div>
                        
                        <div className="space-y-4">
                            {[
                                { label: 'Heart Rate', value: stats.heartRate || '--', unit: 'bpm', icon: Heart, color: '#EF4444', bg: '#FEF2F2' },
                                { label: 'Blood Pressure', value: `${stats.systolicBP || '--'}/${stats.diastolicBP || '--'}`, unit: 'mmHg', icon: Activity, color: '#3B82F6', bg: '#F0F9FF' },
                                { label: 'O2 Saturation', value: stats.spo2 || '--', unit: '%', icon: Wind, color: '#0EA5E9', bg: '#F0F9FF' },
                                { label: 'Temperature', value: stats.temp || '--', unit: '°C', icon: Thermometer, color: '#F59E0B', bg: '#FFFBEB' },
                            ].map((v, i) => (
                                <div key={i} className="card vital-chip shadow-premium" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px' }}>
                                    <div style={{ width: '44px', height: '44px', background: v.bg, color: v.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <v.icon size={22} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '11px', fontWeight: 550, color: '#94A3B8', textTransform: 'uppercase' }}>{v.label}</div>
                                        <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-navy)' }}>
                                            {v.value} <span style={{ fontSize: '12px', fontWeight: 500, opacity: 0.5 }}>{v.unit}</span>
                                        </div>
                                    </div>
                                    <ActivityIcon size={24} style={{ opacity: 0.1 }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right - Interactive Charts */}
                    <div className="lg:col-span-2 space-y-8">
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Clinical Progression (Last 24 Reading)</div>
                        
                        <div className="card shadow-premium chart-container" style={{ padding: '32px', height: '320px', border: '1px solid #F1F5F9', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', margin: 0 }}>HR & SpO2 Integration</h3>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
                                        <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Heart Rate</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0EA5E9' }} />
                                        <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Sat. SpO2</span>
                                    </div>
                                </div>
                            </div>
                            
                            {history.length > 1 ? (
                                <svg width="100%" height="200" style={{ overflow: 'visible' }}>
                                    <defs>
                                        <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.1" />
                                            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    
                                    {/* Grid Lines */}
                                    {[0, 25, 50, 75, 100].map(p => (
                                        <line key={p} x1="0" y1={p * 2} x2="100%" y2={p * 2} stroke="#F1F5F9" strokeWidth="1" />
                                    ))}

                                    {/* HR Line */}
                                    <path 
                                        className="trend-line" 
                                        d={(() => {
                                            const pts = history.slice().reverse().map((h, i) => {
                                                const x = (i / (history.length - 1)) * 100;
                                                const y = 200 - ((h.heartRate || 60) / 180) * 200;
                                                return `${i === 0 ? 'M' : 'L'} ${x}% ${y}`;
                                            });
                                            return pts.join(' ');
                                        })()}
                                        stroke="#EF4444"
                                    />

                                    {/* SpO2 Line */}
                                    <path 
                                        className="trend-line" 
                                        d={(() => {
                                            const pts = history.slice().reverse().map((h, i) => {
                                                const x = (i / (history.length - 1)) * 100;
                                                const y = 200 - ((h.spo2 || 90) / 100) * 200;
                                                return `${i === 0 ? 'M' : 'L'} ${x}% ${y}`;
                                            });
                                            return pts.join(' ');
                                        })()}
                                        stroke="#0EA5E9"
                                    />
                                </svg>
                            ) : (
                                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '12px' }}>
                                    Insufficient data points for trend visualization.
                                </div>
                            )}

                             <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                                {history.slice(0, 5).reverse().map((h, i) => (
                                    <div key={i} style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 500 }}>
                                        {new Date(h.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Events List */}
                        <div className="card shadow-premium" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', background: '#FAFBFC' }}>
                                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy)', margin: 0 }}>Recent Parameter Logging</h3>
                            </div>
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {history.map((h, i) => (
                                    <div key={i} style={{ padding: '16px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy)' }}>Vital Batch Sync</div>
                                            <div style={{ fontSize: '11px', color: '#94A3B8' }}>{new Date(h.recordedAt).toLocaleString()} — {h.recordedBy || 'System'}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#EF4444' }}>{h.heartRate} <span style={{ fontSize: '10px', fontWeight: 500, opacity: 0.6 }}>HR</span></div>
                                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0EA5E9' }}>{h.spo2}% <span style={{ fontSize: '10px', fontWeight: 500, opacity: 0.6 }}>SpO2</span></div>
                                            <ArrowUpRight size={14} color="#CBD5E1" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
