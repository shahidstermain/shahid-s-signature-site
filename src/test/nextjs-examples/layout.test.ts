import { describe, it, expect } from 'vitest';

const SITE_URL = 'https://shahidster.tech';
const SITE_NAME = 'Shahid Moosa — Cloud Database Engineer';
const SITE_DESCRIPTION = 'Cloud Database Support Engineer at SingleStore. I debug distributed systems, optimize queries at petabyte scale, and help Fortune 500 teams ship reliable data infrastructure.';

// Schema generation functions from layout example
function getPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Shahid Moosa',
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
}

function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
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
}

describe('Root Layout Schema Functions', () => {
  describe('getPersonSchema', () => {
    it('should generate valid Person schema', () => {
      const schema = getPersonSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Person');
    });

    it('should include person ID', () => {
      const schema = getPersonSchema();
      expect(schema['@id']).toBe(`${SITE_URL}/#person`);
    });

    it('should include name and job title', () => {
      const schema = getPersonSchema();

      expect(schema.name).toBe('Shahid Moosa');
      expect(schema.jobTitle).toBe('Cloud Database Support Engineer');
    });

    it('should include description', () => {
      const schema = getPersonSchema();

      expect(schema.description).toContain('Distributed Systems Engineer');
      expect(schema.description).toContain('database infrastructure');
    });

    it('should include organization information', () => {
      const schema = getPersonSchema();

      expect(schema.worksFor['@type']).toBe('Organization');
      expect(schema.worksFor.name).toBe('SingleStore');
      expect(schema.worksFor.url).toBe('https://www.singlestore.com');
    });

    it('should include personal URL', () => {
      const schema = getPersonSchema();
      expect(schema.url).toBe(SITE_URL);
    });

    it('should include image URL', () => {
      const schema = getPersonSchema();
      expect(schema.image).toBe(`${SITE_URL}/shahid-moosa.jpg`);
    });

    it('should include email with mailto protocol', () => {
      const schema = getPersonSchema();
      expect(schema.email).toBe('mailto:hello@shahidster.tech');
      expect(schema.email).toMatch(/^mailto:/);
    });

    it('should include social media profiles', () => {
      const schema = getPersonSchema();

      expect(schema.sameAs).toHaveLength(3);
      expect(schema.sameAs).toContain('https://twitter.com/shahidster_');
      expect(schema.sameAs).toContain('https://linkedin.com/in/shahidmoosa');
      expect(schema.sameAs).toContain('https://github.com/shahidmoosa');
    });

    it('should include all social profiles with HTTPS', () => {
      const schema = getPersonSchema();

      schema.sameAs.forEach((url) => {
        expect(url).toMatch(/^https:\/\//);
      });
    });

    it('should include knowledge areas', () => {
      const schema = getPersonSchema();

      expect(schema.knowsAbout).toBeInstanceOf(Array);
      expect(schema.knowsAbout).toContain('Distributed Systems');
      expect(schema.knowsAbout).toContain('Database Engineering');
      expect(schema.knowsAbout).toContain('Cloud Infrastructure');
      expect(schema.knowsAbout).toContain('AWS');
      expect(schema.knowsAbout).toContain('PostgreSQL');
      expect(schema.knowsAbout).toContain('MySQL');
      expect(schema.knowsAbout).toContain('SingleStore');
      expect(schema.knowsAbout).toContain('Query Optimization');
      expect(schema.knowsAbout).toContain('Data Sharding');
    });

    it('should have at least 5 knowledge areas', () => {
      const schema = getPersonSchema();
      expect(schema.knowsAbout.length).toBeGreaterThanOrEqual(5);
    });

    it('should not include undefined or null values', () => {
      const schema = getPersonSchema();

      Object.values(schema).forEach((value) => {
        expect(value).not.toBeUndefined();
        expect(value).not.toBeNull();
      });
    });

    it('should return same structure on multiple calls', () => {
      const schema1 = getPersonSchema();
      const schema2 = getPersonSchema();

      expect(schema1).toEqual(schema2);
    });
  });

  describe('getWebsiteSchema', () => {
    it('should generate valid WebSite schema', () => {
      const schema = getWebsiteSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebSite');
    });

    it('should include website ID', () => {
      const schema = getWebsiteSchema();
      expect(schema['@id']).toBe(`${SITE_URL}/#website`);
    });

    it('should include website URL', () => {
      const schema = getWebsiteSchema();
      expect(schema.url).toBe(SITE_URL);
    });

    it('should include website name', () => {
      const schema = getWebsiteSchema();
      expect(schema.name).toBe(SITE_NAME);
    });

    it('should include website description', () => {
      const schema = getWebsiteSchema();

      expect(schema.description).toContain('Technical blog');
      expect(schema.description).toContain('Shahid Moosa');
      expect(schema.description).toContain('Cloud Database Engineer');
    });

    it('should reference publisher person schema', () => {
      const schema = getWebsiteSchema();

      expect(schema.publisher['@id']).toBe(`${SITE_URL}/#person`);
    });

    it('should set language to en-US', () => {
      const schema = getWebsiteSchema();
      expect(schema.inLanguage).toBe('en-US');
    });

    it('should include SearchAction', () => {
      const schema = getWebsiteSchema();

      expect(schema.potentialAction['@type']).toBe('SearchAction');
    });

    it('should include search target with EntryPoint', () => {
      const schema = getWebsiteSchema();

      expect(schema.potentialAction.target['@type']).toBe('EntryPoint');
      expect(schema.potentialAction.target.urlTemplate).toContain('{search_term_string}');
    });

    it('should include search URL template', () => {
      const schema = getWebsiteSchema();

      const urlTemplate = schema.potentialAction.target.urlTemplate;
      expect(urlTemplate).toBe(`${SITE_URL}/blog?q={search_term_string}`);
      expect(urlTemplate).toContain('?q=');
    });

    it('should include query-input for search', () => {
      const schema = getWebsiteSchema();

      expect(schema.potentialAction['query-input']).toBe('required name=search_term_string');
      expect(schema.potentialAction['query-input']).toContain('required');
    });

    it('should not include undefined values', () => {
      const schema = getWebsiteSchema();

      expect(schema['@context']).toBeDefined();
      expect(schema['@type']).toBeDefined();
      expect(schema.url).toBeDefined();
      expect(schema.name).toBeDefined();
      expect(schema.description).toBeDefined();
    });

    it('should return consistent structure', () => {
      const schema1 = getWebsiteSchema();
      const schema2 = getWebsiteSchema();

      expect(schema1).toEqual(schema2);
    });
  });

  describe('Schema Integration', () => {
    it('should have matching person IDs between schemas', () => {
      const personSchema = getPersonSchema();
      const websiteSchema = getWebsiteSchema();

      expect(websiteSchema.publisher['@id']).toBe(personSchema['@id']);
    });

    it('should have consistent site URL across schemas', () => {
      const personSchema = getPersonSchema();
      const websiteSchema = getWebsiteSchema();

      expect(personSchema.url).toBe(SITE_URL);
      expect(websiteSchema.url).toBe(SITE_URL);
      expect(personSchema['@id']).toContain(SITE_URL);
      expect(websiteSchema['@id']).toContain(SITE_URL);
    });

    it('should both use schema.org context', () => {
      const personSchema = getPersonSchema();
      const websiteSchema = getWebsiteSchema();

      expect(personSchema['@context']).toBe('https://schema.org');
      expect(websiteSchema['@context']).toBe('https://schema.org');
    });

    it('should create valid relationship between person and website', () => {
      const personSchema = getPersonSchema();
      const websiteSchema = getWebsiteSchema();

      // Website references person as publisher
      expect(websiteSchema.publisher).toBeDefined();
      expect(websiteSchema.publisher['@id']).toBe(personSchema['@id']);
    });
  });

  describe('Schema Validation', () => {
    it('should have valid person schema structure', () => {
      const schema = getPersonSchema();

      const requiredFields = ['@context', '@type', '@id', 'name', 'jobTitle', 'url'];
      requiredFields.forEach((field) => {
        expect(schema).toHaveProperty(field);
        expect(schema[field]).toBeTruthy();
      });
    });

    it('should have valid website schema structure', () => {
      const schema = getWebsiteSchema();

      const requiredFields = ['@context', '@type', '@id', 'url', 'name', 'description', 'publisher'];
      requiredFields.forEach((field) => {
        expect(schema).toHaveProperty(field);
        expect(schema[field]).toBeTruthy();
      });
    });

    it('should use HTTPS for all URLs in person schema', () => {
      const schema = getPersonSchema();

      expect(schema.url).toMatch(/^https:\/\//);
      expect(schema.image).toMatch(/^https:\/\//);
      expect(schema.worksFor.url).toMatch(/^https:\/\//);
      schema.sameAs.forEach((url) => {
        expect(url).toMatch(/^https:\/\//);
      });
    });

    it('should use HTTPS for all URLs in website schema', () => {
      const schema = getWebsiteSchema();

      expect(schema.url).toMatch(/^https:\/\//);
      expect(schema.potentialAction.target.urlTemplate).toMatch(/^https:\/\//);
    });
  });

  describe('Edge Cases and Security', () => {
    it('should not expose sensitive information', () => {
      const personSchema = getPersonSchema();

      // Should not contain passwords, API keys, etc.
      const schemaString = JSON.stringify(personSchema);
      expect(schemaString).not.toContain('password');
      expect(schemaString).not.toContain('api_key');
      expect(schemaString).not.toContain('secret');
    });

    it('should use public contact methods only', () => {
      const personSchema = getPersonSchema();

      expect(personSchema.email).toContain('hello@');
      expect(personSchema.email).not.toContain('private');
      expect(personSchema.email).not.toContain('admin');
    });

    it('should have valid JSON structure', () => {
      const personSchema = getPersonSchema();
      const websiteSchema = getWebsiteSchema();

      expect(() => JSON.stringify(personSchema)).not.toThrow();
      expect(() => JSON.stringify(websiteSchema)).not.toThrow();
    });

    it('should not have circular references', () => {
      const personSchema = getPersonSchema();
      const websiteSchema = getWebsiteSchema();

      // Should be able to stringify without issues
      const personJson = JSON.stringify(personSchema);
      const websiteJson = JSON.stringify(websiteSchema);

      expect(personJson).toBeTruthy();
      expect(websiteJson).toBeTruthy();
    });
  });

  describe('Professional Branding', () => {
    it('should maintain consistent job title', () => {
      const personSchema = getPersonSchema();
      expect(personSchema.jobTitle).toBe('Cloud Database Support Engineer');
    });

    it('should highlight distributed systems expertise', () => {
      const personSchema = getPersonSchema();

      expect(personSchema.description).toContain('Distributed Systems');
      expect(personSchema.knowsAbout).toContain('Distributed Systems');
    });

    it('should reference SingleStore consistently', () => {
      const personSchema = getPersonSchema();

      expect(personSchema.jobTitle).toContain('Cloud Database Support Engineer');
      expect(personSchema.worksFor.name).toBe('SingleStore');
      expect(personSchema.knowsAbout).toContain('SingleStore');
    });

    it('should include diverse technical skills', () => {
      const personSchema = getPersonSchema();

      const technicalSkills = personSchema.knowsAbout.filter((skill) =>
        ['AWS', 'PostgreSQL', 'MySQL', 'SingleStore'].includes(skill)
      );

      expect(technicalSkills.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('SEO Optimization', () => {
    it('should include rich semantic information in person schema', () => {
      const schema = getPersonSchema();

      expect(schema.description).toBeTruthy();
      expect(schema.jobTitle).toBeTruthy();
      expect(schema.knowsAbout.length).toBeGreaterThan(0);
    });

    it('should include search functionality in website schema', () => {
      const schema = getWebsiteSchema();

      expect(schema.potentialAction).toBeDefined();
      expect(schema.potentialAction['@type']).toBe('SearchAction');
    });

    it('should use descriptive website description', () => {
      const schema = getWebsiteSchema();

      expect(schema.description.length).toBeGreaterThan(50);
      expect(schema.description).toContain('Cloud Database Engineer');
    });

    it('should link social profiles for authority', () => {
      const schema = getPersonSchema();

      const socialPlatforms = ['twitter', 'linkedin', 'github'];
      const hasSocialLinks = socialPlatforms.every((platform) =>
        schema.sameAs.some((url) => url.includes(platform))
      );

      expect(hasSocialLinks).toBe(true);
    });
  });
});