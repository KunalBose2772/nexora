'use client';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

function BuildingIcon({ size = 12 }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>;
}

const COLUMNS = [
    {
        key: 'open',
        label: 'Open / Unassigned',
        dot: '#EF4444',
        count: '3',
        tickets: [
            { id: '#TKT-8901', hospital: 'City General', issue: 'Cannot upload PDF lab reports larger than 5MB.', priority: 'High', time: '10m ago' },
            { id: '#TKT-8902', hospital: 'Apollo Health', issue: 'Database connection timeout on historical billing search.', priority: 'Critical', time: '25m ago' },
            { id: '#TKT-8903', hospital: 'Metro Multi', issue: 'New user creation failing with RBAC error.', priority: 'Medium', time: '1h ago' },
        ]
    },
    {
        key: 'progress',
        label: 'In Progress (Engineering)',
        dot: '#F59E0B',
        count: '1',
        tickets: [
            { id: '#TKT-8898', hospital: 'Sunrise Care', issue: 'Missing GST export button on pro plan.', priority: 'Medium', time: '1d ago' },
        ]
    },
    {
        key: 'resolved',
        label: 'Recently Resolved',
        dot: '#10B981',
        count: '12+',
        resolved: true,
        tickets: [
            { id: '#TKT-8850', hospital: 'Care Hospital', issue: 'Password reset email not delivering.', priority: 'High', time: '2d ago' },
        ]
    },
];

const priorityStyle = {
    Critical: { bg: '#FEF2F2', color: '#DC2626' },
    High: { bg: '#FFFBEB', color: '#D97706' },
    Medium: { bg: '#F1F5F9', color: '#64748B' },
};

export default function SupportPage() {
    return (
        <div className="fade-in">
            {/* Page Header */}
            <div className="saas-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.02em' }}>Support Tickets</h1>
                    <p style={{ color: '#64748B', margin: 0, fontSize: '14px' }}>Global tenant issues, platform bug reports, and SLA monitoring.</p>
                </div>
                <div>
                    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', fontSize: '14px', fontWeight: 600 }}>
                        <AlertCircle size={16} /> 2 Critical SLAs Breached
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="kanban-board">
                {COLUMNS.map(col => (
                    <div key={col.key} className="kanban-col" style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0', opacity: col.resolved ? 0.75 : 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.dot, flexShrink: 0 }}></div>
                                {col.label}
                            </div>
                            <span style={{ fontSize: '12px', background: '#E2E8F0', padding: '2px 8px', borderRadius: '20px', fontWeight: 600, color: '#475569' }}>{col.count}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {col.tickets.map(ticket => (
                                <div key={ticket.id} style={{ background: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', textDecoration: col.resolved ? 'line-through' : 'none' }}>{ticket.id}</span>
                                        {col.resolved
                                            ? <CheckCircle2 size={16} color="#10B981" />
                                            : <span style={{ fontSize: '11px', fontWeight: 600, background: (priorityStyle[ticket.priority] || priorityStyle.Medium).bg, color: (priorityStyle[ticket.priority] || priorityStyle.Medium).color, padding: '2px 7px', borderRadius: '4px' }}>{ticket.priority}</span>
                                        }
                                    </div>
                                    <p style={{ fontSize: '13.5px', fontWeight: col.resolved ? 400 : 600, color: col.resolved ? '#64748B' : '#0F172A', margin: '0 0 8px 0', lineHeight: 1.4 }}>{ticket.issue}</p>
                                    {!col.resolved && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                            <span style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}><BuildingIcon size={12} /> {ticket.hospital}</span>
                                            <span style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={11} /> {ticket.time}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .kanban-board {
                    display: flex;
                    gap: 20px;
                    padding-bottom: 8px;
                }
                .kanban-col {
                    flex: 1;
                    min-width: 0;
                }
                @media (max-width: 768px) {
                    .kanban-board {
                        flex-direction: column;
                    }
                    .kanban-col {
                        width: 100%;
                        flex: none;
                    }
                }
            `}</style>
        </div>
    );
}
