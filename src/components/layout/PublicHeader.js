'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function PublicHeader() {
    return (
        <nav
            role="navigation"
            aria-label="Main navigation"
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                height: '64px',
                background: 'rgba(7,18,36,0.90)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.30)',
            }}
        >
            <div style={{ maxWidth: '1480px', margin: '0 auto', height: '100%', padding: '0 48px', display: 'flex', alignItems: 'center', gap: '32px' }}>
                {/* Logo */}
                <Link
                    href="/"
                    aria-label="Nexora Health — Home"
                    style={{ display: 'inline-block', lineHeight: 0, marginRight: 'auto' }}
                >
                    <Image
                        src="/nexora-logo.png"
                        alt="Nexora Health"
                        width={180}
                        height={52}
                        priority
                        style={{
                            height: '36px',
                            width: 'auto',
                            filter: 'brightness(0) invert(1)',
                            opacity: 0.92,
                        }}
                    />
                </Link>

                {[
                    { href: '#modules', label: 'Modules' },
                    { href: '#workflow', label: 'How It Works' },
                    { href: '#pricing', label: 'Pricing' },
                    { href: '#testimonials', label: 'Customers' },
                    { href: '#faq', label: 'FAQ' },
                ].map(({ href, label }) => (
                    <a
                        key={href}
                        href={href}
                        style={{
                            fontSize: '13.5px',
                            color: 'rgba(255,255,255,0.60)',
                            textDecoration: 'none',
                            fontWeight: 400,
                            transition: 'color 150ms',
                        }}
                        onMouseEnter={(e) => (e.target.style.color = '#fff')}
                        onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.60)')}
                    >
                        {label}
                    </a>
                ))}

                <Link
                    href="/login"
                    style={{
                        fontSize: '13.5px',
                        color: 'rgba(255,255,255,0.75)',
                        textDecoration: 'none',
                        padding: '7px 16px',
                        border: '1px solid rgba(255,255,255,0.18)',
                        borderRadius: '8px',
                        transition: 'all 150ms',
                        fontWeight: 500,
                    }}
                >
                    Sign In
                </Link>
                <Link
                    href="/demo"
                    style={{
                        fontSize: '13.5px',
                        color: '#071220',
                        fontWeight: 600,
                        textDecoration: 'none',
                        padding: '7px 18px',
                        background: '#00C2FF',
                        borderRadius: '8px',
                        transition: 'all 150ms',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                >
                    Request Demo
                    <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
                </Link>
            </div>
        </nav>
    );
}
