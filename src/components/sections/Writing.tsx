import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ArrowUpRight, Clock, Calendar, GraduationCap, Lock } from "lucide-react";
import { articles } from "@/data/articles";
import { COURSE_META } from "@/lib/course";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface ArticleMeta {
  slug: string;
  is_premium: boolean;
  published: boolean;
}

export const Writing = () => {
  const { isAdmin, session } = useAuth();
  const [metaMap, setMetaMap] = useState<Record<string, ArticleMeta>>({});

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const url = `${supabaseUrl}/functions/v1/list-articles`;
    const headers: Record<string, string> = {
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    };
    if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
    fetch(url, { headers })
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, ArticleMeta> = {};
        (data?.articles || []).forEach((a: ArticleMeta) => {
          map[a.slug] = a;
        });
        setMetaMap(map);
      })
      .catch(() => setMetaMap({}));
  }, [session?.access_token]);

  // Hide articles that have a DB row with published=false (unless viewer is admin)
  const isVisible = (slug: string) => {
    const meta = metaMap[slug];
    if (!meta) return true; // no DB row = legacy free article, visible
    return meta.published || isAdmin;
  };
  const isPremiumSlug = (slug: string) => !!metaMap[slug]?.is_premium;

  const visibleArticles = articles.filter((a) => isVisible(a.slug));
  const featuredArticles = visibleArticles.filter((a) => a.featured);
  const otherArticles = visibleArticles.filter((a) => !a.featured);

  return (
    <Section id="writing">
      <SectionHeader
        label="Database 201"
        title="A free course on distributed databases"
        description={`${COURSE_META.totalModules} modules. Every post below is a standalone lesson — read in any order, free forever.`}
      />

      {/* Course CTA banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <Link
          to="/course"
          className="group flex items-center justify-between gap-4 p-5 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-card/30 hover:border-primary/60 transition-colors"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-11 h-11 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="font-medium group-hover:text-primary transition-colors">
                View the full {COURSE_META.name} syllabus
              </div>
              <div className="text-sm text-muted-foreground">
                Free email course · optional ${COURSE_META.price} Pro bundle with eBook + SQL labs
              </div>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
        </Link>
      </motion.div>

      {/* Featured Articles */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {featuredArticles.map((article, index) => (
          <motion.div
            key={article.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link
              to={`/blog/${article.slug}`}
              className="group relative block card-elevated p-8 transition-all duration-300 overflow-hidden hover:border-primary/30"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                      {article.category}
                    </span>
                    {isPremiumSlug(article.slug) && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 inline-flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Premium
                      </span>
                    )}
                    {isAdmin && metaMap[article.slug] && !metaMap[article.slug].published && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                        Draft
                      </span>
                    )}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                
                <h3 className="font-heading text-xl font-semibold mb-3 leading-snug group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {article.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {article.date}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Other Articles */}
      <div className="grid md:grid-cols-2 gap-4">
        {otherArticles.map((article, index) => (
          <motion.div
            key={article.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link
              to={`/blog/${article.slug}`}
              className="group flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-medium text-primary/80">
                    {article.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {article.readTime}
                  </span>
                  {isPremiumSlug(article.slug) && (
                    <span className="text-xs font-medium text-amber-500 inline-flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Premium
                    </span>
                  )}
                  {isAdmin && metaMap[article.slug] && !metaMap[article.slug].published && (
                    <span className="text-xs font-medium text-muted-foreground">Draft</span>
                  )}
                </div>
                <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-4" />
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};
