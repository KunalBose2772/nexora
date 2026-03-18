'use client';

import {
    ShoppingCart, Plus, Truck, PackageCheck,
    Search, Filter, ArrowRight, Building2,
    User, Mail, Phone, ChevronRight, X,
    FileText, Calendar, Wallet, CheckCircle2, Clock
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import Skeleton from '@/components/common/Skeleton';

export default function ProcurementPage() {
    const [suppliers, setSuppliers] = useState([]);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pos');

    // Supplier Form Modal
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [newSupplier, setNewSupplier] = useState({ name: '', contactPerson: '', phone: '', email: '', gstNumber: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [suppRes, poRes] = await Promise.all([
                    fetch('/api/pharmacy/suppliers'),
                    fetch('/api/pharmacy/purchase-orders')
                ]);
                const suppData = await suppRes.json();
                const poData = await poRes.json();
                setSuppliers(suppData.suppliers || []);
                setPurchaseOrders(poData.purchaseOrders || []);
            } catch (e) {
                console.error("Fetch error", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddSupplier = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/pharmacy/suppliers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSupplier)
            });
            if (res.ok) {
                const data = await res.json();
                setSuppliers([data.supplier, ...suppliers]);
                setShowSupplierModal(false);
                setNewSupplier({ name: '', contactPerson: '', phone: '', email: '', gstNumber: '' });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fade-in space-y-6 pb-10">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-header__title text-navy-900">Pharmacy Procurement</h1>
                    <p className="page-header__subtitle">Manage vendor relations and strategic inventory procurement</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button onClick={() => setShowSupplierModal(true)} className="btn btn-secondary">
                        <Building2 size={16} /> Register Vendor
                    </button>
                    <Link href="/pharmacy/procurement/new" className="btn btn-primary">
                        <ShoppingCart size={16} /> Create New PO
                    </Link>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-slate-100">
                <div className="tabs mb-[-1px]">
                    <button
                        onClick={() => setActiveTab('pos')}
                        className={`tab-item px-6 py-4 text-sm font-bold tracking-tight transition-all ${activeTab === 'pos' ? 'active text-cyan-600 border-b-2 border-cyan-500' : 'text-slate-400 border-transparent'}`}
                    >
                        Purchase Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('suppliers')}
                        className={`tab-item px-6 py-4 text-sm font-bold tracking-tight transition-all ${activeTab === 'suppliers' ? 'active text-cyan-600 border-b-2 border-cyan-500' : 'text-slate-400 border-transparent'}`}
                    >
                        Active Vendors
                    </button>
                </div>
                {activeTab === 'pos' && (
                    <div className="hidden md:flex gap-4">
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <Clock size={12} /> Pending: <span className="text-amber-600">{purchaseOrders.filter(p => p.status !== 'Received').length}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <CheckCircle2 size={12} /> Received: <span className="text-emerald-600">{purchaseOrders.filter(p => p.status === 'Received').length}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="fade-in">
                {activeTab === 'pos' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="card p-6 h-full space-y-4">
                                    <div className="flex justify-between items-start">
                                        <Skeleton width="80px" height="20px" />
                                        <Skeleton width="100px" height="20px" borderRadius="9999px" />
                                    </div>
                                    <Skeleton width="160px" height="24px" />
                                    <div className="flex gap-3">
                                        <Skeleton width="60px" height="15px" />
                                        <Skeleton width="80px" height="15px" />
                                    </div>
                                    <div className="pt-4 border-t border-slate-50 flex justify-between">
                                        <Skeleton width="80px" height="12px" />
                                        <Skeleton width="50px" height="12px" />
                                    </div>
                                </div>
                            ))
                        ) : purchaseOrders.length === 0 ? (
                            <div className="col-span-full py-20 text-center card bg-slate-50/50 border-dashed border-2 border-slate-200">
                                <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active purchase orders</p>
                                <Link href="/pharmacy/procurement/new" className="text-cyan-600 text-xs font-black mt-2 inline-block uppercase tracking-widest hover:underline">Initate First PO →</Link>
                            </div>
                        ) : purchaseOrders.map(po => (
                            <Link key={po.id} href={`/pharmacy/procurement/${po.id}`} className="group block h-full">
                                <div className="card p-6 h-full flex flex-col hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-900/5 transition-all duration-300">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="px-3 py-1 bg-slate-100 rounded text-[10px] font-black text-slate-500 font-mono tracking-tighter">
                                            {po.poNumber}
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border flex items-center gap-1.5 ${po.status === 'Received' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            po.status === 'Partially Received' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${po.status === 'Received' ? 'bg-emerald-500' :
                                                po.status === 'Partially Received' ? 'bg-amber-500' : 'bg-blue-500'
                                                }`} />
                                            {po.status}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-navy-900 mb-1 group-hover:text-cyan-600 transition-colors line-clamp-1">{po.supplier?.name}</h3>
                                        <div className="flex items-center gap-3 text-slate-400 mb-6">
                                            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-tight">
                                                <PackageCheck size={14} className="text-cyan-500" />
                                                {po._count?.items || 0} Items
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                                            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-tight">
                                                <Wallet size={14} className="text-slate-500" />
                                                ₹{po.totalAmount?.toLocaleString() || 0}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={12} />
                                            {new Date(po.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-center gap-1 group-hover:text-cyan-600 transition-colors">
                                            Review <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="card overflow-hidden">
                        <div className="data-table-wrapper border-none p-0 px-1">
                            <table className="data-table">
                                <thead className="bg-slate-50/80 border-b border-slate-100">
                                    <tr>
                                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Vendor Identity</th>
                                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Governance & Contact</th>
                                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Channel Access</th>
                                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Tax Compliant</th>
                                        <th className="py-4 px-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        [1, 2, 3, 4, 5].map(i => (
                                            <tr key={i} className="border-b border-slate-50">
                                                <td className="py-5 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <Skeleton width="40px" height="40px" borderRadius="12px" />
                                                        <div>
                                                            <Skeleton width="120px" height="15px" className="mb-2" />
                                                            <Skeleton width="80px" height="10px" />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6"><Skeleton width="100px" height="15px" /><Skeleton width="80px" height="10px" className="mt-2" /></td>
                                                <td className="py-5 px-6"><Skeleton width="120px" height="30px" /></td>
                                                <td className="py-5 px-6"><Skeleton width="100px" height="15px" /></td>
                                                <td className="py-5 px-6 text-right"><Skeleton width="80px" height="36px" className="ml-auto" /></td>
                                            </tr>
                                        ))
                                    ) : suppliers.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No registered vendors</td>
                                        </tr>
                                    ) : suppliers.map(s => (
                                        <tr key={s.id} className="hover:bg-cyan-50/30 transition-colors border-b border-slate-50">
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center font-black text-sm">
                                                        {s.name[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-navy-900 text-sm">{s.name}</div>
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Reg ID: {s.id.slice(-6).toUpperCase()}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs mb-1">
                                                    <User size={12} className="text-cyan-500" /> {s.contactPerson || 'Direct Primary'}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-medium">
                                                    <Truck size={12} /> Strategic Partner
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2 text-[11px] font-black text-navy-800 tracking-tight">
                                                        <Phone size={12} className="text-slate-300" /> {s.phone}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 lowercase italic">
                                                        <Mail size={12} className="text-slate-300" /> {s.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <span className="px-3 py-1 bg-white border border-slate-200 rounded font-mono text-[11px] font-bold text-slate-600">
                                                    {s.gstNumber || 'UNREGISTERED'}
                                                </span>
                                            </td>
                                            <td className="py-5 px-6 text-right">
                                                <Link
                                                    href={`/pharmacy/procurement/new?supplierId=${s.id}`}
                                                    className="inline-flex items-center gap-2 h-9 px-4 bg-navy-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-navy-800 transition-colors shadow-lg shadow-navy-900/10"
                                                >
                                                    <ShoppingCart size={13} /> Order
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Vendor Registration Modal */}
            {showSupplierModal && (
                <div className="modal-overlay-executive">
                    <style jsx>{`
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
                        }
                        .modal-card-executive {
                            background: #fff;
                            border-radius: 12px;
                            width: 100%;
                            max-width: 460px;
                            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                            overflow: hidden;
                            animation: slideUp 0.2s ease-out;
                        }
                        .modal-header-executive {
                            padding: 14px 20px;
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
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }
                        .label-executive { 
                            display: block; 
                            font-size: 12px; 
                            font-weight: 500; 
                            color: #64748B; 
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
                            height: 38px;
                            background: #fff;
                        }
                        .btn-executive {
                            height: 36px;
                            padding: 0 16px;
                            font-size: 13px;
                            font-weight: 600;
                            border-radius: 6px;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                            cursor: pointer;
                            transition: all 0.2s;
                            border: none;
                        }
                        @keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                    `}</style>

                    <div className="modal-card-executive">
                        <div className="modal-header-executive">
                            <h3 className="modal-title-executive"><Building2 size={16} className="text-blue-500" /> Register Strategic Vendor</h3>
                            <button onClick={() => setShowSupplierModal(false)} style={{ border: 'none', background: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '20px' }}>×</button>
                        </div>

                        <form onSubmit={handleAddSupplier} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label className="label-executive">Corporate Entity Name *</label>
                                <input required type="text" value={newSupplier.name} onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })} className="form-control-executive" placeholder="e.g. Nexora LifeCare Ltd." />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label className="label-executive">Contact Officer</label>
                                    <input type="text" value={newSupplier.contactPerson} onChange={e => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })} className="form-control-executive" placeholder="Primary Liaison" />
                                </div>
                                <div>
                                    <label className="label-executive">Primary Helpline</label>
                                    <input type="text" value={newSupplier.phone} onChange={e => setNewSupplier({ ...newSupplier, phone: e.target.value })} className="form-control-executive" placeholder="+91 XXXXX XXXXX" />
                                </div>
                            </div>

                            <div>
                                <label className="label-executive">Procurement Channel (Email)</label>
                                <input type="email" value={newSupplier.email} onChange={e => setNewSupplier({ ...newSupplier, email: e.target.value })} className="form-control-executive" placeholder="orders@vendor.com" />
                            </div>

                            <div>
                                <label className="label-executive">GST Compliant ID</label>
                                <input type="text" value={newSupplier.gstNumber} onChange={e => setNewSupplier({ ...newSupplier, gstNumber: e.target.value })} className="form-control-executive" style={{ fontFamily: 'monospace' }} placeholder="XXAAAAA0000A1Z5" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '12px', marginTop: '8px' }}>
                                <button type="button" onClick={() => setShowSupplierModal(false)} className="btn-executive" style={{ background: '#fff', border: '1px solid #E2E8F0', color: '#64748B' }}>Hold Action</button>
                                <button type="submit" disabled={submitting} className="btn-executive" style={{ background: 'var(--color-navy)', color: '#fff' }}>
                                    {submitting ? 'Processing...' : 'Secure Vendor Registration'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
