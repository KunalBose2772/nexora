'use client';
import { Search, Filter, Plus, FileText, MonitorPlay, Calendar as CalIcon, Users, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function PatientsDirectoryPage() {
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
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Patient Basic Demographics</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Unique Health ID (UHID)</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Contact Info</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Last Visited</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Blood Grp</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: 'Aarav Sharma', age: '34, M', uid: 'UHID-10029', phone: '+91 98765 09876', visited: '12 Oct, 2023', bg: 'O+' },
                                { name: 'Priya Patel', age: '28, F', uid: 'UHID-10034', phone: '+91 87654 12345', visited: '24 Oct, 2023', bg: 'A+' },
                                { name: 'Rahul Desai', age: '45, M', uid: 'UHID-09941', phone: '+91 76543 98765', visited: '18 Sep, 2023', bg: 'B+' },
                                { name: 'Megha Singh', age: '52, F', uid: 'UHID-10099', phone: '+91 65432 34567', visited: '10 Nov, 2023', bg: 'AB-' },
                                { name: 'Vikram Mehta', age: '60, M', uid: 'UHID-08832', phone: '+91 54321 09812', visited: '05 Nov, 2023', bg: 'O-' }
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '14px' }}>{row.name}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{row.age}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ fontFamily: 'monospace', fontWeight: 500, color: 'var(--color-text-primary)' }}>{row.uid}</span>
                                    </td>
                                    <td style={{ padding: '16px', color: 'var(--color-text-secondary)' }}>
                                        {row.phone}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ color: 'var(--color-text-primary)', fontSize: '13px' }}>{row.visited}</span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                                            {row.bg}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', fontSize: '12px', background: '#F8FAFC' }}>
                                            Open File
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
