'use client';
import { useState } from 'react';
import { CreditCard, Search, Download, MoreVertical, Building } from 'lucide-react';

const SUBS = [
    { name: 'Apollo Health Systems', id: 'SUB_99120', plan: 'Enterprise Tier', amount: '₹45,000', status: 'Active', next: 'Nov 12, 2026' },
    { name: 'City General Medical Center', id: 'SUB_40212', plan: 'Pro Tier', amount: '₹12,999', status: 'Active', next: 'Oct 05, 2026' },
    { name: 'Sunrise Dental & ENT Care', id: 'SUB_10291', plan: 'Starter Tier', amount: '₹4,999', status: 'Past Due', next: 'Sep 01, 2026' },
    { name: 'Metro Multispeciality', id: 'SUB_44910', plan: 'Pro Tier', amount: '₹12,999', status: 'Active', next: 'Dec 22, 2026' },
];

export default function SubscriptionsPage() {
    const [subs, setSubs] = useState(SUBS);
    const [searchQuery, setSearchQuery] = useState('');
    const [openActionId, setOpenActionId] = useState(null);

    const filteredSubs = subs.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleExport = () => {
        const header = "Tenant,ID,Plan,Amount,Status,Next Renewal\n";
        const csv = filteredSubs.map(s => `${s.name},${s.id},${s.plan},${s.amount.replace('₹', '')},${s.status},${s.next}`).join('\n');
        const blob = new Blob([header + csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'subscriptions-export.csv';
        a.click();
        URL.revokeObjectURL(url);
    };
    return (
        <div className="fade-in">
            {/* Page Header */}
            <div className="saas-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.02em' }}>Active Subscriptions</h1>
                    <p style={{ color: '#64748B', margin: 0, fontSize: '14px' }}>Monitor recurring billing, invoices, and payment statuses across all tenants.</p>
                </div>
                <div>
                    <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
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
                        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} type="text" placeholder="Search by hospital or ID..." style={{ width: '100%', padding: '10px 14px 10px 40px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' }} onFocus={(e) => e.currentTarget.style.borderColor = '#10B981'} onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'} />
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
                            {filteredSubs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748B', fontSize: '14px' }}>No subscriptions found matching your search.</td>
                                </tr>
                            ) : filteredSubs.map((sub, i) => (
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
                                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: sub.status === 'Active' ? '#ECFDF5' : (sub.status === 'Suspended' ? '#FEF2F2' : '#FFFBEB'), color: sub.status === 'Active' ? '#059669' : (sub.status === 'Suspended' ? '#DC2626' : '#D97706'), whiteSpace: 'nowrap' }}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 20px', fontSize: '14px', color: '#64748B' }}>{sub.next}</td>
                                    <td style={{ padding: '14px 20px', textAlign: 'right', position: 'relative' }}>
                                        <button onClick={() => setOpenActionId(openActionId === sub.id ? null : sub.id)} style={{ padding: '7px', background: openActionId === sub.id ? '#F8FAFC' : 'none', border: openActionId === sub.id ? '1px solid #E2E8F0' : '1px solid transparent', color: '#94A3B8', cursor: 'pointer', borderRadius: '6px' }}><MoreVertical size={16} /></button>

                                        {/* Row Actions Dropdown */}
                                        {openActionId === sub.id && (
                                            <div style={{ position: 'absolute', top: '100%', right: '20px', marginTop: '4px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minWidth: '160px', zIndex: 10, overflow: 'hidden', textAlign: 'left' }}>
                                                {sub.status !== 'Active' && (
                                                    <button onClick={() => {
                                                        setOpenActionId(null);
                                                        setSubs(subs.map(s => s.id === sub.id ? { ...s, status: 'Active' } : s));
                                                    }} style={{ display: 'block', width: '100%', padding: '10px 14px', background: 'none', border: 'none', textAlign: 'left', fontSize: '13px', color: '#10B981', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>Mark Active</button>
                                                )}
                                                <button onClick={() => {
                                                    setOpenActionId(null);
                                                    setSubs(subs.map(s => s.id === sub.id ? { ...s, status: 'Past Due' } : s));
                                                }} style={{ display: 'block', width: '100%', padding: '10px 14px', background: 'none', border: 'none', textAlign: 'left', fontSize: '13px', color: '#334155', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>Mark Past Due</button>

                                                <div style={{ height: '1px', background: '#E2E8F0', margin: '4px 0' }}></div>

                                                <button onClick={() => {
                                                    setOpenActionId(null);
                                                    if (window.confirm('Suspending this subscription will block tenant access. Continue?')) {
                                                        setSubs(subs.map(s => s.id === sub.id ? { ...s, status: 'Suspended' } : s));
                                                    }
                                                }} style={{ display: 'block', width: '100%', padding: '10px 14px', background: 'none', border: 'none', textAlign: 'left', fontSize: '13px', color: '#EF4444', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#FEF2F2'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>Suspend Subscription</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="sub-mob">
                    {filteredSubs.length === 0 ? (
                        <div style={{ padding: '30px', textAlign: 'center', color: '#64748B', fontSize: '14px' }}>No subscriptions found.</div>
                    ) : filteredSubs.map((sub, i) => (
                        <div key={i} style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '6px' }}>
                                <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '14px', minWidth: 0 }}>{sub.name}</div>
                                <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: sub.status === 'Active' ? '#ECFDF5' : (sub.status === 'Suspended' ? '#FEF2F2' : '#FFFBEB'), color: sub.status === 'Active' ? '#059669' : (sub.status === 'Suspended' ? '#DC2626' : '#D97706'), whiteSpace: 'nowrap', flexShrink: 0 }}>{sub.status}</span>
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
