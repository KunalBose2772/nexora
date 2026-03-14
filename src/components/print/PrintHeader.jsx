'use client';
import React, { useEffect, useState } from 'react';

/**
 * PrintHeader Component
 * A standardized header for all printable documents (Invoices, Rx, etc.)
 * Dynamically fetches and displays tenant branding.
 */
export default function PrintHeader({ title, subtitle, showQr = true }) {
    const [tenant, setTenant] = useState(null);

    useEffect(() => {
        // Fetch current tenant branding
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.tenant) setTenant(data.tenant);
            })
            .catch(err => console.error('Failed to load branding:', err));
    }, []);

    // Fallback while loading or if fetch fails
    const hospitalName = tenant?.name || 'NEXORA HEALTH';
    const hospitalTagline = tenant?.tagline || 'Multi-Specialty Medical Center';
    const hospitalAddress = tenant?.address || '123 Health Avenue, MedCity';
    const hospitalPhone = tenant?.phone || '+(91) 800-NEXORA';
    const logoUrl = tenant?.logoUrl;
    const logoInitials = tenant?.logoInitials || 'NX';

    return (
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
            <div className="flex gap-4 items-center">
                {logoUrl ? (
                    <img
                        src={logoUrl}
                        alt={hospitalName}
                        className="w-16 h-16 object-contain"
                        onError={(e) => { e.target.src = ''; e.target.hidden = true; }} // Fallback if image fails
                    />
                ) : (
                    <div className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center font-black text-2xl rounded">
                        {logoInitials}
                    </div>
                )}
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{hospitalName}</h1>
                    <p className="text-sm text-slate-500 font-medium">{hospitalTagline}</p>
                    <p className="text-xs text-slate-400 mt-1">{hospitalAddress} • {hospitalPhone}</p>
                    {(tenant?.gstNumber || tenant?.hfrNumber) && (
                        <div className="flex gap-4 mt-1">
                            {tenant.gstNumber && <span className="text-[10px] font-bold text-slate-400 uppercase">GSTIN: {tenant.gstNumber}</span>}
                            {tenant.hfrNumber && <span className="text-[10px] font-bold text-slate-400 uppercase">HFR: {tenant.hfrNumber}</span>}
                        </div>
                    )}
                </div>
            </div>

            <div className="text-right">
                {title && (
                    <div className="bg-slate-900 text-white px-3 py-1 font-black text-xl italic tracking-tighter uppercase mb-2">
                        {title}
                    </div>
                )}
                {subtitle && (
                    <div className="uppercase tracking-[0.2em] text-[10px] font-black text-slate-400">
                        {subtitle}
                    </div>
                )}

                {/* Optional QR Code Mock */}
                {showQr && (
                    <div className="mt-4 flex justify-end">
                        <div className="p-1 border border-slate-200 rounded-lg">
                             <div className="w-12 h-12 bg-slate-900 flex items-center justify-center p-0.5">
                                <div className="w-full h-full bg-slate-900 border-2 border-white flex flex-wrap content-start">
                                    {[...Array(16)].map((_, i) => (
                                        <div key={i} className={`w-1/4 h-1/4 ${Math.random() > 0.4 ? 'bg-white' : 'bg-slate-900'}`}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
