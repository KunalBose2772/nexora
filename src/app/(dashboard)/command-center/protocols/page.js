'use client';
import { ShieldCheck, ArrowLeft, Search, Clock, FileText, CheckCircle2, Plus, X, Globe, Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ProtocolsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const protocols = [
        { id: 'PRO-101', name: 'Emergency Triage Optimization', category: 'Emergency', status: 'Active', updated: '2 days ago', slug: 'emergency-triage' },
        { id: 'PRO-105', name: 'ICU Critical Care Handover', category: 'ICU', status: 'Active', updated: '5 days ago', slug: 'icu-handover' },
        { id: 'PRO-201', name: 'Sterile Barrier Validation', category: 'OT', status: 'Active', updated: '1 week ago', slug: 'sterile' },
        { id: 'PRO-301', name: 'Pharmacy Narcotic Control', category: 'Pharmacy', status: 'Reviewing', updated: '3 hours ago', slug: 'pharmacy-control' },
        { id: 'PRO-401', name: 'Institutional Code Blue', category: 'Global', status: 'Active', updated: '1 month ago', slug: 'code-blue' },
    ];

    const filteredProtocols = protocols.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fade-in">
            <style>{`
                .modal-overlay {
                    position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px);
                    display: flex; align-items: center; justify-content: center; z-index: 1000;
                }
                .modal-card {
                    background: #fff; width: 100%; max-width: 550px; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                    overflow: hidden; animation: slideUp 0.3s ease-out;
                }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .input-field {
                    width: 100%; padding: 12px; border: 1px solid var(--color-border-light); border-radius: 10px;
                    outline: none; font-size: 14px; transition: border-color 0.2s;
                }
                .input-field:focus { border-color: #3B82F6; }
            `}</style>

            <div className="dashboard-header-row" style={{ marginBottom: '28px' }}>
                <div>
                    <h1 className="page-header__title" style={{ fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Institutional Protocols</h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>Standardized operational guidelines and compliance monitoring.</p>
                </div>
                <Link href="/command-center" className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                    <ArrowLeft size={14} /> Back to Command
                </Link>
            </div>

            <div className="card" style={{ padding: '24px', borderRadius: '20px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ position: 'relative', width: '320px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
                        <input 
                            type="text" 
                            placeholder="Search clinical protocols..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '12px 12px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '12px', outline: 'none', fontSize: '14px' }} 
                        />
                    </div>
                    <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> New Protocol
                    </button>
                </div>

                <div style={{ width: '100%', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Protocol ID</th>
                                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Protocol Name</th>
                                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Scope</th>
                                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProtocols.map((p) => (
                                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.2s' }} className="table-row-hover">
                                    <td style={{ padding: '18px 16px', fontSize: '13px', fontFamily: 'monospace', color: 'var(--color-navy)', fontWeight: 600 }}>{p.id}</td>
                                    <td style={{ padding: '18px 16px' }}>
                                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)' }}>{p.name}</div>
                                        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={10} /> Updated {p.updated}
                                        </div>
                                    </td>
                                    <td style={{ padding: '18px 16px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: '#F1F5F9', color: '#475569', textTransform: 'uppercase' }}>{p.category}</span>
                                    </td>
                                    <td style={{ padding: '18px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.status === 'Active' ? '#10B981' : '#F59E0B' }} />
                                            <span style={{ fontSize: '12px', fontWeight: 700, color: p.status === 'Active' ? '#15803D' : '#854D0E' }}>{p.status}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '18px 16px', textAlign: 'right' }}>
                                        <Link href={`/command-center/protocols/${p.slug}`} className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Protocol Modal */}
            {isCreateModalOpen && (
                <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-navy)' }}>Draft New Protocol</div>
                                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>Institutional Compliance Framework</div>
                                </div>
                            </div>
                            <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>Protocol Title</label>
                                <input type="text" className="input-field" placeholder="e.g. ICU Respiratory Care Standards" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>Department Scope</label>
                                    <select className="input-field">
                                        <option>Select Unit...</option>
                                        <option>Emergency</option>
                                        <option>ICU</option>
                                        <option>OT</option>
                                        <option>Global</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>Security Level</label>
                                    <select className="input-field">
                                        <option>Level 1 (Internal)</option>
                                        <option>Level 2 (Confidential)</option>
                                        <option>Level 3 (Restricted)</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>Executive Summary</label>
                                <textarea className="input-field" style={{ minHeight: '100px', resize: 'none' }} placeholder="Briefly describe the purpose and scope..."></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="btn btn-primary" style={{ flex: 1, height: '48px' }} onClick={() => setIsCreateModalOpen(false)}>
                                    Publish Draft
                                </button>
                                <button className="btn btn-secondary" style={{ flex: 1, height: '48px', background: '#fff' }} onClick={() => setIsCreateModalOpen(false)}>
                                    Save as Local
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
