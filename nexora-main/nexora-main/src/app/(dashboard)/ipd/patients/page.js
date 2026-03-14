'use client';
import { ArrowLeft, UserPlus, FileText, Activity, Clock, HeartPulse, Search, Filter, MoreVertical, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ActiveInpatientsPage() {
    const [ipdPatients, setIpdPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchIpd = async () => {
            try {
                const res = await fetch('/api/ipd');
                if (res.ok) {
                    const data = await res.json();
                    setIpdPatients(data.ipdPatients || []);
                }
            } catch (err) {
                console.error("Failed to load IPD patients:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchIpd();
    }, []);

    const filteredPatients = ipdPatients.filter(pt =>
        (pt.patientName && pt.patientName.toLowerCase().includes(search.toLowerCase())) ||
        (pt.apptCode && pt.apptCode.toLowerCase().includes(search.toLowerCase())) ||
        (pt.ward && pt.ward.toLowerCase().includes(search.toLowerCase()))
    );

    const getAge = (dob) => {
        if (!dob) return '?';
        const diff = Date.now() - new Date(dob).getTime();
        const age = new Date(diff).getUTCFullYear() - 1970;
        return age > 0 ? age : '?';
    };

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/ipd" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Admitted Patients Census</h1>
                        <p className="page-header__subtitle">Monitor active inpatients, clinical status flags, and attending doctors.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        <Filter size={14} /> View Ward
                    </button>
                    <Link href="/ipd/admit" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <UserPlus size={15} strokeWidth={1.5} />
                        New Admission
                    </Link>
                </div>
            </div>

            {/* Quick KPI Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '10px', borderRadius: '10px' }}>
                            <HeartPulse size={20} />
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Total Admitted Census</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{ipdPatients.length}</h4>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Patients</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', padding: '10px', borderRadius: '10px' }}>
                            <Clock size={20} />
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Awaiting Discharge</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#F59E0B', margin: 0 }}>{ipdPatients.filter(p => p.status === 'Discharge Ready').length}</h4>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Pending Bills</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '10px', borderRadius: '10px' }}>
                            <ShieldAlert size={20} />
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0', fontWeight: 500 }}>Critical Care</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: 700, color: '#EF4444', margin: 0 }}>{ipdPatients.filter(p => p.status === 'Critical').length}</h4>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Patients in ICU</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
                            <input
                                type="text"
                                placeholder="Search by Patient Name, IPD No, or Ward..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }}
                            />
                        </div>
                    </div>
                </div>

                <div className="data-table-wrapper" style={{ borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border-light)' }}>
                            <tr>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>IPD No. & Patient</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Location (Ward/Bed)</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Attending Physician</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Admission Time</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>Acuity Status</th>
                                <th style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>Controls</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
                                        Loading admitted patients...
                                    </td>
                                </tr>
                            ) : filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
                                        No admitted patients found.
                                    </td>
                                </tr>
                            ) : (
                                filteredPatients.map((row, i) => (
                                    <tr key={row.id || i} style={{ borderBottom: '1px solid var(--color-border-light)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '14px' }}>
                                                    {row.patientName}
                                                    <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, fontSize: '12px' }}>
                                                        ({row.patient ? `${getAge(row.patient.dob)}, ${row.patient.gender?.charAt(0) || 'U'}` : 'Guest'})
                                                    </span>
                                                </span>
                                                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{row.apptCode}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6' }}></div>
                                                <span style={{ color: 'var(--color-text-primary)' }}>{row.ward} {row.bed ? `- ${row.bed}` : ''}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', color: 'var(--color-text-secondary)' }}>
                                            {row.doctorName}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ color: 'var(--color-text-primary)', fontSize: '13px' }}>{row.date} {row.time ? ` ${row.time}` : ''}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span className={`badge ${row.status === 'Admitted' ? 'badge-blue' : row.status === 'Discharge Ready' ? 'badge-green' : row.status === 'Critical' ? 'badge-yellow' : 'badge-navy'}`} style={{ padding: '4px 10px', fontSize: '12px' }} title="Acuity status">
                                                {row.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <button className="btn btn-secondary btn-sm" style={{ padding: '8px' }}>
                                                <MoreVertical size={14} color="var(--color-text-secondary)" />
                                            </button>
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
