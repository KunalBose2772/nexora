'use client';
import { ArrowLeft, BedDouble, Search, Filter, Plus, UserPlus, Clock, Activity } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BedOccupancyPage() {
    const router = useRouter();
    const [ipdPatients, setIpdPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeWard, setActiveWard] = useState('');
    const [dbWards, setDbWards] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch IPD Patients
                const ptRes = await fetch('/api/ipd');
                if (ptRes.ok) {
                    const data = await ptRes.json();
                    const activePatients = (data.ipdPatients || []).filter(p => p.status !== 'Completed' && p.status !== 'Cancelled');
                    setIpdPatients(activePatients);
                }

                // Fetch Wards and Beds
                const wardRes = await fetch('/api/facility/wards');
                if (wardRes.ok) {
                    const data = await wardRes.json();
                    setDbWards(data.wards || []);
                    if (data.wards && data.wards.length > 0) {
                        setActiveWard(data.wards[0].name);
                    } else {
                        setActiveWard('');
                    }
                }
            } catch (err) {
                console.error("Failed to load facility data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Configuration for wards and their beds (Dynamic from DB)
    const wardConfigs = {};
    dbWards.forEach(w => {
        // Build the structure to match existing format: { id: 'BedNumber', status: dbStatus }
        wardConfigs[w.name] = (w.beds || []).map(b => ({
            id: b.bedNumber,
            status: b.status.toLowerCase() // expects vacant, occupied, cleaning
        }));
    });

    // Filter patients by active ward
    const currentWardPatients = ipdPatients.filter(p => p.ward === activeWard && p.bed);

    // Get current bed configuration, default to empty array if 'All Wards' or missing
    const bedConfig = wardConfigs[activeWard] || [];

    // Map admitted patients to beds in the current ward
    const beds = bedConfig.map(bed => {
        const patientInBed = currentWardPatients.find(p => p.bed === `Bed ${bed.id}` || p.bed === bed.id);
        if (patientInBed) {
            return {
                id: bed.id,
                status: 'occupied',
                patient: patientInBed.patientName,
                dr: patientInBed.doctorName,
                admitDate: patientInBed.date
            };
        }
        return bed;
    });

    let totalBedsAcrossWards = 0;
    dbWards.forEach(w => totalBedsAcrossWards += (w.beds?.length || 0));

    const wardStats = [
        { label: 'All Wards', id: 'All', occupied: ipdPatients.length, total: totalBedsAcrossWards },
        ...dbWards.map(w => ({
            label: w.name,
            id: w.name,
            occupied: ipdPatients.filter(p => p.ward === w.name).length,
            total: (w.beds || []).length
        }))
    ];


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

                    <Link href="/ipd/admit" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                        <Plus size={15} strokeWidth={1.5} />
                        New Admission
                    </Link>
                </div>
            </div>

            {/* Ward Summary Pills */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                {wardStats.map((pill, i) => (
                    <button key={i} onClick={() => pill.id !== 'All' && setActiveWard(pill.id)} style={{
                        whiteSpace: 'nowrap', padding: '12px 20px', borderRadius: '12px', border: activeWard === pill.id ? '1px solid var(--color-cyan)' : '1px solid var(--color-border-light)',
                        background: activeWard === pill.id ? 'rgba(0,194,255,0.05)' : '#fff', color: activeWard === pill.id ? 'var(--color-navy)' : 'var(--color-text-secondary)',
                        fontWeight: activeWard === pill.id ? 600 : 500, cursor: pill.id === 'All' ? 'default' : 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start'
                    }}>
                        <span style={{ fontSize: '14px' }}>{pill.label}</span>
                        <span style={{ fontSize: '12px', color: activeWard === pill.id ? 'var(--color-cyan)' : '#94A3B8' }}>{pill.occupied} / {pill.total} Beds Occupied</span>
                    </button>
                ))}
            </div>

            <div className="card" style={{ padding: '24px', background: '#F8FAFC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-navy)', margin: 0 }}>{wardStats.find(w => w.id === activeWard)?.label || activeWard}</h3>

                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', fontWeight: 500 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#10B981' }}></div> Vacant</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#EF4444' }}></div> Occupied</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#F59E0B' }}></div> Maintenance / Cleaning</span>
                    </div>
                </div>

                {/* Bed Grid Visualizer */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)' }}>Loading bed map...</div>
                ) : beds.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)', background: '#fff', borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
                        Select a specific ward to view the bed map.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                        {beds.map((bed, i) => (
                            <div key={i} onClick={() => { if (bed.status === 'vacant') router.push(`/ipd/admit?ward=${encodeURIComponent(activeWard)}&bed=Bed ${bed.id}`) }} style={{
                                background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid',
                                borderColor: bed.status === 'occupied' ? '#FECACA' : bed.status === 'vacant' ? '#A7F3D0' : '#FDE68A',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden', cursor: bed.status === 'vacant' ? 'pointer' : 'default', transition: 'all 0.2s'
                            }} onMouseOver={(e) => { if (bed.status === 'vacant') { e.currentTarget.style.transform = 'translateY(-2px)' } }} onMouseOut={(e) => { if (bed.status === 'vacant') { e.currentTarget.style.transform = 'none' } }}>

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
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bed.patient}</div>
                                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            <Activity size={12} style={{ flexShrink: 0 }} /> {bed.dr}
                                        </div>
                                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                                            <Clock size={12} style={{ flexShrink: 0 }} /> {new Date(bed.admitDate).toLocaleDateString()}
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
                )}
            </div>
        </div>
    );
}
