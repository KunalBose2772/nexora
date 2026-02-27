'use client';
import { BedDouble, Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function IPDPage() {
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
                        <input type="text" placeholder="Search IPD No, Name or Ward..." style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1px solid var(--color-border-light)', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                    </div>
                    <button className="btn btn-secondary btn-sm" style={{ background: '#FFFFFF' }}>
                        <Filter size={14} /> Wards View
                    </button>
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
                            {[
                                { id: 'IPD-2391', patient: 'Kamlesh Rai', ward: 'General Ward - Bed 14', doctor: 'Dr. Raj Malhotra', date: 'Oct 23, 2023', status: 'Admitted', badge: 'badge-info' },
                                { id: 'IPD-2392', patient: 'Suresh Menon', ward: 'ICU - Bed 03', doctor: 'Dr. Priya Sharma', date: 'Oct 24, 2023', status: 'Critical', badge: 'badge-error' },
                                { id: 'IPD-2388', patient: 'Rohit Bansal', ward: 'Private - Room 201', doctor: 'Dr. Arjun Nair', date: 'Oct 20, 2023', status: 'Discharge Ready', badge: 'badge-warning' },
                            ].map(pt => (
                                <tr key={pt.id}>
                                    <td style={{ color: 'var(--color-navy)', fontWeight: 500, fontFamily: 'monospace' }}>{pt.id}</td>
                                    <td style={{ fontWeight: 500 }}>{pt.patient}</td>
                                    <td style={{ color: 'var(--color-text-secondary)' }}>{pt.ward}</td>
                                    <td style={{ color: 'var(--color-text-secondary)' }}>{pt.doctor}</td>
                                    <td style={{ color: 'var(--color-text-secondary)' }}>{pt.date}</td>
                                    <td><span className={`badge ${pt.badge}`}>{pt.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
