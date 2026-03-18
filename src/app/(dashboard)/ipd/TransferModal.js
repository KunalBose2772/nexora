'use client';
import { useState, useEffect } from 'react';
import { RefreshCw, MapPin, BedDouble, AlertCircle, ArrowRightLeft } from 'lucide-react';

export default function TransferModal({ patient, isOpen, onClose, onTransferSuccess }) {
    const [wards, setWards] = useState([]);
    const [selectedWardId, setSelectedWardId] = useState('');
    const [selectedBedNumber, setSelectedBedNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [transferring, setTransferring] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchWards();
        }
    }, [isOpen]);

    const fetchWards = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/facility/wards');
            if (res.ok) {
                const data = await res.json();
                setWards(data.wards || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        if (!selectedWardId || !selectedBedNumber) return;

        setTransferring(true);
        try {
            const res = await fetch('/api/ipd/transfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    appointmentId: patient.id,
                    newWardId: selectedWardId,
                    newBedNumber: selectedBedNumber
                })
            });

            if (res.ok) {
                onTransferSuccess();
                onClose();
            } else {
                const data = await res.json();
                alert(data.error || 'Transfer failed');
            }
        } catch (e) {
            alert('An error occurred during transfer');
        } finally {
            setTransferring(false);
        }
    };

    if (!isOpen) return null;

    const selectedWard = wards.find(w => w.id === selectedWardId);
    const availableBeds = selectedWard?.beds?.filter(b => b.status === 'Vacant') || [];

    return (
        <div className="modal-overlay-executive">
            <style jsx>{`
                .modal-overlay-executive {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                }
                .modal-card-executive {
                    background: #fff;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 440px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    overflow: hidden;
                    animation: slideUp 0.2s ease-out;
                }
                .modal-header-executive {
                    padding: 14px 20px;
                    border-bottom: 1px solid #E2E8F0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #F8FAFC;
                }
                .modal-title-executive {
                    font-size: 15px;
                    font-weight: 600;
                    color: #0F172A;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .label-executive { 
                    display: block; 
                    font-size: 12px; 
                    font-weight: 500; 
                    color: #64748B; 
                    margin-bottom: 6px; 
                }
                .form-control-executive { 
                    width: 100%; 
                    border-radius: 6px; 
                    border: 1px solid #CBD5E1; 
                    padding: 8px 12px; 
                    font-size: 13px; 
                    font-weight: 400;
                    color: #0F172A;
                    outline: none; 
                    height: 38px;
                    background: #fff;
                }
                .btn-executive {
                    height: 36px;
                    padding: 0 16px;
                    font-size: 13px;
                    font-weight: 600;
                    border-radius: 6px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                }
                @keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>

            <div className="modal-card-executive">
                <div className="modal-header-executive">
                    <h3 className="modal-title-executive"><ArrowRightLeft size={16} className="text-blue-500" /> Internal Transfer</h3>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '20px' }}>×</button>
                </div>

                <div style={{ padding: '20px' }}>
                    <div style={{ background: '#F0F9FF', border: '1px solid #E0F2FE', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', background: '#3B82F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 600 }}>
                            {patient.patientName?.charAt(0)}
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1E3A8A' }}>{patient.patientName}</h4>
                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#60A5FA', fontWeight: 500 }}>{patient.ward} • Bed {patient.bed}</p>
                        </div>
                    </div>

                    <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label className="label-executive">Target Ward Allocation</label>
                            <select 
                                required
                                className="form-control-executive"
                                value={selectedWardId}
                                onChange={(e) => {
                                    setSelectedWardId(e.target.value);
                                    setSelectedBedNumber('');
                                }}
                            >
                                <option value="">Select Wing/Ward...</option>
                                {wards.map(w => (
                                    <option key={w.id} value={w.id}>{w.name} ({w.floorWing || 'Main Wing'})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label-executive">Available Bed Locator</label>
                            <select 
                                required
                                disabled={!selectedWardId || loading}
                                className="form-control-executive"
                                style={{ background: (!selectedWardId || loading) ? '#F8FAFC' : '#fff' }}
                                value={selectedBedNumber}
                                onChange={(e) => setSelectedBedNumber(e.target.value)}
                            >
                                <option value="">{loading ? 'Refreshing status...' : 'Select Bed...'}</option>
                                {availableBeds.map(b => (
                                    <option key={b.id} value={b.bedNumber}>Bed {b.bedNumber} ({b.type})</option>
                                ))}
                                {!loading && selectedWardId && availableBeds.length === 0 && (
                                    <option disabled>NO VACANT BEDS</option>
                                )}
                            </select>
                            {selectedWardId && availableBeds.length === 0 && !loading && (
                                <p style={{ fontSize: '10px', color: '#EF4444', fontWeight: 500, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <AlertCircle size={12}/> Ward is currently at full capacity.
                                </p>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="btn-executive"
                                style={{ flex: 1, background: '#fff', border: '1px solid #E2E8F0', color: '#64748B' }}
                            >
                                Dismiss
                            </button>
                            <button 
                                type="submit" 
                                disabled={transferring || !selectedBedNumber}
                                className="btn-executive"
                                style={{ flex: 1.5, background: '#3B82F6', color: '#fff' }}
                            >
                                {transferring ? <RefreshCw size={14} className="animate-spin"/> : <ArrowRightLeft size={14}/>}
                                {transferring ? 'Processing...' : 'Commit Transfer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
