'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Search, FileText, User, UserCheck, Trash2, Printer, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PrescriptionApprovalsPage() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approving, setApproving] = useState(null);
    const [search, setSearch] = useState('');
    const [tenant, setTenant] = useState(null);

    const fetchPending = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/prescriptions');
            if (res.ok) {
                const data = await res.json();
                // Only show those awaiting approval or drafts
                setPrescriptions((data.prescriptions || []).filter(rx => rx.validationStatus !== 'Signed'));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchPending(); 
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.settings) setTenant(data.settings);
            })
            .catch(() => { });
    }, []);

    const handleApprove = async (id) => {
        setApproving(id);
        try {
            const res = await fetch('/api/prescriptions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, validationStatus: 'Signed' })
            });

            if (res.ok) {
                setPrescriptions(prev => prev.filter(rx => rx.id !== id));
                alert('Prescription Signed & Sent to Pharmacy!');
            } else {
                alert('Approval failed. Only doctors can sign prescriptions.');
            }
        } catch (e) {
            alert('Network error during signature.');
        } finally {
            setApproving(null);
        }
    };
    
    const printRx = (rx) => {
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Rx ${rx.rxCode}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;color:#1a2336;padding:40px;max-width:800px;margin:0 auto}
.header{display:flex;justify-content:space-between;align-items:start;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #0f3460}
.header-left{flex:1}
.header-right{text-align:right;flex:1}
.rx-symbol{font-size:42px;font-weight:900;color:#0f3460;line-height:1;margin-bottom:4px}
.doctor-name{font-size:24px;font-weight:800;color:#0f3460;margin-bottom:4px}
.dept-name{font-size:13px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
.h-name{font-size:18px;font-weight:900;color:#1e293b;text-transform:uppercase;margin-bottom:6px}
.h-info{font-size:11px;color:#64748b;line-height:1.5;max-width:280px;margin-left:auto}
.logo{width:60px;height:60px;object-fit:contain;margin-bottom:10px}
.logo-placeholder{width:60px;height:60px;background:#0f172a;color:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-left:auto;margin-bottom:10px}
.section{margin-bottom:24px}.section-title{font-size:11px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;border-bottom:1.5px solid #f1f5f9;padding-bottom:6px}
.row{display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px}.label{color:#64748b}.value{font-weight:700;color:#1a2336}
table{width:100%;border-collapse:collapse;margin-top:12px}th{background:#f8fafc;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;padding:10px 14px;text-align:left;border:1.5px solid #e2e8f0}td{padding:10px 14px;font-size:14px;border:1.5px solid #e2e8f0;vertical-align:top}
.footer{text-align:center;margin-top:48px;padding-top:24px;border-top:1px dashed #cbd5e1;font-size:12px;color:#94a3b8}
.sign-box{margin-top:60px;text-align:right}.sign-line{display:inline-block;width:220px;border-top:2px solid #0f172a;padding-top:8px;font-size:13px;color:#0f172a;font-weight:800}
@media print{body{padding:0}.no-print{display:none}}
</style></head><body>
<div class="header">
    <div class="header-left">
        <div class="rx-symbol">℞</div>
        <div class="doctor-name">Dr. ${rx.doctorName}</div>
        <div class="dept-name">OPD Consultation • ${rx.rxCode}</div>
    </div>
    <div class="header-right">
        ${tenant?.logoUrl ? `<img src="${tenant.logoUrl}" class="logo" alt="Logo" />` : `<div class="logo-placeholder"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg></div>`}
        <div class="h-name">${tenant?.name || 'Nexora Health Systems'}</div>
        <div class="h-info">
            ${tenant?.address || 'Hospital Address Configuration Pending'}<br>
            Phone: ${tenant?.phone || 'N/A'}<br>
            Web: ${typeof window !== 'undefined' ? `${window.location.host}${tenant?.slug ? '/' + tenant.slug : ''}` : 'www.nexora.com'}
        </div>
    </div>
</div>
<div class="section"><div class="section-title">Patient Details</div>
<div class="row"><span class="label">Patient</span><span class="value">${rx.patientName}</span></div>
${rx.patientUhId ? `<div class="row"><span class="label">UHID</span><span class="value">${rx.patientUhId}</span></div>` : ''}
<div class="row"><span class="label">Date</span><span class="value">${new Date(rx.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
</div>
${rx.chiefComplaint ? `<div class="section"><div class="section-title">Chief Complaint</div><p style="font-size:13px;color:#334155">${rx.chiefComplaint}</p></div>` : ''}
${rx.diagnosis ? `<div class="section"><div class="section-title">Diagnosis</div><p style="font-size:14px;font-weight:700;color:#0f3460">${rx.diagnosis}</p></div>` : ''}
${rx.items?.length > 0 ? `
<div class="section"><div class="section-title">Prescription</div>
<table><thead><tr><th>#</th><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Qty</th></tr></thead>
<tbody>${rx.items.map((item, i) => `<tr><td>${i + 1}</td><td><strong>${item.medicineName}</strong></td><td>${item.dosage || '—'}</td><td>${item.frequency}</td><td>${item.duration}</td><td>${item.quantity}</td></tr>`).join('')}</tbody>
</table></div>` : ''}
<div class="sign-box"><div class="sign-line">Dr. ${rx.doctorName}<br><span style="font-weight:400">Signature & Stamp</span></div></div>
<div class="footer"><p>This is a computer-generated prescription preview from Nexora Health.</p></div>
<script>window.onload=()=>{window.print()}<\/script></body></html>`;
        const win = window.open('', '_blank', 'width=720,height=900');
        win.document.write(html);
        win.document.close();
    };

    const filtered = prescriptions.filter(rx => 
        rx.patientName.toLowerCase().includes(search.toLowerCase()) || 
        rx.rxCode.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title">Clinical Governance: Review & Sign</h1>
                    <p className="page-header__subtitle">Review draft prescriptions and discharge orders before physical dispensation.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                        <input 
                            type="text" 
                            placeholder="Search by Rx Code or Patient..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ padding: '8px 12px 8px 34px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', width: '250px' }} 
                        />
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                {loading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>Loading pending items...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '80px', textAlign: 'center', color: '#94A3B8' }}>
                        <CheckCircle size={48} strokeWidth={1} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-navy)', margin: '0 0 8px 0' }}>All Clear!</h3>
                        <p style={{ fontSize: '14px' }}>No prescriptions are currently awaiting your signature.</p>
                    </div>
                ) : (
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead style={{ background: '#F8FAFC' }}>
                                <tr>
                                    <th>Rx Record</th>
                                    <th>Patient & Origin</th>
                                    <th>Diagnoses / Notes</th>
                                    <th>Prescribed Items</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(rx => (
                                    <tr key={rx.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', padding: '10px', borderRadius: '8px' }}><FileText size={18} /></div>
                                                <div>
                                                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)', fontFamily: 'monospace' }}>{rx.rxCode}</div>
                                                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>Created: {new Date(rx.createdAt).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '14px', fontWeight: 600 }}>{rx.patientName}</div>
                                            <div style={{ fontSize: '12px', color: '#64748B' }}>By: Dr. {rx.doctorName}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{rx.diagnosis || 'General Consult'}</div>
                                            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>{rx.chiefComplaint || 'No complaints logged.'}</div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                {rx.items?.map((item, i) => (
                                                    <span key={i} style={{ background: '#F1F5F9', color: '#475569', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>{item.medicineName}</span>
                                                ))}
                                                {rx.items?.length === 0 && <span style={{ color: '#94A3B8', fontSize: '11px' }}>Advice Only</span>}
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button className="btn btn-secondary btn-sm" style={{ padding: '6px' }} title="Preview Rx" onClick={() => printRx(rx)}><Printer size={14} /></button>
                                                <button 
                                                    className="btn btn-primary btn-sm" 
                                                    style={{ padding: '6px 12px', background: '#059669', borderColor: '#059669' }}
                                                    onClick={() => handleApprove(rx.id)}
                                                    disabled={approving === rx.id}
                                                >
                                                    {approving === rx.id ? <Loader2 size={12} className="animate-spin" /> : <UserCheck size={14} />}
                                                    Sign & Approve
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '24px', background: '#FFFBEB', border: '1px solid #FDE68A', padding: '16px', borderRadius: '12px', display: 'flex', gap: '12px' }}>
                <Clock size={20} color="#D97706" />
                <p style={{ fontSize: '13px', color: '#92400E', margin: 0 }}>
                    <strong>Audit Trace Active:</strong> Approving a prescription locks it for editing and instantly creates a "Pending Dispensation" request in the Pharmacy Inventory module. Your Digital ID will be attached to the final printed slip.
                </p>
            </div>
        </div>
    );
}
