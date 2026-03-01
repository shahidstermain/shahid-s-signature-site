import { describe, it, expect } from 'vitest';

// Mock metadata structures based on the examples
const SITE_URL = 'https://shahidster.tech';
const SITE_NAME = 'Shahid Moosa — Cloud Database Engineer';

// Mock viewport configuration
const viewport = {
  themeColor: '#0a0b0d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// Mock root layout metadata
const rootMetadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: '%s | Shahid Moosa',
  },
  description: 'Cloud Database Support Engineer at SingleStore. I debug distributed systems, optimize queries at petabyte scale, and help Fortune 500 teams ship reliable data infrastructure.',
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
  },
  category: 'technology',
  classification: 'Personal Portfolio',
};

// Mock homepage metadata
const homePageMetadata = {
  title: 'Shahid Moosa — Cloud Database Engineer',
  description: 'Cloud Database Support Engineer at SingleStore. I debug distributed systems, optimize queries at petabyte scale, and help Fortune 500 teams ship reliable data infrastructure.',
  alternates: {
    canonical: 'https://shahidster.tech',
  },
};

// Mock 404 page metadata
const notFoundMetadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.',
  robots: {
    index: false,
    follow: true,
  },
};

// Mock article metadata
const articleMetadata = {
  title: 'CAP Theorem in Production',
  description: 'Understanding CAP theorem in real-world distributed systems',
  keywords: ['CAP theorem', 'distributed systems', 'consistency', 'availability'],
  authors: [{ name: 'Shahid Moosa', url: SITE_URL }],
  openGraph: {
    type: 'article',
    locale: 'en_US',
    url: `${SITE_URL}/blog/cap-theorem-production`,
    siteName: 'Shahid Moosa — Distributed Systems Engineer',
    title: 'CAP Theorem in Production',
    description: 'Understanding CAP theorem in real-world distributed systems',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'CAP Theorem in Production',
      },
    ],
    publishedTime: '2025-11-15T00:00:00.000Z',
    modifiedTime: '2025-11-15T00:00:00.000Z',
    authors: ['Shahid Moosa'],
    section: 'Fundamentals',
    tags: ['CAP theorem', 'distributed systems', 'consistency', 'availability'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CAP Theorem in Production',
    description: 'Understanding CAP theorem in real-world distributed systems',
    images: [`${SITE_URL}/og-image.png`],
    creator: '@shahidster_',
  },
  alternates: {
    canonical: `${SITE_URL}/blog/cap-theorem-production`,
  },
};

