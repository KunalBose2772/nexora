'use client';

import { Users, Search, Activity, Building, Download, MoreVertical, Plus } from 'lucide-react';

export default function ResellersPage() {
    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Resellers & Partners</h1>
                    <p style={{ fontSize: '14px', color: '#64748B' }}>Manage your agency network, their commissioned tenants, and revenue shares.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: '#10B981', color: 'white', padding: '10px 16px',
                        borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                        border: 'none', cursor: 'pointer', boxShadow: '0 2px 4px rgba(16,185,129,0.2)'
                    }}>
                        <Plus size={16} /> Add Reseller
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                            <Users size={20} strokeWidth={2} />
                        </div>
                        <div>
                            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Active Partners</div>
                            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>24</div>
                        </div>
                    </div>
                </div>
                <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                            <Building size={20} strokeWidth={2} />
                        </div>
                        <div>
                            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Partner-Referred Tenants</div>
                            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>128</div>
                        </div>
                    </div>
                </div>
                <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                            <Activity size={20} strokeWidth={2} />
                        </div>
                        <div>
                            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Total Earned Commission</div>
                            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>₹1.2M</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} />
                        <input type="text" placeholder="Search partners..." style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '14px', outline: 'none' }} />
                    </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Agency Name</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Contact Person</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Onboarded Hospitals</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Rev Share</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: 'TechMed Solutions', contact: 'Ravi Kumar (ravi@techmed.in)', hospitals: 45, revShare: '20%', status: 'Active' },
                                { name: 'CareLogic IT', contact: 'Anita Desai (anita@carelogic.com)', hospitals: 12, revShare: '15%', status: 'Active' },
                                { name: 'MediSys Integrators', contact: 'Sumit Patel (sumit@medisys.in)', hospitals: 3, revShare: '10%', status: 'Inactive' },
                                { name: 'Global Webify Resellers', contact: 'Kunal Bose (kunal@gw.com)', hospitals: 68, revShare: '30%', status: 'Active' },
                            ].map((reseller, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #E2E8F0', background: 'white' }}>
                                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{reseller.name}</td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#64748B' }}>{reseller.contact}</td>
                                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9', borderRadius: '100px', width: '30px', height: '30px', color: '#3B82F6' }}>
                                            {reseller.hospitals}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '14px', color: '#0F172A', fontWeight: 600 }}>{reseller.revShare}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, background: reseller.status === 'Active' ? '#ECFDF5' : '#F1F5F9', color: reseller.status === 'Active' ? '#059669' : '#64748B' }}>
                                            {reseller.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><MoreVertical size={16} /></button>
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
