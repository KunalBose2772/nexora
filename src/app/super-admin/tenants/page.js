'use client';
import { useState } from 'react';
import { Building, Plus, Search, Filter, MoreVertical, ShieldCheck, Clock, ExternalLink, X } from 'lucide-react';
import Link from 'next/link';

const INITIAL_TENANTS = [
    { name: 'Apollo Health Systems', id: 'TEN-9201', domain: 'apollo.your-domain.com', plan: 'Enterprise Annual', users: '1,240', status: 'Active', badge: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    { name: 'City General Medical Center', id: 'TEN-8492', domain: 'citygeneral.your-domain.com', plan: 'Professional Monthly', users: '450', status: 'Active', badge: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    { name: 'MediCare Clinics', id: 'TEN-8104', domain: 'medicare.your-domain.com', plan: 'Basic Quarterly', users: '42', status: 'Payment Due', badge: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    { name: 'Prime Heart Institute', id: 'TEN-7221', domain: 'primeheart.your-domain.com', plan: 'Enterprise Custom', users: '820', status: 'Active', badge: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    { name: 'Sunrise Diagnostics Hub', id: 'TEN-6019', domain: 'sunrise.your-domain.com', plan: 'Professional Monthly', users: '120', status: 'Suspended', badge: '#EF4444', bg: 'rgba(239,68,68,0.1)' }
];

export default function TenantsPage() {
    const [tenants, setTenants] = useState(INITIAL_TENANTS);
    const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);

    const handleProvision = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const planMapping = {
            'starter': 'Starter Tier',
            'pro': 'Pro Tier',
            'enterprise': 'Enterprise Tier'
        };

        const newTenant = {
            name: formData.get('hospitalName'),
            id: `TEN-${Math.floor(1000 + Math.random() * 9000)}`,
            domain: `${formData.get('subdomain')}.your-domain.com`,
            plan: planMapping[formData.get('plan')],
            users: '1',
            status: 'Active',
            badge: '#10B981',
            bg: 'rgba(16,185,129,0.1)'
        };

        setTenants([newTenant, ...tenants]);
        setIsProvisionModalOpen(false);
    };

    return (
        <div className="fade-in">
            {/* Page Header */}
            <div className="saas-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.02em' }}>Tenant Management</h1>
                    <p style={{ color: '#64748B', margin: 0, fontSize: '14px' }}>Manage hospital accounts, provision new instances, and govern licenses.</p>
                </div>
                <div>
                    <button onClick={() => setIsProvisionModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#10B981', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}>
                        <Plus size={16} /> Provision New Hospital
                    </button>
                </div>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                {/* Search Bar */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '11px' }} />
                        <input type="text" placeholder="Search by Hospital Name, Domain, or Tenant ID..." style={{ width: '100%', padding: '10px 14px 10px 40px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', fontSize: '14px', background: '#F8FAFC', boxSizing: 'border-box' }} onFocus={(e) => e.currentTarget.style.borderColor = '#10B981'} onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'} />
                    </div>
                    <button onClick={() => alert('Advanced filters loaded.')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: '#475569', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        <Filter size={16} /> Filters
                    </button>
                </div>

                {/* Desktop Table */}
                <div className="tenant-dt">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                            <tr>
                                <th style={{ padding: '12px 20px', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Hospital Tenant</th>
                                <th style={{ padding: '12px 20px', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Platform Domain</th>
                                <th style={{ padding: '12px 20px', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Subscription</th>
                                <th style={{ padding: '12px 20px', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Users</th>
                                <th style={{ padding: '12px 20px', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '12px 20px', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #E2E8F0' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '14px 20px' }}>
                                        <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '14px' }}>{row.name}</div>
                                        <div style={{ fontSize: '12px', color: '#64748B', fontFamily: 'monospace' }}>{row.id}</div>
                                    </td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <a href={`https://${row.domain}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3B82F6', textDecoration: 'none', fontWeight: 500, fontSize: '13px' }}>
                                            {row.domain} <ExternalLink size={12} />
                                        </a>
                                    </td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <div style={{ color: '#0F172A', fontWeight: 500, fontSize: '13px' }}>{row.plan}</div>
                                        <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}><Clock size={11} /> Renews in 14 days</div>
                                    </td>
                                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#475569' }}>{row.users}</td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <span style={{ padding: '4px 10px', fontSize: '12px', fontWeight: 600, color: row.badge, background: row.bg, borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                                            {row.status === 'Active' && <ShieldCheck size={11} />} {row.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                        <button onClick={() => alert('Accessing tenant configuration...')} style={{ padding: '7px 14px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#0F172A', cursor: 'pointer', marginRight: '6px' }}>Manage</button>
                                        <button onClick={() => alert('Opening tenant options...')} style={{ padding: '7px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><MoreVertical size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="tenant-mob">
                    {TENANTS.map((row, i) => (
                        <div key={i} style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '14px', marginBottom: '2px' }}>{row.name}</div>
                                    <div style={{ fontSize: '12px', color: '#64748B', fontFamily: 'monospace' }}>{row.id}</div>
                                </div>
                                <span style={{ padding: '4px 10px', fontSize: '12px', fontWeight: 600, color: row.badge, background: row.bg, borderRadius: '20px', whiteSpace: 'nowrap', flexShrink: 0 }}>{row.status}</span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>{row.plan} · {row.users} users</div>
                            <a href={`https://${row.domain}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#3B82F6', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                {row.domain} <ExternalLink size={10} />
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Provision Modal */}
            {isProvisionModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    {/* Backdrop */}
                    <div
                        style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }}
                        onClick={() => setIsProvisionModalOpen(false)}
                    />

                    {/* Modal Content */}
                    <div style={{ position: 'relative', background: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>

                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Provision New Tenant</h2>
                            <button onClick={() => setIsProvisionModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body / Form */}
                        <div style={{ padding: '24px', overflowY: 'auto' }}>
                            <form id="provision-form" onSubmit={handleProvision} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Hospital Name</label>
                                    <input required name="hospitalName" type="text" placeholder="e.g. Apex General Hospital" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} onFocus={(e) => e.currentTarget.style.borderColor = '#10B981'} onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Subdomain</label>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
                                        <input required name="subdomain" type="text" placeholder="apexgeneral" style={{ flex: 1, padding: '10px 12px', border: 'none', fontSize: '14px', outline: 'none', minWidth: 0 }} />
                                        <div style={{ padding: '10px 12px', background: '#F8FAFC', color: '#64748B', fontSize: '14px', fontWeight: 500, borderLeft: '1px solid #E2E8F0' }}>
                                            .your-domain.com
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>This will be the hospital's dedicated login URL.</p>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Admin Email Address</label>
                                    <input required name="adminEmail" type="email" placeholder="admin@apexgeneral.com" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} onFocus={(e) => e.currentTarget.style.borderColor = '#10B981'} onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Subscription Plan</label>
                                    <select required name="plan" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', background: 'white', boxSizing: 'border-box' }}>
                                        <option value="starter">Starter Tier (₹4,999/mo)</option>
                                        <option value="pro">Pro Tier (₹12,999/mo)</option>
                                        <option value="enterprise">Enterprise Tier (Custom)</option>
                                    </select>
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderRadius: '0 0 16px 16px' }}>
                            <button onClick={() => setIsProvisionModalOpen(false)} type="button" style={{ padding: '10px 16px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                                Cancel
                            </button>
                            <button type="submit" form="provision-form" style={{ padding: '10px 16px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                                Provision Tenant
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .tenant-dt { display: block; }
                .tenant-mob { display: none; }
                @media (max-width: 768px) {
                    .tenant-dt { display: none; }
                    .tenant-mob { display: block; }
                }
            `}</style>
        </div>
    );
}
