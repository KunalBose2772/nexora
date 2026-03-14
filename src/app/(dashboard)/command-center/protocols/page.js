'use client';
import { ShieldCheck, ArrowLeft, Search, Clock, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ProtocolsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const protocols = [
        { id: 'PRO-101', name: 'Emergency Triage Optimization', category: 'Emergency', status: 'Active', updated: '2 days ago' },
        { id: 'PRO-105', name: 'ICU Critical Care Handover', category: 'ICU', status: 'Active', updated: '5 days ago' },
        { id: 'PRO-201', name: 'Sterile Barrier Validation', category: 'OT', status: 'Active', updated: '1 week ago' },
        { id: 'PRO-301', name: 'Pharmacy Narcotic Control', category: 'Pharmacy', status: 'Reviewing', updated: '3 hours ago' },
        { id: 'PRO-401', name: 'Institutional Code Blue', category: 'Global', status: 'Active', updated: '1 month ago' },
    ];

    return (
        <div className="fade-in">
            <div className="dashboard-header-row" style={{ marginBottom: '28px' }}>
                <div>
                    <h1 className="page-header__title" style={{ fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Institutional Protocols</h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>Standardized operational guidelines and compliance monitoring.</p>
                </div>
                <Link href="/command-center" className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                    <ArrowLeft size={14} /> Back to Command Center
                </Link>
            </div>

            <div className="card" style={{ padding: '24px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} />
                        <input 
                            type="text" 
                            placeholder="Search protocols..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '10px 12px 10px 40px', border: '1px solid var(--color-border-light)', borderRadius: '10px', outline: 'none' }} 
                        />
                    </div>
                    <button className="btn btn-primary">Create New Protocol</button>
                </div>

                <div style={{ width: '100%', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC' }}>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Protocol ID</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Protocol Name</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Category</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Last Updated</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {protocols.map((p) => (
                                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                                    <td style={{ padding: '16px', fontSize: '13px', fontFamily: 'monospace', color: 'var(--color-navy)', fontWeight: 600 }}>{p.id}</td>
                                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>{p.name}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '20px', background: '#F1F5F9', color: '#475569' }}>{p.category}</span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: p.status === 'Active' ? '#DCFCE7' : '#FEFABE', color: p.status === 'Active' ? '#15803D' : '#854D0E' }}>{p.status}</span>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '13px', color: '#64748B' }}>{p.updated}</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <Link href={`/command-center/protocols/review`} className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>Review</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
