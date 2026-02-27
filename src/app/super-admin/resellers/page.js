'use client';
import { useState } from 'react';
import { Building, Plus, Search, Activity, Download, MoreVertical, Users, X } from 'lucide-react';

const INITIAL_RESELLERS = [
    { name: 'TechMed Solutions', contact: 'Ravi Kumar', email: 'ravi@techmed.in', hospitals: 45, revShare: '20%', status: 'Active' },
    { name: 'CareLogic IT', contact: 'Anita Desai', email: 'anita@carelogic.com', hospitals: 12, revShare: '15%', status: 'Active' },
    { name: 'MediSys Integrators', contact: 'Sumit Patel', email: 'sumit@medisys.in', hospitals: 3, revShare: '10%', status: 'Inactive' },
    { name: 'Global Webify Resellers', contact: 'Kunal Bose', email: 'kunal@gw.com', hospitals: 68, revShare: '30%', status: 'Active' },
];

export default function ResellersPage() {
    const [resellers, setResellers] = useState(INITIAL_RESELLERS);
    const [isResellerModalOpen, setIsResellerModalOpen] = useState(false);

    const handleOnboard = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const newReseller = {
            name: formData.get('agencyName'),
            contact: formData.get('contactName'),
            email: formData.get('email'),
            hospitals: 0,
            revShare: `${formData.get('revShare')}%`,
            status: 'Active'
        };

        setResellers([newReseller, ...resellers]);
        setIsResellerModalOpen(false);
    };

    return (
        <div className="fade-in">
            {/* Page Header */}
            <div className="saas-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.02em' }}>Resellers & Partners</h1>
                    <p style={{ color: '#64748B', margin: 0, fontSize: '14px' }}>Manage your agency network, their commissioned tenants, and revenue shares.</p>
                </div>
                <div>
                    <button onClick={() => setIsResellerModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#10B981', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}>
                        <Plus size={16} /> Add Reseller
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {[
                    { label: 'Active Partners', value: '24', icon: Users, color: '#10B981', bg: '#ECFDF5' },
                    { label: 'Partner-Referred Tenants', value: '128', icon: Building, color: '#3B82F6', bg: '#EFF6FF' },
                    { label: 'Total Earned Commission', value: '₹1.2M', icon: Activity, color: '#8B5CF6', bg: '#F5F3FF' },
                ].map((s, i) => (
                    <div key={i} style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
                            <s.icon size={20} />
                        </div>
                        <div>
                            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 500, marginBottom: '4px' }}>{s.label}</div>
                            <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Card */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '11px', color: '#94A3B8' }} />
                        <input type="text" placeholder="Search partners..." style={{ width: '100%', padding: '10px 14px 10px 40px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' }} />
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="reseller-dt">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Agency Name</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Contact Person</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Hospitals</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Rev Share</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resellers.map((r, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #E2E8F0' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{r.name}</td>
                                    <td style={{ padding: '14px 20px', fontSize: '14px', color: '#64748B' }}>{r.contact} <span style={{ fontSize: '12px', color: '#94A3B8' }}>({r.email})</span></td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#EFF6FF', borderRadius: '20px', padding: '4px 12px', color: '#3B82F6', fontWeight: 700, fontSize: '13px' }}>{r.hospitals}</div>
                                    </td>
                                    <td style={{ padding: '14px 20px', fontSize: '14px', color: '#0F172A', fontWeight: 600 }}>{r.revShare}</td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: r.status === 'Active' ? '#ECFDF5' : '#F1F5F9', color: r.status === 'Active' ? '#059669' : '#64748B' }}>{r.status}</span>
                                    </td>
                                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                        <button onClick={() => alert('Opening reseller actions...')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><MoreVertical size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="reseller-mob">
                    {RESELLERS.map((r, i) => (
                        <div key={i} style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                                <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '14px' }}>{r.name}</div>
                                <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: r.status === 'Active' ? '#ECFDF5' : '#F1F5F9', color: r.status === 'Active' ? '#059669' : '#64748B', flexShrink: 0 }}>{r.status}</span>
                            </div>
                            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>{r.contact} · {r.email}</div>
                            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                                <span style={{ fontSize: '12px', color: '#475569' }}><strong>{r.hospitals}</strong> hospitals</span>
                                <span style={{ fontSize: '12px', color: '#475569' }}>Rev share: <strong>{r.revShare}</strong></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Reseller Modal */}
            {isResellerModalOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    {/* Backdrop */}
                    <div
                        style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }}
                        onClick={() => setIsResellerModalOpen(false)}
                    />

                    {/* Modal Content */}
                    <div style={{ position: 'relative', background: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>

                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Onboard New Reseller</h2>
                            <button onClick={() => setIsResellerModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body / Form */}
                        <div style={{ padding: '24px', overflowY: 'auto' }}>
                            <form id="reseller-form" onSubmit={handleOnboard} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Agency / Company Name</label>
                                    <input required name="agencyName" type="text" placeholder="e.g. CareLogic IT Solutions" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} onFocus={(e) => e.currentTarget.style.borderColor = '#10B981'} onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Primary Contact Name</label>
                                        <input required name="contactName" type="text" placeholder="e.g. Anita Desai" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} onFocus={(e) => e.currentTarget.style.borderColor = '#10B981'} onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Revenue Share (%)</label>
                                        <input required name="revShare" type="number" placeholder="20" defaultValue={20} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} onFocus={(e) => e.currentTarget.style.borderColor = '#10B981'} onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'} />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Contact Email Address</label>
                                    <input required name="email" type="email" placeholder="anita@carelogic.com" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} onFocus={(e) => e.currentTarget.style.borderColor = '#10B981'} onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'} />
                                    <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>An invitation link will be sent to this email to setup their partner portal.</p>
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderRadius: '0 0 16px 16px' }}>
                            <button onClick={() => setIsResellerModalOpen(false)} type="button" style={{ padding: '10px 16px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                                Cancel
                            </button>
                            <button type="submit" form="reseller-form" style={{ padding: '10px 16px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                                Onboard Reseller
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .reseller-dt { display: block; }
                .reseller-mob { display: none; }
                @media (max-width: 768px) {
                    .reseller-dt { display: none; }
                    .reseller-mob { display: block; }
                }
            `}</style>
        </div>
    );
}
