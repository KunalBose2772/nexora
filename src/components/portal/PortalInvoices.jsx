'use client';
import { useState } from 'react';
import { Receipt, X, IndianRupee, CreditCard, Loader2 } from 'lucide-react';
import PrintWrapper from '@/components/print/PrintWrapper';
import Script from 'next/script';

export default function PortalInvoices({ invoices }) {
    const [printInvoice, setPrintInvoice] = useState(null);
    const [payingId, setPayingId] = useState(null);

    const handlePayment = async (inv) => {
        setPayingId(inv.id);
        try {
            const res = await fetch('/api/payments/razorpay/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: inv.netAmount, invoiceId: inv.id })
            });
            
            if (!res.ok) throw new Error('Failed to create order');
            const order = await res.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Nexora Health",
                description: `Bill Payment: ${inv.invoiceCode}`,
                order_id: order.id,
                handler: async function (response) {
                    const verifyRes = await fetch('/api/payments/razorpay/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...response,
                            invoiceId: inv.id
                        })
                    });
                    const result = await verifyRes.json();
                    if (result.ok) {
                        alert("✅ Payment Successful! Your invoice status has been updated.");
                        window.location.reload();
                    } else {
                        alert("❌ Verification Failed. Please contact support.");
                    }
                },
                prefill: {
                    name: inv.patientName,
                },
                theme: {
                    color: "#2563EB",
                },
                modal: {
                    ondismiss: function() {
                        setPayingId(null);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            alert("Could not initialize payment. Please try again later.");
            setPayingId(null);
        }
    };

    return (
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                <div style={{ background: '#F0FDF4', padding: '12px', borderRadius: '14px', color: '#15803D' }}><IndianRupee size={22} /></div>
                <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#0F172A' }}>Billing Snapshot</h2>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748B', fontWeight: 600 }}>TREATMENT INVOICES</p>
                </div>
            </div>

            {invoices.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', border: '2px dashed #F1F5F9', borderRadius: '16px' }}>
                    <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0, fontWeight: 500 }}>No financial records found.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {invoices.map(inv => (
                        <div key={inv.id} className="interactive-row" style={{ padding: '20px', border: '1px solid #F1F5F9', borderRadius: '20px', background: '#F8FAFC' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{inv.invoiceCode}</div>
                                    <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>{new Date(inv.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                </div>
                                <span style={{ fontSize: '10px', background: inv.status === 'Paid' ? '#F0FDF4' : '#FFF7ED', color: inv.status === 'Paid' ? '#10B981' : '#F59E0B', fontWeight: 900, padding: '4px 10px', borderRadius: '8px', textTransform: 'uppercase' }}>{inv.status}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>₹{inv.netAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {inv.status !== 'Paid' && (
                                        <button
                                            onClick={() => handlePayment(inv)}
                                            disabled={payingId === inv.id}
                                            style={{ 
                                                padding: '10px 20px', 
                                                fontSize: '13px', 
                                                fontWeight: 800, 
                                                display: 'flex', 
                                                gap: '8px', 
                                                alignItems: 'center', 
                                                background: '#0F172A', 
                                                color: '#fff', 
                                                border: 'none', 
                                                borderRadius: '12px', 
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)'
                                            }}
                                        >
                                            {payingId === inv.id ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />} 
                                            Checkout
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setPrintInvoice(inv)}
                                        style={{ 
                                            padding: '10px 20px', 
                                            fontSize: '13px', 
                                            fontWeight: 800, 
                                            display: 'flex', 
                                            gap: '8px', 
                                            alignItems: 'center', 
                                            background: '#fff', 
                                            color: '#0F172A', 
                                            border: '1px solid #E2E8F0', 
                                            borderRadius: '12px', 
                                            cursor: 'pointer' 
                                        }}
                                    >
                                        <Receipt size={16} /> Receipt
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Print Modal embedded in the Portal */}
            {printInvoice && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '800px', maxHeight: '95vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={() => setPrintInvoice(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '50%', padding: '6px', cursor: 'pointer', zIndex: 50, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}><X size={18} /></button>

                        {/* Universal Print Wrapper powering the Patient end */}
                        <PrintWrapper documentTitle={`Receipt_${printInvoice.invoiceCode}`}>
                            <div className="p-10 font-sans text-slate-800">
                                {/* Header */}
                                <div className="text-center border-b-2 border-slate-800 pb-6 mb-8">
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter">NEXORA HEALTH</h1>
                                    <p className="text-sm text-slate-500 mt-1">123 Health Avenue, MedCity • Ph: +1 800-NEXORA</p>
                                    <div className="mt-4 uppercase tracking-widest text-sm font-bold bg-slate-100 inline-block px-4 py-1 rounded border border-slate-200">Official Payment Receipt</div>
                                </div>

                                {/* Meta Info */}
                                <div className="flex justify-between items-start mb-8 text-sm">
                                    <div>
                                        <div className="text-slate-500 font-semibold mb-1 uppercase tracking-wide text-xs">Patient Details</div>
                                        <div className="font-bold text-lg text-slate-800">{printInvoice.patientName}</div>
                                        {printInvoice.patientUhId && <div className="text-slate-600">UHID: {printInvoice.patientUhId}</div>}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-slate-500 font-semibold mb-1 uppercase tracking-wide text-xs">Invoice details</div>
                                        <div className="font-mono font-bold text-slate-800">{printInvoice.invoiceCode}</div>
                                        <div className="text-slate-600">{new Date(printInvoice.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                                        <div className={`mt-2 inline-block px-3 py-1 text-xs font-bold rounded-full ${printInvoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            STATUS: {printInvoice.status.toUpperCase()}
                                        </div>
                                    </div>
                                </div>

                                {/* Bill Summary */}
                                <div className="mb-12">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 border-y border-slate-300">
                                            <tr>
                                                <th className="text-left font-semibold text-slate-600 py-3 px-4">Service Description</th>
                                                <th className="text-right font-semibold text-slate-600 py-3 px-4">Mode</th>
                                                <th className="text-right font-semibold text-slate-600 py-3 px-4">Amount (₹)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr>
                                                <td className="py-4 px-4 font-medium">{printInvoice.serviceType}</td>
                                                <td className="text-right py-4 px-4 text-slate-600">{printInvoice.paymentMethod}</td>
                                                <td className="text-right py-4 px-4 font-medium">{printInvoice.amount.toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                        <tfoot className="border-t-2 border-slate-800">
                                            {printInvoice.discount > 0 && (
                                                <tr>
                                                    <td colSpan={2} className="text-right py-2 px-4 text-slate-500">Discount ({printInvoice.discount}%)</td>
                                                    <td className="text-right py-2 px-4 text-red-500 font-medium">-{(printInvoice.amount * (printInvoice.discount / 100)).toFixed(2)}</td>
                                                </tr>
                                            )}
                                            <tr>
                                                <td colSpan={2} className="text-right py-2 px-4 text-slate-500">Taxes (5% GST)</td>
                                                <td className="text-right py-2 px-4 font-medium">+{printInvoice.tax.toFixed(2)}</td>
                                            </tr>
                                            <tr className="bg-emerald-50">
                                                <td colSpan={2} className="text-right py-3 px-4 font-bold text-slate-800 text-base border-t border-emerald-200">Net Amount Settled</td>
                                                <td className="text-right py-3 px-4 font-bold text-emerald-700 text-xl border-t border-emerald-200">₹{printInvoice.netAmount.toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                {/* Signatures */}
                                <div className="mt-24 pt-8 grid grid-cols-2 gap-8 text-center text-sm">
                                    <div>
                                        <div className="border-b border-slate-300 w-48 mx-auto mb-2"></div>
                                        <div className="font-semibold text-slate-500">Patient/Attendant Signature</div>
                                    </div>
                                    <div>
                                        <div className="font-mono text-xs text-slate-400 mb-6">Patient Portal Access ({printInvoice.patientName})</div>
                                        <div className="border-b border-slate-300 w-48 mx-auto mb-2"></div>
                                        <div className="font-semibold text-slate-500">Electronic Verification</div>
                                    </div>
                                </div>
                                <div className="text-center mt-12 text-xs text-slate-400 italic">This is an automated copy fetched from Nexora Cloud Servers. No handwritten signature required.</div>
                            </div>
                        </PrintWrapper>
                    </div>
                </div>
            )}
        </div>
    );
}
