'use client';
import { Building, ShieldCheck, Activity, Users, ArrowUpRight, TrendingUp, MonitorCheck, HardDrive, RefreshCcw, MoreVertical, CreditCard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function SuperAdminDashboard() {
    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.02em' }}>Platform Overview</h1>
                    <p style={{ color: '#64748B', margin: 0, fontSize: '14px' }}>
                        Monitor SaaS performance, active tenants, and system infrastructure.
                    </p>
                </div>
                <div>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#10B981', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}>
                        <Building size={16} />
                        Onboard New Hospital
                    </button>
                </div>
            </div>

            {/* Platform Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                            <Building size={24} />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: '20px' }}>
                            <ArrowUpRight size={14} /> +12%
                        </span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 8px 0', fontWeight: 500 }}>Active Hospital Tenants</p>
                    <h4 style={{ fontSize: '32px', fontWeight: 700, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>142</h4>
                </div>

                <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                            <TrendingUp size={24} />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: '20px' }}>
                            <ArrowUpRight size={14} /> +8.5%
                        </span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 8px 0', fontWeight: 500 }}>Monthly Recurring Revenue (MRR)</p>
                    <h4 style={{ fontSize: '32px', fontWeight: 700, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>₹24.5L</h4>
                </div>

                <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
                            <Users size={24} />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', background: '#F1F5F9', padding: '4px 8px', borderRadius: '20px' }}>
                            Platform Wide
                        </span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 8px 0', fontWeight: 500 }}>Total User Seats (Doctors/Staff)</p>
                    <h4 style={{ fontSize: '32px', fontWeight: 700, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>8,450</h4>
                </div>

                <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
                            <HardDrive size={24} />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: '20px' }}>
                            <MonitorCheck size={14} /> 99.98%
                        </span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 8px 0', fontWeight: 500 }}>Global Server Health</p>
                    <h4 style={{ fontSize: '32px', fontWeight: 700, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Stable</h4>
                </div>
            </div>

            {/* Split Section: Recent Tenants & System Logs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px' }}>

                {/* Tenants Table */}
                <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>Recent Tenant Onboardings</h3>
                        <Link href="/super-admin/tenants" style={{ fontSize: '14px', color: '#10B981', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Hospital Name & ID</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Sub Plan</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '16px 24px', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: 'City General Hospital', id: 'TEN-8492', plan: 'Enterprise (Annual)', status: 'Active', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
                                    { name: 'Sunrise Medicare Center', id: 'TEN-8491', plan: 'Professional (Monthly)', status: 'Active', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
                                    { name: 'Apex Ortho Clinic', id: 'TEN-8490', plan: 'Basic (Monthly)', status: 'Payment Due', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
                                    { name: 'Northstar Care', id: 'TEN-8489', plan: 'Enterprise (Annual)', status: 'Deploying...', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
                                    { name: 'Valley Childrens', id: 'TEN-8488', plan: 'Trial (14 Days)', status: 'Trial Active', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
                                ].map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #E2E8F0' }}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ fontWeight: 600, color: '#0F172A' }}>{row.name}</div>
                                            <div style={{ fontSize: '13px', color: '#64748B', fontFamily: 'monospace' }}>{row.id}</div>
                                        </td>
                                        <td style={{ padding: '16px 24px', color: '#475569', fontWeight: 500 }}>{row.plan}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ background: row.bg, color: row.color, padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><MoreVertical size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Activity */}
                <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>System Activity</h3>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><RefreshCcw size={16} /></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                            { title: 'Database Backup Completed', desc: 'Cluster A auto-backup successful', time: '10 mins ago', icon: HardDrive, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
                            { title: 'New Feature Deployed', desc: 'v1.4 - Advanced Analytics Module', time: '2 hours ago', icon: Activity, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
                            { title: 'High CPU Usage Alert', desc: 'Node-03 reached 94% utilization', time: '5 hours ago', icon: ShieldCheck, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
                            { title: 'Payment Gateway Sync', desc: 'Stripe daily reconciliation done', time: '12 hours ago', icon: CreditCard, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
                            { title: 'API Limit Warning', desc: 'Tenant TEN-8210 approaching limits', time: '1 day ago', icon: Activity, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
                        ].map((log, i) => (
                            <div key={i} style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: log.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: log.color, flexShrink: 0 }}>
                                    <log.icon size={18} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.title}</div>
                                    <div style={{ fontSize: '13px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.desc}</div>
                                </div>
                                <div style={{ fontSize: '12px', color: '#94A3B8', whiteSpace: 'nowrap' }}>{log.time}</div>
                            </div>
                        ))}
                    </div>
                    <button style={{ width: '100%', padding: '12px', marginTop: '24px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                        View Full Logs
                    </button>
                </div>
            </div>

            <style>{`
                @media (max-width: 1024px) {
                    .saas-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
