'use client';

import {
    ArrowLeft, LineChart, Plus, Loader2,
    Save, History, Activity, Heart,
    ChevronRight, MapPin, Gauge, X,
    Calendar, Clock, ClipboardList, MoveLeft
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PartographPage() {
    const { id } = useParams();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [form, setForm] = useState({
        dilation: '',
        descent: '0',
        contractions: '2',
        fetalHeartRate: '140',
        maternalPulse: '80',
        bpSys: '120',
        bpDia: '80',
        notes: ''
    });

    const fetchEntries = async () => {
        try {
            const res = await fetch(`/api/maternity/partograph?laborRecordId=${id}`);
            const data = await res.json();
            if (res.ok) setEntries(data.entries);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/maternity/partograph', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ laborRecordId: id, ...form })
            });
            if (res.ok) {
                setShowModal(false);
                fetchEntries();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <Loader2 className="animate-spin" size={40} style={{ color: '#EC4899', marginBottom: '20px' }} />
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Loading Partograph Sequence...</p>
        </div>
    );

    return (
        <div className="fade-in pb-20">
            <style jsx>{`
                .p-card { 
                    background: #fff; 
                    border-radius: 20px; 
                    border: 1px solid #F1F5F9; 
                    padding: 24px; 
                    box-shadow: 0 4px 24px rgba(0,0,0,0.02);
                }
                .chart-area { 
                    height: 280px; 
                    background: #F8FAFC; 
                    border-radius: 12px; 
                    border: 1px dashed #E2E8F0; 
                    position: relative; 
                    padding: 30px 20px 50px; 
                    display: flex; 
                    align-items: flex-end; 
                    gap: 12px; 
                }
                .bar-dilation { 
                    flex: 1; 
                    min-width: 32px;
                    background: linear-gradient(180deg, #EC4899 0%, #BE185D 100%); 
                    border-radius: 4px 4px 0 0; 
                    position: relative; 
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
                }
                .bar-dilation:hover {
                    opacity: 0.9;
                    box-shadow: 0 0 12px rgba(236, 72, 153, 0.2);
                }
                .bar-dilation::after { 
                    content: attr(data-val) 'cm'; 
                    position: absolute; 
                    top: -22px; 
                    left: 50%; 
                    transform: translateX(-50%); 
                    font-size: 10px; 
                    font-weight: 600; 
                    color: #EC4899; 
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
                    max-width: 540px;
                    box-shadow: 0 25px 50px -12px rgba(0, 10, 30, 0.2);
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    overflow: hidden;
                }
                .modal-header-executive {
                    padding: 16px 20px;
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
                    cursor: pointer;
                    transition: all 0.2s;
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/maternity" style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                        <MoveLeft size={18} />
                    </Link>
                    <div>
                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#EC4899', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Clinical Monitoring Protocol</div>
                        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#0F172A' }}>Labor Partograph</h1>
                    </div>
                </div>
                <button className="btn-executive" style={{ background: '#EC4899', border: 'none', color: '#fff' }} onClick={() => setShowModal(true)}>
                    <Plus size={16} /> ADD CLINICAL ENTRY
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                <div className="p-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <LineChart size={18} style={{ color: '#EC4899' }} /> CERVICAL PROGRESSION
                        </h3>
                    </div>
                    
                    <div className="chart-area shadow-inner">
                        {entries.map((e, idx) => (
                            <div
                                key={e.id}
                                className="bar-dilation"
                                style={{ height: `${(e.dilation / 10) * 100}%` }}
                                data-val={e.dilation}
                            >
                                <div style={{ position: 'absolute', bottom: '-35px', left: '50%', transform: 'translateX(-50%) rotate(-45deg)', fontSize: '9px', fontWeight: 500, whiteSpace: 'nowrap', color: '#64748B' }}>
                                    {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-card">
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <History size={18} style={{ color: '#6366F1' }} /> CLINICAL LOG SEQUENCE
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {entries.slice().reverse().map((e, idx) => (
                            <div key={e.id} style={{ display: 'flex', gap: '16px', padding: '16px', borderRadius: '12px', border: '1px solid #F1F5F9', background: idx === 0 ? '#F8FAFC' : 'transparent' }}>
                                <div style={{ textAlign: 'center', minWidth: '50px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    <div style={{ fontSize: '9px', fontWeight: 500, color: '#94A3B8', marginTop: '2px' }}>{new Date(e.timestamp).toLocaleDateString()}</div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '14px' }}>Dilation: {e.dilation} cm <span style={{ color: '#CBD5E1', margin: '0 6px' }}>|</span> Station: {e.descent}</div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                        <div style={{ fontSize: '11px', color: '#64748B' }}>FHR: <b>{e.fetalHeartRate}</b></div>
                                        <div style={{ fontSize: '11px', color: '#64748B' }}>Pulse: <b>{e.maternalPulse}</b></div>
                                        <div style={{ fontSize: '11px', color: '#64748B' }}>BP: <b>{e.bpSys}/{e.bpDia}</b></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay-executive">
                    <div className="modal-card-executive">
                        <div className="modal-header-executive">
                            <h2 className="modal-title-executive">New Partograph Sequence</h2>
                            <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                                <X size={18} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="label-executive">Cervical Dilation (cm)</label>
                                    <input 
                                        type="number" step="0.5" min="0" max="10" 
                                        className="form-control-executive" 
                                        required 
                                        value={form.dilation} 
                                        onChange={e => setForm({ ...form, dilation: e.target.value })} 
                                    />
                                </div>
                                <div>
                                    <label className="label-executive">Descent (Station)</label>
                                    <select className="form-control-executive" value={form.descent} onChange={e => setForm({ ...form, descent: e.target.value })}>
                                        <option value="-3">-3 (Floating)</option>
                                        <option value="-2">-2</option>
                                        <option value="-1">-1</option>
                                        <option value="0">0 (Fixed)</option>
                                        <option value="1">+1</option>
                                        <option value="2">+2</option>
                                        <option value="3">+3 (Delivery Imminent)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label-executive">Fetal Heart Rate (BPM)</label>
                                    <input type="number" className="form-control-executive" value={form.fetalHeartRate} onChange={e => setForm({ ...form, fetalHeartRate: e.target.value })} />
                                </div>
                                <div>
                                    <label className="label-executive">Maternal Pulse</label>
                                    <input type="number" className="form-control-executive" value={form.maternalPulse} onChange={e => setForm({ ...form, maternalPulse: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="label-executive">Blood Pressure (SYS / DIA)</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input type="number" className="form-control-executive" placeholder="SYS" value={form.bpSys} onChange={e => setForm({ ...form, bpSys: e.target.value })} />
                                        <input type="number" className="form-control-executive" placeholder="DIA" value={form.bpDia} onChange={e => setForm({ ...form, bpDia: e.target.value })} />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="label-executive">Clinical Notes</label>
                                    <textarea className="form-control-executive" style={{ height: '60px', resize: 'none' }} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" className="btn-executive" style={{ flex: 1, background: '#fff', border: '1px solid #E2E8F0', color: '#64748B' }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-executive" style={{ flex: 1, background: '#EC4899', border: 'none', color: '#fff' }}>Save Entry</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
