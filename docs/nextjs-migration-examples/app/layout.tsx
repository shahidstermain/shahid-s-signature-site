/**
 * Next.js App Router Root Layout
 * 
 * This file provides the root layout for all pages, including:
 * - Global metadata configuration
 * - Font optimization
 * - Structured data (JSON-LD)
 * - Theme and styling setup
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts
 */

import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

// Font optimization with Next.js font system
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

// Site configuration
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shahidster.tech';
const SITE_NAME = 'Shahid Moosa — Cloud Database Engineer';
const SITE_DESCRIPTION = 'Cloud Database Support Engineer at SingleStore. I debug distributed systems, optimize queries at petabyte scale, and help Fortune 500 teams ship reliable data infrastructure.';

// Viewport configuration (separated from metadata in Next.js 14+)
export const viewport: Viewport = {
  themeColor: '#0a0b0d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// Global metadata defaults
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: '%s | Shahid Moosa',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'Cloud Database Engineer',
    'SingleStore',
    'AWS',
    'Distributed Systems',
    'Database Support',
    'PostgreSQL',
    'MySQL',
    'Database Optimization',
    'Data Infrastructure',
  ],
  authors: [{ name: 'Shahid Moosa', url: SITE_URL }],
  creator: 'Shahid Moosa',
  publisher: 'Shahid Moosa',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Shahid Moosa',
    title: SITE_NAME,
    description: 'I keep databases alive at scale. Cloud Database Engineer at SingleStore specializing in distributed systems and production infrastructure.',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Shahid Moosa - Cloud Database Engineer',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: 'I keep databases alive at scale. Cloud Database Engineer at SingleStore.',
    images: [`${SITE_URL}/og-image.png`],
    creator: '@shahidster_',
    site: '@shahidster_',
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': `${SITE_URL}/rss.xml`,
      'application/json': `${SITE_URL}/feed.json`,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'yandex-verification-code',
    // bing: 'bing-verification-code',
  },
  category: 'technology',
  classification: 'Personal Portfolio',
};

/**
 * Builds a JSON-LD Person schema object describing the site author.
 *
 * @returns A JSON-LD object (schema.org Person) containing the author's identity, job title, employer, contact URL, profile image, social profiles, and topical expertise.
 */
function getPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Shahid Moosa',
    jobTitle: 'Cloud Database Support Engineer',
    description: 'Distributed Systems Engineer specializing in database infrastructure at petabyte scale',
    worksFor: {
      '@type': 'Organization',
      name: 'SingleStore',
      url: 'https://www.singlestore.com',
    },
    url: SITE_URL,
    image: `${SITE_URL}/shahid-moosa.jpg`,
    email: 'mailto:hello@shahidster.tech',
    sameAs: [
      'https://twitter.com/shahidster_',
      'https://linkedin.com/in/shahidmoosa',
      'https://github.com/shahidmoosa',
    ],
    knowsAbout: [
      'Distributed Systems',
      'Database Engineering',
      'Cloud Infrastructure',
      'AWS',
      'PostgreSQL',
      'MySQL',
      'SingleStore',
      'Query Optimization',
      'Data Sharding',
    ],
  };
}

/**
 * Generate a Schema.org `WebSite` JSON-LD object describing the site and its search action.
 *
 * @returns A JSON-LD object for Schema.org `WebSite` with site metadata (`@id`, `url`, `name`, `description`, `publisher`, `inLanguage`) and a `potentialAction` `SearchAction` that provides a URL template for site search.
 */
function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: 'Technical blog and portfolio of Shahid Moosa, a Cloud Database Engineer specializing in distributed systems.',
    publisher: {
      '@id': `${SITE_URL}/#person`,
    },
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Root application layout that provides global HTML structure, fonts, metadata scripts, and theme container for all pages.
 *
 * Injects JSON-LD structured data for the site/person and, when configured in production, adds Google Analytics.
 *
 * @param children - The page content to render inside the document body.
 * @returns The top-level HTML element wrapping head elements and the application body.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const personSchema = getPersonSchema();
  const websiteSchema = getWebsiteSchema();

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Structured Data: Person Schema */}
        <Script
          id="person-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
          strategy="afterInteractive"
        />
        
        {/* Structured Data: WebSite Schema */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          strategy="afterInteractive"
        />

        {/* Google Analytics 4 (production only) */}
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className="font-body bg-background text-foreground antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}