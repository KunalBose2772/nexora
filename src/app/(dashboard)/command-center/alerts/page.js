'use client';
import { Bell, ArrowLeft, Search, Filter, CheckCircle2, AlertTriangle, Siren, Clock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function AlertsLedgerPage() {
    const alerts = [
        { id: 'ALT-981', type: 'Emergency', msg: 'Triage Overload (Zone A)', time: '2 mins ago', severity: 'critical', status: 'Active' },
        { id: 'ALT-975', type: 'Pharmacy', msg: 'Adrenaline Stock Critical', time: '15 mins ago', severity: 'warning', status: 'Pending' },
        { id: 'ALT-970', type: 'IPD', msg: 'Bed Shortage (Ward 4)', time: '40 mins ago', severity: 'info', status: 'Resolved' },
        { id: 'ALT-965', type: 'Laboratory', msg: 'LIS Synchronization Error', time: '1 hour ago', severity: 'warning', status: 'Resolved' },
        { id: 'ALT-960', type: 'OT', msg: 'Theater-1 HEPA Fault', time: '2 hours ago', severity: 'critical', status: 'Active' },
    ];

    return (
        <div className="fade-in">
            <div className="dashboard-header-row" style={{ marginBottom: '28px' }}>
                <div>
                    <h1 className="page-header__title" style={{ fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Alert Resolution Ledger</h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>Comprehensive audit log for all clinical and operational priority signals.</p>
                </div>
                <Link href="/command-center" className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                    <ArrowLeft size={14} /> Back to Command Center
                </Link>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ position: 'relative', width: '260px' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} />
                            <input type="text" placeholder="Search alerts..." style={{ width: '100%', padding: '10px 12px 10px 40px', border: '1px solid var(--color-border-light)', borderRadius: '10px', outline: 'none', fontSize: '13px' }} />
                        </div>
                        <button className="btn btn-secondary btn-sm" style={{ background: '#fff', border: '1px solid var(--color-border-light)' }}>
                            <Filter size={14} /> Filter
                        </button>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>
                        Showing {alerts.length} priority signals
                    </div>
                </div>

                <div style={{ width: '100%', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC' }}>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Alert ID</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Signal Source</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Description</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Severity</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alerts.map((a) => (
                                <tr key={a.id} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.15s' }}>
                                    <td style={{ padding: '16px', fontSize: '13px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-navy)' }}>{a.id}</td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: a.severity === 'critical' ? '#EF4444' : '#F59E0B' }} />
                                            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>{a.type}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>{a.msg}</div>
                                        <div style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                            <Clock size={10} /> {a.time}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: a.severity === 'critical' ? '#EF4444' : a.severity === 'warning' ? '#F59E0B' : '#0EA5E9' }}>
                                            {a.severity}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: a.status === 'Resolved' ? '#DCFCE7' : a.status === 'Active' ? '#FEE2E2' : '#FEFABE', color: a.status === 'Resolved' ? '#15803D' : a.status === 'Active' ? '#B91C1C' : '#854D0E' }}>
                                            {a.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>Investigate</button>
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
