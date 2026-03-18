'use client';

import { 
    Heart, 
    ArrowLeft, 
    Activity, 
    Baby, 
    Clock, 
    Thermometer, 
    Droplets, 
    ShieldAlert, 
    LineChart,
    ChevronRight,
    Save,
    Loader2,
    MoveLeft,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function LaborCaseMonitoringPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [caseData, setCaseData] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchCase = async () => {
            try {
                const res = await fetch('/api/maternity/labor');
                const data = await res.json();
                if (res.ok) {
                    const c = data.cases.find(x => x.id === id);
                    setCaseData(c);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCase();
    }, [id]);

    const handleUpdateStatus = async (status) => {
        setSaving(true);
        // We'll simulate the status update for now as we don't have a PATCH endpoint for labor yet
        // but the UI should reflect the intent.
        setTimeout(() => {
            setSaving(false);
            router.push('/maternity');
        }, 800);
    };

    if (loading) return <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest"><Loader2 className="animate-spin mx-auto mb-4" /> Syncing Labor Record...</div>;
    if (!caseData) return <div className="p-12 text-center font-bold text-navy-900">Case not found.</div>;

    const VITAL_CARDS = [
        { label: 'Cervical Dilation', value: '6 cm', status: 'Active Phase', color: '#EC4899' },
        { label: 'Fetal Heart Rate', value: '142 BPM', status: 'Optimal', color: '#6366F1' },
        { label: 'Contractions', value: '3 / 10m', status: 'Normal', color: '#10B981' },
        { label: 'Admission Clock', value: new Date(caseData.admissionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'In Monitoring', color: '#F59E0B' },
    ];

    return (
        <div className="fade-in pb-20">
            <style jsx>{`
                .monitoring-card { 
                    background: #fff; 
                    border-radius: 24px; 
                    border: 1px solid #F1F5F9; 
                    padding: 24px; 
                    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
                }
                .tab-btn {
                    padding: 12px 20px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #94A3B8;
                    cursor: pointer;
                    transition: all 0.2s;
                    border-bottom: 2px solid transparent;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .tab-btn.active {
                    color: #EC4899;
                    border-bottom-color: #EC4899;
                }
                .timeline-dot {
                    position: absolute;
                    left: -27px;
                    top: 4px;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #fff;
                    border: 3px solid #EC4899;
                    box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1);
                }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link href="/maternity" style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', transition: 'all 0.2s' }}>
                        <MoveLeft size={20} />
                    </Link>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#EC4899', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Obstetric Monitoring Hub</div>
                        <h1 className="responsive-h1" style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>{caseData.patient?.firstName} {caseData.patient?.lastName} <span style={{ fontSize: '16px', color: '#94A3B8', fontWeight: 500, marginLeft: '12px' }}>#{caseData.patient?.patientCode}</span></h1>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Link href={`/maternity/partograph/${id}`} className="btn btn-secondary shadow-sm" style={{ background: '#fff', borderRadius: '12px' }}>
                        <LineChart size={18} /> PARTOGRAPH STREAM
                    </Link>
                    <button className="btn btn-primary shadow-premium" style={{ background: '#EC4899', borderColor: '#EC4899', borderRadius: '12px', padding: '0 24px' }} onClick={() => handleUpdateStatus('Delivered')}>
                        <Baby size={18} /> CONFIRM DELIVERY
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {VITAL_CARDS.map((v, i) => (
                    <div key={i} className="monitoring-card">
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>{v.label}</div>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>{v.value}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', padding: '8px 12px', background: `${v.color}10`, borderRadius: '10px', width: 'fit-content' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: v.color }} />
                            <span style={{ fontSize: '11px', fontWeight: 700, color: v.color, textTransform: 'uppercase' }}>{v.status}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div className="monitoring-card" style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #F1F5F9', marginBottom: '32px' }}>
                            <div className="tab-btn active">Evolution Timeline</div>
                            <div className="tab-btn">Maternal Vitals</div>
                            <div className="tab-btn">Clinical Rx</div>
                        </div>
                        
                        <div style={{ padding: '0 0 20px 24px', borderLeft: '2px solid #F1F5F9', position: 'relative', marginLeft: '12px' }}>
                            {[
                                { time: '14:30', event: 'Internal Examination', detail: 'Cervix 6cm dilated. Membranes ruptured. Liquor clear. Fetal head at -1 station.', staff: 'Dr. Sarah Mitchell' },
                                { time: '13:00', event: 'Registry Admission', detail: 'Patient admitted in active labor phase. Previous obstetric history clear. Initial screening reactive negative.', staff: 'Nurse Elena Rodriguez' },
                            ].map((item, idx) => (
                                <div key={idx} style={{ position: 'relative', marginBottom: '40px' }}>
                                    <div className="timeline-dot" />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>{item.event}</div>
                                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', background: '#F8FAFC', padding: '4px 10px', borderRadius: '8px' }}>{item.time}</div>
                                    </div>
                                    <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: '0 0 12px' }}>{item.detail}</p>
                                    <div style={{ fontSize: '11px', color: '#EC4899', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CheckCircle2 size={12} /> Logged By: {item.staff}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ background: '#0F172A', borderRadius: '28px', padding: '40px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShieldAlert size={26} style={{ color: '#EC4899' }} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Critical Response Protocol</h3>
                                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0' }}>Institutional Obstetric Standards • Ver 4.2</p>
                            </div>
                        </div>
                        <p style={{ fontSize: '15px', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '28px' }}>
                            Labor is transitioning. Continuous FHR monitoring is mandatory. Any deviation below 110 BPM or late decelerations requires immediate senior obstetrician oversight (Code Pink).
                        </p>
                        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '10px', fontWeight: 700, color: '#EC4899', textTransform: 'uppercase' }}>Emergency Response Unit</div>
                                <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>Neonatal Intensive Care Team Tagged</div>
                            </div>
                            <div style={{ padding: '6px 12px', background: '#EC4899', borderRadius: '8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>STANDBY</div>
                        </div>
                    </div>
                </div>

                <div className="monitoring-card" style={{ height: 'fit-content', padding: '32px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '0.1em' }}>Maternal Bio-Context</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '18px', border: '1px solid #F1F5F9' }}>
                            <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Obstetric Ledger</div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>G{caseData.gravida} P{caseData.para} L{caseData.living} A{caseData.abortion}</div>
                        </div>
                        <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '18px', border: '1px solid #F1F5F9' }}>
                            <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Expected Delivery (EDD)</div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{new Date(caseData.edd).toLocaleDateString()}</div>
                        </div>
                        <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '18px', border: '1px solid #F1F5F9' }}>
                            <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Biological Blood Group</div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{caseData.patient?.bloodGroup || 'Not Documented'}</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #F1F5F9' }}>
                        <button className="btn btn-secondary shadow-sm w-full mb-4" style={{ height: '54px', fontSize: '13px', fontWeight: 700, borderRadius: '16px', background: '#fff' }}>
                            <Save size={16} /> ORDER DIAGNOSTICS
                        </button>
                        <button className="btn w-full" style={{ height: '54px', fontSize: '13px', fontWeight: 700, borderRadius: '16px', background: '#FEF2F2', color: '#EF4444', border: '1px solid #FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <ArrowLeft size={16} /> MOVE TO EMERGENCY OT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
