'use client';
import React from 'react';
import PrintWrapper from './PrintWrapper';
import PrintHeader from './PrintHeader';
import PrintFooter from './PrintFooter';

/**
 * PurchaseOrderSlip Component
 * Official A4 Document for Pharmacy Procurement.
 */
export default function PurchaseOrderSlip({ po }) {
    if (!po) return null;

    const totalQty = po.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <PrintWrapper documentTitle={`PO_${po.poNumber}`}>
            <div className="p-12 font-sans text-slate-800 bg-white min-h-[297mm] flex flex-col">
                {/* Standardized Header */}
                <PrintHeader title="Purchase Order" subtitle={po.poNumber} />

                {/* Vendor & Delivery Info */}
                <div className="grid grid-cols-2 gap-12 mb-10 text-sm">
                    <div>
                        <div className="text-slate-500 font-black mb-3 uppercase tracking-widest text-[10px]">Vendor Information</div>
                        <div className="p-4 border-l-4 border-slate-900 bg-slate-50">
                            <div className="font-bold text-lg text-slate-900 uppercase">{po.supplier?.name}</div>
                            <div className="text-slate-600 mt-1">{po.supplier?.contactPerson || 'Sales Department'}</div>
                            <div className="text-slate-600 font-medium">{po.supplier?.phone}</div>
                            <div className="text-slate-600">{po.supplier?.email}</div>
                            <div className="text-slate-400 mt-2 font-mono text-xs uppercase">GSTIN: {po.supplier?.gstNumber || 'UNREGISTERED'}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-slate-500 font-black mb-3 uppercase tracking-widest text-[10px]">Ship To / Billing</div>
                        <div className="p-4 border-r-4 border-emerald-500 bg-emerald-50 inline-block w-full">
                            <div className="font-bold text-slate-800">CENTRAL PHARMACY STORE</div>
                            <div className="text-slate-600">Nexora Health - Main Branch</div>
                            <div className="text-slate-600">Inventory & Logistics Dept.</div>
                            <div className="text-slate-400 mt-2 font-bold uppercase text-[10px]">PO Date: {new Date(po.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-slate-900 text-white">
                            <tr>
                                <th className="text-left font-black py-4 px-6 rounded-tl-xl uppercase tracking-wider">#</th>
                                <th className="text-left font-black py-4 px-6 uppercase tracking-wider">Item Description</th>
                                <th className="text-center font-black py-4 px-6 uppercase tracking-wider">Qty Req.</th>
                                <th className="text-right font-black py-4 px-6 uppercase tracking-wider">Unit Price (₹)</th>
                                <th className="text-right font-black py-4 px-6 rounded-tr-xl uppercase tracking-wider">Total (₹)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 border-x border-slate-100">
                            {po.items?.map((item, idx) => (
                                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                    <td className="py-4 px-6 font-bold text-slate-400">{idx + 1}</td>
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-slate-800">{item.medicine?.name}</div>
                                        <div className="text-[10px] text-slate-400 uppercase font-black">{item.medicine?.drugCode}</div>
                                    </td>
                                    <td className="py-4 px-6 text-center font-bold">{item.quantity} units</td>
                                    <td className="py-4 px-6 text-right text-slate-600">₹ {item.unitPrice.toLocaleString()}</td>
                                    <td className="py-4 px-6 text-right font-bold text-slate-900">₹ {item.totalPrice.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-slate-900 text-white">
                                <td colSpan={3} className="py-6 px-6 rounded-bl-xl">
                                    <div className="text-[10px] font-black uppercase opacity-60">Total Quantity</div>
                                    <div className="text-lg font-bold">{totalQty} Items</div>
                                </td>
                                <td colSpan={2} className="py-6 px-6 text-right rounded-br-xl">
                                    <div className="text-[10px] font-black uppercase opacity-60">Order Total Amount</div>
                                    <div className="text-2xl font-black italic tracking-tighter">₹ {po.totalAmount.toLocaleString()}</div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Terms & Conditions */}
                    <div className="mt-12 grid grid-cols-2 gap-8">
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Special Instructions</div>
                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 italic leading-relaxed">
                                {po.notes || 'Default Delivery: Within 48 hours of PO issuance. All items must have at least 18 months shelf life from date of receipt.'}
                            </div>
                        </div>
                        <div className="flex flex-col items-end justify-end pt-12">
                             <div className="w-48 border-t-2 border-slate-900 text-center pt-2">
                                <div className="font-black uppercase text-[10px] tracking-widest">Authorized Signatory</div>
                                <div className="text-[9px] text-slate-400 mt-1">Pharmacy Procurement Head</div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Standardized Footer */}
                <PrintFooter systemId={po.id} />
                <div className="text-center mt-8 text-[9px] text-slate-400 italic">This is a system-generated Purchase Order. Physical signature not required for digital transmission.</div>
            </div>
        </PrintWrapper>
    );
}
