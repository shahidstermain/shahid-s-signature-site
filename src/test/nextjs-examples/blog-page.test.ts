/**
 * Tests for Next.js App Router Dynamic Blog Post Page functions
 * Based on docs/nextjs-migration-examples/app/blog/[slug]/page.tsx
 *
 * Covers: parseArticleDate, generateStaticParams, generateMetadata,
 *         getSeriesNavigation, getArticleSchema, getBreadcrumbSchema,
 *         formatContent
 */

import { describe, it, expect } from 'vitest';

const SITE_URL = 'https://shahidster.tech';
const AUTHOR_NAME = 'Shahid Moosa';
const TWITTER_HANDLE = '@shahidster_';

// ─── Replicated helper functions ──────────────────────────────────────────────

function parseArticleDate(dateStr: string): Date {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const [month, year] = dateStr.split(' ');
  return new Date(parseInt(year), months[month] || 0, 15);
}

interface MockArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  date: string;
  featured: boolean;
  seriesPosition?: string;
  seoKeywords?: string[];
  content: string;
}

const mockArticles: MockArticle[] = [
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
    title: 'Third Article with <Special> & Characters',
    description: 'Article with special characters',
    category: 'Advanced',
    readTime: '10 min read',
    date: 'Mar 2024',
    featured: false,
    content: 'Third article content',
  },
];

function getArticleBySlug(slug: string): MockArticle | undefined {
  return mockArticles.find((a) => a.slug === slug);
}

function generateStaticParams() {
  return mockArticles.map((article) => ({ slug: article.slug }));
}

async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: Promise<{ openGraph?: { images?: unknown[] } }>
) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
      robots: { index: false, follow: true },
    };
  }

  const articleUrl = `${SITE_URL}/blog/${article.slug}`;
  const publishDate = parseArticleDate(article.date).toISOString();
  const previousImages = (await parent).openGraph?.images || [];

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
        ...previousImages,
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

function getSeriesNavigation(currentSlug: string) {
  const currentIndex = mockArticles.findIndex((a) => a.slug === currentSlug);
  return {
    prev: currentIndex > 0 ? mockArticles[currentIndex - 1] : null,
    next: currentIndex < mockArticles.length - 1 ? mockArticles[currentIndex + 1] : null,
    currentIndex: currentIndex + 1,
    total: mockArticles.length,
  };
}

