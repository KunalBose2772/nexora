'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function PublicHeader() {
    return (
        <nav
            role="navigation"
            aria-label="Main navigation"
            className="sticky top-0 z-[100] h-16 shadow-[0_4px_24px_rgba(0,0,0,0.3)] border-b border-white/10"
            style={{
                background: 'rgba(7,18,36,0.90)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            }}
        >
            <div className="max-w-[1480px] mx-auto h-full px-4 md:px-12 flex items-center justify-between gap-8">
                {/* Logo */}
                <Link
                    href="/"
                    aria-label="Nexora Health — Home"
                    className="inline-block leading-none mr-auto"
                >
                    <Image
                        src="/nexora-logo.png"
                        alt="Nexora Health"
                        width={180}
                        height={52}
                        priority
                        className="h-8 md:h-9 w-auto opacity-90 invert brightness-0"
                    />
                </Link>

                <div className="hidden lg:flex items-center gap-8">
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
                            className="text-[13.5px] text-white/60 hover:text-white font-normal transition-colors"
                        >
                            {label}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                    <Link
                        href="/login"
                        className="hidden sm:inline-flex text-[13.5px] text-white/75 hover:text-white font-medium border border-white/20 rounded-lg px-4 py-[7px] transition-all"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/demo"
                        className="inline-flex items-center gap-1.5 text-[13.5px] text-[#071220] font-semibold bg-[#00C2FF] rounded-lg px-4 py-[7px] transition-all"
                    >
                        Request Demo
                        <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
