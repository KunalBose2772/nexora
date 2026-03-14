'use client';
import { FileText, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck, Clock, User, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function ProtocolReviewPage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row" style={{ marginBottom: '28px' }}>
                <div>
                    <h1 className="page-header__title" style={{ fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Protocol Review Ledger</h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>Reviewing: Operational Continuity Protocol (Active v2.4)</p>
                </div>
                <Link href="/command-center/protocols" className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                    <ArrowLeft size={14} /> Back to Protocols
                </Link>
            </div>

            <div className="grid-balanced" style={{ marginBottom: '28px' }}>
                <div style={{ background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={18} /> Protocol Content
                    </h3>
                    <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '12px', fontSize: '14px', color: '#475569', lineHeight: 1.8 }}>
                        <p style={{ marginTop: 0 }}><strong>1. Scope:</strong> All high-volume clinical departments (OPD, Emergency, ICU).</p>
                        <p><strong>2. Threshold:</strong> Peak capacity mobilization occurs when occupancy exceeds 90% or ER triage wait exceeds 45 mins.</p>
                        <p><strong>3. Required Actions:</strong> Verify staffing rosters, clear non-critical triage zones, synchronize inventory with pharmacy hub.</p>
                        <p style={{ marginBottom: 0 }}><strong>4. Compliance:</strong> Real-time logging of department head verification is mandatory.</p>
                    </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldCheck size={18} /> Review Checklist
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            'Verify scope accuracy for current facility load',
                            'Audit threshold triggers based on historic ICU surges',
                            'Validate required actions against clinical staff availability',
                            'Ensure compliance logging system connectivity'
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #F1F5F9', borderRadius: '10px' }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: '2px solid #CBD5E1', flexShrink: 0 }}></div>
                                <span style={{ fontSize: '13px', color: '#64748B' }}>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '24px' }}>
                    <div>
                        <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Reviewer</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> Medical Director</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Session Timer</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> 12:45 mins</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary">Request Revision</button>
                    <button className="btn btn-primary" style={{ padding: '0 32px' }}>Approve & Publish</button>
                </div>
            </div>
        </div>
    );
}
