'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function PublicFooter() {
    const COLS = [
        {
            title: 'Product',
            links: ['Patient EMR', 'OPD Module', 'IPD & Wards', 'Laboratory', 'Pharmacy', 'Billing & Finance'],
        },
        {
            title: 'Platform',
            links: ['Super Admin Panel', 'Multi-Branch Support', 'Hospital CMS', 'API Access', 'Integrations'],
        },
        {
            title: 'Company',
            links: ['About Nexora', 'About Global Webify', 'Blog', 'Careers', 'Press Kit'],
        },
        {
            title: 'Legal',
            links: ['Privacy Policy', 'Terms of Service', 'Data Processing', 'HIPAA Compliance', 'Security'],
        },
    ];

    return (
        <>
            <style>{`
        .pf-grid {
          display: grid;
          grid-template-columns: 2.5fr 1fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 56px;
        }
        @media (max-width: 1024px) {
          .pf-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
        }
        @media (max-width: 640px) {
          .pf-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }
        .pf-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        @media (max-width: 640px) {
          .pf-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>

            <footer role="contentinfo" style={{ background: '#040D1A', padding: '48px 24px 20px' }}>
                <div style={{ maxWidth: '1480px', margin: '0 auto' }}>
                    <div className="pf-grid">

                        {/* Brand column */}
                        <div>
                            <Link href="/" aria-label="Nexora Health — Home" style={{ display: 'inline-block', lineHeight: 0, marginBottom: '18px' }}>
                                <Image
                                    src="/nexora-logo.png"
                                    alt="Nexora Health"
                                    width={180}
                                    height={52}
                                    style={{ height: '34px', width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.80 }}
                                />
                            </Link>
                            <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.40)', lineHeight: 1.75, maxWidth: '280px' }}>
                                India's enterprise-grade multi-tenant SaaS Hospital ERP.
                                Built for clinical excellence and operational efficiency.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
                                <a href="mailto:help@globalwebify.com" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 150ms' }}
                                    onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')} onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.45)')}>
                                    <Mail size={14} strokeWidth={1.5} style={{ color: '#00C2FF', flexShrink: 0 }} aria-hidden="true" />
                                    help@globalwebify.com
                                </a>
                                <a href="tel:+917563901100" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 150ms' }}
                                    onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')} onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.45)')}>
                                    <Phone size={14} strokeWidth={1.5} style={{ color: '#00C2FF', flexShrink: 0 }} aria-hidden="true" />
                                    +91 75639 01100
                                </a>
                                <a href="tel:18008905489" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 150ms' }}
                                    onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')} onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.45)')}>
                                    <Phone size={14} strokeWidth={1.5} style={{ color: '#00C2FF', flexShrink: 0 }} aria-hidden="true" />
                                    Toll Free: 1800 890 5489
                                </a>
                                <a href="tel:+19175908135" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 150ms' }}
                                    onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')} onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.45)')}>
                                    <Phone size={14} strokeWidth={1.5} style={{ color: '#00C2FF', flexShrink: 0 }} aria-hidden="true" />
                                    US Office: +1 (917) 590-8135
                                </a>
                                <span style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginTop: '4px' }}>
                                    <MapPin size={14} strokeWidth={1.5} style={{ color: '#00C2FF', flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                                    2nd Floor, Alam Complex, Ashok Nagar Road, Kadru, Ranchi, Jharkhand, India-834002
                                </span>
                            </div>
                            <div style={{ marginTop: '24px', fontSize: '11px', color: 'rgba(255,255,255,0.20)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                Powered by Global Webify
                            </div>
                        </div>

                        {/* Link columns */}
                        {COLS.map((col) => (
                            <div key={col.title}>
                                <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.50)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '18px' }}>
                                    {col.title}
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
                                    {col.links.map((link) => (
                                        <li key={link}>
                                            <a href="#" style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.38)', textDecoration: 'none', transition: 'color 150ms' }}
                                                onMouseEnter={(e) => (e.target.style.color = 'rgba(255,255,255,0.75)')}
                                                onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.38)')}
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="pf-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.22)' }}>
                            &copy; {new Date().getFullYear()} Nexora Health. All rights reserved. Powered by Global Webify.
                        </span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.16)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            NEXORA HEALTH | POWERED BY GLOBAL WEBIFY
                        </span>
                    </div>
                </div>
            </footer>
        </>
    );
}
