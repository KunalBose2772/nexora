'use client';

import { 
    Droplet, 
    Thermometer, 
    AlertTriangle, 
    Plus, 
    Search, 
    RefreshCw,
    History,
    FileText,
    ArrowUpRight,
    CheckCircle2,
    Loader2,
    Clock,
    Zap,
    MoveRight,
    Calendar,
    Activity,
    UserPlus,
    Users,
    Heart,
    ShieldCheck,
    Truck,
    Printer,
    ArrowLeft
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Skeleton from '@/components/common/Skeleton';
import Link from 'next/link';

export default function BloodBankDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [donors, setDonors] = useState([]);
    const [donations, setDonations] = useState([]);
    const [issuances, setIssuances] = useState([]);
    
    // Modals
    const [showDonorModal, setShowDonorModal] = useState(false);
    const [showDonationModal, setShowDonationModal] = useState(false);
    const [showIssuanceModal, setShowIssuanceModal] = useState(false);
    const [certificateData, setCertificateData] = useState(null);

    const [saving, setSaving] = useState(false);

    // Forms
    const [donorForm, setDonorForm] = useState({
        firstName: '', lastName: '', gender: 'Male', bloodGroup: 'O+', phone: '', email: '', address: ''
    });

    const [donationForm, setDonationForm] = useState({
        donorId: '',
        bloodGroup: 'O+',
        unitsCollected: 1,
        hivStatus: 'Non-Reactive',
        hbvStatus: 'Non-Reactive',
        hcvStatus: 'Non-Reactive',
        syphilisStatus: 'Non-Reactive',
        malariaStatus: 'Non-Reactive',
        haemoglobin: 14.5,
        weight: 70,
        bp: '120/80',
        fitForDonation: true,
        remarks: ''
    });

    const [issuanceForm, setIssuanceForm] = useState({
        type: 'Internal',
        destination: '',
        issuedBy: 'Admin',
        receivedBy: '',
        units: 1,
        bloodGroup: 'O+',
        component: 'Whole Blood',
        requestId: '',
        crossMatchNotes: 'Cross-match compatible'
    });

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const loadDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const [stockRes, reqRes, donorRes, donationRes, issueRes] = await Promise.all([
                fetch('/api/blood-bank/inventory'),
                fetch('/api/blood-bank/requests'),
                fetch('/api/blood-bank/donors'),
                fetch('/api/blood-bank/donations'),
                fetch('/api/blood-bank/issuances')
            ]);
            
            if (stockRes.ok && reqRes.ok && donorRes.ok && donationRes.ok && issueRes.ok) {
                const stock = await stockRes.json();
                const requests = await reqRes.json();
                const donorsData = await donorRes.json();
                const donationsData = await donationRes.json();
                const issuesData = await issueRes.json();

                setDonors(donorsData.donors || []);
                setDonations(donationsData.donations || []);
                setIssuances(issuesData.issuances || []);

                // Inventory aggregation logic
                const groups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
                const aggregated = groups.map(g => {
                    const units = (stock.stock || [])
                        .filter(s => s.bloodGroup === g)
                        .reduce((sum, s) => sum + s.units, 0);
                    return {
                        type: g,
                        units: units,
                        status: units > 15 ? 'Optimal' : units > 8 ? 'Low' : 'Critical'
                    };
                });

                setData({
                    inventory: aggregated,
                    pendingRequests: (requests.requests || []).filter(r => r.status === 'Pending').slice(0, 10),
                    metrics: {
                        todayIssued: (issuesData.issuances || []).filter(i => new Date(i.issuedAt).toDateString() === new Date().toDateString()).length,
                        todayDonations: (donationsData.donations || []).filter(d => new Date(d.createdAt).toDateString() === new Date().toDateString()).length,
                        expiringSoon: (stock.stock || []).filter(s => {
                            const diff = new Date(s.expiryDate) - new Date();
                            return diff > 0 && diff < (7 * 24 * 60 * 60 * 1000);
                        }).length,
                        totalInventory: (stock.stock || []).reduce((sum, s) => sum + s.units, 0)
                    }
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadDashboardData(); }, [loadDashboardData]);

    const handleSaveDonor = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/blood-bank/donors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(donorForm)
            });
            if (res.ok) {
                setShowDonorModal(false);
                loadDashboardData();
                setDonorForm({ firstName: '', lastName: '', gender: 'Male', bloodGroup: 'O+', phone: '', email: '', address: '' });
            }
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    const handleSaveDonation = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/blood-bank/donations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(donationForm)
            });
            if (res.ok) {
                const result = await res.json();
                setShowDonationModal(false);
                setCertificateData(result.donation); // Auto-open certificate
                loadDashboardData();
            }
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    const handleSaveIssuance = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/blood-bank/issuances', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(issuanceForm)
            });
            if (res.ok) {
                setShowIssuanceModal(false);
                loadDashboardData();
            }
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    const KPI_CARDS = [
        { id: 'inventory', label: 'Global Stock', value: data?.metrics.totalInventory || 0, sub: 'All components available', icon: Droplet, color: '#EF4444' },
        { id: 'issued', label: 'Units Issued', value: data?.metrics.todayIssued || 0, sub: 'Dispensed today', icon: MoveRight, color: '#3B82F6' },
        { id: 'expiring', label: 'Critical Alert', value: data?.metrics.expiringSoon || 0, sub: 'Expiring within 7 days', icon: AlertTriangle, color: '#F59E0B' },
        { id: 'ready', label: 'Fresh Collections', value: data?.metrics.todayDonations || 0, sub: 'Donors registered today', icon: Heart, color: '#10B981' },
    ];

    const TABS = [
        { id: 'overview', label: 'Command Center', icon: Activity },
        { id: 'donors', label: 'Donor Registry', icon: Users },
        { id: 'issuances', label: 'Issuance & Logs', icon: Truck },
    ];

    return (
        <div className="fade-in">
            <style>{`
                .tab-btn { 
                    padding: 16px 28px; 
                    font-size: 13px; 
                    font-weight: 600; 
                    color: #94A3B8; 
                    border: none; 
                    background: none; 
                    cursor: pointer; 
                    border-bottom: 3px solid transparent; 
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); 
                    display: flex; 
                    align-items: center; 
                    gap: 10px; 
                    text-transform: uppercase; 
                    letter-spacing: 0.05em; 
                }
                .tab-btn.active { color: #00A3FF; border-bottom-color: #00A3FF; }
                .tab-btn:hover:not(.active) { color: #64748B; background: #F8FAFC; }
                
                .kpi-card { 
                    background: #fff; 
                    border: 1px solid rgba(0,0,0,0.04); 
                    border-radius: 24px; 
                    padding: 28px; 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.03); 
                    transition: transform 0.2s;
                }
                .kpi-card:hover { transform: translateY(-4px); }

                .inventory-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
                .blood-box { 
                    background: #fff; 
                    border: 1px solid #F1F5F9; 
                    border-radius: 20px; 
                    padding: 24px; 
                    text-align: center; 
                    transition: all 0.3s ease; 
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                }
                .blood-box:hover { 
                    border-color: #EF444440; 
                    transform: translateY(-5px); 
                    box-shadow: 0 20px 40px rgba(239, 68, 68, 0.08); 
                }

                .modal-overlay-executive {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                    animation: fadeIn 0.2s ease-out;
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

                .modal-card-executive {
                    background: #fff;
                    border-radius: 12px;
                    width: 100%;
                    max-height: 95vh;
                    overflow: hidden;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    display: flex;
                    flex-direction: column;
                }

                .modal-header-executive {
                    padding: 16px 24px;
                    border-bottom: 1px solid #E2E8F0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #F8FAFC;
                }

                .modal-title-executive {
                    font-size: 15px; 
                    font-weight: 600; 
                    color: #0F172A;
                    margin: 0;
                }

                .modal-close-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    border: 1px solid #E2E8F0;
                    background: #fff;
                    color: #94A3B8;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .modal-close-btn:hover {
                    background: #F1F5F9;
                    color: #0F172A;
                }

                .form-group-compact { margin-bottom: 16px; }
                .label-executive { 
                    display: block; 
                    font-size: 12px; 
                    font-weight: 500; 
                    color: #475569; 
                    margin-bottom: 6px; 
                }
                .form-control-executive { 
                    width: 100%; 
                    border-radius: 6px; 
                    border: 1px solid #CBD5E1; 
                    padding: 8px 12px; 
                    font-size: 13px; 
                    font-weight: 400;
                    color: #0F172A;
                    outline: none; 
                    transition: border-color 0.2s;
                    background: #fff; 
                    height: 38px;
                }
                .form-control-executive:focus { 
                    border-color: #3B82F6; 
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); 
                }
                
                .btn-executive {
                    height: 38px;
                    padding: 0 20px;
                    font-size: 13px;
                    font-weight: 600;
                    border-radius: 6px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-group-toggle {
                    display: flex;
                    background: #F1F5F9;
                    padding: 6px;
                    border-radius: 18px;
                    gap: 4px;
                }
                .btn-toggle {
                    flex: 1;
                    padding: 12px;
                    border-radius: 14px;
                    border: none;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                .btn-toggle.active {
                    background: #fff;
                    color: #0F172A;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                }
                .btn-toggle:not(.active) {
                    color: #64748B;
                    background: transparent;
                }
                .btn-toggle:not(.active):hover {
                    background: rgba(255, 255, 255, 0.4);
                }

                .section-header-accent {
                    display: flex;
                    align-items: center;
                    gap: 0;
                    font-size: 15px;
                    font-weight: 700;
                    color: #0F172A;
                    letter-spacing: -0.01em;
                    margin-bottom: 20px;
                }

                .data-table-premium { width: 100%; border-collapse: separate; border-spacing: 0; }
                .data-table-premium th { 
                    background: #F8FAFC; 
                    padding: 16px 24px; 
                    font-size: 11px; 
                    font-weight: 600; 
                    color: #94A3B8; 
                    text-transform: uppercase; 
                    letter-spacing: 0.05em; 
                    border-bottom: 1px solid #E2E8F0;
                }
                .data-table-premium td { 
                    padding: 20px 24px; 
                    font-size: 14px; 
                    color: #1E293B; 
                    border-bottom: 1px solid #F1F5F9; 
                }
                .data-table-premium tr:hover td { background: #F8FAFC; }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 className="responsive-h1" style={{ margin: 0, color: '#0F172A', fontWeight: 600 }}>Blood Bank Command</h1>
                    <p style={{ margin: '4px 0 0', color: '#64748B', fontWeight: 500, fontSize: '15px' }}>{dateStr} • Strategic Blood Supply Coordination</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary" onClick={loadDashboardData} style={{ borderRadius: '12px', background: '#fff' }}>
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button className="btn btn-primary shadow-premium" style={{ borderRadius: '12px', background: '#EF4444', borderColor: '#EF4444' }} onClick={() => setShowDonorModal(true)}>
                        <UserPlus size={18} /> REGISTER DONOR
                    </button>
                    <button className="btn btn-primary shadow-premium" style={{ borderRadius: '12px', background: '#0F172A', border: 'none' }} onClick={() => setShowIssuanceModal(true)}>
                        <Truck size={18} /> DISPENSE BLOOD
                    </button>
                </div>
            </div>

            {/* Strategic KPI Strip */}
            <div className="kpi-grid" style={{ marginBottom: '32px' }}>
                {KPI_CARDS.map(card => {
                    const Icon = card.icon;
                    return (
                        <div key={card.id} className="kpi-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${card.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={24} style={{ color: card.color }} />
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: 500, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 600, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                                {loading ? '...' : card.value}
                            </div>
                            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 400 }}>{card.sub}</div>
                        </div>
                    );
                })}
            </div>

            <div style={{ borderBottom: '1px solid #E2E8F0', marginBottom: '40px', display: 'flex', gap: '8px' }}>
                {TABS.map(tab => (
                    <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                        <tab.icon size={16} strokeWidth={2.5} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }}>
                    <div>
                        <div className="card shadow-premium" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', border: 'none' }}>
                            <div style={{ padding: '28px 32px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 className="section-header-accent">Component Inventory Matrix</h3>
                                <ShieldCheck size={22} color="#10B981" />
                            </div>
                            <div style={{ padding: '32px' }}>
                                <div className="inventory-grid">
                                    {data?.inventory.map(item => (
                                        <div key={item.type} className="blood-box">
                                            <div style={{ fontSize: '18px', fontWeight: 600, color: '#EF4444', marginBottom: '4px' }}>{item.type}</div>
                                            <div style={{ fontSize: '28px', fontWeight: 600, color: '#0F172A' }}>{item.units}</div>
                                            <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', marginTop: '6px' }}>Available Units</div>
                                            <div style={{ marginTop: '12px', padding: '4px', borderRadius: '6px', fontSize: '9px', fontWeight: 600, background: item.status === 'Optimal' ? '#F0FDF4' : '#FEF2F2', color: item.status === 'Optimal' ? '#16A34A' : '#EF4444', textTransform: 'uppercase' }}>{item.status}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{ marginTop: '32px', padding: '32px', borderRadius: '24px', background: '#0F172A' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#EF444420', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Activity size={32} color="#EF4444" />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, color: '#fff', fontSize: '20px', fontWeight: 600, letterSpacing: '-0.01em' }}>Clinical Response Protocol</h4>
                                    <p style={{ margin: '8px 0 0', color: '#94A3B8', fontSize: '15px', lineHeight: 1.6, fontWeight: 400 }}>Cross-matching queue is currently stable. Average turnaround for STAT requests is 14 minutes.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="card shadow-premium" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', border: 'none' }}>
                            <div style={{ padding: '28px 32px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 className="section-header-accent">Requisition Ledger</h3>
                                <Link href="#" style={{ fontSize: '12px', fontWeight: 900, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>View All</Link>
                            </div>
                            <div style={{ padding: '12px' }}>
                                {data?.pendingRequests.map(req => (
                                    <div key={req.id} style={{ padding: '16px', borderRadius: '16px', border: '1px solid #F1F5F9', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', letterSpacing: '-0.01em' }}>{req.pt}</div>
                                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#EF4444', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{req.type} • {req.qty}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '10px', fontWeight: 600, padding: '4px 10px', borderRadius: '8px', background: req.urgency === 'STAT' ? '#FEF2F2' : '#F1F5F9', color: req.urgency === 'STAT' ? '#EF4444' : '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{req.urgency}</div>
                                            <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '6px', fontWeight: 500 }}>{req.time}</div>
                                        </div>
                                    </div>
                                ))}
                                {data?.pendingRequests.length === 0 && (
                                    <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No pending requisitions.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'donors' && (
                <div className="card shadow-premium" style={{ padding: '0', borderRadius: '28px', overflow: 'hidden', border: 'none' }}>
                    <div style={{ padding: '32px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#0F172A', letterSpacing: '-0.01em' }}>Donor Registry</h3>
                            <p style={{ margin: '6px 0 0', color: '#64748B', fontSize: '14px', fontWeight: 400 }}>Life-Saving Community Contributors</p>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '16px', top: '14px', color: '#94A3B8' }} />
                            <input className="form-control" style={{ width: '340px', height: '44px', paddingLeft: '44px', fontSize: '13px' }} placeholder="Search Donor by Name or UHID..." />
                        </div>
                    </div>
                    <table className="data-table-premium">
                        <thead>
                            <tr>
                                {['Donor Code', 'Full Name', 'Gender', 'Blood Group', 'Last Donation', 'Status', 'Actions'].map(h => (
                                    <th key={h} style={{ textAlign: 'left' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {donors.map(donor => (
                                <tr key={donor.id}>
                                    <td style={{ fontWeight: 600, color: '#0F172A', fontFamily: 'JetBrains Mono, monospace' }}>{donor.donorCode}</td>
                                    <td style={{ fontWeight: 600, color: '#0F172A' }}>{donor.firstName} {donor.lastName}</td>
                                    <td style={{ color: '#64748B', fontWeight: 400 }}>{donor.gender}</td>
                                    <td style={{ fontWeight: 600, color: '#EF4444' }}>{donor.bloodGroup}</td>
                                    <td style={{ color: '#64748B', fontWeight: 400 }}>{donor.lastDonationAt ? new Date(donor.lastDonationAt).toLocaleDateString() : 'Never'}</td>
                                    <td>
                                        <span style={{ fontSize: '10px', fontWeight: 600, padding: '6px 12px', borderRadius: '20px', background: '#F0FDF4', color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{donor.status}</span>
                                    </td>
                                    <td>
                                        <button className="btn btn-secondary shadow-sm" style={{ borderRadius: '10px', fontSize: '11px', fontWeight: 600 }} onClick={() => {
                                            setDonationForm({...donationForm, donorId: donor.id, bloodGroup: donor.bloodGroup});
                                            setShowDonationModal(true);
                                        }}>
                                            <Zap size={14} fill="#EF4444" color="#EF4444" /> COLLECT
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'issuances' && (
                <div className="card shadow-premium" style={{ padding: '0', borderRadius: '28px', overflow: 'hidden', border: 'none' }}>
                    <div style={{ padding: '32px', borderBottom: '1px solid #F1F5F9' }}>
                        <h3 className="section-header-accent">Historical Issuance Logs</h3>
                    </div>
                    <table className="data-table-premium">
                        <thead>
                            <tr>
                                {['Issuance ID', 'Type', 'Destination', 'Blood Group', 'Units', 'Issued At', 'Issued By'].map(h => (
                                    <th key={h} style={{ textAlign: 'left' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {issuances.map(iss => (
                                <tr key={iss.id}>
                                    <td style={{ fontWeight: 600, color: '#0F172A', fontFamily: 'JetBrains Mono, monospace' }}>{iss.issuanceCode}</td>
                                    <td>
                                        <span style={{ fontSize: '10px', fontWeight: 600, padding: '6px 12px', borderRadius: '20px', background: iss.type === 'Internal' ? '#F0F9FF' : '#FEF2F2', color: iss.type === 'Internal' ? '#00A3FF' : '#EF4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{iss.type}</span>
                                    </td>
                                    <td style={{ fontWeight: 600, color: '#0F172A' }}>{iss.destination}</td>
                                    <td style={{ fontWeight: 600, color: '#EF4444' }}>{iss.bloodGroup}</td>
                                    <td style={{ fontWeight: 600 }}>{iss.units} Units</td>
                                    <td style={{ color: '#64748B', fontWeight: 400 }}>{new Date(iss.issuedAt).toLocaleString()}</td>
                                    <td style={{ color: '#64748B', fontWeight: 400 }}>{iss.issuedBy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal: New Donor */}
            {showDonorModal && (
                <div className="modal-overlay-executive">
                    <div className="modal-card-executive" style={{ maxWidth: '540px' }}>
                        <div className="modal-header-executive">
                            <h2 className="modal-title-executive">New Donor Registration</h2>
                            <button onClick={() => setShowDonorModal(false)} className="modal-close-btn">
                                <Plus size={16} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group-compact">
                                    <label className="label-executive">First Name</label>
                                    <input className="form-control-executive" value={donorForm.firstName} onChange={e => setDonorForm({...donorForm, firstName: e.target.value})} placeholder="e.g. John" />
                                </div>
                                <div className="form-group-compact">
                                    <label className="label-executive">Last Name</label>
                                    <input className="form-control-executive" value={donorForm.lastName} onChange={e => setDonorForm({...donorForm, lastName: e.target.value})} placeholder="e.g. Doe" />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group-compact">
                                    <label className="label-executive">Gender</label>
                                    <select className="form-control-executive" value={donorForm.gender} onChange={e => setDonorForm({...donorForm, gender: e.target.value})}>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="form-group-compact">
                                    <label className="label-executive">Blood Group</label>
                                    <select className="form-control-executive" value={donorForm.bloodGroup} onChange={e => setDonorForm({...donorForm, bloodGroup: e.target.value})}>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g}>{g}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group-compact">
                                <label className="label-executive">Phone Number</label>
                                <input className="form-control-executive" value={donorForm.phone} onChange={e => setDonorForm({...donorForm, phone: e.target.value})} placeholder="+91 XXXX XXXX" />
                            </div>
                            <div className="form-group-compact">
                                <label className="label-executive">Residential Address</label>
                                <textarea className="form-control-executive" style={{ height: '70px', resize: 'none' }} value={donorForm.address} onChange={e => setDonorForm({...donorForm, address: e.target.value})} placeholder="Enter complete address..." />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button className="btn-executive" style={{ flex: 1, background: '#fff', border: '1px solid #E2E8F0', color: '#64748B' }} onClick={() => setShowDonorModal(false)}>Cancel</button>
                                <button className="btn-executive" style={{ flex: 2, background: '#0F172A', border: 'none', color: '#fff' }} onClick={handleSaveDonor} disabled={saving}>
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : 'Register Donor'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: New Donation (Screening + Collection) */}
            {showDonationModal && (
                <div className="modal-overlay-executive">
                    <div className="modal-card-executive" style={{ maxWidth: '820px' }}>
                        <div className="modal-header-executive">
                            <h2 className="modal-title-executive">Blood Collection & Screening</h2>
                            <button onClick={() => setShowDonationModal(false)} className="modal-close-btn">
                                <Plus size={16} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', overflowY: 'auto' }}>
                            <div>
                                <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>Biomedical Screening</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    {['hivStatus', 'hbvStatus', 'hcvStatus', 'syphilisStatus', 'malariaStatus'].map(field => (
                                        <div className="form-group-compact" key={field}>
                                            <label className="label-executive">{field.replace('Status', '').toUpperCase()} Test</label>
                                            <select className="form-control-executive" value={donationForm[field]} onChange={e => setDonationForm({...donationForm, [field]: e.target.value})}>
                                                <option>Non-Reactive</option>
                                                <option>Reactive</option>
                                                <option>Suspicious</option>
                                            </select>
                                        </div>
                                    ))}
                                    <div className="form-group-compact">
                                        <label className="label-executive">Hb Level (g/dL)</label>
                                        <input type="number" className="form-control-executive" value={donationForm.haemoglobin} onChange={e => setDonationForm({...donationForm, haemoglobin: e.target.value})} step="0.1" />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div className="form-group-compact">
                                        <label className="label-executive">Weight (Kg)</label>
                                        <input type="number" className="form-control-executive" value={donationForm.weight} onChange={e => setDonationForm({...donationForm, weight: e.target.value})} />
                                    </div>
                                    <div className="form-group-compact">
                                        <label className="label-executive">Vital BP</label>
                                        <input className="form-control-executive" value={donationForm.bp} onChange={e => setDonationForm({...donationForm, bp: e.target.value})} placeholder="120/80" />
                                    </div>
                                </div>
                            </div>
                            <div style={{ borderLeft: '1px solid #F1F5F9', paddingLeft: '32px' }}>
                                <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>Collection Matrix</h4>
                                <div className="form-group-compact">
                                    <label className="label-executive">Volume Units</label>
                                    <input type="number" className="form-control-executive" value={donationForm.unitsCollected} onChange={e => setDonationForm({...donationForm, unitsCollected: e.target.value})} />
                                </div>
                                <div className="form-group-compact">
                                    <label className="label-executive">Clinical Suitability</label>
                                    <button 
                                        type="button"
                                        onClick={() => setDonationForm({...donationForm, fitForDonation: !donationForm.fitForDonation})}
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '6px', border: '1px solid', borderColor: donationForm.fitForDonation ? '#10B981' : '#F1F5F9', background: donationForm.fitForDonation ? '#F0FDF4' : '#fff', color: donationForm.fitForDonation ? '#15803D' : '#64748B', transition: 'all 0.2s' }}
                                    >
                                        <CheckCircle2 size={16} color={donationForm.fitForDonation ? '#10B981' : '#CBD5E1'} />
                                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{donationForm.fitForDonation ? 'Donor is Clinically Fit' : 'Mark as Clinically Fit'}</span>
                                    </button>
                                </div>
                                <div className="form-group-compact">
                                    <label className="label-executive">Clinical Remarks</label>
                                    <textarea className="form-control-executive" style={{ height: '70px', resize: 'none' }} value={donationForm.remarks} onChange={e => setDonationForm({...donationForm, remarks: e.target.value})} />
                                </div>
                                <button className="btn-executive" style={{ width: '100%', background: '#EF4444', border: 'none', color: '#fff' }} onClick={handleSaveDonation} disabled={saving}>
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : 'Authorize & Ingest Stock'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Donation Certificate */}
            {/* Modal: Donation Certificate */}
            {certificateData && (
                <div className="modal-overlay-executive">
                    <style jsx>{`
                        .certificate-card {
                            background: #fff;
                            width: 100%;
                            max-width: 700px;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: 0 40px 100px -20px rgba(15, 23, 42, 0.3);
                            position: relative;
                            padding: 40px;
                            border: 1px solid #E2E8F0;
                        }
                        .cert-border-accent {
                            position: absolute;
                            inset: 20px;
                            border: 1px solid #F1F5F9;
                            pointer-events: none;
                        }
                        .cert-corner-tl { position: absolute; top: 20px; left: 20px; width: 40px; height: 40px; border-top: 3px solid #EF4444; border-left: 3px solid #EF4444; }
                        .cert-corner-tr { position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; border-top: 3px solid #EF4444; border-right: 3px solid #EF4444; }
                        .cert-corner-bl { position: absolute; bottom: 20px; left: 20px; width: 40px; height: 40px; border-bottom: 3px solid #EF4444; border-left: 3px solid #EF4444; }
                        .cert-corner-br { position: absolute; bottom: 20px; right: 20px; width: 40px; height: 40px; border-bottom: 3px solid #EF4444; border-right: 3px solid #EF4444; }
                        @media print { .print-hide { display: none !important; } }
                    `}</style>

                    <div className="certificate-card fade-in">
                        <div className="cert-border-accent"></div>
                        <div className="cert-corner-tl"></div>
                        <div className="cert-corner-tr"></div>
                        <div className="cert-corner-bl"></div>
                        <div className="cert-corner-br"></div>

                        <button onClick={() => setCertificateData(null)} className="print-hide" style={{ position: 'absolute', right: '32px', top: '32px', border: 'none', background: 'none', color: '#94A3B8', cursor: 'pointer', zIndex: 10 }}><ArrowLeft size={24} /></button>
                        
                        <div style={{ textAlign: 'center', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Droplet size={32} color="#EF4444" fill="#EF4444" />
                                </div>
                            </div>
                            
                            <h4 style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px' }}>Nexora Health Strategic Blood Services</h4>
                            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', marginBottom: '40px', letterSpacing: '-0.02em' }}>Certificate of Donation</h1>
                            
                            <div style={{ margin: '40px 0' }}>
                                <p style={{ fontSize: '16px', color: '#64748B', fontWeight: 500 }}>This is to certify and honorably recognize</p>
                                <h2 style={{ fontSize: '36px', fontWeight: 700, color: '#0F172A', margin: '16px 0', borderBottom: '2px solid #F1F5F9', paddingBottom: '16px', display: 'inline-block' }}>
                                    {donors.find(d => d.id === certificateData.donorId)?.firstName} {donors.find(d => d.id === certificateData.donorId)?.lastName}
                                </h2>
                                <p style={{ fontSize: '16px', color: '#64748B', fontWeight: 500, marginTop: '24px' }}>for their humanitarian act of donating</p>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', margin: '24px 0' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Component</div>
                                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#EF4444' }}>Whole Blood</div>
                                    </div>
                                    <div style={{ width: '1px', background: '#E2E8F0' }}></div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Blood Group</div>
                                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#EF4444' }}>{certificateData.bloodGroup}</div>
                                    </div>
                                </div>
                                <p style={{ fontSize: '15px', color: '#64748B', fontWeight: 500 }}>on this day, <span style={{ fontWeight: 700, color: '#0F172A' }}>{new Date(certificateData.collectionDate).toLocaleDateString()}</span>.</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '60px', borderTop: '1px solid #F1F5F9', paddingTop: '32px' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Registry Index</div>
                                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>{certificateData.donationCode}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ height: '40px', borderBottom: '1px solid #0F172A', width: '160px', marginLeft: 'auto' }}></div>
                                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', marginTop: '8px' }}>Medical Superintendent</div>
                                </div>
                            </div>
                        </div>

                        <div className="print-hide" style={{ marginTop: '48px', display: 'flex', gap: '12px' }}>
                            <button className="btn-executive" style={{ flex: 1, background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0' }} onClick={() => setCertificateData(null)}>Dismiss Rendering</button>
                            <button className="btn-executive" style={{ flex: 2, background: '#EF4444', color: '#fff', border: 'none' }} onClick={() => window.print()}>
                                <Printer size={18} /> INITIATE OFFICIAL PRINT
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Dispense Blood (Issuance) */}
            {showIssuanceModal && (
                <div className="modal-overlay-executive">
                    <div className="modal-card-executive" style={{ maxWidth: '540px' }}>
                        <div className="modal-header-executive">
                            <h2 className="modal-title-executive">Dispense Blood Product</h2>
                            <button onClick={() => setShowIssuanceModal(false)} className="modal-close-btn">
                                <Plus size={16} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div className="form-group-compact">
                                <label className="label-executive">Issuance Strategy</label>
                                <div style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '8px', gap: '4px' }}>
                                    {['Internal', 'External'].map(t => (
                                        <button 
                                            key={t}
                                            className={`btn-toggle ${issuanceForm.type === t ? 'active' : ''}`}
                                            onClick={() => setIssuanceForm({...issuanceForm, type: t})}
                                            style={{ flex: 1, padding: '8px', fontSize: '12px', borderRadius: '6px' }}
                                        >
                                            {t.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {issuanceForm.type === 'Internal' ? (
                                <div className="form-group-compact">
                                    <label className="label-executive">Clinical Requisition Link</label>
                                    <select className="form-control-executive" value={issuanceForm.requestId} onChange={e => {
                                        const req = data?.pendingRequests.find(r => r.id === e.target.value);
                                        setIssuanceForm({...issuanceForm, requestId: e.target.value, bloodGroup: req?.type || 'O+', destination: req?.pt || ''});
                                    }}>
                                        <option value="">Select Priority Requisition...</option>
                                        {data?.pendingRequests.map(r => <option key={r.id} value={r.id}>{r.id} - {r.pt} ({r.type})</option>)}
                                    </select>
                                </div>
                            ) : (
                                <div className="form-group-compact">
                                    <label className="label-executive">Recipient Agency / Hospital</label>
                                    <input className="form-control-executive" value={issuanceForm.destination} onChange={e => setIssuanceForm({...issuanceForm, destination: e.target.value})} placeholder="e.g. City General Hospital" />
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group-compact">
                                    <label className="label-executive">Blood Group</label>
                                    <select className="form-control-executive" value={issuanceForm.bloodGroup} onChange={e => setIssuanceForm({...issuanceForm, bloodGroup: e.target.value})}>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div className="form-group-compact">
                                    <label className="label-executive">Volume (Units)</label>
                                    <input type="number" className="form-control-executive" value={issuanceForm.units} onChange={e => setIssuanceForm({...issuanceForm, units: e.target.value})} />
                                </div>
                            </div>

                            <div className="form-group-compact">
                                <label className="label-executive">Staff Identification (Receiver)</label>
                                <input className="form-control-executive" value={issuanceForm.receivedBy} onChange={e => setIssuanceForm({...issuanceForm, receivedBy: e.target.value})} placeholder="Name or Badge ID" />
                            </div>

                            <div className="form-group-compact">
                                <label className="label-executive">Cross-Match Verification</label>
                                <textarea className="form-control-executive" style={{ height: '60px', resize: 'none' }} value={issuanceForm.crossMatchNotes} onChange={e => setIssuanceForm({...issuanceForm, crossMatchNotes: e.target.value})} placeholder="Enter compatibility verification notes..." />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                <button className="btn-executive" style={{ flex: 1, background: '#fff', border: '1px solid #E2E8F0', color: '#64748B' }} onClick={() => setShowIssuanceModal(false)}>Cancel</button>
                                <button className="btn-executive" style={{ flex: 2, background: '#0F172A', border: 'none', color: '#fff' }} onClick={handleSaveIssuance} disabled={saving}>
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : 'Authorize Cold-Chain Dispensation'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
