/**
 * Extended tests for SEO utility functions from lib/seo.ts
 * (docs/nextjs-migration-examples/lib/seo.ts)
 *
 * Covers functions not already exercised in seo.test.ts:
 *   - generateBaseMetadata
 *   - generateArticleMetadata
 *   - generateFAQSchema
 *   - trackPageView / trackEvent (window.gtag interaction)
 *   - getCanonicalUrl – path without leading slash (unique to seo.ts implementation)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const SITE_URL = 'https://shahidster.tech';

// ─── Replicated implementation ────────────────────────────────────────────────
// Functions are replicated here because docs/ is outside the vitest include path.

const SITE_CONFIG = {
  url: SITE_URL,
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

function getCanonicalUrl(path: string = ''): string {
  if (!path || path === '/') return SITE_CONFIG.url;
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  const cleanPath = withLeadingSlash.replace(/\/$/, '');
  return `${SITE_CONFIG.url}${cleanPath}`;
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

// generateBaseMetadata
function generateBaseMetadata(overrides: Record<string, unknown> = {}) {
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

// generateArticleMetadata
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

// generateFAQSchema
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

// trackPageView / trackEvent (window.gtag wrappers)
function trackPageView(url: string, title?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-FAKE', { page_path: url, page_title: title });
  }
}

function trackEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean>,
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('getCanonicalUrl – path without leading slash', () => {
  it('should prepend a leading slash when the path has none', () => {
    expect(getCanonicalUrl('blog/my-article')).toBe(`${SITE_URL}/blog/my-article`);
  });

  it('should prepend slash and strip trailing slash from bare path', () => {
    expect(getCanonicalUrl('blog/my-article/')).toBe(`${SITE_URL}/blog/my-article`);
  });

  it('should treat a path that is only a slash as the root URL', () => {
    expect(getCanonicalUrl('/')).toBe(SITE_URL);
  });

  it('should treat an empty string as the root URL', () => {
    expect(getCanonicalUrl('')).toBe(SITE_URL);
  });

  it('should treat undefined (default param) as the root URL', () => {
    expect(getCanonicalUrl()).toBe(SITE_URL);
  });

  it('should not double-slash when given a path that already starts with /', () => {
    const url = getCanonicalUrl('/blog/article');
    expect(url).toBe(`${SITE_URL}/blog/article`);
    expect(url.replace('https://', '')).not.toContain('//');
  });
});

describe('generateBaseMetadata', () => {
  it('should include metadataBase set to the site URL', () => {
    const meta = generateBaseMetadata();
    expect(meta.metadataBase.href).toContain(SITE_URL);
  });

  it('should set the default title to the site title', () => {
    const meta = generateBaseMetadata();
    expect((meta.title as { default: string }).default).toBe(SITE_CONFIG.title);
  });

  it('should include a title template with the site name', () => {
    const meta = generateBaseMetadata();
    expect((meta.title as { template: string }).template).toContain(SITE_CONFIG.name);
  });

  it('should include the site description', () => {
    const meta = generateBaseMetadata();
    expect(meta.description).toBe(SITE_CONFIG.description);
  });

  it('should include the author name and url', () => {
    const meta = generateBaseMetadata();
    expect(meta.authors).toHaveLength(1);
    expect(meta.authors[0].name).toBe(SITE_CONFIG.author.name);
    expect(meta.authors[0].url).toBe(SITE_CONFIG.url);
  });

  it('should set creator and publisher to the author name', () => {
    const meta = generateBaseMetadata();
    expect(meta.creator).toBe(SITE_CONFIG.author.name);
    expect(meta.publisher).toBe(SITE_CONFIG.author.name);
  });

  it('should include robots directives that allow indexing', () => {
    const meta = generateBaseMetadata();
    expect(meta.robots.index).toBe(true);
    expect(meta.robots.follow).toBe(true);
    expect(meta.robots.googleBot.index).toBe(true);
    expect(meta.robots.googleBot.follow).toBe(true);
  });

  it('should allow overriding the description via overrides', () => {
    const meta = generateBaseMetadata({ description: 'Custom description' });
    expect(meta.description).toBe('Custom description');
  });

  it('should allow overriding the title via overrides', () => {
    const meta = generateBaseMetadata({ title: 'Custom Page Title' });
    expect(meta.title).toBe('Custom Page Title');
  });

  it('should allow adding extra properties via overrides', () => {
    const meta = generateBaseMetadata({ extraProp: 'extra' });
    expect((meta as Record<string, unknown>).extraProp).toBe('extra');
  });
});

describe('generateArticleMetadata', () => {
  const mockArticle = {
    title: 'Understanding CAP Theorem',
    description: 'A deep dive into the CAP theorem',
    slug: 'cap-theorem-production',
    date: 'Nov 2025',
    category: 'Fundamentals',
    seoKeywords: ['CAP theorem', 'distributed systems'],
  };

  it('should set title to the article title', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.title).toBe(mockArticle.title);
  });

  it('should set description to the article description', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.description).toBe(mockArticle.description);
  });

  it('should include SEO keywords', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.keywords).toEqual(mockArticle.seoKeywords);
  });

  it('should include the author', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.authors[0].name).toBe(SITE_CONFIG.author.name);
  });

  it('should set Open Graph type to article', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.openGraph.type).toBe('article');
  });

  it('should set Open Graph locale to en_US', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.openGraph.locale).toBe('en_US');
  });

  it('should set Open Graph url to the canonical article URL', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.openGraph.url).toBe(`${SITE_URL}/blog/cap-theorem-production`);
  });

  it('should set Open Graph siteName to the site name', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.openGraph.siteName).toBe(SITE_CONFIG.name);
  });

  it('should include OG image with correct dimensions', () => {
    const meta = generateArticleMetadata(mockArticle);
    const img = meta.openGraph.images[0];
    expect(img.url).toBe(`${SITE_URL}/og-image.png`);
    expect(img.width).toBe(1200);
    expect(img.height).toBe(630);
  });

  it('should set publishedTime from the article date', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.openGraph.publishedTime).toBe('2025-11-15T00:00:00.000Z');
  });

  it('should set modifiedTime equal to publishedTime', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.openGraph.modifiedTime).toBe(meta.openGraph.publishedTime);
  });

  it('should list the author in OG authors', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.openGraph.authors).toContain(SITE_CONFIG.author.name);
  });

  it('should set OG section to the article category', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.openGraph.section).toBe(mockArticle.category);
  });

  it('should set OG tags to the seoKeywords', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.openGraph.tags).toEqual(mockArticle.seoKeywords);
  });

  it('should produce Twitter large card metadata', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.twitter.card).toBe('summary_large_image');
    expect(meta.twitter.title).toBe(mockArticle.title);
    expect(meta.twitter.creator).toBe(SITE_CONFIG.author.twitter);
  });

  it('should set canonical URL in alternates', () => {
    const meta = generateArticleMetadata(mockArticle);
    expect(meta.alternates.canonical).toBe(`${SITE_URL}/blog/cap-theorem-production`);
  });

  it('should handle article without seoKeywords', () => {
    const articleNoKeywords = { ...mockArticle, seoKeywords: undefined };
    const meta = generateArticleMetadata(articleNoKeywords);
    expect(meta.keywords).toBeUndefined();
    expect(meta.openGraph.tags).toBeUndefined();
  });
});

describe('generateFAQSchema', () => {
  it('should use schema.org context', () => {
    const schema = generateFAQSchema([]);
    expect(schema['@context']).toBe('https://schema.org');
  });

  it('should be of type FAQPage', () => {
    const schema = generateFAQSchema([]);
    expect(schema['@type']).toBe('FAQPage');
  });

  it('should create a Question entry for each FAQ item', () => {
    const faqs = [
      { question: 'What is CAP theorem?', answer: 'It describes a trade-off...' },
      { question: 'What is sharding?', answer: 'Horizontal partitioning...' },
    ];
    const schema = generateFAQSchema(faqs);
    expect(schema.mainEntity).toHaveLength(2);
  });

  it('should map question text to the Question name field', () => {
    const faqs = [{ question: 'What is CAP theorem?', answer: 'A trade-off...' }];
    const schema = generateFAQSchema(faqs);
    expect(schema.mainEntity[0]['@type']).toBe('Question');
    expect(schema.mainEntity[0].name).toBe('What is CAP theorem?');
  });

  it('should map answer text to the acceptedAnswer text field', () => {
    const faqs = [{ question: 'Q?', answer: 'The answer.' }];
    const schema = generateFAQSchema(faqs);
    expect(schema.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe('The answer.');
  });

  it('should handle an empty FAQ list', () => {
    const schema = generateFAQSchema([]);
    expect(schema.mainEntity).toEqual([]);
  });

  it('should handle a single FAQ entry', () => {
    const faqs = [{ question: 'Single Q?', answer: 'Single A.' }];
    const schema = generateFAQSchema(faqs);
    expect(schema.mainEntity).toHaveLength(1);
  });

  it('should preserve the order of FAQ entries', () => {
    const faqs = [
      { question: 'Q1', answer: 'A1' },
      { question: 'Q2', answer: 'A2' },
      { question: 'Q3', answer: 'A3' },
    ];
    const schema = generateFAQSchema(faqs);
    expect(schema.mainEntity[0].name).toBe('Q1');
    expect(schema.mainEntity[1].name).toBe('Q2');
    expect(schema.mainEntity[2].name).toBe('Q3');
  });

  it('should handle FAQs with special characters in text', () => {
    const faqs = [{ question: 'What is "<CAP>"?', answer: 'It & more' }];
    const schema = generateFAQSchema(faqs);
    expect(schema.mainEntity[0].name).toBe('What is "<CAP>"?');
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe('It & more');
  });
});

describe('trackPageView', () => {
  let gtagSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    gtagSpy = vi.fn();
    (window as Window & { gtag?: typeof gtagSpy }).gtag = gtagSpy;
  });

  afterEach(() => {
    delete (window as Window & { gtag?: typeof gtagSpy }).gtag;
  });

  it('should call window.gtag when it is defined', () => {
    trackPageView('/blog/cap-theorem');
    expect(gtagSpy).toHaveBeenCalledTimes(1);
  });

  it('should call gtag with the "config" command', () => {
    trackPageView('/some-page');
    expect(gtagSpy.mock.calls[0][0]).toBe('config');
  });

  it('should pass page_path in the config object', () => {
    trackPageView('/about');
    const configArg = gtagSpy.mock.calls[0][2] as Record<string, unknown>;
    expect(configArg.page_path).toBe('/about');
  });

  it('should pass page_title when provided', () => {
    trackPageView('/about', 'About Me');
    const configArg = gtagSpy.mock.calls[0][2] as Record<string, unknown>;
    expect(configArg.page_title).toBe('About Me');
  });

  it('should not throw when gtag is not available', () => {
    delete (window as Window & { gtag?: typeof gtagSpy }).gtag;
    expect(() => trackPageView('/page')).not.toThrow();
  });
});

describe('trackEvent', () => {
  let gtagSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    gtagSpy = vi.fn();
    (window as Window & { gtag?: typeof gtagSpy }).gtag = gtagSpy;
  });

  afterEach(() => {
    delete (window as Window & { gtag?: typeof gtagSpy }).gtag;
  });

  it('should call window.gtag when it is defined', () => {
    trackEvent('article_view');
    expect(gtagSpy).toHaveBeenCalledTimes(1);
  });

  it('should call gtag with the "event" command', () => {
    trackEvent('click');
    expect(gtagSpy.mock.calls[0][0]).toBe('event');
  });

  it('should pass the event name as the second argument', () => {
    trackEvent('page_scroll');
    expect(gtagSpy.mock.calls[0][1]).toBe('page_scroll');
  });

  it('should forward event params as the third argument', () => {
    const params = { category: 'blog', value: 1, logged_in: false };
    trackEvent('article_view', params);
    expect(gtagSpy.mock.calls[0][2]).toEqual(params);
  });

  it('should work without event params', () => {
    expect(() => trackEvent('simple_event')).not.toThrow();
    expect(gtagSpy).toHaveBeenCalledWith('event', 'simple_event', undefined);
  });

  it('should not throw when gtag is not available', () => {
    delete (window as Window & { gtag?: typeof gtagSpy }).gtag;
    expect(() => trackEvent('some_event')).not.toThrow();
  });

  it('should handle event names with special characters', () => {
    trackEvent('event-with_special.chars');
    expect(gtagSpy.mock.calls[0][1]).toBe('event-with_special.chars');
  });
});