'use client';
import { Layers, Plus, Edit2, CheckCircle2, XCircle, Building } from 'lucide-react';

const PLANS = [
    { id: 'plan_starter', name: 'Starter Tier', price: '₹4,999/mo', maxUsers: 5, maxBranches: 1, features: ['OPD Module', 'Patient EMR', 'Basic Billing'], status: 'active', tenantsCount: 412 },
    { id: 'plan_pro', name: 'Pro Tier', price: '₹12,999/mo', maxUsers: 30, maxBranches: 3, features: ['All Starter Features', 'IPD & Wards', 'Pharmacy & Labs', 'HR Module'], status: 'active', tenantsCount: 890 },
    { id: 'plan_enterprise', name: 'Enterprise Tier', price: 'Custom', maxUsers: 'Unlimited', maxBranches: 'Unlimited', features: ['All Pro Features', 'Dedicated AWS RDS', 'White-labeling', 'API Access'], status: 'active', tenantsCount: 145 },
    { id: 'plan_legacy', name: 'Legacy Basic v1', price: '₹2,999/mo', maxUsers: 2, maxBranches: 1, features: ['OPD Module', 'Basic Billing'], status: 'archived', tenantsCount: 28 },
];

export default function PlansPage() {
    return (
        <div className="fade-in">
            {/* Page Header */}
            <div className="saas-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.02em' }}>Subscription Plans</h1>
                    <p style={{ color: '#64748B', margin: 0, fontSize: '14px' }}>Manage SaaS tiers, pricing, and feature access limits.</p>
                </div>
                <div>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#10B981', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}>
                        <Plus size={16} /> Create New Plan
                    </button>
                </div>
            </div>

            {/* Plans Grid - uses auto-fit so always fits on any screen */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {PLANS.map((plan) => (
                    <div key={plan.id} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', opacity: plan.status === 'archived' ? 0.65 : 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Plan Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600, color: plan.status === 'active' ? '#10B981' : '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                                    {plan.status === 'active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                    {plan.status}
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>{plan.name}</h3>
                                <div style={{ fontSize: '12px', color: '#94A3B8' }}>{plan.id}</div>
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', textAlign: 'right', whiteSpace: 'nowrap' }}>{plan.price}</div>
                        </div>

                        {/* Limits */}
                        <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                                <span style={{ color: '#64748B' }}>Max Users</span>
                                <span style={{ fontWeight: 600, color: '#0F172A' }}>{plan.maxUsers}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                <span style={{ color: '#64748B' }}>Max Branches</span>
                                <span style={{ fontWeight: 600, color: '#0F172A' }}>{plan.maxBranches}</span>
                            </div>
                        </div>

                        {/* Features */}
                        <div style={{ marginBottom: '20px', flex: 1 }}>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>Included Features</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                {plan.features.map(f => (
                                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: '#334155' }}>
                                        <Layers size={13} style={{ color: '#10B981', flexShrink: 0 }} /> {f}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748B' }}>
                                <Building size={13} /> {plan.tenantsCount} active tenants
                            </div>
                            <button style={{ padding: '6px 12px', border: '1px solid #E2E8F0', background: 'white', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Edit2 size={12} /> Edit Plan
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
