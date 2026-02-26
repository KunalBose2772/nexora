import Image from 'next/image';
import Link from 'next/link';

/**
 * Logo – appears in the sidebar (dark background variant)
 * and Header (light background variant)
 */
export default function Logo({ variant = 'sidebar', size = 'md', href = '/' }) {
    const sizeMap = {
        sm: { img: 24, text: '13px' },
        md: { img: 32, text: '15px' },
        lg: { img: 40, text: '18px' },
    };

    const { img, text } = sizeMap[size] || sizeMap.md;

    if (variant === 'icon-only') {
        return (
            <Link href={href} aria-label="Nexora Health – Home">
                <Image
                    src="/favicon-96x96.png"
                    alt="Nexora Health"
                    width={img}
                    height={img}
                    priority
                    style={{ display: 'block' }}
                />
            </Link>
        );
    }

    if (variant === 'sidebar') {
        return (
            <Link
                href={href}
                aria-label="Nexora Health – Home"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '20px 20px 16px',
                    textDecoration: 'none',
                }}
            >
                <Image
                    src="/favicon-96x96.png"
                    alt="Nexora Health logo mark"
                    width={img}
                    height={img}
                    priority
                    style={{ flexShrink: 0 }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                    <span
                        style={{
                            fontSize: text,
                            fontWeight: 600,
                            color: '#FFFFFF',
                            letterSpacing: '-0.01em',
                        }}
                    >
                        NEXORA HEALTH
                    </span>
                    <span
                        style={{
                            fontSize: '9px',
                            fontWeight: 400,
                            color: 'rgba(255,255,255,0.45)',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            marginTop: '2px',
                        }}
                    >
                        by Global Webify
                    </span>
                </div>
            </Link>
        );
    }

    if (variant === 'header') {
        return (
            <Link
                href={href}
                aria-label="Nexora Health – Home"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                }}
            >
                <Image
                    src="/favicon-96x96.png"
                    alt="Nexora Health logo mark"
                    width={img}
                    height={img}
                    priority
                    style={{ flexShrink: 0 }}
                />
                <span
                    style={{
                        fontSize: text,
                        fontWeight: 600,
                        color: '#0A2E4D',
                        letterSpacing: '-0.01em',
                    }}
                >
                    Nexora Health
                </span>
            </Link>
        );
    }

    // Default – full wordmark (light bg, used in landing/marketing pages)
    return (
        <Link
            href={href}
            aria-label="Nexora Health – Home"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
            }}
        >
            <Image
                src="/nexora-logo.png"
                alt="Nexora Health"
                width={180}
                height={50}
                priority
                style={{ display: 'block', height: 'auto' }}
            />
        </Link>
    );
}
