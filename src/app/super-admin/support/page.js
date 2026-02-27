'use client';

import { HeadphonesIcon, Search, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export default function SupportPage() {
    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Support Tickets</h1>
                    <p style={{ fontSize: '14px', color: '#64748B' }}>Global tenant issues, platform bug reports, and SLA monitoring.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', fontSize: '14px', fontWeight: 600 }}>
                        <AlertCircle size={16} /> 2 Critical SLAs Breached
                    </div>
                </div>
            </div>

            {/* Kanban-ish Board View */}
            <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
                {/* Column: Open */}
                <div style={{ flex: '1', minWidth: '320px', background: '#F8FAFC', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }}></div>
                            Open / Unassigned
                        </div>
                        <span style={{ fontSize: '12px', background: '#E2E8F0', padding: '2px 8px', borderRadius: '100px', fontWeight: 600, color: '#475569' }}>3</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { id: '#TKT-8901', hospital: 'City General', issue: 'Cannot upload PDF lab reports larger than 5MB.', priority: 'High', time: '10m ago' },
                            { id: '#TKT-8902', hospital: 'Apollo Health', issue: 'Database connection timeout on historical billing search.', priority: 'Critical', time: '25m ago' },
                            { id: '#TKT-8903', hospital: 'Metro Multi', issue: 'New user creation failing with RBAC error.', priority: 'Medium', time: '1h ago' },
                        ].map(ticket => (
                            <div key={ticket.id} style={{ background: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>{ticket.id}</span>
                                    <span style={{ fontSize: '11px', fontWeight: 600, background: ticket.priority === 'Critical' ? '#FEF2F2' : ticket.priority === 'High' ? '#FFFBEB' : '#F1F5F9', color: ticket.priority === 'Critical' ? '#DC2626' : ticket.priority === 'High' ? '#D97706' : '#64748B', padding: '2px 6px', borderRadius: '4px' }}>{ticket.priority}</span>
                                </div>
                                <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A', marginBottom: '6px', lineHeight: 1.4 }}>{ticket.issue}</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                                    <span style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}><Building size={12} /> {ticket.hospital}</span>
                                    <span style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {ticket.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column: In Progress */}
                <div style={{ flex: '1', minWidth: '320px', background: '#F8FAFC', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }}></div>
                            In Progress (Engineering)
                        </div>
                        <span style={{ fontSize: '12px', background: '#E2E8F0', padding: '2px 8px', borderRadius: '100px', fontWeight: 600, color: '#475569' }}>1</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { id: '#TKT-8898', hospital: 'Sunrise Care', issue: 'Missing GST export button on pro plan.', priority: 'Medium', time: '1d ago' },
                        ].map(ticket => (
                            <div key={ticket.id} style={{ background: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>{ticket.id}</span>
                                    <span style={{ fontSize: '11px', fontWeight: 600, background: '#F1F5F9', color: '#64748B', padding: '2px 6px', borderRadius: '4px' }}>{ticket.priority}</span>
                                </div>
                                <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A', marginBottom: '6px', lineHeight: 1.4 }}>{ticket.issue}</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                                    <span style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}><Building size={12} /> {ticket.hospital}</span>
                                    <span style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {ticket.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column: Resolved */}
                <div style={{ flex: '1', minWidth: '320px', background: '#F8FAFC', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0', opacity: 0.7 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div>
                            Recently Resolved
                        </div>
                        <span style={{ fontSize: '12px', background: '#E2E8F0', padding: '2px 8px', borderRadius: '100px', fontWeight: 600, color: '#475569' }}>12+</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { id: '#TKT-8850', hospital: 'Care Hospital', issue: 'Password reset email not delivering.', priority: 'High', time: '2d ago' },
                        ].map(ticket => (
                            <div key={ticket.id} style={{ background: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', textDecoration: 'line-through' }}>{ticket.id}</span>
                                    <CheckCircle2 size={16} color="#10B981" />
                                </div>
                                <h4 style={{ fontSize: '13.5px', fontWeight: 500, color: '#64748B', marginBottom: '6px', lineHeight: 1.4 }}>{ticket.issue}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Building({ size }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
}
