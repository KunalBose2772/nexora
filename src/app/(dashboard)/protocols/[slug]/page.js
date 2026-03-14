'use client';
import { ShieldCheck, ArrowLeft, Clock, User, Zap, Siren, Scissors, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProtocolDetailPage() {
    const { slug } = useParams();
    
    const protocolMap = {
        'code-blue': { name: 'Institutional Code Blue', icon: HeartPulse, color: '#EF4444', desc: 'Standardized emergency response for cardiac or respiratory arrest.' },
        'sterile': { name: 'Surgical Sterile Barrier', icon: Scissors, color: '#8B5CF6', desc: 'Validation steps for maintaining operating theatre sterility.' },
        'emergency-triage': { name: 'Emergency Triage Optimization', icon: Siren, color: '#F59E0B', desc: 'Procedures for managing high-volume patient influx in triage.' },
    };

    const protocol = protocolMap[slug] || { name: 'Operational Protocol', icon: ShieldCheck, color: '#3B82F6', desc: 'Institutional operational guideline for clinical excellence.' };

    const Icon = protocol.icon;

    return (
        <div className="fade-in">
            <div className="dashboard-header-row" style={{ marginBottom: '28px' }}>
                <div>
                    <h1 className="page-header__title" style={{ fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>{protocol.name}</h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>Clinical Standards & Compliance Protocol</p>
                </div>
                <Link href="/protocols" className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                    <ArrowLeft size={14} /> Back to Protocols
                </Link>
            </div>

            <div className="card" style={{ padding: '32px', marginBottom: '28px', borderLeft: `6px solid ${protocol.color}` }}>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: `${protocol.color}15`, color: protocol.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={32} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '8px' }}>Executive Summary</h2>
                        <p style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                            {protocol.desc} This protocol is mandatory for all clinical staff in the relevant departments. Compliance is monitored via real-time telemetry and audit logs.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid-balanced">
                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '16px' }}>Compliance Status</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', color: '#64748B' }}>Real-time Adherence</span>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#10B981' }}>98.4%</span>
                        </div>
                        <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: '98.4%', background: '#10B981' }} />
                        </div>
                        <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Last audited: {new Date().toLocaleTimeString()}</div>
                    </div>
                </div>
                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '16px' }}>Responsible Personnel</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F8FAFC', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} style={{ color: '#94A3B8' }} />
                            </div>
                        ))}
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>+5</div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '12px' }}>All intensivist and nursing leads are currently active on this protocol.</div>
                </div>
            </div>
        </div>
    );
}
