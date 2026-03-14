'use client';
import { ShoppingCart, Plus, Trash2, Search, ArrowLeft, CheckCircle, Package } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function NewPOContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const prefilledSupplierId = searchParams.get('supplierId');

    const [suppliers, setSuppliers] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [selectedSupplierId, setSelectedSupplierId] = useState(prefilledSupplierId || '');
    const [notes, setNotes] = useState('');
    const [items, setItems] = useState([]); // { medicineId, medicineName, quantity, unitPrice }

    // Medicine Search state
    const [medSearch, setMedSearch] = useState('');
    const [showMedResults, setShowMedResults] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [suppRes, medRes] = await Promise.all([
                    fetch('/api/pharmacy/suppliers'),
                    fetch('/api/pharmacy/medicines')
                ]);
                const suppData = await suppRes.json();
                const medData = await medRes.json();
                setSuppliers(suppData.suppliers || []);
                setMedicines(medData.medicines || []);
                if (prefilledSupplierId) setSelectedSupplierId(prefilledSupplierId);
            } catch (e) {
                console.error("Fetch error", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [prefilledSupplierId]);

    const addItem = (med) => {
        // Prevent duplicate items
        if (items.some(i => i.medicineId === med.id)) {
            setMedSearch('');
            setShowMedResults(false);
            return;
        }

        setItems([...items, {
            medicineId: med.id,
            medicineName: med.name,
            quantity: 1,
            unitPrice: med.costPrice || 0
        }]);
        setMedSearch('');
        setShowMedResults(false);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (parseFloat(item.unitPrice) * parseInt(item.quantity || 0)), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSupplierId) return alert("Please select a supplier");
        if (items.length === 0) return alert("Please add at least one medicine");

        setSubmitting(true);
        try {
            const res = await fetch('/api/pharmacy/purchase-orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    supplierId: selectedSupplierId,
                    notes,
                    items
                })
            });

            if (res.ok) {
                router.push('/pharmacy/procurement');
            } else {
                const data = await res.json();
                alert(data.error || "Failed to create PO");
            }
        } catch (e) {
            alert("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredMedicines = medSearch 
        ? medicines.filter(m => m.name.toLowerCase().includes(medSearch.toLowerCase()) || m.drugCode.toLowerCase().includes(medSearch.toLowerCase()))
        : [];

    if (loading) return <div style={{ padding: '24px' }}>Initializing Procurement Form...</div>;

    const totalAmount = calculateTotal();

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <Link href="/pharmacy/procurement" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', textDecoration: 'none', fontSize: '14px', marginBottom: '8px' }}>
                        <ArrowLeft size={14} /> Back to Procurement
                    </Link>
                    <h1 className="page-header__title">Draft New Purchase Order</h1>
                    <p className="page-header__subtitle">Generate a formal PO for medical inventory restock.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
                    
                    {/* Left Column: Items */}
                    <div className="card" style={{ padding: '24px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Package size={18} /> Order Items
                        </h2>

                        {/* Medicine Selector */}
                        <div style={{ position: 'relative', marginBottom: '24px' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '13px' }} />
                                <input 
                                    type="text" 
                                    placeholder="Search medicine by name or drug code..." 
                                    value={medSearch} 
                                    onChange={e => { setMedSearch(e.target.value); setShowMedResults(true); }}
                                    onFocus={() => setShowMedResults(true)}
                                    style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid #E2E8F0', borderRadius: '10px', outline: 'none', fontSize: '15px' }} 
                                />
                            </div>

                            {showMedResults && medSearch && (
                                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', marginTop: '6px', zIndex: 50, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxHeight: '250px', overflowY: 'auto' }}>
                                    {filteredMedicines.length === 0 ? (
                                        <div style={{ padding: '20px', textAlign: 'center', color: '#94A3B8', fontSize: '14px' }}>No matches found in inventory.</div>
                                    ) : filteredMedicines.map(med => (
                                        <div 
                                            key={med.id} 
                                            onClick={() => addItem(med)}
                                            style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                            onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'}
                                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '14px' }}>{med.name}</div>
                                                <div style={{ fontSize: '11px', color: '#94A3B8' }}>{med.drugCode} • Stock: {med.stock}</div>
                                            </div>
                                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#00C2FF' }}>Select <Plus size={12} /></div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Items Table */}
                        <div className="data-table-container" style={{ border: '1px solid #F1F5F9', borderRadius: '10px' }}>
                            <table className="data-table">
                                <thead style={{ background: '#F8FAFC' }}>
                                    <tr>
                                        <th>Medicine Details</th>
                                        <th style={{ width: '120px' }}>Quantity</th>
                                        <th style={{ width: '150px' }}>Unit Price (₹)</th>
                                        <th style={{ width: '150px' }}>Total (₹)</th>
                                        <th style={{ width: '50px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
                                                <ShoppingCart size={32} strokeWidth={1} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                                                <p>No medicines added to this order yet.</p>
                                            </td>
                                        </tr>
                                    ) : items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{item.medicineName}</div>
                                            </td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    min="1" 
                                                    value={item.quantity} 
                                                    onChange={e => updateItem(idx, 'quantity', e.target.value)}
                                                    style={{ width: '100%', padding: '8px', border: '1px solid #E2E8F0', borderRadius: '6px', outline: 'none' }}
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    min="0" 
                                                    step="0.01"
                                                    value={item.unitPrice} 
                                                    onChange={e => updateItem(idx, 'unitPrice', e.target.value)}
                                                    style={{ width: '100%', padding: '8px', border: '1px solid #E2E8F0', borderRadius: '6px', outline: 'none' }}
                                                />
                                            </td>
                                            <td style={{ fontWeight: 700, color: 'var(--color-navy)' }}>
                                                ₹ {(parseFloat(item.unitPrice) * parseInt(item.quantity || 0)).toLocaleString()}
                                            </td>
                                            <td>
                                                <button type="button" onClick={() => removeItem(idx)} style={{ color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }} title="Remove">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Column: Supplier & Summary */}
                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div className="card" style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '16px' }}>Order Logistics</h3>
                            
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#64748B' }}>Vendor / Supplier *</label>
                                <select 
                                    required
                                    value={selectedSupplierId} 
                                    onChange={e => setSelectedSupplierId(e.target.value)}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#fff' }}
                                >
                                    <option value="">Select Supplier</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>

                            <div style={{ marginBottom: '4px' }}>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#64748B' }}>Order Notes</label>
                                <textarea 
                                    value={notes} 
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="Expected delivery date, shipping instructions..."
                                    rows={4}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none', resize: 'none' }} 
                                />
                            </div>
                        </div>

                        <div className="card" style={{ padding: '24px', background: 'var(--color-navy)', color: '#fff' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pricing Summary</h3>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ opacity: 0.8 }}>Total Items</span>
                                <span style={{ fontWeight: 600 }}>{items.length}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '16px' }}>
                                <span style={{ opacity: 0.8 }}>Subtotal</span>
                                <span style={{ fontWeight: 600 }}>₹ {totalAmount.toLocaleString()}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
                                <span style={{ fontSize: '15px', fontWeight: 700 }}>ESTIMATED TOTAL</span>
                                <span style={{ fontSize: '24px', fontWeight: 800, color: '#00C2FF' }}>₹ {totalAmount.toLocaleString()}</span>
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitting || items.length === 0}
                                className="btn btn-primary" 
                                style={{ width: '100%', padding: '12px', background: '#00C2FF', borderColor: '#00C2FF', color: 'var(--color-navy)', fontWeight: 800, fontSize: '15px' }}
                            >
                                {submitting ? 'Generating PO...' : 'Issue Purchase Order'}
                            </button>
                        </div>
                    </div>

                </div>
            </form>

            {/* Click away for medicine results */}
            {showMedResults && (
                <div 
                    onClick={() => setShowMedResults(false)}
                    style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                />
            )}
        </div>
    );
}

export default function NewPurchaseOrderPage() {
    return (
        <Suspense fallback={<div>Loading form...</div>}>
            <NewPOContent />
        </Suspense>
    );
}
