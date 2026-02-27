import { useState } from 'react';
import { Activity, Server, Database, HardDrive, RefreshCcw, Loader2 } from 'lucide-react';

function TerminalSquare() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 11 2-2-2-2"></path><path d="M11 13h4"></path><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect></svg>;
}

const LOGS = [
    { time: '2026-02-27T12:00:01', level: 'INFO', msg: '[TENANT-PROV] Database db_apollo_91 successfully cloned from template.', color: '#3B82F6' },
    { time: '2026-02-27T12:01:45', level: 'WARN', msg: '[API-GW] Rate limit approached for tenant ip: 192.168.1.1', color: '#F59E0B' },
    { time: '2026-02-27T12:02:10', level: 'INFO', msg: '[CRON] Nightly PDF backup routine started.', color: '#3B82F6' },
    { time: '2026-02-27T12:05:00', level: 'ERROR', msg: '[DB-POOL] Connection timeout acquiring pooled connection. Queue=52', color: '#EF4444' },
    { time: '2026-02-27T12:05:01', level: 'ERROR', msg: '[DB-POOL] Exception: FATAL: remaining connection slots are reserved.', color: '#EF4444' },
    { time: '2026-02-27T12:05:05', level: 'INFO', msg: '[SCALER] Auto-scaling triggered. Launching 1 new RDS read replica.', color: '#10B981' },
    { time: '2026-02-27T12:08:12', level: 'INFO', msg: '[SCALER] Read replica online. Pools re-balanced.', color: '#10B981' },
    { time: '2026-02-27T12:10:00', level: 'INFO', msg: '[AUTH] 1,492 active JWTs verified in last 10m window.', color: '#3B82F6' },
];

export default function LogsPage() {
    const [logs, setLogs] = useState(LOGS);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isRestarting, setIsRestarting] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            const num1 = Math.floor(Math.random() * 50);
            const num2 = Math.floor(Math.random() * 10);
            setLogs(prev => [
                ...prev,
                { time: new Date().toISOString().substring(0, 19), level: 'INFO', msg: `[AUTH] ${num1} active JWTs verified in last 2m window.`, color: '#3B82F6' },
                { time: new Date().toISOString().substring(0, 19), level: 'WARN', msg: `[API-GW] Rate limit approached for tenant ip: 10.0.${num2}.1`, color: '#F59E0B' }
            ]);
            setIsRefreshing(false);
        }, 1200);
    };

    const handleRestart = () => {
        if (window.confirm("WARNING: Are you sure you want to initiate a rolling restart of the database cluster?")) {
            setIsRestarting(true);
            setTimeout(() => {
                setIsRestarting(false);
                setLogs(prev => [
                    ...prev,
                    { time: new Date().toISOString().substring(0, 19), level: 'INFO', msg: '[CLUSTER] Manual cluster rolling restart initiated by super-admin.', color: '#10B981' }
                ]);
            }, 2500);
        }
    };

    return (
        <div className="fade-in">
            {/* Page Header */}
            <div className="saas-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.02em' }}>System Logs & Health</h1>
                    <p style={{ color: '#64748B', margin: 0, fontSize: '14px' }}>Real-time AWS infrastructure metrics and global error logs.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button onClick={handleRefresh} disabled={isRefreshing} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #E2E8F0', color: '#0F172A', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: isRefreshing ? 'wait' : 'pointer', opacity: isRefreshing ? 0.7 : 1 }}>
                        {isRefreshing ? <Loader2 size={16} className="spin" /> : <RefreshCcw size={16} />} Refresh
                    </button>
                    <button onClick={handleRestart} disabled={isRestarting} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#DC2626', color: 'white', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: isRestarting ? 'wait' : 'pointer', opacity: isRestarting ? 0.7 : 1 }}>
                        {isRestarting ? <Loader2 size={16} className="spin" /> : 'Restart Cluster'}
                    </button>
                </div>
            </div>

            {/* Health Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #10B981', boxShadow: '0 4px 12px rgba(16,185,129,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#10B981' }}>
                        <Server size={18} /> <span style={{ fontSize: '14px', fontWeight: 600 }}>API Instances</span>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>99.98% <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748B' }}>Uptime</span></div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>4/4 Nodes Healthy. Load: 32%</div>
                </div>
                <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #10B981', boxShadow: '0 4px 12px rgba(16,185,129,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#10B981' }}>
                        <Database size={18} /> <span style={{ fontSize: '14px', fontWeight: 600 }}>PostgreSQL Clusters</span>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>1,142 <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748B' }}>DBs</span></div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>Active Connections: 8,491</div>
                </div>
                <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#475569' }}>
                        <HardDrive size={18} /> <span style={{ fontSize: '14px', fontWeight: 600 }}>S3 Storage Used</span>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>8.4 TB</div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>Costs: ₹42k/mo. Growing 5% MoM.</div>
                </div>
                <div style={{ background: '#FEF2F2', padding: '20px', borderRadius: '12px', border: '1px solid #FECACA' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#DC2626' }}>
                        <Activity size={18} /> <span style={{ fontSize: '14px', fontWeight: 600 }}>Error Rate</span>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#DC2626' }}>1.2% <span style={{ fontSize: '14px', fontWeight: 500, color: '#EF4444' }}>(Elevated)</span></div>
                    <div style={{ fontSize: '12px', color: '#991B1B', marginTop: '6px' }}>Spikes detected in last 10 minutes.</div>
                </div>
            </div>

            {/* Terminal Log View */}
            <div style={{ background: '#0B0F19', borderRadius: '12px', border: '1px solid #1E293B', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #1E293B', background: '#0F172A' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E2E8F0', fontSize: '12px', fontWeight: 600, fontFamily: 'monospace' }}>
                        <TerminalSquare /> global-stdout.log
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#DC2626' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FBBF24' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></div>
                    </div>
                </div>
                <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '13px', color: '#94A3B8', lineHeight: 1.7, height: '380px', overflowY: 'auto', overflowX: 'auto' }}>
                    {logs.map((log, i) => (
                        <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '4px', flexWrap: 'wrap', animation: 'fadeInBottom 0.3s ease-out' }}>
                            <span style={{ color: '#64748B', whiteSpace: 'nowrap', fontSize: '12px' }}>{log.time}</span>
                            <span style={{ color: log.color, fontWeight: 700, minWidth: '50px', fontSize: '12px' }}>{log.level}</span>
                            <span style={{ color: '#E2E8F0', wordBreak: 'break-word', flex: 1, minWidth: '0', fontSize: '12px' }}>{log.msg}</span>
                        </div>
                    ))}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '16px', color: '#10B981' }}>
                        <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }}></div>
                        Tailing active logs...
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.3; }
                    100% { opacity: 1; }
                }
                @keyframes fadeInBottom {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
