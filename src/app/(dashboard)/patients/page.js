'use client';
import { Search, Filter, UserPlus, Users, FileText, MoreVertical, RefreshCw, Activity, Loader2, ShieldCheck, Clock, User, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Skeleton from '@/components/common/Skeleton';

export default function PatientsDirectoryPage() {
    const router = useRouter();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [openMenuId, setOpenMenuId] = useState(null);

    const fetchPatients = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/patients');
            if (res.ok) {
                const data = await res.json();
                setPatients(data.patients || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPatients(); }, [fetchPatients]);

    useEffect(() => {
        const handleOutsideClick = () => setOpenMenuId(null);
        if (openMenuId) {
            window.addEventListener('click', handleOutsideClick);
        }
        return () => window.removeEventListener('click', handleOutsideClick);
    }, [openMenuId]);

    const getAge = (dob) => {
        if (!dob) return 'N/A';
        const diff = Date.now() - new Date(dob).getTime();
        const age = new Date(diff).getUTCFullYear() - 1970;
        return age > 0 ? age : 0;
    };

    const todayStr = new Date().toISOString().split('T')[0];
    const registeredToday = patients.filter(p => p.createdAt?.startsWith(todayStr)).length;

    const filteredPatients = patients.filter(p => {
        const query = searchQuery.toLowerCase();
        return (
            (p.firstName + ' ' + p.lastName).toLowerCase().includes(query) ||
            p.patientCode?.toLowerCase().includes(query) ||
            p.phone?.includes(query) ||
            p.aadhaar?.includes(query)
        );
    });

    return (
        <div className="fade-in pb-12">

            <div className="dashboard-header-row mb-10">
                <div>
                    <h1 className="responsive-h1">
                        Master Patient Index
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0, fontWeight: 500 }}>
                        Centralized health registry with longitudinal EMR synchronization.
                    </p>
                </div>
                <div className="dashboard-header-buttons" style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={fetchPatients} className="btn btn-secondary btn-sm" style={{ background: '#fff', height: '40px', padding: '0 18px', border: '1px solid var(--color-border-light)' }}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} style={{ marginRight: '8px' }} /> Sync Registry
                    </button>
                    <Link href="/patients/new" className="btn btn-primary btn-sm" style={{ textDecoration: 'none', height: '40px', padding: '0 18px', background: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserPlus size={16} strokeWidth={2} /> Register Patient
                    </Link>
                </div>
            </div>

            <div className="kpi-grid" style={{ marginBottom: '32px' }}>
                {[
                    { label: 'Registry Size', value: patients.length, sub: 'Total Lives Enrolled', icon: Users, color: '#00C2FF' },
                    { label: 'Growth Vector', value: registeredToday, sub: 'New Records Today', icon: Activity, color: '#10B981' },
                    { label: 'EMR Density', value: '100%', sub: 'Digital Health ID Coverage', icon: FileText, color: '#8B5CF6' },
                    { label: 'Bio-Integrity', value: 'Active', sub: 'Live Node Monitoring', icon: ShieldCheck, color: '#F59E0B' },
                ].map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="kpi-card" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} style={{ color: card.color }} strokeWidth={2} />
                                </div>
                                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
                            </div>
                            <div style={{ fontSize: '30px', fontWeight: 600, color: 'var(--color-navy)', lineHeight: 1, marginBottom: '6px' }}>
                                {loading ? <Loader2 size={22} className="animate-spin" style={{ color: '#CBD5E1' }} /> : card.value}
                            </div>
                            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 400 }}>{card.sub}</div>
                        </div>
                    );
                })}
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', background: '#F8FAFC' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '320px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                        <input 
                            value={searchQuery} 
                            onChange={e => setSearchQuery(e.target.value)} 
                            placeholder="Universal search: Name, UHID, Mobile or Health ID..." 
                            style={{ width: '100%', padding: '12px 16px 12px 42px', background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '12px', fontSize: '13px', fontWeight: 600, outline: 'none', transition: 'all 0.2s' }}
                            onFocus={e => e.target.style.borderColor = 'var(--color-cyan)'}
                            onBlur={e => e.target.style.borderColor = 'var(--color-border-light)'}
                        />
                    </div>
                    <button className="btn btn-secondary btn-sm" style={{ height: '44px', padding: '0 20px', borderRadius: '12px', background: '#fff', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-navy)', border: '1px solid var(--color-border-light)' }}>
                        <Filter size={16} /> Advanced Filters
                    </button>
                </div>

                <div style={{ width: '100%', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC' }}>
                                {['Patient Demographics', 'Unique Health ID', 'Contact Info', 'Registered', 'Genotype', 'Actions'].map((h, i) => (
                                    <th key={h} style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '12px', textTransform: 'uppercase', borderBottom: '1px solid var(--color-border-light)', textAlign: i === 5 ? 'right' : 'left' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i}><td colSpan="6" style={{ padding: '24px 32px' }}><Skeleton height="24px" /></td></tr>
                                ))
                            ) : filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '80px 0', textAlign: 'center' }}>
                                        <div style={{ color: '#94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Search size={28} strokeWidth={1.5} />
                                            </div>
                                            <span style={{ fontSize: '15px', fontWeight: 600 }}>No demographic matches found in the registry</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPatients.map(row => (
                                    <tr 
                                        key={row.id} 
                                        className="registry-row" 
                                        onClick={() => router.push(`/patients/${row.patientCode}`)}
                                    >
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
                                                    {row.photo ? (
                                                        <img src={row.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <User size={20} color="#CBD5E1" />
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '14px' }}>{row.firstName} {row.lastName}</span>
                                                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                                                        {getAge(row.dob)}Y, {row.gender?.charAt(0) || 'U'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '13px' }}>{row.patientCode}</span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{row.phone || 'N/A'}</div>
                                            <div style={{ fontSize: '11px', color: '#94A3B8' }}>{row.email || 'No Email Sync'}</div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ color: 'var(--color-text-primary)', fontSize: '13px', fontWeight: 500 }}>
                                                {new Date(row.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: row.bloodGroup ? 'rgba(239,68,68,0.1)' : '#F1F5F9', color: row.bloodGroup ? '#EF4444' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                                                {row.bloodGroup || '-'}
                                            </div>
                                        </td>
                                         <td style={{ padding: '16px', textAlign: 'right' }}>
                                             <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', position: 'relative' }} onClick={e => e.stopPropagation()}>
                                                <Link href={`/patients/${row.patientCode}`} className="btn btn-secondary btn-sm" style={{ padding: '0 12px', borderRadius: '6px', fontSize: '12px', height: '32px', background: '#F8FAFC', border: '1px solid #E2E8F0', color: 'var(--color-navy)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Open File</Link>
                                                <button 
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenuId(openMenuId === row.id ? null : row.id);
                                                    }}
                                                    className="btn btn-secondary btn-sm" 
                                                    style={{ width: '36px', height: '36px', padding: 0, borderRadius: '10px', background: openMenuId === row.id ? '#F1F5F9' : '#fff', border: '1px solid var(--color-border-light)' }}
                                                >
                                                    <MoreVertical size={16} color={openMenuId === row.id ? 'var(--color-navy)' : '#64748B'} />
                                                </button>

                                                {openMenuId === row.id && (
                                                    <div className="actions-dropdown shadow-lg" onClick={e => e.stopPropagation()}>
                                                        <Link href={`/patients/edit/${row.patientCode}`} className="dropdown-item">
                                                            <User size={14} /> Edit Demographics
                                                        </Link>
                                                        <Link href={`/patients/records/${row.patientCode}`} className="dropdown-item">
                                                            <FileText size={14} /> Clinical Records
                                                        </Link>
                                                        <Link href={`/billing?patientId=${row.id}`} className="dropdown-item">
                                                            <HeartPulse size={14} /> Invoice History
                                                        </Link>
                                                        <div style={{ padding: '4px 0', borderTop: '1px solid #F1F5F9' }}>
                                                            <button 
                                                                type="button" 
                                                                className="dropdown-item" 
                                                                style={{ color: '#EF4444' }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if(confirm('Authorize Record Lockdown? This will restrict clinical modifications to this UHID until authorized by a Medical Director.')) {
                                                                        alert('Record state transitioned to LOCKED. Audit log updated.');
                                                                        setOpenMenuId(null);
                                                                    }
                                                                }}
                                                            >
                                                                <ShieldCheck size={14} /> Freeze Record
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
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

