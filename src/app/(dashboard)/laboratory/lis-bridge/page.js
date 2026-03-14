'use client';
import { Share2, FileUp, Cpu, Activity, Info, CheckCircle, Smartphone, Clock, Database, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function LISBridgePage() {
    const [mockFile, setMockFile] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);

    const MOCK_MACHINE_OUTPUT = [
        { parameter: 'Hemoglobin (Hb)', value: '14.2', unit: 'g/dL', range: '13.0 - 17.0', status: 'Normal' },
        { parameter: 'WBC Count', value: '11.5', unit: '10³/µL', range: '4.0 - 10.0', status: 'HIGH' },
        { parameter: 'Platelets', value: '250', unit: '10³/µL', range: '150 - 450', status: 'Normal' },
        { parameter: 'RBC Count', value: '4.8', unit: '10⁶/µL', range: '4.5 - 5.5', status: 'Normal' },
    ];

    const simulateUpload = () => {
        setProcessing(true);
        setTimeout(() => {
            setMockFile('CBC_SYS_9921.dat');
            setResult(MOCK_MACHINE_OUTPUT);
            setProcessing(false);
        }, 1500);
    };

    const handleSync = async () => {
        setProcessing(true);
        // Simulate API call to /api/laboratory/lis-sync
        await new Promise(r => setTimeout(r, 2000));
        setProcessing(false);
        alert("LIS Sync Complete! The results have been mapped to Lab Order #LAB-0021-01 and the patient has been notified via SMS.");
        setResult(null);
        setMockFile(null);
    };

    return (
        <div className="fade-in">
            <div className="dashboard-header-row">
                <div>
                    <h1 className="page-header__title">Automated LIS Machine Bridge</h1>
                    <p className="page-header__subtitle">Interface for clinical chemistry and hematology analyzers (Sysmex, Roche, Abbott).</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary btn-sm" style={{ background: '#fff' }}><Database size={14}/> DB Config</button>
                    <button className="btn btn-primary btn-sm"><Cpu size={14}/> Active Machine: Sysmex XN-1000</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '24px' }}>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', border: '2px dashed #E2E8F0', background: '#F8FAFC' }}>
                    {!result ? (
                        <>
                            <div style={{ background: 'rgba(0,194,255,0.1)', color: '#00C2FF', padding: '24px', borderRadius: '50%', marginBottom: '16px' }}>
                                <FileUp size={48} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0' }}>{processing ? 'Reading Data Stream...' : 'Drop Machine Output File'}</h3>
                            <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '24px' }}>Support: .dat, .hl7, .astm, .csv (Beckman/Sysmex/Mindray)</p>
                            <button className="btn btn-primary" onClick={simulateUpload} disabled={processing}>
                                {processing ? 'Accessing Port COM3...' : 'Simulate Machine Data Stream'}
                            </button>
                        </>
                    ) : (
                        <div style={{ width: '100%', height: '100%', padding: '24px', background: '#fff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
                                <div>
                                    <h4 style={{ margin: 0, color: 'var(--color-navy)', fontSize: '16px' }}>Parsed Machine Payload: {mockFile}</h4>
                                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0 0' }}>Detected ID: 994218823 (matches Patient: Kunal Bose)</p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="btn btn-secondary btn-sm" onClick={() => setResult(null)}><Trash2 size={12}/> Clear</button>
                                    <button className="btn btn-primary btn-sm" onClick={handleSync} disabled={processing}>
                                        <Share2 size={14}/> {processing ? 'Syncing...' : 'Sync to Medical Records'}
                                    </button>
                                </div>
                            </div>

                            <div className="data-table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Clinical Parameter</th>
                                            <th>Analyzed Value</th>
                                            <th>Unit</th>
                                            <th>Reference Range</th>
                                            <th>Diagnostic Flag</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.map((row, idx) => (
                                            <tr key={idx}>
                                                <td style={{ fontWeight: 600 }}>{row.parameter}</td>
                                                <td style={{ fontSize: '15px' }}>{row.value}</td>
                                                <td>{row.unit}</td>
                                                <td style={{ fontSize: '12px', color: '#64748B' }}>{row.range}</td>
                                                <td>
                                                    <span className={`badge ${row.status === 'HIGH' ? 'badge-red' : 'badge-green'}`} style={{ padding: '4px 8px', fontSize: '11px' }}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ marginTop: '20px', padding: '12px', background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '8px', display: 'flex', gap: '12px' }}>
                                <Info size={18} color="#00C2FF" />
                                <p style={{ fontSize: '13px', color: '#0369A1', margin: 0, lineHeight: 1.5 }}>
                                    <strong>Automatic Validation:</strong> High WBC count detected. System will flag as "Critical Alert" for Pathologist review.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="card" style={{ padding: '20px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={16} color="#00C2FF" /> Machine Health
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                <span style={{ color: '#64748B' }}>Connection Type</span>
                                <span style={{ fontWeight: 600 }}>LAN / TCP-IP</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                <span style={{ color: '#64748B' }}>Status</span>
                                <span style={{ color: '#10B981', fontWeight: 600 }}>Connected</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                <span style={{ color: '#64748B' }}>Buffer Capacity</span>
                                <div style={{ width: '80px', height: '6px', background: '#E2E8F0', borderRadius: '3px', marginTop: '6px' }}>
                                    <div style={{ width: '12%', height: '100%', background: '#10B981', borderRadius: '3px' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '20px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={16} color="#00C2FF" /> Recent Transmissions
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                { id: '9921', time: '10:45 AM', type: 'Hematology' },
                                { id: '9918', time: '10:12 AM', type: 'Biochemical' },
                                { id: '9902', time: '09:30 AM', type: 'Urine Analysis' },
                            ].map(log => (
                                <div key={log.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ background: '#F1F5F9', padding: '8px', borderRadius: '8px' }}><Cpu size={14} /></div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '12px', fontWeight: 700 }}>Stream #{log.id}</div>
                                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>{log.type} • {log.time}</div>
                                    </div>
                                    <CheckCircle size={14} color="#10B981" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ padding: '16px', background: 'linear-gradient(135deg, #0A2E4D, #1E40AF)', color: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <Smartphone size={16} />
                            <span style={{ fontSize: '13px', fontWeight: 600 }}>SMS Notification Active</span>
                        </div>
                        <p style={{ fontSize: '11px', opacity: 0.8, margin: 0 }}>Patients with valid mobile numbers will receive automated report links as soon as you "Sync".</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
