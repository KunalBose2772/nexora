'use client';
import { CreditCard, Search, Download, MoreVertical, Building } from 'lucide-react';

const SUBS = [
    { name: 'Apollo Health Systems', id: 'SUB_99120', plan: 'Enterprise Tier', amount: '₹45,000', status: 'Active', next: 'Nov 12, 2026' },
    { name: 'City General Medical Center', id: 'SUB_40212', plan: 'Pro Tier', amount: '₹12,999', status: 'Active', next: 'Oct 05, 2026' },
    { name: 'Sunrise Dental & ENT Care', id: 'SUB_10291', plan: 'Starter Tier', amount: '₹4,999', status: 'Past Due', next: 'Sep 01, 2026' },
    { name: 'Metro Multispeciality', id: 'SUB_44910', plan: 'Pro Tier', amount: '₹12,999', status: 'Active', next: 'Dec 22, 2026' },
];

export default function SubscriptionsPage() {
    return (
        <div className="fade-in">
            {/* Page Header */}
            <div className="saas-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.02em' }}>Active Subscriptions</h1>
                    <p style={{ color: '#64748B', margin: 0, fontSize: '14px' }}>Monitor recurring billing, invoices, and payment statuses across all tenants.</p>
                </div>
                <div>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {[
                    { label: 'Total Active MRR', value: '₹24.8M', color: '#0F172A' },
                    { label: 'Active Subscriptions', value: '1,447', color: '#0F172A' },
                    { label: 'Past Due', value: '14', color: '#EF4444' },
                    { label: 'Avg Revenue / Account', value: '₹17,138', color: '#0F172A' },
                ].map((m, i) => (
                    <div key={i} style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                        <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 500, marginBottom: '8px' }}>{m.label}</div>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: m.color }}>{m.value}</div>
                    </div>
                ))}
            </div>

            {/* Table Card */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '11px', color: '#94A3B8' }} />
                        <input type="text" placeholder="Search by hospital or ID..." style={{ width: '100%', padding: '10px 14px 10px 40px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' }} />
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="sub-dt">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Tenant / Hospital</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Plan</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Amount</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Next Renewal</th>
                                <th style={{ padding: '12px 20px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {SUBS.map((sub, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #E2E8F0' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '14px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', flexShrink: 0 }}>
                                                <Building size={16} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{sub.name}</div>
                                                <div style={{ fontSize: '12px', color: '#64748B' }}>{sub.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 20px', fontSize: '14px', color: '#334155', fontWeight: 500 }}>{sub.plan}</td>
                                    <td style={{ padding: '14px 20px', fontSize: '14px', color: '#0F172A', fontWeight: 700 }}>{sub.amount}/mo</td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: sub.status === 'Active' ? '#ECFDF5' : '#FEF2F2', color: sub.status === 'Active' ? '#059669' : '#DC2626', whiteSpace: 'nowrap' }}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 20px', fontSize: '14px', color: '#64748B' }}>{sub.next}</td>
                                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><MoreVertical size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="sub-mob">
                    {SUBS.map((sub, i) => (
                        <div key={i} style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '6px' }}>
                                <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '14px', minWidth: 0 }}>{sub.name}</div>
                                <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: sub.status === 'Active' ? '#ECFDF5' : '#FEF2F2', color: sub.status === 'Active' ? '#059669' : '#DC2626', whiteSpace: 'nowrap', flexShrink: 0 }}>{sub.status}</span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>{sub.id}</div>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '13px', color: '#475569' }}>{sub.plan}</span>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{sub.amount}/mo</span>
                                <span style={{ fontSize: '12px', color: '#94A3B8' }}>Renews {sub.next}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .sub-dt { display: block; }
                .sub-mob { display: none; }
                @media (max-width: 768px) {
                    .sub-dt { display: none; }
                    .sub-mob { display: block; }
                }
            `}</style>
        </div>
    );
}
