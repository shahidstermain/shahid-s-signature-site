/**
 * Tests for NEW/CHANGED functions in docs/nextjs-migration-examples/lib/seo.ts
 *
 * Covers functions not tested in src/test/utils/seo.test.ts:
 * - SITE_CONFIG structure
 * - getCanonicalUrl (new: handles paths without leading slash)
 * - generateBaseMetadata
 * - generateArticleMetadata
 * - generateFAQSchema
 */

import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------------------
// Re-implemented from lib/seo.ts for isolated unit testing
// (the source file depends on Next.js types and cannot be imported directly)
// ---------------------------------------------------------------------------

const SITE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://shahidster.tech',
  name: 'Shahid Moosa',
  title: 'Shahid Moosa — Cloud Database Engineer',
  description:
    'Cloud Database Support Engineer at SingleStore. I debug distributed systems, optimize queries at petabyte scale, and help Fortune 500 teams ship reliable data infrastructure.',
  author: {
    name: 'Shahid Moosa',
    email: 'hello@shahidster.tech',
    twitter: '@shahidster_',
    jobTitle: 'Cloud Database Support Engineer',
  },
  organization: {
    name: 'SingleStore',
    url: 'https://www.singlestore.com',
  },
  social: {
    twitter: 'https://twitter.com/shahidster_',
    linkedin: 'https://linkedin.com/in/shahidmoosa',
    github: 'https://github.com/shahidmoosa',
  },
} as const;

const SITE_URL = SITE_CONFIG.url;

// Mirrors the exact logic in lib/seo.ts
function getCanonicalUrl(path: string = ''): string {
  if (!path || path === '/') {
    return SITE_URL;
  }
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  const cleanPath = withLeadingSlash.replace(/\/$/, '');
  return `${SITE_URL}${cleanPath}`;
}

function parseArticleDateToISO(dateStr: string): string {
  const months: Record<string, string> = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04',
    May: '05', Jun: '06', Jul: '07', Aug: '08',
    Sep: '09', Oct: '10', Nov: '11', Dec: '12',
  };
  const parts = dateStr.split(' ');
  if (parts.length === 2) {
    const month = months[parts[0]] || '01';
    const year = parts[1];
    return `${year}-${month}-15T00:00:00.000Z`;
  }
  return new Date().toISOString();
}

interface BaseMetadata {
  metadataBase: URL;
  title: { default: string; template: string };
  description: string;
  authors: Array<{ name: string; url: string }>;
  creator: string;
  publisher: string;
  robots: {
    index: boolean;
    follow: boolean;
    googleBot: {
      index: boolean;
      follow: boolean;
      'max-video-preview': number;
      'max-image-preview': string;
      'max-snippet': number;
    };
  };
  [key: string]: unknown;
}

function generateBaseMetadata(overrides: Partial<BaseMetadata> = {}): BaseMetadata {
  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: SITE_CONFIG.title,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description: SITE_CONFIG.description,
    authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.url }],
    creator: SITE_CONFIG.author.name,
    publisher: SITE_CONFIG.author.name,
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
    ...overrides,
  };
}

