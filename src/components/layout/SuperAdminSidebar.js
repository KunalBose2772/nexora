'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  CreditCard,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

const NAV = [
  { href: '/super-admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/super-admin/tenants', label: 'Tenants', icon: Users },
  { href: '/super-admin/resellers', label: 'Resellers', icon: Users }, // Using Users icon as a placeholder, can be changed
  { href: '/super-admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/super-admin/plans', label: 'Plans', icon: FileText },
  { href: '/super-admin/support', label: 'Support', icon: LifeBuoy },
  { href: '/super-admin/logs', label: 'System Logs', icon: FileText },
  { href: '/super-admin/settings', label: 'Settings', icon: Settings },
];

export default function SuperAdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const pathname = usePathname();
  const W = collapsed ? '72px' : '260px';

  return (
    <aside
      className={`saas-sidebar ${mobileOpen ? 'mobile-open' : ''}`}
      style={{
        width: W,
        minWidth: W,
        background: '#071220',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 40,
        overflowY: 'auto',
        overflowX: 'hidden',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
      aria-label="Super admin navigation"
    >
      <div
        style={{
          padding: collapsed ? '16px 0' : '18px 16px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          minHeight: '68px',
          flexShrink: 0,
        }}
      >
        {collapsed ? (
          <Link href="/super-admin" aria-label="Nexora Health — SaaS Console">
            <Image
              src="/favicon-96x96.png"
              alt="Nexora Health"
              width={30}
              height={30}
              priority
              style={{ display: 'block', filter: 'brightness(1.1)' }}
            />
          </Link>
        ) : (
          <Link
            href="/super-admin"
            aria-label="Nexora Health — SaaS Console"
            style={{ display: 'block', lineHeight: 0 }}
          >
            <Image
              src="/nexora-logo.png"
              alt="Nexora Health"
              width={188}
              height={54}
              priority
              style={{
                height: '40px',
                width: 'auto',
                filter: 'brightness(0) invert(1)',
                opacity: 0.9,
              }}
            />
          </Link>
        )}

        <button
          className="sa-sidebar-close-btn"
          onClick={() => setMobileOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '4px',
            marginLeft: 'auto',
            display: 'none',
          }}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>

        <style>{`
          .saas-sidebar {
            transition: width 220ms cubic-bezier(0.4,0,0.2,1), transform 350ms cubic-bezier(0.4,0,0.2,1);
            transform: translateX(0);
          }
          @media (max-width: 1024px) {
            .saas-sidebar {
              transform: translateX(-100%);
              width: 260px !important;
              min-width: 260px !important;
            }
            .saas-sidebar.mobile-open {
              transform: translateX(0);
              box-shadow: 4px 0 24px rgba(0,0,0,0.5);
            }
            .sa-sidebar-close-btn { display: block !important; }
          }
        `}</style>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: collapsed ? '10px 0' : '9px 12px',
                margin: '2px 10px',
                borderRadius: '10px',
                fontSize: '13.5px',
                fontWeight: active ? 600 : 500,
                color: active ? '#00C2FF' : 'rgba(255,255,255,0.65)',
                background: active ? 'rgba(0,194,255,0.12)' : 'transparent',
                textDecoration: 'none',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderLeft: active ? '2px solid #00C2FF' : '2px solid transparent',
                transition: 'all 150ms',
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = 'transparent';
              }}
            >
              <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.35)',
            fontSize: '12px',
            fontFamily: 'inherit',
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'color 150ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.70)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
        >
          {collapsed ? <ChevronRight size={15} /> : (<><ChevronLeft size={15} /><span>Collapse</span></>)}
        </button>
      </div>
    </aside>
  );
}