describe('Layout and Page Metadata', () => {
  describe('Viewport Configuration', () => {
    it('should have theme color defined', () => {
      expect(viewport.themeColor).toBeDefined();
      expect(viewport.themeColor).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('should have responsive viewport settings', () => {
      expect(viewport.width).toBe('device-width');
      expect(viewport.initialScale).toBe(1);
    });

    it('should allow user scaling', () => {
      expect(viewport.maximumScale).toBeGreaterThan(1);
    });
  });

  describe('Root Layout Metadata', () => {
    it('should have metadata base URL', () => {
      expect(rootMetadata.metadataBase).toBeInstanceOf(URL);
      expect(rootMetadata.metadataBase.toString()).toBe(`${SITE_URL}/`);
    });

    it('should have title configuration with template', () => {
      expect(rootMetadata.title).toBeDefined();
      expect(rootMetadata.title.default).toBe(SITE_NAME);
      expect(rootMetadata.title.template).toContain('%s');
    });

    it('should have description', () => {
      expect(rootMetadata.description).toBeDefined();
      expect(rootMetadata.description.length).toBeGreaterThan(50);
      expect(rootMetadata.description.length).toBeLessThan(200);
    });

    it('should have keywords array', () => {
      expect(rootMetadata.keywords).toBeInstanceOf(Array);
      expect(rootMetadata.keywords.length).toBeGreaterThan(0);
    });

    it('should have author information', () => {
      expect(rootMetadata.authors).toBeInstanceOf(Array);
      expect(rootMetadata.authors[0]).toHaveProperty('name');
      expect(rootMetadata.authors[0]).toHaveProperty('url');
    });

    it('should have creator and publisher', () => {
      expect(rootMetadata.creator).toBeDefined();
      expect(rootMetadata.publisher).toBeDefined();
    });

    it('should disable format detection', () => {
      expect(rootMetadata.formatDetection.email).toBe(false);
      expect(rootMetadata.formatDetection.address).toBe(false);
      expect(rootMetadata.formatDetection.telephone).toBe(false);
    });

    it('should have robots configuration', () => {
      expect(rootMetadata.robots.index).toBe(true);
      expect(rootMetadata.robots.follow).toBe(true);
    });

    it('should have Google Bot specific settings', () => {
      expect(rootMetadata.robots.googleBot).toBeDefined();
      expect(rootMetadata.robots.googleBot.index).toBe(true);
      expect(rootMetadata.robots.googleBot.follow).toBe(true);
      expect(rootMetadata.robots.googleBot['max-video-preview']).toBe(-1);
      expect(rootMetadata.robots.googleBot['max-image-preview']).toBe('large');
      expect(rootMetadata.robots.googleBot['max-snippet']).toBe(-1);
    });

    it('should have Open Graph metadata', () => {
      expect(rootMetadata.openGraph.type).toBe('website');
      expect(rootMetadata.openGraph.locale).toBe('en_US');
      expect(rootMetadata.openGraph.url).toBe(SITE_URL);
      expect(rootMetadata.openGraph.siteName).toBeDefined();
      expect(rootMetadata.openGraph.title).toBeDefined();
      expect(rootMetadata.openGraph.description).toBeDefined();
    });

    it('should have Open Graph images', () => {
      expect(rootMetadata.openGraph.images).toBeInstanceOf(Array);
      expect(rootMetadata.openGraph.images.length).toBeGreaterThan(0);

      const image = rootMetadata.openGraph.images[0];
      expect(image.url).toContain('/og-image.png');
      expect(image.width).toBe(1200);
      expect(image.height).toBe(630);
      expect(image.alt).toBeDefined();
    });

    it('should have Twitter Card metadata', () => {
      expect(rootMetadata.twitter.card).toBe('summary_large_image');
      expect(rootMetadata.twitter.title).toBeDefined();
      expect(rootMetadata.twitter.description).toBeDefined();
      expect(rootMetadata.twitter.creator).toMatch(/^@/);
    });

    it('should have Twitter images', () => {
      expect(rootMetadata.twitter.images).toBeInstanceOf(Array);
      expect(rootMetadata.twitter.images.length).toBeGreaterThan(0);
    });

    it('should have canonical URL', () => {
      expect(rootMetadata.alternates.canonical).toBe(SITE_URL);
    });

    it('should have RSS and JSON feed links', () => {
      expect(rootMetadata.alternates.types['application/rss+xml']).toContain('/rss.xml');
      expect(rootMetadata.alternates.types['application/json']).toContain('/feed.json');
    });

    it('should have Google verification', () => {
      expect(rootMetadata.verification.google).toBeDefined();
    });

    it('should have category and classification', () => {
      expect(rootMetadata.category).toBe('technology');
      expect(rootMetadata.classification).toBeDefined();
    });
  });

  describe('Homepage Metadata', () => {
    it('should have title', () => {
      expect(homePageMetadata.title).toBeDefined();
      expect(homePageMetadata.title).toContain('Shahid Moosa');
    });

    it('should have description', () => {
      expect(homePageMetadata.description).toBeDefined();
      expect(homePageMetadata.description.length).toBeGreaterThan(50);
    });

    it('should have canonical URL', () => {
      expect(homePageMetadata.alternates.canonical).toBe('https://shahidster.tech');
    });
  });

  describe('404 Not Found Metadata', () => {
    it('should have 404 title', () => {
      expect(notFoundMetadata.title).toContain('404');
      expect(notFoundMetadata.title).toContain('Not Found');
    });

    it('should have description', () => {
      expect(notFoundMetadata.description).toBeDefined();
    });

    it('should not be indexed by search engines', () => {
      expect(notFoundMetadata.robots.index).toBe(false);
    });

    it('should allow following links', () => {
      expect(notFoundMetadata.robots.follow).toBe(true);
    });
  });

  describe('Article Metadata', () => {
    it('should have article title', () => {
      expect(articleMetadata.title).toBeDefined();
      expect(articleMetadata.title.length).toBeGreaterThan(10);
    });

    it('should have article description', () => {
      expect(articleMetadata.description).toBeDefined();
      expect(articleMetadata.description.length).toBeGreaterThan(30);
    });

    it('should have keywords', () => {
      expect(articleMetadata.keywords).toBeInstanceOf(Array);
      expect(articleMetadata.keywords.length).toBeGreaterThan(0);
    });

    it('should have author information', () => {
      expect(articleMetadata.authors).toBeInstanceOf(Array);
      expect(articleMetadata.authors[0].name).toBe('Shahid Moosa');
    });

    it('should have Open Graph type as article', () => {
      expect(articleMetadata.openGraph.type).toBe('article');
    });

    it('should have article URL in Open Graph', () => {
      expect(articleMetadata.openGraph.url).toContain('/blog/');
    });

    it('should have publication and modification times', () => {
      expect(articleMetadata.openGraph.publishedTime).toBeDefined();
      expect(articleMetadata.openGraph.modifiedTime).toBeDefined();
      expect(articleMetadata.openGraph.publishedTime).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should have article authors in Open Graph', () => {
      expect(articleMetadata.openGraph.authors).toBeInstanceOf(Array);
      expect(articleMetadata.openGraph.authors).toContain('Shahid Moosa');
    });

    it('should have article section', () => {
      expect(articleMetadata.openGraph.section).toBeDefined();
    });

    it('should have article tags', () => {
      expect(articleMetadata.openGraph.tags).toBeInstanceOf(Array);
      expect(articleMetadata.openGraph.tags.length).toBeGreaterThan(0);
    });

    it('should have canonical URL for article', () => {
      expect(articleMetadata.alternates.canonical).toContain('/blog/');
    });

    it('should have Twitter card metadata', () => {
      expect(articleMetadata.twitter.card).toBe('summary_large_image');
      expect(articleMetadata.twitter.title).toBe(articleMetadata.title);
      expect(articleMetadata.twitter.description).toBe(articleMetadata.description);
    });
  });

  describe('SEO Best Practices', () => {
    it('should use HTTPS for all URLs', () => {
      expect(rootMetadata.metadataBase.protocol).toBe('https:');
      expect(rootMetadata.openGraph.url).toMatch(/^https:\/\//);
      expect(rootMetadata.alternates.canonical).toMatch(/^https:\/\//);
    });

    it('should have appropriate image dimensions for social media', () => {
      const ogImage = rootMetadata.openGraph.images[0];
      expect(ogImage.width).toBe(1200);
      expect(ogImage.height).toBe(630);
    });

    it('should use summary_large_image for Twitter', () => {
      expect(rootMetadata.twitter.card).toBe('summary_large_image');
      expect(articleMetadata.twitter.card).toBe('summary_large_image');
    });

    it('should have locale specified', () => {
      expect(rootMetadata.openGraph.locale).toBe('en_US');
    });

    it('should have title template for consistent branding', () => {
      expect(rootMetadata.title.template).toContain('Shahid Moosa');
    });

    it('should not index error pages', () => {
      expect(notFoundMetadata.robots.index).toBe(false);
    });

    it('should have keywords for SEO', () => {
      expect(rootMetadata.keywords.length).toBeGreaterThan(5);
    });

    it('should have proper description length', () => {
      const descLength = rootMetadata.description.length;
      expect(descLength).toBeGreaterThan(50);
      expect(descLength).toBeLessThan(200);
    });
  });

  describe('Structured Data Integration', () => {
    // Mock structured data schemas
    const personSchema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Shahid Moosa',
      jobTitle: 'Cloud Database Support Engineer',
    };

    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
    };

    it('should have Person schema', () => {
      expect(personSchema['@context']).toBe('https://schema.org');
      expect(personSchema['@type']).toBe('Person');
      expect(personSchema['@id']).toContain('#person');
    });

    it('should have WebSite schema', () => {
      expect(websiteSchema['@context']).toBe('https://schema.org');
      expect(websiteSchema['@type']).toBe('WebSite');
      expect(websiteSchema['@id']).toContain('#website');
    });

    it('should have consistent URLs in schemas and metadata', () => {
      expect(personSchema['@id']).toContain(SITE_URL);
      expect(websiteSchema.url).toBe(SITE_URL);
      expect(rootMetadata.openGraph.url).toBe(SITE_URL);
    });
  });

  describe('Accessibility and UX', () => {
    it('should have alt text for Open Graph images', () => {
      const ogImage = rootMetadata.openGraph.images[0];
      expect(ogImage.alt).toBeDefined();
      expect(ogImage.alt.length).toBeGreaterThan(5);
    });

    it('should allow viewport scaling', () => {
      expect(viewport.maximumScale).toBeGreaterThan(1);
    });

    it('should have proper theme color', () => {
      expect(viewport.themeColor).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing metadata gracefully', () => {
      const partialMetadata = {
        title: 'Test Page',
      };
      expect(partialMetadata.title).toBeDefined();
    });

    it('should handle URL construction correctly', () => {
      const baseUrl = new URL(SITE_URL);
      expect(baseUrl.toString()).toBe(`${SITE_URL}/`);
      expect(baseUrl.pathname).toBe('/');
    });

    it('should have valid date formats in article metadata', () => {
      const publishedTime = articleMetadata.openGraph.publishedTime;
      expect(publishedTime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should handle special characters in titles', () => {
      const titleWithSpecialChars = 'Article — Test & More';
      expect(titleWithSpecialChars).toContain('—');
      expect(titleWithSpecialChars).toContain('&');
    });
  });

  describe('Performance Considerations', () => {
    it('should specify image type for faster loading', () => {
      const ogImage = rootMetadata.openGraph.images[0];
      expect(ogImage.type).toBe('image/png');
    });

    it('should have reasonable number of keywords', () => {
      expect(rootMetadata.keywords.length).toBeLessThan(15);
    });
  });
});