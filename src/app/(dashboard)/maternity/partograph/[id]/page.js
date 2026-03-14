'use client';

import {
    ArrowLeft, LineChart, Plus, Loader2,
    Save, History, Activity, Heart,
    ChevronRight, MapPin, Gauge
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <Loader2 className="animate-spin" size={40} color="#EC4899" />
        </div>
    );

    return (
        <div className="fade-in">
            <style>{`
                .p-card { background: #fff; border-radius: 20px; border: 1px solid rgba(0,0,0,0.05); padding: 24px; }
                .chart-container { height: 300px; background: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0; position: relative; padding: 20px; display: flex; align-items: flex-end; gap: 20px; }
                .chart-bar { width: 40px; background: #EC4899; border-radius: 4px 4px 0 0; position: relative; transition: height 0.3s; }
                .chart-bar:hover::after { content: attr(data-val) 'cm'; position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: 800; color: #DB2777; }
                .label { font-size: 11px; font-weight: 800; color: #94A3B8; text-transform: uppercase; margin-bottom: 4px; display: block; }
                .input-field { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #E2E8F0; font-size: 14px; margin-bottom: 12px; }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link href="/maternity" style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Labor Partograph</h1>
                        <p style={{ color: '#64748B', margin: '4px 0 0', fontSize: '14px' }}>Real-time Cervical Dilation & Fetal Wellbeing Tracking</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary" style={{ background: '#EC4899' }} onClick={() => setShowModal(true)}>
                        <Plus size={18} /> ADD ENTRY
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div className="p-card">
                    <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LineChart size={18} color="#EC4899" /> CERVICAL DILATION (CM)
                    </h3>
                    <div className="chart-container">
                        {entries.map((e, idx) => (
                            <div
                                key={e.id}
                                className="chart-bar"
                                style={{ height: `${(e.dilation / 10) * 100}%` }}
                                data-val={e.dilation}
                            >
                                <div style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%) rotate(-45deg)', fontSize: '9px', whiteSpace: 'nowrap', color: '#94A3B8' }}>
                                    {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}
                        {entries.length === 0 && (
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#94A3B8', fontSize: '13px' }}>
                                No partograph data yet.
                            </div>
                        )}
                    </div>
                    <div style={{ marginTop: '60px', padding: '16px', background: '#FDF2F8', borderRadius: '12px', border: '1px solid #FCE7F3' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#BE185D', fontWeight: 700, fontSize: '13px' }}>
                            <Activity size={16} /> ALERT LINE & ACTION LINE
                        </div>
                        <p style={{ fontSize: '11px', color: '#DB2777', marginTop: '4px', margin: 0 }}>
                            Dilation is proceeding along the alert line. Maintain active observation.
                        </p>
                    </div>
                </div>

                <div className="p-card">
                    <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <History size={18} color="#6366F1" /> RECENT MONITORING LOGS
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {entries.slice().reverse().map(e => (
                            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                                <div>
                                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '14px' }}>Dilation: {e.dilation} cm • Descent: {e.descent}</div>
                                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                                        FHR: {e.fetalHeartRate} • M.Pulse: {e.maternalPulse} • BP: {e.bpSys}/{e.bpDia}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '8px', fontStyle: 'italic' }}>"{e.notes || 'No clinical notes.'}"</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#6366F1' }}>
                                        {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>{new Date(e.timestamp).toLocaleDateString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Simple Modal Backdrop */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', width: '500px', maxWidth: '90%' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px', color: '#0F172A' }}>New Partograph Entry</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <span className="label">Dilation (cm)</span>
                                    <input type="number" step="0.5" min="0" max="10" className="input-field" required value={form.dilation} onChange={e => setForm({ ...form, dilation: e.target.value })} />
                                </div>
                                <div>
                                    <span className="label">Descent (Station)</span>
                                    <select className="input-field" value={form.descent} onChange={e => setForm({ ...form, descent: e.target.value })}>
                                        <option value="-3">-3</option>
                                        <option value="-2">-2</option>
                                        <option value="-1">-1</option>
                                        <option value="0">0 (Fixed)</option>
                                        <option value="1">+1</option>
                                        <option value="2">+2</option>
                                        <option value="3">+3</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <span className="label">Fetal Heart Rate</span>
                                    <input type="number" className="input-field" value={form.fetalHeartRate} onChange={e => setForm({ ...form, fetalHeartRate: e.target.value })} />
                                </div>
                                <div>
                                    <span className="label">Contractions / 10m</span>
                                    <input type="number" className="input-field" value={form.contractions} onChange={e => setForm({ ...form, contractions: e.target.value })} />
                                </div>
                            </div>
                            <span className="label">Clinical Notes</span>
                            <textarea className="input-field" style={{ height: '80px' }} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />

                            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>CANCEL</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, background: '#EC4899' }}>SAVE ENTRY</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
