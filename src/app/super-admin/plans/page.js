'use client';

import { useState } from 'react';
import { Layers, Plus, Edit2, CheckCircle2, XCircle, MoreVertical, CreditCard } from 'lucide-react';

export default function PlansPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const PLANS = [
        {
            id: 'plan_starter',
            name: 'Starter Tier',
            price: '₹4,999/mo',
            maxUsers: 5,
            maxBranches: 1,
            features: ['OPD Module', 'Patient EMR', 'Basic Billing'],
            status: 'active',
            tenantsCount: 412
        },
        {
            id: 'plan_pro',
            name: 'Pro Tier',
            price: '₹12,999/mo',
            maxUsers: 30,
            maxBranches: 3,
            features: ['All Starter Features', 'IPD & Wards', 'Pharmacy & Labs', 'HR Module'],
            status: 'active',
            tenantsCount: 890
        },
        {
            id: 'plan_enterprise',
            name: 'Enterprise Tier',
            price: 'Custom',
            maxUsers: 'Unlimited',
            maxBranches: 'Unlimited',
            features: ['All Pro Features', 'Dedicated AWS RDS', 'White-labeling', 'API Access'],
            status: 'active',
            tenantsCount: 145
        },
        {
            id: 'plan_legacy',
            name: 'Legacy Basic v1',
            price: '₹2,999/mo',
            maxUsers: 2,
            maxBranches: 1,
            features: ['OPD Module', 'Basic Billing'],
            status: 'archived',
            tenantsCount: 28
        }
    ];

    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Subscription Plans</h1>
                    <p style={{ fontSize: '14px', color: '#64748B' }}>Manage SaaS tiers, pricing, and feature access limits.</p>
                </div>
                <button style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: '#10B981', color: 'white', padding: '10px 16px',
                    borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                    border: 'none', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)'
                }}>
                    <Plus size={16} /> Create New Plan
                </button>
            </div>

            {/* Plans Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {PLANS.map((plan) => (
                    <div key={plan.id} style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        opacity: plan.status === 'archived' ? 0.7 : 1
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: plan.status === 'active' ? '#10B981' : '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                    {plan.status === 'active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                    {plan.status}
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{plan.name}</h3>
                                <div style={{ fontSize: '13px', color: '#64748B' }}>ID: {plan.id}</div>
                            </div>
                            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                                {plan.price}
                            </div>
                        </div>

                        <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '12px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                                <span style={{ color: '#64748B' }}>Max Users:</span>
                                <span style={{ fontWeight: 600, color: '#0F172A' }}>{plan.maxUsers}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                <span style={{ color: '#64748B' }}>Max Branches:</span>
                                <span style={{ fontWeight: 600, color: '#0F172A' }}>{plan.maxBranches}</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>Included Features</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {plan.features.map(f => (
                                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#334155' }}>
                                        <Layers size={14} style={{ color: '#10B981' }} />
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                                <Building size={14} />
                                {plan.tenantsCount} active tenants
                            </div>
                            <button style={{
                                padding: '6px 12px', border: '1px solid #E2E8F0', background: 'white',
                                borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: '#0F172A',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                            }}>
                                <Edit2 size={12} /> Edit Plan
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
