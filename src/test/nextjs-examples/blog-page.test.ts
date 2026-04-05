/**
 * Tests for Next.js App Router Dynamic Blog Post Page
 * Testing: parseArticleDate, formatContent, getSeriesNavigation,
 *          getArticleSchema, getBreadcrumbSchema, generateStaticParams,
 *          generateMetadata
 */

import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------------------
// Constants mirroring page.tsx
// ---------------------------------------------------------------------------
const SITE_URL = 'https://shahidster.tech';
const AUTHOR_NAME = 'Shahid Moosa';
const TWITTER_HANDLE = '@shahidster_';

// ---------------------------------------------------------------------------
// Pure functions re-implemented from page.tsx for isolated unit testing
// (page.tsx cannot be imported directly because it depends on Next.js modules)
// ---------------------------------------------------------------------------

function parseArticleDate(dateStr: string): Date {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const [month, year] = dateStr.split(' ');
  return new Date(parseInt(year), months[month] || 0, 15);
}

function formatContent(content: string): string {
  return content
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/^---$/gm, '<hr />')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hpuoltb])(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>\s*<\/p>/g, '');
}

interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  date: string;
  featured?: boolean;
  seriesPosition?: string;
  seoKeywords?: string[];
  content: string;
}

const mockArticles: Article[] = [
  {
    slug: 'first-article',
    title: 'First Article',
    description: 'First article description',
    category: 'Testing',
    readTime: '5 min read',
    date: 'Jan 2024',
    featured: true,
    seriesPosition: 'Part 1 of 3',
    seoKeywords: ['test', 'article'],
    content: '## Introduction\n\nThis is the first article content.\n\n**Bold text** and `code`.',
  },
  {
    slug: 'second-article',
    title: 'Second Article',
    description: 'Second article description',
    category: 'Testing',
    readTime: '8 min read',
    date: 'Feb 2024',
    featured: false,
    seoKeywords: ['second', 'article'],
    content: 'Second article content',
  },
  {
    slug: 'third-article',
    title: 'Third Article',
    description: 'Article with special characters',
    category: 'Advanced',
    readTime: '10 min read',
    date: 'Mar 2024',
    featured: false,
    content: 'Third article content',
  },
];

function getSeriesNavigation(currentSlug: string) {
  const currentIndex = mockArticles.findIndex((a) => a.slug === currentSlug);
  return {
    prev: currentIndex > 0 ? mockArticles[currentIndex - 1] : null,
    next: currentIndex < mockArticles.length - 1 ? mockArticles[currentIndex + 1] : null,
    currentIndex: currentIndex + 1,
    total: mockArticles.length,
  };
}

function getArticleSchema(article: Article, currentIndex: number, total: number) {
  const publishDate = parseArticleDate(article.date).toISOString();
  const articleUrl = `${SITE_URL}/blog/${article.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.description,
    articleSection: article.category,
    keywords: article.seoKeywords,
    datePublished: publishDate,
    dateModified: publishDate,
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    url: articleUrl,
    inLanguage: 'en-US',
    wordCount: article.content.split(/\s+/).length,
    isPartOf: {
      '@type': 'CreativeWorkSeries',
      name: 'Distributed Systems Series',
      position: currentIndex,
      numberOfItems: total,
    },
  };
}

function getBreadcrumbSchema(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Writing',
        item: `${SITE_URL}/#writing`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `${SITE_URL}/blog/${article.slug}`,
      },
    ],
  };
}

function generateStaticParams(articles: Article[]) {
  return articles.map((article) => ({ slug: article.slug }));
}

// Simulated generateMetadata logic (mirrors page.tsx without Next.js dependencies)
async function generateMetadata(
  slug: string,
  articles: Article[],
  parentImages: string[] = []
) {
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
      robots: { index: false, follow: true },
    };
  }

  const articleUrl = `${SITE_URL}/blog/${article.slug}`;
  const publishDate = parseArticleDate(article.date).toISOString();

  return {
    title: article.title,
    description: article.description,
    keywords: article.seoKeywords,
    authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: articleUrl,
      siteName: `${AUTHOR_NAME} — Distributed Systems Engineer`,
      title: article.title,
      description: article.description,
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
        ...parentImages.map((url) => ({ url })),
      ],
      publishedTime: publishDate,
      modifiedTime: publishDate,
      authors: [AUTHOR_NAME],
      section: article.category,
      tags: article.seoKeywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [`${SITE_URL}/og-image.png`],
      creator: TWITTER_HANDLE,
    },
    alternates: {
      canonical: articleUrl,
    },
    other: {
      'article:author': AUTHOR_NAME,
      'article:published_time': publishDate,
      'article:section': article.category,
    },
  };
}

