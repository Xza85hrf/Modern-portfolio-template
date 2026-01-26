import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Download, Mail, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/layout/GlassCard";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/layout/AnimatedPage";
import { SkillsVisualization } from "@/components/about/SkillsVisualization";
import { JourneyTimeline } from "@/components/about/JourneyTimeline";
import { StatsCounter } from "@/components/about/StatsCounter";
import { type Skill } from "@db/schema";
import { Link } from "wouter";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export default function About() {
  const prefersReducedMotion = useReducedMotion();

  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["skills"],
    queryFn: () => fetch("/api/skills").then((res) => res.json()),
  });

  return (
    <div className="relative min-h-screen">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="space-y-24">
        {/* Hero Section */}
        <AnimatedSection className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <motion.span
                className="inline-block px-4 py-1.5 rounded-full glass text-sm font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                About Me
              </motion.span>

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Hello, I'm a{" "}
                <span className="gradient-text">Full-Stack Developer</span>
              </motion.h1>

              <motion.p
                className="text-lg text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                I'm passionate about creating beautiful, functional, and
                user-friendly web applications. With expertise in modern
                technologies like React, Node.js, and PostgreSQL, I bring ideas
                to life through clean code and thoughtful design.
              </motion.p>

              {/* Quick info */}
              <motion.div
                className="flex flex-wrap gap-4 text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  Remote / Worldwide
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4 text-primary" />
                  Available for work
                </span>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                >
                  <Button asChild className="gap-2">
                    <a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4" />
                      Download Resume
                    </a>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                >
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 glass border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                  >
                    <Mail className="h-4 w-4" />
                    Get in Touch
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Profile Image/Decoration */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="relative w-80 h-80 mx-auto">
                {/* Decorative rings */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/20"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : { rotate: 360 }
                  }
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-4 rounded-full border-2 border-accent/20 border-dashed"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : { rotate: -360 }
                  }
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-8 rounded-full border-2 border-secondary/20"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : { rotate: 360 }
                  }
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />

                {/* Center content */}
                <div className="absolute inset-16 rounded-full bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-primary" />
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute top-0 right-8 w-4 h-4 rounded-full bg-primary"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : { y: [-10, 10, -10] }
                  }
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute bottom-8 left-0 w-3 h-3 rounded-full bg-accent"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : { y: [10, -10, 10] }
                  }
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-secondary"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : { x: [-5, 5, -5] }
                  }
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Stats Section */}
        <AnimatedSection>
          <StatsCounter />
        </AnimatedSection>

        {/* Skills Section */}
        <AnimatedSection className="space-y-8">
          <div className="text-center space-y-4">
            <motion.span
              className="inline-block px-4 py-1.5 rounded-full glass text-sm font-medium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Expertise
            </motion.span>
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Skills & <span className="gradient-text">Technologies</span>
            </motion.h2>
            <motion.p
              className="text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              A comprehensive overview of my technical skills and proficiency
              levels across various technologies.
            </motion.p>
          </div>

          <GlassCard variant="elevated" hover={false} className="p-6 md:p-8">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
                    <div className="w-16 h-4 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : skills && skills.length > 0 ? (
              <SkillsVisualization skills={skills} />
            ) : (
              <p className="text-center text-muted-foreground py-12">
                No skills data available.
              </p>
            )}
          </GlassCard>
        </AnimatedSection>

        {/* Journey Timeline Section */}
        <AnimatedSection className="space-y-8">
          <div className="text-center space-y-4">
            <motion.span
              className="inline-block px-4 py-1.5 rounded-full glass text-sm font-medium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Experience
            </motion.span>
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              My <span className="gradient-text">Journey</span>
            </motion.h2>
            <motion.p
              className="text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              A timeline of my professional experience, education, and key
              milestones.
            </motion.p>
          </div>

          <JourneyTimeline />
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection>
          <GlassCard
            variant="gradient"
            hover={false}
            className="relative overflow-hidden p-8 md:p-12 text-center"
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold">
                Interested in working together?
              </h3>
              <p className="text-muted-foreground max-w-lg mx-auto">
                I'm always open to discussing new projects, creative ideas, or
                opportunities to be part of your vision.
              </p>
              <motion.div
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                className="inline-block"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-11 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Mail className="h-4 w-4" />
                  Let's Connect
                </Link>
              </motion.div>
            </div>
          </GlassCard>
        </AnimatedSection>
      </div>
    </div>
  );
}
