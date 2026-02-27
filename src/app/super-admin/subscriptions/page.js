'use client';

import { useState } from 'react';
import { CreditCard, Search, Download, Filter, MoreVertical, Building } from 'lucide-react';

export default function SubscriptionsPage() {
    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Active Subscriptions</h1>
                    <p style={{ fontSize: '14px', color: '#64748B' }}>Monitor recurring billing, invoices, and payment statuses across all tenants.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: 'white', border: '1px solid #E2E8F0', color: '#0F172A', padding: '10px 16px',
                        borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                        cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 500, marginBottom: '8px' }}>Total Active MRR</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>₹24.8M</div>
                </div>
                <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 500, marginBottom: '8px' }}>Active Subscriptions</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>1,447</div>
                </div>
                <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 500, marginBottom: '8px' }}>Past Due</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#EF4444' }}>14</div>
                </div>
                <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 500, marginBottom: '8px' }}>Avg Revenue Per Account</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>₹17,138</div>
                </div>
            </div>

            {/* Table */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} />
                        <input
                            type="text"
                            placeholder="Search by hospital or ID..."
                            style={{
                                width: '100%', padding: '9px 12px 9px 36px',
                                border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none'
                            }}
                        />
                    </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Tenant / Hospital</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Plan</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Amount</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Next Renewal</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: 'Apollo Health Systems', id: 'SUB_99120', plan: 'Enterprise Tier', amount: '₹45,000', status: 'Active', next: 'Nov 12, 2026' },
                                { name: 'City General Medical Center', id: 'SUB_40212', plan: 'Pro Tier', amount: '₹12,999', status: 'Active', next: 'Oct 05, 2026' },
                                { name: 'Sunrise Dental & ENT Care', id: 'SUB_10291', plan: 'Starter Tier', amount: '₹4,999', status: 'Past Due', next: 'Sep 01, 2026' },
                                { name: 'Metro Multispeciality', id: 'SUB_44910', plan: 'Pro Tier', amount: '₹12,999', status: 'Active', next: 'Dec 22, 2026' },
                            ].map((sub, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #E2E8F0', background: 'white' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                                                <Building size={16} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{sub.name}</div>
                                                <div style={{ fontSize: '12px', color: '#64748B' }}>{sub.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#334155', fontWeight: 500 }}>{sub.plan}</td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#0F172A', fontWeight: 600 }}>{sub.amount}/mo</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 600,
                                            background: sub.status === 'Active' ? '#ECFDF5' : '#FEF2F2',
                                            color: sub.status === 'Active' ? '#059669' : '#DC2626'
                                        }}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#64748B' }}>{sub.next}</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
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