// ---------------------------------------------------------------------------
// Test Suites
// ---------------------------------------------------------------------------

describe('Blog Post Page - parseArticleDate', () => {
  it('should return a Date set to the 15th of the given month', () => {
    const date = parseArticleDate('Jan 2024');
    expect(date.getDate()).toBe(15);
  });

  it('should parse all 12 months correctly', () => {
    const cases: [string, number][] = [
      ['Jan 2024', 0], ['Feb 2024', 1], ['Mar 2024', 2],
      ['Apr 2024', 3], ['May 2024', 4], ['Jun 2024', 5],
      ['Jul 2024', 6], ['Aug 2024', 7], ['Sep 2024', 8],
      ['Oct 2024', 9], ['Nov 2024', 10], ['Dec 2024', 11],
    ];

    cases.forEach(([dateStr, expectedMonth]) => {
      const date = parseArticleDate(dateStr);
      expect(date.getMonth()).toBe(expectedMonth);
      expect(date.getFullYear()).toBe(2024);
    });
  });

  it('should default unrecognized month to January (month index 0)', () => {
    const date = parseArticleDate('Xyz 2024');
    expect(date.getMonth()).toBe(0); // January
    expect(date.getFullYear()).toBe(2024);
  });

  it('should parse the year correctly', () => {
    const date = parseArticleDate('Nov 2025');
    expect(date.getFullYear()).toBe(2025);
    expect(date.getMonth()).toBe(10); // November
  });

  it('should produce a valid Date object', () => {
    const date = parseArticleDate('Jun 2023');
    expect(date).toBeInstanceOf(Date);
    expect(isNaN(date.getTime())).toBe(false);
  });
});

// ---------------------------------------------------------------------------

describe('Blog Post Page - formatContent', () => {
  describe('Heading conversion', () => {
    it('should convert ## headings to <h2>', () => {
      const result = formatContent('## My Heading');
      expect(result).toContain('<h2>My Heading</h2>');
    });

    it('should convert ### headings to <h3>', () => {
      const result = formatContent('### Sub Heading');
      expect(result).toContain('<h3>Sub Heading</h3>');
    });

    it('should not convert # single-hash headings to h1', () => {
      const result = formatContent('# Top Level');
      // The regex only handles ## and ###
      expect(result).not.toContain('<h1>');
    });
  });

  describe('Inline formatting', () => {
    it('should convert **bold** to <strong>', () => {
      const result = formatContent('**bold text**');
      expect(result).toContain('<strong>bold text</strong>');
    });

    it('should convert `inline code` to <code>', () => {
      const result = formatContent('`inline code`');
      expect(result).toContain('<code>inline code</code>');
    });
  });

  describe('Block elements', () => {
    it('should convert fenced code blocks to <pre><code>', () => {
      const input = '```js\nconst x = 1;\n```';
      const result = formatContent(input);
      expect(result).toContain('<pre><code>');
      expect(result).toContain('</code></pre>');
    });

    it('should convert --- to <hr />', () => {
      const result = formatContent('---');
      expect(result).toContain('<hr />');
    });

    it('should convert > blockquotes to <blockquote>', () => {
      const result = formatContent('> This is a quote');
      expect(result).toContain('<blockquote>This is a quote</blockquote>');
    });

    it('should convert - list items to <li> wrapped in <ul>', () => {
      const input = '- Item one\n- Item two';
      const result = formatContent(input);
      expect(result).toContain('<li>Item one</li>');
      expect(result).toContain('<li>Item two</li>');
      expect(result).toContain('<ul>');
      expect(result).toContain('</ul>');
    });
  });

  describe('Paragraph handling', () => {
    it('should split double newlines into paragraph breaks', () => {
      const input = 'First paragraph\n\nSecond paragraph';
      const result = formatContent(input);
      expect(result).toContain('</p><p>');
    });

    it('should remove empty <p> tags', () => {
      const input = 'Line\n\n';
      const result = formatContent(input);
      expect(result).not.toContain('<p></p>');
    });
  });

  describe('Combined formatting', () => {
    it('should handle multiple formatting types in one document', () => {
      const input = '## Heading\n\n**Bold** and `code`\n\n- List item';
      const result = formatContent(input);
      expect(result).toContain('<h2>Heading</h2>');
      expect(result).toContain('<strong>Bold</strong>');
      expect(result).toContain('<code>code</code>');
      expect(result).toContain('<li>List item</li>');
    });

    it('should not double-wrap already-converted headings', () => {
      const result = formatContent('## Clean Heading');
      const h2Count = (result.match(/<h2>/g) || []).length;
      expect(h2Count).toBe(1);
    });
  });
});

