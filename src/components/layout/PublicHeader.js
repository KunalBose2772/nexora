'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function PublicHeader() {
    const [menuOpen, setMenuOpen] = useState(false);

    const NAV_LINKS = [
        { href: '#modules', label: 'Modules' },
        { href: '#workflow', label: 'How It Works' },
        { href: '#pricing', label: 'Pricing' },
        { href: '#testimonials', label: 'Customers' },
        { href: '#faq', label: 'FAQ' },
    ];

    return (
        <>
            <style>{`
        .ph-nav-links { display: flex; }
        .ph-signin { display: inline-flex; }
        .ph-hamburger { display: none; }
        .ph-mobile-menu { display: none; flex-direction: column; gap: 0; }
        .ph-mobile-menu.open { display: flex; }

        @media (max-width: 768px) {
          .ph-nav-links { display: none !important; }
          .ph-signin { display: none !important; }
          .ph-hamburger { display: flex !important; }
        }
      `}</style>

            <nav
                role="navigation"
                aria-label="Main navigation"
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    background: 'rgba(7,18,36,0.95)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.30)',
                }}
            >
                {/* Desktop row */}
                <div style={{
                    maxWidth: '1480px',
                    margin: '0 auto',
                    height: '64px',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '28px',
                }}>
                    {/* Logo */}
                    <Link
                        href="/"
                        aria-label="Nexora Health — Home"
                        style={{ display: 'inline-block', lineHeight: 0, marginRight: 'auto' }}
                    >
                        <Image
                            src="/nexora-logo.png"
                            alt="Nexora Health"
                            width={1500}
                            height={500}
                            priority
                            style={{
                                width: '130px',
                                height: 'auto',
                                filter: 'brightness(0) invert(1)',
                                opacity: 0.92,
                            }}
                        />
                    </Link>

                    {/* Desktop nav links */}
                    <div className="ph-nav-links" style={{ alignItems: 'center', gap: '28px' }}>
                        {NAV_LINKS.map(({ href, label }) => (
                            <a
                                key={href}
                                href={href}
                                style={{
                                    fontSize: '13.5px',
                                    color: 'rgba(255,255,255,0.60)',
                                    textDecoration: 'none',
                                    fontWeight: 400,
                                    transition: 'color 150ms',
                                    whiteSpace: 'nowrap',
                                }}
                                onMouseEnter={(e) => (e.target.style.color = '#fff')}
                                onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.60)')}
                            >
                                {label}
                            </a>
                        ))}
                    </div>

                    {/* Sign In */}
                    <Link
                        href="/login"
                        className="ph-signin"
                        style={{
                            fontSize: '13.5px',
                            color: 'rgba(255,255,255,0.75)',
                            textDecoration: 'none',
                            padding: '7px 16px',
                            border: '1px solid rgba(255,255,255,0.18)',
                            borderRadius: '8px',
                            transition: 'all 150ms',
                            fontWeight: 500,
                            alignItems: 'center',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Sign In
                    </Link>

                    {/* Request Demo */}
                    <Link
                        href="/demo"
                        style={{
                            fontSize: '13.5px',
                            color: '#071220',
                            fontWeight: 600,
                            textDecoration: 'none',
                            padding: '7px 16px',
                            background: '#00C2FF',
                            borderRadius: '8px',
                            transition: 'all 150ms',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Request Demo
                        <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
                    </Link>

                    {/* Hamburger (mobile only) */}
                    <button
                        className="ph-hamburger"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            cursor: 'pointer',
                            padding: '6px',
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* Mobile dropdown menu */}
                <div
                    className={`ph-mobile-menu${menuOpen ? ' open' : ''}`}
                    style={{
                        background: 'rgba(7,18,36,0.98)',
                        borderTop: '1px solid rgba(255,255,255,0.07)',
                        padding: menuOpen ? '16px 24px 20px' : '0',
                    }}
                >
                    {NAV_LINKS.map(({ href, label }) => (
                        <a
                            key={href}
                            href={href}
                            onClick={() => setMenuOpen(false)}
                            style={{
                                display: 'block',
                                padding: '12px 0',
                                fontSize: '15px',
                                color: 'rgba(255,255,255,0.75)',
                                textDecoration: 'none',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                            }}
                        >
                            {label}
                        </a>
                    ))}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                        <Link
                            href="/login"
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                padding: '10px',
                                border: '1px solid rgba(255,255,255,0.18)',
                                borderRadius: '8px',
                                color: '#fff',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: 500,
                            }}
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/demo"
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                padding: '10px',
                                background: '#00C2FF',
                                borderRadius: '8px',
                                color: '#071220',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: 700,
                            }}
                        >
                            Request Demo
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
}
