import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export const metadata = {
    title: 'Hospital Dashboard',
};

export default function DashboardLayout({ children }) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#EEF2F8' }}>
            <Sidebar />
            <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />
                <main
                    id="main-content"
                    tabIndex={-1}
                    className="fade-in"
                    style={{ flex: 1, padding: '24px', background: '#EEF2F8' }}
                >
                    {children}
                </main>
                {/* Brand footer */}
                <footer style={{
                    padding: '10px 24px',
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    background: 'rgba(255,255,255,0.70)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                }}>
                    <span style={{ fontSize: '10px', color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        Nexora Health
                    </span>
                    <span style={{ color: '#CBD5E1', fontSize: '10px' }}>|</span>
                    <span style={{ fontSize: '10px', color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        Powered by Global Webify
                    </span>
                </footer>
            </div>
        </div>
    );
}