// ---------------------------------------------------------------------------

describe('Blog Post Page - getSeriesNavigation', () => {
  it('should return null for prev when on the first article', () => {
    const nav = getSeriesNavigation('first-article');
    expect(nav.prev).toBeNull();
  });

  it('should return the next article when on the first article', () => {
    const nav = getSeriesNavigation('first-article');
    expect(nav.next?.slug).toBe('second-article');
  });

  it('should return the previous article when on the last article', () => {
    const nav = getSeriesNavigation('third-article');
    expect(nav.prev?.slug).toBe('second-article');
  });

  it('should return null for next when on the last article', () => {
    const nav = getSeriesNavigation('third-article');
    expect(nav.next).toBeNull();
  });

  it('should return both prev and next for a middle article', () => {
    const nav = getSeriesNavigation('second-article');
    expect(nav.prev?.slug).toBe('first-article');
    expect(nav.next?.slug).toBe('third-article');
  });

  it('should return 1-based currentIndex', () => {
    const first = getSeriesNavigation('first-article');
    expect(first.currentIndex).toBe(1);

    const second = getSeriesNavigation('second-article');
    expect(second.currentIndex).toBe(2);

    const third = getSeriesNavigation('third-article');
    expect(third.currentIndex).toBe(3);
  });

  it('should return the total count of articles', () => {
    const nav = getSeriesNavigation('first-article');
    expect(nav.total).toBe(mockArticles.length);
  });

  it('should return currentIndex of 0 (not found becomes index -1 + 1 = 0) for unknown slug', () => {
    const nav = getSeriesNavigation('non-existent-slug');
    // findIndex returns -1 → currentIndex = 0, prev = null (index < 0 is false), next = articles[0-1] which is articles[-2] = undefined
    expect(nav.currentIndex).toBe(0);
    expect(nav.prev).toBeNull();
  });
});

// ---------------------------------------------------------------------------

