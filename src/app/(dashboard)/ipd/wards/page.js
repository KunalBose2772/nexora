'use client';
import { ArrowLeft, BedDouble, Search, Filter, Plus, UserPlus, Clock, Activity } from 'lucide-react';
import Link from 'next/link';

export default function BedOccupancyPage() {
    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/ipd" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title" style={{ marginBottom: '4px' }}>IPD Wards & Bed Occupancy</h1>
                        <p className="page-header__subtitle">Visual map of real-time inpatient bed availability across all hospital wings.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
                        <Filter size={14} /> Filter by Wing
                    </button>
                    <Link href="/ipd/admit" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <Plus size={15} strokeWidth={1.5} />
                        New Admission
                    </Link>
                </div>
            </div>

            {/* Ward Summary Pills */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                {[
                    { label: 'All Wards', occupied: 45, total: 120, active: true },
                    { label: 'General Male (Floor 1)', occupied: 15, total: 30, active: false },
                    { label: 'General Female (Floor 1)', occupied: 12, total: 30, active: false },
                    { label: 'Private Suites (Floor 3)', occupied: 8, total: 20, active: false },
                    { label: 'ICU / Critical Care', occupied: 10, total: 10, active: false },
                ].map((pill, i) => (
                    <button key={i} style={{
                        whiteSpace: 'nowrap', padding: '12px 20px', borderRadius: '12px', border: pill.active ? '1px solid var(--color-cyan)' : '1px solid var(--color-border-light)',
                        background: pill.active ? 'rgba(0,194,255,0.05)' : '#fff', color: pill.active ? 'var(--color-navy)' : 'var(--color-text-secondary)',
                        fontWeight: pill.active ? 600 : 500, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start'
                    }}>
                        <span style={{ fontSize: '14px' }}>{pill.label}</span>
                        <span style={{ fontSize: '12px', color: pill.active ? 'var(--color-cyan)' : '#94A3B8' }}>{pill.occupied} / {pill.total} Beds Occupied</span>
                    </button>
                ))}
            </div>

            <div className="card" style={{ padding: '24px', background: '#F8FAFC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-navy)', margin: 0 }}>General Male Ward - Floor 1</h3>

                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', fontWeight: 500 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#10B981' }}></div> Vacant</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#EF4444' }}></div> Occupied</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#F59E0B' }}></div> Maintenance / Cleaning</span>
                    </div>
                </div>

                {/* Bed Grid Visualizer */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                    {[
                        { id: '101-A', status: 'occupied', patient: 'Ramesh Kumar', admitDate: 'Oct 20', dr: 'Dr. Sharma' },
                        { id: '101-B', status: 'occupied', patient: 'Suresh Das', admitDate: 'Oct 22', dr: 'Dr. Patel' },
                        { id: '102-A', status: 'vacant' },
                        { id: '102-B', status: 'cleaning' },
                        { id: '103-W', status: 'vacant' },
                        { id: '104-A', status: 'occupied', patient: 'Vikram Singh', admitDate: 'Oct 24', dr: 'Dr. Singh' },
                        { id: '104-B', status: 'vacant' },
                        { id: '105-X', status: 'occupied', patient: 'Amit Shah', admitDate: 'Oct 25', dr: 'Dr. Sharma' },
                    ].map((bed, i) => (
                        <div key={i} style={{
                            background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid',
                            borderColor: bed.status === 'occupied' ? '#FECACA' : bed.status === 'vacant' ? '#A7F3D0' : '#FDE68A',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s'
                        }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>

                            {/* Top Color Banner */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: bed.status === 'occupied' ? '#EF4444' : bed.status === 'vacant' ? '#10B981' : '#F59E0B' }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', marginTop: '4px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <BedDouble size={16} color={bed.status === 'occupied' ? '#EF4444' : bed.status === 'vacant' ? '#10B981' : '#F59E0B'} />
                                    <span style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-navy)' }}>{bed.id}</span>
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: bed.status === 'occupied' ? '#EF4444' : bed.status === 'vacant' ? '#10B981' : '#F59E0B' }}>{bed.status}</span>
                            </div>

                            {bed.status === 'occupied' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>{bed.patient}</div>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                                        <Activity size={12} /> {bed.dr}
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                                        <Clock size={12} /> {bed.admitDate}
                                    </div>
                                </div>
                            ) : bed.status === 'vacant' ? (
                                <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <button className="btn btn-secondary btn-sm" style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}>
                                        Admit Here
                                    </button>
                                </div>
                            ) : (
                                <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#B45309', textAlign: 'center' }}>
                                    Undergoing housekeeping protocols...
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
