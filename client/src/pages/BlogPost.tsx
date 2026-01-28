import { useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag, Share2, BookOpen } from "lucide-react";
import RichTextRenderer from "../components/RichTextRenderer";
import Comments from "../components/Comments";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GlassCard } from "@/components/layout/GlassCard";
import { AnimatedSection } from "@/components/layout/AnimatedPage";
import { ReadingProgress, ScrollToTopButton, useReadingTime } from "@/components/blog/ReadingProgress";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { type Post } from "@db/schema";
import { format } from "date-fns";

export default function BlogPost() {
  const [location, setLocation] = useLocation();
  const slug = location.split("/").pop();
  const articleRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ["post", slug],
    queryFn: () => fetch(`/api/posts/${slug}`).then((res) => res.json()),
  });

  // Extract plain text for reading time calculation
  const plainText = useMemo(() => {
    if (!post?.content) return "";
    try {
      if (typeof post.content === "object" && post.content !== null && "content" in post.content) {
        const extractText = (node: unknown): string => {
          if (!node || typeof node !== "object") return "";
          const n = node as { type?: string; text?: string; content?: unknown[] };
          if (n.type === "text" && n.text) return n.text;
          if (Array.isArray(n.content)) {
            return n.content.map(extractText).join(" ");
          }
          return "";
        };
        return extractText(post.content);
      }
      return String(post.content);
    } catch {
      return "";
    }
  }, [post?.content]);

  const readingTime = useReadingTime(plainText);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post?.title,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        <GlassCard className="p-8">
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </GlassCard>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <motion.div
        className="max-w-4xl mx-auto text-center py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 glass border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <ReadingProgress targetRef={articleRef} />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 hover:bg-muted/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Article Header */}
        <AnimatedSection className="space-y-6">
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(post.createdAt), "MMMM dd, yyyy")}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {readingTime} min read
            </span>
          </div>

          {/* Title */}
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {post.title}
          </motion.h1>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-muted/50">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </motion.div>
          )}

          {/* Share Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="glass"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </motion.div>
        </AnimatedSection>

        {/* Article Content */}
        <motion.article
          ref={articleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard variant="elevated" className="p-8 md:p-12">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:gradient-text prose-a:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
              <RichTextRenderer content={post.content} />
            </div>
          </GlassCard>
        </motion.article>

        {/* Comments Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard variant="default" className="p-8">
            <h2 className="text-2xl font-bold mb-6">Comments</h2>
            <Comments postId={post.id} />
          </GlassCard>
        </motion.section>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </>
  );
}
