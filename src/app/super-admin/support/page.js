'use client';
import { useState } from 'react';
import { AlertCircle, Clock, CheckCircle2, X } from 'lucide-react';

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
    const [boardCols, setBoardCols] = useState(COLUMNS);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [replyText, setReplyText] = useState('');

    const openTicket = (ticket, colKey) => {
        setSelectedTicket({ ...ticket, columnKey: colKey });
        setReplyText('');
        setModalOpen(true);
    };

    const handleReply = (e) => {
        e.preventDefault();
        alert(`Reply successfully sent to ${selectedTicket.hospital}.`);
        setModalOpen(false);
    };

    const handleMove = (targetColKey) => {
        const newCols = boardCols.map(c => {
            if (c.key === selectedTicket.columnKey) {
                return { ...c, tickets: c.tickets.filter(t => t.id !== selectedTicket.id) };
            }
            if (c.key === targetColKey) {
                const pureTicket = { ...selectedTicket };
                delete pureTicket.columnKey;
                return { ...c, tickets: [pureTicket, ...c.tickets] };
            }
            return c;
        });
        setBoardCols(newCols);
        setModalOpen(false);
    };

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
                {boardCols.map(col => (
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
                                <div key={ticket.id} onClick={() => openTicket(ticket, col.key)} style={{ background: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'box-shadow 0.2s' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)'}>
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

            {/* Ticket Modal */}
            {modalOpen && selectedTicket && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setModalOpen(false)} />
                    <div style={{ position: 'relative', background: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '600px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }}>
                            <div>
                                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>Ticket Details {selectedTicket.id}</h2>
                                <div style={{ fontSize: '13px', color: '#64748B' }}>{selectedTicket.hospital} • {selectedTicket.time}</div>
                            </div>
                            <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ padding: '24px', overflowY: 'auto' }}>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>Issue Topic</label>
                                <div style={{ fontSize: '15px', color: '#0F172A', fontWeight: 500, lineHeight: 1.5 }}>
                                    {selectedTicket.issue}
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>Current Priority</label>
                                <span style={{ fontSize: '12px', fontWeight: 600, background: (priorityStyle[selectedTicket.priority] || priorityStyle.Medium).bg, color: (priorityStyle[selectedTicket.priority] || priorityStyle.Medium).color, padding: '4px 10px', borderRadius: '6px' }}>
                                    {selectedTicket.priority} Priority
                                </span>
                            </div>

                            <form id="ticket-form" onSubmit={handleReply} style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>Your Reply to Customer</label>
                                <textarea required value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your response or update here..." style={{ width: '100%', minHeight: '100px', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }} onFocus={(e) => e.currentTarget.style.borderColor = '#3B82F6'} onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'} />
                            </form>
                        </div>

                        <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '0 0 16px 16px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {selectedTicket.columnKey !== 'progress' && (
                                    <button onClick={() => handleMove('progress')} style={{ padding: '10px 14px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
                                        Move to In-Progress
                                    </button>
                                )}
                                {selectedTicket.columnKey !== 'resolved' && (
                                    <button onClick={() => handleMove('resolved')} style={{ padding: '10px 14px', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#059669', cursor: 'pointer' }}>
                                        Mark as Resolved
                                    </button>
                                )}
                            </div>
                            <button type="submit" form="ticket-form" style={{ padding: '10px 18px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                                Send Reply
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
