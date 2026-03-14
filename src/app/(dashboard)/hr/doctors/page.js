'use client';
import { ArrowLeft, UserCog, Search, Filter, Mail, Phone, MoreVertical, Plus } from 'lucide-react';
import Link from 'next/link';

import { useState, useEffect } from 'react';

export default function DoctorsDirectoryPage() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await fetch('/api/hr/staff');
                if (res.ok) {
                    const data = await res.json();
                    // filter to show only doctors
                    const docs = (data.staff || []).filter(s =>
                        s.role?.toLowerCase() === 'doctor' ||
                        s.role?.toLowerCase() === 'consultant' ||
                        s.role?.toLowerCase() === 'physician' ||
                        (s.department && s.department.toLowerCase().includes('doctor'))
                    );
                    setDoctors(docs);
                }
            } catch (err) {
                console.error("Failed to fetch doctors:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter(doc =>
        (doc.name && doc.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.department && doc.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.specialization && doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/hr" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Medical Staff Directory</h1>
                        <p className="page-header__subtitle">Manage doctors, surgeons, and consulting physicians.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <Link href="/hr/new" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <Plus size={15} strokeWidth={1.5} />
                        Add Doctor
                    </Link>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                            <input type="text" placeholder="Search by name, department, or specialization..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                        </div>
                        <button className="btn btn-secondary" style={{ background: '#fff' }}>
                            <Filter size={16} /> Filters
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1', color: '#94A3B8' }}>Loading doctors mapping...</div>
                    ) : filteredDoctors.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1', color: '#94A3B8' }}>No medical staff found matching &quot;{searchTerm}&quot;</div>
                    ) : filteredDoctors.map((doc, i) => (
                        <div key={doc.id || i} style={{ border: '1px solid var(--color-border-light)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#FFFFFF', transition: 'all 0.2s', cursor: 'default' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--color-cyan)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)' }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-light)'; e.currentTarget.style.boxShadow = 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0,194,255,0.1)', color: 'var(--color-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 600 }}>
                                        {doc.name ? doc.name.split(' ')[0][0] + (doc.name.split(' ')[1] ? doc.name.split(' ')[1][0] : '') : 'Dr'}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)', margin: '0 0 4px 0' }}>{doc.name || 'Unnamed Doctor'}</h3>
                                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>{doc.specialization || (doc.role === 'doctor' ? 'Consultant' : doc.role) || 'Medical Staff'}</p>
                                    </div>
                                </div>
                                <span className={`badge ${doc.status === 'Active' ? 'badge-green' : 'badge-yellow'}`} style={{ padding: '4px 8px', fontSize: '11px' }}>{doc.status || 'Active'}</span>
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>Department:</span>
                                    <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{doc.department || 'N/A'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>Employee ID:</span>
                                    <span style={{ fontWeight: 500, fontFamily: 'monospace', color: 'var(--color-text-primary)' }}>{doc.userId || '—'}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', paddingTop: '16px', borderTop: '1px solid var(--color-border-light)' }}>
                                <button className="btn btn-secondary btn-sm" style={{ flex: 1, padding: '8px', background: '#F8FAFC', border: '1px solid transparent' }} title={doc.phone || 'No phone'}>
                                    <Phone size={14} color="var(--color-text-secondary)" />
                                </button>
                                <button className="btn btn-secondary btn-sm" style={{ flex: 1, padding: '8px', background: '#F8FAFC', border: '1px solid transparent' }} title={doc.email || 'No email'}>
                                    <Mail size={14} color="var(--color-text-secondary)" />
                                </button>
                                <button className="btn btn-secondary btn-sm" style={{ padding: '8px', background: '#F8FAFC', border: '1px solid transparent' }}>
                                    <MoreVertical size={14} color="var(--color-text-secondary)" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
