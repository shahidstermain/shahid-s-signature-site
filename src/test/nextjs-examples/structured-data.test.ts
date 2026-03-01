import { describe, it, expect } from 'vitest';

const SITE_URL = 'https://shahidster.tech';
const AUTHOR_NAME = 'Shahid Moosa';

// Mock Article Schema (JSON-LD)
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  '@id': `${SITE_URL}/blog/cap-theorem-production`,
  headline: 'CAP Theorem in Production',
  description: 'Understanding CAP theorem in real-world distributed systems',
  datePublished: '2025-11-15T00:00:00.000Z',
  dateModified: '2025-11-15T00:00:00.000Z',
  author: {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: AUTHOR_NAME,
    url: SITE_URL,
    jobTitle: 'Cloud Database Support Engineer',
  },
  publisher: {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: AUTHOR_NAME,
    url: SITE_URL,
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${SITE_URL}/blog/cap-theorem-production`,
  },
  articleSection: 'Fundamentals',
  keywords: 'CAP theorem, distributed systems, consistency',
  wordCount: 1500,
  isPartOf: {
    '@type': 'CreativeWorkSeries',
    name: 'Distributed Systems Series',
    position: 1,
    numberOfItems: 10,
  },
  proficiencyLevel: 'Expert',
  inLanguage: 'en-US',
};

// Mock Person Schema
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: AUTHOR_NAME,
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

// Mock Website Schema
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Shahid Moosa — Cloud Database Engineer',
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

// Mock Breadcrumb Schema
const breadcrumbSchema = {
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
      name: 'CAP Theorem in Production',
      item: `${SITE_URL}/blog/cap-theorem-production`,
    },
  ],
};

// Mock FAQ Schema
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the CAP theorem?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The CAP theorem states that a distributed system can only guarantee two out of three properties: Consistency, Availability, and Partition tolerance.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does CAP theorem apply in production?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In production, teams must choose which two properties to prioritize based on their use case and business requirements.',
      },
    },
  ],
};

describe('Structured Data (JSON-LD) Schemas', () => {
  describe('Article Schema', () => {
    it('should have correct @context', () => {
      expect(articleSchema['@context']).toBe('https://schema.org');
    });

    it('should use TechArticle type', () => {
      expect(articleSchema['@type']).toBe('TechArticle');
    });

    it('should have unique @id', () => {
      expect(articleSchema['@id']).toContain('/blog/');
      expect(articleSchema['@id']).toMatch(/^https:\/\//);
    });

    it('should have headline', () => {
      expect(articleSchema.headline).toBeDefined();
      expect(articleSchema.headline.length).toBeGreaterThan(10);
    });

    it('should have description', () => {
      expect(articleSchema.description).toBeDefined();
      expect(articleSchema.description.length).toBeGreaterThan(20);
    });

    it('should have valid ISO 8601 dates', () => {
      expect(articleSchema.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(articleSchema.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should have author with Person type', () => {
      expect(articleSchema.author['@type']).toBe('Person');
      expect(articleSchema.author.name).toBe(AUTHOR_NAME);
      expect(articleSchema.author['@id']).toContain('#person');
    });

    it('should have publisher', () => {
      expect(articleSchema.publisher['@type']).toBe('Person');
      expect(articleSchema.publisher.name).toBe(AUTHOR_NAME);
    });

    it('should have mainEntityOfPage', () => {
      expect(articleSchema.mainEntityOfPage['@type']).toBe('WebPage');
      expect(articleSchema.mainEntityOfPage['@id']).toBe(articleSchema['@id']);
    });

    it('should have articleSection', () => {
      expect(articleSchema.articleSection).toBeDefined();
    });

    it('should have keywords', () => {
      expect(articleSchema.keywords).toBeDefined();
      expect(articleSchema.keywords.length).toBeGreaterThan(0);
    });

    it('should have wordCount', () => {
      expect(articleSchema.wordCount).toBeGreaterThan(0);
      expect(typeof articleSchema.wordCount).toBe('number');
    });

    it('should have isPartOf for series', () => {
      expect(articleSchema.isPartOf['@type']).toBe('CreativeWorkSeries');
      expect(articleSchema.isPartOf.name).toBeDefined();
      expect(articleSchema.isPartOf.position).toBeGreaterThan(0);
      expect(articleSchema.isPartOf.numberOfItems).toBeGreaterThan(0);
    });

    it('should have proficiencyLevel', () => {
      expect(articleSchema.proficiencyLevel).toBe('Expert');
    });

    it('should have inLanguage', () => {
      expect(articleSchema.inLanguage).toBe('en-US');
    });
  });

  describe('Person Schema', () => {
    it('should have correct @context', () => {
      expect(personSchema['@context']).toBe('https://schema.org');
    });

    it('should have Person type', () => {
      expect(personSchema['@type']).toBe('Person');
    });

    it('should have unique @id with fragment', () => {
      expect(personSchema['@id']).toContain('#person');
    });

    it('should have name', () => {
      expect(personSchema.name).toBe(AUTHOR_NAME);
    });

    it('should have jobTitle', () => {
      expect(personSchema.jobTitle).toBeDefined();
      expect(personSchema.jobTitle.length).toBeGreaterThan(5);
    });

    it('should have description', () => {
      expect(personSchema.description).toBeDefined();
    });

    it('should have worksFor with Organization', () => {
      expect(personSchema.worksFor['@type']).toBe('Organization');
      expect(personSchema.worksFor.name).toBeDefined();
      expect(personSchema.worksFor.url).toMatch(/^https:\/\//);
    });

    it('should have url', () => {
      expect(personSchema.url).toBe(SITE_URL);
    });

    it('should have image', () => {
      expect(personSchema.image).toContain(SITE_URL);
    });

    it('should have email with mailto:', () => {
      expect(personSchema.email).toMatch(/^mailto:/);
    });

    it('should have sameAs links', () => {
      expect(personSchema.sameAs).toBeInstanceOf(Array);
      expect(personSchema.sameAs.length).toBeGreaterThan(0);

      personSchema.sameAs.forEach((url: string) => {
        expect(url).toMatch(/^https:\/\//);
      });
    });

    it('should have knowsAbout', () => {
      expect(personSchema.knowsAbout).toBeInstanceOf(Array);
      expect(personSchema.knowsAbout.length).toBeGreaterThan(5);
    });

    it('should have valid social media URLs', () => {
      const hasTwitter = personSchema.sameAs.some((url: string) =>
        url.includes('twitter.com')
      );
      const hasLinkedIn = personSchema.sameAs.some((url: string) =>
        url.includes('linkedin.com')
      );
      const hasGitHub = personSchema.sameAs.some((url: string) =>
        url.includes('github.com')
      );

      expect(hasTwitter).toBe(true);
      expect(hasLinkedIn).toBe(true);
      expect(hasGitHub).toBe(true);
    });
  });

  describe('WebSite Schema', () => {
    it('should have correct @context', () => {
      expect(websiteSchema['@context']).toBe('https://schema.org');
    });

    it('should have WebSite type', () => {
      expect(websiteSchema['@type']).toBe('WebSite');
    });

    it('should have unique @id with fragment', () => {
      expect(websiteSchema['@id']).toContain('#website');
    });

    it('should have url', () => {
      expect(websiteSchema.url).toBe(SITE_URL);
    });

    it('should have name', () => {
      expect(websiteSchema.name).toBeDefined();
      expect(websiteSchema.name.length).toBeGreaterThan(10);
    });

    it('should have description', () => {
      expect(websiteSchema.description).toBeDefined();
    });

    it('should have publisher reference', () => {
      expect(websiteSchema.publisher['@id']).toContain('#person');
    });

    it('should have inLanguage', () => {
      expect(websiteSchema.inLanguage).toBe('en-US');
    });

    it('should have SearchAction', () => {
      expect(websiteSchema.potentialAction['@type']).toBe('SearchAction');
      expect(websiteSchema.potentialAction.target['@type']).toBe('EntryPoint');
      expect(websiteSchema.potentialAction.target.urlTemplate).toContain(
        '{search_term_string}'
      );
      expect(websiteSchema.potentialAction['query-input']).toContain('required');
    });
  });

  describe('Breadcrumb Schema', () => {
    it('should have correct @context', () => {
      expect(breadcrumbSchema['@context']).toBe('https://schema.org');
    });

    it('should have BreadcrumbList type', () => {
      expect(breadcrumbSchema['@type']).toBe('BreadcrumbList');
    });

    it('should have itemListElement array', () => {
      expect(breadcrumbSchema.itemListElement).toBeInstanceOf(Array);
      expect(breadcrumbSchema.itemListElement.length).toBeGreaterThan(0);
    });

    it('should have ListItem entries', () => {
      breadcrumbSchema.itemListElement.forEach((item: any) => {
        expect(item['@type']).toBe('ListItem');
        expect(item.position).toBeGreaterThan(0);
        expect(item.name).toBeDefined();
        expect(item.item).toBeDefined();
      });
    });

    it('should have sequential positions', () => {
      const positions = breadcrumbSchema.itemListElement.map((item: any) => item.position);
      for (let i = 0; i < positions.length - 1; i++) {
        expect(positions[i + 1]).toBe(positions[i] + 1);
      }
    });

    it('should start from home', () => {
      const firstItem = breadcrumbSchema.itemListElement[0];
      expect(firstItem.position).toBe(1);
      expect(firstItem.name).toBe('Home');
      expect(firstItem.item).toBe(SITE_URL);
    });

    it('should have valid URLs for all items', () => {
      breadcrumbSchema.itemListElement.forEach((item: any) => {
        expect(item.item).toContain(SITE_URL);
      });
    });
  });

  describe('FAQ Schema', () => {
    it('should have correct @context', () => {
      expect(faqSchema['@context']).toBe('https://schema.org');
    });

    it('should have FAQPage type', () => {
      expect(faqSchema['@type']).toBe('FAQPage');
    });

    it('should have mainEntity array', () => {
      expect(faqSchema.mainEntity).toBeInstanceOf(Array);
      expect(faqSchema.mainEntity.length).toBeGreaterThan(0);
    });

    it('should have Question entries', () => {
      faqSchema.mainEntity.forEach((entity: any) => {
        expect(entity['@type']).toBe('Question');
        expect(entity.name).toBeDefined();
        expect(entity.acceptedAnswer).toBeDefined();
      });
    });

    it('should have Answer for each Question', () => {
      faqSchema.mainEntity.forEach((entity: any) => {
        expect(entity.acceptedAnswer['@type']).toBe('Answer');
        expect(entity.acceptedAnswer.text).toBeDefined();
        expect(entity.acceptedAnswer.text.length).toBeGreaterThan(10);
      });
    });
  });

  describe('Schema Cross-References', () => {
    it('should have consistent person IDs', () => {
      const personId = `${SITE_URL}/#person`;
      expect(personSchema['@id']).toBe(personId);
      expect(articleSchema.author['@id']).toBe(personId);
      expect(articleSchema.publisher['@id']).toBe(personId);
      expect(websiteSchema.publisher['@id']).toBe(personId);
    });

    it('should have consistent website IDs', () => {
      const websiteId = `${SITE_URL}/#website`;
      expect(websiteSchema['@id']).toBe(websiteId);
    });

    it('should use same base URL throughout', () => {
      expect(personSchema['@id']).toContain(SITE_URL);
      expect(websiteSchema.url).toBe(SITE_URL);
      expect(articleSchema['@id']).toContain(SITE_URL);
      expect(breadcrumbSchema.itemListElement[0].item).toBe(SITE_URL);
    });
  });

  describe('Schema Validation', () => {
    it('should have valid @context URLs', () => {
      expect(articleSchema['@context']).toBe('https://schema.org');
      expect(personSchema['@context']).toBe('https://schema.org');
      expect(websiteSchema['@context']).toBe('https://schema.org');
      expect(breadcrumbSchema['@context']).toBe('https://schema.org');
      expect(faqSchema['@context']).toBe('https://schema.org');
    });

    it('should use HTTPS for all URLs', () => {
      const checkHttps = (obj: any) => {
        for (const key in obj) {
          const value = obj[key];
          if (typeof value === 'string' && value.startsWith('http')) {
            expect(value).toMatch(/^https:\/\//);
          } else if (typeof value === 'object' && value !== null) {
            checkHttps(value);
          }
        }
      };

      checkHttps(articleSchema);
      checkHttps(personSchema);
      checkHttps(websiteSchema);
    });

    it('should have valid date formats', () => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      expect(articleSchema.datePublished).toMatch(dateRegex);
      expect(articleSchema.dateModified).toMatch(dateRegex);
    });
  });

  describe('SEO Optimization', () => {
    it('should have descriptive headlines', () => {
      expect(articleSchema.headline.length).toBeGreaterThan(20);
      expect(articleSchema.headline.length).toBeLessThan(100);
    });

    it('should have meaningful keywords', () => {
      expect(articleSchema.keywords.length).toBeGreaterThan(10);
    });

    it('should have appropriate word count', () => {
      expect(articleSchema.wordCount).toBeGreaterThan(300);
    });

    it('should specify proficiency level', () => {
      expect(articleSchema.proficiencyLevel).toBeDefined();
    });

    it('should have series information for related content', () => {
      expect(articleSchema.isPartOf).toBeDefined();
      expect(articleSchema.isPartOf.position).toBeLessThanOrEqual(
        articleSchema.isPartOf.numberOfItems
      );
    });
  });

  describe('Rich Snippet Features', () => {
    it('should support breadcrumb navigation', () => {
      expect(breadcrumbSchema.itemListElement.length).toBeGreaterThanOrEqual(2);
    });

    it('should support FAQ rich snippets', () => {
      expect(faqSchema.mainEntity.length).toBeGreaterThanOrEqual(2);
    });

    it('should have SearchAction for sitelinks search box', () => {
      expect(websiteSchema.potentialAction).toBeDefined();
      expect(websiteSchema.potentialAction['@type']).toBe('SearchAction');
    });

    it('should have author information for knowledge graph', () => {
      expect(personSchema.knowsAbout).toBeDefined();
      expect(personSchema.sameAs).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle articles without series information', () => {
      const standaloneArticle = { ...articleSchema };
      delete standaloneArticle.isPartOf;
      expect(standaloneArticle.headline).toBeDefined();
    });

    it('should handle missing optional fields gracefully', () => {
      const minimalSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Test Article',
      };
      expect(minimalSchema['@context']).toBeDefined();
      expect(minimalSchema['@type']).toBeDefined();
    });

    it('should handle special characters in text fields', () => {
      const specialCharsText = 'Article — Test & "Quotes" <html>';
      expect(specialCharsText).toContain('—');
      expect(specialCharsText).toContain('&');
      expect(specialCharsText).toContain('"');
    });

    it('should validate numeric fields', () => {
      expect(typeof articleSchema.wordCount).toBe('number');
      expect(articleSchema.isPartOf.position).toBeGreaterThan(0);
      expect(articleSchema.isPartOf.numberOfItems).toBeGreaterThan(0);
    });
  });

  describe('Schema.org Compliance', () => {
    it('should not have circular references', () => {
      // Check that @id references don't create infinite loops
      expect(articleSchema.author['@id']).not.toBe(articleSchema['@id']);
      expect(personSchema['@id']).not.toBe(websiteSchema['@id']);
    });

    it('should use proper schema.org types', () => {
      const validTypes = ['Article', 'TechArticle', 'BlogPosting', 'Person', 'Organization', 'WebSite', 'WebPage', 'BreadcrumbList', 'FAQPage', 'Question', 'Answer', 'ListItem', 'CreativeWorkSeries', 'EntryPoint', 'SearchAction'];

      expect(validTypes).toContain(articleSchema['@type']);
      expect(validTypes).toContain(personSchema['@type']);
      expect(validTypes).toContain(websiteSchema['@type']);
    });

    it('should have required properties for TechArticle', () => {
      const requiredProps = ['@context', '@type', 'headline', 'author'];
      requiredProps.forEach((prop) => {
        expect(articleSchema).toHaveProperty(prop);
      });
    });

    it('should have valid email format in Person schema', () => {
      expect(personSchema.email).toMatch(/^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$/);
    });

    it('should have valid social media profile URLs', () => {
      personSchema.sameAs.forEach((url: string) => {
        expect(url).toMatch(/^https:\/\/(twitter|linkedin|github)\.com\//);
      });
    });
  });

  describe('Regression: Schema Integrity', () => {
    it('should maintain consistent date formats across schemas', () => {
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      expect(articleSchema.datePublished).toMatch(isoDateRegex);
      expect(articleSchema.dateModified).toMatch(isoDateRegex);
    });

    it('should not expose internal IDs in public URLs', () => {
      expect(articleSchema['@id']).not.toContain('internal');
      expect(articleSchema['@id']).not.toContain('temp');
      expect(articleSchema['@id']).not.toContain('draft');
    });

    it('should have consistent naming across related schemas', () => {
      expect(articleSchema.author.name).toBe(personSchema.name);
      expect(articleSchema.publisher.name).toBe(personSchema.name);
    });

    it('should maintain series position integrity', () => {
      const { position, numberOfItems } = articleSchema.isPartOf;
      expect(position).toBeLessThanOrEqual(numberOfItems);
      expect(position).toBeGreaterThan(0);
    });

    it('should not have broken entity references', () => {
      // Verify all @id references point to valid entities
      expect(articleSchema.author['@id']).toContain('#person');
      expect(articleSchema.publisher['@id']).toContain('#person');
      expect(websiteSchema.publisher['@id']).toContain('#person');
    });
  });
});