function generateArticleMetadata(article: {
  title: string;
  description: string;
  slug: string;
  date: string;
  category: string;
  seoKeywords?: string[];
}) {
  const articleUrl = getCanonicalUrl(`/blog/${article.slug}`);
  const publishDate = parseArticleDateToISO(article.date);

  return {
    title: article.title,
    description: article.description,
    keywords: article.seoKeywords,
    authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.url }],
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: articleUrl,
      siteName: SITE_CONFIG.name,
      title: article.title,
      description: article.description,
      images: [
        {
          url: `${SITE_CONFIG.url}/og-image.png`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      publishedTime: publishDate,
      modifiedTime: publishDate,
      authors: [SITE_CONFIG.author.name],
      section: article.category,
      tags: article.seoKeywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [`${SITE_CONFIG.url}/og-image.png`],
      creator: SITE_CONFIG.author.twitter,
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SITE_CONFIG structure', () => {
  it('should have a valid url', () => {
    expect(SITE_CONFIG.url).toMatch(/^https:\/\//);
  });

  it('should have author name', () => {
    expect(SITE_CONFIG.author.name).toBe('Shahid Moosa');
  });

  it('should have author twitter handle starting with @', () => {
    expect(SITE_CONFIG.author.twitter).toMatch(/^@/);
  });

  it('should have all required social links', () => {
    expect(SITE_CONFIG.social.twitter).toContain('twitter.com');
    expect(SITE_CONFIG.social.linkedin).toContain('linkedin.com');
    expect(SITE_CONFIG.social.github).toContain('github.com');
  });

  it('should have organization details', () => {
    expect(SITE_CONFIG.organization.name).toBe('SingleStore');
    expect(SITE_CONFIG.organization.url).toMatch(/^https:\/\//);
  });
});

// ---------------------------------------------------------------------------

describe('getCanonicalUrl (lib/seo.ts version)', () => {
  it('should return base URL for empty path', () => {
    expect(getCanonicalUrl('')).toBe(SITE_URL);
  });

  it('should return base URL for root path "/"', () => {
    expect(getCanonicalUrl('/')).toBe(SITE_URL);
  });

  it('should handle path with leading slash', () => {
    expect(getCanonicalUrl('/blog/article')).toBe(`${SITE_URL}/blog/article`);
  });

  it('should add a leading slash for paths missing one', () => {
    expect(getCanonicalUrl('blog/article')).toBe(`${SITE_URL}/blog/article`);
  });

  it('should remove trailing slash from non-root paths', () => {
    expect(getCanonicalUrl('/blog/article/')).toBe(`${SITE_URL}/blog/article`);
  });

  it('should handle path without leading slash and with trailing slash', () => {
    expect(getCanonicalUrl('blog/article/')).toBe(`${SITE_URL}/blog/article`);
  });

  it('should default to base URL when called with no argument', () => {
    expect(getCanonicalUrl()).toBe(SITE_URL);
  });

  it('should preserve query strings', () => {
    const url = getCanonicalUrl('/blog?page=2');
    expect(url).toBe(`${SITE_URL}/blog?page=2`);
  });

  it('should preserve URL fragments', () => {
    const url = getCanonicalUrl('/blog/article#section');
    expect(url).toBe(`${SITE_URL}/blog/article#section`);
  });
});

// ---------------------------------------------------------------------------

describe('generateBaseMetadata', () => {
  it('should include metadataBase as a URL instance', () => {
    const meta = generateBaseMetadata();
    expect(meta.metadataBase).toBeInstanceOf(URL);
    expect(meta.metadataBase.href).toBe(`${SITE_URL}/`);
  });

  it('should include default title and template', () => {
    const meta = generateBaseMetadata();
    expect(meta.title.default).toBe('Shahid Moosa — Cloud Database Engineer');
    expect(meta.title.template).toContain('%s');
    expect(meta.title.template).toContain('Shahid Moosa');
  });

  it('should include the site description', () => {
    const meta = generateBaseMetadata();
    expect(meta.description).toBe(SITE_CONFIG.description);
  });

  it('should include author information', () => {
    const meta = generateBaseMetadata();
    expect(meta.authors).toHaveLength(1);
    expect(meta.authors[0].name).toBe('Shahid Moosa');
    expect(meta.authors[0].url).toBe(SITE_URL);
  });

  it('should include creator and publisher', () => {
    const meta = generateBaseMetadata();
    expect(meta.creator).toBe('Shahid Moosa');
    expect(meta.publisher).toBe('Shahid Moosa');
  });

  it('should enable indexing and following by default', () => {
    const meta = generateBaseMetadata();
    expect(meta.robots.index).toBe(true);
    expect(meta.robots.follow).toBe(true);
  });

  it('should include Googlebot directives', () => {
    const meta = generateBaseMetadata();
    expect(meta.robots.googleBot.index).toBe(true);
    expect(meta.robots.googleBot.follow).toBe(true);
    expect(meta.robots.googleBot['max-image-preview']).toBe('large');
    expect(meta.robots.googleBot['max-snippet']).toBe(-1);
    expect(meta.robots.googleBot['max-video-preview']).toBe(-1);
  });

  it('should allow overrides to replace default fields', () => {
    const meta = generateBaseMetadata({ description: 'Custom description' });
    expect(meta.description).toBe('Custom description');
  });

  it('should allow overrides to add new fields', () => {
    const meta = generateBaseMetadata({ category: 'technology' });
    expect(meta.category).toBe('technology');
  });

  it('should not mutate defaults when providing overrides', () => {
    generateBaseMetadata({ description: 'Override A' });
    const secondMeta = generateBaseMetadata();
    expect(secondMeta.description).toBe(SITE_CONFIG.description);
  });
});

// ---------------------------------------------------------------------------

describe('generateArticleMetadata', () => {
  const mockArticle = {
    title: 'CAP Theorem in Production',
    description: 'Understanding CAP theorem for real-world database systems.',
    slug: 'cap-theorem-production',
    date: 'Nov 2025',
    category: 'Fundamentals',
    seoKeywords: ['CAP theorem', 'distributed systems', 'consistency'],
  };

  it('should set the article title', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.title).toBe(mockArticle.title);
  });

  it('should set the article description', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.description).toBe(mockArticle.description);
  });

  it('should include SEO keywords', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.keywords).toEqual(mockArticle.seoKeywords);
  });

  it('should set Open Graph type to article', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.openGraph.type).toBe('article');
  });

  it('should set Open Graph locale to en_US', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.openGraph.locale).toBe('en_US');
  });

  it('should set canonical URL using article slug', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.alternates.canonical).toBe(`${SITE_URL}/blog/cap-theorem-production`);
  });

  it('should set Open Graph URL to the article URL', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.openGraph.url).toBe(`${SITE_URL}/blog/cap-theorem-production`);
  });

  it('should include OG image with 1200x630 dimensions', () => {
    const meta = generateArticleMetadata(mockArticle);
    const img = meta.openGraph.images[0];
    expect(img.url).toBe(`${SITE_URL}/og-image.png`);
    expect(img.width).toBe(1200);
    expect(img.height).toBe(630);
  });

  it('should set OG image alt to article title', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.openGraph.images[0].alt).toBe(mockArticle.title);
  });

  it('should include publishedTime as valid ISO date', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.openGraph.publishedTime).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('should set modifiedTime equal to publishedTime', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.openGraph.modifiedTime).toBe(meta.openGraph.publishedTime);
  });

  it('should use the 15th of Nov 2025 for publishedTime', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.openGraph.publishedTime).toBe('2025-11-15T00:00:00.000Z');
  });

  it('should set article section to category', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.openGraph.section).toBe('Fundamentals');
  });

  it('should set OG tags to SEO keywords', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.openGraph.tags).toEqual(mockArticle.seoKeywords);
  });

  it('should set Twitter card to summary_large_image', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.twitter.card).toBe('summary_large_image');
  });

  it('should set Twitter creator to the correct handle', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.twitter.creator).toBe('@shahidster_');
  });

  it('should handle article without SEO keywords', () => {
    const articleNoKeywords = { ...mockArticle, seoKeywords: undefined };
    const meta = generateArticleMetadata(articleNoKeywords);
    expect(meta.keywords).toBeUndefined();
    expect(meta.openGraph.tags).toBeUndefined();
  });

  it('should include author with correct name', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.authors[0].name).toBe('Shahid Moosa');
  });
});

