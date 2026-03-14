'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Settings, Archive } from 'lucide-react';

export default function FacilitySettings() {
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newWardName, setNewWardName] = useState('');
    const [newFloorWing, setNewFloorWing] = useState('');
    const [addingWard, setAddingWard] = useState(false);

    // Bed addition modal/form states
    const [activeWardId, setActiveWardId] = useState(null);
    const [bedPrefix, setBedPrefix] = useState('');
    const [bedStartNum, setBedStartNum] = useState(1);
    const [bedCount, setBedCount] = useState(5);
    const [addingBeds, setAddingBeds] = useState(false);

    useEffect(() => {
        fetchWards();
    }, []);

    const fetchWards = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/facility/wards');
            if (res.ok) {
                const data = await res.json();
                setWards(data.wards || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddWard = async (e) => {
        e.preventDefault();
        if (!newWardName.trim()) return;

        try {
            const res = await fetch('/api/facility/wards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newWardName,
                    floorWing: newFloorWing
                })
            });

            if (res.ok) {
                const data = await res.json();
                setWards([...wards, data.ward]);
                setNewWardName('');
                setNewFloorWing('');
                setAddingWard(false);
            } else {
                alert('Failed to add ward');
            }
        } catch (err) {
            console.error(err);
            alert('Error adding ward');
        }
    };

    const handleAddBeds = async (e) => {
        e.preventDefault();
        if (!activeWardId || !bedCount) return;

        try {
            const res = await fetch('/api/facility/beds', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    wardId: activeWardId,
                    prefix: bedPrefix,
                    startNumber: bedStartNum,
                    count: bedCount
                })
            });

            if (res.ok) {
                const data = await res.json();
                // Update local state with new beds
                setWards(wards.map(w => w.id === activeWardId ? { ...w, beds: data.beds } : w));
                setActiveWardId(null);
                setAddingBeds(false);
            } else {
                alert('Failed to add beds');
            }
        } catch (err) {
            console.error(err);
            alert('Error adding beds');
        }
    };

    const handleDeleteBed = async (wardId, bedId) => {
        if (!confirm('Are you sure you want to delete this bed?')) return;

        try {
            const res = await fetch(`/api/facility/beds?bedId=${bedId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setWards(wards.map(w => {
                    if (w.id === wardId) {
                        return { ...w, beds: w.beds.filter(b => b.id !== bedId) };
                    }
                    return w;
                }));
            } else {
                alert('Failed to delete bed');
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading facility data...</div>;

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title" style={{ marginBottom: '4px' }}>Facility Management</h1>
                    <p className="page-header__subtitle">Manage hospital wings, wards, and real bed inventory dynamically.</p>
                </div>
                <div className="dashboard-header-buttons">
                    <button className="btn btn-primary btn-sm" onClick={() => setAddingWard(true)}>
                        <Plus size={15} strokeWidth={1.5} />
                        Add New Ward
                    </button>
                </div>
            </div>

            {addingWard && (
                <div className="card" style={{ padding: '24px', marginBottom: '24px', background: '#FAFCFF', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '16px' }}>Create New Ward / Wing</h3>
                    <form onSubmit={handleAddWard} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Ward Name <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    type="text"
                                    value={newWardName}
                                    onChange={e => setNewWardName(e.target.value)}
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none' }}
                                    placeholder="e.g. ICU, General Ward"
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Floor / Wing (Optional)</label>
                                <input
                                    type="text"
                                    value={newFloorWing}
                                    onChange={e => setNewFloorWing(e.target.value)}
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-light)', borderRadius: '8px', outline: 'none' }}
                                    placeholder="e.g. 2nd Floor, East Wing"
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => setAddingWard(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Create Ward</button>
                        </div>
                    </form>
                </div>
            )}

            {addingBeds && activeWardId && (
                <div className="card" style={{ padding: '24px', marginBottom: '24px', background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#166534', marginBottom: '16px' }}>
                        Generate Beds for {wards.find(w => w.id === activeWardId)?.name}
                    </h3>
                    <form onSubmit={handleAddBeds} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', alignItems: 'flex-end' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#166534', fontWeight: 500 }}>Prefix (Optional)</label>
                            <input
                                type="text"
                                value={bedPrefix}
                                onChange={e => setBedPrefix(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', border: '1px solid #BBF7D0', borderRadius: '8px', outline: 'none' }}
                                placeholder="e.g. ICU"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#166534', fontWeight: 500 }}>Starting Number</label>
                            <input
                                type="number"
                                value={bedStartNum}
                                onChange={e => setBedStartNum(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', border: '1px solid #BBF7D0', borderRadius: '8px', outline: 'none' }}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#166534', fontWeight: 500 }}>Number of Beds</label>
                            <input
                                type="number"
                                value={bedCount}
                                onChange={e => setBedCount(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', border: '1px solid #BBF7D0', borderRadius: '8px', outline: 'none' }}
                                min="1" max="50"
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button type="button" className="btn btn-secondary" style={{ flex: 1, background: '#fff', border: '1px solid #BBF7D0', color: '#166534' }} onClick={() => setAddingBeds(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1, background: '#16A34A' }}>Generate</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gap: '24px' }}>
                {wards.length === 0 ? (
                    <div className="card" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <Archive size={40} strokeWidth={1} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
                        <h3>No Wards Configured</h3>
                        <p>Click &quot;Add New Ward&quot; to start building your hospital layout.</p>
                    </div>
                ) : (
                    wards.map(ward => (
                        <div key={ward.id} className="card" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-navy)', margin: 0 }}>
                                        {ward.name}
                                        {ward.floorWing && <span style={{ fontSize: '13px', marginLeft: '12px', padding: '4px 8px', background: '#e2e8f0', borderRadius: '4px', color: '#475569', fontWeight: 500 }}>{ward.floorWing}</span>}
                                    </h3>
                                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{ward.beds?.length || 0} Total Beds Configured</div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button className="btn btn-secondary btn-sm" onClick={() => { setActiveWardId(ward.id); setAddingBeds(true); }}>
                                        <Plus size={14} /> Add Beds
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                                {(!ward.beds || ward.beds.length === 0) ? (
                                    <div style={{ gridColumn: '1 / -1', fontSize: '13px', color: 'var(--color-text-muted)', padding: '16px', background: '#F8FAFC', borderRadius: '8px', textAlign: 'center' }}>
                                        No beds populated in this ward yet.
                                    </div>
                                ) : (
                                    ward.beds.sort((a, b) => a.bedNumber.localeCompare(b.bedNumber, undefined, { numeric: true })).map(bed => (
                                        <div key={bed.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', border: '1px solid var(--color-border-light)', borderRadius: '8px', background: '#FAFCFF' }}>
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)', fontFamily: 'monospace' }}>{bed.bedNumber}</span>
                                            <button onClick={() => handleDeleteBed(ward.id, bed.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#94A3B8' }} title="Delete Bed">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