function getArticleSchema(article: MockArticle, currentIndex: number, total: number) {
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

function getBreadcrumbSchema(article: MockArticle) {
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

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('parseArticleDate', () => {
  it('should parse a valid "Mon YYYY" date string to a Date on the 15th', () => {
    const date = parseArticleDate('Jan 2024');
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(0); // January (0-indexed)
    expect(date.getDate()).toBe(15);
  });

  it('should parse November correctly', () => {
    const date = parseArticleDate('Nov 2025');
    expect(date.getMonth()).toBe(10);
    expect(date.getFullYear()).toBe(2025);
  });

  it('should parse December correctly', () => {
    const date = parseArticleDate('Dec 2023');
    expect(date.getMonth()).toBe(11);
    expect(date.getFullYear()).toBe(2023);
  });

  it('should default to January (month index 0) for an unrecognized month token', () => {
    const date = parseArticleDate('Xyz 2024');
    expect(date.getMonth()).toBe(0);
    expect(date.getFullYear()).toBe(2024);
    expect(date.getDate()).toBe(15);
  });

  it('should parse all twelve month abbreviations', () => {
    const expectedMonths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const abbrevs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    abbrevs.forEach((abbrev, idx) => {
      const date = parseArticleDate(`${abbrev} 2024`);
      expect(date.getMonth()).toBe(expectedMonths[idx]);
    });
  });

  it('should always set day to 15', () => {
    const months = ['Jan', 'Jun', 'Dec'];
    months.forEach((m) => {
      expect(parseArticleDate(`${m} 2024`).getDate()).toBe(15);
    });
  });

  it('should return a valid Date even for partial input', () => {
    const date = parseArticleDate('Jan');
    expect(date).toBeInstanceOf(Date);
  });
});

describe('generateStaticParams', () => {
  it('should return a param object for every article', () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(mockArticles.length);
  });

  it('should contain a slug string in every param object', () => {
    const params = generateStaticParams();
    params.forEach((p) => {
      expect(p).toHaveProperty('slug');
      expect(typeof p.slug).toBe('string');
    });
  });

  it('should include the slug of each mock article', () => {
    const params = generateStaticParams();
    const slugs = params.map((p) => p.slug);
    mockArticles.forEach((a) => expect(slugs).toContain(a.slug));
  });
});

describe('generateMetadata', () => {
  const mockParent = Promise.resolve({
    openGraph: { images: ['https://example.com/parent-image.png'] },
  });
  const emptyParent = Promise.resolve({ openGraph: {} });

  it('should return title and description for an existing article', async () => {
    const meta = await generateMetadata({ params: { slug: 'first-article' } }, mockParent);
    expect(meta.title).toBe('First Article');
    expect(meta.description).toBe('First article description');
  });

  it('should include SEO keywords', async () => {
    const meta = await generateMetadata({ params: { slug: 'first-article' } }, mockParent);
    expect(meta.keywords).toEqual(['test', 'article']);
  });

  it('should include correct Open Graph article type', async () => {
    const meta = await generateMetadata({ params: { slug: 'first-article' } }, mockParent);
    expect(meta.openGraph?.type).toBe('article');
  });

  it('should set Open Graph url to the canonical article URL', async () => {
    const meta = await generateMetadata({ params: { slug: 'first-article' } }, mockParent);
    expect(meta.openGraph?.url).toBe(`${SITE_URL}/blog/first-article`);
  });

  it('should set Open Graph locale to en_US', async () => {
    const meta = await generateMetadata({ params: { slug: 'first-article' } }, mockParent);
    expect(meta.openGraph?.locale).toBe('en_US');
  });

  it('should include the article title and description in Open Graph', async () => {
    const meta = await generateMetadata({ params: { slug: 'first-article' } }, mockParent);
    expect(meta.openGraph?.title).toBe('First Article');
    expect(meta.openGraph?.description).toBe('First article description');
  });

  it('should include article category as Open Graph section', async () => {
    const meta = await generateMetadata({ params: { slug: 'first-article' } }, mockParent);
    expect(meta.openGraph?.section).toBe('Testing');
  });

  it('should set publishedTime and modifiedTime to ISO date strings', async () => {
    const meta = await generateMetadata({ params: { slug: 'first-article' } }, mockParent);
    expect(meta.openGraph?.publishedTime).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(meta.openGraph?.modifiedTime).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('should set publishedTime and modifiedTime to the same value', async () => {
    const meta = await generateMetadata({ params: { slug: 'first-article' } }, mockParent);
    expect(meta.openGraph?.publishedTime).toBe(meta.openGraph?.modifiedTime);
  });

  it('should list the author in the Open Graph authors array', async () => {
    const meta = await generateMetadata({ params: { slug: 'first-article' } }, mockParent);
    expect(meta.openGraph?.authors).toContain(AUTHOR_NAME);
  });

  it('should include OG image url pointing to og-image.png', async () => {
    const meta = await generateMetadata({ params: { slug: 'first-article' } }, mockParent);
    const images = meta.openGraph?.images as Array<{ url: string }>;
    expect(images[0].url).toBe(`${SITE_URL}/og-image.png`);
  });

  it('should merge inherited parent Open Graph images after the primary image', async () => {
    const meta = await generateMetadata({ params: { slug: 'first-article' } }, mockParent);
    const images = meta.openGraph?.images as unknown[];
    expect(images.length).toBeGreaterThan(1);
    expect(images[1]).toBe('https://example.com/parent-image.png');
  });

  it('should work without parent images (gracefully)', async () => {
    const meta = await generateMetadata({ params: { slug: 'first-article' } }, emptyParent);
    const images = meta.openGraph?.images as unknown[];
    expect(images).toHaveLength(1);
  });

  it('should produce Twitter card metadata', async () => {
    const meta = await generateMetadata({ params: { slug: 'first-article' } }, mockParent);
    expect(meta.twitter?.card).toBe('summary_large_image');
    expect(meta.twitter?.title).toBe('First Article');
    expect(meta.twitter?.description).toBe('First article description');
    expect(meta.twitter?.creator).toBe(TWITTER_HANDLE);
  });

  it('should set canonical URL in alternates', async () => {
    const meta = await generateMetadata({ params: { slug: 'first-article' } }, mockParent);
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/blog/first-article`);
  });

  it('should populate other article-specific meta fields', async () => {
    const meta = await generateMetadata({ params: { slug: 'first-article' } }, mockParent) as {
      other?: Record<string, string>;
    };
    expect(meta.other?.['article:author']).toBe(AUTHOR_NAME);
    expect(meta.other?.['article:section']).toBe('Testing');
  });

  it('should return 404 metadata when the article is not found', async () => {
    const meta = await generateMetadata({ params: { slug: 'does-not-exist' } }, mockParent);
    expect(meta.title).toBe('Article Not Found');
    expect(meta.description).toBe('The requested article could not be found.');
  });

  it('should set robots noindex for missing articles', async () => {
    const meta = await generateMetadata({ params: { slug: 'does-not-exist' } }, mockParent);
    expect(meta.robots).toEqual({ index: false, follow: true });
  });

  it('should handle articles without seoKeywords', async () => {
    const meta = await generateMetadata({ params: { slug: 'third-article' } }, mockParent);
    expect(meta.keywords).toBeUndefined();
  });
});

describe('getSeriesNavigation', () => {
  it('should return null for prev when article is the first', () => {
    const nav = getSeriesNavigation('first-article');
    expect(nav.prev).toBeNull();
  });

  it('should return the next article for the first article', () => {
    const nav = getSeriesNavigation('first-article');
    expect(nav.next?.slug).toBe('second-article');
  });

  it('should return the correct prev article for a middle article', () => {
    const nav = getSeriesNavigation('second-article');
    expect(nav.prev?.slug).toBe('first-article');
  });

  it('should return the correct next article for a middle article', () => {
    const nav = getSeriesNavigation('second-article');
    expect(nav.next?.slug).toBe('third-article');
  });

  it('should return null for next when article is the last', () => {
    const nav = getSeriesNavigation('third-article');
    expect(nav.next).toBeNull();
  });

  it('should return the prev article for the last article', () => {
    const nav = getSeriesNavigation('third-article');
    expect(nav.prev?.slug).toBe('second-article');
  });

  it('should report a 1-based currentIndex', () => {
    expect(getSeriesNavigation('first-article').currentIndex).toBe(1);
    expect(getSeriesNavigation('second-article').currentIndex).toBe(2);
    expect(getSeriesNavigation('third-article').currentIndex).toBe(3);
  });

  it('should report the total number of articles', () => {
    const nav = getSeriesNavigation('first-article');
    expect(nav.total).toBe(mockArticles.length);
  });

  it('should return index 0 for an unknown slug (article not found)', () => {
    const nav = getSeriesNavigation('unknown-slug');
    expect(nav.currentIndex).toBe(0); // findIndex returns -1, +1 = 0
    expect(nav.prev).toBeNull();
    expect(nav.next).toBe(mockArticles[0]);
  });
});

describe('getArticleSchema', () => {
  const article = mockArticles[0];

  it('should use schema.org context', () => {
    const schema = getArticleSchema(article, 1, 3);
    expect(schema['@context']).toBe('https://schema.org');
  });

  it('should be of type TechArticle', () => {
    const schema = getArticleSchema(article, 1, 3);
    expect(schema['@type']).toBe('TechArticle');
  });

  it('should set headline to the article title', () => {
    const schema = getArticleSchema(article, 1, 3);
    expect(schema.headline).toBe(article.title);
  });

  it('should set description', () => {
    const schema = getArticleSchema(article, 1, 3);
    expect(schema.description).toBe(article.description);
  });

  it('should set articleSection to the article category', () => {
    const schema = getArticleSchema(article, 1, 3);
    expect(schema.articleSection).toBe(article.category);
  });

  it('should include keywords from seoKeywords', () => {
    const schema = getArticleSchema(article, 1, 3);
    expect(schema.keywords).toEqual(article.seoKeywords);
  });

  it('should set datePublished as ISO string', () => {
    const schema = getArticleSchema(article, 1, 3);
    expect(schema.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('should set datePublished equal to dateModified', () => {
    const schema = getArticleSchema(article, 1, 3);
    expect(schema.datePublished).toBe(schema.dateModified);
  });

  it('should include author with type Person', () => {
    const schema = getArticleSchema(article, 1, 3);
    expect(schema.author['@type']).toBe('Person');
    expect(schema.author.name).toBe(AUTHOR_NAME);
  });

  it('should set mainEntityOfPage to the article URL', () => {
    const schema = getArticleSchema(article, 1, 3);
    expect(schema.mainEntityOfPage['@id']).toBe(`${SITE_URL}/blog/${article.slug}`);
  });

  it('should set language to en-US', () => {
    const schema = getArticleSchema(article, 1, 3);
    expect(schema.inLanguage).toBe('en-US');
  });

  it('should compute word count from content', () => {
    const schema = getArticleSchema(article, 1, 3);
    const expected = article.content.split(/\s+/).length;
    expect(schema.wordCount).toBe(expected);
  });

  it('should include isPartOf with correct series position', () => {
    const schema = getArticleSchema(article, 2, 9);
    expect(schema.isPartOf['@type']).toBe('CreativeWorkSeries');
    expect(schema.isPartOf.position).toBe(2);
    expect(schema.isPartOf.numberOfItems).toBe(9);
  });

  it('should construct article URL from SITE_URL and slug', () => {
    const schema = getArticleSchema(article, 1, 3);
    expect(schema.url).toBe(`${SITE_URL}/blog/${article.slug}`);
  });
});

describe('getBreadcrumbSchema', () => {
  const article = mockArticles[0];

  it('should use schema.org context', () => {
    const schema = getBreadcrumbSchema(article);
    expect(schema['@context']).toBe('https://schema.org');
  });

  it('should be of type BreadcrumbList', () => {
    const schema = getBreadcrumbSchema(article);
    expect(schema['@type']).toBe('BreadcrumbList');
  });

  it('should contain three items: Home, Writing, Article', () => {
    const schema = getBreadcrumbSchema(article);
    expect(schema.itemListElement).toHaveLength(3);
  });

  it('should set Home as position 1', () => {
    const schema = getBreadcrumbSchema(article);
    const home = schema.itemListElement[0];
    expect(home.position).toBe(1);
    expect(home.name).toBe('Home');
    expect(home.item).toBe(SITE_URL);
  });

  it('should set Writing as position 2', () => {
    const schema = getBreadcrumbSchema(article);
    const writing = schema.itemListElement[1];
    expect(writing.position).toBe(2);
    expect(writing.name).toBe('Writing');
    expect(writing.item).toBe(`${SITE_URL}/#writing`);
  });

  it('should set article title as position 3 breadcrumb name', () => {
    const schema = getBreadcrumbSchema(article);
    const articleCrumb = schema.itemListElement[2];
    expect(articleCrumb.position).toBe(3);
    expect(articleCrumb.name).toBe(article.title);
  });

  it('should set article URL as position 3 breadcrumb item', () => {
    const schema = getBreadcrumbSchema(article);
    const articleCrumb = schema.itemListElement[2];
    expect(articleCrumb.item).toBe(`${SITE_URL}/blog/${article.slug}`);
  });

  it('should handle an article with special characters in its title', () => {
    const specialArticle = mockArticles[2];
    const schema = getBreadcrumbSchema(specialArticle);
    expect(schema.itemListElement[2].name).toBe(specialArticle.title);
  });
});

describe('formatContent', () => {
  describe('Heading conversion', () => {
    it('should convert ## headings to <h2>', () => {
      expect(formatContent('## My Heading')).toContain('<h2>My Heading</h2>');
    });

    it('should convert ### headings to <h3>', () => {
      expect(formatContent('### Sub Heading')).toContain('<h3>Sub Heading</h3>');
    });

    it('should leave text following headings intact', () => {
      const result = formatContent('## Title\n\nBody text');
      expect(result).toContain('<h2>Title</h2>');
      expect(result).toContain('Body text');
    });
  });

  describe('Inline formatting', () => {
    it('should convert **bold** to <strong>', () => {
      expect(formatContent('**bold text**')).toContain('<strong>bold text</strong>');
    });

    it('should convert `inline code` to <code>', () => {
      expect(formatContent('`code here`')).toContain('<code>code here</code>');
    });

    it('should handle multiple inline elements in one line', () => {
      const result = formatContent('**bold** and `code`');
      expect(result).toContain('<strong>bold</strong>');
      expect(result).toContain('<code>code</code>');
    });
  });

  describe('Fenced code blocks', () => {
    it('should convert fenced code blocks to <pre><code>', () => {
      const input = '```js\nconst x = 1;\n```';
      const result = formatContent(input);
      expect(result).toContain('<pre><code>');
      expect(result).toContain('const x = 1;');
      expect(result).toContain('</code></pre>');
    });

    it('should handle code blocks without language tag', () => {
      const input = '```\nplain code\n```';
      const result = formatContent(input);
      expect(result).toContain('<pre><code>');
    });
  });

  describe('Block elements', () => {
    it('should convert --- to <hr />', () => {
      expect(formatContent('---')).toContain('<hr />');
    });

    it('should convert > blockquotes to <blockquote>', () => {
      expect(formatContent('> quoted text')).toContain('<blockquote>quoted text</blockquote>');
    });

    it('should convert - list items to <li> wrapped in <ul>', () => {
      const result = formatContent('- item one\n- item two');
      expect(result).toContain('<li>item one</li>');
      expect(result).toContain('<li>item two</li>');
      expect(result).toContain('<ul>');
      expect(result).toContain('</ul>');
    });
  });

  describe('Paragraph handling', () => {
    it('should wrap double-newline separated blocks in <p> tags', () => {
      const result = formatContent('First paragraph\n\nSecond paragraph');
      expect(result).toContain('</p><p>');
    });

    it('should remove empty <p></p> tags', () => {
      const result = formatContent('\n\n');
      expect(result).not.toContain('<p></p>');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string without throwing', () => {
      expect(() => formatContent('')).not.toThrow();
    });

    it('should return a string for any input', () => {
      expect(typeof formatContent('some content')).toBe('string');
    });

    it('should not modify plain text that has no markdown markers', () => {
      const plain = 'Just plain text here';
      const result = formatContent(plain);
      expect(result).toContain('Just plain text here');
    });
  });
});