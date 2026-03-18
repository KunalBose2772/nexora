'use client';
import {
    Heart, Baby, Activity, Plus, Search,
    Filter, Clock, CheckCircle2, ChevronRight,
    Loader2, Users, LineChart, FileText,
    Calendar, Syringe, Clipboard, RefreshCw, LayoutDashboard, Database, Siren, MoveRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Skeleton from '@/components/common/Skeleton';

export default function MaternityDashboard() {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true); }, []);

    const [showAdmitModal, setShowAdmitModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [patients, setPatients] = useState([]);
    const [searchPT, setSearchPT] = useState('');
    const [selectedPT, setSelectedPT] = useState(null);
    const [form, setForm] = useState({
        edd: '',
        gravida: 0,
        para: 0,
        living: 0,
        abortion: 0
    });

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [lRes, pRes] = await Promise.all([
                fetch('/api/maternity/labor'),
                fetch('/api/patients')
            ]);
            const lData = await lRes.json();
            const pData = await pRes.json();
            if (lRes.ok) setCases(lData.cases || []);
            if (pRes.ok) setPatients(pData.patients || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const KPI_CARDS = [
        { id: 'active', label: 'Labor Active', value: cases.length, sub: 'Cases in monitoring', icon: Activity, color: '#EC4899' },
        { id: 'births', label: 'Neonatal Pulse', value: '4', sub: 'Births Today', icon: Baby, color: '#6366F1' },
        { id: 'discharge', label: 'Discharges', value: '12', sub: 'Mothers Home Today', icon: CheckCircle2, color: '#10B981' },
        { id: 'anc', label: 'ANC Continuum', value: '28', sub: 'OPD Active Visits', icon: Users, color: '#F59E0B' },
    ];

    return (
        <div className="fade-in">
            <style jsx>{`
                .kpi-card { 
                    background: #fff; 
                    border: 1px solid rgba(0,0,0,0.05); 
                    border-radius: 12px; 
                    padding: 24px; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.03); 
                    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .kpi-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.06); }

                .mch-case-card {
                    background: #fff;
                    border: 1px solid #F1F5F9;
                    border-radius: 16px;
                    padding: 24px;
                    transition: all 0.3s ease;
                }
                .mch-case-card:hover {
                    border-color: #EC489940;
                    box-shadow: 0 20px 40px rgba(236, 72, 153, 0.05);
                }

                .vital-indicator {
                    background: #F8FAFC;
                    padding: 12px;
                    border-radius: 10px;
                    border: 1px solid #F1F5F9;
                    text-align: center;
                }

                .modal-overlay-executive {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                    animation: fadeIn 0.2s ease-out;
                }
                .modal-card-executive {
                    background: #fff;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 500px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    overflow: hidden;
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

                .modal-header-executive {
                    padding: 16px 24px;
                    border-bottom: 1px solid #E2E8F0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #F8FAFC;
                }
                .modal-title-executive {
                    font-size: 15px;
                    font-weight: 600;
                    color: #0F172A;
                    margin: 0;
                }

                .label-executive { 
                    display: block; 
                    font-size: 12px; 
                    font-weight: 500; 
                    color: #475569; 
                    margin-bottom: 6px; 
                }
                .form-control-executive { 
                    width: 100%; 
                    border-radius: 6px; 
                    border: 1px solid #CBD5E1; 
                    padding: 8px 12px; 
                    font-size: 13px; 
                    font-weight: 400;
                    color: #0F172A;
                    outline: none; 
                    transition: border-color 0.2s;
                    background: #fff; 
                    height: 38px;
                }
                .form-control-executive:focus { 
                    border-color: #EC4899; 
                    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1); 
                }

                .btn-executive {
                    height: 38px;
                    padding: 0 20px;
                    font-size: 13px;
                    font-weight: 600;
                    border-radius: 6px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .search-result-item {
                    padding: 10px 14px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border-bottom: 1px solid #F1F5F9;
                }
                .search-result-item:hover { background: #FDF2F8; }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 className="responsive-h1" style={{ margin: 0, color: '#0F172A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <HandHeart size={32} style={{ color: '#EC4899' }} />
                        Maternity Command Hub
                    </h1>
                    <p style={{ margin: '4px 0 0', color: '#64748B', fontWeight: 500, fontSize: '15px' }}>{dateStr} • Strategic Perinatal & Obstetric Management</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary shadow-sm" style={{ background: '#fff', borderRadius: '12px' }} onClick={fetchData}>
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button className="btn btn-primary shadow-premium" style={{ background: '#EC4899', borderColor: '#EC4899', borderRadius: '12px', padding: '0 24px' }} onClick={() => setShowAdmitModal(true)}>
                        <Plus size={18} /> ADMIT TO LABOR
                    </button>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {KPI_CARDS.map(card => {
                    const Icon = card.icon;
                    return (
                        <div key={card.id} className="kpi-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} style={{ color: card.color }} />
                                </div>
                                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
                            </div>
                            <div style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', lineHeight: 1, marginBottom: '6px' }}>
                                {loading ? <Loader2 size={20} className="animate-spin text-muted" /> : card.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>{card.sub}</div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 flex flex-col gap-6">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '16px 24px', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                    <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Activity size={18} style={{ color: '#EC4899' }} />
                            Active Clinical Labor Registry
                        </h2>
                        <div style={{ position: 'relative', width: '280px' }}>
                            <Search size={14} style={{ position: 'absolute', left: '14px', top: '10px', color: '#94A3B8' }} />
                            <input type="text" placeholder="Filter cases by name..." style={{ width: '100%', padding: '8px 16px 8px 40px', background: '#F8FAFC', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, outline: 'none' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {loading ? [1, 2].map(i => <Skeleton key={i} height="200px" radius="24px" />) : (
                            cases.length === 0 ? (
                                <div style={{ background: '#fff', padding: '60px', borderRadius: '24px', textAlign: 'center', border: '1px dashed #E2E8F0' }}>
                                    <Activity size={48} style={{ color: '#E2E8F0', marginBottom: '16px' }} />
                                    <p style={{ margin: 0, color: '#94A3B8', fontSize: '14px', fontWeight: 500 }}>No active labor cases currently identified.</p>
                                </div>
                            ) : cases.map(c => (
                                <div key={c.id} className="mch-case-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                        <div style={{ display: 'flex', gap: '20px' }}>
                                            <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#FDF2F8', color: '#EC4899', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '20px', border: '1px solid #FBCFE8' }}>{c.patient?.firstName?.[0]}</div>
                                            <div>
                                                <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#0F172A', margin: 0 }}>{c.patient?.firstName} {c.patient?.lastName}</h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                                                    <span style={{ fontSize: '10px', fontWeight: 700, background: '#F1F5F9', color: '#64748B', padding: '4px 10px', borderRadius: '8px', textTransform: 'uppercase' }}>{c.patient?.patientCode}</span>
                                                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#EC4899', textTransform: 'uppercase', letterSpacing: '0.05em' }}>G{c.gravida} P{c.para} L{c.living} A{c.abortion}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Expected Delivery</span>
                                            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>{new Date(c.edd).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="vital-indicator">
                                            <div style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px' }}>Cervical Dilation</div>
                                            <div style={{ fontSize: '20px', fontWeight: 700, color: '#EC4899' }}>6 <span style={{ fontSize: '11px', opacity: 0.5 }}>cm</span></div>
                                        </div>
                                        <div className="vital-indicator">
                                            <div style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px' }}>Fetal Heart Rate</div>
                                            <div style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>142 <span style={{ fontSize: '11px', opacity: 0.5 }}>bpm</span></div>
                                        </div>
                                        <div className="vital-indicator">
                                            <div style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px' }}>Contractions</div>
                                            <div style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>3 <span style={{ fontSize: '11px', opacity: 0.5 }}>/ 10m</span></div>
                                        </div>
                                        <div className="vital-indicator">
                                            <div style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px' }}>Current Phase</div>
                                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#10B981' }}>Active</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                        <Link href={`/maternity/partograph/${c.id}`} className="btn btn-secondary shadow-sm" style={{ borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: '#fff' }}>
                                            <LineChart size={14} /> Partograph Stream
                                        </Link>
                                        <Link href={`/maternity/labor/${c.id}`} className="btn btn-primary shadow-premium" style={{ borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: '#0F172A', border: 'none' }}>
                                            Labor Command <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div style={{ background: '#0F172A', color: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.1)' }}>
                        <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Clipboard size={18} style={{ color: '#EC4899' }} /> Statistical Pulse
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { label: 'Natural Vaginal (NVD)', value: '82%', color: '#10B981' },
                                { label: 'Lower Segment CS', value: '15%', color: '#F59E0B' },
                                { label: 'Instrumental Aid', value: '3%', color: '#EC4899' }
                            ].map(stat => (
                                <div key={stat.label}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, marginBottom: '6px', color: '#94A3B8' }}>
                                        <span>{stat.label}</span>
                                        <span style={{ color: '#fff' }}>{stat.value}</span>
                                    </div>
                                    <div style={{ height: '5px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', background: stat.color, width: stat.value, borderRadius: '10px' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="kpi-card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Baby size={18} style={{ color: '#EC4899' }} /> Recent Arrivals
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '20px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#FDF2F8', color: '#EC4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Baby size={20} /></div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{i % 2 === 0 ? 'Female' : 'Male'} • 3.4 Kg</div>
                                        <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>Born: {isMounted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</div>
                                    </div>
                                    <ChevronRight size={16} color="#CBD5E1" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ background: '#FDF2F8', padding: '16px', borderRadius: '12px', border: '1px dashed #FBCFE8' }}>
                        <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#BE185D', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><Siren size={14} /> Institutional Alert</h3>
                        <p style={{ margin: 0, fontSize: '12px', fontWeight: 500, color: '#DB2777', lineHeight: 1.6 }}>Bi-monthly Perinatal Audit report is due in 48 hours. Ensure all birth registries are synchronized with central records.</p>
                    </div>
                </div>
            </div>

            {/* Admit Modal */}
            {showAdmitModal && (
                <div className="modal-overlay-executive">
                    <div className="modal-card-executive">
                        <div className="modal-header-executive">
                            <h2 className="modal-title-executive">Labor Ingress Protocol</h2>
                            <button onClick={() => setShowAdmitModal(false)} className="modal-close-btn" style={{ width: '30px', height: '30px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#fff', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Plus size={18} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>

                        <div style={{ padding: '24px' }}>
                            {!selectedPT ? (
                                <div style={{ marginBottom: '16px' }}>
                                    <label className="label-executive">Search Patient Registry</label>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
                                        <input 
                                            className="form-control-executive" 
                                            style={{ paddingLeft: '36px' }}
                                            placeholder="Enter Patient Name or UHID..."
                                            value={searchPT}
                                            onChange={e => setSearchPT(e.target.value)}
                                        />
                                        {searchPT && (
                                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', marginTop: '4px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 10, maxHeight: '180px', overflowY: 'auto' }}>
                                                {patients.filter(p => `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchPT.toLowerCase())).map(p => (
                                                    <div key={p.id} className="search-result-item" onClick={() => setSelectedPT(p)}>
                                                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{p.firstName} {p.lastName}</div>
                                                        <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 500 }}>{p.patientCode}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ background: '#FDF2F8', padding: '14px', borderRadius: '8px', border: '1px solid #FBCFE8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#BE185D' }}>{selectedPT.firstName} {selectedPT.lastName}</div>
                                        <div style={{ fontSize: '10px', color: '#EC4899', fontWeight: 500 }}>{selectedPT.patientCode}</div>
                                    </div>
                                    <button style={{ background: 'none', border: 'none', color: '#BE185D', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer', borderBottom: '1px solid' }} onClick={() => setSelectedPT(null)}>Reset Search</button>
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div style={{ margin: 0 }}>
                                    <label className="label-executive">Estimated EDD</label>
                                    <input type="date" className="form-control-executive" value={form.edd} onChange={e => setForm({...form, edd: e.target.value})} />
                                </div>
                                <div style={{ margin: 0 }}>
                                    <label className="label-executive">Gravida (G)</label>
                                    <input type="number" className="form-control-executive" value={form.gravida} onChange={e => setForm({...form, gravida: e.target.value})} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                                {['Para', 'Living', 'Abortion'].map(f => (
                                    <div key={f} style={{ margin: 0 }}>
                                        <label className="label-executive">{f}</label>
                                        <input type="number" className="form-control-executive" value={form[f.toLowerCase()]} onChange={e => setForm({...form, [f.toLowerCase()]: e.target.value})} />
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="btn-executive" style={{ flex: 1, background: '#fff', border: '1px solid #E2E8F0', color: '#64748B' }} onClick={() => setShowAdmitModal(false)}>Cancel</button>
                                <button 
                                    className="btn-executive" 
                                    style={{ flex: 2, background: '#EC4899', border: 'none', color: '#fff' }}
                                    disabled={saving || !selectedPT}
                                    onClick={async () => {
                                        setSaving(true);
                                        try {
                                            const res = await fetch('/api/maternity/labor', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ patientId: selectedPT.id, ...form })
                                            });
                                            if (res.ok) {
                                                setShowAdmitModal(false);
                                                fetchData();
                                            }
                                        } catch (e) {
                                            console.error(e);
                                        } finally {
                                            setSaving(false);
                                        }
                                    }}
                                >
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Admission'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function HandHeart(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" />
            <path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-5.4a2 2 0 0 0-1.5-3.3c-.5 0-1 .2-1.3.5l-4.2 3.7" />
            <path d="M2 13a6 6 0 1 1 12 0c0 1.9-1.1 3.5-2.5 4.5V22l-4-1.5L3.5 22v-4.5C2.1 16.5 2 14.9 2 13Z" />
        </svg>
    )
}
