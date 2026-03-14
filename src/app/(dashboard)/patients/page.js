'use client';
import { Search, Filter, MonitorPlay, UserPlus, Users, UserCheck, FileText, PieChart, MoreVertical, ExternalLink, RefreshCw, LayoutDashboard, Database, Siren, Ghost, Monitor, Activity, X, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Skeleton from '@/components/common/Skeleton';

export default function PatientsDirectoryPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPatients = async () => {
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
  };

  useEffect(() => { fetchPatients(); }, []);

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
      p.phone?.includes(query)
    );
  });

  return (
    <div className="fade-in pb-12">
      <style jsx>{`
                .kpi-card {
                    background: #fff;
                    border: 1px solid var(--color-border-light);
                    border-radius: 16px;
                    padding: 24px;
                    transition: all 0.2s ease;
                }
                .patient-row {
                    transition: all 0.2s;
                    cursor: pointer;
                }
                .patient-row:hover {
                    background: #F8FAFC;
                }
                .blood-tag {
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    font-weight: 901;
                }
            `}</style>

      <div className="dashboard-header-row mb-8">
        <div>
          <h1 className="responsive-h1">
            Master Patient Index
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>Centralized health registry and longitudinal EMR synchronization.</p>
        </div>
        <div className="dashboard-header-buttons">
          <button onClick={fetchPatients} className="btn btn-secondary btn-sm" style={{ background: '#fff' }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync Registry
          </button>
          <Link href="/patients/new" className="btn btn-primary btn-sm flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <UserPlus size={15} strokeWidth={1.5} /> Register Patient
          </Link>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: '28px' }}>
        {[
          { label: 'Registry Size', value: patients.length, sub: 'Total Lives', icon: Users, color: '#0EA5E9' },
          { label: 'Growth Flux', value: registeredToday, sub: 'New Today', icon: Activity, color: '#10B981' },
          { label: 'EMR Coverage', value: '100%', sub: 'Digital Identity', icon: FileText, color: '#8B5CF6' },
          { label: 'Bio-Integrity', value: 'Active', sub: 'System Ready', icon: ShieldCheck, color: '#F59E0B' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="kpi-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} style={{ color: card.color }} strokeWidth={1.5} />
                </div>
                <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>{card.label}</span>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1, marginBottom: '6px' }}>
                {loading ? <Loader2 size={22} className="animate-spin text-muted" /> : card.value}
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>{card.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by UHID, Name, Mobile Number or Aadhaar..." className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:border-cyan-500 outline-none transition-all shadow-sm" />
          </div>
          <button className="btn btn-secondary btn-sm h-11 px-5 border-slate-200 bg-white">
            <Filter size={16} /> Filters
          </button>
        </div>
        <div className="data-table-wrapper border-none">
          <table className="data-table">
            <thead>
              <tr>
                <th>Identifier</th>
                <th>Demographics</th>
                <th>Communications</th>
                <th>Genotype</th>
                <th>Enrollment</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? [1, 2, 3, 4, 5].map(i => <tr key={i}><td colSpan="6"><Skeleton height="20px" /></td></tr>) : filteredPatients.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest">No matching records</td></tr>
              ) : (
                filteredPatients.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-all cursor-pointer" onClick={() => router.push(`/patients/${row.patientCode}`)}>
                    <td><div className="text-[13px] font-black text-navy-900 font-mono tracking-tighter">{row.patientCode}</div></td>
                    <td>
                      <div className="text-[14px] font-black text-navy-900">{row.firstName} {row.lastName}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">{getAge(row.dob)} Y, {row.gender}</div>
                    </td>
                    <td>
                      <div className="text-[12px] font-bold text-slate-600">{row.phone || 'NO VOX'}</div>
                      <div className="text-[10px] font-bold text-slate-400 mt-0.5">{row.email || 'NO SMTP'}</div>
                    </td>
                    <td>
                      <div className={`blood-tag ${row.bloodGroup ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
                        {row.bloodGroup || '??'}
                      </div>
                    </td>
                    <td><div className="text-[12px] font-bold text-navy-900">{new Date(row.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div></td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="flex gap-2 justify-end" onClick={e => e.stopPropagation()}>
                        <Link href={`/patients/${row.patientCode}`} className="h-9 px-4 rounded-lg bg-navy-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center" style={{ textDecoration: 'none' }}>EMR Profile</Link>
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 text-slate-300 hover:text-navy-900 transition-all"><MoreVertical size={16} /></button>
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
