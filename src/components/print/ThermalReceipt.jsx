'use client';
import React, { useEffect, useState } from 'react';
import PrintWrapper from './PrintWrapper';

/**
 * ThermalReceipt Component
 * Ultra-fast receipt template for 80mm front-desk printers.
 */
export default function ThermalReceipt({ invoice }) {
    const [tenant, setTenant] = useState(null);

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => { if (data.tenant) setTenant(data.tenant); })
            .catch(err => console.error('Failed to load branding:', err));
    }, []);

    if (!invoice) return null;

    const hospitalName = tenant?.name || 'NEXORA HEALTH';
    const hospitalPhone = tenant?.phone || '800-NEXORA';
    const hospitalAddress = tenant?.address || 'City Center, Med-Zone';

    return (
        <PrintWrapper documentTitle={`Receipt_${invoice.invoiceCode}`}>
            <div className="thermal-slip p-4 font-mono text-black bg-white w-[80mm] mx-auto text-center border border-dashed border-gray-300">
                {/* Minimalist Centered Header */}
                <div className="mb-4">
                    <h1 className="text-xl font-black uppercase tracking-tighter leading-tight border-b-2 border-black pb-2">{hospitalName}</h1>
                    <p className="text-[9px] font-bold mt-1">{hospitalAddress}</p>
                    <p className="text-[9px] font-bold">PH: {hospitalPhone}</p>
                    <div className="border-b border-black my-2"></div>
                    <p className="text-sm font-black uppercase tracking-widest bg-black text-white px-2 py-0.5 inline-block">Payment Receipt</p>
                </div>

                {/* Patient / Meta Info */}
                <div className="text-left space-y-1 mb-4 border-b border-black pb-2">
                    <div className="flex justify-between text-[11px]">
                        <span className="font-bold">RECEIPT #:</span>
                        <span>{invoice.invoiceCode}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                        <span className="font-bold">DATE:</span>
                        <span>{new Date(invoice.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                        <span className="font-bold">PATIENT:</span>
                        <span className="font-black text-right">{invoice.patientName.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                        <span className="font-bold">UHID:</span>
                        <span>{invoice.patientUhId || 'WALK-IN'}</span>
                    </div>
                </div>

                {/* Items / Service */}
                <div className="text-left text-[11px] mb-4">
                    <div className="flex justify-between font-bold border-b border-black pb-1 mb-2">
                        <span>DESCRIPTION</span>
                        <span>NET AMT</span>
                    </div>
                    <div className="flex justify-between py-1">
                        <span className="max-w-[150px]">{invoice.serviceType.toUpperCase()}</span>
                        <span className="font-bold">₹{invoice.amount.toFixed(2)}</span>
                    </div>
                    {invoice.discount > 0 && (
                        <div className="flex justify-between text-[10px] italic">
                            <span>LESS: DISCOUNT ({invoice.discount}%)</span>
                            <span>-₹{(invoice.amount * (invoice.discount / 100)).toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-[10px]">
                        <span>ADD: TAX (GST 5%)</span>
                        <span>+₹{invoice.tax.toFixed(2)}</span>
                    </div>
                </div>

                {/* Final Total */}
                <div className="border-y-2 border-black py-3 mb-6">
                    <div className="flex justify-between items-center px-2">
                        <span className="text-xs font-black uppercase">Grand Total:</span>
                        <span className="text-2xl font-black italic tracking-tighter leading-none">₹{invoice.netAmount.toFixed(0)}</span>
                    </div>
                    <div className="text-[9px] mt-1 text-right italic font-bold">Paid via {invoice.paymentMethod.toUpperCase()}</div>
                </div>

                {/* Instructions / QR */}
                <div className="text-[10px] leading-tight text-center">
                    <p className="font-bold mb-1 italic tracking-widest">THANK YOU FOR VISITING!</p>
                    <p className="text-[8px] opacity-70">This is a valid tax receipt if GSTIN is registered.</p>
                </div>

                {/* Thermal Mock QR */}
                <div className="mt-4 flex justify-center">
                    <div className="w-16 h-16 bg-black p-0.5">
                        <div className="w-full h-full bg-black border border-white flex flex-wrap content-start">
                             {[...Array(64)].map((_, i) => (
                                <div key={i} className={`w-1/8 h-1/8 ${Math.random() > 0.5 ? 'bg-white' : 'bg-black'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-2 border-t border-dotted border-black text-[7px] text-gray-500 uppercase tracking-widest text-center">
                    Auto-Generated • {new Date().toLocaleTimeString()}
                </div>

                <style jsx>{`
                    @media print {
                        .thermal-slip {
                            width: 80mm !important;
                            border: none !important;
                            padding: 10px !important;
                            margin: 0 !important;
                        }
                    }
                    .w-1\/8 { width: 12.5%; }
                    .h-1\/8 { height: 12.5%; }
                `}</style>
            </div>
        </PrintWrapper>
    );
}
