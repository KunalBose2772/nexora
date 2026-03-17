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
    Loader2
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
        { label: 'Cervical Dilation', value: '6 cm', status: 'Active', color: '#EC4899' },
        { label: 'Fetal Heart Rate', value: '142 BPM', status: 'Optimal', color: '#6366F1' },
        { label: 'Contractions', value: '3 / 10m', status: 'Steady', color: '#10B981' },
        { label: 'Admission Time', value: new Date(caseData.admissionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'Admitted', color: '#F59E0B' },
    ];

    return (
        <div className="fade-in pb-20">
            <style>{`
                .monitoring-card { background: #fff; border-radius: 20px; border: 1px solid rgba(0,0,0,0.05); padding: 24px; }
                .tab-inactive { color: #94A3B8; font-weight: 700; padding-bottom: 8px; border-bottom: 2px solid transparent; cursor: pointer; transition: all 0.2s; }
                .tab-active { color: #EC4899; font-weight: 800; padding-bottom: 8px; border-bottom: 2px solid #EC4899; cursor: pointer; }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link href="/maternity" style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#EC4899', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Labor Monitoring Terminal</div>
                        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: 0 }}>{caseData.patient?.firstName} {caseData.patient?.lastName}</h1>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Link href={`/maternity/partograph/${id}`} className="btn btn-secondary shadow-sm" style={{ background: '#fff' }}>
                        <LineChart size={18} /> VIEW PARTOGRAPH
                    </Link>
                    <button className="btn btn-primary" style={{ background: '#EC4899', borderColor: '#EC4899' }} onClick={() => handleUpdateStatus('Delivered')}>
                        <Baby size={18} /> MARK AS DELIVERED
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                {VITAL_CARDS.map((v, i) => (
                    <div key={i} className="monitoring-card shadow-premium">
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px' }}>{v.label}</div>
                        <div style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>{v.value}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: v.color }} />
                            <span style={{ fontSize: '11px', fontWeight: 800, color: v.color }}>{v.status}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
                <div>
                    <div className="monitoring-card mb-8">
                        <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #F1F5F9', marginBottom: '24px' }}>
                            <div className="tab-active text-[13px] uppercase tracking-wider">Labor Progression</div>
                            <div className="tab-inactive text-[13px] uppercase tracking-wider">Maternal Vitals</div>
                            <div className="tab-inactive text-[13px] uppercase tracking-wider">Medication/Fluids</div>
                        </div>
                        
                        <div style={{ padding: '0 0 20px 20px', borderLeft: '2px solid #F1F5F9', position: 'relative' }}>
                            {[
                                { time: '14:30', event: 'Internal Examination', detail: 'Cervix 6cm dilated. Membranes ruptured. Liquor clear.', nurse: 'Nurse Mary' },
                                { time: '13:00', event: 'Admission & Triage', detail: 'Patient admitted in active labor. Gravida 2 Para 1.', nurse: 'Nurse Alex' },
                            ].map((item, idx) => (
                                <div key={idx} style={{ position: 'relative', marginBottom: '32px' }}>
                                    <div style={{ position: 'absolute', left: '-27px', top: '0', width: '12px', height: '12px', borderRadius: '50%', background: '#fff', border: '2px solid #EC4899' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>{item.event}</div>
                                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>{item.time}</div>
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>{item.detail}</div>
                                    <div style={{ fontSize: '11px', color: '#EC4899', fontWeight: 800, marginTop: '8px', textTransform: 'uppercase' }}>Observed By: {item.nurse}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="monitoring-card bg-slate-900 border-none text-white p-8">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <ShieldAlert size={28} className="text-pink-500" />
                            <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>Clinical Alert Protocol</h3>
                        </div>
                        <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '24px' }}>
                            Labor is currently in the "Active Phase". Any descent of fetal heart rate below 110 BPM must be immediately escalated to the Consultant Obstetrician per Protocol OB-04.
                        </p>
                        <div style={{ padding: '16px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
                            <div style={{ fontSize: '11px', fontWeight: 800, color: '#EC4899', textTransform: 'uppercase' }}>Emergency Response</div>
                            <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '4px' }}>NICU Team on Standby (OT-3 Ready)</div>
                        </div>
                    </div>
                </div>

                <div className="monitoring-card">
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '0.05em' }}>Maternal Bio-Context</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '16px' }}>
                            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Obstetric History</div>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>G{caseData.gravida} P{caseData.para} L{caseData.living} A{caseData.abortion}</div>
                        </div>
                        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '16px' }}>
                            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Expected Delivery (EDD)</div>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>{new Date(caseData.edd).toLocaleDateString()}</div>
                        </div>
                        <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '16px' }}>
                            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Blood Group</div>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>{caseData.patient?.bloodGroup || 'Not Recorded'}</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #F1F5F9' }}>
                        <button className="btn btn-secondary w-full mb-4" style={{ height: '48px', fontSize: '13px', fontWeight: 800 }}>
                            ORDER PREPARATORY LABS
                        </button>
                        <button className="btn btn-secondary w-full" style={{ height: '48px', fontSize: '13px', fontWeight: 800, color: '#EF4444' }}>
                            REASSIGN TO EMERGENCY OT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
