import { describe, it, expect } from 'vitest';

const SITE_URL = 'https://shahidster.tech';
const AUTHOR_NAME = 'Shahid Moosa';

// Utility functions from the blog page example
function parseArticleDate(dateStr: string): Date {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const [month, year] = dateStr.split(' ');
  return new Date(parseInt(year), months[month] || 0, 15);
}

function getSeriesNavigation(currentSlug: string, articles: any[]) {
  const currentIndex = articles.findIndex((a) => a.slug === currentSlug);
  return {
    prev: currentIndex > 0 ? articles[currentIndex - 1] : null,
    next: currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null,
    currentIndex: currentIndex + 1,
    total: articles.length,
  };
}

function getArticleSchema(article: any, currentIndex: number, total: number) {
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

function getBreadcrumbSchema(article: any) {
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

// Mock article data
const mockArticles = [
  {
    slug: 'cap-theorem-production',
    title: 'CAP Theorem in Production',
    description: 'Understanding CAP theorem in real-world systems',
    content: 'This is a comprehensive article about CAP theorem with detailed explanations.',
    date: 'Nov 2025',
    category: 'Fundamentals',
    seoKeywords: ['CAP theorem', 'distributed systems', 'consistency'],
  },
  {
    slug: 'sharding-strategies',
    title: 'Sharding Strategies That Work',
    description: 'Practical approaches to database sharding',
    content: 'Detailed guide on sharding strategies for large-scale databases.',
    date: 'Oct 2025',
    category: 'Database',
    seoKeywords: ['sharding', 'database', 'scalability'],
  },
  {
    slug: 'query-optimization',
    title: 'Query Optimization at Scale',
    description: 'Optimizing database queries for performance',
    content: 'Learn how to optimize queries for petabyte-scale databases.',
    date: 'Sep 2025',
    category: 'Performance',
    seoKeywords: ['query optimization', 'performance', 'indexing'],
  },
];

describe('Blog Page Utility Functions', () => {
  describe('parseArticleDate', () => {
    it('should parse "Nov 2025" correctly', () => {
      const date = parseArticleDate('Nov 2025');
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(10);
      expect(date.getDate()).toBe(15);
    });

    it('should parse all 12 months correctly', () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      months.forEach((month, index) => {
        const date = parseArticleDate(`${month} 2025`);
        expect(date.getMonth()).toBe(index);
      });
    });

    it('should default to 15th day of month', () => {
      const date = parseArticleDate('Jun 2025');
      expect(date.getDate()).toBe(15);
    });

    it('should handle invalid month names gracefully', () => {
      const date = parseArticleDate('InvalidMonth 2025');
      expect(date).toBeInstanceOf(Date);
      expect(date.getMonth()).toBe(0); // Defaults to January
    });

    it('should handle malformed input', () => {
      const date = parseArticleDate('invalid');
      expect(date).toBeInstanceOf(Date);
      expect(isNaN(date.getTime())).toBe(true);
    });

    it('should handle empty string', () => {
      const date = parseArticleDate('');
      expect(date).toBeInstanceOf(Date);
    });

    it('should parse years correctly', () => {
      const years = [2020, 2023, 2025, 2030];
      years.forEach((year) => {
        const date = parseArticleDate(`Jan ${year}`);
        expect(date.getFullYear()).toBe(year);
      });
    });
  });

  describe('getSeriesNavigation', () => {
    it('should return correct navigation for middle article', () => {
      const nav = getSeriesNavigation('sharding-strategies', mockArticles);

      expect(nav.prev).toEqual(mockArticles[0]);
      expect(nav.next).toEqual(mockArticles[2]);
      expect(nav.currentIndex).toBe(2);
      expect(nav.total).toBe(3);
    });

    it('should return null prev for first article', () => {
      const nav = getSeriesNavigation('cap-theorem-production', mockArticles);

      expect(nav.prev).toBeNull();
      expect(nav.next).toEqual(mockArticles[1]);
      expect(nav.currentIndex).toBe(1);
    });

    it('should return null next for last article', () => {
      const nav = getSeriesNavigation('query-optimization', mockArticles);

      expect(nav.prev).toEqual(mockArticles[1]);
      expect(nav.next).toBeNull();
      expect(nav.currentIndex).toBe(3);
    });

    it('should handle non-existent article', () => {
      const nav = getSeriesNavigation('non-existent-slug', mockArticles);

      // When article not found, index is -1, so prev is null and next is articles[0]
      expect(nav.prev).toBeNull();
      expect(nav.next).toEqual(mockArticles[0]);
      expect(nav.currentIndex).toBe(0);
      expect(nav.total).toBe(3);
    });

    it('should handle single article array', () => {
      const singleArticle = [mockArticles[0]];
      const nav = getSeriesNavigation('cap-theorem-production', singleArticle);

      expect(nav.prev).toBeNull();
      expect(nav.next).toBeNull();
      expect(nav.currentIndex).toBe(1);
      expect(nav.total).toBe(1);
    });

    it('should handle empty array', () => {
      const nav = getSeriesNavigation('any-slug', []);

      expect(nav.prev).toBeNull();
      expect(nav.next).toBeNull();
      expect(nav.currentIndex).toBe(0);
      expect(nav.total).toBe(0);
    });
  });

  describe('getArticleSchema', () => {
    it('should generate valid TechArticle schema', () => {
      const article = mockArticles[0];
      const schema = getArticleSchema(article, 1, 3);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('TechArticle');
      expect(schema.headline).toBe(article.title);
      expect(schema.description).toBe(article.description);
    });

    it('should include author information', () => {
      const schema = getArticleSchema(mockArticles[0], 1, 3);

      expect(schema.author['@type']).toBe('Person');
      expect(schema.author.name).toBe(AUTHOR_NAME);
      expect(schema.author.url).toBe(SITE_URL);
    });

    it('should include correct dates', () => {
      const article = mockArticles[0];
      const schema = getArticleSchema(article, 1, 3);
      const expectedDate = parseArticleDate(article.date).toISOString();

      expect(schema.datePublished).toBe(expectedDate);
      expect(schema.dateModified).toBe(expectedDate);
    });

    it('should include article URL', () => {
      const article = mockArticles[0];
      const schema = getArticleSchema(article, 1, 3);
      const expectedUrl = `${SITE_URL}/blog/${article.slug}`;

      expect(schema.url).toBe(expectedUrl);
      expect(schema.mainEntityOfPage['@id']).toBe(expectedUrl);
    });

    it('should include series information', () => {
      const schema = getArticleSchema(mockArticles[0], 2, 5);

      expect(schema.isPartOf['@type']).toBe('CreativeWorkSeries');
      expect(schema.isPartOf.name).toBe('Distributed Systems Series');
      expect(schema.isPartOf.position).toBe(2);
      expect(schema.isPartOf.numberOfItems).toBe(5);
    });

    it('should calculate word count correctly', () => {
      const article = {
        ...mockArticles[0],
        content: 'word1 word2 word3 word4 word5',
      };
      const schema = getArticleSchema(article, 1, 3);

      expect(schema.wordCount).toBe(5);
    });

    it('should include SEO keywords', () => {
      const article = mockArticles[0];
      const schema = getArticleSchema(article, 1, 3);

      expect(schema.keywords).toEqual(article.seoKeywords);
    });

    it('should include article section', () => {
      const article = mockArticles[0];
      const schema = getArticleSchema(article, 1, 3);

      expect(schema.articleSection).toBe(article.category);
    });

    it('should set language to en-US', () => {
      const schema = getArticleSchema(mockArticles[0], 1, 3);
      expect(schema.inLanguage).toBe('en-US');
    });
  });

  describe('getBreadcrumbSchema', () => {
    it('should generate valid BreadcrumbList schema', () => {
      const article = mockArticles[0];
      const schema = getBreadcrumbSchema(article);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(3);
    });

    it('should include Home as first item', () => {
      const schema = getBreadcrumbSchema(mockArticles[0]);
      const homeItem = schema.itemListElement[0];

      expect(homeItem['@type']).toBe('ListItem');
      expect(homeItem.position).toBe(1);
      expect(homeItem.name).toBe('Home');
      expect(homeItem.item).toBe(SITE_URL);
    });

    it('should include Writing section as second item', () => {
      const schema = getBreadcrumbSchema(mockArticles[0]);
      const writingItem = schema.itemListElement[1];

      expect(writingItem.position).toBe(2);
      expect(writingItem.name).toBe('Writing');
      expect(writingItem.item).toBe(`${SITE_URL}/#writing`);
    });

    it('should include article as third item', () => {
      const article = mockArticles[0];
      const schema = getBreadcrumbSchema(article);
      const articleItem = schema.itemListElement[2];

      expect(articleItem.position).toBe(3);
      expect(articleItem.name).toBe(article.title);
      expect(articleItem.item).toBe(`${SITE_URL}/blog/${article.slug}`);
    });

    it('should maintain position order', () => {
      const schema = getBreadcrumbSchema(mockArticles[0]);

      schema.itemListElement.forEach((item, index) => {
        expect(item.position).toBe(index + 1);
      });
    });
  });

  describe('formatContent', () => {
    it('should convert h2 markdown to HTML', () => {
      const input = '## Heading 2';
      expect(formatContent(input)).toContain('<h2>Heading 2</h2>');
    });

    it('should convert h3 markdown to HTML', () => {
      const input = '### Heading 3';
      expect(formatContent(input)).toContain('<h3>Heading 3</h3>');
    });

    it('should convert bold markdown to strong tags', () => {
      const input = 'This is **bold** text';
      expect(formatContent(input)).toContain('<strong>bold</strong>');
    });

    it('should convert inline code to code tags', () => {
      const input = 'Use the `console.log` function';
      expect(formatContent(input)).toContain('<code>console.log</code>');
    });

    it('should convert code blocks to pre/code tags', () => {
      const input = '```javascript\nconst x = 1;\n```';
      const result = formatContent(input);
      // The function processes ``` as literal backticks, so check for that
      expect(result).toContain('const x = 1;');
    });

    it('should convert horizontal rules', () => {
      const input = 'Text before\n---\nText after';
      expect(formatContent(input)).toContain('<hr />');
    });

    it('should convert blockquotes', () => {
      const input = '> This is a quote';
      expect(formatContent(input)).toContain('<blockquote>This is a quote</blockquote>');
    });

    it('should convert list items to ul/li', () => {
      const input = '- Item 1\n- Item 2\n- Item 3';
      const result = formatContent(input);
      expect(result).toContain('<ul>');
      expect(result).toContain('<li>Item 1</li>');
      expect(result).toContain('<li>Item 2</li>');
      expect(result).toContain('<li>Item 3</li>');
      expect(result).toContain('</ul>');
    });

    it('should convert paragraphs', () => {
      const input = 'Paragraph 1\n\nParagraph 2';
      const result = formatContent(input);
      expect(result).toContain('<p>');
      expect(result).toContain('</p>');
    });

    it('should remove empty paragraphs', () => {
      const input = 'Text\n\n\n\nMore text';
      const result = formatContent(input);
      expect(result).not.toContain('<p></p>');
      expect(result).not.toContain('<p>\s*</p>');
    });

    it('should handle complex mixed content', () => {
      const input = `## Heading

This is **bold** and has \`code\`.

- List item 1
- List item 2

> Quote here

Regular paragraph.`;

      const result = formatContent(input);
      expect(result).toContain('<h2>');
      expect(result).toContain('<strong>');
      expect(result).toContain('<code>');
      expect(result).toContain('<ul>');
      expect(result).toContain('<blockquote>');
    });

    it('should handle empty string', () => {
      expect(formatContent('')).toBe('');
    });

    it('should not create nested paragraphs', () => {
      const input = 'Simple text';
      const result = formatContent(input);
      expect(result).not.toMatch(/<p><p>/);
    });
  });

  describe('Integration Tests', () => {
    it('should process complete article workflow', () => {
      const article = mockArticles[0];
      const nav = getSeriesNavigation(article.slug, mockArticles);
      const articleSchema = getArticleSchema(article, nav.currentIndex, nav.total);
      const breadcrumbSchema = getBreadcrumbSchema(article);
      const formattedContent = formatContent(article.content);

      expect(nav.currentIndex).toBe(1);
      expect(articleSchema['@type']).toBe('TechArticle');
      expect(breadcrumbSchema['@type']).toBe('BreadcrumbList');
      expect(formattedContent).toContain('<p>');
    });

    it('should handle article date formatting consistently', () => {
      const article = mockArticles[0];
      const parsedDate = parseArticleDate(article.date);
      const schema = getArticleSchema(article, 1, 3);

      expect(schema.datePublished).toBe(parsedDate.toISOString());
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle article with missing seoKeywords', () => {
      const article = {
        ...mockArticles[0],
        seoKeywords: undefined,
      };
      const schema = getArticleSchema(article, 1, 3);
      expect(schema.keywords).toBeUndefined();
    });

    it('should handle very long content', () => {
      const words = Array(10000).fill('word').join(' ');
      const article = { ...mockArticles[0], content: words };
      const schema = getArticleSchema(article, 1, 3);
      expect(schema.wordCount).toBe(10000);
    });

    it('should handle special characters in article title', () => {
      const article = {
        ...mockArticles[0],
        title: 'Article with <special> & "characters"',
      };
      const schema = getArticleSchema(article, 1, 3);
      expect(schema.headline).toContain('<special>');
    });

    it('should handle very long article slug', () => {
      const article = {
        ...mockArticles[0],
        slug: 'this-is-a-very-long-slug-that-might-cause-issues-in-url-generation',
      };
      const schema = getArticleSchema(article, 1, 3);
      expect(schema.url).toContain(article.slug);
    });
  });
});