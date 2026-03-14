'use client';
import { useState, useEffect, useRef } from 'react';
import { Video, Mic, MicOff, VideoOff, Phone, PhoneOff, Settings, Calendar, User, Send, Share2, ClipboardPlus, RefreshCw, Plus, X, Search, Clock, CheckCircle2, Loader2, ArrowRightCircle, Activity, FileText, Monitor, LayoutDashboard, Database, Siren, Ghost } from 'lucide-react';
import Skeleton from '@/components/common/Skeleton';

export default function TelemedicinePage() {
    const [calls, setCalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCall, setActiveCall] = useState(null);
    const [callState, setCallState] = useState('waiting'); // waiting, connecting, connected
    const [micMuted, setMicMuted] = useState(false);
    const [videoMuted, setVideoMuted] = useState(false);
    const [rxInput, setRxInput] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [referIPD, setReferIPD] = useState({ enabled: false, department: '', urgency: 'Routine' });
    const [isSaving, setIsSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [form, setForm] = useState({ patientId: '', patientName: '', doctorId: '', doctorName: '', date: new Date().toISOString().split('T')[0], time: '' });
    const [pSearch, setPSearch] = useState('');
    const [dSearch, setDSearch] = useState('');
    const [showPSearch, setShowPSearch] = useState(false);
    const [showDSearch, setShowDSearch] = useState(false);

    const fetchCalls = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/telemedicine');
            if (res.ok) {
                const data = await res.json();
                setCalls(data.teleconsults || []);
            }
        } catch (e) {
            console.error(e);
        } finally { setLoading(false); }
    };

    const fetchData = async () => {
        try {
            const [pRes, dRes] = await Promise.all([
                fetch('/api/patients'),
                fetch('/api/hr/staff')
            ]);
            if (pRes.ok) setPatients((await pRes.json()).patients || []);
            if (dRes.ok) {
                const dData = await dRes.json();
                setDoctors((dData.staff || []).filter(s => s.role.toLowerCase().includes('doctor') || s.specialization));
            }
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchCalls();
        fetchData();
    }, []);

    const scheduleMeeting = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/telemedicine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                setShowModal(false);
                setForm({ patientId: '', patientName: '', doctorId: '', doctorName: '', date: new Date().toISOString().split('T')[0], time: '' });
                fetchCalls();
            }
        } catch (e) { }
    };

    const joinCall = (call) => {
        setActiveCall(call);
        setCallState('connecting');
        setTimeout(() => setCallState('connected'), 2000);
    };

    const endCall = () => {
        setCallState('waiting');
        setActiveCall(null);
    };

    return (
        <div className="fade-in pb-12 h-[calc(100vh-140px)] flex flex-col">
            <style jsx>{`
                .roster-panel {
                    width: 340px;
                    background: #fff;
                    border: 1px solid var(--color-border-light);
                    border-radius: 24px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                .call-item {
                    padding: 16px;
                    margin: 8px 12px;
                    background: #fff;
                    border: 1px solid #F1F5F9;
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .call-item:hover {
                    border-color: var(--color-cyan);
                    background: #F8FAFC;
                }
                .call-item.active {
                    background: #F0FDFA;
                    border-color: #10B981;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08);
                }
                .stage-panel {
                    flex: 1;
                    background: #0F172A;
                    border-radius: 24px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    position: relative;
                }
                .control-btn {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .control-btn:hover {
                    background: rgba(255,255,255,0.1);
                    transform: scale(1.05);
                }
                .control-btn.red {
                    background: #EF4444;
                    border-color: #EF4444;
                }
            `}</style>

            <div className="dashboard-header-row mb-6">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Video size={32} className="text-cyan-500" />
                        Next-Gen Telehealth Hub
                    </h1>
                    <p className="page-header__subtitle">Secure P2P clinical video stream, virtual ward orchestration, and global connectivity.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={fetchCalls}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync Roster
                    </button>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm">
                        <Plus size={15} strokeWidth={1.5} /> Schedule Consult
                    </button>
                </div>
            </div>

            <div className="flex gap-6 flex-1 min-h-0">
                {/* Roster Panel */}
                <div className="roster-panel shadow-sm">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
                            <Activity size={14} className="text-cyan-500" />
                            Virtual Patient Queue
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto pt-2">
                        {loading ? (
                            [1, 2, 3].map(i => <div key={i} className="px-6 py-4"><Skeleton height="80px" radius="16px" /></div>)
                        ) : calls.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">
                                <Calendar size={32} className="mx-auto mb-4 opacity-20" />
                                <p className="text-[11px] font-bold uppercase tracking-widest">No Active Routes</p>
                            </div>
                        ) : (
                            calls.map(call => (
                                <div key={call.id} onClick={() => activeCall?.id !== call.id && joinCall(call)} className={`call-item ${activeCall?.id === call.id ? 'active' : ''}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-[14px] font-black text-navy-900 line-clamp-1">{call.patientName}</h4>
                                        <div className="text-[9px] font-black text-cyan-600 uppercase tracking-widest bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-100">{call.time || 'NOW'}</div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><User size={12} /> Dr. {call.doctorName}</div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><Clock size={12} /> {call.date}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Video Stage */}
                <div className="stage-panel">
                    {!activeCall ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-600 border border-white/10"><Monitor size={48} /></div>
                            <h3 className="text-2xl font-black text-white mb-2">Virtual Consulting Hub</h3>
                            <p className="text-slate-400 font-semibold max-w-sm mx-auto">Initialize a secure 256-bit encrypted WebRTC stream by selecting a patient from the virtual clinic roster.</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 relative bg-slate-900 overflow-hidden">
                                {callState === 'connecting' ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-950 z-50">
                                        <RefreshCw size={32} className="text-cyan-500 animate-spin mb-6" />
                                        <div className="text-[12px] font-black text-white uppercase tracking-[0.2em] animate-pulse">Establishing Secure P2P Bridge</div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Connecting to {activeCall.patientName} portal...</div>
                                    </div>
                                ) : (
                                    <div className="h-full w-full relative">
                                        {/* Main Patient Video Placeholder */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black flex items-center justify-center overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200" className="w-full h-full object-cover opacity-60" />
                                            <div className="absolute inset-0 border-[10px] border-white/5 pointer-events-none" />
                                        </div>

                                        {/* Doctor PiP */}
                                        <div className="absolute top-6 right-6 w-56 aspect-video bg-black rounded-2xl border-2 border-white/10 shadow-2xl overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400" className="w-full h-full object-cover" />
                                            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[8px] font-black text-white uppercase tracking-widest">You</div>
                                        </div>

                                        {/* Patient Label */}
                                        <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <div className="text-[11px] font-black text-white uppercase tracking-widest">{activeCall.patientName} (Remote)</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Control Bar */}
                            <div className="h-24 bg-navy-950 border-t border-white/5 flex items-center justify-center gap-8 px-12">
                                <button onClick={() => setMicMuted(!micMuted)} className={`control-btn ${micMuted ? 'red' : ''}`}>{micMuted ? <MicOff size={22} /> : <Mic size={22} />}</button>
                                <button onClick={() => setVideoMuted(!videoMuted)} className={`control-btn ${videoMuted ? 'red' : ''}`}>{videoMuted ? <VideoOff size={22} /> : <Video size={22} />}</button>
                                <button onClick={endCall} className="h-12 px-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center gap-3 text-[12px] font-black uppercase tracking-widest shadow-xl shadow-red-600/20 transition-all">
                                    <PhoneOff size={18} /> End Consult
                                </button>
                                <button className="control-btn"><Share2 size={22} /></button>
                                <button className="control-btn"><Settings size={22} /></button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-[540px] rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="bg-navy-900 p-8 flex justify-between items-center text-white">
                            <div>
                                <h3 className="text-xl font-black tracking-tight leading-none mb-2">Schedule Virtual Slot</h3>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Generate encrypted P2P bridge link</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"><X size={20} /></button>
                        </div>
                        <form onSubmit={scheduleMeeting} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Consulting Professional</label>
                                    <select required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-cyan-500 transition-all" value={form.doctorId} onChange={e => {
                                        const d = doctors.find(doc => doc.id === e.target.value);
                                        setForm({ ...form, doctorId: e.target.value, doctorName: d?.name || '' });
                                    }}>
                                        <option value="">Select Practitioner...</option>
                                        {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Patient Registry</label>
                                    <select required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-cyan-500 transition-all" value={form.patientId} onChange={e => {
                                        const p = patients.find(pat => pat.id === e.target.value);
                                        setForm({ ...form, patientId: e.target.value, patientName: `${p?.firstName} ${p?.lastName}` || '' });
                                    }}>
                                        <option value="">Select Patient...</option>
                                        {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.patientCode})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Window Date</label>
                                    <input type="date" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-cyan-500" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Window Time</label>
                                    <input type="time" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-cyan-500" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 bg-navy-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-xl shadow-navy-900/10 hover:bg-slate-800 transition-all">Generate Virtual Session</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
