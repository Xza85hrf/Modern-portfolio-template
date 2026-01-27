import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/layout/GlassCard";
import { type Post } from "@db/schema";
import { format } from "date-fns";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface FeaturedPostProps {
  post: Post;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  const prefersReducedMotion = useReducedMotion();

  // Extract plain text preview from content
  const getPreview = (content: unknown): string => {
    if (!content) return "";
    try {
      // If content is TipTap JSON, extract text
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
        return extractText(content).slice(0, 200);
      }
      return String(content).slice(0, 200);
    } catch {
      return "";
    }
  };

  const preview = getPreview(post.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <GlassCard
          variant="gradient"
          hover
          className="relative overflow-hidden group cursor-pointer"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Image/Decoration Section */}
            <div className="relative h-64 md:h-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30">
                {/* Decorative elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-[200px] font-bold text-primary/10 select-none"
                    animate={
                      prefersReducedMotion
                        ? {}
                        : { scale: [1, 1.05, 1] }
                    }
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {post.title.charAt(0)}
                  </motion.div>
                </div>
                {/* Floating shapes */}
                <motion.div
                  className="absolute top-8 right-8 w-20 h-20 rounded-full bg-primary/20 blur-xl"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : { y: [-10, 10, -10], x: [-5, 5, -5] }
                  }
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute bottom-8 left-8 w-16 h-16 rounded-full bg-accent/20 blur-xl"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : { y: [10, -10, 10] }
                  }
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              {/* Featured badge */}
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-primary-foreground">
                  Featured
                </Badge>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 md:py-8 md:pr-8 flex flex-col justify-center">
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(post.createdAt), "MMMM dd, yyyy")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  5 min read
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                {post.title}
              </h2>

              {/* Preview */}
              <p className="text-muted-foreground mb-6 line-clamp-3">
                {preview}...
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-muted/50">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* CTA - styled as button but not interactive (parent link handles click) */}
              <div>
                <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors group/btn">
                  Read Article
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}

export default FeaturedPost;
