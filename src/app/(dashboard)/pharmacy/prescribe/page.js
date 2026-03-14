'use client';
import { useState, useEffect } from 'react';
import { Pill, Save, ArrowLeft, Search, ShoppingCart, Trash2, X, Plus, Minus, ScanLine } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PrescribeMedicinePage() {
    const router = useRouter();

    const [medicines, setMedicines] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);

    // Patient search
    const [searchPatient, setSearchPatient] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [walkInName, setWalkInName] = useState('');

    // Doctor
    const [prescribedBy, setPrescribedBy] = useState('');

    // Drug search & Barcode
    const [drugSearch, setDrugSearch] = useState('');
    const [drugResults, setDrugResults] = useState([]);
    const [barcodeInput, setBarcodeInput] = useState('');

    // Cart
    const [cart, setCart] = useState([]);
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mRes, pRes] = await Promise.all([
                    fetch('/api/pharmacy/medicines'),
                    fetch('/api/patients')
                ]);
                if (mRes.ok) setMedicines((await mRes.json()).medicines || []);
                if (pRes.ok) setPatients((await pRes.json()).patients || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const filteredPatients = searchPatient
        ? patients.filter(p =>
            p.firstName.toLowerCase().includes(searchPatient.toLowerCase()) ||
            p.lastName.toLowerCase().includes(searchPatient.toLowerCase()) ||
            p.patientCode.toLowerCase().includes(searchPatient.toLowerCase()))
        : [];

    useEffect(() => {
        if (drugSearch.length >= 2) {
            const results = medicines
                .filter(m =>
                    m.name.toLowerCase().includes(drugSearch.toLowerCase()) ||
                    (m.genericName || '').toLowerCase().includes(drugSearch.toLowerCase())
                )
                // Strict FEFO (First Expire First Out) enforcement
                .sort((a, b) => {
                    const dateA = new Date(a.expiryDate || '9999-12-31');
                    const dateB = new Date(b.expiryDate || '9999-12-31');
                    return dateA - dateB;
                });
            setDrugResults(results.slice(0, 8));
        } else {
            setDrugResults([]);
        }
    }, [drugSearch, medicines]);

    const addToCart = (med) => {
        if (med.stock <= 0) {
            alert(`Stock-Out Alert: Cannot dispense ${med.name}. Stock is zero.`);
            return;
        }

        // FEFO Verification: Check if there's a batch of the same drug that expires sooner
        const soonestBatch = medicines
            .filter(m => m.name.toLowerCase() === med.name.toLowerCase() && m.stock > 0)
            .sort((a, b) => new Date(a.expiryDate || '9999-12-31') - new Date(b.expiryDate || '9999-12-31'))[0];

        if (soonestBatch && soonestBatch.id !== med.id) {
            const proceed = confirm(`FEFO WARNING: Batch ${soonestBatch.batchNumber} expires on ${soonestBatch.expiryDate}, which is SOONER than your selected batch (${med.expiryDate}).\n\nDo you still want to proceed with the selected batch?`);
            if (!proceed) return;
        }

        const existing = cart.find(c => c.medicineId === med.id);
        if (existing) {
            setCart(cart.map(c => c.medicineId === med.id ? { ...c, qty: Math.min(c.qty + 1, med.stock) } : c));
        } else {
            setCart([...cart, { 
                medicineId: med.id, 
                name: med.name, 
                unitPrice: med.mrp, 
                qty: 1, 
                maxStock: med.stock, 
                drugCode: med.drugCode,
                batchNumber: med.batchNumber,
                expiryDate: med.expiryDate
            }]);
        }
        setDrugSearch('');
        setDrugResults([]);
    };

    const handleBarcodeScan = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const scan = barcodeInput.trim();
            if (!scan) return;

            // FEFO Priority match: Find exact code/batch starting with nearest expiry
            const match = [...medicines]
                .sort((a, b) => new Date(a.expiryDate || '9999-12-31') - new Date(b.expiryDate || '9999-12-31'))
                .find(m => m.drugCode === scan || m.batchNumber === scan);

            if (match) {
                addToCart(match);
                setBarcodeInput('');
            } else {
                alert(`Unrecognized Barcode/Batch: ${scan}`);
                setBarcodeInput('');
            }
        }
    };

    const updateQty = (medicineId, delta) => {
        setCart(cart.map(c => {
            if (c.medicineId !== medicineId) return c;
            const newQty = c.qty + delta;
            if (newQty <= 0) return null;
            if (newQty > c.maxStock) return c;
            return { ...c, qty: newQty };
        }).filter(Boolean));
    };

    const removeFromCart = (medicineId) => {
        setCart(cart.filter(c => c.medicineId !== medicineId));
    };

    const subtotal = cart.reduce((s, c) => s + c.unitPrice * c.qty, 0);
    const discountAmt = subtotal * ((parseFloat(discount) || 0) / 100);
    const taxAmt = (subtotal - discountAmt) * 0.12;
    const netAmount = subtotal - discountAmt + taxAmt;

    const patientName = selectedPatient
        ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
        : walkInName;

    const handleCompleteSale = async () => {
        if (!patientName.trim()) return alert('Please select or enter a patient name.');
        if (cart.length === 0) return alert('Cart is empty. Add medicines first.');

        setLoading(true);
        try {
            const res = await fetch('/api/pharmacy/dispense', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientName: patientName.trim(),
                    patientUhId: selectedPatient?.patientCode || null,
                    patientId: selectedPatient?.id || null,
                    prescribedBy,
                    discount,
                    cartItems: cart.map(c => ({
                        medicineId: c.medicineId,
                        quantity: c.qty,
                        unitPrice: c.unitPrice,
                    }))
                })
            });

            if (res.ok) {
                const data = await res.json();
                alert(`✅ Sale completed! Bill: ${data.billCode}`);
                router.push('/pharmacy');
            } else {
                const err = await res.json();
                alert('Error: ' + (err.error || 'Sale failed'));
            }
        } catch (err) {
            alert('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/pharmacy" className="btn btn-secondary btn-sm" style={{ padding: '8px', border: 'none', background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Dispense Medicine</h1>
                        <p className="page-header__subtitle">Process prescriptions and manage point-of-sale inventory dispensing.</p>
                    </div>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }} onClick={() => setCart([])}>
                        <Trash2 size={14} /> Clear Cart
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={handleCompleteSale} disabled={loading}>
                        <Save size={15} strokeWidth={1.5} />
                        {loading ? 'Processing...' : 'Complete Sale & Bill'}
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px', paddingBottom: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Patient Link */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(56,189,248,0.1)', color: '#0EA5E9', padding: '6px', borderRadius: '8px' }}><Search size={18} /></div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Link Patient</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Registered Patient</label>
                                {selectedPatient ? (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{selectedPatient.firstName} {selectedPatient.lastName}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{selectedPatient.patientCode}</div>
                                        </div>
                                        <button onClick={() => setSelectedPatient(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={15} /></button>
                                    </div>
                                ) : (
                                    <>
                                        <input type="text" placeholder="Search UHID or Name..." value={searchPatient}
                                            onChange={e => setSearchPatient(e.target.value)}
                                            style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                                        {filteredPatients.length > 0 && (
                                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '8px', marginTop: '4px', zIndex: 10, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                                {filteredPatients.map(p => (
                                                    <div key={p.id} onClick={() => { setSelectedPatient(p); setSearchPatient(''); setWalkInName(''); }}
                                                        style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', fontSize: '14px' }}
                                                        onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                                                        onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                                                        <div style={{ fontWeight: 600 }}>{p.firstName} {p.lastName}</div>
                                                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{p.patientCode}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Walk-in Name (if unregistered)</label>
                                <input type="text" placeholder="e.g. Ramesh Kumar" value={walkInName}
                                    onChange={e => { setWalkInName(e.target.value); setSelectedPatient(null); }}
                                    disabled={!!selectedPatient}
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px', background: selectedPatient ? '#f8fafc' : '#fff' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Prescribed By (Doctor)</label>
                                <input type="text" placeholder="e.g. Dr. Raj Malhotra" value={prescribedBy}
                                    onChange={e => setPrescribedBy(e.target.value)}
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                            </div>
                        </div>
                    </div>

                    {/* Drug Search & Cart */}
                    <div className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                            <div style={{ background: 'rgba(236,72,153,0.1)', color: '#EC4899', padding: '6px', borderRadius: '8px' }}><Pill size={18} /></div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Add Drugs to Cart</h3>
                        </div>

                        {/* Barcode Scanner Input */}
                        <div style={{ marginBottom: '16px', position: 'relative' }}>
                            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 600, color: '#0EA5E9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <ScanLine size={14} /> Barcode Scanner (FEFO Auth)
                            </label>
                            <input type="text" placeholder="Scan Barcode or Batch No. and press Enter..."
                                value={barcodeInput}
                                onChange={e => setBarcodeInput(e.target.value)}
                                onKeyDown={handleBarcodeScan}
                                autoFocus
                                style={{ width: '100%', padding: '12px 16px', border: '2px solid #BAE6FD', borderRadius: '8px', outline: 'none', fontSize: '15px', background: '#F0F9FF', color: 'var(--color-navy)', fontWeight: 600, fontFamily: 'monospace' }} />
                        </div>

                        {/* Manual Search Fallback */}
                        <div style={{ position: 'relative', marginBottom: '20px' }}>
                            <input type="text" placeholder="Or search drug inventory manually by name..."
                                value={drugSearch} onChange={e => setDrugSearch(e.target.value)}
                                style={{ width: '100%', padding: '11px 16px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
                            {drugResults.length > 0 && (
                                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: '8px', marginTop: '4px', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.12)', maxHeight: '260px', overflowY: 'auto' }}>
                                    {drugResults.map(med => (
                                        <div key={med.id} onClick={() => addToCart(med)}
                                            style={{ padding: '11px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                            onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                                            onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{med.name}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{med.genericName || med.category} · Stock: {med.stock} · <span style={{ color: '#F59E0B' }}>Exp: {med.expiryDate}</span></div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 600, color: '#16A34A' }}>₹{med.mrp}</div>
                                                {med.stock <= 0 && <div style={{ fontSize: '11px', color: '#EF4444' }}>Out of stock</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length === 0 ? (
                            <div style={{ border: '1px dashed var(--color-border-light)', borderRadius: '8px', padding: '32px', textAlign: 'center', color: '#94A3B8' }}>
                                <ShoppingCart size={28} strokeWidth={1} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                                <p style={{ fontSize: '14px', margin: 0 }}>Search for a medicine above to add it to the cart.</p>
                            </div>
                        ) : (
                            <div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                    <thead>
                                        <tr style={{ background: '#F8FAFC', textAlign: 'left', fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                                            <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border-light)' }}>Medicine</th>
                                            <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border-light)' }}>Qty</th>
                                            <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border-light)' }}>Unit (₹)</th>
                                            <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border-light)' }}>Total (₹)</th>
                                            <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border-light)' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.map(item => (
                                            <tr key={item.medicineId} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                                                <td style={{ padding: '12px' }}>
                                                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{item.batchNumber} (Exp: {item.expiryDate})</div>
                                                </td>
                                                <td style={{ padding: '12px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <button onClick={() => updateQty(item.medicineId, -1)} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}><Minus size={12} /></button>
                                                        <span style={{ fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>{item.qty}</span>
                                                        <button onClick={() => updateQty(item.medicineId, 1)} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}><Plus size={12} /></button>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '12px' }}>₹{item.unitPrice.toFixed(2)}</td>
                                                <td style={{ padding: '12px', fontWeight: 600 }}>₹{(item.unitPrice * item.qty).toFixed(2)}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <button onClick={() => removeFromCart(item.medicineId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px' }}><Trash2 size={14} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Checkout Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ padding: '24px', background: '#FAFCFF', border: '1px solid #E2E8F0', position: 'sticky', top: '80px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                            <div style={{ background: 'rgba(22,163,74,0.1)', color: '#16A34A', padding: '6px', borderRadius: '8px' }}><ShoppingCart size={18} /></div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)', margin: 0 }}>Checkout Summary</h3>
                        </div>

                        {cart.length === 0 ? (
                            <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '13px', borderBottom: '1px dashed var(--color-border-light)', marginBottom: '16px' }}>
                                Cart is empty
                            </div>
                        ) : (
                            <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {cart.map(item => (
                                    <div key={item.medicineId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                        <span style={{ color: 'var(--color-text-secondary)' }}>{item.name} × {item.qty}</span>
                                        <span style={{ fontWeight: 600 }}>₹{(item.unitPrice * item.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                                <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                                <span>Discount %</span>
                                <input type="number" min="0" max="100" value={discount} onChange={e => setDiscount(e.target.value)}
                                    style={{ width: '70px', padding: '4px 8px', border: '1px solid var(--color-border-light)', borderRadius: '6px', fontSize: '13px', textAlign: 'right' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                                <span>GST (12%)</span><span>+₹{taxAmt.toFixed(2)}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--color-border-light)' }}>
                            <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>Net Amount</span>
                            <span style={{ fontSize: '20px', fontWeight: 700, color: '#16A34A' }}>₹{netAmount.toFixed(2)}</span>
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }}
                            onClick={handleCompleteSale} disabled={loading}>
                            {loading ? 'Processing...' : 'Complete Sale & Bill'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
