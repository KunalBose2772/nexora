'use client';
import { Search, Filter, MonitorPlay, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PatientsDirectoryPage() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await fetch('/api/patients');
                if (res.ok) {
                    const data = await res.json();
                    setPatients(data.patients || []);
                }
            } catch (err) {
                console.error("Failed to load patients:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const getAge = (dob) => {
        if (!dob) return 'N/A';
        const diff = Date.now() - new Date(dob).getTime();
        const age = new Date(diff).getUTCFullYear() - 1970;
        return age > 0 ? age : 0;
    };

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Patient EMR Hub</h1>
                    <p className="page-header__subtitle">
                        Central directory of registered patient records, demographics, and medical histories.
                    </p>
                </div>
                <div className="dashboard-header-buttons">
                    <Link href="/patients/records" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none', background: '#fff' }}>
                        <MonitorPlay size={14} /> Upload Records
                    </Link>
                    <Link href="/patients/new" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <UserPlus size={15} strokeWidth={1.5} />
                        Register Patient
                    </Link>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                            <input type="text" placeholder="Search master patient index by UHID, Mobile, Aadhaar, or Name..." style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                        </div>
                        <button className="btn btn-secondary" style={{ background: '#fff' }}>
                            <Filter size={16} /> Advanced Filters
                        </button>
                    </div>
                </div>

                <div className="data-table-wrapper" style={{ borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
                            <tr>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Patient Demographics</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Unique Health ID</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Contact Info</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Registered</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Blood Grp</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        Loading patient records...
                                    </td>
                                </tr>
                            ) : patients.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        No registered patients found.
                                    </td>
                                </tr>
                            ) : (
                                patients.map((row) => (
                                    <tr key={row.id} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '14px' }}>{row.firstName} {row.lastName}</span>
                                                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                                                    {getAge(row.dob)}, {row.gender ? row.gender.charAt(0) : 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ fontFamily: 'monospace', fontWeight: 500, color: 'var(--color-text-primary)' }}>{row.patientCode}</span>
                                        </td>
                                        <td style={{ padding: '16px', color: 'var(--color-text-secondary)' }}>
                                            {row.phone || 'N/A'}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ color: 'var(--color-text-primary)', fontSize: '13px' }}>
                                                {new Date(row.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: row.bloodGroup ? 'rgba(239,68,68,0.1)' : '#F1F5F9', color: row.bloodGroup ? '#EF4444' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                                                {row.bloodGroup || '-'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <Link href={`/patients/${row.patientCode}`}>
                                                <button className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', fontSize: '12px', background: '#F8FAFC' }}>
                                                    Open File
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
