'use client';
import { Users, Filter, Plus, Search, MoreHorizontal, Activity, Phone, Mail, Building2, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function BranchesPage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Hospital Network</h1>
                    <p className="page-header__subtitle">
                        Oversee multi-location facilities, centers, and administrative branches.
                    </p>
                </div>
                <div className="dashboard-header-buttons">
                    <Link href="/branches/new" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <Plus size={15} strokeWidth={1.5} />
                        Initialize New Branch
                    </Link>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                            <input type="text" placeholder="Search by branch name, code, or city..." style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                        </div>
                        <button className="btn btn-secondary" style={{ background: '#fff' }}>
                            <Filter size={16} /> Filter by Facility Type
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {[
                        { name: 'Nexora Health Main Campus', code: 'HQ-BLR', type: 'Full Scale Multispeciality', city: 'Bangalore', state: 'Karnataka', beds: '500+', pnone: '+91 80 4000 8000', status: 'Operational' },
                        { name: 'Nexora Outpatient Center - South', code: 'BLR-02', type: 'Outpatient Day-care', city: 'Bangalore', state: 'Karnataka', beds: 'N/A', pnone: '+91 80 4111 8111', status: 'Operational' },
                        { name: 'Nexora Diagnostics Node', code: 'PATH-01', type: 'Pathology Lab', city: 'Mumbai', state: 'Maharashtra', beds: 'N/A', pnone: '+91 22 2000 3000', status: 'Operational' },
                        { name: 'Nexora Regional Hub East', code: 'REG-KOL', type: 'Full Scale Multispeciality', city: 'Kolkata', state: 'West Bengal', beds: '250', pnone: '+91 33 5000 6000', status: 'Maintenance' },
                        { name: 'Nexora Emergency Unit North', code: 'ER-DEL', type: 'ER / Satellite', city: 'New Delhi', state: 'Delhi', beds: '20', pnone: '+91 11 1000 2000', status: 'Operational' },
                    ].map((branch, i) => (
                        <div key={i} style={{ border: '1px solid var(--color-border-light)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#FFFFFF', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--color-cyan)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)' }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-light)'; e.currentTarget.style.boxShadow = 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(0,194,255,0.1)', color: 'var(--color-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Building2 size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy)', margin: '0 0 4px 0', lineHeight: 1.2 }}>{branch.name}</h3>
                                        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, fontFamily: 'monospace' }}>Code: {branch.code}</p>
                                    </div>
                                </div>
                            </div>

                            <span className={`badge ${branch.status === 'Operational' ? 'badge-green' : 'badge-yellow'}`} style={{ padding: '4px 8px', fontSize: '11px', alignSelf: 'flex-start' }}>{branch.status}</span>

                            <div style={{ flex: 1, borderTop: '1px dashed var(--color-border-light)', paddingTop: '16px', marginTop: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                                    <span style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> Location:</span>
                                    <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{branch.city}, {branch.state}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                                    <span style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14} /> Facility:</span>
                                    <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{branch.type}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                                    <span style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> Reception:</span>
                                    <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{branch.pnone}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', paddingTop: '16px' }}>
                                <button className="btn btn-secondary btn-sm" style={{ flex: 1, padding: '8px', background: '#F8FAFC', color: 'var(--color-navy)', border: '1px solid var(--color-border-light)' }}>
                                    Manage Facility
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