describe('Blog Post Page - getArticleSchema', () => {
  const article = mockArticles[0];
  const schema = getArticleSchema(article, 1, 3);

  it('should have schema.org context', () => {
    expect(schema['@context']).toBe('https://schema.org');
  });

  it('should be typed as TechArticle', () => {
    expect(schema['@type']).toBe('TechArticle');
  });

  it('should include article headline matching title', () => {
    expect(schema.headline).toBe(article.title);
  });

  it('should include article description', () => {
    expect(schema.description).toBe(article.description);
  });

  it('should include articleSection matching category', () => {
    expect(schema.articleSection).toBe(article.category);
  });

  it('should include SEO keywords', () => {
    expect(schema.keywords).toEqual(article.seoKeywords);
  });

  it('should include valid datePublished ISO string', () => {
    expect(schema.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('should set dateModified equal to datePublished', () => {
    expect(schema.dateModified).toBe(schema.datePublished);
  });

  it('should include author with correct name and URL', () => {
    expect(schema.author['@type']).toBe('Person');
    expect(schema.author.name).toBe(AUTHOR_NAME);
    expect(schema.author.url).toBe(SITE_URL);
  });

  it('should include mainEntityOfPage with article URL', () => {
    expect(schema.mainEntityOfPage['@type']).toBe('WebPage');
    expect(schema.mainEntityOfPage['@id']).toContain(article.slug);
  });

  it('should set url to the correct article URL', () => {
    expect(schema.url).toBe(`${SITE_URL}/blog/${article.slug}`);
  });

  it('should set inLanguage to en-US', () => {
    expect(schema.inLanguage).toBe('en-US');
  });

  it('should calculate wordCount from article content', () => {
    const expectedWordCount = article.content.split(/\s+/).length;
    expect(schema.wordCount).toBe(expectedWordCount);
  });

  it('should include isPartOf with correct series position', () => {
    expect(schema.isPartOf['@type']).toBe('CreativeWorkSeries');
    expect(schema.isPartOf.position).toBe(1);
    expect(schema.isPartOf.numberOfItems).toBe(3);
  });

  it('should reflect the passed currentIndex and total in isPartOf', () => {
    const schema2 = getArticleSchema(article, 2, 5);
    expect(schema2.isPartOf.position).toBe(2);
    expect(schema2.isPartOf.numberOfItems).toBe(5);
  });

  it('should use the article slug in the URL', () => {
    expect(schema.url).toContain(article.slug);
  });
});

// ---------------------------------------------------------------------------

describe('Blog Post Page - getBreadcrumbSchema', () => {
  const article = mockArticles[0];
  const breadcrumb = getBreadcrumbSchema(article);

  it('should have schema.org context', () => {
    expect(breadcrumb['@context']).toBe('https://schema.org');
  });

  it('should be typed as BreadcrumbList', () => {
    expect(breadcrumb['@type']).toBe('BreadcrumbList');
  });

  it('should have exactly 3 items', () => {
    expect(breadcrumb.itemListElement).toHaveLength(3);
  });

  it('should have Home as first breadcrumb at position 1', () => {
    const first = breadcrumb.itemListElement[0];
    expect(first.position).toBe(1);
    expect(first.name).toBe('Home');
    expect(first.item).toBe(SITE_URL);
  });

  it('should have Writing section as second breadcrumb at position 2', () => {
    const second = breadcrumb.itemListElement[1];
    expect(second.position).toBe(2);
    expect(second.name).toBe('Writing');
    expect(second.item).toBe(`${SITE_URL}/#writing`);
  });

  it('should have article title as third breadcrumb at position 3', () => {
    const third = breadcrumb.itemListElement[2];
    expect(third.position).toBe(3);
    expect(third.name).toBe(article.title);
    expect(third.item).toBe(`${SITE_URL}/blog/${article.slug}`);
  });

  it('should assign ListItem type to all breadcrumb items', () => {
    breadcrumb.itemListElement.forEach((item) => {
      expect(item['@type']).toBe('ListItem');
    });
  });

  it('should reflect different article slugs correctly', () => {
    const otherArticle = mockArticles[1];
    const breadcrumb2 = getBreadcrumbSchema(otherArticle);
    const third = breadcrumb2.itemListElement[2];
    expect(third.name).toBe(otherArticle.title);
    expect(third.item).toContain(otherArticle.slug);
  });
});

// ---------------------------------------------------------------------------

describe('Blog Post Page - generateStaticParams', () => {
  it('should generate one param object per article', () => {
    const params = generateStaticParams(mockArticles);
    expect(params).toHaveLength(mockArticles.length);
  });

  it('should return array of objects with slug property', () => {
    const params = generateStaticParams(mockArticles);
    params.forEach((param) => {
      expect(param).toHaveProperty('slug');
      expect(typeof param.slug).toBe('string');
    });
  });

  it('should map each article slug correctly', () => {
    const params = generateStaticParams(mockArticles);
    expect(params).toEqual([
      { slug: 'first-article' },
      { slug: 'second-article' },
      { slug: 'third-article' },
    ]);
  });

  it('should return an empty array for empty articles', () => {
    const params = generateStaticParams([]);
    expect(params).toEqual([]);
  });

  it('should handle a single article', () => {
    const params = generateStaticParams([mockArticles[0]]);
    expect(params).toEqual([{ slug: 'first-article' }]);
  });
});

// ---------------------------------------------------------------------------

describe('Blog Post Page - generateMetadata', () => {
  describe('Existing article', () => {
    it('should return the article title as metadata title', async () => {
      const meta = await generateMetadata('first-article', mockArticles);
      expect(meta.title).toBe('First Article');
    });

    it('should return the article description', async () => {
      const meta = await generateMetadata('first-article', mockArticles);
      expect(meta.description).toBe('First article description');
    });

    it('should include SEO keywords', async () => {
      const meta = await generateMetadata('first-article', mockArticles);
      expect(meta.keywords).toEqual(['test', 'article']);
    });

    it('should set Open Graph type to article', async () => {
      const meta = await generateMetadata('first-article', mockArticles);
      expect(meta.openGraph?.type).toBe('article');
    });

    it('should set Open Graph locale to en_US', async () => {
      const meta = await generateMetadata('first-article', mockArticles);
      expect(meta.openGraph?.locale).toBe('en_US');
    });

    it('should set correct Open Graph URL', async () => {
      const meta = await generateMetadata('first-article', mockArticles);
      expect(meta.openGraph?.url).toBe(`${SITE_URL}/blog/first-article`);
    });

    it('should include OG image with correct dimensions', async () => {
      const meta = await generateMetadata('first-article', mockArticles);
      const images = meta.openGraph?.images as Array<{ url: string; width: number; height: number }>;
      expect(images[0].url).toBe(`${SITE_URL}/og-image.png`);
      expect(images[0].width).toBe(1200);
      expect(images[0].height).toBe(630);
    });

    it('should include parent images after the primary OG image', async () => {
      const parentImages = ['https://example.com/parent-image.png'];
      const meta = await generateMetadata('first-article', mockArticles, parentImages);
      const images = meta.openGraph?.images as Array<{ url: string }>;
      expect(images).toHaveLength(2);
      expect(images[1].url).toBe('https://example.com/parent-image.png');
    });

    it('should set Twitter card type to summary_large_image', async () => {
      const meta = await generateMetadata('first-article', mockArticles);
      expect(meta.twitter?.card).toBe('summary_large_image');
    });

    it('should set Twitter creator to the correct handle', async () => {
      const meta = await generateMetadata('first-article', mockArticles);
      expect(meta.twitter?.creator).toBe(TWITTER_HANDLE);
    });

    it('should set the canonical URL', async () => {
      const meta = await generateMetadata('first-article', mockArticles);
      expect(meta.alternates?.canonical).toBe(`${SITE_URL}/blog/first-article`);
    });

    it('should include Open Graph publishedTime and modifiedTime', async () => {
      const meta = await generateMetadata('first-article', mockArticles);
      expect(meta.openGraph?.publishedTime).toBeDefined();
      expect(meta.openGraph?.modifiedTime).toBe(meta.openGraph?.publishedTime);
    });

    it('should set the article section to category', async () => {
      const meta = await generateMetadata('first-article', mockArticles);
      expect(meta.openGraph?.section).toBe('Testing');
    });

    it('should include article-author in other field', async () => {
      const meta = await generateMetadata('first-article', mockArticles);
      expect(meta.other?.['article:author']).toBe(AUTHOR_NAME);
    });

    it('should include article-section in other field', async () => {
      const meta = await generateMetadata('first-article', mockArticles);
      expect(meta.other?.['article:section']).toBe('Testing');
    });
  });

  describe('Non-existent article', () => {
    it('should return "Article Not Found" title for missing slug', async () => {
      const meta = await generateMetadata('non-existent', mockArticles);
      expect(meta.title).toBe('Article Not Found');
    });

    it('should return descriptive message for missing article', async () => {
      const meta = await generateMetadata('non-existent', mockArticles);
      expect(meta.description).toBe('The requested article could not be found.');
    });

    it('should set robots to noindex for missing article', async () => {
      const meta = await generateMetadata('non-existent', mockArticles);
      expect(meta.robots).toEqual({ index: false, follow: true });
    });

    it('should not include openGraph for missing article', async () => {
      const meta = await generateMetadata('non-existent', mockArticles);
      expect(meta.openGraph).toBeUndefined();
    });

    it('should not include twitter for missing article', async () => {
      const meta = await generateMetadata('non-existent', mockArticles);
      expect(meta.twitter).toBeUndefined();
    });
  });

  describe('Date handling in metadata', () => {
    it('should produce a valid ISO date string for publishedTime', async () => {
      const meta = await generateMetadata('first-article', mockArticles);
      const publishedTime = meta.openGraph?.publishedTime as string;
      expect(publishedTime).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should use the 15th of the month as publication day', async () => {
      const meta = await generateMetadata('first-article', mockArticles);
      const publishedTime = meta.openGraph?.publishedTime as string;
      // Jan 2024 → 2024-01-15
      expect(publishedTime).toContain('2024-01-15');
    });
  });
});