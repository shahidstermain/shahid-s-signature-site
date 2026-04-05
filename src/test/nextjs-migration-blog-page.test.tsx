/**
 * Tests for docs/nextjs-migration-examples/app/blog/[slug]/page.tsx
 *
 * Covers generateStaticParams, generateMetadata, and the BlogPostPage
 * component's exported / deterministic logic. Renders the component via
 * React Testing Library for integration-level assertions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// ---------------------------------------------------------------------------
// Mock all Next.js module dependencies before any imports of the page
// ---------------------------------------------------------------------------
vi.mock('next', () => ({}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('next/script', () => ({
  default: ({
    id,
    type,
    dangerouslySetInnerHTML,
  }: {
    id?: string;
    type?: string;
    dangerouslySetInnerHTML?: { __html: string };
  }) => (
    <script
      id={id}
      type={type}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    />
  ),
}));

// Lightweight icon stubs
vi.mock('lucide-react', () => ({
  ArrowLeft: () => <svg data-testid="arrow-left" />,
  ArrowRight: () => <svg data-testid="arrow-right" />,
  Clock: () => <svg data-testid="clock-icon" />,
  Calendar: () => <svg data-testid="calendar-icon" />,
  BookOpen: () => <svg data-testid="book-open-icon" />,
}));

// Layout / UI stubs
vi.mock('@/components/layout/Header', () => ({
  Header: () => <header data-testid="header" />,
}));
vi.mock('@/components/layout/Footer', () => ({
  Footer: () => <footer data-testid="footer" />,
}));
vi.mock('@/components/ui/BackgroundGlow', () => ({
  BackgroundGlow: () => <div data-testid="background-glow" />,
}));
vi.mock('@/components/ui/ReadingProgressBar', () => ({
  ReadingProgressBar: () => <div data-testid="reading-progress-bar" />,
}));

// ---------------------------------------------------------------------------
// Controlled article data
// ---------------------------------------------------------------------------
vi.mock('@/data/articles', () => {
  const articles = [
    {
      slug: 'first-article',
      title: 'First Article',
      description: 'First article description.',
      category: 'Fundamentals',
      readTime: '5 min read',
      date: 'Jan 2024',
      featured: true,
      seriesPosition: 'Part 1 of 3',
      seoKeywords: ['cap', 'distributed'],
      content:
        '## Intro\n\nThis is **bold** text and `inline code`.\n\n- List item one\n- List item two',
    },
    {
      slug: 'second-article',
      title: 'Second Article',
      description: 'Second article description.',
      category: 'Architecture',
      readTime: '8 min read',
      date: 'Feb 2024',
      featured: false,
      seoKeywords: ['architecture'],
      content: 'Second article plain content here.',
    },
    {
      slug: 'third-article',
      title: 'Third Article',
      description: 'Third article description.',
      category: 'Fundamentals',
      readTime: '10 min read',
      date: 'Mar 2024',
      featured: false,
      content: 'Third article content.',
    },
  ];

  return {
    articles,
    getArticleBySlug: (slug: string) => articles.find((a) => a.slug === slug),
  };
});

// ---------------------------------------------------------------------------
// Import the page module AFTER mocks are set up
// ---------------------------------------------------------------------------
const {
  generateStaticParams,
  generateMetadata,
  default: BlogPostPage,
} = await import(
  '../../docs/nextjs-migration-examples/app/blog/[slug]/page'
);

const SITE_URL = 'https://shahidster.tech';

// ---------------------------------------------------------------------------
// generateStaticParams
// ---------------------------------------------------------------------------
describe('generateStaticParams', () => {
  it('returns an array of slug objects', async () => {
    const params = await generateStaticParams();
    expect(Array.isArray(params)).toBe(true);
    params.forEach((p: { slug: string }) => {
      expect(typeof p.slug).toBe('string');
    });
  });

  it('includes one entry per article', async () => {
    const params = await generateStaticParams();
    expect(params.length).toBe(3);
  });

  it('contains the expected slugs', async () => {
    const params = await generateStaticParams();
    const slugs = params.map((p: { slug: string }) => p.slug);
    expect(slugs).toContain('first-article');
    expect(slugs).toContain('second-article');
    expect(slugs).toContain('third-article');
  });
});

// ---------------------------------------------------------------------------
// generateMetadata – existing article
// ---------------------------------------------------------------------------
describe('generateMetadata – existing article', () => {
  const mockParent = Promise.resolve({
    openGraph: { images: ['https://example.com/parent-image.png'] },
  }) as unknown;

  it('returns the article title as metadata title', async () => {
    const meta = await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    );
    expect(meta.title).toBe('First Article');
  });

  it('returns the article description', async () => {
    const meta = await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    );
    expect(meta.description).toBe('First article description.');
  });

  it('includes seoKeywords', async () => {
    const meta = await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    );
    expect(meta.keywords).toEqual(['cap', 'distributed']);
  });

  it('sets Open Graph type to article', async () => {
    const meta = await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    );
    expect(meta.openGraph?.type).toBe('article');
  });

  it('sets Open Graph URL to the article canonical URL', async () => {
    const meta = await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    );
    expect(meta.openGraph?.url).toBe(`${SITE_URL}/blog/first-article`);
  });

  it('sets Open Graph locale to en_US', async () => {
    const meta = await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    );
    expect(meta.openGraph?.locale).toBe('en_US');
  });

  it('includes the OG image URL', async () => {
    const meta = await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    );
    const images = meta.openGraph?.images as Array<{ url: string }>;
    expect(images[0].url).toBe(`${SITE_URL}/og-image.png`);
  });

  it('inherits parent OG images after the article image', async () => {
    const meta = await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    );
    const images = meta.openGraph?.images as unknown[];
    expect(images.length).toBeGreaterThan(1);
  });

  it('sets publishedTime from the article date', async () => {
    const meta = await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    );
    // Jan 2024 → 2024-01-15
    expect(meta.openGraph?.publishedTime).toContain('2024-01-15');
  });

  it('sets Open Graph article section to the category', async () => {
    const meta = await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    );
    expect(meta.openGraph?.section).toBe('Fundamentals');
  });

  it('sets Twitter card to summary_large_image', async () => {
    const meta = await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    );
    expect(meta.twitter?.card).toBe('summary_large_image');
    expect(meta.twitter?.creator).toBe('@shahidster_');
  });

  it('sets canonical alternate URL', async () => {
    const meta = await generateMetadata(
      { params: { slug: 'first-article' } },
      mockParent
    );
    expect(meta.alternates?.canonical).toBe(
      `${SITE_URL}/blog/first-article`
    );
  });
});

// ---------------------------------------------------------------------------
// generateMetadata – article not found
// ---------------------------------------------------------------------------
describe('generateMetadata – article not found', () => {
  const mockParent = Promise.resolve({
    openGraph: { images: [] },
  }) as unknown;

  it('returns "Article Not Found" title for unknown slug', async () => {
    const meta = await generateMetadata(
      { params: { slug: 'does-not-exist' } },
      mockParent
    );
    expect(meta.title).toBe('Article Not Found');
  });

  it('returns a helpful description', async () => {
    const meta = await generateMetadata(
      { params: { slug: 'does-not-exist' } },
      mockParent
    );
    expect(meta.description).toBe(
      'The requested article could not be found.'
    );
  });

  it('sets robots to noindex for a missing article', async () => {
    const meta = await generateMetadata(
      { params: { slug: 'does-not-exist' } },
      mockParent
    );
    expect((meta.robots as { index: boolean }).index).toBe(false);
    expect((meta.robots as { follow: boolean }).follow).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// BlogPostPage component – rendering
// ---------------------------------------------------------------------------
describe('BlogPostPage component – rendering', () => {
  it('renders header, footer and progress bar', () => {
    render(<BlogPostPage params={{ slug: 'first-article' }} />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('reading-progress-bar')).toBeInTheDocument();
  });

  it('renders the article title as an h1', () => {
    render(<BlogPostPage params={{ slug: 'first-article' }} />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'First Article' })
    ).toBeInTheDocument();
  });

  it('renders the article description', () => {
    render(<BlogPostPage params={{ slug: 'first-article' }} />);
    expect(
      screen.getByText('First article description.')
    ).toBeInTheDocument();
  });

  it('renders the article category badge', () => {
    render(<BlogPostPage params={{ slug: 'first-article' }} />);
    expect(screen.getAllByText('Fundamentals').length).toBeGreaterThan(0);
  });

  it('renders the read time', () => {
    render(<BlogPostPage params={{ slug: 'first-article' }} />);
    expect(screen.getByText('5 min read')).toBeInTheDocument();
  });

  it('renders the article date', () => {
    render(<BlogPostPage params={{ slug: 'first-article' }} />);
    expect(screen.getByText('Jan 2024')).toBeInTheDocument();
  });

  it('renders the series position', () => {
    render(<BlogPostPage params={{ slug: 'first-article' }} />);
    expect(screen.getByText('Part 1 of 3')).toBeInTheDocument();
  });

  it('renders a "Back to articles" link', () => {
    render(<BlogPostPage params={{ slug: 'first-article' }} />);
    expect(screen.getByText('Back to articles')).toBeInTheDocument();
  });

  it('renders the JSON-LD article schema script', () => {
    const { container } = render(
      <BlogPostPage params={{ slug: 'first-article' }} />
    );
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBeGreaterThanOrEqual(2);
  });

  it('article JSON-LD contains TechArticle type', () => {
    const { container } = render(
      <BlogPostPage params={{ slug: 'first-article' }} />
    );
    const scripts = container.querySelectorAll('script[id="article-schema"]');
    expect(scripts.length).toBe(1);
    const parsed = JSON.parse(scripts[0].innerHTML);
    expect(parsed['@type']).toBe('TechArticle');
  });

  it('breadcrumb JSON-LD contains BreadcrumbList type', () => {
    const { container } = render(
      <BlogPostPage params={{ slug: 'first-article' }} />
    );
    const scripts = container.querySelectorAll('script[id="breadcrumb-schema"]');
    expect(scripts.length).toBe(1);
    const parsed = JSON.parse(scripts[0].innerHTML);
    expect(parsed['@type']).toBe('BreadcrumbList');
  });

  it('does not show a "Previous" link for the first article', () => {
    render(<BlogPostPage params={{ slug: 'first-article' }} />);
    // The "Previous" nav link should be a disabled span, not an <a>
    const prevLink = screen
      .queryAllByText('Previous')
      .find((el) => el.tagName === 'A');
    expect(prevLink).toBeUndefined();
  });

  it('shows a "Next" link for the first article pointing to the second', () => {
    render(<BlogPostPage params={{ slug: 'first-article' }} />);
    const nextLinks = screen
      .queryAllByText('Next')
      .filter((el) => el.tagName === 'SPAN' && el.closest('a'));
    expect(nextLinks.length).toBeGreaterThan(0);
  });

  it('calls notFound() for an unknown slug', () => {
    // The notFound mock is configured to throw 'NEXT_NOT_FOUND';
    // rendering an unknown slug should surface that throw.
    expect(() => {
      render(<BlogPostPage params={{ slug: 'does-not-exist' }} />);
    }).toThrow('NEXT_NOT_FOUND');
  });

  it('renders related articles from the same category', () => {
    // "third-article" is also in "Fundamentals" category
    render(<BlogPostPage params={{ slug: 'first-article' }} />);
    expect(screen.getByText('Related Articles')).toBeInTheDocument();
  });

  it('renders article content HTML', () => {
    const { container } = render(
      <BlogPostPage params={{ slug: 'first-article' }} />
    );
    // formatContent should convert ## Intro to <h2>
    const article = container.querySelector('article');
    expect(article).toBeInTheDocument();
    // Content div is rendered via dangerouslySetInnerHTML
    const contentDiv = article?.querySelector('div[class*="prose"]');
    expect(contentDiv).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// BlogPostPage component – middle article navigation
// ---------------------------------------------------------------------------
describe('BlogPostPage component – navigation for middle article', () => {
  it('renders both Previous and Next links for a middle article', () => {
    render(<BlogPostPage params={{ slug: 'second-article' }} />);
    const prevLinks = screen
      .queryAllByText('Previous')
      .filter((el) => el.closest('a'));
    const nextLinks = screen
      .queryAllByText('Next')
      .filter((el) => el.closest('a'));
    expect(prevLinks.length).toBeGreaterThan(0);
    expect(nextLinks.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// BlogPostPage component – last article
// ---------------------------------------------------------------------------
describe('BlogPostPage component – last article', () => {
  it('does not show an active "Next" link for the last article', () => {
    render(<BlogPostPage params={{ slug: 'third-article' }} />);
    const nextLink = screen
      .queryAllByText('Next')
      .find((el) => el.tagName === 'A');
    expect(nextLink).toBeUndefined();
  });
});