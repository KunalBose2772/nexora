'use client';
import React from 'react';

/**
 * PrintFooter Component
 * Standardized footer for all printable documents.
 * Includes signatures, system ID, and date.
 */
export default function PrintFooter({ systemId, doctorName, signatoryRole }) {
    const [tenant, setTenant] = React.useState(null);

    React.useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => { if (data.tenant) setTenant(data.tenant); })
            .catch(err => console.error(err));
    }, []);

    const today = new Date().toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="mt-auto pt-10 border-t border-slate-200 flex justify-between items-end text-sm">
            <div className="max-w-[200px]">
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center p-1 mb-2 opacity-30">
                    <div className="w-full h-full border-2 border-slate-300 rounded overflow-hidden flex flex-wrap">
                        {[...Array(16)].map((_, i) => (
                            <div key={i} className={`w-1/4 h-1/4 ${Math.random() > 0.5 ? 'bg-slate-300' : 'bg-transparent'}`}></div>
                        ))}
                    </div>
                </div>
                <div className="text-[10px] italic text-slate-500 mb-2">
                    {tenant?.printTerms || "Thank you for choosing Nexora."}
                </div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                    Security Hash: Verified Digital Record
                    {systemId && <div>Record ID: {systemId.slice(-8)}</div>}
                    <div>Date: {today}</div>
                </div>
            </div>

            <div className="text-center">
                {doctorName && (
                    <>
                        <div className="font-black text-slate-800 text-lg border-b-2 border-slate-800 pb-1 mb-1 italic">
                            Dr. {doctorName}
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            {signatoryRole}
                        </div>
                    </>
                )}
                {!doctorName && (
                    <>
                         <div className="border-b-2 border-slate-800 w-48 mb-1"></div>
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            {signatoryRole || tenant?.footerSignature || "Authorized Signatory"}
                         </div>
                    </>
                )}
            </div>
        </div>
    );
}
