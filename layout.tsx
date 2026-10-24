import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE } from '@/lib/constants';
import { jsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: 'MSUKASHA — B2B Marketplace and Pakistan C2C Classifieds', template: '%s | MSUKASHA' },
  description: 'Discover suppliers, showcase your products and build business connections across Pakistan and international markets.',
  icons: { icon: '/favicon.png' },
  openGraph: { siteName: SITE.name, type: 'website' }
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#1a2332' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({ '@context': 'https://schema.org', '@type': 'Organization', name: 'MSUKASHA', url: SITE.url, logo: `${SITE.url}/logo.png`, email: SITE.email })} />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">Skip to content</a>
        <AuthProvider>
          <Header />
          <main id="main" className="min-h-[60vh]">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
