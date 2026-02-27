'use client';
import { Building, Plus, Search, Filter, MoreVertical, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function TenantsPage() {
    return (
        <div className="fade-in" style={{ padding: '0 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.02em' }}>Tenant Management</h1>
                    <p style={{ color: '#64748B', margin: 0, fontSize: '14px' }}>
                        Manage hospital accounts, provision new instances, and govern licenses.
                    </p>
                </div>
                <div>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#10B981', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.2)', transition: 'transform 150ms' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <Plus size={16} />
                        Provision New Hospital
                    </button>
                </div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', padding: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '320px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                            <input type="text" placeholder="Search by Hospital Name, Domain, or Tenant ID..." style={{ width: '100%', padding: '10px 16px 10px 42px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', fontSize: '14px', background: '#F8FAFC', transition: 'border-color 150ms' }} onFocus={(e) => e.currentTarget.style.borderColor = '#10B981'} onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'} />
                        </div>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: '#475569', cursor: 'pointer' }}>
                            <Filter size={16} /> Filters
                        </button>
                    </div>
                </div>

                <div style={{ borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Hospital Tenant</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Platform Domain</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Subscription</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Users</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: 'Apollo Health Systems', id: 'TEN-9201', domain: 'apollo.nexora.health', plan: 'Enterprise Annual', users: '1,240', status: 'Active', badge: '#10B981', bg: 'rgba(16,185,129,0.1)' },
                                { name: 'City General Medical Center', id: 'TEN-8492', domain: 'citygeneral.nexora.health', plan: 'Professional Monthly', users: '450', status: 'Active', badge: '#10B981', bg: 'rgba(16,185,129,0.1)' },
                                { name: 'MediCare Clinics', id: 'TEN-8104', domain: 'medicare.nexora.health', plan: 'Basic Quarterly', users: '42', status: 'Payment Due', badge: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
                                { name: 'Prime Heart Institute', id: 'TEN-7221', domain: 'primeheart.nexora.health', plan: 'Enterprise Custom', users: '820', status: 'Active', badge: '#10B981', bg: 'rgba(16,185,129,0.1)' },
                                { name: 'Sunrise Diagnostics Hub', id: 'TEN-6019', domain: 'sunrise.nexora.health', plan: 'Professional Monthly', users: '120', status: 'Suspended', badge: '#EF4444', bg: 'rgba(239,68,68,0.1)' }
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #E2E8F0', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontWeight: 600, color: '#0F172A', fontSize: '15px' }}>{row.name}</span>
                                            <span style={{ fontSize: '12px', color: '#64748B', fontFamily: 'monospace' }}>{row.id}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <a href={`https://${row.domain}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3B82F6', textDecoration: 'none', fontWeight: 500, fontSize: '13px' }}>
                                            {row.domain} <ExternalLink size={12} />
                                        </a>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ color: '#0F172A', fontWeight: 500 }}>{row.plan}</span>
                                            <span style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Renews in 14 days</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', fontWeight: 600, color: '#475569' }}>
                                        {row.users}
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ padding: '4px 10px', fontSize: '12px', fontWeight: 600, color: row.badge, background: row.bg, borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            {row.status === 'Active' && <ShieldCheck size={12} />} {row.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <button style={{ padding: '8px 16px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#0F172A', cursor: 'pointer', transition: 'all 150ms', marginRight: '8px' }} onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'} onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}>
                                            Manage
                                        </button>
                                        <button style={{ padding: '8px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                                            <MoreVertical size={16} />
                                        </button>
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
