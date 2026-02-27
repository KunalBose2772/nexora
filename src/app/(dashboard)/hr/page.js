'use client';
import { Users, Filter, Plus, Search, MoreHorizontal, UserCog, Mail, Phone, CalendarDays } from 'lucide-react';
import Link from 'next/link';

export default function HRStaffPage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Human Resources & Staff</h1>
                    <p className="page-header__subtitle">
                        Manage employee records, roles, leaves, and payroll administration.
                    </p>
                </div>
                <div className="dashboard-header-buttons">
                    <Link href="/hr/doctors" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none', background: '#fff' }}>
                        <UserCog size={15} />
                        Doctors Directory
                    </Link>
                    <Link href="/hr/new" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <Plus size={15} strokeWidth={1.5} />
                        Onboard New Staff
                    </Link>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                            <input type="text" placeholder="Search employee directory by name, ID, or department..." style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                        </div>
                        <button className="btn btn-secondary" style={{ background: '#fff' }}>
                            <Filter size={16} /> Filter Roles
                        </button>
                    </div>
                </div>

                <div className="data-table-wrapper" style={{ borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
                            <tr>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Employee Basic Info</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Role & Department</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Contact Details</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Status & Join Date</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { emp: 'EMP-1100', name: 'Neeraj Kumar', role: 'Head Nurse', dept: 'ICU', phone: '+91 8888 7777', email: 'neeraj.k@nexora.com', joined: 'Jan 2021', stat: 'Active' },
                                { emp: 'EMP-1101', name: 'Smita Sharma', role: 'Pharmacist', dept: 'Pharmacy', phone: '+91 8888 6666', email: 'smita.s@nexora.com', joined: 'Mar 2021', stat: 'Active' },
                                { emp: 'EMP-1102', name: 'Ravi Teja', role: 'Accountant', dept: 'Billing', phone: '+91 8888 5555', email: 'ravi.t@nexora.com', joined: 'Jun 2022', stat: 'On Leave' },
                                { emp: 'EMP-1103', name: 'Sonia Das', role: 'Lab Technician', dept: 'Pathology', phone: '+91 8888 4444', email: 'sonia.d@nexora.com', joined: 'Feb 2023', stat: 'Active' },
                                { emp: 'EMP-1104', name: 'Vikas Jain', role: 'Receptionist', dept: 'Front Desk', phone: '+91 8888 3333', email: 'vikas.j@nexora.com', joined: 'Sep 2023', stat: 'Active' }
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '14px' }}>
                                                {row.name.split(' ')[0][0]}{row.name.split(' ')[1][0]}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '14px' }}>{row.name}</span>
                                                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{row.emp}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ color: 'var(--color-text-primary)' }}>{row.role}</span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{row.dept}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', color: 'var(--color-text-secondary)', fontSize: '13px' }}><Phone size={12} /> {row.phone}</div>
                                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', color: 'var(--color-text-secondary)', fontSize: '13px' }}><Mail size={12} /> {row.email}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                                            <span className={`badge ${row.stat === 'Active' ? 'badge-green' : 'badge-yellow'}`} style={{ padding: '4px 10px', fontSize: '12px' }}>
                                                {row.stat}
                                            </span>
                                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', color: 'var(--color-text-muted)', fontSize: '12px' }}><CalendarDays size={12} /> {row.joined}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button className="btn btn-secondary btn-sm" style={{ padding: '8px' }}>
                                            <MoreHorizontal size={14} color="var(--color-text-secondary)" />
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