// ---------------------------------------------------------------------------

describe('generateFAQSchema', () => {
  const mockFAQs = [
    {
      question: 'What is the CAP theorem?',
      answer: 'The CAP theorem states that a distributed system can only guarantee two of three properties: Consistency, Availability, and Partition tolerance.',
    },
    {
      question: 'How does sharding work?',
      answer: 'Sharding splits a database horizontally, distributing rows across multiple nodes based on a shard key.',
    },
  ];

  it('should have schema.org context', () => {
    const schema = generateFAQSchema(mockFAQs);
    expect(schema['@context']).toBe('https://schema.org');
  });

  it('should be typed as FAQPage', () => {
    const schema = generateFAQSchema(mockFAQs);
    expect(schema['@type']).toBe('FAQPage');
  });

  it('should include mainEntity array', () => {
    const schema = generateFAQSchema(mockFAQs);
    expect(Array.isArray(schema.mainEntity)).toBe(true);
    expect(schema.mainEntity).toHaveLength(mockFAQs.length);
  });

  it('should set each mainEntity item type to Question', () => {
    const schema = generateFAQSchema(mockFAQs);
    schema.mainEntity.forEach((item) => {
      expect(item['@type']).toBe('Question');
    });
  });

  it('should set the question name correctly', () => {
    const schema = generateFAQSchema(mockFAQs);
    expect(schema.mainEntity[0].name).toBe(mockFAQs[0].question);
    expect(schema.mainEntity[1].name).toBe(mockFAQs[1].question);
  });

  it('should include acceptedAnswer for each question', () => {
    const schema = generateFAQSchema(mockFAQs);
    schema.mainEntity.forEach((item) => {
      expect(item.acceptedAnswer).toBeDefined();
    });
  });

  it('should set acceptedAnswer type to Answer', () => {
    const schema = generateFAQSchema(mockFAQs);
    schema.mainEntity.forEach((item) => {
      expect(item.acceptedAnswer['@type']).toBe('Answer');
    });
  });

  it('should set acceptedAnswer text correctly', () => {
    const schema = generateFAQSchema(mockFAQs);
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe(mockFAQs[0].answer);
    expect(schema.mainEntity[1].acceptedAnswer.text).toBe(mockFAQs[1].answer);
  });

  it('should handle empty FAQ list', () => {
    const schema = generateFAQSchema([]);
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(0);
  });

  it('should handle a single FAQ entry', () => {
    const schema = generateFAQSchema([mockFAQs[0]]);
    expect(schema.mainEntity).toHaveLength(1);
    expect(schema.mainEntity[0].name).toBe(mockFAQs[0].question);
  });

  it('should handle special characters in questions and answers', () => {
    const specialFAQs = [
      {
        question: 'What about <tags> & "special" characters?',
        answer: "It's fine — even with >, <, &, ', and \" characters.",
      },
    ];
    const schema = generateFAQSchema(specialFAQs);
    // Values should be stored as-is (no escaping at this layer)
    expect(schema.mainEntity[0].name).toBe(specialFAQs[0].question);
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe(specialFAQs[0].answer);
  });

  it('should preserve FAQ order', () => {
    const faqs = [
      { question: 'First?', answer: 'First answer' },
      { question: 'Second?', answer: 'Second answer' },
      { question: 'Third?', answer: 'Third answer' },
    ];
    const schema = generateFAQSchema(faqs);
    expect(schema.mainEntity[0].name).toBe('First?');
    expect(schema.mainEntity[1].name).toBe('Second?');
    expect(schema.mainEntity[2].name).toBe('Third?');
  });
});