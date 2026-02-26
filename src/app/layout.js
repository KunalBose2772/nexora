import './globals.css';

export const metadata = {
  title: {
    template: '%s | Nexora Health',
    default: 'Nexora Health — Enterprise Hospital Management System',
  },
  description:
    'Nexora Health is a pan-India, multi-tenant SaaS Hospital ERP platform built for enterprise-grade clinical operations. Powered by Global Webify.',
  keywords: [
    'Hospital Management System',
    'HMS',
    'Healthcare ERP',
    'SaaS HMS',
    'Multi-tenant Hospital Software',
    'Nexora Health',
    'Global Webify',
  ],
  authors: [{ name: 'Global Webify', url: 'https://globalwebify.com' }],
  creator: 'Global Webify',
  publisher: 'Global Webify',
  metadataBase: new URL('https://nexorahealth.com'),
  openGraph: {
    title: 'Nexora Health — Enterprise Hospital Management System',
    description:
      'Pan-India multi-tenant SaaS Hospital ERP. Built for enterprise clinical operations.',
    url: 'https://nexorahealth.com',
    siteName: 'Nexora Health',
    images: [
      {
        url: '/nexora-logo.png',
        width: 1200,
        height: 630,
        alt: 'Nexora Health',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexora Health — Enterprise Hospital Management System',
    description:
      'Pan-India multi-tenant SaaS Hospital ERP. Built for enterprise clinical operations.',
    images: ['/nexora-logo.png'],
    creator: '@globalwebify',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon-32x32.png',
        color: '#0A2E4D',
      },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#0A2E4D',
  colorScheme: 'light',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Lexend:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="msapplication-TileColor" content="#0A2E4D" />
        <meta name="msapplication-TileImage" content="/mstile-150x150.png" />
        <meta name="theme-color" content="#0A2E4D" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
