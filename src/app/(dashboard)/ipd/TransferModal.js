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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-slate-800 px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-white flex items-center gap-2"><ArrowRightLeft size={18} className="text-blue-400" /> Patient Internal Transfer</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xl">×</button>
                </div>

                <div className="p-6">
                    {/* Patient Context */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                {patient.patientName?.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-black text-slate-800 leading-none">{patient.patientName}</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Current: {patient.ward} • Bed {patient.bed}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleTransfer} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                <MapPin size={12}/> Select Target Ward
                            </label>
                            <select 
                                required
                                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-500 transition-all font-medium text-slate-700 bg-white"
                                value={selectedWardId}
                                onChange={(e) => {
                                    setSelectedWardId(e.target.value);
                                    setSelectedBedNumber('');
                                }}
                            >
                                <option value="">Select Ward...</option>
                                {wards.map(w => (
                                    <option key={w.id} value={w.id}>{w.name} ({w.floorWing || 'Main Wing'})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                <BedDouble size={12}/> Available Bed Allocation
                            </label>
                            <select 
                                required
                                disabled={!selectedWardId || loading}
                                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-500 transition-all font-medium text-slate-700 bg-white disabled:bg-slate-50"
                                value={selectedBedNumber}
                                onChange={(e) => setSelectedBedNumber(e.target.value)}
                            >
                                <option value="">{loading ? 'Refreshing status...' : 'Select Bed...'}</option>
                                {availableBeds.map(b => (
                                    <option key={b.id} value={b.bedNumber}>Bed {b.bedNumber} ({b.type})</option>
                                ))}
                                {!loading && selectedWardId && availableBeds.length === 0 && (
                                    <option disabled>NO VACANT BEDS IN THIS WARD</option>
                                )}
                            </select>
                            {selectedWardId && availableBeds.length === 0 && !loading && (
                                <p className="text-[10px] text-red-500 font-bold mt-1.5 flex items-center gap-1">
                                    <AlertCircle size={10}/> Ward is currently at full capacity.
                                </p>
                            )}
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-4">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="px-5 py-2.5 bg-slate-100 font-bold text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-xs"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={transferring || !selectedBedNumber}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 transition-all disabled:opacity-50 text-xs"
                            >
                                {transferring ? <RefreshCw size={14} className="animate-spin"/> : <ArrowRightLeft size={14}/>}
                                {transferring ? 'Executing Transfer...' : 'Commit Patient Transfer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
