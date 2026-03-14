'use client';
import React from 'react';

export default function AdvanceReceipt({ advance, tenant }) {
    if (!advance) return null;

    const hospitalName = tenant?.name || 'NEXORA HEALTH';
    const hospitalPhone = tenant?.phone || '+(91) 800-NEXORA';
    const hospitalAddress = tenant?.address || '123 Health Avenue, MedCity';

    return (
        <div style={{ width: '80mm', padding: '10px', background: '#fff', color: '#000', fontFamily: "'Courier New', Courier, monospace", fontSize: '13px', lineHeight: '1.4' }}>
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '18px', textTransform: 'uppercase' }}>{hospitalName}</div>
                <div style={{ fontSize: '11px' }}>{hospitalAddress}</div>
                <div style={{ fontSize: '11px' }}>Ph: {hospitalPhone}</div>
                <div style={{ borderBottom: '1px dashed #000', margin: '10px 0' }}></div>
                <div style={{ fontWeight: 'bold', fontSize: '15px' }}>ADVANCE DEPOSIT RECEIPT</div>
                <div style={{ fontSize: '11px' }}>{advance.receiptCode}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4px', marginBottom: '10px' }}>
                <span>Date:</span> <span style={{ textAlign: 'right' }}>{new Date(advance.createdAt).toLocaleString()}</span>
                <span>Patient:</span> <span style={{ textAlign: 'right' }}>{advance.patient?.firstName} {advance.patient?.lastName}</span>
                <span>UHID:</span> <span style={{ textAlign: 'right' }}>{advance.patient?.patientCode}</span>
            </div>

            <div style={{ borderBottom: '1px dashed #000', margin: '10px 0' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
                <span>AMOUNT:</span>
                <span>₹{advance.amount.toLocaleString()}</span>
            </div>
            
            <div style={{ marginTop: '10px', fontSize: '11px' }}>
                <span>Payment Mode: {advance.paymentMethod}</span>
            </div>

            {advance.notes && (
                <div style={{ fontSize: '11px', marginTop: '6px' }}>
                    Notes: {advance.notes}
                </div>
            )}

            <div style={{ borderBottom: '1px dashed #000', margin: '10px 0' }}></div>

            <div style={{ textAlign: 'center', fontSize: '10px', marginTop: '10px' }}>
                This is an advance payment only.<br />
                Final billing will be adjusted at discharge.
                <div style={{ marginTop: '15px', borderTop: '1px solid #000', width: '100px', margin: '15px auto 0' }}></div>
                Authorized Signatory
            </div>
        </div>
    );
}
