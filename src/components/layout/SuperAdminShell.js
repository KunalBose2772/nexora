'use client';
import { useState, useEffect } from 'react';
import SuperAdminSidebar from '@/components/layout/SuperAdminSidebar';
import SuperAdminHeader from '@/components/layout/SuperAdminHeader';

export default function SuperAdminShell({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => { if (window.innerWidth > 1024) setMobileOpen(false); };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sidebarWidth = collapsed ? '72px' : '260px';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(11,15,25,0.6)',
                        zIndex: 35, backdropFilter: 'blur(4px)'
                    }}
                />
            )}

            <SuperAdminSidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <div
                className="saas-main-content"
                style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    transition: 'margin-left 220ms cubic-bezier(0.4,0,0.2,1)',
                }}
            >
                <SuperAdminHeader setMobileOpen={setMobileOpen} />
                <main
                    id="saas-main-content"
                    tabIndex={-1}
                    className="fade-in saas-main-area"
                    style={{ flex: 1, background: '#F8FAFC' }}
                >
                    {children}
                </main>
                <footer style={{
                    padding: '16px 32px',
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                }}>
                    <span style={{ fontSize: '11px', color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>Nexora Health SaaS Console</span>
                    <span style={{ color: '#E2E8F0', fontSize: '11px' }}>|</span>
                    <span style={{ fontSize: '11px', color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Built by Global Webify</span>
                </footer>
            </div>

            {/* CSS for responsive shift */}
            <style>{`
                .saas-main-content {
                    margin-left: ${sidebarWidth};
                }
                .saas-main-area {
                    padding: 32px;
                }
                @media (max-width: 1024px) {
                    .saas-main-content {
                        margin-left: 0 !important;
                    }
                }
                @media (max-width: 768px) {
                    .saas-main-area {
                        padding: 16px;
                    }
                }
            `}</style>
        </div>
    );
}
