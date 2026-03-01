/**
 * Tests for SEO Metadata Structure and Best Practices
 * Ensuring proper metadata structure and compliance with SEO standards
 */

import { describe, it, expect } from 'vitest';

describe('SEO Metadata Best Practices', () => {
  describe('Title Tag Validation', () => {
    it('should validate title length is within optimal range', () => {
      const validateTitleLength = (title: string): { valid: boolean; length: number } => {
        const length = title.length;
        return {
          valid: length >= 30 && length <= 60,
          length,
        };
      };

      const goodTitle = 'Shahid Moosa — Cloud Database Engineer';
      expect(validateTitleLength(goodTitle).valid).toBe(true);

      const tooShort = 'Blog Post';
      expect(validateTitleLength(tooShort).valid).toBe(false);

      const tooLong = 'A'.repeat(70);
      expect(validateTitleLength(tooLong).valid).toBe(false);
    });

    it('should create template-based titles correctly', () => {
      const createPageTitle = (pageTitle: string, template: string = '%s | Shahid Moosa'): string => {
        return template.replace('%s', pageTitle);
      };

      expect(createPageTitle('About')).toBe('About | Shahid Moosa');
      expect(createPageTitle('Blog Post', '%s')).toBe('Blog Post');
    });
  });

  describe('Meta Description Validation', () => {
    it('should validate description length', () => {
      const validateDescriptionLength = (description: string): { valid: boolean; length: number } => {
        const length = description.length;
        return {
          valid: length >= 120 && length <= 160,
          length,
        };
      };

      const goodDesc = 'Cloud Database Support Engineer at SingleStore. I debug distributed systems, optimize queries at petabyte scale, and help Fortune 500 teams.';
      expect(validateDescriptionLength(goodDesc).valid).toBe(true);

      const tooShort = 'Engineer at company';
      expect(validateDescriptionLength(tooShort).valid).toBe(false);
    });

    it('should not contain line breaks', () => {
      const validateDescription = (description: string): boolean => {
        return !description.includes('\n') && !description.includes('\r');
      };

      expect(validateDescription('Valid description without line breaks')).toBe(true);
      expect(validateDescription('Invalid\ndescription with\nline breaks')).toBe(false);
    });
  });

  describe('Canonical URL Validation', () => {
    it('should use HTTPS protocol', () => {
      const validateCanonicalUrl = (url: string): boolean => {
        return url.startsWith('https://');
      };

      expect(validateCanonicalUrl('https://shahidster.tech')).toBe(true);
      expect(validateCanonicalUrl('http://shahidster.tech')).toBe(false);
    });

    it('should not have trailing slash for consistency', () => {
      const normalizeUrl = (url: string): string => {
        return url.endsWith('/') && url.length > 1 ? url.slice(0, -1) : url;
      };

      expect(normalizeUrl('https://shahidster.tech/')).toBe('https://shahidster.tech');
      expect(normalizeUrl('https://shahidster.tech/blog/')).toBe('https://shahidster.tech/blog');
      expect(normalizeUrl('https://shahidster.tech/blog')).toBe('https://shahidster.tech/blog');
    });

    it('should be absolute URL, not relative', () => {
      const isAbsoluteUrl = (url: string): boolean => {
        return url.startsWith('http://') || url.startsWith('https://');
      };

      expect(isAbsoluteUrl('https://shahidster.tech/blog')).toBe(true);
      expect(isAbsoluteUrl('/blog')).toBe(false);
      expect(isAbsoluteUrl('blog')).toBe(false);
    });
  });

  describe('Open Graph Metadata Validation', () => {
    it('should have required OG properties', () => {
      const validateOGMetadata = (og: Record<string, any>): { valid: boolean; missing: string[] } => {
        const required = ['title', 'description', 'type', 'url', 'images'];
        const missing = required.filter(key => !og[key]);

        return {
          valid: missing.length === 0,
          missing,
        };
      };

      const completeOG = {
        title: 'Title',
        description: 'Description',
        type: 'website',
        url: 'https://example.com',
        images: [{ url: 'https://example.com/og.png' }],
      };

      const result = validateOGMetadata(completeOG);
      expect(result.valid).toBe(true);
      expect(result.missing).toHaveLength(0);
    });

    it('should validate OG image dimensions', () => {
      const validateOGImage = (image: { width?: number; height?: number }): boolean => {
        // Recommended: 1200x630 for large image cards
        if (!image.width || !image.height) return false;

        return image.width === 1200 && image.height === 630;
      };

      expect(validateOGImage({ width: 1200, height: 630 })).toBe(true);
      expect(validateOGImage({ width: 800, height: 600 })).toBe(false);
      expect(validateOGImage({})).toBe(false);
    });

    it('should use correct OG type for articles', () => {
      const getOGType = (isArticle: boolean): string => {
        return isArticle ? 'article' : 'website';
      };

      expect(getOGType(true)).toBe('article');
      expect(getOGType(false)).toBe('website');
    });

    it('should include publishedTime for articles', () => {
      const validateArticleMetadata = (og: Record<string, any>): boolean => {
        if (og.type === 'article') {
          return !!og.publishedTime;
        }
        return true; // Non-articles don't need publishedTime
      };

      expect(validateArticleMetadata({ type: 'article', publishedTime: '2025-01-01' })).toBe(true);
      expect(validateArticleMetadata({ type: 'article' })).toBe(false);
      expect(validateArticleMetadata({ type: 'website' })).toBe(true);
    });
  });

  describe('Twitter Card Metadata Validation', () => {
    it('should use summary_large_image for better visibility', () => {
      const getTwitterCard = (hasImage: boolean): string => {
        return hasImage ? 'summary_large_image' : 'summary';
      };

      expect(getTwitterCard(true)).toBe('summary_large_image');
      expect(getTwitterCard(false)).toBe('summary');
    });

    it('should include creator handle', () => {
      const validateTwitterMetadata = (twitter: Record<string, any>): boolean => {
        return !!twitter.creator && twitter.creator.startsWith('@');
      };

      expect(validateTwitterMetadata({ creator: '@shahidster_' })).toBe(true);
      expect(validateTwitterMetadata({ creator: 'shahidster_' })).toBe(false);
      expect(validateTwitterMetadata({})).toBe(false);
    });
  });

  describe('Structured Data (Schema.org) Validation', () => {
    it('should have required schema context and type', () => {
      const validateSchema = (schema: Record<string, any>): boolean => {
        return schema['@context'] === 'https://schema.org' && !!schema['@type'];
      };

      const validSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'John Doe',
      };

      expect(validateSchema(validSchema)).toBe(true);
      expect(validateSchema({ '@type': 'Person' })).toBe(false);
      expect(validateSchema({ '@context': 'https://schema.org' })).toBe(false);
    });

    it('should validate Person schema required fields', () => {
      const validatePersonSchema = (person: Record<string, any>): { valid: boolean; missing: string[] } => {
        const required = ['name', 'url'];
        const missing = required.filter(key => !person[key]);

        return {
          valid: missing.length === 0 && person['@type'] === 'Person',
          missing,
        };
      };

      const validPerson = {
        '@type': 'Person',
        name: 'Shahid Moosa',
        url: 'https://shahidster.tech',
      };

      const result = validatePersonSchema(validPerson);
      expect(result.valid).toBe(true);
      expect(result.missing).toHaveLength(0);
    });

    it('should validate Article schema required fields', () => {
      const validateArticleSchema = (article: Record<string, any>): { valid: boolean; missing: string[] } => {
        const required = ['headline', 'author', 'datePublished'];
        const missing = required.filter(key => !article[key]);

        return {
          valid: missing.length === 0 && (article['@type'] === 'Article' || article['@type'] === 'TechArticle'),
          missing,
        };
      };

      const validArticle = {
        '@type': 'TechArticle',
        headline: 'Article Title',
        author: { '@type': 'Person', name: 'Author' },
        datePublished: '2025-01-01',
      };

      const result = validateArticleSchema(validArticle);
      expect(result.valid).toBe(true);
    });

    it('should validate BreadcrumbList structure', () => {
      const validateBreadcrumbs = (breadcrumbs: Record<string, any>): boolean => {
        if (breadcrumbs['@type'] !== 'BreadcrumbList') return false;
        if (!Array.isArray(breadcrumbs.itemListElement)) return false;

        // Check that positions are sequential starting from 1
        return breadcrumbs.itemListElement.every((item: any, index: number) => {
          return item.position === index + 1 && item['@type'] === 'ListItem';
        });
      };

      const validBreadcrumbs = {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://example.com/blog' },
        ],
      };

      expect(validateBreadcrumbs(validBreadcrumbs)).toBe(true);

      const invalidBreadcrumbs = {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com' },
          { '@type': 'ListItem', position: 3, name: 'Blog', item: 'https://example.com/blog' }, // Skips position 2
        ],
      };

      expect(validateBreadcrumbs(invalidBreadcrumbs)).toBe(false);
    });
  });

  describe('Robots Meta Tag Validation', () => {
    it('should allow indexing for public pages', () => {
      const getRobotsMeta = (isPublic: boolean): { index: boolean; follow: boolean } => {
        return {
          index: isPublic,
          follow: true,
        };
      };

      expect(getRobotsMeta(true)).toEqual({ index: true, follow: true });
      expect(getRobotsMeta(false)).toEqual({ index: false, follow: true });
    });

    it('should noindex 404 pages', () => {
      const get404RobotsMeta = (): { index: boolean; follow: boolean } => {
        return {
          index: false,
          follow: true, // Still follow links from 404 page
        };
      };

      const robots = get404RobotsMeta();
      expect(robots.index).toBe(false);
      expect(robots.follow).toBe(true);
    });
  });

  describe('URL Structure Best Practices', () => {
    it('should use lowercase URLs', () => {
      const normalizeUrlCase = (url: string): string => {
        const urlParts = new URL(url);
        urlParts.pathname = urlParts.pathname.toLowerCase();
        return urlParts.toString();
      };

      expect(normalizeUrlCase('https://example.com/Blog/Article')).toBe('https://example.com/blog/article');
    });

    it('should use hyphens instead of underscores', () => {
      const createSlug = (title: string): string => {
        return title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/_/g, '-');
      };

      expect(createSlug('My Blog Post')).toBe('my-blog-post');
      expect(createSlug('My_Blog_Post')).toBe('my-blog-post');
    });

    it('should remove special characters from slugs', () => {
      const createSlug = (title: string): string => {
        return title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
      };

      expect(createSlug('Title with "quotes" & symbols!')).toBe('title-with-quotes-symbols');
    });
  });

  describe('Core Web Vitals Thresholds', () => {
    it('should validate LCP is under 2.5s', () => {
      const validateLCP = (lcp: number): { valid: boolean; rating: string } => {
        if (lcp <= 2500) return { valid: true, rating: 'good' };
        if (lcp <= 4000) return { valid: false, rating: 'needs improvement' };
        return { valid: false, rating: 'poor' };
      };

      expect(validateLCP(2000).valid).toBe(true);
      expect(validateLCP(2000).rating).toBe('good');
      expect(validateLCP(3000).valid).toBe(false);
      expect(validateLCP(5000).rating).toBe('poor');
    });

    it('should validate CLS is under 0.1', () => {
      const validateCLS = (cls: number): { valid: boolean; rating: string } => {
        if (cls <= 0.1) return { valid: true, rating: 'good' };
        if (cls <= 0.25) return { valid: false, rating: 'needs improvement' };
        return { valid: false, rating: 'poor' };
      };

      expect(validateCLS(0.05).valid).toBe(true);
      expect(validateCLS(0.15).valid).toBe(false);
      expect(validateCLS(0.3).rating).toBe('poor');
    });

    it('should validate FID is under 100ms', () => {
      const validateFID = (fid: number): { valid: boolean; rating: string } => {
        if (fid <= 100) return { valid: true, rating: 'good' };
        if (fid <= 300) return { valid: false, rating: 'needs improvement' };
        return { valid: false, rating: 'poor' };
      };

      expect(validateFID(50).valid).toBe(true);
      expect(validateFID(200).valid).toBe(false);
      expect(validateFID(400).rating).toBe('poor');
    });
  });

  describe('Sitemap XML Validation', () => {
    it('should have required URL properties', () => {
      const validateSitemapUrl = (url: Record<string, any>): { valid: boolean; missing: string[] } => {
        const required = ['url', 'lastModified'];
        const missing = required.filter(key => !url[key]);

        return {
          valid: missing.length === 0,
          missing,
        };
      };

      const validUrl = {
        url: 'https://example.com/page',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      };

      expect(validateSitemapUrl(validUrl).valid).toBe(true);
    });

    it('should have priority between 0 and 1', () => {
      const validatePriority = (priority: number): boolean => {
        return priority >= 0 && priority <= 1;
      };

      expect(validatePriority(0.5)).toBe(true);
      expect(validatePriority(1.0)).toBe(true);
      expect(validatePriority(0)).toBe(true);
      expect(validatePriority(1.5)).toBe(false);
      expect(validatePriority(-0.1)).toBe(false);
    });

    it('should use valid changeFrequency values', () => {
      const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

      const validateChangeFrequency = (freq: string): boolean => {
        return validFrequencies.includes(freq);
      };

      expect(validateChangeFrequency('weekly')).toBe(true);
      expect(validateChangeFrequency('daily')).toBe(true);
      expect(validateChangeFrequency('sometimes')).toBe(false);
    });
  });
});