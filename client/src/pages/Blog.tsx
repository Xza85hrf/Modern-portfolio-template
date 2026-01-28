import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Tag, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GlassCard } from "@/components/layout/GlassCard";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/layout/AnimatedPage";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { TiltCard } from "@/components/3d/TiltCard";
import { type Post } from "@db/schema";
import { format } from "date-fns";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export default function Blog() {
  const prefersReducedMotion = useReducedMotion();

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: () => fetch("/api/posts").then((res) => res.json()),
  });

  // Separate featured (first) post from others
  const { featuredPost, otherPosts } = useMemo(() => {
    if (!posts || posts.length === 0) {
      return { featuredPost: null, otherPosts: [] };
    }
    return {
      featuredPost: posts[0],
      otherPosts: posts.slice(1),
    };
  }, [posts]);

  // Extract plain text preview from content
  const getPreview = (content: unknown): string => {
    if (!content) return "";
    try {
      if (typeof content === "object" && content !== null && "content" in content) {
        const extractText = (node: unknown): string => {
          if (!node || typeof node !== "object") return "";
          const n = node as { type?: string; text?: string; content?: unknown[] };
          if (n.type === "text" && n.text) return n.text;
          if (Array.isArray(n.content)) {
            return n.content.map(extractText).join(" ");
          }
          return "";
        };
        return extractText(content).slice(0, 150);
      }
      return String(content).slice(0, 150);
    } catch {
      return "";
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="space-y-16">
        {/* Header */}
        <AnimatedSection className="space-y-4">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full glass text-sm font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Blog
          </motion.span>
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Thoughts & <span className="gradient-text">Insights</span>
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Sharing my experiences, tutorials, and insights about web development,
            technology, and more.
          </motion.p>
        </AnimatedSection>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-8">
            {/* Featured skeleton */}
            <div className="grid md:grid-cols-2 gap-6 p-6 rounded-xl border border-border/50 bg-card/30">
              <Skeleton className="h-64 rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>

            {/* Other posts skeletons */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4 p-6 rounded-xl border border-border/50 bg-card/30">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        ) : !posts || posts.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
            <p className="text-muted-foreground">
              Check back soon for new articles and insights.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <section>
                <FeaturedPost post={featuredPost} />
              </section>
            )}

            {/* Other Posts Grid */}
            {otherPosts.length > 0 && (
              <section className="space-y-8">
                <motion.h2
                  className="text-2xl font-bold"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  More Articles
                </motion.h2>

                <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherPosts.map((post) => (
                    <StaggerItem key={post.id}>
                      <TiltCard tiltAmount={6} className="h-full">
                        <Link href={`/blog/${post.slug}`}>
                          <GlassCard
                            variant="elevated"
                            hover={false}
                            className="h-full p-6 group cursor-pointer"
                          >
                            {/* Meta */}
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(post.createdAt), "MMM dd, yyyy")}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                4 min
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </h3>

                            {/* Preview */}
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                              {getPreview(post.content)}...
                            </p>

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-4">
                                {post.tags.slice(0, 2).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs bg-muted/50"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Read more link */}
                            <div className="flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
                              Read more
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </GlassCard>
                        </Link>
                      </TiltCard>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
