'use client';
import { ShoppingCart, Truck, CheckCircle, Package, ArrowLeft, Loader2, Save, MoreVertical, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import PurchaseOrderSlip from '@/components/print/PurchaseOrderSlip';

export default function PODetailPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [po, setPo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [receiving, setReceiving] = useState(false);
    const [showPrint, setShowPrint] = useState(false);
    
    // Receipt form state
    const [receiveQtys, setReceiveQtys] = useState({}); // { itemId: additionalQty }

    useEffect(() => {
        const fetchPo = async () => {
            try {
                const res = await fetch(`/api/pharmacy/purchase-orders/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setPo(data.purchaseOrder);
                } else {
                    router.push('/pharmacy/procurement');
                }
            } catch (e) {
                console.error("Fetch PO error", e);
            } finally {
                setLoading(false);
            }
        };
        fetchPo();
    }, [id, router]);

    const handleReceiveSubmit = async (e) => {
        e.preventDefault();
        const itemsToReceive = Object.entries(receiveQtys)
            .filter(([_, qty]) => parseInt(qty) > 0)
            .map(([itemId, qty]) => ({ itemId, quantity: parseInt(qty) }));

        if (itemsToReceive.length === 0) return alert("Please specify quantities to receive.");

        setReceiving(true);
        try {
            const res = await fetch(`/api/pharmacy/purchase-orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'Receive', items: itemsToReceive })
            });

            if (res.ok) {
                const data = await res.json();
                setPo(data.purchaseOrder);
                setReceiveQtys({});
                alert("Goods Receipt successful. Inventory updated.");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to receive goods.");
            }
        } catch (e) {
            alert("Network error.");
        } finally {
            setReceiving(false);
        }
    };

    if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}><Loader2 className="animate-spin mx-auto text-blue-500" size={32} /></div>;
    if (!po) return null;

    const statusColors = {
        'Issued': { bg: '#EFF6FF', color: '#1E40AF' },
        'Partially Received': { bg: '#FEF3C7', color: '#92400E' },
        'Received': { bg: '#DCFCE7', color: '#166534' },
        'Cancelled': { bg: '#FEF2F2', color: '#DC2626' }
    };
    const currentStatusStyle = statusColors[po.status] || { bg: '#F1F5F9', color: '#64748B' };

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/pharmacy/procurement" className="btn btn-secondary btn-sm" style={{ background: '#fff', padding: '10px' }}>
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h1 className="page-header__title" style={{ margin: 0 }}>{po.poNumber}</h1>
                            <span style={{ fontSize: '11px', fontWeight: 700, background: currentStatusStyle.bg, color: currentStatusStyle.color, padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                                {po.status}
                            </span>
                        </div>
                        <p className="page-header__subtitle">Issued to: <span style={{ fontWeight: 600 }}>{po.supplier?.name}</span> • {new Date(po.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={() => setShowPrint(true)}>
                        <Package size={15} /> Generate PDF PO
                    </button>
                    {po.status !== 'Cancelled' && po.status !== 'Received' && (
                        <button className="btn btn-primary btn-sm" style={{ background: '#EF4444', borderColor: '#EF4444' }}>
                           <X size={15} /> Void Order
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
                
                {/* Main Content: Items Table */}
                <div className="card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Package size={20} /> Order Items & GRN Status
                        </h3>
                    </div>

                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Medicine / Item</th>
                                    <th style={{ textAlign: 'right' }}>Unit Cost (₹)</th>
                                    <th style={{ textAlign: 'center' }}>Qty Expected</th>
                                    <th style={{ textAlign: 'center' }}>Qty Received</th>
                                    {po.status !== 'Received' && <th style={{ width: '130px' }}>Receive New</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {po.items.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{item.medicine?.name}</div>
                                            <div style={{ fontSize: '11px', color: '#94A3B8' }}>Current Stock: {item.medicine?.stock}</div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>₹ {item.unitPrice.toLocaleString()}</td>
                                        <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.quantity}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 700, color: item.receivedQuantity >= item.quantity ? '#10B981' : item.receivedQuantity > 0 ? '#F59E0B' : '#E2E8F0' }}>
                                                    {item.receivedQuantity}
                                                </span>
                                                {item.receivedQuantity >= item.quantity && <CheckCircle size={10} color="#10B981" />}
                                            </div>
                                        </td>
                                        {po.status !== 'Received' && (
                                            <td>
                                                <input 
                                                    type="number" 
                                                    min="0"
                                                    max={item.quantity - item.receivedQuantity}
                                                    placeholder="Qty..."
                                                    value={receiveQtys[item.id] || ''}
                                                    onChange={e => setReceiveQtys({ ...receiveQtys, [item.id]: e.target.value })}
                                                    disabled={item.receivedQuantity >= item.quantity}
                                                    style={{ width: '100%', padding: '6px 10px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
                                                />
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr style={{ background: '#F8FAFC' }}>
                                    <td colSpan="3" style={{ textAlign: 'right', fontWeight: 700, padding: '16px' }}>TOTAL ORDER VALUE:</td>
                                    <td colSpan="2" style={{ textAlign: 'left', fontWeight: 800, padding: '16px', fontSize: '18px', color: 'var(--color-navy)' }}>₹ {po.totalAmount.toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {po.status !== 'Received' && Object.values(receiveQtys).some(v => v > 0) && (
                        <div style={{ marginTop: '24px', padding: '20px', border: '1px solid #E2E8F0', borderRadius: '12px', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <Truck size={24} color="#00C2FF" />
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Confirm Goods Receipt Notification (GRN)</h4>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>Confirming this will immediately update inventory levels for your pharmacy store.</p>
                                </div>
                            </div>
                            <button onClick={handleReceiveSubmit} disabled={receiving} className="btn btn-primary" style={{ background: '#00C2FF', borderColor: '#00C2FF', color: 'var(--color-navy)', fontWeight: 800 }}>
                                {receiving ? 'Processing GRN...' : 'Post Inventory GRN'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Column: Supplier Detail */}
                <div style={{ display: 'grid', gap: '20px' }}>
                    <div className="card" style={{ padding: '20px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Supplier Information</h4>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#94A3B8' }}>Company</label>
                                <div style={{ fontSize: '14px', fontWeight: 600 }}>{po.supplier?.name}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#94A3B8' }}>Contact Person</label>
                                <div style={{ fontSize: '14px' }}>{po.supplier?.contactPerson || 'N/A'}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#94A3B8' }}>Phone / Email</label>
                                <div style={{ fontSize: '13px' }}>{po.supplier?.phone}</div>
                                <div style={{ fontSize: '12px', color: '#64748B' }}>{po.supplier?.email}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#94A3B8' }}>Tax Registration (GSTIN)</label>
                                <div style={{ fontSize: '13px', fontFamily: 'monospace' }}>{po.supplier?.gstNumber || 'UNREGISTERED'}</div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '20px', background: '#F8FAFC' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', marginBottom: '12px', textTransform: 'uppercase' }}>Purchase Notes</h4>
                        <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                            {po.notes || "No special instructions recorded for this purchase order."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Print PO Modal */}
            {showPrint && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
                    <div style={{ position: 'relative' }}>
                        <button onClick={() => setShowPrint(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '50%', padding: '6px', cursor: 'pointer', zIndex: 50, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}><X size={18} /></button>
                        <div style={{ background: 'white', padding: '0px', borderRadius: '12px', overflow: 'hidden' }}>
                            <PurchaseOrderSlip po={po} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
