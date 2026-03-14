'use client';
import { BedDouble, Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function IPDPage() {
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

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Admitted': return 'badge-info';
            case 'Critical': return 'badge-error';
            case 'Discharge Ready': return 'badge-warning';
            default: return 'badge-navy';
        }
    };

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Inpatient Department (IPD)</h1>
                    <p className="page-header__subtitle">
                        Manage inpatient admissions, wards, and bed allocations.
                    </p>
                </div>
                <div className="dashboard-header-buttons">
                    <Link href="/ipd/admit" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <Plus size={15} strokeWidth={1.5} aria-hidden="true" />
                        Admit Patient
                    </Link>
                </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} />
                        <input
                            type="text"
                            placeholder="Search IPD No, Name or Ward..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1px solid var(--color-border-light)', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                        />
                    </div>
                    <Link href="/ipd/wards" className="btn btn-secondary btn-sm" style={{ background: '#FFFFFF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Filter size={14} /> Wards View
                    </Link>
                </div>

                <div className="data-table-wrapper" style={{ borderRadius: '8px' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>IPD No.</th>
                                <th>Patient Name</th>
                                <th>Ward/Room</th>
                                <th>Admitting Doctor</th>
                                <th>Admission Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)' }}>
                                        Loading admissions...
                                    </td>
                                </tr>
                            ) : filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)' }}>
                                        No active IPD patients found.
                                    </td>
                                </tr>
                            ) : (
                                filteredPatients.map(pt => (
                                    <tr key={pt.id}>
                                        <td style={{ color: 'var(--color-navy)', fontWeight: 500, fontFamily: 'monospace' }}>{pt.apptCode}</td>
                                        <td style={{ fontWeight: 500 }}>{pt.patientName}</td>
                                        <td style={{ color: 'var(--color-text-secondary)' }}>{pt.ward} {pt.bed ? `- ${pt.bed}` : ''}</td>
                                        <td style={{ color: 'var(--color-text-secondary)' }}>{pt.doctorName}</td>
                                        <td style={{ color: 'var(--color-text-secondary)' }}>{pt.date} {pt.time ? ` ${pt.time}` : ''}</td>
                                        <td><span className={`badge ${getStatusBadge(pt.status)}`}>{pt.status}</span></td>
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
