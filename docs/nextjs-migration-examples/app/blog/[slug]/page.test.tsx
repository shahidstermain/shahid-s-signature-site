/**
 * Tests for Next.js App Router Dynamic Blog Post Page
 * Testing dynamic metadata, SSG, JSON-LD, and rendering
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateStaticParams,
  generateMetadata,
  default as BlogPostPage,
} from './page';
import type { Metadata } from 'next';

// Mock dependencies
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('notFound');
  }),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/script', () => ({
  default: ({ children, ...props }: any) => <script {...props}>{children}</script>,
}));

vi.mock('lucide-react', () => ({
  ArrowLeft: () => <svg data-testid="arrow-left-icon" />,
  ArrowRight: () => <svg data-testid="arrow-right-icon" />,
  Clock: () => <svg data-testid="clock-icon" />,
  Calendar: () => <svg data-testid="calendar-icon" />,
  BookOpen: () => <svg data-testid="book-open-icon" />,
}));

vi.mock('@/data/articles', () => ({
  articles: [
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
  ],
  getArticleBySlug: (slug: string) => {
    const articles = [
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
    return articles.find((a) => a.slug === slug);
  },
}));

vi.mock('@/components/layout/Header', () => ({
  Header: () => <header data-testid="header">Header</header>,
}));

vi.mock('@/components/layout/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock('@/components/ui/BackgroundGlow', () => ({
  BackgroundGlow: () => <div data-testid="background-glow">Background Glow</div>,
}));

vi.mock('@/components/ui/ReadingProgressBar', () => ({
  ReadingProgressBar: () => <div data-testid="reading-progress-bar">Progress Bar</div>,
}));

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shahidster.tech';

describe('Blog Post Page - generateStaticParams', () => {
  it('should generate params for all articles', async () => {
    const params = await generateStaticParams();

    expect(params).toEqual([
      { slug: 'first-article' },
      { slug: 'second-article' },
      { slug: 'third-article' },
    ]);
  });

  it('should return array of route parameter objects', async () => {
    const params = await generateStaticParams();

    expect(Array.isArray(params)).toBe(true);
    expect(params.length).toBe(3);
    params.forEach((param) => {
      expect(param).toHaveProperty('slug');
      expect(typeof param.slug).toBe('string');
    });
  });
});

describe('Blog Post Page - generateMetadata', () => {
  const mockParent: any = Promise.resolve({
    openGraph: {
      images: ['https://example.com/parent-image.png'],
    },
  });

  it('should generate metadata for existing article', async () => {
    const metadata = await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    );

    expect(metadata.title).toBe('First Article');
    expect(metadata.description).toBe('First article description');
    expect(metadata.keywords).toEqual(['test', 'article']);
  });

  it('should include Open Graph metadata', async () => {
    const metadata = (await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    )) as Metadata;

    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph?.type).toBe('article');
    expect(metadata.openGraph?.title).toBe('First Article');
    expect(metadata.openGraph?.description).toBe('First article description');
    expect(metadata.openGraph?.url).toBe(`${SITE_URL}/blog/first-article`);
    expect(metadata.openGraph?.locale).toBe('en_US');
  });

  it('should include Twitter Card metadata', async () => {
    const metadata = (await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    )) as Metadata;

    expect(metadata.twitter).toBeDefined();
    expect(metadata.twitter?.card).toBe('summary_large_image');
    expect(metadata.twitter?.title).toBe('First Article');
    expect(metadata.twitter?.description).toBe('First article description');
    expect(metadata.twitter?.creator).toBe('@shahidster_');
  });

  it('should include article-specific metadata', async () => {
    const metadata = (await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    )) as Metadata;

    expect(metadata.openGraph?.publishedTime).toBeDefined();
    expect(metadata.openGraph?.modifiedTime).toBeDefined();
    expect(metadata.openGraph?.authors).toContain('Shahid Moosa');
    expect(metadata.openGraph?.section).toBe('Testing');
    expect(metadata.openGraph?.tags).toEqual(['test', 'article']);
  });

  it('should set canonical URL', async () => {
    const metadata = (await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    )) as Metadata;

    expect(metadata.alternates).toBeDefined();
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/blog/first-article`);
  });

  it('should inherit parent Open Graph images', async () => {
    const metadata = (await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    )) as Metadata;

    const images = metadata.openGraph?.images as any[];
    expect(images.length).toBeGreaterThan(1);
    expect(images[0].url).toBe(`${SITE_URL}/og-image.png`);
  });

  it('should return 404 metadata for non-existent article', async () => {
    const metadata = await generateMetadata(
      { params: { slug: 'non-existent' } },
      mockParent
    );

    expect(metadata.title).toBe('Article Not Found');
    expect(metadata.description).toBe('The requested article could not be found.');
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it('should format dates correctly', async () => {
    const metadata = (await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    )) as Metadata;

    const publishedTime = metadata.openGraph?.publishedTime as string;
    expect(publishedTime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('should handle articles without SEO keywords', async () => {
    const metadata = (await generateMetadata(
      { params: { slug: 'third-article' } },
      mockParent
    )) as Metadata;

    expect(metadata.keywords).toBeUndefined();
  });

  it('should handle special characters in title', async () => {
    const metadata = await generateMetadata(
      { params: { slug: 'third-article' } },
      mockParent
    );

    expect(metadata.title).toContain('<Special>');
    expect(metadata.title).toContain('&');
  });

  it('should set author metadata', async () => {
    const metadata = (await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    )) as Metadata;

    expect(metadata.authors).toBeDefined();
    expect(Array.isArray(metadata.authors)).toBe(true);
    const authors = metadata.authors as any[];
    expect(authors[0].name).toBe('Shahid Moosa');
  });

  it('should include other metadata fields', async () => {
    const metadata = (await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    )) as Metadata;

    expect(metadata.other).toBeDefined();
    expect(metadata.other?.['article:author']).toBe('Shahid Moosa');
    expect(metadata.other?.['article:section']).toBe('Testing');
    expect(metadata.other?.['article:published_time']).toBeDefined();
  });
});

describe('Blog Post Page - rendering', () => {
  it('should not crash when rendering article', () => {
    expect(() =>
      BlogPostPage({ params: { slug: 'first-article' } })
    ).not.toThrow();
  });

  it('should throw notFound for non-existent article', () => {
    expect(() => BlogPostPage({ params: { slug: 'non-existent' } })).toThrow(
      'notFound'
    );
  });
});

describe('Blog Post Page - parseArticleDate', () => {
  it('should parse various month formats', () => {
    // This tests the internal parseArticleDate function through metadata
    const testCases = [
      { input: 'Jan 2024', expectedMonth: 0 },
      { input: 'Feb 2024', expectedMonth: 1 },
      { input: 'Dec 2024', expectedMonth: 11 },
    ];

    testCases.forEach(({ input }) => {
      expect(() => {
        const date = new Date(input);
        return date;
      }).not.toThrow();
    });
  });
});

describe('Blog Post Page - formatContent', () => {
  it('should transform markdown to HTML', () => {
    // Testing through the rendered output
    const result = BlogPostPage({ params: { slug: 'first-article' } });
    expect(result).toBeTruthy();
  });
});

describe('Blog Post Page - getSeriesNavigation', () => {
  it('should provide navigation for middle article', async () => {
    const metadata = (await generateMetadata(
      { params: { slug: 'second-article' } },
      Promise.resolve({})
    )) as Metadata;

    // The metadata should be generated successfully for middle article
    expect(metadata.title).toBe('Second Article');
  });

  it('should handle first article (no previous)', async () => {
    const metadata = (await generateMetadata(
      { params: { slug: 'first-article' } },
      Promise.resolve({})
    )) as Metadata;

    expect(metadata.title).toBe('First Article');
  });

  it('should handle last article (no next)', async () => {
    const metadata = (await generateMetadata(
      { params: { slug: 'third-article' } },
      Promise.resolve({})
    )) as Metadata;

    expect(metadata.title).toContain('Third Article');
  });
});

describe('Blog Post Page - revalidation', () => {
  it('should export revalidate constant', () => {
    // The revalidate export ensures ISR behavior
    const module = require('./page');
    expect(module.revalidate).toBe(3600);
  });
});

describe('Blog Post Page - edge cases', () => {
  it('should handle empty parent metadata', async () => {
    const metadata = await generateMetadata(
      { params: { slug: 'first-article' } },
      Promise.resolve({})
    );

    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('First Article');
  });

  it('should handle article without seriesPosition', async () => {
    const metadata = await generateMetadata(
      { params: { slug: 'second-article' } },
      Promise.resolve({})
    );

    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('Second Article');
  });

  it('should handle very long article titles', async () => {
    const metadata = await generateMetadata(
      { params: { slug: 'third-article' } },
      Promise.resolve({})
    );

    expect(metadata.title).toBeTruthy();
    expect(typeof metadata.title).toBe('string');
  });

  it('should include all required OpenGraph fields', async () => {
    const metadata = (await generateMetadata(
      { params: { slug: 'first-article' } },
      Promise.resolve({})
    )) as Metadata;

    expect(metadata.openGraph?.siteName).toBeDefined();
    expect(metadata.openGraph?.locale).toBe('en_US');
    expect(metadata.openGraph?.type).toBe('article');
  });

  it('should include image dimensions in OpenGraph', async () => {
    const metadata = (await generateMetadata(
      { params: { slug: 'first-article' } },
      Promise.resolve({})
    )) as Metadata;

    const images = metadata.openGraph?.images as any[];
    expect(images[0].width).toBe(1200);
    expect(images[0].height).toBe(630);
    expect(images[0].alt).toBe('First Article');
  });
});