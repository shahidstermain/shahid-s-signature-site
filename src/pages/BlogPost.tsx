import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, Calendar, BookOpen } from "lucide-react";
import { getArticleBySlug, articles, Article } from "@/data/articles";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { ReadingProgressBar } from "@/components/ui/ReadingProgressBar";
import { Seo } from "@/components/seo/Seo";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { formatArticleDateIso } from "@/lib/seo-utils";

/**
 * Determine the previous and next articles in the series for a given article slug.
 *
 * @param currentSlug - The slug of the current article to locate within the series.
 * @returns An object containing:
 *  - `prev`: the preceding article in the series, or `null` if none exists.
 *  - `next`: the following article in the series, or `null` if none exists.
 *  - `currentIndex`: the 1-based position of the current article within the series.
 *  - `total`: the total number of articles in the series.
 */
function getSeriesNavigation(currentSlug: string): { prev: Article | null; next: Article | null; currentIndex: number; total: number } {
  const currentIndex = articles.findIndex(a => a.slug === currentSlug);
  return {
    prev: currentIndex > 0 ? articles[currentIndex - 1] : null,
    next: currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null,
    currentIndex: currentIndex + 1,
    total: articles.length
  };
}

const getArticleKeywords = (article: Article): string[] => {
  if (article.seoKeywords?.length) {
    return Array.from(new Set([...article.seoKeywords, article.category]));
  }

  return [article.category];
};

/**
 * Render a blog article page or a not-found view based on the current route slug.
 *
 * When an article matching the URL slug exists, this component renders the article
 * (SEO metadata, series navigation, header, formatted content, related articles, and footer).
 * If no article is found it renders a centered "Article Not Found" message and a noindex SEO tag.
 *
 * @returns The React element for the article page or the not-found view.
 */
export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;
  const { prev, next, currentIndex, total } = article 
    ? getSeriesNavigation(article.slug) 
    : { prev: null, next: null, currentIndex: 0, total: 0 };

  if (!article) {
    const missingPath = slug ? `/blog/${slug}` : undefined;
    return (
      <div className="min-h-screen flex flex-col">
        <Seo
          description="The requested article could not be found."
          noindex
          path={missingPath}
          title="Article not found"
        />
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-heading font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
            <Link
              to="/#writing"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to articles
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get related articles (same category, excluding current)
  const relatedArticles = articles
    .filter(a => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);
  const publishedTime = formatArticleDateIso(article.date);
  const articlePath = `/blog/${article.slug}`;
  const jsonLd = [
    buildArticleJsonLd(article, { currentIndex, total }),
    buildBreadcrumbJsonLd(article),
  ];
  const keywords = getArticleKeywords(article);

  return (
    <div className="min-h-screen flex flex-col relative">
      <Seo
        description={article.description}
        jsonLd={jsonLd}
        keywords={keywords}
        modifiedTime={publishedTime}
        path={articlePath}
        publishedTime={publishedTime}
        title={article.title}
        type="article"
      />
      <ReadingProgressBar />
      <BackgroundGlow />
      <Header />
      
      <main className="flex-1 pt-32 pb-20">
        <article className="section-container max-w-3xl mx-auto">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/#writing"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to articles
            </Link>
          </motion.div>

          {/* Series Navigation Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mb-8 p-4 rounded-lg border border-border/50 bg-card/30"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Distributed Systems Series</p>
                  <p className="font-medium text-foreground">
                    {article.seriesPosition || `Part ${currentIndex} of ${total}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {prev ? (
                  <Link
                    to={`/blog/${prev.slug}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-muted/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    title={prev.title}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Previous</span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-muted/30 text-muted-foreground/50 cursor-not-allowed">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Previous</span>
                  </span>
                )}
                {next ? (
                  <Link
                    to={`/blog/${next.slug}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-primary/10 hover:bg-primary/20 transition-colors text-primary"
                    title={next.title}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-muted/30 text-muted-foreground/50 cursor-not-allowed">
                    <span className="hidden sm:inline">Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                {article.category}
              </span>
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-6">
              {article.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              {article.description}
            </p>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
            </div>
          </motion.header>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-heading prose-headings:font-semibold
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground prose-strong:font-semibold
              prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-card prose-pre:border prose-pre:border-border
              prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
              prose-table:border-border
              prose-th:border-border prose-th:bg-muted/50 prose-th:px-4 prose-th:py-2
              prose-td:border-border prose-td:px-4 prose-td:py-2
              prose-hr:border-border
              prose-li:text-muted-foreground
            "
            dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
          />

          {/* Bottom Series Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {prev ? (
              <Link
                to={`/blog/${prev.slug}`}
                className="group flex flex-col p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors"
              >
                <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                  <ArrowLeft className="w-3 h-3" />
                  Previous in series
                </span>
                <span className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                to={`/blog/${next.slug}`}
                className="group flex flex-col p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors text-right sm:items-end"
              >
                <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2 justify-end">
                  Next in series
                  <ArrowRight className="w-3 h-3" />
                </span>
                <span className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                  {next.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </motion.div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 pt-12 border-t border-border"
            >
              <h2 className="font-heading text-2xl font-semibold mb-8">Related Articles</h2>
              <div className="grid gap-4">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    to={`/blog/${related.slug}`}
                    className="group flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-medium text-primary/80">
                          {related.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {related.readTime}
                        </span>
                      </div>
                      <h4 className="font-medium group-hover:text-primary transition-colors truncate">
                        {related.title}
                      </h4>
                    </div>
                    <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-4" />
                  </Link>
                ))}
              </div>
            </motion.section>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}

// Simple markdown-like formatting
function formatContent(content: string): string {
  return content
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // Tables (basic support)
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      if (cells.every(c => /^[-:]+$/.test(c.trim()))) {
        return ''; // Skip separator row
      }
      const isHeader = match.includes('---');
      const tag = isHeader ? 'th' : 'td';
      return `<tr>${cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('')}</tr>`;
    })
    // Wrap tables
    .replace(/(<tr>.*<\/tr>\n?)+/g, '<table><tbody>$&</tbody></table>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr />')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hpuoltb])(.+)$/gm, '<p>$1</p>')
    // Clean up empty paragraphs
    .replace(/<p><\/p>/g, '')
    .replace(/<p>\s*<\/p>/g, '');
}
