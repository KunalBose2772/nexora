'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function DashboardShell({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => { if (window.innerWidth > 1024) setMobileOpen(false); };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sidebarWidth = collapsed ? '64px' : '260px';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#EEF2F8' }}>
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
                        zIndex: 35, backdropFilter: 'blur(2px)'
                    }}
                />
            )}

            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <div
                className="dashboard-main-content"
                style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    transition: 'margin-left 220ms cubic-bezier(0.4,0,0.2,1)',
                }}
            >
                <Header setMobileOpen={setMobileOpen} />
                <main
                    id="main-content"
                    tabIndex={-1}
                    className="fade-in dashboard-main-area"
                    style={{ flex: 1, background: '#EEF2F8' }}
                >
                    {children}
                </main>
                <footer style={{
                    padding: '10px 24px',
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    background: 'rgba(255,255,255,0.70)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                }}>
                    <span style={{ fontSize: '10px', color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Nexora Health</span>
                    <span style={{ color: '#CBD5E1', fontSize: '10px' }}>|</span>
                    <span style={{ fontSize: '10px', color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Powered by Global Webify</span>
                </footer>
            </div>

            {/* CSS for responsive shift */}
            <style>{`
                .dashboard-main-content {
                    margin-left: ${sidebarWidth};
                }
                .dashboard-main-area {
                    padding: 24px;
                }
                @media (max-width: 1024px) {
                    .dashboard-main-content {
                        margin-left: 0 !important;
                    }
                }
                @media (max-width: 768px) {
                    .dashboard-main-area {
                        padding: 16px;
                    }
                }
            `}</style>
        </div>
    );
}
